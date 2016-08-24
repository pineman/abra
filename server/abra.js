const config = require('./config/config.js');
var io;
var app;

if (process.argv[2] !== "server") {
	// HTTP server
	var path = require('path');

	var PORT = process.argv[2] || 80;

	app = require('http').createServer(handler);
	const fs = require('fs');

	app.listen(PORT);

	function handler(req, res) {
		fs.readFile(getFileName(req.url), function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + getFileName(req.url));
			}
			res.writeHead(200);
			res.end(data);
		});
	}

	function getFileName(url) {
		var filename = (url === "/") ? "index.html" : url;
		return path.join(__dirname, "..", "client", filename);
	}
} else {
	app = config.SOCKET_PORT;
}

/* ------------------------------------------------------------ */
// socket.io
io = require('socket.io')(app);
// io.serveClient(true);
const texts = require('./texts.js');
const namegen = require('./namegen');


var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id; // the player's socket.id
	this.pos = 0; // index in the text string
	this.time = 0; // time spent writing
	this.errors = 0;
	this.done = false;
}

var Room = function (id) {
	this.id = id;
	this.name = namegen.wordFor(id);
	this.players = [];
	this.numFinished = 0;
	this.timeLeft = config.ROOM_TIMEOUT;
	this.timer = undefined;
	this.status = "open"; // open, closed
}

var rooms = [];

// Algorithm to find an open room
function findRoom() {
	for (var i = 0; i < rooms.length; i++) {
		if (rooms[i].status === "open")
			return rooms[i];
	};

	// No open room was found (undefined)
	return;
}

function destroyRoom(room) {
	rooms.splice(rooms.indexOf(room), 1);
}

// Algorithm to remove a socket from a room
function leaveRoom(socket) {
	// Find the player's index in socket.room.players so that we can remove it
	var playerIndex = socket.room.players.findIndex(p => p.id === socket.id)
	socket.room.players.splice(playerIndex, 1);

	// If the room gets empty, remove it
	if (socket.room.players.length === 0) {
		// Find the room's index in rooms so that we can remove it
		var roomIndex = rooms.findIndex(r => r.id === socket.room.id);
		rooms.splice(roomIndex, 1);
	}

	if (socket.player.done) {
		socket.room.numFinished--;
	}
}

// Select a random text
function getText() {
	var rand = Math.floor(Math.random() * texts.length);
	return texts[rand];
}

function countGameStart(room) {
	room.timeLeft--;
	if (!room.timeLeft) {
		room.status = "closed";
		emitGameStart(room);
	}
}

// Emit gamestart to all players in a room
function emitGameStart(room) {
	var text = getText();
	io.to(room.id).emit("gamestart", text);
}

// Emit end and generate stats
function endGame(socket) {
	var stats = [];
	for (var i = 0; i < socket.room.players.length; i++) {
		stats[i] = {
			time: socket.room.players[i].time,
			errors: socket.room.players[i].errors,
			name: socket.room.players[i].name,
			color: socket.room.players[i].color
		};
	}

	io.to(socket.room.id).emit("end", {
		stats: stats
	});

	// Destroy room
	// TODO: what about rematch?
	destroyRoom(socket.room);
}

io.on("connection", function (socket) {
	/* All events other than "newplayer" depend on
	 * some attribute we save in the socket itself.
	 * If the socket did not go through "newplayer",
	 * it won't have those attributes (player, room),
	 * therefore the event handlers will fail without
	 * crashing the server (node doesn't segfault...) */

	// Register new player
	socket.on("newplayer", function (data) {
		// Name is escaped by textContent on the client side,
		// however, still testing for max length.
		if (data.name.length > 30) return; // max is 15 client-side

		// Silently drop clients messing around with color
		if (!data.color.startsWith("#") || data.color.length > 7) return;

		var newPlayer = new Player(data.name, data.color, socket.id);

		// Save this client's player
		socket.player = newPlayer;
	});

	// Find a room for a socket
	socket.on("findroom", function () {
		var room = findRoom();

		if (room) {
			socket.join(room.id);
			// Inform the players in the room that a new player
			// has entered the room.
			socket.broadcast.to(room.id).emit("playerentered", socket.player);
		} else {
			// No open room was found, create a new room whose
			// id is the first player's socket.id.
			// NOTE: socket.io already does this by default
			// http://socket.io/docs/rooms-and-namespaces/
			room = new Room(socket.id);
			rooms.push(room);
			// Start the game in ROOM_TIMEOUT miliseconds
			// regardless of how many players are waiting
			room.timer = setInterval(countGameStart, 1000, room);
		}

		// Close the room asap
		if (room.players.length === (config.MAX_PER_ROOM - 1)) {
			room.status = "closed";
		}

		// No need to inform the player of itself,
		// emit the player's new room before append
		socket.emit("foundroom", {
			name: room.name,
			players: room.players,
			timeLeft: room.timeLeft
		});
		room.players.push(socket.player);

		// Save the client's room.
		socket.room = room;

		// Start the game if the room has enough players
		if (room.players.length === config.MAX_PER_ROOM) {
			clearTimeout(room.timer);
			emitGameStart(room);
		}
	});

	socket.on("typed", function (data) {
		var dataToSend = {id: socket.id, pos: data.pos};
		socket.broadcast.to(socket.room.id).emit("typed", dataToSend);
	});

	socket.on("finish", function (data) {
		socket.player.time = data.time;
		socket.player.errors = data.errors;
		socket.player.done = true;
		socket.room.numFinished++;

		if (socket.room.numFinished === socket.room.players.length) {
			endGame(socket);
		}
	});

	socket.on("disconnect", function() {
		// Guard against reconnections, sockets without rooms, etc.
		if (!socket.room) return;

		socket.broadcast.to(socket.room.id).emit("disconnected", {
			id: socket.id
		});

		leaveRoom(socket);

		if (socket.room.numFinished === socket.room.players.length) {
			endGame(socket);
		}
	})
});
