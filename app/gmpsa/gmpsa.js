/*
	gmpsa.js
	Granular model for particle size analysis
	
	Sparisoma Viridi | https://github.com/dudung
	Isa Anshori | isa_anshori@stei.itb.ac.id
	Dellia Yulita | dellia.yulita@gmail.com
	Erlina | erlinaliana@students.itb.ac.id
	Septian Ulan Dini | septianulandini@gmail.com
	Jessika | jessika.bme@gmail.com
	
	20200312
	1315 Start it from wtrwgpmmids version 20200311.
	1546 Finish designing parameters.
	1603 Particle can randomly move.
	1609 Start to design single laser beam.
	1626 Change to design laser and detector also.
	1658 Can draw static laser without reflection.
	1705 Can draw laser stopped on the grain.
	1805 But with dy instead of dr. And missed for many
	particles condition.
	20200313
	0512 Slow setInterval down, add TCOM.
	0515 Collision between grains are not yet implemented,
	they can overlap unphysically.
	0611 Laser ok until the grain but still penetrating
	a little bit. It must be fixed.
	0715 Con at campus.
	0806 Done with unpenetrating laser beam.
	0813 Begin to reflect laser beam.
	0838 Finish for recent reflecting laser beam.
*/

// Define some global parameters
var pname = "GMPSA";
var btLoad, btRead, btRun, btInfo;
var taIn, taOut, caOut, caOut2;
var bgColor = "#f8f8f8";
var N, xx, yy, dd, cc
var xmin, ymin, xmax, ymax;
var XMIN, YMIN, XMAX, YMAX;
var xmin2, ymin2, xmax2, ymax2;
var XMIN2, YMIN2, XMAX2, YMAX2;
var proc, iter, Niter;
var colors = ["#8af", "#f00", "#0f0", "#00f"];
var MODE, bet1, bet2, S, D;
var aLas, aDet;
var Tcom;

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
	
	changePositions();
	clearX();
	drawPositions();
	drawLaserAndDetector();
	emitLaser();
	
	clearX2();
	drawChart();
	
	iter++;
}


// Emit single laser beam
function emitLaser() {
	var cx = caOut.getContext("2d");
	cx.strokeStyle = "#f00";
	cx.lineWidth = "2px";
	cx.beginPath();
	cx.stroke();
	
	var rc = 0.5 * S;
	var xc = 0.5 * (xmax + xmin);
	var yc = 0.5 * (ymax + ymin);
	
	var cx = caOut.getContext("2d");

	var Dc = 0.1 * rc;
	var RL = Xx(0.5 * Dc) - Xx(0);
	
	var xL1 = xc + rc * Math.cos(aLas * Math.PI / 180);
	var yL1 = yc + rc * Math.sin(aLas * Math.PI / 180);
	var XL1 = Xx(xL1);
	var YL1 = Yy(yL1);
	
	var xL2 = xc + rc * Math.cos((aLas + 180) * Math.PI / 180);
	var yL2 = yc + rc * Math.sin((aLas + 180) * Math.PI / 180);
	
	var lmax = S;
	var j = -1;
	var xLj, yLj;
	for(var i = 0; i < N; i++) {
		var xi = xx[i];
		var yi = yy[i];
		var di = dd[i];
		
		var xs = xL1;
		var ys = yL1;
		
		var esx = Math.cos((aLas - 180) * Math.PI / 180);
		var esy = Math.sin((aLas - 180) * Math.PI / 180);
		
		var dx = (xi - xs);
		var dy = (yi - ys);
		var li = Math.sqrt(dx*dx + dy*dy);
		var eix = dx / li;
		var eiy = dy / li;
		
		var dtheta = Math.atan(0.5 * di / li);
		
		var costheta = esx * eix + esy * eiy;
		var theta = Math.acos(costheta);
		
		
		if(theta < dtheta) {
			var ri = 0.5 * di;
			var cosi = Math.cos(theta * Math.PI / 180);
			var sini = Math.sin(theta * Math.PI / 180);
			var deti = ri * ri - li * li * sini * sini
			var lii = li * cosi - Math.sqrt(deti);
			
			if(lii < lmax) {
				lmax = lii;
				j = i;
				xLj = xs
					+ lii * Math.cos((aLas - 180) * Math.PI / 180);
				yLj = ys
					+ lii * Math.sin((aLas - 180) * Math.PI / 180);
			}
		}
	}
	
	if(j > -1) {
		xL2 = xLj;
		yL2 = yLj;
	}
		
	var XL2 = Xx(xL2);
	var YL2 = Yy(yL2);
	
	cx.fillStyle = "#c00";
	cx.setLineDash([1, 0]);
	cx.beginPath();
	cx.moveTo(XL1, YL1);
	cx.lineTo(XL2, YL2);
	cx.stroke();
	
	// Reflect laser beam
	var xj = xx[j];
	var yj = yy[j];
	var rj = 0.5 * dd[j];
	
	var xn = xL2;
	var yn = yL2;
	
	var esx = Math.cos((aLas - 180) * Math.PI / 180);
	var esy = Math.sin((aLas - 180) * Math.PI / 180);
	
	var enx = (xn - xj) / rj;
	var eny = (yn - yj) / rj;
	
	var erx = esx + 2 * (esx * esx + esy * esy) * enx;
	var ery = esy + 2 * (esx * esx + esy * esy) * eny;
	
	var llj = 0.5 * S;
	var xL3 = xn + llj * erx;
	var yL3 = yn + llj * ery;
	
	var XL3 = Xx(xL3);
	var YL3 = Yy(yL3);
		
	cx.fillStyle = "#c00";
	cx.setLineDash([1, 0]);
	cx.beginPath();
	cx.moveTo(XL2, YL2);
	cx.lineTo(XL3, YL3);
	cx.stroke();
	
	function f(x) {
		var m = (yL2 - yL1) / (xL2 - xL1);
		var y = m * (x - xL1) + yL1;
		return y;
	}
}


