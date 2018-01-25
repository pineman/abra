// This module exports an object to log all the player's keypresses in an Array
// called 'keypressLogger.keypresses'

const keypressLogger = {
	// Initializes/resets this object's state
	start() {
		this.startTime = +new Date();
		this.keypresses = [];
	},

	// Registers a good or a bad keypress in the 'keypresses' Array
	logKeypress({good, char}) {
		this.keypresses.push({
			good,
			char,
			time: +new Date() - this.startTime
		});
	},

	toString() {
		return JSON.stringify(this.keypresses);
	},

    drawGraph(svg) {
        let data = [
            {x: 0, y: 100},
            {x: 100, y: 20},
            {x: 200, y: 240},
            {x: 300, y: 200},
            {x: 400, y: 220},
            {x: 500, y: 180}
        ].map(p => ({x: p.x / 600, y: p.y / 300}));
        console.log(data);
        let polylinePts = [{x: 0, y: 0.8}].concat(data, {x: 0.8, y: 0.8});
        let width = parseInt(window.getComputedStyle(svg).width);
        let height = parseInt(window.getComputedStyle(svg).height);
        polylinePts = polylinePts.map(p => ({x: p.x * width, y: p.y * height}));
        let pointsAttr = polylinePts.map(p => `${p.x} ${p.y}`).join(", ");
        let polyline = svg.getElementById("polyline");
        console.log(pointsAttr);
        polyline.setAttribute("points", pointsAttr);
    }
}

keypressLogger.start();

module.exports = keypressLogger;
