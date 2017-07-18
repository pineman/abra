/* General utility functions. */

'use strict';

const TRANSITION_TIME = 0.25; // in seconds

module.exports = {
	TRANSITION_TIME,
	
	RGB2hex: function (rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		let r = ("0" + parseInt(rgb[1]).toString(16)).slice(-2);
		let g = ("0" + parseInt(rgb[2]).toString(16)).slice(-2);
		let b = ("0" + parseInt(rgb[3]).toString(16)).slice(-2);
		return `#${r}${g}${b}`;
	},

	DOM: {
		transition: function (fromId, toId) {
			// TODO: pineman no understand :'(
			let fromScreen = document.getElementById(fromId),
				toScreen   = document.getElementById(toId);

			document.body.style.overflow = "hidden";

			fromScreen.style.transition = TRANSITION_TIME + "s";
			toScreen.style.transition   = TRANSITION_TIME + "s";
			fromScreen.classList.add("transition-out");
			toScreen.classList.add("transition-out");
			toScreen.style.display = "block";

			setTimeout(function () {
				fromScreen.style.display = "none";
				toScreen.classList.remove("transition-out");
				fromScreen.classList.remove("transition-out");

				setTimeout(function () {
					document.body.style.overflow = "auto";
				}, TRANSITION_TIME * 1000 + 50);
			}, TRANSITION_TIME * 1000 + 50);
		},

		clear: function (element) {
			element.innerHTML = '';
		},

		setTextOpacity: function (opacity) {
			document.getElementById("text").style.opacity = opacity.toString();
		},

		showRoomStatus: function (status) {
			document.getElementById("status").textContent = status;
		},

		showForceStart: function (onClick) {
			let link = document.querySelector("#force-start");
			link.style.display = "inline";
			if (typeof onClick === "function") {
				link.addEventListener("click", linkClick);
				function linkClick(e) {
					onClick(e);
					link.removeEventListener("click", linkClick);
				}
			}
		},

		hideForceStart: function () {
			document.querySelector("#force-start").style.display = "none";
		}
	},

	findPlayer: function (id, players) {
		return players.find(p => p.id === id);
	},

	findPlayerIndex: function (id, players) {
		return players.findIndex(p => p.id === id);
	}
}
