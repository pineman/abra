'use strict';

const cluster = require('cluster');

const abra = require('./abra.js');

const PORT = 2272;
const WS_PATH = '/abra';

const WebSocketServer = require('ws').Server;
let WSSOptions = {
	path: WS_PATH,
	nativeHttp: true,
	maxPayload: 1e6
};

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

	let e = data.event;

	if (e === 'playerTyped'
		&& data.pos !== undefined)
	{
		abra.playerTyped(this, data);
	}
	else if (!this.room
		&& e === 'newPlayer'
		&& data.name !== undefined
		&& data.color !== undefined)
	{
		abra.newPlayer(this, data);
	}
	else if (this.room
		&& e === 'forceStart')
	{
		abra.forceStart(this);
	}
	else if (e === 'playerDone'
		&& data.time !== undefined
		&& data.mistakes !== undefined)
	{
		abra.playerDone(this, data);
	}
}

function manageServerEvents(wss) {
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
}


let workers = [];
function setupWorkerProcesses() {
    // to read number of cores on system
    let numCores = require('os').cpus().length;
    console.log(`Master cluster setting up ${numCores} workers`);

    for (let i = 0; i < numCores; i++) {
        workers.push(cluster.fork());
        workers[i].on('message', () => console.log(`Worker ${i} got msg: ${message}`));
    }

    cluster.on('online', function(worker) {
        console.log(`Worker ${worker.process.pid} is up`);
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log(`Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`);
        console.log('Starting a new worker');
        cluster.fork();
        workers.push(cluster.fork());
        workers[workers.length-1].on('message', function(message) {
            console.log(message);
        });
    });
};

function main() {
	if (process.argv[2] !== 'deploy') {
		// Run the testing HTTP server.
		const server = require('./http_server.js');
		server.listen(PORT);
		console.log(`Development HTTP server listening on http://127.0.0.1:${PORT}`);
		WSSOptions.server = server;
	} else {
		// Run only the WebSocket Server.
		WSSOptions.port = PORT;
	}

	if (cluster.isMaster) {
		setupWorkerProcesses();
	} else {
		// Start the WebSocket server.
		const wss = new WebSocketServer(WSSOptions);
		console.log(`WebSocket server listening on ws://127.0.0.1:${PORT}${WS_PATH}`);
		manageServerEvents(wss);
	}
}
main();
