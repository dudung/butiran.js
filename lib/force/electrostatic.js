/*
	electrostatic.js
	Electrostatic force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	gravitation.js libraries.
*/

// Require classes
var Vect3 = require('../vect3')();
var Grain = require('../grain')();

// Define class of Electrostatic
class Electrostatic {
	// Create constructor
	constructor() {
		// Set Coulomb's constant
		this.k = 8.987551787E9; // N m^2 C^-2 
		
		// Set default electrostatic field
		this.E = new Vect3(1, 0, 0); // N C^-1
	}
	
	// Set electrostatic field
	setField(E) {
		this.E = E;
		delete this.k;
	}
	
	// Set Coulomb's constant
	setConstant(k) {
		this.k = k;
		delete this.E;
	}
	
	// Calculate gravitational force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(this.E != undefined) {
			if(arguments[0] instanceof Grain) {
				var q = arguments[0].q;
				var E = this.E;
				f = Vect3.mul(q, E);				
			}
		} if(this.k != undefined) {
			if(arguments[0] instanceof Grain &&
				arguments[1] instanceof Grain) {
				var q1 = arguments[0].q;
				var q2 = arguments[1].q;
				var r1 = arguments[0].r;
				var r2 = arguments[1].r;
				var r12 = Vect3.sub(r1, r2);
				var u12 = r12.unit();
				var l12 = r12.len();
				var k = this.k;
				f = Vect3.mul(k * q1 * q2 / (l12 * l12), u12);
			}
		}
		
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180603.1155 ok
module.exports = function() {
	return Electrostatic;
};
