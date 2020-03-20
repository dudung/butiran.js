/*
	wtrwgpmmids.js
	Walk-through and random-walk of granular particles
	as an alternative for mathematical modelling
	of infectious disease spread
	
	Sparisoma Viridi | https://github.com/dudung
	Nuning Nuraini | nuning@math.itb.ac.id
	Amri Susandi | armisusandi@yahoo.com
	Intan Taufik | i.taufik@sith.itb.ac.id
	Pingkan Aditiawati | pingkan@sith.itb.ac.id
	
	20200308
	1059 Beg bei Sukahaji.
	1238 Fin temporaer tata letak.
	1247 Update to Github.
	1320 Finish button events and interactions.
	1359 Can draw initial position for all particles.
	1430 Can view all particle but only with infection
	     scenario.
	1509 Two states are created -1, 0, 1.
	1645 Con at home.
	1654 Change name from wtktgmmid to wtrwgpmmids.
	1659 Info button ok.
	1728 Fix color and output in 4 digits.
	1802 Parameters can be given from UI.
	1939 Finish for today. Update xphysics at Github.
	20200309
	0744 Correction: Amri --> Armi.
	20200311
	0533 Correct initial incubation time. Random.
	0619 Add mode of initial tinf: 0, 1, 2.
	20200320
	1034 Release .js (replacing .min.js) for open source.
	
	Refs:
	1. IT: Recover time 14 days, death rate about 2%.
*/

// Define some global parameters
var pname = "WTRWGPMMIDS";
var btLoad, btRead, btRun, btInfo;
var taIn, taOut, caOut, caOut2;
var bgColor = "#f8f8f8";
var N, xx, yy, dd, cc, hh, ii;
var xmin, ymin, xmax, ymax;
var XMIN, YMIN, XMAX, YMAX;
var xmin2, ymin2, xmax2, ymax2;
var XMIN2, YMIN2, XMAX2, YMAX2;
var proc, iter, Niter;
var colors = ["#888", "#f88", "#88f", "#8f8"];
var D, vmax;
var TRCV, NINF, MODE;
var S, I, R;

// Start the program
main()


// Main program
function main() {
	cout("Program start");
	
	layout();
	initParams();	
}


// Simulate
function simulate() {
	if(iter >= Niter) {
		clearInterval(proc);
		stateButton(1, 1, 1, 1);
		btRun.innerHTML = "Run";		
	}
	
	var sir = getSIR();
	tout(
		("0000" + iter).slice(-4) + " "
		+ ("0000" + sir[0]).slice(-4) + " "
		+ ("0000" + sir[1]).slice(-4) + " "
		+ ("0000" + sir[2]).slice(-4) + "\n"
	);
	
	S.push(sir[0]);
	I.push(sir[1]);
	R.push(sir[2]);
	
	changePositions();
	developeImmunity();
	propagateInfection();
	clearX();
	drawPositions();
	
	clearX2();
	drawSIRChart();
	
	iter++;
}


// Develop immunity
function developeImmunity() {
	for(var i = 0; i < N; i++) {
		var tinf = (ii[i] > -1) ? (iter - ii[i]) : 0;
		if(tinf > TRCV) {
			hh[i] = 1;
			cc[i] = colors[hh[i] + 2];
		}
	}
}

// Propagate infection
function propagateInfection() {
	for(var i = 0; i < N; i++) {
		for(var j = i + 1; j < N; j++) {
			var xi = xx[i];
			var yi = yy[i];
			var ri = 0.5 * dd[i];
			
			var xj = xx[j];
			var yj = yy[j];
			var rj = 0.5 * dd[j];
			
			var dx = xi - xj;
			var dy = yi - yj;
			var dr = Math.sqrt(dx*dx + dy*dy);
			var ksi = (ri + rj) - dr;
			ksi = (ksi < 0) ? 0 : ksi;
			
			if(ksi > 0) {
				if(hh[i] == -1 && hh[j] == 0) {
					hh[j] = hh[i];
					cc[j] = cc[i];
					ii[j] = iter;
				}
				if(hh[j] == -1 && hh[i] == 0) {
					hh[i] = hh[j];
					cc[i] = cc[j];
					ii[i] = iter;
				}
			}
		}
	}
}


