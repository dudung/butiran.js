/*
	abmdif.js
	Particles diffusion using agent-based model
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	Freddy Haryanto
	
	20190808 Start from cppcmf.js app.
	1020 W matrix ok.
	1027 Output time stamp ok.
	1040 Get drawMatrixOnCanvas() from vratcabm.
	1056 Fin coloring of three types of particles.
	1113 Generating three types of particles randomly ok.
	1118 Remove draw() frin cppcmf.js (template).
	1137 Agents can move, but only blue.
	1608 Add second canvas for simple chart.
	1610 Try to implement series and chart from vratcabm.
	1619 Test drawSeriesOnCanvas().
	1635 All seems ok.
*/

// Define global variables
var params;
var taIn, taOut, caOut, caOut2;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var digit;
var XMIN, XMAX, YMIN, YMAX;
var Numx, Numy, Btyp, Ntyp;
var Nums, N, Cofs, NumsL;
var W, A;
var colors, scen;
var series;

// Execute main function
main();


// Define main function
function main() {
	initParams();
	createVisualElements();
}


// Initialize parameters
function initParams() {
	var p = "";
	p += "# Iteration\n";
	p += "TBEG 0\n";
	p += "TEND 1000\n";
	p += "TSTP 1\n";
	p += "TDAT 1\n";
	p += "TPRC 20\n";
	p += "\n";
	p += "# Environment\n";
	p += "NUMX 40\n";
	p += "NUMY 20\n";
	p += "BTYP 1\n";
	p += "\n";
	p += "# Particles\n";
	p += "NTYP 2\n";
	p += "NUM1 100\n";
	p += "NUM2 100\n";
	p += "NUM3 100\n";
	p += "COF1 1\n";
	p += "COF2 2\n";
	p += "COF3 3\n";
	p += "\n";
	p += "# Scenario (0-4)\n";
	p += "SCEN 0\n";
	p += "\n";
	
	params = p;
	
	digit = 0;
}


// Load parameters
function loadParams() {
	clearText(taIn);
	addText(params).to(taIn);
}


// Read parameters
function readParams() {
	tbeg = getValue("TBEG").from(taIn);
	tend = getValue("TEND").from(taIn);
	dt = getValue("TSTP").from(taIn);
	Tdata = getValue("TDAT").from(taIn);
	Tproc = getValue("TPRC").from(taIn);
	
	Numx = getValue("NUMX").from(taIn);
	Numy = getValue("NUMY").from(taIn);
	Btyp = getValue("BTYP").from(taIn);
	Ntyp = getValue("NTYP").from(taIn);
	Nums = [];
	for(var i = 0; i < Ntyp; i++) {
		var j = i + 1;
		var num = getValue("NUM" + j).from(taIn);
		Nums.push(num);
	}
	Cofs = [];
	for(var i = 0; i < Ntyp; i++) {
		var j = i + 1;
		var cof = getValue("COF" + j).from(taIn);
		Cofs.push(cof);
	}
	NumsL = [];
	
	tbeg = getValue("TBEG").from(taIn);
	tend = getValue("TEND").from(taIn);
	dt = getValue("TSTP").from(taIn);
	Tdata = getValue("TDAT").from(taIn);
	Tproc = getValue("TPRC").from(taIn);
	
	iter = 0;
	Niter = Math.floor(Tdata / dt);

	t = tbeg;

	XMIN = 0;
	XMAX = caOut2.width;
	YMIN = caOut2.height;
	YMAX = 0;
	
	W = [];
	for(var j = 0; j < Numy; j++) {
		var row = [];
		for(var i = 0; i < Numx; i++) {
			row.push(0);
		}
		W.push(row);
	}
	
	if(Btyp == 1) {
		for(var i = 0; i < Numx; i++) {
			W[0][i] = 1;
			W[Numy - 1][i] = 1;
		}
		for(var j = 0; j < Numy; j++) {
			W[j][0] = 1;
			W[j][Numx - 1] = 1;
		}
	}
	
	colors = [
		["#fff", "#fff"],
		["#000", "#000"],
		["#aaf", "#00f"],
		["#faa", "#f00"],
		["#afa", "#0f0"]
	];
	
	scen = getValue("SCEN").from(taIn);
	
	N = 0;
	if(scen == 0) {
		for(var i = 0; i < Ntyp; i++) {
			N += Nums[i];
			var j = 0;
			while(j < Nums[i]) {
				var x = Random.randInt(0, Numx - 1);
				var y = Random.randInt(0, Numy - 1);
				if(W[y][x] == 0) {
					W[y][x] = i + 2;
					j++;
				}
			}
		}
	} else if(1 <= scen && scen <= 4) {
		var n = scen + 1;
		for(var j = 0; j < Numy / n; j++) {
			W[n * j][Numx / 2] = 1;
		}
		for(var i = 0; i < 2; i++) {
			N += Nums[i];
			var j = 0;
			while(j < Nums[i]) {
				var x = Random.randInt(
					i * Numx / 2,
					(i + 1) * Numx / 2
				);
				var y = Random.randInt(0, Numy - 1);
				if(W[y][x] == 0) {
					W[y][x] = i + 2;
					j++;
				}
			}
		}
	}
	
	clearCanvas(caOut);
	drawMatrixOnCanvas(W);
	clearCanvas(caOut2);

	// Data
	series = [
		[0, Nums[0], []],
		[0, Nums[1], []]
	];
}


