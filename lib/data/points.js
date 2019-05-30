/*
	points.js
	Points of x and y (and z) data
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190530
	1215 Create this library based on lib/math/path
*/

// Define class of Points
class Points {
	
	// Define constructor
	constructor() {
		this.data = [];
	}
	
	addSeries() {
		this.data.push(arguments[0]);
	}
}

// Export module -- 20190530.1227 ok
module.exports = function() {
	return Points;
};
