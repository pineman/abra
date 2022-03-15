'use strict';

import express from 'express';
import expressWs from 'express-ws';

import * as abra from './server/abra.js'

const PORT = 2272;
const WS_PATH = '/abra';

const app = express();
expressWs(app);

app.ws(WS_PATH, function(ws, req) {
	abra.manageEvents(ws);
});

app.use(express.static('client/bundle'))

app.listen(PORT);
console.log(`Abra running on http://localhost:${PORT}`);
