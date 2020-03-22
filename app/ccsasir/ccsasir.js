/*
	ccsasir.js
	Connected Compartment as Spatial Advancement of  
	Suceptible-Infected-Recovery Model for Modelling
	Spread of Infection
	
	Sparisoma Viridi | https://github.com/dudung
	Nuning Nuraini | nuning@math.itb.ac.id
	Armi Susandi | armisusandi@yahoo.com
	Intan Taufik | i.taufik@sith.itb.ac.id
	Pingkan Aditiawati | pingkan@sith.itb.ac.id
	
	20200322
	1045 Start this project.
	1100 Design SIR parameters for NA area.
	1224 Create function createButton().
	1248 Finish button interaction but not yet running.
	1300 Accomplish momentary input elements.
	1322 Try write first parameters for CC-SIR.
	1338 Start to read parameters.
	1403 Finish reading all parameters.
	1552 Add spasial position.
	1642 Able to draw a circle representing center of area.
	1707 Able to draw all center of area in canvas.
	1711 Toggle Calc and Stop button.
	1752 Can clear canvas and start draw text.
	1810 Able to iterate, show text and start-stop.
	2023 Can SIR and between areas.
	2040 N does not conserve and do not know how to fix it.
	2050 Create createCanvas() function and it works.
	2212 Charts ok and they work.
	2219 Finish for today and tell the group for this.
	
	References
	1. Sparisoma Viridi, Intan Taufik, Armi Susandi, Pingkan
	   Aditiawati, "Discussion #1 about SIR Model: Introducing
		 Spatial Aspect", Zenodo.3719365, 20 Mar 2020
		 url http://doi.org/10.5281/zenodo.3719365
	2. url https://stackoverflow.com/questions/tagged/javascript
*/


// Define global variables for SIR model
var NA, N;
var N, S, I, R;
var A, B;
var MS, MI, MR;
var x, y, z, d;
var dt, iter, Tsim;
var series;


// Define global variables for JS elements
var taIn;
var btLoad, btRead, btCalc, btInfo;
var caOut, caOuts, dvCharts;


// Define global variables for other purposes
var RANGE, range;
var colorS, colorF;
var proc, Tproc;

// Call main function
main();


// Define main function
function main() {
	setLayout();
	initParams();
}


// Initialize parameters
function initParams() {
	var XMIN = parseInt(0);
	var XMAX = parseInt(caOut.width);
	var YMIN = parseInt(caOut.height);
	var YMAX = parseInt(0);
	RANGE = [XMIN, YMIN, XMAX, YMAX];
	range = [0.00, 0.00, 1.00, 1.00];
	
	colorS = ["#666", "#6f6", "#f66", "#66f"];
	colorF = ["#eee", "#efe", "#fee", "#ddf"];
	
	dt = 1;
	Tproc = 100;
}


// Set layout of JS elements
function setLayout() {
	btLoad = createButton("Load", 55, 22, load);
	btRead = createButton("Read", 55, 22, read);
	btCalc = createButton("Calc", 55, 22, calc);
	btInfo = createButton("Info", 55, 22, info);
	
	taIn = createTextarea(215, 570);
	
	var border = "#ccc 1px solid";
	var dvInput = createDivision(220, 602, border, "left");
	
	caOut = createCanvas(602, 602, border, "left");
	
	dvCharts = createDivision(212, 602, border, "left");
	
	document.body.append(dvInput);
		dvInput.append(taIn);
		dvInput.append(btLoad);
		dvInput.append(btRead);
		dvInput.append(btCalc);
		dvInput.append(btInfo);
	document.body.append(caOut);
	document.body.append(dvCharts);
	
	setButtonsState([true, false, false, true]);
}


// Create canvas
function createCanvas() {
	var w = arguments[0];
	var h = arguments[1];
	var b = arguments[2];
	var f = arguments[3];
	
	var can = document.createElement("canvas");
	with(can) {
		width = w;
		height = h;
		with(style) {
			border = b;
			width = w + "px";
			height = h + "px";
			float = f;
		}
	}
	
	return can;
}


