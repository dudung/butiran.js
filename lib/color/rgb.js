/*
	rgb.js
	Conversion from and to RBG color format
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180107
	Create this library of functions.
	20180520
	Add module.export for ES module support, tested and ok.
*/

// Convert integer to RGB color format
function int2rgb(r, g, b) {
	var B = (b).toString(16);
	var G = (g).toString(16);
	var R = (r).toString(16);
	if(B.length < 2) B = "0" + B;
	if(G.length < 2) G = "0" + G;
	if(R.length < 2) R = "0" + R;
	var hexColor = "#" + R + G + B;
	return hexColor;
}

// Convert double to RGB color format
function double2rgb(r, g, b) {
	var B = Math.round(b * 255);
	var G = Math.round(g * 255);
	var R = Math.round(r * 255);
	var hexColor = int2rgb(R, G, B);
	return hexColor;
}

// Export module
module.exports = {
	int2rgb: function(r, g, b) {
		return int2rgb(r, g, b)
	},
	double2rgb: function(r, g, b) {
		return double2rgb(r, g, b);
	}
};
