/*
	parse.js
	Parse key and value pair
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180618
	Create this library of functions.
	20180619
	Get column from multiline text.
	20180627
	Add new function for handling 4 parameters in a line.
	20190602
	1736 Try to recover missing getFrom().valueBetween().
*/

// Require classes
var Vect3 = require('../vect3')();

// Get value of related key from multi line text with '\n'
function getFrom(text) {
	var par = {
		valueOf: function(key) {
			var lines = text.split('\n');
			var N = lines.length;
			var val;
			for(var i = 0; i < N; i++) {
				var j = lines[i].indexOf(key);
				if(j != -1) {
					var cols = lines[i].split(' ');
					var M = cols.length;
					if(M == 2) {
						val = parseFloat(cols[1]);
					} else if(M == 4) {
						var x = parseFloat(cols[1]);
						var y = parseFloat(cols[2]);
						var z = parseFloat(cols[3]);
						val = new Vect3(x, y, z)
					} else if(M == 5) {
						val = [
							parseFloat(cols[1]),
							parseFloat(cols[2]),
							parseFloat(cols[3]),
							parseFloat(cols[4])
						];
					}
				}
			}
			return val;
		},
		column: function(jcol) {
			var lines = text.split('\n');
			var N = lines.length;
			var val = [];
			for(var i = 0; i < N; i++) {
				var cols = lines[i].split(" ");
				val.push(parseFloat(cols[jcol]));
			}
			return val;
		},
		valueBetween: function(beg, end) {
			var lines = text.split('\n');
			var N = lines.length;
			var val = [];
			
			var iBeg, iEnd;
			for(var i = 0; i < N; i++) {
				if(lines.indexOf(beg) == 0) {
					iBeg = i;
				}
				if(lines.indexOf(end) == 0) {
					iEnd = i;
				}
			}
			
			for(var i = Beg + 1; i < iEnd-1; i++) {
				var cols = lines[i].split(" ");
				
			}
			
			// For testing only
			val.push(0); val.push(0); val.push(0);
			val.push(1); val.push(0); val.push(0);
			val.push(2); val.push(0); val.push(0);
			return val;
		},
	};
	return par;
}

// Export module
module.exports = {
	getFrom: function(text) {
		return getFrom(text)
	},
};
