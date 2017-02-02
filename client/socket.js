const PROTOCOL = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const PORT = window.location.port ? ':' + window.location.port : '';
const WS_SERVER = PROTOCOL + window.location.hostname + PORT + '/abra';

function initPlayer() {
	var player = new Player(
		document.querySelector("#getname").value,
		document.querySelector("#getcolor > .selected-color").value,
		USER_ID
	);

	connect(player);

	var againButton = document.getElementById("again-button");
	againButton.addEventListener("click", function (e) {
		playAgain(player);
	});

	showGame(player);
}

function connect(player) {
	var socket = new WebSocket(WS_SERVER);

	manageSocketEvents(socket, player);

	socket.addEventListener('open', function () {
		socket.send(JSON.stringify({
			event: 'newPlayer',
			name: player.name,
			color: player.color
		}));
	});
}

function manageSocketEvents(socket, userPlayer) {
	var room;

	socket.addEventListener('message', function(message) {
		data = JSON.parse(message.data);

		switch (data.event) {
			case 'foundRoom':
				room = Room.from(data);
				showNewRoom(room);
				showRoomStatus("foundroom", room);
				room.players.push(userPlayer);
				break;

			case 'playerEntered':
				player = Player.from(data);
				room.players.push(player);
				showPlayer(player);
				break;

			case 'startGame':
				room.players = room.players.slice();
				setTimeout(startGame, room.readyTime*1000, room, socket, data.text, userPlayer);
				showPreGame(room, data.text, userPlayer);
				showRoomStatus("gamestart", room);
				break;

			case 'playerTyped':
				var player = util.findPlayer(data.id, room.players);
				if (!player) return;
				player.typed(data.pos);
				break;

			case 'endGame':
				endGame();
				genStats(data.stats, room);
				break;

			case 'playerDisconnected':
				var i = util.findPlayerIndex(data.id, room.players);
				var player = room.players[i];
				room.players.splice(i,1); // remove from players
				player.typed(-1); // hide cursor
				document.getElementById(player.id).remove(); // Remove from lobby list
				break;

			default:
				break;
		}
	});

	socket.addEventListener('error', console.log);
}
