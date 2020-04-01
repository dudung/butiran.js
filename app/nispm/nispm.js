/*
	nispm.js
	Numerical integration for single particle motion
	
	Sparisoma Viridi | https://github.com/dudung
	
	20200401
	1610 Create this by modifiying ccsasir.js in butiran app.
	1748 Move unecessary funtion to visels.js and iopars.js.
	1755 Finish creating template for this application.
	1802 Test draw a circle, varying input, Read button, ok.
	1858 Test draw theoretical prediction, ok.
	1926 Test calculate rectangular algorithm, but not drawn.
	1932 Finish the code and start to complete the lesson.
	1944 Add information through info().
*/


// Define global variables for simulation
var m, q, B, r, v, D;
var tbeg, tend, dt, t;
var proc, Tproc;

// Define array for series
var xthes, ythes, xnums, ynums;

// Define global variables for theoretical prediction
var omega, R, xc, yc, v0, phi0;

// Define global variables for JS elements
var taIn, taOut;
var btLoad, btRead, btCalc, btInfo;
var caOut;


// Define global variables for other purposes
var RANGE, range;
var colorS, colorF;


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
	range = [0, 0, 1, 1];
	
	colorS = ["#666", "#6f6", "#f66", "#66f"];
	colorF = ["#eee", "#efe", "#fee", "#ddf"];	
}


// Set layout of JS elements
function setLayout() {
	var h = 400;
	btLoad = createButton("Load", 55, 22, load);
	btRead = createButton("Read", 55, 22, read);
	btCalc = createButton("Calc", 55, 22, calc);
	btInfo = createButton("Info", 55, 22, info);
	
	taIn = createTextarea(215, h-32);
	
	var border = "#ccc 1px solid";
	var dvInput = createDivision(220, h, border, "left");
	
	caOut = createCanvas(h, h, border, "left");

	taOut = createTextarea(280, h-5);
	
	document.body.append(dvInput);
		dvInput.append(taIn);
		dvInput.append(btLoad);
		dvInput.append(btRead);
		dvInput.append(btCalc);
		dvInput.append(btInfo);
	document.body.append(caOut);
	document.body.append(taOut);
	
	setButtonsState([true, false, false, true]);
}



// Load parameters
function load() {
	console.log("Load parameters");
	setButtonsState([true, true, false, true]);
	
	var p = "";
	p += "# Enviroment\n";
	p += "BEXT 0 0 -1\n";
	p += "\n";
	p += "# Particle\n";
	p += "MASS 1\n";
	p += "DIAM 0.2\n";
	p += "CHRG 1\n";
	p += "RXYZ 3.5 2.5 0\n";
	p += "VXYZ 0 1 0\n";
	p += "\n";
	p += "# Visualisation\n";
	p += "XMIN 0\n";
	p += "YMIN 0\n";
	p += "XMAX 5\n";
	p += "YMAX 5\n";
	p += "\n";
	p += "# Simulation\n";
	p += "TBEG 0\n";
	p += "TEND 12.56\n";
	p += "TSTP 0.0314\n";
	p += "TPRC 20\n";
	tout(taIn, p);
	
	iter = 0;
}


// Read parameters
function read() {
	console.log("Read parameters");
	setButtonsState([true, true, true, true]);
	
	clearX(caOut);
	clearT(taOut);
	
	B = readValue(taIn, "BEXT");	
	
	m = readValue(taIn, "MASS");
	D = readValue(taIn, "DIAM");
	q = readValue(taIn, "CHRG");
	r = readValue(taIn, "RXYZ");
	v = readValue(taIn, "VXYZ");
	
	tbeg = readValue(taIn, "TBEG");
	tend = readValue(taIn, "TEND");
	dt = readValue(taIn, "TSTP");
	Tproc = readValue(taIn, "TPRC");
	
	var xmin = readValue(taIn, "XMIN");
	var ymin = readValue(taIn, "YMIN");
	var xmax = readValue(taIn, "XMAX");
	var ymax = readValue(taIn, "YMAX");
	range = [xmin, ymin, xmax, ymax];
	
	t = tbeg;
	
	drawCircle(caOut, r[0], r[1], D, "#922", "#faa");
	
	xthes = [];
	ythes = [];
	xnums = [];
	ynums = [];
	
	// Calculate theoretical prediction
	var vx0 = v[0];
	var vy0 = v[1];
	v0 = Math.sqrt(vx0 * vx0 + vy0 * vy0);
	phi0 = Math.atan(vx0 / vy0);
	var Bz = B[2];
	omega = q * Bz / m;
	R = v0 / omega;
	var x0 = r[0];
	var y0 = r[1];
	xc = x0 + vy0 / omega;
	yc = y0 - vx0 / omega;
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


// Perform simulation
function simulate() {
	clearX(caOut);
	
	// Get variables from arrays
	var x = r[0];
	var y = r[1];
	var vx = v[0];
	var vy = v[1];
	
	//var omega, R, xc, yc, v0, phi0;

	// Calculate theoretical prediction
	var vxthe = v0 * Math.sin(omega * t + phi0);
	var vythe = v0 * Math.cos(omega * t + phi0);
	var xthe = xc - R * Math.cos(omega * t + phi0);
	var ythe = yc + R * Math.sin(omega * t + phi0);
	
	// Store results in arrays
	xthes.push(xthe);
	ythes.push(ythe);
	
	// Calculate numerical prediction - rectangular algorithm
	var Bz = B[2];
	var ax = q * vy * Bz / m;
	var ay = -q * vx * Bz / m;
	var vx = vx + ax * dt;
	var vy = vy + ay * dt;
	var x = x + vx * dt;
	var y = y + vy * dt;
	
	// Store results in arrays
	xnums.push(x);
	ynums.push(y);
	
	// Show data
	var data = "";
	data += t.toFixed(3) + " ";
	data += xthe.toFixed(3) + " ";
	data += ythe.toFixed(3) + " ";
	data += x.toFixed(3) + " ";
	data += y.toFixed(3) + "\n";
	tout(taOut, data);
	
	// Draw theoretical trajectory
	drawPolyline(caOut, xthes, ythes, "#00f", 1, [8, 4]);

	// Draw particle and its trajectory
	drawPolyline(caOut, xnums, ynums, "#f00", 1, [8, 4, 2, 4]);
	drawCircle(caOut, x, y, D, "#922", "#faa");
	
	// Put variables from arrays
	r[0] = x;
	r[1] = y;
	v[0] = vx;
	v[1] = vy;
	
	// Increase time
	t += dt;
	
	if(t > tend) {
		btCalc.innerHTML = "Calc";
		setButtonsState([true, true, false, true]);
		clearInterval(proc);
	}
}

// Show information in the console
function info() {
	console.log("Show information");
	var m = "";
	m += "nispm.js | ";
	m += "Numerical integration for single particle motion\n";
	m += "Sparisoma Viridi | https://github.com/dudung\n";
	m += "Version 20200401";
	console.log(m);
}


