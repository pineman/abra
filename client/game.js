/* Global io, Player, Room, mainColor */
var player;

function showPlayer(player) {
	var li = document.createElement("li");
	li.innerHTML = player.name;
	li.style.color = player.color;
	document.getElementById("players").appendChild(li);
}


function initGame() {
	var startButtom = document.getElementById("start");
	startButtom.onclick = startIO;
}

function startIO() {
	player = new Player(
				document.querySelector("#getname").value,
				mainColor,
				"MYSELF"
			);

	var socket = io(window.location.href);
	socket.emit("newplayer", {
			name: player.name,
			color: player.color
	});
	hide("intro");
	show("game");
	showPlayer(player);
	manageSocketEvents(socket);
}

function hide(id) {
	document.getElementById(id).style.display = "none";
}

function show(id) {
	document.getElementById(id).style.display = "block";
}
function convertToPlayer( player ){
	return new Player(player.name, player.color, player.id);
}

function showStatus(status) {
	document.getElementById("status").innerHTML = status;
}

function countToGame(room) {
	room.timeLeft--;
	if (room.timeLeft) {
		showStatus("Finding players... " + room.timeLeft);
	} else {
		clearInterval(room.timer);
		showStatus("Game starting... ");
	}
}

function countToStart(tmp, room) {
	if (room.timer) clearInterval(room.timer);
	if (tmp.time) {
		showStatus("Start in " + tmp.time);
	} else {
		clearInterval(tmp.timer);
		showStatus("Go!");
	}
	tmp.time--;
}

function manageSocketEvents(socket) {
	var room = new Room();
	socket.on("foundroom", function (newRoom) {
		room.name = newRoom.name;
		room.players = newRoom.players;
		room.numFinished = newRoom.numFinished;
		room.timeLeft = newRoom.timeLeft;

		document.getElementById("room-name").innerHTML += room.name;

		for (var i = 0; i < room.players.length; i++) {
			room.players[i]  = convertToPlayer(room.players[i]);
			showPlayer(room.players[i]);
		}

		showStatus("Finding players... " + room.timeLeft);
		room.timer = setInterval(countToGame, 1000, room);
	});

	socket.on("playerentered", function (player) {
		player = convertToPlayer(player);
		room.players.push(player);
		showPlayer(player);
		player.displayCursor();
	});

	socket.on("gamestart", function (text) {
		room.startTime = new Date();
		room.playing = room.players.slice();
		setTimeout(startGame, 5000, socket, text);
		var tmp = {time: 5};
		tmp.timer = setInterval(countToStart, 1000, tmp, room);

		for (var i = 0; i < text.length; i++) {
			var span = document.createElement("span")
			span.innerHTML = text[i];
			document.getElementById("text").appendChild(span);
		}
		player.typed(0);
		for (var i = 0; i < room.playing.length; i++) {
			room.playing[i].typed(0);
		}
	});

	socket.on("typed", function (data) {
		var player = findPlayer(data.index, room.playing);
		if (!player) {
			return;
		}
		player.typed(data.index);
	});

	socket.on("finish", function (data) {
		// data = {id}
		var i = find(data.id, room.playing)
		if (i == -1) return;
		room.playing[i].endTime = new Date();
		room.finished.push(room.playing.slice(i ,1)[0]);
		room.numFinished++;
	});

	socket.on("end", function () {
		room.endTime = new Date();
		finishGame();
		// generateStats( room ) - ?
	});

}

function findPlayer(id, players){
	for (var i = 0; i < players.length; i++)
		if (players[i].id == id)
			return players[i];
}

function find(id, players) {
	for (var i = 0; i < players.length; i++)
		if (players[i].id == id)
			return i;
	return -1;
}

function startGame( socket, text ){
	addEventListener("keypress", function(e){
		e.preventDefault();
		keypress(e,socket,text);
	});
}
function finishGame( room ){
	removeEventListener("keypress")
}

function keypress(e, socket, text){
	// TODO
	var char = keysight(e).char;
	if( char == text[player.pos])
		player.typed( player.pos + 1 );
	if( text.length == player.pos ) {
		socket.emit("finish",{
			time : 1
		})
		finishGame();
	} else if( text[player.pos + 1].match(/\W/) ){
		socket.emit("typed", {
			pos: player.pos
		});
	}
}