// Draw laser and detector using grains
function drawLaserAndDetector() {
	var rc = 0.5 * S;
	var xc = 0.5 * (xmax + xmin);
	var yc = 0.5 * (ymax + ymin);
	
	var cx = caOut.getContext("2d");

	var Dc = 0.1 * rc;
	var RL = Xx(0.5 * Dc) - Xx(0);
	var RD = RL;
	var RR = Xx(rc) - Xx(0);
	
	var xL = xc + rc * Math.cos(aLas * Math.PI / 180);
	var yL = yc + rc * Math.sin(aLas * Math.PI / 180);
	var XL = Xx(xL);
	var YL = Yy(yL);
	
	cx.fillStyle = "#c00";
	cx.beginPath();
	cx.arc(XL, YL, RL, 0, 2 * Math.PI);
	cx.fill();
	
	var xD = xc + rc * Math.cos(aDet * Math.PI / 180);
	var yD = yc + rc * Math.sin(aDet * Math.PI / 180);
	var XD = Xx(xD);
	var YD = Yy(yD);
	
	cx.fillStyle = "#0c0";
	cx.beginPath();
	cx.arc(XD, YD, RD, 0, 2 * Math.PI);
	cx.fill();
	
	var XC = Xx(xc);
	var YC = Yy(yc);
	
	cx.strokeStyle = "#000";
	cx.lineWidth = 1;
	cx.setLineDash([5, 5]);
	cx.beginPath();
	cx.arc(XC, YC, RR, 0, 2 * Math.PI);
	cx.stroke();
}


