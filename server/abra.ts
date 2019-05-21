'use strict';

const ROOM_TIMEOUT = 15; // seconds
const MAX_PLAYERS_PER_ROOM = 4;
const ROOM_STATUS_CLOSED = 0;
const ROOM_STATUS_OPEN = 1;
const WORD_SIZE = 4;

// Read required files.
import fs = require('fs');
const DICT = fs.readFileSync('wordsEn.txt', 'utf8').split('\n');
const DICT_LENGTH = DICT.length;

const lines = fs.readFileSync('texts.txt', 'utf8').split('\n');
const TEXTS :string[] = [];
if (process.argv[2] != "deploy" ) {
	TEXTS.push("devel test");
} else {
	for (let i = 0; i < lines.length; i++) {
		if (!/(^#|^\s*$)/.test(lines[i])) {
			// regex to check if line starts with # or is all whitespace (\s)
			TEXTS.push(lines[i])
		}
	};
}
const TEXTS_LENGTH = TEXTS.length;

// Main objects
class Player {
	name: string;
	color: string;
	id: number;
	pos: number;
	time: number;
	mistakes: number;
	done: boolean;
	constructor(name: string, color: string) {
		this.name = name;
		this.color = color;
		this.id = Date.now() + Math.random(); // Random "enough" ID
		this.pos = -1; // index in the text string
		this.time = 0; // time spent writing
		this.mistakes = 0;
		this.done = false;
	}
}

class Room {
	text: string;
	name: string;
	wordCount: number;
	sockets;
	numDone: number;
	status: number;
	timeLeft: number;
	initTimer: number;
	constructor() {
		this.text = TEXTS[Math.floor(Math.random() * TEXTS_LENGTH)];
		this.name = DICT[Math.floor(Math.random() * DICT_LENGTH)];
		this.wordCount = this.text.length / WORD_SIZE;
		this.sockets = []; // Array of sockets in the room
		this.numDone = 0;
		this.status = ROOM_STATUS_OPEN;
		this.timeLeft = ROOM_TIMEOUT; // Seconds untill startGame
		this.initTimer = window.setInterval(this.countCloseRoom, 1000, this); // Every second
	}

	closeRoom() {
		this.status = ROOM_STATUS_CLOSED;
		clearTimeout(this.initTimer);
	};

	// Decrement timeLeft and, when it reaches 0, close the room and start the game
	countCloseRoom(room: Room) {
		room.timeLeft--;
		if (!room.timeLeft) {
			room.closeRoom();
			startGame(room);
		}
	}
}

// Global variable: array of active rooms.
let rooms: Room[] = [];

function newPlayer(ws, data) {
	// Name should be controlled on the client side,
	// but we still test for max length for good measure.
	if (data.name.length > 20) return;

	// Save a player's attributes on its `ws` socket object.
	Player.call(ws, data.name, data.color);

	// Algorithm to find an open room.
	let room = ((rooms) => {
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].status === ROOM_STATUS_OPEN) {
				return rooms[i];
			}
		}
	})(rooms);

	let roomReady;
	if (room) {
		// Since we're adding one more player to the room,
		// the room is ready if there were MAX - 1 players already on it.
		roomReady = (room.sockets.length === (MAX_PLAYERS_PER_ROOM - 1));

		// Close the room asap if its ready.
		if (roomReady) room.closeRoom();

		// Inform the players in the room that a new player
		// has entered the room.
		for (let s of room.sockets) {
			s.send(JSON.stringify({
				event: 'playerEnteredRoom',
				id: ws.id,
				name: ws.name,
				color: ws.color
			}));
		}
	} else {
		// No open room was found, create a new room.
		room = new Room();
		rooms.push(room);
	}

	// Inform the player a room has been found.
	// Build an object with all the room's players' information to send
	// to the new player.
	let roomPlayers = [];
	for (let s of room.sockets) {
		let p = {
			id: s.id,
			name: s.name,
			color: s.color
		}
		roomPlayers.push(p);
	}

	ws.send(JSON.stringify({
		event: 'foundRoom',
		name: room.name,
		players: roomPlayers,
		timeLeft: 0 ? roomReady : room.timeLeft
	}));

	// Append the player to the room's array of sockets.
	room.sockets.push(ws);

	// Save this player's room on its socket object.
	ws.room = room;

	// Start the game if the room is ready.
	if (roomReady) {
		startGame(room);
	}
}

function forceStart(ws) {
	ws.room.closeRoom();
	startGame(ws.room);
}

// Send the startGame event to all players in a room and send them the text.
function startGame(room) {
	for (let s of room.sockets) {
		s.send(JSON.stringify({
			event: 'startGame',
			text: room.text
		}));
	}
}

// Handle a player typing a character.
function playerTyped(ws, data) {
	for (let s of ws.room.sockets) {
		// Send to every player except the player who just typed.
		if (s !== ws) {
			s.send(JSON.stringify({
				event: 'playerTyped',
				id: ws.id,
				pos: data.pos
			}));
		}
	}
}

function endGame(rooms, room) {
	// Generate end of game stats.
	let stats = room.sockets.map(socket => [
		socket.name,
		socket.time.toFixed(1),
		Math.round(room.wordCount / (socket.time / 60)),
		socket.mistakes,
		socket.color
	]);

	// Sort ascendingly by time.
	stats.sort((p1, p2) => p1[1] - p2[1]);

	// Send the endGame event along with the stats to every player in the room.
	for (let s of room.sockets) {
		s.send(JSON.stringify({
			event: 'endGame',
			stats: stats
		}));
	}

	// Remove room
	rooms.splice(rooms.indexOf(room), 1);

	// Disconnect all sockets in the room.
	for (let s of room.sockets) {
		// Delete the old 'close' event handler, playerDisconnected(), used
		// for unexpected player disconnections.
		s.removeAllListeners('close');
		// Now forcefully disconnect the player, with no callback
		// associated to the 'close' event.
		s.terminate();
	}
}

// Handle a player completing the text.
function playerDone(ws, data) {
	ws.time = data.time;
	ws.mistakes = data.mistakes;
	ws.done = true;
	ws.room.numDone++;

	// If all players are done, end the game.
	if (ws.room.numDone === ws.room.sockets.length) {
		endGame(rooms, ws.room);
	}
}

// Handle an unexpected player disconnection
function playerDisconnected(ws) {
	// Guard against reconnections, sockets without rooms, etc.
	if (!ws.room) return;

	// Remove the socket from the room.
	ws.room.sockets.splice(ws.room.sockets.indexOf(ws), 1);

	// If the room gets empty, remove it
	if (ws.room.sockets.length === 0) {
		rooms.splice(rooms.indexOf(ws.room), 1);
	} else if (ws.done) {
		// If the disconnected player was done, decrement the number
		// of done players in the room.
		ws.room.numDone--;
	}

	// If the room has not already been removed
	if (ws.room.sockets.length != 0) {
		// Inform the remaining players one has disconnected.
		for (let s of ws.room.sockets) {
			s.send(JSON.stringify({
				event: 'playerDisconnected',
				id: ws.id
			}));
		}

		// If the remaining players are already done,
		// end the game for them.
		if (ws.room.numDone === ws.room.sockets.length) {
			endGame(rooms, ws.room);
		}
	}
}

export = {
	newPlayer,
	forceStart,
	playerTyped,
	playerDone,
	playerDisconnected
};
