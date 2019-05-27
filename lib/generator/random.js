/*
	random.js
	Generate random number
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180302
	Create this library of functions.
	20180520
	Add module.export for ES module support.
*/

// Generate int \in [min, max]
function randInt(min, max) {
	var x = Math.random() * (max - min) + min;
	x = Math.round(x);
	return x;
}

// Generate array of N number of int
function randIntN(min, max, N) {
	var x = [];
	for(var i = 0; i < N; i++) {
		x.push(randInt(min, max));
	}
	return x;
}

// Export module -- 20180520.0724 ok
module.exports = {
	randInt: function(min, max) {
		return randInt(min, max);
	},
	randIntN: function(min, max, N) {
		return randIntN(min, max, N);
	}
};
