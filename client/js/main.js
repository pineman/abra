/* Entry point. */

'use strict'

const util = require('./util.js');
const game = require('./game.js');
const Player = require('./Prototype.js').Player;
const Room = require('./Prototype.js').Room;

const STORE_USER_COLOR= "userColor";
const COLOR_PALETTE_LENGTH = 21;

function setupColorBox(colorBox) {
	let box;
	for (let i = 0; i < COLOR_PALETTE_LENGTH; i++) {
		box = colorBox.children[i];
		box.addEventListener("click", function () {
			// Color selection handler.
			let prevColor = document.querySelector("#color-box > .selected-color");
			prevColor.classList.remove("selected-color");

			this.classList.add("selected-color");
			window.localStorage.setItem(STORE_USER_COLOR, this.value);
		});
		box.value = i;
	}

	let cachedColor = window.localStorage.getItem(STORE_USER_COLOR);
	// Choose a random color if there was no color stored previously.
	if (!cachedColor) {
		cachedColor = Math.floor(Math.random() * COLOR_PALETTE_LENGTH);
	}
	colorBox.children[cachedColor].classList.add("selected-color");
}

function initGame() {
	let selectedColor = document.querySelector("#color-box > .selected-color");
	let color = util.RGB2hex(window.getComputedStyle(selectedColor)
				.getPropertyValue('background-color'));

	let user = new Player(
		document.querySelector("#getname").value,
		color,
		Player.USER_ID
	);

	util.transition("intro", "game");
	game.gameLoop(user);
}

function main() {
	// Remember the user's last color and add `click()` event listeners to
	// each box.
	let colorBox = document.getElementById("color-box");
	setupColorBox(colorBox);

	// Bind Enter inside the <input> to START button
	var getname = document.getElementById("getname");
	getname.addEventListener("keyup", function (e) {
		if (e.key == "Enter") {
			startButton.click();
		}
	});
	getname.focus();

	// Bind the start button to initGame()
	let startButton = document.getElementById("start-button");
	startButton.addEventListener("click", function () {
		initGame();
	});
}

document.addEventListener('DOMContentLoaded', function () {
	main();
});
