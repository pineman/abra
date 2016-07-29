const STATS_PRECISION = 3;

function calcStats(data, room) {
	var stats = [];

	for (var i = 0; i < data.length; i++ ) {
		var curPlayer = [];
		curPlayer.color = data[i].color;
		curPlayer[0] = data[i].name;
		curPlayer[1] = data[i].time.toFixed(STATS_PRECISION);
		curPlayer[2] = (room.wordCount / (data[i].time / 60)).toFixed(STATS_PRECISION);
		curPlayer[3] = data[i].errors;
		stats.push(curPlayer);
	}
	//stats.sort((p1, p2) => p1[1] - p2[1]); // ES6
	stats.sort(function (p1, p2) {return p1[1] - p2[1]});

	return stats;
}

function genStats(stats) {
	var table = document.getElementById("stats-table").tBodies[0];

	for (var row = 0; row < stats.length; row++) {
		var tr = table.insertRow();
		tr.classList.add("border-bottom");
		tr.style.borderBottomColor = stats[row].color;
		var td = tr.insertCell();
		td.textContent = row + 1;

		for (var col = 0; col < stats[row].length; col++) {
			var td = tr.insertCell();
			if (col === 0) td.style.color = stats[row].color;
			td.textContent = stats[row][col];
		}
	}
}
