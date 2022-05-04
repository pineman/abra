/* Main game functions. */

'use strict';

const util = require('./util.js');
const Player = require('./Prototype.js').Player;
const Room = require('./Prototype.js').Room;

const WS_SERVER = window.location.origin.replace('http', 'ws') + '/abra';

// From the "game" screen onwards.
function gameLoop(user) {
	showNewPlayer(user);
	util.DOM.setTextOpacity(0.5);
	util.DOM.showRoomStatus("Connecting to server...");

	let socket = new WebSocket(WS_SERVER);

	// This is the 'loop' essentially.
	manageSocketEvents(socket, user);

	socket.addEventListener('open', function () {
		socket.send(JSON.stringify({
			event: 'newPlayer',
			name: user.name,
			color: user.color
		}));
	});
}

function manageSocketEvents(socket, user) {
	// Various events need the room.
	let room;

	let data;
	socket.addEventListener('message', function(message) {
		data = JSON.parse(message.data);

		switch (data.event) {
			case 'foundRoom':
				room = Room.from(data);
				foundRoom(room, socket, user);
				break;

			case 'playerEnteredRoom':
				playerEnteredRoom(room, Player.from(data));
				break;

			case 'startGame':
				showPreGame(room, socket, data.text, user);
				break;

			case 'playerTyped':
				playerTyped(room, data.id, data.pos);
				break;

			case 'endGame':
				showStats(data.stats, user);
				socket.close();
				break;

			case 'playerDisconnected':
				playerDisconnected(room, data.id);
				break;

			default:
				break;
		}
	});

	socket.addEventListener('error', console.log);
}

function showNewPlayer(player) {
	let li = document.createElement("li");
	li.textContent = player.name;
	li.style.color = player.color;
	li.id = player.id;
	document.getElementById("players").appendChild(li);
}

function showNewRoom(room) {
	document.getElementById("room-name").textContent = room.name;

	// Show the players that were already in the room.
	for (let i = 0; i < room.players.length; i++) {
		room.players[i] = Player.from(room.players[i]);
		showNewPlayer(room.players[i]);
	}
}

function foundRoom(room, socket, user) {
	showNewRoom(room);
	room.players.push(user);

	if (room.timeLeft === 0) {
		util.DOM.showRoomStatus("Game starting... ");
		return;
	}

	util.DOM.showRoomStatus("Finding players... " + room.timeLeft);
	util.DOM.showForceStart(function (e) {
		socket.send(JSON.stringify({
			event: "forceStart"
		}));
	});

	room.timer = setInterval(function () {
		room.timeLeft--;
		if (room.timeLeft) {
			util.DOM.showRoomStatus("Finding players... " + room.timeLeft);
		} else {
			clearInterval(room.timer);
			room.timer = undefined;
			util.DOM.showRoomStatus("Game starting... ");
		}
	}, 1000, room); // Tick every second.
}

function playerEnteredRoom(room, player) {
	room.players.push(player);
	showNewPlayer(player);
}

function showPreGame(room, socket, text, user) {
	setTimeout(startGame, room.readyTime*1000, room, socket, text, user);

	util.DOM.hideForceStart();

	// Show text (a <span> for each letter)
	// TODO: DocumentFragment?
	for (let i = 0; i < text.length; i++) {
		let span = document.createElement("span");
		span.textContent = text[i];
		// save the players on this particular span in its own object.
		span.players = [];
		document.getElementById("text").appendChild(span);
	}
	user.moveCursor(0);

	if (room.timer) {
		clearInterval(room.timer);
	}

	util.DOM.showRoomStatus("Start in " + room.readyTime + "...");
	room.timer = setInterval(function () {
		room.readyTime--;
		if (room.readyTime) {
			util.DOM.showRoomStatus("Start in " + room.readyTime + "...");
		} else {
			clearInterval(room.timer);
			room.timer = undefined;
			util.DOM.showRoomStatus("Go!");
		}
	}, 1000, room);

}

