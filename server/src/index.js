const http = require('http');
const WebSocket = require('ws');
const PokerBoard = require('pointingpoker-common').default;
const express = require('express');
const path = require("path");

const port = 8080;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server, path: '/ws'});
const delay = 0;

app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

let nextClientId = 1;

let board = new PokerBoard();

function sendToAll(obj) {
	const actionSerialized = JSON.stringify(obj);
	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			setTimeout(() => client.send(actionSerialized), delay);
		}
	});
}

function processAction(action) {
	board = board.processAction(action);
	sendToAll(action);
}

wss.on('connection', ws => {
	function send(obj) {
		setTimeout(() => ws.send(JSON.stringify(obj)), delay);
	}

	const myClientId = nextClientId++;

	console.log(`ws connected: client ${myClientId}`);

	send({
		clientId: myClientId,
		snapshot: board.snapshot
	});
	processAction({id: myClientId, action: PokerBoard.ACTION_JOIN});

	ws.on('message', m => {
		console.log(`received: ${m}`);
		const parsed = JSON.parse(m);
		if (typeof parsed === 'object') {
			send({
				ack: parsed.seq
			});

			parsed.id = myClientId; //not strictly needed but this is a "security" measure
			delete parsed.seq;

			processAction(parsed);
		}
	});

	ws.on('ping', () => {
		console.log('received a ping!');
	});

	ws.on('pong', () => {
		console.log('received a pong!');
	});

	ws.on('close', () => {
		console.log(`ws closed; client ${myClientId} departing`);
		processAction({
			id: myClientId,
			action: PokerBoard.ACTION_DEPART
		});
	});
});

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
});