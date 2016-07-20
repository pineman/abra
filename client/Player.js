var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id;
	this.pos = 0;
}

Player.prototype.typed = function( pos ) {
	this.pos = pos;
};

Player.prototype.displayCursor = function() {
	// TODO
}