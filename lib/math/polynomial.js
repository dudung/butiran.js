/*
	polynomial.js
	Polynomial function of one variable
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180301
	Create this library and tested.
	20180519
	Fix unnecessary typo and implement node.js module.exports
	command.
	20180520
	Add comments and adjust export format as sequence.js script.
	Modify constructor by introducing single coefs with 0 value
	to avoid error in calculating polynomial order.
*/

// Define class of Polynomial
class Polynomial {
	
	// Define constructor
	constructor(coefs) {
		this.coefs = [0];
		this.order = 0;
		if(arguments.length > 0) {
			this.coefs = coefs;
			this.calcOrder();			
		}
	}
	
	// Calculate order of polynomial
	calcOrder() {
		var N = this.coefs.length;
		this.order = N;
	}
	
	// Set coefficients
	setCoefs(coefs) {
		this.coefs = coefs;
		this.calcOrder();
	}
	
	// Get coefficients
	getCoefs() {
		return this.coefs;
	}
	
	// Get value of function
	value(x) {
		var xn = 1;
		var f = 0;
		var N = this.order;
		for(var i = 0; i < N; i++) {
			var df = this.coefs[i] * xn;
			f += df;
			xn *= x;
		}
		return f;
	}
}

// Export module -- 20180520.0647 ok
module.exports = function() {
	return Polynomial;
};
