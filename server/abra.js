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

var texts = require('./texts.js');
var player = {};
//var room = {};
//var rooms = [];

io.on('connection', function (socket) {
	socket.on('newplayer', function (data) {
		player.name = data.name;
		player.color = data.color;
	});
});
