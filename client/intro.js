// Materialized colors
const COLORS = [
	"#f44336",
	"#e91e63",
	"#9c27b0",
	"#673ab7",
	"#3f51b5",
	"#2196f3",
	"#03a9f4",
	"#00bcd4",
	"#009688",
	"#4caf50",
	"#8bc34a",
	"#cddc39",
	"#ffeb3b",
	"#ffc107",
	"#ff9800",
	"#ff5722",
	"#795548",
	"#9e9e9e",
	"#607d8b",
	"#ffffff",
	"#000000"
];

// Select other color
function selectMainColor(argument) {
	var lastElement = document.querySelector("#getcolor > .selected-color");
	if (lastElement) {
		// Deactivate last selected color
		lastElement.className = "";
	}
	this.className = "selected-color";
}

// Generate color selection boxes
function generateBoxColors(getcolor){
	var colorBox;
	for (var i = 0; i < COLORS.length; i++) {
		colorBox = document.createElement("div");
		colorBox.onclick = selectMainColor;
		colorBox.style.background = COLORS[i];
		getcolor.appendChild(colorBox);
	}
}
