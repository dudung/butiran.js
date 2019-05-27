/*
	transformation.js
	Simple coordinates transformation
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180221
	Create as a part of Chart2 class.
	20180618
	Move to this separate file for more broader use.
*/

// Transform linearly coordinate from real to screen
function linearTransform(x, src, dest) {
	// Get range of src and dest coordinates
	var xmin = src[0];
	var xmax = src[1];
	var XMIN = dest[0];
	var XMAX = dest[1];
	
	// Perform transformation
	var M = (XMAX - XMIN) / (xmax - xmin);
	var X = (x - xmin) * M + XMIN;
	
	return X;
}

// Export module -- 20180618.1133 ok
module.exports = {
	linearTransform: function(x, src, dest) {
		return linearTransform(x, src, dest);
	},
};
