document.addEventListener("DOMContentLoaded", function () {
	generateBoxColors(document.getElementById("getcolor"));

	var startButton = document.getElementById("start-button");
	startButton.addEventListener("click", initPlayer);

	// Bind enter to start button
	document.getElementById("getname").addEventListener("keyup", function (e) {
		return (e.which === 13) ? startButton.click() : undefined;
	});
});

// Materialized colors
const COLORS = [
	"_f44336",
	"_e91e63",
	"_9c27b0",
	"_673ab7",
	"_3f51b5",
	"_2196f3",
	"_03a9f4",
	"_00bcd4",
	"_009688",
	"_4caf50",
	"_8bc34a",
	"_cddc39",
	"_ffeb3b",
	"_ffc107",
	"_ff9800",
	"_ff5722",
	"_795548",
	"_9e9e9e",
	"_607d8b",
	"_ffffff",
	"_000000"
];
const COOKIE_COLOR_CLASS = "userColorClass";

// Select other color
function selectMainColor() {
	var lastElement = document.querySelector("#getcolor > .selected-color");
	lastElement.classList.remove("selected-color");
	this.classList.add("selected-color");
	setCookie(COOKIE_COLOR_CLASS, this.value.replace("#","_"));
}

// Generate color selection boxes
function generateBoxColors(getcolor){
	var colorBox;
	var cachedColor = getCookie(COOKIE_COLOR_CLASS);

	var color;
	for (var i = 0; i < COLORS.length; i++) {
		color = COLORS[i].replace("_","#");
		colorBox = document.createElement("div");
		colorBox.onclick = selectMainColor;
		colorBox.addEventListener("click", selectMainColor);
		colorBox.value = color;
		colorBox.style.background = color;
		if (cachedColor === COLORS[i]) {
			colorBox.classList.add("selected-color");
		}
		getcolor.appendChild(colorBox);
	}

	// Set default color if not saved
	if (getcolor.getElementsByClassName("selected-color").length == 0) {
		getcolor.children[0].classList.add("selected-color");
	}
}
