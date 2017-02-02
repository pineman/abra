'use strict';

const abra = require('./abra.js');

const PORT = 2272;
const WS_PATH = '/abra';

const WebSocketServer = require('uws').Server;
let WSSOptions = {
	path: WS_PATH,
	nativeHttp: true
};

if (process.argv[2] !== 'deploy') {
	// Run the testing HTTP server.
	const server = require('./http_server.js');
	server.listen(PORT);
	console.log(`HTTP server listening on http://127.0.0.1:${PORT}`);

	WSSOptions.server = server;
} else {
	// Run only the WebSocket Server.
	WSSOptions.port = PORT;
}

const wss = new WebSocketServer(WSSOptions);
console.log(`WebSocket server listening on ws://127.0.0.1:${PORT}${WS_PATH}`);

// Server 'error' event listener.
wss.on('error', console.log);

// Server 'connection' event listener.
wss.on('connection', (ws) => {
	// Client 'error' event listener.
	ws.on('error', console.log);

	// Client 'close' event listener.
	ws.on('close', wsClose);

	// Client 'message' event listener.
	ws.on('message', wsMessage);
});

// In these ws event listeners, 'this' is the websocket itself.
function wsClose(code, reason) {
	abra.playerDisconnected(this);
}

function wsMessage(data) {
	try {
		data = JSON.parse(data);
	}
	catch (e) {
		// Ignore badly formatted data.
		return;
	}

	switch (data.event) {
		case 'newPlayer':
			abra.newPlayer(this, data);
			break;

		case 'playerTyped':
			abra.playerTyped(this, data);
			break;

		case 'playerDone':
			abra.playerDone(this, data);
			break;

		default:
			// Ignore unknown event.
			return;
			break;
	}
}
