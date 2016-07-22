/* Game room control */
const TYPED_PER_LETTER = true;

function showPlayer(player) {
	var li = document.createElement("li");
	li.innerHTML = player.name;
	li.style.color = player.color;
	document.getElementById("players").appendChild(li);
}

function showStatus(status) {
	document.getElementById("status").innerHTML = status;
}

function showRoomStatus(statusCode, room) {
	switch (statusCode) {
	case "foundroom":
		if (room.timeLeft <= 0) return;
		showStatus("Finding players... " + room.timeLeft);
		room.timer = setInterval(function () {
			room.timeLeft--;
			if (room.timeLeft) {
				showStatus("Finding players... " + room.timeLeft);
			} else {
				clearInterval(room.timer);
				room.timer = undefined;
				showStatus("Game starting... ");
			}
		}, 1000, room);
		break;

	case "gamestart":
		if (room.readyTime <= 0) return;
		if (room.timer) {
			clearInterval(room.timer);
			room.timer = undefined;
		}

		showStatus("Start in " + room.readyTime);
		room.timer = setInterval(function () {
			room.readyTime--;
			if (room.readyTime) {
				showStatus("Start in " + room.readyTime);
			} else {
				clearInterval(room.timer);
				room.timer = undefined;
				showStatus("Go!");
			}
		}, 1000, room);
		break;

	default:
		break;
	}
}

function showPreGame(room, text) {
	// Show text (a <span> for each letter)
	for (var i = 0; i < text.length; i++) {
		var span = document.createElement("span")
		span.innerHTML = text[i];
		document.getElementById("text").appendChild(span);
	}

	player.showCursor();
}

function startGame( socket, text ){
	addEventListener("keypress", function(e){
		e.preventDefault();
		keypress(e,socket,text);
	});
}

function keypress(e, socket, text){
	var char = keysight(e).char;

	if (char == text[player.pos]) {
		player.typed(player.pos + 1);
	} else return; // Wrong keypress

	if (text.length === player.pos) {
		// TODO
		socket.emit("finish", {
			time: 1
		})
		finishGame();
	} else if (TYPED_PER_LETTER || text[player.pos].match(/\W/)) {
		socket.emit("typed", {
			pos: player.pos
		});
	}
}

function findPlayer(id, players){
	for (var i = 0; i < players.length; i++)
		if (players[i].id == id)
			return players[i];
}

function hide(id) {
	document.getElementById(id).style.display = "none";
}

function show(id) {
	document.getElementById(id).style.display = "block";
}

// ???????
function find(id, players) {
	for (var i = 0; i < players.length; i++)
		if (players[i].id == id)
			return i;
	return -1;
}

// TODO: below needs work
function finishGame( room ){
	removeEventListener("keypress")
}
