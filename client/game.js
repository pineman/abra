/* Global io, Player, Room, mainColor */
var player;

function showPlayer(player) {
	var li = document.createElement("li");
	li.innerHTML = player.name;
	li.style.border = "1px solid " + player.color;
	document.getElementById("players").appendChild(li);
};


function initGame() {
	var startButtom = document.getElementById("start");
	startButtom.onclick = startIO;
}

function startIO() {
	player = new Player(
				document.querySelector("#getname > input").value,
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
};

function show(id) {
	document.getElementById(id).style.display = "block";
};
function convertToPlayer( player ){
	return new Player(player.name, player.color, player.id);
}

function manageSocketEvents(socket) {
	var room = new Room();
	socket.on("foundroom", function (newRoom) {
		
		room.name = newRoom.name;
		room.players = newRoom.players;
		room.numFinished = newRoom.numFinished;
		room.timeLeft = newRoom.timeLeft;

		document.getElementById("roominfo").innerHTML = "In room: " + room.id;
	
		for (var i = 0; i < room.players.length; i++) {
			room.players[i]  = convertToPlayer( players[i] );
			showPlayer(room.players[i]);
		}
	});

	socket.on("playerentered", function ( player) {
		player = convertToPlayer(player);
		room.players.push(player);
		showPlayer(player);
		player.displayCursor();
	});

	socket.on("gamestart", function (text) {

		room.startTime = new Date();
		room.playing = room.players.slice();
		document.getElementById("text").innerHTML = text;
		setTimeout(startGame, 5000, socket, text)
	});

	socket.on("typed", function (data) {
		var player = findPlayer(data.index, room.playing);
		if(!player) {
			return;
		}
		player.typed(data.index);
	});

	socket.on("finish", function (data) {
		// data = {id}
		var i = find(data.id, room.playing)
		if(i==-1)
			return;
		room.playing[i].endTime = new Date();
		room.finished.push( room.playing.slice(i ,1)[0] );
		room.numFinished++;
	});

	socket.on("end", function () {
		room.endTime = new Date();
		finishGame();
		// generateStats( room ) - ?
	});

};

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
};

function startGame( socket, text ){
	addEventListener("keypressed", keypressed, socket, text)
}
function finishGame( room ){

}

function keypressed(e, socket, text){
	// TODO
	var key = e.key
	if( text[player.pos + 1].test(/\W/) )
		socket.emit("typed", {
			pos: player.pos
		});
	if( text.length == player.pos )
		socket.emit("finish",{
			time : 1
		})
}