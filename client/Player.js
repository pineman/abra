var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = id;
	this.pos = 0;
	this.endTime = -1;
}

Player.prototype.typed = function( pos ) {
	var oldspan = document.getElementById("text").children[this.pos]
	if(oldspan){
		oldspan.style.border = "";
		oldspan.style.background = "";
	}
	this.pos = pos;
	this.displayCursor();
};

Player.prototype.displayCursor = function() {
	var span = document.getElementById("text").children[this.pos];
	if(span){
		var backcolor = hexToRgba(this.color, 0.7)
		span.style.border = "1px solid "+this.color;
		span.style.background = backcolor;
	}
}

function hexToRgba( color, opacity ){
	color = color.substring(1)
	var r,g,b;
	if( color.length == 6 ){
		r = parseInt( color.substr(0,2), 16 );
		g = parseInt( color.substr(2,2), 16 );
		b = parseInt( color.substr(4,2), 16 );
	} else if( color.length == 3 ){
		r = parseInt( color.substr(0,1), 16 ) * 16 + 15;
		g = parseInt( color.substr(1,1), 16 ) * 16 + 15;
		b = parseInt( color.substr(2,1), 16 ) * 16 + 15;
	}
	return "rgba(${r},${g},${b},${opacity})".replace("${r}",r).replace("${g}",g).replace("${b}",b).replace("${opacity}",opacity)
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
