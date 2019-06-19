/*
	rk2dsp.js
	Rotary kil in 2-d for spherical particles
	
	Sparisoma Viridi | dudung@gmail.com
	Putri Mustika Widartiningsih | putrimw.itb@gmail.com
	Rafika Sari | rafikasari2909@gmail.com
	
	20170628
	Start this HTML (create liner), this project.
	20181121
	Change to JS.
	20190602
	1630 Change from s2drotkiln to rk2dsp, with old description
	Simulation of 2-d rotary kiln for spherical particles.
	1646 Remove internal Vect3 and adjust command, it works.
	1647 Removing Grain and it works.
	1657 Keep the other for history reason. A new version will
	be developed in a new name.
*/


/*
	force.js
	Library of some types of physical force.
	Sparisoma Viridi | dudung@gmail.com
	
	20170214
	Create this library and define some constants,
	e.g. kG, kR, kV, kE and some functions
	grav()	gravitation force,
	norm()	normal force,
	coul()	Coulomb force.
	These two are tested for value only and not yet in
	simulation.
	20170215
	Test the grav() and norm() in a simulation. They worked.
*/

// Define some constants
kG = 5E0;
kR = 1E5;
kV = 1.0;
kE = 1.0;
kV2 = 40.0;
kG2 = new Vect3(0, -10, 0);

// Class of Force
function Force() {
	
}

// Define gravitation force due to gravitation field
Force.grav2 = function(p) {
	var m = p.m;
	var f = Vect3.mul(m, kG2);
	return f;
}

// Define gravitation force
Force.grav = function(p1, p2) {
	var m1 = p1.m;
	var m2 = p2.m;
	var r1 = p1.r;
	var r2 = p2.r;
	var r = Vect3.sub(r1, r2);
	var u = Vect3.uni(r);
	var f = Vect3.mul(-kG * m1 * m2 / Vect3.dot(r, r), u);
	return f;
}

// Define normal force
Force.norm = function(p1, p2) {
	var R1 = 0.5 * p1.D;
	var R2 = 0.5 * p2.D;
	var r1 = p1.r;
	var r2 = p2.r;
	var r = Vect3.sub(r1, r2);
	var u = r.unit();
	var v1 = p1.v;
	var v2 = p2.v;
	var v = Vect3.sub(v1, v2);
	var xi = Math.max(0, R1 + R2 - r.len());
	var xidot = v.len();
	var f = Vect3.mul(kR * xi - kV * xidot, u);
	if(xi == 0) {
		f = new Vect3;
	}
	return f;
}

// Define Coulomb force
Force.coul = function(p1, p2) {
	var q1 = p1.q;
	var q2 = p2.q;
	var r1 = p1.r;
	var r2 = p2.r;
	var r = Vect3.sub(r1, r2);
	var u = Vect3.uni(r);
	var f = Vect3.mul(kE * q1 * q2 / Vect3.dot(r, r), u);
	return f;
}

// Define viscous force
Force.visc = function(p) {
	var v = p.v;
	var f = Vect3.mul(-kV2, v);
	return f;
}


/*
	mdynamics.js
	Library of simple molecular dynamics
	Sparisoma Viridi | dudung@gmail.com
	
	20170214
	Create this library.
	20170215
	There is bug in using Timer object, where it was twice
	called, then it could not be stopped. A condition must
	be set to avoid creating another object incidentally.
*/

// Define some global constants
dt = 0.01;
t = 0;
TT = 0;

// Class of Mdynamics
function Mdynamics() {
	
}

// Set time step and reset time
Mdynamics.setdt = function(dtt) {
	dt = dtt;
	t = 0;
}

// Perform Euler integration
Mdynamics.Euler = function(SF, p) {
	var m = p.m;
	var r = p.r;
	var v = p.v;
	var a = Vect3.div(SF, m);
	r = Vect3.add(r, Vect3.mul(v, dt));
	v = Vect3.add(v, Vect3.mul(a, dt));
	p.r = r;
	p.v = v;
}

// Increase time
Mdynamics.inct = function() {
	t += dt;
	TT++;
}


/*
	layout.js
	Define layout for simulation.
	Sparisoma Viridi | dudung@gmail.com
	
	20170215
	Start this library.
*/

