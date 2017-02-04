/* General utility functions. */

'use strict';

module.exports = {
	RGB2hex: function (c) {
		c = c.substring(c.indexOf('(') + 1, c.indexOf(')')).split(',');
		let r = parseInt(c[0]).toString(16);
		let g = parseInt(c[1]).toString(16);
		let b = parseInt(c[2]).toString(16);
		return `#${r}${g}${b}`;
	},

	transition: function (fromId, toId) {
		// TODO: pineman no understand :'(
		let fromScreen = document.getElementById(fromId),
			toScreen   = document.getElementById(toId);

		document.body.style.overflow = "hidden";
		fromScreen.classList.add("transition-out");
		toScreen.classList.add("transition-out");
		document.getElementById(toId).style.display = "block";

		setTimeout(function () {
			document.getElementById(fromId).style.display = "none";
			toScreen.classList.remove("transition-out");
			fromScreen.classList.remove("transition-out");
		}, 250);
	},

	clear: function (element) {
		element.innerHTML = '';
	},

	findPlayer: function (id, players) {
		for (let i = 0; i < players.length; i++)
			if (players[i].id == id)
				return players[i];
	},

	findPlayerIndex: function (id, players) {
		for (let i = 0; i < players.length; i++)
			if (players[i].id == id)
				return i;
		return -1;
	},

	setTextOpacity: function (opacity) {
		document.getElementById("text").style.opacity = opacity.toString();
	},

	showRoomStatus: function (status) {
		document.getElementById("status").textContent = status;
	}
}
