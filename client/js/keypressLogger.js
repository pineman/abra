// This module exports an object to log all the player's keypresses in an Array
// called 'keypressLogger.keypresses'

const GRAPH_XY_OFFSET = 10;

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
		let keypressesTime = this.keypresses.filter(k => k.good)
											.map(k => k.time);
		let timeBetweenKeypresses = listDelta(keypressesTime);
		let speeds = timeBetweenKeypresses.map(millisecondsToWPM);
		let averagedSpeeds = movingAverage(speeds, 4);

		let polyWidth = svg.viewBox.baseVal.width - 10;
		let polyHeight = svg.viewBox.baseVal.height - 10;

		// Fine... printf debugging...
		console.log("-------------------------------")
		console.log(`keypressesTime = ${keypressesTime}`);
		console.log(`averagedSpeeds = ${averagedSpeeds.map(t => t.toFixed(2)).join(";")}`);
		console.log(`polyWidth = ${polyWidth}`);
		console.log(`polyHeight = ${polyHeight}`);
		console.log("-------------------------------")

		// Let's make an array of SVGPoints to put in polyline.points
		let points = ((xs, ys, targetWidth, targetHeight) => {
			let xMax = Math.max(...xs);
			let yMax = Math.max(...ys);
			return xs.map((x, i) => {
				let point = svg.createSVGPoint();
				point.x = (x / xMax) * targetWidth;
				point.y = (1 - (ys[i] / yMax)) * targetHeight;
				return point
			});
		})(keypressesTime.slice(0, -4), averagedSpeeds, polyWidth, polyHeight);

		console.dir(points);

		let polyline = svg.getElementById("polyline");
		polyline.points.clear();
		polyline.points.appendItem((()=>{let p = svg.createSVGPoint(); p.x = 0; p.y = 100; return p})());
		points.forEach(p => polyline.points.appendItem(p));
		polyline.points.appendItem((()=>{let p = svg.createSVGPoint(); p.x = 210; p.y = points[points.length-1].y; return p})());
		polyline.points.appendItem((()=>{let p = svg.createSVGPoint(); p.x = 210; p.y = 100; return p})());
	}
}

keypressLogger.start();

// Utilities

/**
 * Calculates the difference between consecutive list elements
 */
function listDelta (array) {
	let result = [];
	for (let i = 0; i < array.length - 1; i++) {
		result[i] = array[i+1] - array[i];
	}
	return result;
}

/**
 * Make a running average
 */
 function movingAverage(data, n) {
  let curSum = data.slice(0, n).reduce((a,b) => a + b, 0);
  let result = [curSum / Math.min(n, data.length)];
  for (let i = n; i < data.length; i++) {
	curSum -= data[i-n];
	curSum += data[i];
	result.push(curSum / n);
  }
  return result;
}

/**
 * How many "Words Per Minute" (WPM) would one type if it took exactly `charMs`
 * milliseconds to type each character?
 */
 function millisecondsToWPM (charMs) {
	 const WORD_LENGTH = 5; // https://en.wikipedia.org/wiki/Words_per_minute
	 let wordTimeSeconds = charMs/1000 * WORD_LENGTH;
	 return 60 / wordTimeSeconds;
 }

module.exports = keypressLogger;