function layout() {
	// Create left division
	var ldiv = document.createElement("div");
	document.body.appendChild(ldiv);
	ldiv.style.border = "0px black solid";
	ldiv.style.height = "402px";
	ldiv.style.float = "left";
	ldiv.style.width = "163px";
	
	// Create right division
	var rdiv = document.createElement("div");
	document.body.appendChild(rdiv);
	rdiv.style.border = "0px black solid";
	rdiv.style.height = "402px";
	rdiv.style.float = "left";
	
	// Create text area for input
	var ta = document.createElement("textarea");
	ldiv.appendChild(ta);
	ta.style.color = "black";
	ta.style.background = "white";
	ta.rows = "2";
	ta.cols = "20";
	ta.style.display = "block";	
	ta.id = "hout";
	
	var res = document.createElement("textarea");
	res.style.color = "black";
	res.style.background = "white";
	res.rows = "35";
	res.cols = "32";
	res.style.overflowY = "scroll";
	res.style.display = "block";	
	res.id = "result";
	res.value = "";
	
	// Create canvas for drawing
	var c = document.createElement("canvas");
	rdiv.appendChild(c);
	c.id = "canvas";
	c.style.border = "1px solid #999";
	c.style.background = "white";
	c.width = "400";
	c.height = "400";
	//c.style.float = "left";
	var ctx = c.getContext("2d");
	
	// Prepare canvas
	setCanvasCoordinates("canvas");
	setWorldCoordinates(-41, -41, 41, 41);
	
	// Create start button
	var b1 = document.createElement("button");
	ldiv.appendChild(b1);
	b1.innerHTML = "Start";
	b1.onclick = function() {
		if(b1.innerHTML == "Start") {
			b1.innerHTML = "Stop";
			timer1 = setInterval(run, 1);
		} else {
			b1.innerHTML = "Start";
			clearInterval(timer1);
		}
	}
	
	// Create save Button
	var b2 = document.createElement("button");
	ldiv.appendChild(b2);
	b2.innerHTML = "Save";
	b2.onclick = function() {
		var canvas = document.getElementById("canvas");
		var image = canvas.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");
		window.location.href = image;
	}
}


/*
	draw2d.js
	Set drawing environment in 2d using canvas object
	Sparisoma Viridi | dudung@gmail.com
	
	20170117
	Create drawing environment for draw demonstration in
	a lecture, with functions
	setWorldCoordinates()
	setCanvasCoordinates()
	transX()
	transY()
	clearCurrentFigure()
	20170215
	Integrate and adjust previous work to Grains.
	20160216
	Add text for particle identification with center for
	horizontal alignment and middle for vertical alignment.
*/	

// Define global variables for real world coordinates
var xwmin = 0;
var ywmin = 0;
var xwmax = 0;
var ywmax = 0;

// Define global variables for canvas coordinate
var xcmin = 0;
var ycmin = 0;
var xcmax = 0;
var ycmax = 0;

// Define current canvas
var currentFigure = "";
var figureBackground = "#fff";

// Set real world coordinates
function setWorldCoordinates(xmin, ymin, xmax, ymax) {
	xwmin = xmin;
	ywmin = ymin;
	xwmax = xmax;
	ywmax = ymax;	
}

// Set canvas coordinates
function setCanvasCoordinates(canvasId) {
	currentFigure = canvasId;
	var c = document.getElementById(canvasId);	
	xcmin = 0;
	ycmin = c.height;
	xcmax = c.width;
	ycmax = 0;
}

// Transform x
function transX(x) {
	var xx = (x - xwmin) / (xwmax - xwmin) * (xcmax - xcmin);
	xx += xcmin;
	var X = parseInt(xx);
	return X;
}

// Transform y
function transY(y) {
	var yy = (y - ywmin) / (ywmax - ywmin) * (ycmax - ycmin);
	yy += ycmin;
	var Y = parseInt(yy);
	return Y;
}

// Clear current figure
function clearCurrentFigure() {
	var c = document.getElementById(currentFigure);
	var ctx = c.getContext("2d");
	ctx.fillStyle = figureBackground;
	ctx.fillRect(xcmin, ycmax, xcmax, ycmin);
}

// Plot particle
function plotParticle(p) {
	var x = p.r.x;
	var y = p.r.y;
	var D = p.D;
	
	var xx = transX(x);
	var yy = transY(y);
	var DD = transX(D) - transX(0);
	
	var c = document.getElementById(currentFigure);
	var ctx = c.getContext("2d");
	ctx.strokeStyle = p.c;
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(xx, yy, 0.5 * DD, 0, 2 * Math.PI);
	ctx.stroke();
	
	ctx.font = "20px Times New Roman"
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline="middle";
	ctx.fillText(p.i, xx, yy);
}

