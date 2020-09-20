import React from 'react';

export default function PokerBoardComponent(props) {
	const {pointOptions, currentlyVoting, players} = props.board;

	function changeCurrentlyVoting(e) {
		props.changeCurrentlyVoting(e.target.value);
	}

	const showVotes = props.board.showVotes();

	return <div>
		<h3>Currently Voting</h3>
		<textarea value={currentlyVoting} onChange={changeCurrentlyVoting}/>
		<div>
			<button onClick={props.clearVotes}>Clear Votes</button>
			<button onClick={props.showVotes}>Show Votes</button>
		</div>
		<h4>Vote:</h4>
		<div className="voteOptions">
			{
				pointOptions.map(it => (
						<button key={it} onClick={() => props.vote(it)}>{it}</button>
				))
			}
		</div>
		<h3>Players</h3>
		{
			players.map(player => (
				<p key={player.id}>Player id: {player.id}, joining: {""+player.joining}, name: {player.name},
					vote: {showVotes ? player.vote : "..."}</p>
			))
		}
	</div>
}