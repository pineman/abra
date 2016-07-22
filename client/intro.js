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

// Select other color
function selectMainColor() {
	var lastElement = document.querySelector("#getcolor > .selected-color");
	lastElement.classList.remove("selected-color");
	this.classList.add("selected-color");
}

// Generate color selection boxes
function generateBoxColors(getcolor){
	var colorBox;
	for (var i = 0; i < COLORS.length; i++) {
		colorBox = document.createElement("div");
		colorBox.onclick = selectMainColor;
		colorBox.classList.add(COLORS[i]);
		colorBox.style.background = COLORS[i];
		colorBox.value = COLORS[i];
		getcolor.appendChild(colorBox);
	}
	getcolor.children[0].classList.add("selected-color");
}
