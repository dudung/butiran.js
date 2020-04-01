/*
	iopars.js
	Read parameters from and write it to a textarea.
	
	Sparisoma Viridi | https://github.com/dudung
	
	20200401
	1644 Create this first time for nispm.js in butiran app.
	1750 Add clearT() following clearX() functions.
	1755 Finish move function from nispm.js to here.
	1942 Move info() to nispm.js since it is not general.
*/


// Write to textarea
function tout() {
	var taIn = arguments[0];
	var lines = arguments[1];
	taIn.value += lines;
	taIn.scrollTop = taIn.scrollHeight;
}


// Read matriks preceeded by a keyword from a textarea
function readMatrix() {
	var taIn = arguments[0];
	var key = arguments[1];
	var lines = taIn.value.split("\n");
	var N = lines.length;
	var beg = -1;
	var end = -1;
	for(var i = 0; i < N; i++) {
		if(key == lines[i]) {
			beg = i + 1;
		};
		if(beg > -1 && lines[i].length == 0) {
			end = i;
			break;
		}
	}
	
	var M = [];
	for(var i = beg; i < end; i++) {
		var cols = lines[i].split(" ");
		var Nc = cols.length;
		var row = [];
		for(var c = 0; c < Nc; c++) {
			var m = parseFloat(cols[c]);
			row.push(m);
		}
		M.push(row);
	}
	
	return M;
}


// Read single value preceeded by a keyword
function readValue() {
	var taIn = arguments[0];
	var key = arguments[1];
	var lines = taIn.value.split("\n");
	var N = lines.length;
	var val;
	for(var i = 0; i < N; i++) {
		var cols = lines[i].split(" ");
		if(key == cols[0]) {
			if(cols.length == 2) {
				val = parseFloat(cols[1]);
			} else {
				var M = cols.length - 1;
				var arr = [];
				for(var j = 0; j < M; j++) {
					var x = parseFloat(cols[1 + j])
					arr.push(x);
				}
				val = arr;
			}
			break;
		}
	}
	return val;
}


// Clear canvas
function clearX() {
	var caOut = arguments[0];
	var cx = caOut.getContext("2d");
	cx.clearRect(0, 0, RANGE[2], RANGE[1]);
}


// Clear textarea
function clearT() {
	var taOut = arguments[0];
	taOut.value = "";
}


// Transform coordinates
function tr() {
	var z = arguments[0];
	var t = arguments[1];
	var zmin, zmax, ZMIN, ZMAX;
	if(t == 0) {
		zmin = range[0];
		zmax = range[2];
		ZMIN = RANGE[0];
		ZMAX = RANGE[2];
	} else if(t == 1) {
		zmin = range[1];
		zmax = range[3];
		ZMIN = RANGE[1];
		ZMAX = RANGE[3];
	}
	var Z = (z - zmin) / (zmax - zmin);
	Z *= (ZMAX - ZMIN);
	Z += ZMIN;
	return Z;
}


// Draw circle
function drawCircle() {
	var caOut = arguments[0];
	var x = arguments[1];
	var y = arguments[2];
	var d = arguments[3];
	var s = arguments[4];
	var f = arguments[5];
	
	var X = tr(x, 0);
	var Y = tr(y, 1);
	var R = tr(x + 0.5 * d, 0) - tr(x, 0);
	
	var cx = caOut.getContext("2d");
	cx.setLineDash([1, 0]);
	cx.lineWidth = 1;
	cx.fillStyle = f;
	cx.beginPath();
	cx.arc(X, Y, R, 0, 2 * Math.PI);
	cx.fill();
	cx.strokeStyle = s;
	cx.beginPath();
	cx.arc(X, Y, R, 0, 2 * Math.PI);
	cx.stroke();	
}


// Draw text
function drawText() {
	var caOut = arguments[0];
	var t = arguments[1];
	var x = arguments[2];
	var y = arguments[3];
	var c = arguments[4];
	var s = arguments[5];
	var h = arguments[6];
	var v = arguments[7];
	var cx = caOut.getContext("2d");
	cx.font = s + "px Times";
	cx.fillStyle = c;
	
	var X = tr(x, 0);
	var Y = tr(y, 1);
	if(h != undefined) {
		cx.textAlign = h;
	}
	if(v != undefined) {
		cx.textBaseline = v;
	}
	cx.fillText(t, X, Y);
}


// Draw a polyline
function drawPolyline() {
	var caOut = arguments[0];
	var xs = arguments[1];
	var ys = arguments[2];
	var lc = arguments[3];
	var lw = arguments[4];
	var ld = arguments[5];
	
	var Nx = xs.length;
	var Ny = ys.length;
	var N = Math.min(Nx, Ny);
	
	var cx = caOut.getContext("2d");
	cx.beginPath();
	cx.strokeStyle = lc;
	cx.lineWidth = lw;
	cx.setLineDash(ld);
	for(var i = 0; i < N; i++) {
		var X = tr(xs[i], 0);
		var Y = tr(ys[i], 1);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
}

