const fs = require("fs")
const lines = fs.readFileSync("texts.txt", "ascii").split("\n");
let texts = [];
for (var i = 0; i < lines.length; i++) {
	if( !/(^#|^\s*$)/.test(lines[i]) ){
		// regex to see if line starts with # or is empty
		texts.push(lines[i])
	}
};

// Select a random text
function getText() {
	let rand = Math.floor(Math.random() * texts.length);
	return texts[rand];
}

module.exports = {getText, texts}