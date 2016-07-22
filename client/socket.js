const WS_SERVER = window.location.href;

// Global var: Local player
var player;

function startWSocket() {
	var socket = io(WS_SERVER);

	player = new Player(
		document.querySelector("#getname").value,
		document.querySelector("#getcolor > .selected-color").style.background,
		"MYSELF"
	);

	socket.emit("newplayer", {
		name: player.name,
		color: player.color
	});

	hide("intro");
	show("game");

	showPlayer(player);
	manageSocketEvents(socket);
}

function manageSocketEvents(socket) {
	var room;

	socket.on("foundroom", function (foundRoom) {
		room = convertToRoom(foundRoom);

		document.getElementById("room-name").innerHTML += room.name;
		// Show the players already in the room
		for (var i = 0; i < room.players.length; i++) {
			room.players[i] = convertToPlayer(room.players[i]);
			showPlayer(room.players[i]);
		}
		showRoomStatus("foundroom", room);
	});

	socket.on("playerentered", function (player) {
		player = convertToPlayer(player);
		room.players.push(player);
		showPlayer(player);
	});

	socket.on("gamestart", function (text) {
		// TODO: não esquecer os segundos de room.readyTime
		room.startTime = new Date();
		room.playing = room.players.slice();

		setTimeout(startGame, room.readyTime*1000, socket, text);
		showPreGame(room, text);
		showRoomStatus("gamestart", room);
	});

	socket.on("typed", function (data) {
		var player = findPlayer(data.id, room.playing);
		if (!player) return;
		player.typed(data.pos);
	});

	// TODO: below needs work
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