// Change particles position
function changePositions() {
	for(var i = 0; i < N; i++) {
		var xold = xx[i];
		var yold = yy[i];
		var r = 0.5 * dd[i];
		
		var theta = 2 * Math.PI * Math.random();
		var vx = bet2 * Math.cos(theta);
		var vy = bet2 * Math.sin(theta);
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
	p += "# Particles\n";
	p += "NPAR 49\n";              // N
	p += "SIDE 300\n";             // S
	p += "DPAR 10\n";              // D
	p += "BET1 0.3\n";             // \beta_1 initial position
	p += "BET2 4\n";               // \beta_2 change position
	p += "\n";
	p += "# Masurement\n";
	p += "ALAS -30\n";             // angle of laser
	p += "ADET 60\n";              // angle of detector
	p += "\n";
	p += "# Simulation\n";
	p += "TSIM 1000\n";            // Tsim
	p += "TCOM 100\n";             // Tcom in ms
	p += "\n";
	p += "# Mode of motion\n"; 
	p += "> 0 rnd[0, 1) bet2 D\n";
	p += "MODE 0\n";               // Mode of motion
	tin(p);
}


// Read parameters()
function readParams() {
	var pars = taIn.value;
	var lines = pars.split("\n");
	for(var i = 0; i < lines.length; i++) {
		var cols = lines[i].split(" ");
		if(cols[0] == "NPAR") N = parseInt(cols[1]);
		if(cols[0] == "SIDE") S = parseFloat(cols[1]);
		if(cols[0] == "DPAR") D = parseFloat(cols[1]);
		if(cols[0] == "BET1") bet1 = parseFloat(cols[1]);
		if(cols[0] == "BET2") bet2 = parseFloat(cols[1]);
		if(cols[0] == "TSIM") Niter = parseInt(cols[1]);
		if(cols[0] == "TCOM") Tcom = parseInt(cols[1]);
		if(cols[0] == "MODE") MODE = parseInt(cols[1]);
		if(cols[0] == "ALAS") aLas = parseInt(cols[1]);
		if(cols[0] == "ADET") aDet = parseInt(cols[1]);
	}
	
	xmax = S;
	ymax = S;
	xmax2 = Niter;
}


// Initialize all positions
function initPositions() {
	var Nx = Math.floor(Math.sqrt(N));
	var Ny = Nx;
	var lx = 0.5 * (xmax - xmin) / Nx;
	var ly = 0.5 * (ymax - ymin) / Ny;
	var xc = 0.5 * (xmax - xmin);
	var yc = 0.5 * (ymax - ymin);
	
	xx = [];
	yy = [];
	dd = [];
	cc = [];
	
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var x = (ix + 0.5) * lx + xc - 0.5 * Nx * lx;
			var y = (iy + 0.5) * ly + yc - 0.5 * Ny * ly;
			
			x += bet1 * D * (Math.random() - 0.5);
			y += bet1 * D * (Math.random() - 0.5);
			
			xx.push(x);
			yy.push(y);
			dd.push(D);
			cc.push(colors[0]);
		}
	}
}


// Draw all chart
function drawChart() {
	var cx = caOut2.getContext("2d");
	
	var NS = Niter;
	cx.lineWidth = "2";
	cx.strokeStyle = colors[2];
	cx.beginPath();
	for(var i = 0; i < NS; i++) {
		var X = Xx2(i);
		var Y = Yy2(0.25);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
	
	var NI = Niter;
	cx.strokeStyle = colors[1];
	cx.lineWidth = "2";
	cx.beginPath();
	for(var i = 0; i < NI; i++) {
		var X = Xx2(i);
		var Y = Yy2(0.5);
		if(i == 0) {
			cx.moveTo(X, Y);
		} else {
			cx.lineTo(X, Y);
		}
	}
	cx.stroke();
	
	var NR = Niter;
	cx.strokeStyle = colors[3];
	cx.lineWidth = "2";
	cx.beginPath();
	for(var i = 0; i < NR; i++) {
		var X = Xx2(i);
		var Y = Yy2(0.75);
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
		cx.setLineDash([1, 0]);
		cx.fillStyle = C;
		cx.arc(X, Y, D, 0, 2 * Math.PI);
		cx.fill();
		cx.beginPath();
		cx.strokeStyle = "#444";
		cx.arc(X, Y, D, 0, 2 * Math.PI);
		cx.stroke();
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
		drawLaserAndDetector();
	} else if(n == "Run") {
		stateButton(0, 0, 1, 0);
		btRun.innerHTML = "Stop";
		proc = setInterval(simulate, Tcom);		
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
	var msg = "gmpsa.js\n" +
	"Granular model for particle size analysis\n" +
	"Sparisoma Viridi | https://github.com/dudung\n" +
	"Isa Anshori | isa_anshori@stei.itb.ac.id\n" +
	"Dellia Yulita | dellia.yulita@gmail.com\n" +
	"Erlina | erlinaliana@students.itb.ac.id\n" +
	"Septian Ulan Dini | septianulandini@gmail.com\n" +
	"Jessika | \n" + 
	"Version 20200313";
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


// Transform x to X
function Xx(x) {
	var X = (x - xmin) / (xmax - xmin);
	X *= (XMAX - XMIN);
	X += XMIN;
	return X;
}


// Transform y to Y
function Yy(y) {
	var Y = (y - ymin) / (ymax - ymin);
	Y *= (YMAX - YMIN);
	Y += YMIN;
	return Y;
}
