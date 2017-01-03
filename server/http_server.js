// HTTP server for development/test
'use strict';

const path = require('path');
const fs = require('fs');

let server = require('http').createServer(handler);
const port = process.argv[2] || 80;
server.port = port;
server.listen(port);

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

function getFileName(url) {
	let filename = (url === '/') ? 'index.html' : url;
	return path.join(__dirname, '..', 'client', filename);
}

module.exports = server;
