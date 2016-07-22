const ROOM_READY_TIME = 5;
const USER_ID = "MYSELF";

var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id;
	this.pos = 0;
	this.endTime = -1;
	this.isUser = id === USER_ID;
}

// Handle player typing event
Player.prototype.typed = function(pos) {
	var oldSpan = document.getElementById("text").children[this.pos]
	if( !oldSpan ){
		return;
	}
	var i = findPlayerIndex(this.id, oldSpan.players);
	if(i!=-1)
		oldSpan.players.splice(i,1);
	
	this.pos = pos;
	this.showCursor();
	oldSpan.className = "";
	for (var i = 0; i < oldSpan.players.length; i++) {
		oldSpan.className = oldSpan.players[i].color.replace("#","_");
		if( oldSpan.players[i].isUser )
			break;
	}
};

Player.prototype.showCursor = function() {
	var newSpan = document.getElementById("text").children[this.pos];
	if( !newSpan ){
		return;
	}
	newSpan.players.push( this );
	for (var i = 0; i < newSpan.players.length; i++) {
		newSpan.className = newSpan.players[i].color.replace("#","_");
		if( newSpan.players[i].isUser )
			break;
	}
}

// Convert an object with name, color and id attributes
// to our local Player object (prototype)
function convertToPlayer (player) {
	return new Player(player.name, player.color, player.id);
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
