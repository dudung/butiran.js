/*
	path.js
	Path in the form of straight line or circular arc
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190529
	0838 Create this library based on lib/math/polynomial
	0934 Test and works. Add color c.
*/

// Define class of Path
class Path {
	
	// Define constructor
	constructor() {
		this.qi = arguments[0];
		this.qf = arguments[1];
		this.l = arguments[2];
		this.c = arguments[3];
	}
	
	// Set initial angle
	setQi() {
		this.qi = arguments[0];
		this.calcOrder();
	}
	
	// Set final angle
	setQf() {
		this.qf = arguments[0];
	}
	
	// Set angles
	setQ() {
		this.qi = arguments[0];
		this.qf = arguments[1];
	}
	
	// Set length
	setL() {
		this.l = arguments[0];
	}
	
	// Set color
	setL() {
		this.c = arguments[0];
	}
}

// Export module -- 20190529.0848 ok
module.exports = function() {
	return Path;
};
