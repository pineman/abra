function hexToRGBA(color, opacity) {
	color = color.substring(1);
	var r, g, b;
	if (color.length === 6) {
		r = parseInt(color.substr(0,2), 16);
		g = parseInt(color.substr(2,2), 16);
		b = parseInt(color.substr(4,2), 16);
	} else if (color.length === 3 ) {
		r = parseInt(color.substr(0,1), 16) * 16 + 15;
		g = parseInt(color.substr(1,1), 16) * 16 + 15;
		b = parseInt(color.substr(2,1), 16) * 16 + 15;
	}
	//return `rgba(${r},${g},${b},${opacity})`;
	return "rgba(${r},${g},${b},${opacity})".replace("${r}",r).replace("${g}",g).replace("${b}",b).replace("${opacity}",opacity);
}

function hide(id) {
	document.getElementById(id).style.display = "none";
}

function show(id) {
	document.getElementById(id).style.display = "block";
}

function findPlayer(id, players) {
	for (var i = 0; i < players.length; i++)
		if (players[i].id == id)
			return players[i];
	return false;
}
