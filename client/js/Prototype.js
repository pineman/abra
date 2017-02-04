/* Main game objects. */

'use strict';

const util = require('./util.js');

const ROOM_READY_TIME = 5;
const USER_ID = 'LOCAL';

// TODO: Convert to ES6 class syntax?

// Player object (local user as well as remote players);
let Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id;
	this.endTime = 0;
	this.isUser = (id === USER_ID);
	this.pos = this.isUser ? 0 : -1; // Local user starts at 0!
	this.errors = 0;
}

Player.USER_ID = USER_ID;

// Convert an object with name, color and id attributes
// to our local Player object (prototype)
// (could use Object.setPrototypeOf, but that has some performance implications)
Player.from = function (player) {
	return new Player(player.name, player.color, player.id);
}

Player.prototype.moveCursor = function (newPos) {
	let oldSpan = document.getElementById("text").children[this.pos];

	if (oldSpan) {
		let i = util.findPlayerIndex(this.id, oldSpan.players);
		oldSpan.players.splice(i, 1);

		oldSpan.className = "";
		for (let i = 0; i < oldSpan.players.length; i++) {
			oldSpan.className = oldSpan.players[i].color.replace("#","_");
			if (oldSpan.players[i].isUser) break;
		}
	}

	let newSpan = document.getElementById("text").children[newPos];

	if (newSpan) {
		newSpan.players.push(this);
		for (let i = 0; i < newSpan.players.length; i++) {
			newSpan.className = newSpan.players[i].color.replace("#","_");
			if (newSpan.players[i].isUser) break;
		}
	}

}

// Reset attributes that don't carry on from game to game
Player.prototype.reset = function () {
	this.pos = 0;
	this.endTime = 0;
	this.errors = 0;
}

// Room object.
let Room = function (name, players, timeLeft) {
	this.name = name;
	this.players = players;
	this.timeLeft = timeLeft;
	this.numFinished = 0;
	this.readyTime = ROOM_READY_TIME;
	this.startTime = 0;
}

Room.from = function (room) {
	return new Room(room.name, room.players, room.timeLeft);
}

module.exports = {Player, Room};
