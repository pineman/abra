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

// Color selected by user
var mainColor = COLORS[ COLORS.lenght - 1 ];

// Select other color 
function selectMainColor(argument) {
	var lastElement = document.getElementById("#getcolor > .selected");
	if( lastElement )
		lastElement.className = "";
	this.className = "selected";
	mainColor = this.value;
}

// Show colors selection box
function generateBoxColors(parent){
	var colorBox;
	for (var i = 0; i < COLORS.length; i++) {
		colorBox = document.createElement("div");
		colorBox.value = COLORS[i];
		colorBox.onclick = selectMainColor;
		colorBox.style.background = COLORS[i];
		parent.appendChild(colorBox);
	}
	colorBox.className = "selected";
}