// Create textarea
function createTextarea() {
	var w = arguments[0];
	var h = arguments[1];
	var ta = document.createElement("textarea");
	with(ta.style) {
		width = w + "px";
		height = h + "px";
		overflowY = "scroll";
	}
	return ta;
}


// Create division
function createDivision() {
	var w = arguments[0];
	var h = arguments[1];
	var b = arguments[2];
	var f = arguments[3];
	var div = document.createElement("div");
	with(div.style) {
		width = w + "px";
		height = h + "px";
		border = b;
		float = f;
	}
	return div;
}


// Create button
function createButton() {
	var cap = arguments[0];
	var w = arguments[1];
	var h = arguments[2];
	var e = arguments[3];
	var btn = document.createElement("button");
	with(btn) {
		innerHTML = cap;
		with(style) {
			width = w +  "px";
			height = h + "px";
		}
		addEventListener("click", e);
	}
	return btn;
}


// Load parameters
function load() {
	console.log("Load parameters");
	setButtonsState([true, true, false, true]);
	
	var p = "";
	p += "TSIM 100\n";
	p += "\n";
	p += "NSIR\n";
	p += "099 001 000\n";
	p += "100 000 000\n";
	p += "099 001 000\n";
	p += "100 000 000\n";
	p += "100 000 000\n";
	p += "\n";
	p += "ABXX\n";
	p += "0.25 0.25\n";
	p += "0.25 0.25\n";
	p += "0.25 0.10\n";
	p += "0.25 0.10\n";
	p += "0.25 0.10\n";
	p += "\n";
	p += "MUSX\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "\n";
	p += "MUIX\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "\n";
	p += "MURX\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "0.00 0.00 0.00 0.00 0.00\n";
	p += "\n";
	p += "XYZD\n";
	p += "0.20 0.20 0.00 0.15\n";
	p += "0.20 0.80 0.00 0.10\n";
	p += "0.80 0.80 0.00 0.08\n";
	p += "0.80 0.20 0.00 0.12\n";
	p += "0.50 0.50 0.00 0.20\n";
	tin(p);
	
	iter = 0;
}


// Read parameters
function read() {
	console.log("Read parameters");
	setButtonsState([true, true, true, true]);
	
	clearG();
	iter = 0;
	
	Tsim = readValue("TSIM");
	
	MS = readMatrix("MUSX");
	MI = readMatrix("MUIX");
	MR = readMatrix("MURX");
	
	var NSIR = readMatrix("NSIR");
	var Ni = NSIR.length;
	S = [];
	I = [];
	R = [];
	for(var i = 0; i < Ni; i++) {
		S.push(NSIR[i][0]);
		I.push(NSIR[i][1]);
		R.push(NSIR[i][2]);
	}
	
	var AB = readMatrix("ABXX");
	var Nj = AB.length;
	A = [];
	B = [];
	for(var j = 0; j < Nj; j++) {
		A.push(AB[j][0]);
		B.push(AB[j][1]);
	}
	var XYZD = readMatrix("XYZD");
	var Nk = XYZD.length;
	x = [];
	y = [];
	z = [];
	d = [];
	for(var k = 0; k < Nk; k++) {
		x.push(XYZD[k][0]);
		y.push(XYZD[k][1]);
		z.push(XYZD[k][2]);
		d.push(XYZD[k][3]);
	}
	
	NA = Math.min(Ni, Nj, Nk);
	
	N = [];
	for(var a = 0; a < NA; a++) {
		var Ni = S[a] + I[a] + R[a];
		N.push(Ni);
	}
	
	drawAllAreas();
	drawInfoNSIR();
	
	border = "#fff 2px solid";
	while(dvCharts.childElementCount > 0) {
		dvCharts.removeChild(dvCharts.lastChild);
	}
	caOuts = [];
	for(var i = 0; i < NA; i++) {
		var can = createCanvas(200, 50, border, "left");
		can.style.background = "#fafafa";
		can.style.padding = "4px";
		can.id = "can" + i;
		caOuts.push(can);
		dvCharts.append(can);
	}
	
	series = [];
}