// Create visual elements
function createVisualElements() {
	// Create textarea for input
	taIn = document.createElement("textarea");
	with(taIn.style) {
		overflowY = "scroll";
		width = "214px";
		height = "200px";
	}
	
	// Create textarea for output
	taOut = document.createElement("textarea");
	with(taOut.style) {
		overflowY = "scroll";
		width = "214px";
		height = "161px";
	}
	
	// Create button for loading default parameters
	btLoad = document.createElement("button");
	with(btLoad) {
		innerHTML = "Load";
		id = "Load";
		style.width = "55px";
		disabled = false;
		addEventListener("click", buttonClick);
	}

	// Create button for reading shown parameters
	btRead = document.createElement("button");
	with(btRead) {
		innerHTML = "Read";
		id = "Read";
		style.width = "55px";
		disabled = true;
		addEventListener("click", buttonClick);
	}
	
	// Create button for starting simulation
	btStart = document.createElement("button");
	with(btStart) {
		innerHTML = "Start";
		id = "Start";
		style.width = "55px";
		disabled = true;
		addEventListener("click", buttonClick);
	}
	
	// Create button for giving information
	btInfo = document.createElement("button");
	with(btInfo) {
		innerHTML = "Info";
		id = "Info";
		style.width = "55px";
		disabled = false;
		addEventListener("click", buttonClick);
	}
	
	// Create canvas for output
	caOut = document.createElement("canvas");
	caOut.width = "400";
	caOut.height = "200";
	with(caOut.style) {
		width = caOut.width +  "px";
		height = caOut.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	
	// Create 2nd canvas for output
	caOut2 = document.createElement("canvas");
	caOut2.width = "400";
	caOut2.height = "195";
	with(caOut2.style) {
		width = caOut2.width +  "px";
		height = caOut2.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	
	// Create div for left part
	var dvLeft = document.createElement("div");
	with(dvLeft.style) {
		width = "220px";
		height = "403px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Create div for right part
	var dvRight = document.createElement("div");
	with(dvRight.style) {
		width = "403px";
		height = "403px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Append element in structured order
	document.body.append(dvLeft);
		dvLeft.append(taIn);
		dvLeft.append(taOut);
		dvLeft.append(btLoad);
		dvLeft.append(btRead);
		dvLeft.append(btStart);
		dvLeft.append(btInfo);
	document.body.append(dvRight);
		dvRight.append(caOut);
		dvRight.append(caOut2);
}


// Handle event of button click
function buttonClick() {
	var id = event.target.id;
	switch(id) {
	case "Load":
		btRead.disabled = false;
		loadParams();
	break;
	case "Read":
		btStart.disabled = false;
		readParams();
	break;
	case "Start":
		if(btStart.innerHTML == "Start") {
			btLoad.disabled = true;
			btRead.disabled = true;
			btInfo.disabled = true;
			btStart.innerHTML = "Stop";
			proc = setInterval(simulate, Tproc);
		} else {
			btLoad.disabled = false;
			btRead.disabled = false;
			btInfo.disabled = false;
			btStart.innerHTML = "Start";
			clearInterval(proc);
		}
	break;
	case "Info":
		var info = "";
		info += "cppcmf.js\n";
		info += "Charged particle in perpendicular ";
		info += "constant magnetic field\n";
		info += "Sparisoma Viridi\n";
		info += "https://github.com/dudung/butiran.js\n"
		info += "Freddy Haryanto\n";
		info += "Load  load parameters\n";
		info += "Read  read parameters\n";
		info += "Start start simulation\n";
		info += "Info  show this messages\n";
		info += "\n";
		addText(info).to(taOut);
	break;
	default:
	}
}


// Perform simulation
function simulate() {
	if(iter >= Niter) {
		iter = 0;
	}
	
	if(t == tbeg) {
		//       0.0740 -0.0009 -0.0162
		addText("#t      x       y\n").to(taOut);
	}
	
	if(iter == 0) {
		var tt = "0000" + t;
		tt = tt.slice(-4);
		
		for(var i = 0; i < 2; i++) {
			NumsL[i] = 0;
		}
		
		for(var j = 0; j < Numy; j++) {
			for(var i = 0; i < Numx / 2; i++) {
				if(W[j][i] > 1) {
					NumsL[W[j][i] - 2]++;
				}
			}			
		}
		
		series[0][2].push(NumsL[0]);
		if(series[0][2].length > 400) series[0][2].splice(0, 1);
		
		series[1][2].push(NumsL[1]);
		if(series[1][2].length > 400) series[1][2].splice(0, 1);
		

		var text = tt + " "
		text += NumsL[0] + " ";
		text += NumsL[1] + " ";
		addText(text + "\n").to(taOut);
		
		updateMatrix(W);
		clearCanvas(caOut);
		drawMatrixOnCanvas(W);
		
		clearCanvas(caOut2);
		drawSeriesOnCanvas(series, caOut2);
	}
	
	
	if(t >= tend) {
		btLoad.disabled = false;
		btRead.disabled = false;
		btStart.disabled = true;
		btInfo.disabled = false;
		btStart.innerHTML = "Start";
		clearInterval(proc);
		addText("\n").to(taOut);
	}
	
	iter++;
	t += dt;
}


// Clear canvas
function clearCanvas(caOut) {
	var width = caOut.width;
	var height = caOut.height;
	var cx = caOut.getContext("2d");
	cx.clearRect(0, 0, width, height);
}


// Clear a Textarea
function clearText() {
	var ta = arguments[0];
	ta.value = "";
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
					}
					return value;
				}
			}
		}
	};
	return result;	
}

