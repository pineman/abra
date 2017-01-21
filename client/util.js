var util = {
	hexToRGBA: function (color, opacity) {
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
		//return `rgba(${r},${g},${b},${opacity})`; // ES6
		return "rgba(${r},${g},${b},${opacity})".replace("${r}", r)
		                                        .replace("${g}", g)
		                                        .replace("${b}", b)
		                                        .replace("${opacity}", opacity);
	},

	hide: function (id) {
		document
		.getElementById(id).style.display = "none";
	},

	show: function (id) {
		document.getElementById(id).style.display = "block";
	},

	transition: function (fromId, toId) {
		var fromScreen = document.getElementById(fromId),
			toScreen   = document.getElementById(toId);

		fromScreen.classList.add("transition-out");
		toScreen.classList.add("transition-out");
		util.show(toId);

		setTimeout(function () {
			util.hide(fromId);
			toScreen.classList.remove("transition-out");
		}, 250);
	},

	findPlayer: function (id, players) {
		for (var i = 0; i < players.length; i++)
			if (players[i].id == id)
				return players[i];
	},
	findPlayerIndex: function (id, players) {
		for (var i = 0; i < players.length; i++)
			if (players[i].id == id)
				return i;
		return -1;
	},

	getCookie: function (key) {
		var name = key + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length,c.length);
			}
		}
		return "";
	},
	setCookie: function (key, value) {
		var d = new Date();
		var exdays = 2; // number of days until cookie expires
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = key + "=" + value + "; " + expires;
	},
};