// Draw all areas
function drawAllAreas() {
	var cS = colorS[0];
	var cF = colorF[0];
	for(var i = 0; i < NA; i++) {
		drawCircle(x[i], y[i], 0.5 * d[i], cS, cF);
		drawText(i, x[i], y[i], "#000", 15, "center", "middle");
	}
}


// Calculate resulst
function calc() {
	if(btCalc.innerHTML == "Calc") {
		console.log("Start calculation");
		btCalc.innerHTML = "Stop";
		setButtonsState([false, false, true, false]);
		proc = setInterval(simulate, Tproc);
	} else {
		console.log("Stop calculation");
		btCalc.innerHTML = "Calc";
		setButtonsState([true, true, true, true]);
		clearInterval(proc);
	}
}


// Perform simulation using SIR model
function simulate() {
	clearG();
	drawAllAreas();
	
	var Nnow = 0;
	for(var i = 0; i < NA; i++) {
		Nnow += N[i];
	}	
	
	var tt = "t = " + iter + ", N = " + Nnow.toFixed(1);
	drawText(tt, 0.05, 0.95, "#000", 15, "left", "middle");
	drawInfoNSIR();
	
	for(var i = 0; i < NA; i++) {
		if(iter == 0) {
			var Si = []; Si.push(S[i]);
			var Ii = []; Ii.push(I[i]);
			var Ri = []; Ri.push(R[i]);
			var Ni = []; Ni.push(N[i]);
			var NSIRi = [Si, Ii, Ri, Ni];
			series.push(NSIRi);
		} else {
			series[i][0].push(S[i]);
			series[i][1].push(I[i]);
			series[i][2].push(R[i]);
			series[i][3].push(N[i]);
		}
		drawSIRChart(i);
	}
	
	// -----------------
	// SIR model (begin)
	var St = S;
	var It = I;
	var Rt = R;
	var Nt = N;
	
	for(var i = 0; i < NA; i++) {
		St[i] = S[i] - A[i] * S[i] * I[i] / N[i];
		Sin = 0;
		Sout = 0;
		for(var j = 0; j < NA; j++) {
			if(j != i) {
				Sin += MS[i][j] * St[j];
				Sout += MS[j][i] * St[i];
			}
		}
		St[i]	+= Sin - Sout;
		
		It[i] = I[i] + A[i] * S[i] * I[i] / N[i] - B[i] * I[i];
		Iin = 0;
		Iout = 0;
		for(var j = 0; j < NA; j++) {
			if(j != i) {
				Iin += MI[i][j] * It[j];
				Iout += MI[j][i] * It[i];
			}
		}
		It[i]	+= Iin - Iout;
		
		Rt[i] = R[i] + B[i] * I[i];
		Rin = 0;
		Rout = 0;
		for(var j = 0; j < NA; j++) {
			if(j != i) {
				Iin += MR[i][j] * Rt[j];
				Iout += MR[j][i] * Rt[i];
			}
		}
		Rt[i]	+= Rin - Rout;
		
		Nt[i] = St[i] + It[i] + Rt[i];
	}
	
	S = St;
	I = It;
	R = Rt;
	N = Nt;	
	// SIR model (end)
	// -----------------
	
	iter += dt;
	
	if(iter > Tsim) {
		btCalc.innerHTML = "Calc";
		setButtonsState([true, true, false, true]);
		clearInterval(proc);
	}
}


// Show information
function info() {
	console.log("Show information");
}


// Set button state
function setButtonsState() {
	var btns = document.getElementsByTagName("button");
	var states = arguments[0];
	for(var i = 0; i < states.length; i++) {
		btns[i].disabled = !states[i];
	}
}


// Write to textarea
function tin() {
	var lines = arguments[0];
	taIn.value += lines;
	taIn.scrollTop = taIn.scrollHeight;
}


