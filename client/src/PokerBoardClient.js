import {decorate, observable} from "mobx"
import PokerBoard from "pointingpoker-common";

/**
 * Provides a client to the poker board backend.
 */
export default class PokerBoardClient {
	nextSeq = 1;

	clientId = null;
	board = new PokerBoard();
	serverBoard = this.board;
	messages = [];
	disconnected = false;
	pendingActions = [];

	/**
	 * Constructs a new poker board client.
	 *
	 * @param {string=} url
	 *   if provided, the websocket URL to connect with. If not provided, forms a URL based on window.location
	 *   assuming the websocket is hosted at relative URL "ws", but with ws (if http) and wss (if https) protocol.
	 *   In the development environment we assume port 8080, else we use port from window.location (if any)
	 */
	constructor(url) {
		if (!url) {
			const parsedUrl = new URL(window.location);
			parsedUrl.protocol = parsedUrl.protocol === 'http:' ? 'ws' : 'wss';
			if (process.env.NODE_ENV === 'development')
				parsedUrl.port = "8080";
			url = new URL('/ws', parsedUrl).href;
		}
		this.ws = new WebSocket(url);

		this.ws.addEventListener('open', () => {
			this.messages.push("Connection opened");
		});

		this.ws.addEventListener('message', m => {
			this.messages.push(m.data);
			const message = JSON.parse(m.data);

			if (message.ack !== undefined) {
				//Remove all acknowledged actions
				this.pendingActions = this.pendingActions.filter(it => it.seq > message.ack);

			} else if (!this.clientId && message.clientId) { //initial message
				this.clientId = message.clientId;
				this.updateBoardFromServer(message.snapshot);

			} else {
				this.updateBoardFromServer(message);
			}
		});

		this.ws.addEventListener('close', () => {
			this.messages.push("Connection closed");
			this.disconnected = true;
		});
	}

	close() {
		this.ws.close();
	}

	/**
	 * Sends an action to the server, tagging the client ID and sequence to the message.
	 */
	sendAction(msg) {
		//We should improve this experience at some point...
		if (this.clientId === null)
			throw new Error("Not yet connected");

		const action = {
			...msg,
			id: this.clientId,
			seq: this.nextSeq++,
		};
		this.pendingActions.push(action);
		this.board = this.board.processAction(action);
		this.ws.send(JSON.stringify(action));
	}

	updateBoardFromServer(action) {
		this.serverBoard = this.serverBoard.processAction(action);

		//rebuild our local board with any pending actions since server's state
		let board = this.serverBoard;
		this.pendingActions.forEach(a => {
			board = board.processAction(a);
		});

		this.board = board;
	}
}

decorate(PokerBoardClient, {
	clientId: observable,
	board: observable.ref,
	serverBoard: observable.ref,
	messages: observable,
	disconnected: observable,
	pendingActions: observable.shallow
});
