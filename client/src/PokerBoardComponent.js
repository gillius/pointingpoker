import React from 'react';

export default function PokerBoardComponent(props) {
	const {pointOptions, currentlyVoting, activePlayers, observers} = props.board;

	function changeCurrentlyVoting(e) {
		props.changeCurrentlyVoting(e.target.value);
	}

	const showVotes = props.board.showVotes;

	const results = showVotes && {
		average: props.board.averageVote,
		voteCounts: props.board.voteCounts
	}

	return <div>
		<h3>Currently Voting</h3>
		<form action="#" className="mb-2">
			<div className="form-group">
				<textarea className="form-control" value={currentlyVoting} onChange={changeCurrentlyVoting}/>
			</div>
			<button type="button" className="btn btn-primary mr-2" onClick={props.clearVotes}>Clear Votes</button>
			<button type="button" className="btn btn-primary" onClick={props.showVotes}>Show Votes</button>
		</form>
		{
			props.vote &&
			<>
				<h4>Vote:</h4>
				<div className="voteOptions mb-3">
					{
						pointOptions.map(it => (
								<button className={"btn btn-primary mr-2" + (it === props.myPlayer.vote ? " active" : "")}
								        key={it}
								        onClick={() => props.vote(it)}>{it}</button>
						))
					}
				</div>
			</>
		}
		<div className="row">
			<div className="col">
				<h3>Players</h3>
				<table className="table table-responsive">
					<thead>
					<tr>
						<th>Name</th>
						<th>Vote</th>
					</tr>
					</thead>
					<tbody>
					{
						activePlayers.map(player => (
								<tr key={player.id}>
									<td>{player.joining ? 'Incoming player...' : player.name}</td>
									<td>{showVotes || player === props.myPlayer ? player.vote :
											(player.vote !== null ? "..." : "")}</td>
								</tr>
						))
					}
					</tbody>
				</table>
				{
					!!observers.length &&
					<>
						<h3>Observers</h3>
						<p>{observers.map(it => it.name).join(', ')}</p>
					</>
				}
			</div>
			<div className="col">
				{
					results &&
					<>
						<h3>Results</h3>
						<p>Average: {results.average}</p>
						<table className="table table-responsive">
							<thead>
							<tr>
								<th>Vote</th>
								<th>Count</th>
							</tr>
							</thead>
							<tbody>
							{
								results.voteCounts.map(it => (
										<tr key={it.vote}>
											<td>{it.vote}</td>
											<td>{it.count}</td>
										</tr>
								))
							}
							</tbody>
						</table>
					</>
				}
			</div>
		</div>
	</div>
}