// Change particles position
function changePositions() {
	for(var i = 0; i < N; i++) {
		var xold = xx[i];
		var yold = yy[i];
		var r = 0.5 * dd[i];
		
		var theta = 2 * Math.PI * Math.random();
		var vx = vmax * Math.cos(theta);
		var vy = vmax * Math.sin(theta);
		var dt = 1;
		
		var xnew = xold + vx * dt;
		var ynew = yold + vy * dt;
		
		if(xnew < xmin + r || xmax - r < xnew) {
			xnew = xold;
		}
		if(ynew < ymin + r || ymax - r < ynew) {
			ynew = yold;
		}
		
		xx[i] = xnew;
		yy[i] = ynew;
	}
}


// Calculate infected
function getSIR() {
	var I = 0;
	var S = 0;
	var R = 0;
	for(var i = 0; i < N; i++) {
		if(hh[i] == -1) {
			I++;
		}
		if(hh[i] == 0) {
			S++;
		}
		if(hh[i] == 1) {
			R++;
		}
	}
	return [S, I, R];
}


// Initialize parameters
function initParams() {
	xmin = 0;
	ymin = 0;
	xmax = 300;
	ymax = 300;
	
	XMIN = 0;
	YMIN = parseInt(caOut.height);
	XMAX = parseInt(caOut.width);
	YMAX = 0;
	
	xmin2 = 0;
	ymin2 = 0;
	xmax2 = 1;
	ymax2 = 1;
	
	XMIN2 = 0 - 4;
	YMIN2 = parseInt(caOut2.height) - 4;
	XMAX2 = parseInt(caOut2.width) + 4;
	YMAX2 = 0 + 4;
}


// Load parameters
function loadParams() {
	var p = "";
	p += "# Population\n";
	p += "NPOP 1600\n";          // N
	p += "NINF 100\n";           // NINF
	p += "TRCV 50\n";            // TRCV
	p += "\n";
	p += "# Individu\n";
	p += "VMAX 1\n";             // vmax
	p += "\n";
	p += "# Simulation\n";       // N
	p += "TSIM 200\n";           // Niter
	p += "\n";
	p += "# Mode of tinf\n";     // N
	p += "> 0 0\n";              // N
	p += "> 1 rnd[0, 1) TRCV\n"; // N
	p += "> 2 linear\n";         // N
	p += "MODE 0\n";             // Niter
	tin(p);
}


// Read parameters()
function readParams() {
	var pars = taIn.value;
	var lines = pars.split("\n");
	for(var i = 0; i < lines.length; i++) {
		var cols = lines[i].split(" ");
		if(cols[0] == "NPOP") N = parseInt(cols[1]);
		if(cols[0] == "NINF") NINF = parseInt(cols[1]);
		if(cols[0] == "TRCV") TRCV = parseInt(cols[1]);
		if(cols[0] == "VMAX") vmax = parseInt(cols[1]);
		if(cols[0] == "TSIM") Niter = parseInt(cols[1]);
		if(cols[0] == "MODE") MODE = parseInt(cols[1]);
	}
	
	xmax2 = Niter;
	S = [];
	I = [];
	R = [];
}


// Initialize all positions
function initPositions() {
	var Nx = Math.floor(Math.sqrt(N));
	var Ny = Nx;
	var lx = (xmax - xmin) / Nx;
	var ly = (ymax - ymin) / Ny;
	
	D = 0.34 * (lx + ly);
	
	xx = [];
	yy = [];
	dd = [];
	cc = [];
	hh = [];
	ii = [];
	
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var x = (ix + 0.5) * lx;
			var y = (iy + 0.5) * ly;
			
			x += 0.2 * D * (Math.random() - 0.5);
			y += 0.2 * D * (Math.random() - 0.5);
			
			xx.push(x);
			yy.push(y);
			dd.push(D);
			hh.push(0);
			ii.push(-1);
			cc.push(colors[2]);
		}
		
		S = [];
		I = [];
		R = [];
	}
	
	for(var j = 0; j < NINF; j++) {
		var i = Math.floor(Math.random() * N);
		hh[i] = -1;
		cc[i] = colors[hh[i] + 2];
		if(MODE == 0) {
			ii[i] = 0;
		} else if(MODE == 1) {
			ii[i] = Math.random() * TRCV;
		} else {
			ii[i] = Math.floor((TRCV / NINF) * j);
		}
	}
}


