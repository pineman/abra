const ROOM_READY_TIME = 5;
const CURSOR_OPACITY = 0.7;

var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id;
	this.pos = 0;
	this.endTime = -1;
}

// Convert an object with name, color and id attributes
// to our local Player object (prototype)
function convertToPlayer (player) {
	return new Player(player.name, player.color, player.id);
}

// Handle player typing event
Player.prototype.typed = function(pos) {
	var oldPos= document.getElementById("text").children[this.pos];
	oldPos.classList.remove(this.color.replace("#", "_"));
	this.pos = pos;
	this.showCursor();
};

Player.prototype.showCursor = function() {
	var newPos = document.getElementById("text").children[this.pos];
	if (newPos) {
		newPos.classList.add(this.color.replace("#", "_"));
	}
}

var Room = function (name, players, numFinished, timeLeft) {
	this.name = name;
	this.players = players;
	this.numFinished = numFinished;
	this.timeLeft = timeLeft;
	this.startTime = 0;
	this.endTime = 0;
	this.readyTime = ROOM_READY_TIME;
	this.finished = [];
}

function convertToRoom(room) {
	return new Room(room.name, room.players, room.numFinished, room.timeLeft);
}
