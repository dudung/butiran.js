/*
	veio.js
	Visual elements for input and output 
	
	Sparisoma Viridi | dudung@gmail.com
	
	20190617
	Create this library of functions as supporting gfhtgr app.
*/

// Require classes
var Vect3 = require('../vect3')();


// Clear a Textarea
function clearText() {
	var ta = arguments[0];
	ta.value = "";
}


// Clear canvas
function clearCanvas() {
	var ca = arguments[0];
	var width = ca.width;
	var height = ca.height;
	var cx = ca.getContext("2d");
	cx.clearRect(0, 0, width, height);
}


// Add text to a textarea
function addText() {
	var text = arguments[0];
	var result = {
		to: function() {
			var ta = arguments[0];
			ta.value += text;
			ta.scrollTop = ta.scrollHeight;
		}
	};
	return result;
}


// Get parameter value from a Textarea
function getValue() {
	var key = arguments[0];
	var result = {
		from: function() {
			var ta = arguments[0];
			var lines = ta.value.split("\n");
			var Nl = lines.length;
			for(var l = 0; l < Nl; l++) {
				var words = lines[l].split(" ");
				var Nw = words.length;
				var value;
				if(words[0].indexOf(key) == 0) {
					if(Nw == 2) {
						value = parseFloat(words[1]);
					} else if(Nw == 4) {
						value = new Vect3(
							parseFloat(words[1]),
							parseFloat(words[2]),
							parseFloat(words[3])
						);
					} else if(Nw == 3) {
						value = [];
						value.push(parseFloat(words[1]));
						value.push(parseFloat(words[2]));
					}
					return value;
				}
			}
		}
	};
	return result;	
}


// Export module -- 20190617.0902 test
module.exports = {
	clearText: function() {
		return clearText(arguments[0])
	},
	clearCanvas: function() {
		return clearCanvas(arguments[0])
	},
	addText: function() {
		return addText(arguments[0])
	},
	getValue: function() {
		return getValue(arguments[0])
	},
};
