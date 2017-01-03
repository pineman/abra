const config = {
	SOCKETIO_PORT: 6666,

	ROOM_TIMEOUT: 30, // seconds
	MAX_PLAYERS_PER_ROOM: 2,
	ROOM_STATUS_CLOSED: 0,
	ROOM_STATUS_OPEN: 1,

	STATS_PRECISION: 3,
	WORD_SIZE: 4
};

module.exports = config;
