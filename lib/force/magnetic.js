/*
	magnetic.js
	Magnetic force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	electrostatic.js libraries.
*/

// Require classes
var Vect3 = require('../vect3')();
var Grain = require('../grain')();

// Define class of Magnetic
class Magnetic {
	// Create constructor
	constructor() {
		// Set magnetic constant
		// with mu0 = 1.25663706E-6; // m kg s^-2 A^-2
		// and k = mu0 / 4 pi
		this.k = 1E-7; // T m A^-1
				
		// Set default magnetic field
		this.B = new Vect3(1, 0, 0); // T
	}
	
	// Set magnetic field
	setField(B) {
		this.B = B;
		delete this.k;
	}
	
	// Set magnetic constant
	setConstant(k) {
		this.k = k;
		delete this.B;
	}
	
	// Calculate magnetic force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(this.B != undefined) {
			if(arguments[0] instanceof Grain) {
				var q = arguments[0].q;
				var v = arguments[0].v;
				var B = this.B;
				f = Vect3.mul(q, Vect3.cross(v, B));				
			}
		} if(this.k != undefined) {
			if(arguments[0] instanceof Grain &&
				arguments[1] instanceof Grain) {
				var q1 = arguments[0].q;
				var q2 = arguments[1].q;
				var r1 = arguments[0].r;
				var r2 = arguments[1].r;
				var r12 = Vect3.sub(r1, r2);
				var l12 = r12.len();
				var v1 = arguments[0].v;
				var v2 = arguments[1].v;
				var k = this.k;
				var v1v2r12 = Vect3.cross(v1, Vect3.cross(v2, r12))
				f = Vect3.mul(k * q1 * q2 / (l12 * l12), v1v2r12);
			}
		}
		
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180603.1432 ok
module.exports = function() {
	return Magnetic;
};
