/* Game room control */
const TYPED_PER_LETTER = true;

function showPlayer(player) {
	var li = document.createElement("li");
	li.textContent = player.name;
	li.style.color = player.color;
	li.id = player.id;
	document.getElementById("players").appendChild(li);
}

function showNewRoom(room) {
	document.getElementById("room-name").textContent += room.name;

	// Show the players already in the room
	for (var i = 0; i < room.players.length; i++) {
		room.players[i] = convertToPlayer(room.players[i]);
		showPlayer(room.players[i]);
	}
}

function showStatus(status) {
	document.getElementById("status").textContent = status;
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

function showPreGame(room, text, userPlayer) {
	// Show text (a <span> for each letter)
	for (var i = 0; i < text.length; i++) {
		var span = document.createElement("span")
		span.textContent = text[i];
		span.players = [];
		document.getElementById("text").appendChild(span);
	}
	for (var i = 0; i < room.players.length; i++) {
		room.players[i].typed(0);
	}
	userPlayer.typed(0);
}

var listener;
function startGame(room, socket, text, userPlayer) {
	addEventListener("keypress", listener = function (e) {
		e.preventDefault();
		keypress(e, room, socket, text, userPlayer);
	});

	room.startTime = new Date();
}

function keypress(e, room, socket, text, userPlayer) {
	var char = keysight(e).char;

	if (char == text[userPlayer.pos]) {
		userPlayer.typed(userPlayer.pos + 1);
	} else {
		// Wrong keypress
		userPlayer.errors++;

		var span = document.getElementById("text").children[userPlayer.pos];
		span.id = "wrong";
		setTimeout(function() {
			span.id = "";
		}, 100);

		return;
	}

	if (userPlayer.pos === text.length) {
		userPlayer.endTime = new Date() - room.startTime;
		socket.emit("finish", {
			time: (userPlayer.endTime / 1000),
			errors: userPlayer.errors
		});
		finishGame();
	} else if (TYPED_PER_LETTER || text[userPlayer.pos].match(/\W/)) {
		socket.emit("typed", {
			pos: userPlayer.pos
		});
	}
}

function finishGame() {
	removeEventListener("keypress", listener);
}

function endGame() {
	hide("game");
	show("stats");
}
