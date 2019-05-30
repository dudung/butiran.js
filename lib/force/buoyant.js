/*
	buoyant.js
	Buoyant force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180602
	Create this library from previous force.js library.
	20190630
	2000 Add dir for non-horizontal fluid surface.
*/

// Require classes
var Vect3 = require('../vect3')();

// Define class of Buoyant
class Buoyant {
	// Create constructor
	constructor() {
		// Set default fluid to water
		this.rho = 1000; // kg m^-3
		
		// Set default gravity
		this.g = new Vect3(0, 0, -10); // kg m s^-2
	}
	
	// Set fluid density
	setFluidDensity(rho) {
		this.rho = rho;
	}
	
	// Set gravity
	setGravity(g) {
		this.g = g;
	}
	
	// Calculate buoyant force due to immersed volume V
	force() {
		var V = arguments[0];
		var dir = this.g.neg();
		if(arguments.length > 1) {
			dir = arguments[1];
		}
		var rho = this.rho;
		var g = this.g.len();
		var f = Vect3.mul(dir, rho * g * V);
		return f;
	}
}

// Export module -- 20180602.1944 ok
module.exports = function() {
	return Buoyant;
};