// Draw a matrix on canvas with certain style
function drawMatrixOnCanvas() {
	var M = arguments[0];
	var style = arguments[1];
	
	var Rows = W.length;
	var Cols = W[0].length;
	
	var w = Math.round(caOut.width / Cols);
	var h = Math.round(caOut.height / Rows);
	
	var cx = caOut.getContext("2d");
	
	var strokeColor;
	var fillColor;
	for(var i = 0; i < Rows; i++) {
		for(var j = 0; j < Cols; j++) {
			var x = j * w;
			var y = i * h;
			var c = M[i][j];
			strokeColor = colors[c][0];
			fillColor = colors[c][1];
			cx.fillStyle = fillColor;
			cx.fillRect(x, y, w, h);
			cx.stroke();
			cx.strokeStyle = strokeColor;
			cx.lineWidth = 1;
			cx.strokeRect(x+1, y+1, w-2, h-2);
		}
	}
}

// Update a matrix using ABM
function updateMatrix() {
	var M = arguments[0];
	
	var Rows = W.length;
	var Cols = W[0].length;
	
	var i = 0;
	while(i < N) {
		var xsrc = Random.randInt(0, Numx - 1);
		var ysrc = Random.randInt(0, Numy - 1);
		var typ = W[ysrc][xsrc];
		
		if(typ > 1) {
			var dx = Random.randInt(-Cofs[typ-2], +Cofs[typ-2]);
			var dy = Random.randInt(-Cofs[typ-2], +Cofs[typ-2]);
			xdest = xsrc + dx;
			ydest = ysrc + dy;
			if(
				(0 <= xdest && xdest < Numx) &&
				(0 <= ydest && ydest < Numy)
			) {
				if(W[ydest][xdest] == 0) {
					W[ydest][xdest] = W[ysrc][xsrc];
					W[ysrc][xsrc] = 0;
					i++;
				}
			}
		}
	}
}


// Draw graph of data on canvas
function drawSeriesOnCanvas() {
	var series = arguments[0];
	var Nseries = series.length;
	
	var can = arguments[1];
	var width = can.width;
	var height = can.height;
	var cx = can.getContext("2d");
	
	//var h = height / Nseries;
	var h = height;
	var XMIN = 0;
	var XMAX = width;
	var YMIN = height;
	var YMAX = 0;
	
	var xmin = 0;
	var xmax = 400;
	var ymax = 1;
	var ymin = 0;
	
	var margin = 10;
	
	for(var s = 0; s < Nseries; s++) {
		//YMAX = s * h + margin;
		YMAX = margin;
		YMIN = YMAX + h - margin;
		ymin = series[s][0];
		ymax = series[s][1];
		var N = series[s][2].length;
		cx.beginPath();
		cx.strokeStyle = colors[s + 2][1];
		cx.lineWidth = 2;
		for(var i = 0; i < N; i++) {
			var x = i;
			var y = series[s][2][i];
			var p = transform(x, y);
			if(i == 0) {
				cx.moveTo(p[0], p[1]);
			} else {
				cx.lineTo(p[0], p[1]);
			}
		}
		cx.stroke();
		cx.closePath();
	}
	
	function transform(x, y) {
		var XX = (x - xmin) / (xmax - xmin) * (XMAX - XMIN)
		XX += XMIN;
		var YY = (y - ymin) / (ymax - ymin) * (YMAX - YMIN)
		YY += YMIN;
		return [XX, YY];
	}
}