function startGame(room, socket, text, user) {
	prepareInput(room, socket, text, user);
	util.DOM.setTextOpacity(1);
	room.startTime = new Date();
}

let inputBlurListener;
let windowClickListener;
let inputInputListener;
function prepareInput(room, socket, text, user) {
	let input = document.getElementById("hidden-input");

	// Clear the input field, to ensure that the
	// "input" event is triggered next time.
	input.value = "";

	// Always focus input box
	input.addEventListener("blur", inputBlurListener = function (e) {
		input.focus();
	});
	window.addEventListener("click", windowClickListener = function (e) {
		input.focus();
	});
	input.focus();

	// Catch keypresses inside input box
	input.addEventListener("input", inputInputListener = function (e) {
		userKeyPress(this.value, room, socket, text, user);
		this.value = "";
	});
}

function userKeyPress(char, room, socket, text, user) {
	let span = document.getElementById("text").children[user.pos];

	if (char !== text[user.pos]) {
		// Wrong keypress
		user.errors++;
		span.classList.add('wrong');

		setTimeout(function() {
			span.classList.remove('wrong');
		}, 200);

		return;
	}

	socket.send(JSON.stringify({
		event: 'playerTyped',
		pos: user.pos
	}));

	user.moveCursor(user.pos + 1);
	user.pos++;
	span.setAttribute('written', '');

	if (user.pos === text.length) {
		finishGame(room, user, socket);
	}
}

function finishGame(room, user, socket) {
	user.endTime = new Date() - room.startTime;

	socket.send(JSON.stringify({
		event: 'playerDone',
		time: (user.endTime / 1000),
		mistakes: user.errors
	}));

	// Clear event listeners related to the <input>
	let input = document.getElementById("hidden-input");
	input.removeEventListener("blur", inputBlurListener);
	window.removeEventListener("click", windowClickListener);
	input.removeEventListener("input", inputInputListener);
}

function playerTyped(room, playerId, pos) {
	let player = util.findPlayer(playerId, room.players);
	player.moveCursor(pos);
	player.pos = pos;
}

let againButtonClickListener;
function showStats(stats, user) {
	let table = document.getElementById("stats-table").tBodies[0];

	for (let row = 0; row < stats.length; row++) {
		let tr = table.insertRow();
		tr.classList.add("border-bottom");
		tr.style.borderBottomColor = stats[row][4];
		let td = tr.insertCell();
		td.textContent = row + 1;

		for (let col = 0; col < 4; col++) {
			td = tr.insertCell();
			if (col === 0) td.style.color = stats[row][4];
			td.textContent = stats[row][col];
		}
	}

	util.DOM.transition("game", "stats");

	let againButton = document.getElementById("again-button");
	againButton.addEventListener("click", againButtonClickListener = function () {
		resetGame(user);
	});

	setTimeout(function () {
		againButton.focus();
	}, util.TRANSITION_TIME * 1000);
}

// Reset the game and start it again.
function resetGame(user) {
	let againButton = document.getElementById("again-button");
	againButton.removeEventListener("click", againButtonClickListener);

	util.DOM.clear(document.getElementById("text"));
	util.DOM.clear(document.getElementById("room-name"));
	util.DOM.clear(document.getElementById("status"));
	util.DOM.clear(document.getElementById("players"));

	setTimeout(function () {
		util.DOM.clear(document.querySelector("#stats-table tbody"));
	}, util.TRANSITION_TIME * 1000);

	util.DOM.transition("stats", "game");
	user.reset();
	gameLoop(user);
}

function playerDisconnected(room, playerId) {
	let i = util.findPlayerIndex(playerId, room.players);
	let player = room.players[i];

	room.players.splice(i, 1); // remove from room players list
	player.moveCursor(-1); // hide cursor
	document.getElementById(playerId).remove(); // Remove from lobby list
}

module.exports = {gameLoop, resetGame};
