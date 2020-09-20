import React from 'react';
import PokerBoardComponent from "./PokerBoardComponent";
import PokerBoard from "pointingpoker-common";
import NameEntryComponent from "./NameEntryComponent";
import DebuggingComponent from "./DebuggingComponent";

class App extends React.Component {
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
    this.ws = new WebSocket('ws://localhost:8080/ws');

    this.ws.addEventListener('open', () => {
      this.addMessage("Connection opened");
    });

    this.clientId = null;
    this.nextSeq = 1;

    this.ws.addEventListener('message', m => {
      this.addMessage(m.data);
      const message = JSON.parse(m.data);

      if (message.ack !== undefined) {
        //Remove all acknowledged actions
        this.setState(state => ({
          pendingActions: state.pendingActions.filter(it => it.seq > message.ack)
        }))

      } else if (!this.clientId && message.clientId) { //initial message
        this.clientId = message.clientId;
        this.setState({clientId: this.clientId});
        this.updateBoardFromServer(message.snapshot);

      } else {
        this.updateBoardFromServer(message);
      }
    });

    this.ws.addEventListener('close', () => {
      this.addMessage("Connection closed");
      this.setState({disconnected: true});
    });
  }

  updateBoardFromServer(action) {
    this.setState(state => {
      const serverBoard = state.serverBoard.processAction(action);

      //rebuild our local board with any pending actions since server's state
      let board = serverBoard;
      state.pendingActions.forEach(a => {
        board = board.processAction(a);
      });

      return {
        serverBoard,
        board
      }
    });
  }

  sendAction(msg) {
    const action = {
      ...msg,
      id: this.clientId,
      seq: this.nextSeq++,
    };
    this.setState(state => ({
      pendingActions: state.pendingActions.concat([action]),
      board: state.board.processAction(action)
    }));
    this.ws.send(JSON.stringify(action));
  }

  vote = (points) => {
    this.sendAction({
      action: PokerBoard.ACTION_VOTE,
      vote: points
    });
  }

  changeCurrentlyVoting = (currentlyVoting) => {
    this.sendAction({
      action: PokerBoard.ACTION_CURRENTLY_VOTING,
      currentlyVoting
    })
  }

  clearVotes = () =>
    this.sendAction({action: PokerBoard.ACTION_CLEAR_VOTES});

  showVotes = () =>
    this.sendAction({action: PokerBoard.ACTION_SHOW_VOTES});

  componentWillUnmount() {
    this.ws && this.ws.close();
  }

  addMessage = (m) => {
    this.setState(state => ({
      messages: state.messages.concat(m).slice(-50)
    }));
  }

  completeJoin = name => {
    this.sendAction({
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

export default App;