// Read matriks preceeded by a keyword
function readMatrix() {
	var key = arguments[0];
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
	var key = arguments[0];
	var lines = taIn.value.split("\n");
	var N = lines.length;
	var val;
	for(var i = 0; i < N; i++) {
		var cols = lines[i].split(" ");
		if(key == cols[0]) {
			val = parseFloat(cols[1]);
			break;
		}
	}
	return val;
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
	} else {
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
	var x = arguments[0];
	var y = arguments[1];
	var d = arguments[2];
	var s = arguments[3];
	var f = arguments[4];
	
	var X = tr(x, 0);
	var Y = tr(y, 1);
	var R = tr(x + 0.5 * d, 0) - tr(x, 0);
	
	var cx = caOut.getContext("2d");
	cx.fillStyle = f;
	cx.beginPath();
	cx.arc(X, Y, R, 0, 2 * Math.PI);
	cx.fill();
	cx.strokeStyle = s;
	cx.beginPath();
	cx.arc(X, Y, R, 0, 2 * Math.PI);
	cx.stroke();	
}


// Clear canvas
function clearG() {
	var cx = caOut.getContext("2d");
	cx.clearRect(0, 0, RANGE[2], RANGE[1]);
}


// Draw text
function drawText() {
	var t = arguments[0];
	var x = arguments[1];
	var y = arguments[2];
	var c = arguments[3];
	var s = arguments[4];
	var h = arguments[5];
	var v = arguments[6];
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


// Draw SIR info
function drawInfoNSIR() {
	for(var i = 0; i < NA; i++) {
		var lc = 0.25 * d[i] + 0.02;
		var xc = x[i];
		var yc = y[i];
		var dq = Math.PI / 2;
		
		var q = 0;
		var xN = xc + lc * Math.cos(q);
		var yN = yc + lc * Math.sin(q);
		var tN = N[i].toFixed(1);
		drawText(tN, xN, yN, colorS[0], 15, "left", "middle");
		
		q += dq;
		var xS = xc + lc * Math.cos(q);
		var yS = yc + lc * Math.sin(q);
		var tS = S[i].toFixed(1);
		drawText(tS, xS, yS, colorS[1], 15, "center", "bttom");
		
		q += dq;
		var xI = xc + lc * Math.cos(q);
		var yI = yc + lc * Math.sin(q);
		var tI = I[i].toFixed(1);
		drawText(tI, xI, yI, colorS[2], 15, "right", "middle");
		
		q += dq;
		var xR = xc + lc * Math.cos(q);
		var yR = yc + lc * Math.sin(q);
		var tR = R[i].toFixed(1);
		drawText(tR, xR, yR, colorS[3], 15, "center", "top");
	}
}

// Draw SIR chart for i-th area
function drawSIRChart() {
	var a = arguments[0];
	var S = series[a][0];
	var I = series[a][1];
	var R = series[a][2];
	var N = series[a][3];
	
	var xmin = 0;
	var xmax = Tsim;
	var ymin = 0;
	var ymax = Math.max(...N);
	
	var XMIN = 0;
	var XMAX = parseInt(caOuts[a].width);
	var YMIN = parseInt(caOuts[a].height);
	var YMAX = 0;
	
	var cx = caOuts[a].getContext("2d");
	cx.clearRect(XMIN, YMAX, XMAX, YMIN);
	
	cx.strokeStyle = colorS[1];
	cx.beginPath();
	for(var i = 0; i < S.length; i++) {
		var x = i;
		var y = S[i];
		var X = Xx(x);
		var Y = Yy(y);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
	
	cx.strokeStyle = colorS[2];
	cx.beginPath();
	for(var i = 0; i < I.length; i++) {
		var x = i;
		var y = I[i];
		var X = Xx(x);
		var Y = Yy(y);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
	
	cx.strokeStyle = colorS[3];
	cx.beginPath();
	for(var i = 0; i < R.length; i++) {
		var x = i;
		var y = R[i];
		var X = Xx(x);
		var Y = Yy(y);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
		
	cx.font = "10px Times";
	cx.fillStyle = "#000";
	var X = Xx(xmin);
	var Y = Yy(ymax);
	cx.textAlign = "left";
	cx.textBaseline = "top";
	cx.fillText(a, X, Y);

	function Xx() {
		var x = arguments[0];
		var X = (x - xmin) / (xmax - xmin);
		X *= (XMAX - XMIN);
		X += XMIN;
		return X;
	}
	
	function Yy() {
		var y = arguments[0];
		var Y = (y - ymin) / (ymax - ymin);
		Y *= (YMAX - YMIN);
		Y += YMIN;
		return Y;
	}
}

