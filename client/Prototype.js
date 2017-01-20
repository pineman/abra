const ROOM_READY_TIME = 5;
const USER_ID = "MYSELF";

var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id;
	this.pos = 0;
	this.endTime = 0;
	this.isUser = id === USER_ID;
	this.errors = 0;
}

// Reset attributes that don't carry on from game to game
Player.prototype.reset = function () {
	this.pos = 0;
	this.endTime = 0;
	this.errors = 0;
}

// Handle player typing event
Player.prototype.typed = function(pos) {
	var oldSpan = document.getElementById("text").children[this.pos];
	if( !oldSpan ){
		return;
	}
	var i = util.findPlayerIndex(this.id, oldSpan.players);
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
// (could use Object.setPrototypeOf, but that has )
Player.from = function(player) {
	return new Player(player.name, player.color, player.id);
}

var Room = function (name, players, timeLeft) {
	this.name = name;
	this.players = players;
	this.timeLeft = timeLeft;
	this.numFinished = 0;
	this.readyTime = ROOM_READY_TIME;
	this.startTime = 0;
}

Room.from = function(room) {
	return new Room(room.name, room.players, room.timeLeft);
}
