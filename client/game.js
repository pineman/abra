/* Global io, Player */

// Available colors for players
var COLORS = ["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b","#ffffff","#000000"];

// Color selected by user (default:last color of the list)
var mainColor = COLORS[COLORS.length - 1];

function selectMainColor() {
	var lastElement = document.querySelector("#getcolor > .selected")
	if (lastElement)
		lastElement.className = "";
	this.className = "selected";
	mainColor = this.value

};

function hide (id) {
	document.getElementById(id).style.display = "none"
};

function show (id) {
	document.getElementById(id).style.display = "block"
};

window.addEventListener("load", function() {
	// Select Main Color
	var element = document.getElementById("getcolor");
	var colorbox;
	for (var i = 0; i < COLORS.length; i++) {
		colorbox = document.createElement("div");
		colorbox.style.background = COLORS[i];
		colorbox.value = COLORS[i];
		colorbox.onclick = selectMainColor;
		element.appendChild(colorbox);
	}
	colorbox.className = "selected";

	// Find a room, initialize socket.io
	document.getElementById("start").onclick = function() {
		var socket = io(window.location.href);
		socket.emit("newplayer", {
			name : document.querySelector("#getname > input").value,
			color : mainColor
		});
		showPlayer({
			name : document.querySelector("#getname > input").value,
			color : mainColor
		});
		manageSocketEvents(socket);
		hide("intro");
		show("game");
	}
});

function manageSocketEvents(socket) {
	var Room = {
		id : "",
		players : [],
		numFinished : 0,
		timeLeft : 0,
		startTime : new Date(),
		endTime : new Date(),
		playing : [],
		finished : []
	};

	socket.on("foundroom", function (room) {
		Room = room;
		document.getElementById("roominfo").innerHTML = "In room: " + room.id;
		for (var i = 0; i < Room.players.length; i++) {
			showPlayer(Room.players[i]);
		}
	});

	socket.on("playerentered", function (player) {
		Room.players.push(player);
		showPlayer(player);
	});

	socket.on("gamestart", function (text) {
		console.log("gamestarted" + text)
		Room.startTime = new Date();
		Room.playing = Room.players;
		document.getElementById("text").innerHTML = text;
	});

	socket.on("typed", function (data) {
		// data = {
		//	id,
		//	index
		// }
		// TODO
	});

	socket.on("finish", function (data) {
		// data = {id}
		var i = find(data.id, Room.playing)
		if (i == -1) {
			return;
		}

		Room.playing.slice(i ,1);
		Room.finished.push( Room.players[i] );
		Room.players[i].timeSpent = (new Date()) - Room.startTime;
		Room.numFinished++;
	});

	socket.on("end", function () {
		Room.endTime = new Date();
		hide("game");
		show("stats");
		// generateStats( Room ) - ?
	});
};

function find(id, players) {
	for (var i = 0; i < players.length; i++)
		if (players[i].id == id)
			return i;
	return -1;
};

function showPlayer(player) {
	var li = document.createElement("li");
	li.innerHTML = player.name;
	li.style.border = "1px solid " + player.color;
	document.getElementById("players").appendChild(li);
};
