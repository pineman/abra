/* ------------------------------------------------------------ */
// HTTP server
var PORT = process.argv[2] || 80;

const app = require('http').createServer(handler)
const fs = require('fs');

app.listen(PORT);

function handler(req, res) {
  fs.readFile(getFileName(req.url), function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + getFileName(req.url));
    }
    res.writeHead(200);
    res.end(data);
  });
}

// |-|4xX0rzZ
var base = __dirname.split("/").slice(0, -1).join("/") + "/client";
function getFileName(url) {
  return base + (url === "/" ? "/index.html" : url);
}


/* ------------------------------------------------------------ */
// socket.io
const io = require('socket.io')(app);

const ROOM_TIMEOUT = 30;
const MAX_PER_ROOM = 5;

var texts = require('./texts.js');

var Player = function (name, color, id) {
	this.name = name;
	this.color = color;
	this.id = color; // the player's socket.id
	this.pos = 0; // index in the text string
};

var Room = function (id) {
	this.id = id;
	this.players = [];
	this.numFinished = 0;
	this.timeLeft = ROOM_TIMEOUT;
	this.status = "open"; // open, closed
};

var rooms = [];

// Algorithm to find an open room
function findRoom() {
	for (var i = 0; i < rooms.length; i++) {
		if (rooms[i].status === "open")
			return rooms[i];
	};

	// No open room was found (undefined)
	return;
};

io.on('connection', function (socket) {
	// New player, find him a room
	socket.on('newplayer', function (data) {
		var newPlayer = new Player(data.name, data.color, data.id);
		var room = findRoom();

		if (room) {
			if (room.players.length === MAX_PER_ROOM - 1) {
				room.status = "closed";
			}
		} else {
			// No open room was found, create a new room whose
			// id is the first player's socket.id.
			// NOTE: socket.io already does this by default
			// http://socket.io/docs/rooms-and-namespaces/
			room = Room(socket.id);
			rooms.push(room);
		}

		socket.join(room);
		socket.emit("foundroom", room);
		room.players.push(newPlayer);
	});
});
