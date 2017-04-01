/* General utility functions. */

'use strict';

const TRANSITION_TIME = "0.25s";

module.exports = {
	RGB2hex: function (rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		let r = ("0" + parseInt(rgb[1]).toString(16)).slice(-2);
		let g = ("0" + parseInt(rgb[2]).toString(16)).slice(-2);
		let b = ("0" + parseInt(rgb[3]).toString(16)).slice(-2);
		return `#${r}${g}${b}`;
	},

	transition: function (fromId, toId) {
		// TODO: pineman no understand :'(
		let fromScreen = document.getElementById(fromId),
			toScreen   = document.getElementById(toId);

		document.body.style.overflow = "hidden";
		fromScreen.style.transition = TRANSITION_TIME;
		toScreen.style.transition = TRANSITION_TIME;
		fromScreen.classList.add("transition-out");
		toScreen.classList.add("transition-out");
		toScreen.style.display = "block";

		setTimeout(function () {
			fromScreen.style.display = "none";
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
