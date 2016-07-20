var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id;
	this.pos = 0;
	this.endTime = -1;
}

Player.prototype.typed = function( pos ) {
	this.pos = pos;
	this.displayCursor();
};

Player.prototype.displayCursor = function() {
	// TODO
}

var Room = function(name, players){
	this.name;
	this.players;
	this.numFinished;
	this.timeLeft;
	this.startTime;
	this.endTime;
	this.finished;
}
