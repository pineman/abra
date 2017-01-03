'use strict';

const config = require('./config.js');
const namegen = require('./namegen.js');
const texts = require('./texts.js');
let io; // Socket.IO require()'d later

let Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id; // the player's socket.id
	this.pos = 0; // index in the text string
	this.time = 0; // time spent writing
	this.errors = 0;
	this.done = false;
}

let Room = function (id) {
	this.id = id;
	this.name = namegen.wordFor(id); // Generate random name
	this.text = texts.getText();
	this.wordCount = this.text.length / config.WORD_SIZE;
	this.players = [];
	this.numFinished = 0;
	this.status = config.ROOM_STATUS_OPEN;
	this.initTimer = setInterval(countCloseRoom, 1000, this); // Every second
	this.timeLeft = config.ROOM_TIMEOUT; // Seconds untill gameStart
}

// Algorithm to find a room
function findRoom(rooms) {
	for (let i = 0; i < rooms.length; i++) {
		if (rooms[i].status === "open") {
			return rooms[i];
		}
	}
}

// Decrement room.timeLeft and start the game when it reaches 0.
function countCloseRoom(room) {
	room.timeLeft--;
	if (!room.timeLeft) {
		room.status = "closed";
		gameStart(room);
	}
}

function gameStart(room) {
	io.to(room.id).emit("gamestart", room.text);
}

function leaveRoom(rooms, socket) {
	socket.room.players.splice(socket.room.players.indexOf(socket.player), 1);

	// If the room gets empty, remove it
	if (socket.room.players.length === 0) {
		rooms.splice(rooms.indexOf(socket.room), 1);
	} else if (socket.player.done) {
		socket.room.numFinished--;
	}
}

function endGame(rooms, room) {
	let stats = [];
	for (let i = 0; i < room.players.length; i++) {
		let curPlayer = [];
		curPlayer[0] = room.players[i].name;
		curPlayer[1] = room.players[i].time.toFixed(config.STATS_PRECISION);
		curPlayer[2] = (room.wordCount / (room.players[i].time / 60)).toFixed(config.STATS_PRECISION);
		curPlayer[3] = room.players[i].errors;
		curPlayer[4] = room.players[i].color;
		stats.push(curPlayer);
	}
	stats.sort((p1, p2) => p1[1] - p2[1]);
	io.to(room.id).emit("end", stats);

	// Destroy room
	rooms.splice(rooms.indexOf(room), 1);
	// Disconnect all sockets in the room.
	for (let i in io.sockets.adapter.rooms[room.id].sockets) {
		// This makes he 'disconnect' event, triggered next, do nothing.
		io.sockets.adapter.nsp.connected[i].room = undefined;
		io.sockets.adapter.nsp.connected[i].disconnect();
	}
}

function manageSocketEvents(rooms) {
	io.on("connection", function (socket) {
		/* All events other than "newplayer" depend on
		* some attribute we save in the socket itself.
		* If the socket did not go through "newplayer",
		* it won't have those attributes (player, room),
		* therefore the event handlers will fail without
		* crashing the server (node doesn't segfault...) */


		// Save new player
		socket.on("newplayer", function (data) {
			// Name is escaped by textContent on the client side,
			// however, still testing for max length.
			if (data.name.length > 30) return; // max is 15 client-side

			// Silently drop clients messing around with color
			if (!data.color.startsWith("#") || data.color.length > 7) return;

			let newPlayer = new Player(data.name, data.color, socket.id);

			// Save this player's player object on its socket object.
			socket.player = newPlayer;
		});


		// Find a room for a player
		socket.on("findroom", function () {
			/* There's two types of rooms. Our rooms and Socket.IO's
			 * internal rooms for broadcasting. For convenience,
			 * both share the same ID. */
			let room = findRoom(rooms);

			let roomReady;
			if (room) {
				// Since we're adding one more player to the room,
				// its ready if theres MAX - 1 players already on it.
				roomReady = (room.players.length === (config.MAX_PLAYERS_PER_ROOM - 1));

				// Close the room asap if its ready.
				if (roomReady) {
					room.status = config.ROOM_STATUS_CLOSED;
					clearTimeout(room.initTimer);
				}

				// Inform the players in the room that a new player
				// has entered the room.
				socket.broadcast.to(room.id).emit("playerentered", socket.player);

				// Make the socket join the Socket.IO broadcast room.
				socket.join(room.id);
			} else {
				// No open room was found, create a new room whose
				// id is the first player's socket.id.
				room = new Room(socket.id);

				/* NOTE: socket.io already creates and joins the socket
				 * to a room with this id by default, so we don't
				 * need to socket.join().
				 * http://socket.io/docs/rooms-and-namespaces/ */

				rooms.push(room);
			}

			// Inform the player a room has been found.
			socket.emit("foundroom", {
				name: room.name,
				players: room.players,
				timeLeft: room.timeLeft
			});

			// Append the player to the room's list of players.
			room.players.push(socket.player);

			// Save this player's room on its socket object.
			socket.room = room;

			// Start the game if the room is ready.
			if (roomReady) {
				gameStart(room);
			}
		});


		socket.on("typed", function (data) {
			let dataToEmit = {
				id: socket.id,
				pos: data.pos
			};

			socket.broadcast.to(socket.room.id).emit("typed", dataToEmit);
		});


		socket.on("finish", function (data) {
			socket.player.time = data.time;
			socket.player.errors = data.errors;
			socket.player.done = true;
			socket.room.numFinished++;

			// If all players have finished, end the game.
			if (socket.room.numFinished === socket.room.players.length) {
				endGame(rooms, socket.room);
			}
		});


		socket.on("disconnect", function() {
			// Guard against reconnections, sockets without rooms, etc.
			if (!socket.room) return;

			// Remove the socket from the room.
			leaveRoom(rooms, socket);

			// If the room has not already been closed by leaveRoom()
			if (socket.room.players.length != 0) {
				// Inform the remaining players one has disconnected.
				socket.broadcast.to(socket.room.id).emit("disconnected", {
					id: socket.id
				});

				// If the remaining players are already finished,
				// end the game for them.
				if (socket.room.numFinished === socket.room.players.length) {
					endGame(rooms, socket.room);
				}
			}
		})
	});
}

function main() {
	let server, port;

	if (process.argv[2] !== "deploy") {
		server = require('./http_server.js');
		port = server.address().port;
		console.log(`HTTP server listening on http://127.0.0.1:${port}`);
	} else {
		server = config.SOCKETIO_PORT;
		port = config.SOCKETIO_PORT;
	}

	io = require('socket.io')(server);
	console.log(`Socket.IO bound to http://127.0.0.1:${port}/socket.io`);

	let rooms = [];

	manageSocketEvents(rooms);
}
main();