// Draw all chart
function drawSIRChart() {
	var cx = caOut2.getContext("2d");
	
	
	var NS = S.length;
	cx.lineWidth = "2";
	cx.strokeStyle = colors[2];
	cx.beginPath();
	for(var i = 0; i < NS; i++) {
		var X = Xx2(i);
		var Y = Yy2(S[i] / N);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
	
	var NI = I.length;
	cx.strokeStyle = colors[1];
	cx.lineWidth = "2";
	cx.beginPath();
	for(var i = 0; i < NI; i++) {
		var X = Xx2(i);
		var Y = Yy2(I[i] / N);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
	
	var NR = R.length;
	cx.strokeStyle = colors[3];
	cx.lineWidth = "2";
	cx.beginPath();
	for(var i = 0; i < NR; i++) {
		var X = Xx2(i);
		var Y = Yy2(R[i] / N);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
	
	function Xx2(x) {
		var X = (x - xmin2) / (xmax2 - xmin2);
		X *= (XMAX2 - XMIN2);
		X += XMIN2;
		return X;
	}
	function Yy2(y) {
		var Y = (y - ymin2) / (ymax2 - ymin2);
		Y *= (YMAX2 - YMIN2);
		Y += YMIN2;
		return Y;
	}
}


// Draw all positions
function drawPositions() {
	var cx = caOut.getContext("2d");
	for(var i = 0; i < N; i++) {
		var X = Xx(xx[i]);
		var Y = Yy(yy[i]);
		var D = 0.5 * (Xx(xx[i] + dd[i]) - X);
		var C = cc[i];
		cx.beginPath();
		cx.fillStyle = C;
		cx.arc(X, Y, D, 0, 2 * Math.PI);
		cx.fill();
		cx.beginPath();
		cx.strokeStyle = "#444";
		cx.arc(X, Y, D, 0, 2 * Math.PI);
		cx.stroke();
	}
	
	function Xx(x) {
		var X = (x - xmin) / (xmax - xmin);
		X *= (XMAX - XMIN);
		X += XMIN;
		return X;
	}
	function Yy(y) {
		var Y = (y - ymin) / (ymax - ymin);
		Y *= (YMAX - YMIN);
		Y += YMIN;
		return Y;
	}
}


// Set layout
function layout() {
	btLoad = document.createElement("button");
	btLoad.innerHTML = "Load";
	btLoad.style.width = "50px";
	btLoad.style.height = "21px";
	
	btRead = document.createElement("button");
	btRead.innerHTML = "Read";
	btRead.style.width = "50px";
	btRead.style.height = "21px";
	
	btRun = document.createElement("button");
	btRun.innerHTML = "Run";
	btRun.style.width = "50px";
	btRun.style.height = "21px";
	
	btInfo = document.createElement("button");
	btInfo.innerHTML = "Info";
	btInfo.style.width = "50px";
	btInfo.style.height = "21px";
	
	taIn = document.createElement("textarea");
	taIn.style.width = "194px";
	taIn.style.height = "269px";
	taIn.style.overflowY = "scroll";
	
	taOut = document.createElement("textarea");
	taOut.style.width = "194px";
	taOut.style.height = "294px";
	taOut.style.overflowY = "scroll";
	
	caOut = document.createElement("canvas");
	caOut.width = "298";
	caOut.height = "298";
	caOut.style.width = caOut.width + "px";
	caOut.style.height = caOut.height + "px";
	caOut.style.background = bgColor;
	caOut.style.border = "1px solid #ccc";
	
	caOut2 = document.createElement("canvas");
	caOut2.width = "702";
	caOut2.height = "100";
	caOut2.style.width = caOut2.width + "px";
	caOut2.style.height = caOut2.height + "px";
	caOut2.style.background = bgColor;
	caOut2.style.border = "1px solid #ccc";
	
	var divLeft = document.createElement("div");
	divLeft.style.border = "1px solid #ccc";
	divLeft.style.background = "#eee";
	divLeft.style.width = "200px";
	divLeft.style.height = "300px";
	divLeft.style.float = "left";
	
	var divRight = document.createElement("div");
	divRight.style.border = "1px solid #ccc";
	divRight.style.background = "#eee";
	divRight.style.width = "500px";
	divRight.style.height = "300px";
	divRight.style.float = "left";
	
	document.body.append(divLeft);
		divLeft.append(taIn);
		divLeft.append(btLoad);
		divLeft.append(btRead);
		divLeft.append(btRun);
		divLeft.append(btInfo);
	document.body.append(divRight);
		divRight.append(caOut);
		divRight.append(taOut);
	document.body.append(caOut2);

	btLoad.addEventListener("click", clickButton);
	btRead.addEventListener("click", clickButton);
	btRun.addEventListener("click", clickButton);
	btInfo.addEventListener("click", clickButton);
	
	stateButton(1, 0, 0, 1);
}


// Click button
function clickButton() {
	var t = event.target;
	var n = t.innerHTML;
	cout("Button click -> " + n);
	
	if(n == "Load") {
		stateButton(1, 1, 0, 1);
		cleartin();
		loadParams();
	} else if(n == "Read") {
		stateButton(1, 1, 1, 1);
		readParams();
		iter = 0;
		initPositions();
		clearX();
		drawPositions();
	} else if(n == "Run") {
		stateButton(0, 0, 1, 0);
		btRun.innerHTML = "Stop";
		proc = setInterval(simulate, 10);		
	} else if(n == "Stop") {
		stateButton(1, 1, 1, 1);
		btRun.innerHTML = "Run";
		clearInterval(proc);
	} else if(n == "Info") {
		showInfo();
	}
}


// Show information
function showInfo() {
	var msg = "wtrwgpmmids.js\n" +
	"Walk-through and random-walk of granular particles\n" +
	"as an alternative for mathematical modelling\n" +
	"of infectious disease spread\n\n" +
	"Sparisoma Viridi | https://github.com/dudung\n" +
	"Nuning Nuraini | nuning@math.itb.ac.id\n" +
	"Armi Susandi | armisusandi@yahoo.com\n" +
	"Intan Taufik | i.taufik@sith.itb.ac.id\n" +
	"Pingkan Aditiawati | pingkan@sith.itb.ac.id\n\n" +
	"Version 20200308";
	tout(msg);
	console.log(msg);
}


// Set buttons state
function stateButton() {
	var sL = arguments[0];
	var sR = arguments[1];
	var sS = arguments[2];
	var sI = arguments[3];
	
	btLoad.disabled = !sL;
	btRead.disabled = !sR;
	btRun.disabled = !sS;
	btInfo.disabled = !sI;
}


// Clear canvas
function clearX() {
	var cx = caOut.getContext("2d");
	cx.clearRect(XMIN, YMAX, XMAX, YMIN);
}


// Clear 2nd canvas
function clearX2() {
	var cx = caOut2.getContext("2d");
	cx.clearRect(XMIN2 - 4, YMAX2 - 4, XMAX2 + 4, YMIN2 + 4);
}


// Show message on the console
function cout() {
	var msg = arguments[0];
	msg = pname + ": " + msg;
	console.log(msg);
}


// Clear input textarea
function cleartin() {
	taIn.value = "";
}


// Show message on the input textarea
function tin() {
	var msg = arguments[0];
	taIn.value += msg;
	taIn.scrollTop = taIn.scrollHeight;
}


// Show message on the output textarea
function tout() {
	var msg = arguments[0];
	taOut.value += msg;
	taOut.scrollTop = taOut.scrollHeight;
}

