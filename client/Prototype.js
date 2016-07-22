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
	var oldPos= document.getElementById("text").children[this.pos]
	oldPos.style.border = "";
	oldPos.style.background = "";
	this.pos = pos;
	this.showCursor();
};

Player.prototype.showCursor = function() {
	var span = document.getElementById("text").children[this.pos];
	if (span) {
		var cursorColor = hexToRGBA(this.color, CURSOR_OPACITY);
		span.style.border = "1px solid " + this.color;
		span.style.background = cursorColor;
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
