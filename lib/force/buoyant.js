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
		var f = new Vect3;
		if(arguments[0] instanceof Grain) {
			if(arguments.length == 1) {
				// Fully immersed in water
				var D = arguments[0].D;
				var V = (Math.PI / 6) * D * D * D;
				var g = this.g.len();
				var rhof = this.rho;
				var n = this.g.unit().neg();
				f = Vect3.mul(rhof * g * V, n);
			} else if(arguments.length == 2) {
				// Only in -gacc direction
				var D = arguments[0].D;
				var yf = arguments[1];
				var y = arguments[0].r.y;
				
				var V = 0;
				if(y < yf - 0.5 * D) {
					V = (Math.PI / 6) * D * D * D;
				} else if(yf - 0.5 * D <= y && y <= yf + 0.5 * D) {
					var dy = yf - y;
					var V1 = 0.25 * D * D * (dy + 0.5 * D);
					var V2 = -(1/3) * (dy * dy * dy + D * D * D / 8);
					V = Math.PI * (V1 + V2);
				} else {
					V = 0;
				}
				var g = this.g.len();
				var rhof = this.rho;
				var n = this.g.unit().neg();
				f = Vect3.mul(rhof * g * V, n);				
			} else if(arguments.length == 3) {
				// Make an angle with -gacc direction
				/*
				var xA = r.x + 0.5 * D;
				var yA = yFluid(xA, t);
				var xB = r.x - 0.5 * D;
				var yB = yFluid(xB, t);
				var rA = new Vect3(xA, yA, 0);
				var rB = new Vect3(xB, yB, 0);
				var rAB = Vect3.sub(rA, rB);
				var nAB = rAB.unit();
				var nG = GField.unit();
				var nGaccent = Vect3.cross(Vect3.cross(nG, nAB), nAB);
				var fB;
				var yff = yFluid(r.x, t);
				if(r.y < yff - 0.5 * D) {
					fB = (Math.PI / 6) * rhof * D * D * D * GField.len();
					nGaccent = Vect3.mul(-1, nG);
				} else if(yff - 0.5 * D <= r.y && r.y <= yff + 0.5 * D) {
					var dy = yff - r.y;
					var term1 = 0.25 * D * D * (dy + 0.5 * D);
					var term2 = -(1/3) * (dy * dy * dy + D * D * D / 8);
					fB = Math.PI * rhof * (term1 + term2) * GField.len();
				} else {
					fB = 0;
				}
				var FB = Vect3.mul(fB, nGaccent);
				*/
			}
		}
		return f;
	}
}

// Export module -- 20180602.1944 ok
module.exports = function() {
	return Buoyant;
};