//Plot liner
function plotLiner(p) {
	var x = p.r.x;
	var y = p.r.y;
	var D = p.D;
	
	var xx = transX(x);
	var yy = transY(y);
	var DD = transX(D) - transX(0);
	
	var c = document.getElementById(currentFigure);
	var ctx = c.getContext("2d");
	ctx.strokeStyle = p.c;
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(xx, yy, 0.5 * DD, 0, 2 * Math.PI);
	ctx.stroke();
	
	ctx.font = "20px Times New Roman"
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline="middle";
	ctx.fillText(p.i, xx, yy);	
}


/*
indexLiner.html
Simulate 2D Rotary Kiln
Sparisoma Viridi | dudung@gmail.com
Putri Mustika Widartiningsih | putrimw.itb@gmail.com

20170628
Start this HTML (create liner)
20170703
Add grains
*/

var timer1;
var TTMAX = 10;
var liner = new Array(NL);
var grains = new Array(NG);
var x = new Array(NL);
var y = new Array(NL);
var xx = new Array(NL);
var yy = new Array(NL);
var Theta = new Array(NL);

var RM = 35;
var NL = 20;
var NG = 25;
var N = NL + NG;

var theta = 2*Math.PI/NL;
var w = -0.8;
var x0 = -60;
var y0 = -60;

layout();
initiate();

function initiate() {
	Mdynamics.setdt(1E-3);
	
	var mL = 1;
	var cL = "#00f";
	var mG = 40;
	var cG = "#f00";
	
	var DL = 2 * RM * Math.sin(Math.PI / NL);
	var DG = 6;
	var i = 0;
	
	for (var ix=0; ix<N; ix++) {
		grains[i] = new Grain;
		grains[i].i = i+1;
		if(i < NL) {
			Theta[i] = i*theta + w*t;
			x[i] = RM * Math.cos(Theta[i]);
			y[i] = RM * Math.sin(Theta[i]);
			grains[i].r = new Vect3(x[i],y[i],0);
			grains[i].m = mL;
			grains[i].c = cL;
			grains[i].D = DL;
		} else {						
			grains[i].m = mG;
			grains[i].c = cG;
			grains[i].D = DG;
		}
		i++;
	}
	
	var ii = 0;
	var Nx = Math.sqrt(NG);
	var Ny = NG / Nx;
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var xx = (ix - 0.4 * Nx) * 1.1 * DG;
			var yy = (iy - 0.4 * Ny) * 1.1 * DG;
			grains[ii + NL].r = new Vect3(xx, yy, 0);
			ii++;
		}
	}
		
	for(var iG = 0; iG < N; iG++) {
		if(i >= NL) {
			plotLiner(grains[iG]);
		} else {
			plotParticle(grains[iG]);
		}
	}
}


function run() {
	// Prepare variabel for saving sum of forces
	var SF = new Array(N);
	for(var iN = NL; iN < N; iN++) {
		SF[iN] = new Vect3;
	}
	
	// Calculate viscous force
	for(var iN = NL; iN < N; iN++) {
		var f = Force.visc(grains[iN]);
		SF[iN] = Vect3.add(SF[iN], f);
	}
	
	// Calculate gravitation force
	for(var iN = NL; iN < N; iN++) {
		var f = Force.grav2(grains[iN]);
		SF[iN] = Vect3.add(SF[iN], f);
	}
	
	// Calculate normal force
	for(var iN = NL; iN < N; iN++) {
		for(var jN = 0; jN < N; jN++) {
			var f = new Vect3;
			if(jN != iN) {
				f = Force.norm(grains[iN], grains[jN]);
				SF[iN] = Vect3.add(SF[iN], f);
			}
		}
	}
		
	var str = "t = " + t.toFixed(3) + " s";
	var hout = document.getElementById("hout");
	hout.innerHTML = str;
	
	if(TT == TTMAX) {
		clearCurrentFigure();
		for(var iN = 0; iN < N; iN++) {
			plotParticle(grains[iN]);
		}
		TT = 0;
	}
	
	for(var iN = NL; iN < N; iN++) {
		Mdynamics.Euler(SF[iN], grains[iN]);
	}
	Mdynamics.inct();
	
	for(var iN = 0; iN < NL; iN++) {
		var x = grains[iN].r.x;
		var y = grains[iN].r.y;
		theta2 = Math.atan(y / x);
		if(y <= 0) {
			theta2 += Math.PI;
		}
		theta2 = theta2 + w * dt;
		var x = RM * Math.cos(theta2);
		var y = RM * Math.sin(theta2);
		grains[iN].r.x = x;
		grains[iN].r.y = y;
	}	
}
