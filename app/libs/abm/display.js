/*
	display.js
	Display matrix in abm-odm
	
	Sparisoma Viridi | https://github.com/dudung/abm-x
	
	20200604
	1927 Create this.
	2012 Paint a matrix on a canvas.
	2022 Draw grid over the painted matrix.
	0615 Extend color for agents.
*/

// Define matrix pixel size
var matrixPixelSize = 10;


// Define colors for matrix painting
var matrixColor = [
	"#ccc", // 00 Wall
	"#fff", // 01 Empty space
	"#ccf", // 02 Empty space type 1
	"#cfc", // 03 Empty space type 2
	"#fcc", // 04 Empty space type 3
	"#ffc", // 05 Empty space type 4
	"#fcf", // 06 Empty space type 5
	"#cff", // 07 Empty space type 6
	"#000", // 08
	"#000", // 09
	"#000", // 10
	"#000", // 11
	"#00f", // 12 Empty space type 1
	"#0f0", // 13 Empty space type 2
	"#f00", // 14 Empty space type 3
	"#ff0", // 15 Empty space type 4
	"#f0f", // 16 Empty space type 5
	"#0ff", // 17 Empty space type 6
];


// Display Matrix class by painting it in canvas
function paintMatrix() {
	var x = arguments[0];
	var m = x.m;
	var rows = x.rows;
	var cols = x.cols;

	var o = {
		onCanvas: function() {
			var id = arguments[0];
			var can = document.getElementById(id);
			var cx = can.getContext("2d");
			
			var dx = matrixPixelSize;
			var dy = matrixPixelSize;
			
			for(var r = 0; r < rows; r++) {
				for(var c = 0; c < cols; c++) {
					
					var x = c * dx;
					var y = r * dy;
					var cval = m[r][c];
					var color = matrixColor[cval];
					cx.fillStyle = color;
					cx.beginPath();
					cx.fillRect(x, y, x + dx, y + dy);
					cx.fill();
					
					cx.strokeStyle = "#fff";
					cx.lineWidth = 0.2;
					cx.beginPath();
					cx.rect(x, y, x + dx, y + dy);
					cx.stroke();
				}
			}			
		}
	};
	
	return o;
}

