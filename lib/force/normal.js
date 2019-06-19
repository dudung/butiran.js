/*
	normal.js
	Normal force for linear spring-dashpot model
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	gravitation.js libraries.
	Value of gamma and its implementation is still a subject
	for discussion.
	20190601
	1610 Change setConstant to setConstants.
	1903 Fix gamma term with sign of ksi.
	20190617
	1011 Change unit vector for ksidot term.
	1206 There is still a problem but unknown.
	2006 Add require of Box class.
	2049 Still error.
	0426 Bug found in determining n but not solution came up yet.
	0717 Can not found solution, still.
	0732 Can determine interaction side, but not yet overlap.
*/

// Require classes
var Vect3 = require('../vect3')();
var Grain = require('../grain')();
var Box = require('../box')();

// Define class of Normal
class Normal {
	// Create constructor
	constructor() {
		// Set default spring constant
		this.k = 10000; // N m^-1 
		
		// Set default damping constant
		this.gamma = 10; // N s m^-1
	}
	
	// Set constants
	setConstants(k, gamma) {
		this.k = k;
		this.gamma = gamma;
	}
	
	// Calculate normal force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(arguments[0] instanceof Grain &&
			arguments[1] instanceof Grain) {
			var D1 = arguments[0].D;
			var D2 = arguments[1].D;
			var r1 = arguments[0].r;
			var r2 = arguments[1].r;
			var r12 = Vect3.sub(r1, r2);
			var ur12 = r12.unit();
			var l12 = r12.len();
			var v1 = arguments[0].v;
			var v2 = arguments[1].v;
			var v12 = Vect3.sub(v1, v2);
			var uv12 = v12.unit();
			
			var k = this.k;
			var gamma = this.gamma;
			
			var R12 = 0.5 * (D1 + D2);
			var ksi = Math.max(0, R12 - l12);
			var ksidot = v12.len() * Math.sign(ksi);
			
			var fr = Vect3.mul(k * ksi, ur12);
			var fv = Vect3.mul(-gamma * ksidot, uv12);
			f = Vect3.add(fr, fv);
		} else if(arguments[0] instanceof Grain &&
			arguments[1] instanceof Box) {
			var D1 = arguments[0].D;
			var r1 = arguments[0].r;
			var v1 = arguments[0].v;
			
			var n = [];
			var b = arguments[1];
			var r2 = b.r;
			var n1 = b.s[0].unit(); n.push(n1);
			var n2 = b.s[1].unit(); n.push(n2);
			var n3 = b.s[2].unit(); n.push(n3);
			var n4 = n1.neg(); n.push(n4);
			var n5 = n2.neg(); n.push(n5);
			var n6 = n3.neg(); n.push(n6);
			var r12 = Vect3.sub(r1, r2);
			var ur12 = r12.unit();
			
			var v2 = new Vect3;
			var v12 = Vect3.sub(v1, v2);
			var uv12 = v12.unit();
			
			var h = [];
			for(var i = 0; i < n.length; i++) {
				var stot = Vect3.add(b.s[0], b.s[1], b.s[2]);
				var rn = Vect3.dot(r12, n[i]);
				var hn = Math.abs(0.5 * Vect3.dot(stot, n[i]));
				h.push(rn - hn);
			}
			
			var hmin = h[0];
			var j = -1;
			for(var i = 1; i < h.length; i++) {
				if(h[i] < hmin) {
					hmin = h[i];
					j = i;
				}
			}
			
			var hs = [];
			for(var i = 0; i < h.length; i++) {
				hs.push(parseFloat(h[i].toFixed(3)));
			}
			console.log(hs);
			
			var ds = ["I", "R", "U", "F", "L", "D", "B"];
			var k = 0;
			for(var i = 0; i < h.length; i++) {
				if(h[i] > 0) {
					k = i + 1;
				}
			}
			console.log("side: " + ds[k]);
			
			if(j > -1) {
				var un = n[j];
				
				var stot = Vect3.add(b.s[0], b.s[1], b.s[2]);
				var shalf = Vect3.dot(stot, un);
				//var h12 = Math.abs(Vect3.dot(Vect3.sub(r12, shalf), un));
				//var ksi = Math.max(0, 0.5 * D1 - h12) * 0;
				
				//var k = this.k;
				//var gamma = this.gamma;
							
				//var ksidot = v12.len() * Math.sign(ksi) * 0;
				
				//var fr = Vect3.mul(k * ksi, ur12);
				//var fv = Vect3.mul(-gamma * ksidot, uv12);
				//f = Vect3.add(fr, fv);
			}
		}
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180603.1231 ok
module.exports = function() {
	return Normal;
};
