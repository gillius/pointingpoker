import {produce, immerable} from 'immer'

const pointOptions = [
	0, 0.5, 1, 2, 3, 5, 8, 13, 20, "?"
];

const actions = {
	snapshot: produce((draft, action) => {
		draft.currentlyVoting = action.currentlyVoting;
		draft.players = action.players;
	}),

	join: produce((draft, action) => {
		draft.players.push({
			id: action.id,
			joining: true,
			name: null,
			vote: null,
		})
	}),

	completeJoin: produce((draft, action) => {
		const player = draft.players.find(it => it.id === action.id)
		if (player) {
			player.name = action.name
			player.joining = false
		}
	}),

	depart: produce((draft, action) => {
		const playerIdx = draft.players.findIndex(it => it.id === action.id)
		if (playerIdx >= 0) {
			draft.players.splice(playerIdx, 1)
		}
	}),

	vote: produce((draft, action) => {
		const player = draft.players.find(it => it.id === action.id)
		if (player)
			player.vote = action.vote
	}),

	currentlyVoting: produce((draft, action) => {
		draft.currentlyVoting = action.currentlyVoting;
	}),

	showVotes: produce((draft) => {
		draft.forceShowVotes = true;
	}),

	clearVotes: produce((draft) => {
		draft.currentlyVoting = '';
		draft.forceShowVotes = false;
		draft.players.forEach(it => it.vote = null);
	})
}

export default class PokerBoard {
	[immerable] = true

	currentlyVoting = "";
	forceShowVotes = false;
	players = [];

	get pointOptions() { return pointOptions }

	get snapshot() {
		return {
			action: PokerBoard.ACTION_SNAPSHOT,
			currentlyVoting: this.currentlyVoting,
			players: this.players,
		}
	}

	static get ACTION_SNAPSHOT() { return "snapshot" }
	static get ACTION_JOIN() { return "join" }
	static get ACTION_COMPLETE_JOIN() { return "completeJoin" }
	static get ACTION_DEPART() { return "depart" }
	static get ACTION_VOTE() { return "vote" }
	static get ACTION_CURRENTLY_VOTING() { return "currentlyVoting" }
	static get ACTION_SHOW_VOTES() { return "showVotes" }
	static get ACTION_CLEAR_VOTES() { return "clearVotes" }

	getPlayer(playerId) {
		return this.players.find(it => it.id === playerId);
	}

	/**
	 * Returns true if we should be showing the votes.
	 *
	 * @returns {boolean}
	 */
	get showVotes() {
		return this.forceShowVotes || this.players.every(it => it.joining || (it.vote !== undefined && it.vote !== null))
	}

	/**
	 * Returns an array of valid votes, or empty array if none.
	 *
	 * @returns {number[]}
	 */
	get validVotes() {
		return this.players
				.filter(it => typeof it.vote === 'number')
				.map(it => it.vote);
	}

	/**
	 * Returns the average vote value, or 0 if there are no votes.
	 *
	 * @returns {number}
	 */
	get averageVote() {
		const allVotes = this.validVotes;

		if (allVotes.length === 0) return 0;

		const sumVotes = allVotes.reduce((a,b) => a+b);
		return sumVotes / allVotes.length;
	}

	/**
	 * Returns an array of objects {vote, count} sorted by vote.
	 *
	 * @returns {{vote: number, count: number}[]}
	 */
	get voteCounts() {
		const allVotes = this.validVotes;

		const map = new Map();
		for (const vote of allVotes) {
			map.set(vote, (map.get(vote) || 0) + 1);
		}

		const ret = [];
		for (const entry of map) {
			ret.push({vote: entry[0], count: entry[1]});
		}

		ret.sort((a, b) => a.vote - b.vote);

		return ret;
	}

	processAction(action) {
		if (!action || !action.action)
			throw new Error('action is undefined');

		const producer = actions[action.action];
		if (!producer)
			throw new Error(`unknown action ${action.action}`)

		return producer(this, action);
	}
}