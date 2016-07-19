/* Global io */

var COLORS = [
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
]
var mainColor = COLORS[COLORS.length - 1]

function selectMainColor (){
	var lastElement = document.querySelector("#getcolor > .selected")
	if( lastElement )
		lastElement.className = "";
	this.className = "selected";

}


window.addEventListener("load",function() {
	//Select Main Color
	var element = document.getElementById("getcolor");
	var colorbox;
	for (var i = 0; i < COLORS.length; i++) {
		colorbox = document.createElement("div")
		colorbox.style.background = COLORS[i]
		colorbox.value = COLORS[i]
		colorbox.onclick = selectMainColor
		element.appendChild(colorbox)
	}
	colorbox.className = "selected"

	//Join Game
	document.getElementById("start").onclick = function(){
		var socket = io(window.location.href)
		socket.emit("newplayer",{
			name : document.querySelector("#getname > input").value,
			color : mainColor
		})
	}
})