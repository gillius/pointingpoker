import React from 'react';
import PokerBoardComponent from "./PokerBoardComponent";
import PokerBoard from "pointingpoker-common";
import NameEntryComponent from "./NameEntryComponent";
import DebuggingComponent from "./DebuggingComponent";
import PokerBoardClient from "./PokerBoardClient";
import {autorun} from "mobx";

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      messages: [],
      pendingActions: [],
      board: new PokerBoard(),
      serverBoard: new PokerBoard(),
      clientId: null,
      disconnected: false,
    };
  }

  componentDidMount() {
    this.client = new PokerBoardClient('ws://localhost:8080/ws');

    autorun(() => {
      this.setState({
        messages: this.client.messages,
        pendingActions: this.client.pendingActions,
        board: this.client.board,
        serverBoard: this.client.serverBoard,
        clientId: this.client.clientId,
        disconnected: this.client.disconnected
      })
    });
  }

  vote = (points) => {
    this.client.sendAction({
      action: PokerBoard.ACTION_VOTE,
      vote: points
    });
  }

  changeCurrentlyVoting = (currentlyVoting) => {
    this.client.sendAction({
      action: PokerBoard.ACTION_CURRENTLY_VOTING,
      currentlyVoting
    });
  }

  clearVotes = () =>
    this.client.sendAction({action: PokerBoard.ACTION_CLEAR_VOTES});

  showVotes = () =>
    this.client.sendAction({action: PokerBoard.ACTION_SHOW_VOTES});

  componentWillUnmount() {
    this.client && this.client.close();
  }

  completeJoin = name => {
    this.client.sendAction({
      action: PokerBoard.ACTION_COMPLETE_JOIN,
      name
    });
    window.localStorage.setItem('name', name);
  }

  render() {
    const myself = this.state.board.getPlayer(this.state.clientId);

    return (
        <div>
          {
            !this.state.disconnected && myself && myself.joining &&
            <NameEntryComponent onSubmit={this.completeJoin}
                                defaultValue={window.localStorage.getItem('name') || 'Player'}/>
          }
          {
            !this.state.disconnected && myself && !myself.joining &&
            <div>
              <h3>{myself.name}</h3>
              <PokerBoardComponent board={this.state.board}
                                   vote={this.vote}
                                   changeCurrentlyVoting={this.changeCurrentlyVoting}
                                   clearVotes={this.clearVotes}
                                   showVotes={this.showVotes}
              />
            </div>
          }
          {
            this.state.disconnected &&
            <div>
              <h3>Disconnected from Server. Please Reload the page.</h3>
            </div>
          }
          <DebuggingComponent pendingActions={this.state.pendingActions}
                              messages={this.state.messages}/>
        </div>
    );
  }
}
