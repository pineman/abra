const config = require('./config/config.js');
var io;
var app;

if (process.argv[2] !== "server") {
	// HTTP server
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

	// |-|4xX0rzZ
	var base = __dirname.split("/").slice(0, -1).join("/") + "/client";
	function getFileName(url) {
		return base + (url === "/" ? "/index.html" : url);
	}
} else {
	app = config.SOCKET_PORT;
}

// socket.io
io = require('socket.io')(app);
// io.serveClient(true);

/* ------------------------------------------------------------ */
const texts = require('./texts.js');
const namegen = require('./namegen');


var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id; // the player's socket.id
	this.pos = 0; // index in the text string
	this.time = 0; // time spent writing
	this.errors = 0;
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

// Select a random text
function getText() {
	var rand = Math.floor(Math.random() * texts.length);
	return texts[rand];
}

// Emit gamestart to all players in a room
function emitGameStart(room) {
	var text = getText();
	io.to(room.id).emit("gamestart", text);
}

function countGameStart(room) {
	room.timeLeft--;
	if (!room.timeLeft) {
		room.status = "closed";
		emitGameStart(room);
	}
}

io.on("connection", function (socket) {
	// TODO: Don't forget to sanitize all incoming data!
	// TODO: Other security concerns

	// New player, find him a room
	socket.on("newplayer", function (data) {
		var newPlayer = new Player(data.name, data.color, socket.id);
		var room = findRoom();

		if (room) {
			// Close the room as soon as possible.
			if (room.players.length === config.MAX_PER_ROOM - 1) {
				room.status = "closed";
			}
			// Inform the players in the room that a new player
			// has entered the room.
			io.to(room.id).emit("playerentered", newPlayer);
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

		socket.join(room.id);

		// No need to inform the player of itself, emit before append
		socket.emit("foundroom", {
			name: room.name,
			players: room.players,
			numFinished: room.numFinished,
			timeLeft: room.timeLeft
		});
		room.players.push(newPlayer);

		socket.room = room;
		socket.player = newPlayer;

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
		socket.room.numFinished++;

		if (socket.room.numFinished === socket.room.players.length) {
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
		}
	});

	socket.on("disconnect", function(){
		if(	!socket.room ){
			// had problems without this somehow
			return;
		}
		socket.room.players = socket.room.players.filter((p)=> p.id != socket.id);

		socket.broadcast.to(socket.room.id).emit("disconnected", {
			id: socket.id
		});
		// TODO: manage socket disconnection
		// 
		// if( socket.room.players.length == 0 ) // the room have no players
		// 
		// if( room.status == "closed" )
		// 
		// clear every timeout/interval of room (?)
	})
});
