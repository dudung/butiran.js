/*
	hc2sgis.js
	Head-on collision of two spherical grains with internal
	structure
	
	Sparisoma Viridi | https://github.com/dudung/butiran
	
	Include: <script src="hc2sgis.js"></script> in a HTML fie
	Execute: Refresh web browser viewing the HTML file
	
	20190820
	1740 Create this from igensity.js app.
	20190821
	0338 Delete unused div2.
	0458 Two grains can collision in a box.
	0520 Clear unused part of igensity.js app.
	0528 Create sub-grain 0 in two grains.
*/

// Define global variables for walls
var L, R;
var w1, w2, w3, w4, w5, w6, w7, w8;
var WL, WR, WT, WB;
var wL, wR, wT, wB;
var wall, Nw, kw;

// Define global variables for parameters
var gacc, rhof, etaf, velf, kcol, gcol, kspr, gspr, leno, kchg;

// Define global variables for simulation
var tstep, tbeg, tend, tdata, tproc, proc, t, Ndata, idata;

// Define global variables for coordinates
var xmin, ymin, xmax, ymax, XMIN, YMIN, XMAX, YMAX;

// Define global variables for box
var boxh, boxw, boxt;

// Define global variables for grains and sub-grains
var diag, rhog, numg, nums, seqc, r, v, m, D, color;
var velo, orid;

// Define global variables for visual elements
var taIn, caOut, taOut0, taOut1;
var btClear, btLoad, btRead, btStart, btInfo;
var teIn, inIn;

// Execute main function
main();


// Define main function
function main() {
	// Set layout of visual elements
	setElementsLayout();
	
	// Initialize physical parameters
	initParams();
}


// Perform simulation
function simulate() {
	// Stop simulation
	if(t >= tend) {
		btStart.innerHTML = "Start";
		btStart.disabled = true;
		btRead.disabled = false;
		taIn.disabled = false;
		tout(taOut1, "Simulation stops, t = end\n\n");
		viewConf("Final configuration");
		clearInterval(proc);
	}
	
	// Verbose result each tdata period
	if(idata == Ndata) {
		var digit = -Math.floor(Math.log10(tdata));
		var tt = t.toExponential(digit);
		
		//var zavg = vect3AvgZ(r, Nint).toFixed(digit + 2);
		//var zmax = vect3MaxZ(r, Nint).toFixed(digit + 2);
		
		//var bid = numg - Nint;
		//var zi = 0;
		if(/*INTRUDER_CREATED*/true) {
			for(i = 0; i < /*Nint*/10; i++) {
				//zi += r[i + bid].z;
			}
			//zi /= Nint;
		}
		//zi = zi.toFixed(digit + 2);
		
		// Display header for first run
		if(t == tbeg) {
			tout(taOut1, "# t     zbavg  zbmax  ziavg\n");
			//            0.00e+0 0.0689 0.1309 0.0000
		}
		
		tout(taOut1,
			tt + " " +
			//zavg + " " +
			//zmax + " " +
			//zi + "\n"
			+ "\n"
		);
		
		document.title = "ipendepthf: " + t.toFixed(2)
			+ " of " + tend;
		
		if(t >= tend) {
			tout(taOut1, "\n");
		}
		
		clearCanvas();
		drawSystem();
		
		idata = 0;
	}
	
	// Prepare variable for storing total force
	var F = [];
	for(var i = 0; i < numg; i++) {
		F.push(new Vect3());
	}
	
	// Calculate force due to earth gravitation
	for(var i = 0; i < numg; i++) {
		var Fg = new Vect3(0, 0, m[i] * -gacc);
		F[i] = Vect3.add(F[i], Fg);
	}
	
	// Calculate force due to buoyancy
	for(var i = 0; i < numg; i++) {
		var Rg = 0.5 * D[i];
		var Vg = (4 * Math.PI / 3) * Rg * Rg * Rg;
		var Fb = new Vect3(0, 0, rhof * gacc * Vg);
		F[i] = Vect3.add(F[i], Fb);
	}
	
	// Calculate force due to viscosity
	for(var i = 0; i < numg; i++) {
		var Rg = 0.5 * D[i];
		var yR = r[i].y / (0.5 * boxw);
		var vzx = velf;
		var vf = new Vect3(0, 0, vzx);
		var vrel = Vect3.sub(vf, v[i]);
		var Ff = Vect3.mul(6 * Math.PI * etaf * Rg, vrel);
		F[i] = Vect3.add(F[i], Ff);
	}
	
	// Calculare force due to collision with the walls
	for(var i = 0; i < numg; i++) {
		var Fw = new Vect3();
		for(var j = 0; j < Nw; j++) {
			var wj = wall[j];
			var wc = vect3Average(wj);
			var Rg = 0.5 * D[i];
			var nw = Vect3.cross(
				Vect3.sub(wj[1], wj[0]),
				Vect3.sub(wj[2], wj[1])
			).unit();
			var rij = Vect3.dot(Vect3.sub(r[i], wc), nw);
			var ksi = Math.max(0, Rg - rij);
			Fw = Vect3.add(Fw, Vect3.mul(kcol * ksi, nw));
		}
		F[i] = Vect3.add(F[i], Fw);
	}
	
	// Calculare force due to collision between grains
	for(var i = 0; i < numg; i++) {
		var Fn = new Vect3();
		for(var j = 0; j < numg; j++) {
			if(j != i) {
				var rij = Vect3.sub(r[i], r[j]);
				var nij = rij.unit();
				var lij = rij.len();
				var ksi = Math.max(0, 0.5 * (D[i] + D[j]) - lij);
				var fn1 = kcol * ksi;
				var Fn1 = Vect3.mul(fn1, nij);				
				
				var vij = Vect3.sub(v[i], v[j]);
				var uij = vij.len() * Math.sign(ksi);
				var ksidot = uij * Math.sign(ksi);
				var fn2 = -gcol * ksidot;
				var Fn2 = Vect3.mul(fn2, vij.unit());				
				
				Fn = Vect3.add(Fn, Vect3.add(Fn1, Fn2));				
			}
		}
		F[i] = Vect3.add(F[i], Fn);
	}
	
	// Calculate spring force only on intruder
	var INTRUDER_CREATED = false;
	if(INTRUDER_CREATED) {
		var bid = numg - Nint;
		for(var i = 0; i < leno.length; i++) {
			var Fs = new Vect3();
			for(var k = 0; k < leno[i].length; k++) {
				var j = leno[i][k][0];
				var lo = leno[i][k][1];
				
				var rij = Vect3.sub(r[i + bid], r[j + bid]);
				var nij = rij.unit();
				var lij = rij.len();
				var fs1 = -kspr * (lij - lo);
				var Fs1 = Vect3.mul(fs1, nij);
				
				var vij = Vect3.sub(v[i + bid], v[j + bid]);
				var mij = vij.unit();
				var uij = vij.len();
				var ksidot = uij;
				var fs2 = -gspr * uij;
				var Fs2 = Vect3.mul(fs2, mij);
				
				Fs = Vect3.add(Fs, Vect3.add(Fs1, Fs2));
			}
			F[i + bid] = Vect3.add(F[i + bid], Fs);
		}
	}
	
	
	// Calculate acceleration, velocity, and position
	for(var i = 0; i < numg; i++) {
		var a = Vect3.div(F[i], m[i]);
		v[i] = Vect3.add(v[i], Vect3.mul(tstep, a));
		r[i] = Vect3.add(r[i], Vect3.mul(tstep, v[i]));
	}
	
	// Increase time
	idata++;
	t += tstep;
}


// Set layout of all elements
function setElementsLayout() {
	// Create input textarea
	taIn = document.createElement("textarea");
	taIn.style.width = "150px";
	taIn.style.height = "390px";
	taIn.style.overflowY = "scroll"
	taIn.style.float = "left";
	
	// Create output canvas
	caOut = document.createElement("canvas");
	caOut.width = "400";
	caOut.height = "200";
	caOut.style.width = caOut.width + "px";
	caOut.style.height = caOut.height + "px";
	caOut.style.float = "left";
	caOut.style.border = "#aaa 1px solid";
	caOut.style.paddingRight = "2px";
	var cx = caOut.getContext("2d");
	cx.fillStyle = "#fff";
	cx.fillRect(0, 0, caOut.width, caOut.height);
	XMIN = 0;
	YMIN = caOut.height;
	XMAX = caOut.width;
	YMAX = 0;
	
	// Create ouput textarea 0
	taOut0 = document.createElement("textarea");
	taOut0.style.width = "141px";
	taOut0.style.height = "189px"
	taOut0.style.overflowY = "scroll";
	taOut0.style.float = "left";
	
	// Create ouput textarea 1
	taOut1 = document.createElement("textarea");
	taOut1.style.width = "250px";
	taOut1.style.height = "189px";
	taOut1.style.overflowY = "scroll";
	taOut1.style.float = "right";
	
	// Create buttons
	btClear = document.createElement("button");
	btClear.innerHTML = "Clear";
	btClear.style.width = "70px";
	btClear.addEventListener("click", buttonClick);

	btLoad = document.createElement("button");
	btLoad.innerHTML = "Load";
	btLoad.style.width = "70px";
	btLoad.addEventListener("click", buttonClick);
	
	btRead = document.createElement("button");
	btRead.innerHTML = "Read";
	btRead.style.width = "70px";
	btRead.disabled = true;
	btRead.addEventListener("click", buttonClick);

	btStart = document.createElement("button");
	btStart.innerHTML = "Start";
	btStart.style.width = "70px";
	btStart.disabled = true;
	btStart.addEventListener("click", buttonClick);

	btInfo = document.createElement("button");
	btInfo.innerHTML = "Info";
	btInfo.style.width = "70px";
	btInfo.addEventListener("click", buttonClick);
	
	// Create main division
	var div0 = document.createElement("div");
	div0.style.border = "#aaa 1px solid";
	div0.style.width = 82
		+ parseInt(taIn.style.width)
		+ parseInt(caOut.style.width) + "px";
	div0.style.height = 6
		+ parseInt(taIn.style.height) + "px";
	div0.style.background = "#eee";
	
	// Create button division
	var div1 = document.createElement("div");
	div1.style.width = "70px";
	div1.style.height = (105 + 290) + "px";
	div1.style.float = "left";
	div1.style.border = "#aaa 1px solid";
	
	// Set layout of visual components
	document.body.append(div0);
		div0.append(taIn);
		div0.append(div1);
			div1.append(btClear);
			div1.append(btLoad);
			div1.append(btRead);
			div1.append(btStart);
			div1.append(btInfo);
		div0.append(caOut);
		div0.append(taOut0);
		div0.append(taOut1);
}


// Do something when buttons clicked
function buttonClick() {
	// Get target and verbose to taOut1
	var target = event.target;
	var cap = target.innerHTML;
	tout(taOut0, cap + "\n");
	
	// Perform according to the clicked button
	if(cap == "Load") {
		loadParameters(taIn);
		btRead.disabled = false;
		tout(taOut0, "Parameters are loaded\n\n");
	} else if(cap == "Clear") {
		clearAll();
		btRead.disabled = true;
		btStart.disabled = true;
		tout(taOut0, "All are cleared except this element\n\n");
	} else if(cap == "Read") {
		readParameters(taIn);
		initParams();
		clearCanvas();
		drawSystem();
		btStart.disabled = false;
		tout(taOut0, "Parameters are read\n");
		tout(taOut0, "Slightly random grains position "
			+ "are generated\n\n");
	} else if(cap == "Start") {
		target.innerHTML = "Stop";
		btRead.disabled = true;
		taIn.disabled = true;
		tout(taOut0, "Simulation starts\n\n");
		proc = setInterval(simulate, tproc);
	} else if(cap == "Stop") {
		target.innerHTML = "Start";
		btRead.disabled = false;
		taIn.disabled = false;
		tout(taOut0, "Simulation stops\n\n");
		clearInterval(proc);
	} else if(cap == "Info") {
		tout(taOut0, "hc2sgis.js -- 20190820\n"
			+ "Head-on collision of two spherical grains "
			+ "with internal structure\n"
			+ "Sparisoma Viridi | "
			+ "https://github.com/dudung/butiran \n"
			+ "\n\n"
		);
	}
}


// Draw all parts of the system
function drawSystem() {
	var cx = caOut.getContext("2d");
	for(var i = 0; i < numg + numg * nums; i++) {
		var xx = r[i].y;
		var yy = r[i].z;
		var R1 = transform(xx, yy);
		var R2 = transform(xx + 0.5 * D[i], yy)
		
		cx.beginPath();
		cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI);
		cx.fillStyle = color[i][1];
		cx.closePath();
		cx.fill();
		
		cx.beginPath();
		cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI);
		cx.strokeStyle = color[i][0];
		cx.stroke();
	}
	
	// Transform real coordinates to canvas coordinates
	function transform(xx, yy) {
		var XX = (xx - xmin) / (xmax - xmin) * (XMAX - XMIN)
			+ XMIN;
		var YY = (yy - ymin) / (ymax - ymin) * (YMAX - YMIN)
			+ YMIN;
		return {X: XX, Y: YY};
	}
}


// Clear all
function clearAll() {
	taIn.value = "";
	taOut1.value = "";
	clearCanvas();
}

// Clear canvas
function clearCanvas() {
	var cx = caOut.getContext("2d");
	cx.fillStyle = "#fff";
	cx.fillRect(0, 0, caOut.width, caOut.height);	
}


// Load parameters to textarea
function loadParameters() {
	var lines = "";
	lines += "# Parameters\n";
	lines += "GACC 0\n";        // Gravitation      m/s2
		//9.807
	lines += "RHOF 1000\n";     // Fluid density    kg/m3
	lines += "ETAF 0\n";        // Fluid vicosity   Pa.s
		//8.90E-4
	lines += "VELF 0\n";        // Fluid velocity   m/s
	lines += "KCOL 1E6\n";      // Normal constant  N/m
	lines += "GCOL 0.1\n";      // Normal damping   N/m
	lines += "KSPR 500\n";      // Spring constant  N/m
	lines += "GSPR 0.01\n";     // Spring damping   N/m
	lines += "KCHG 1\n";        // Charge constant  N.m2/C2
	
	lines += "\n";
	lines += "# Simulation\n";
	lines += "TSTEP 0.001\n";  // Time step         s
	lines += "TBEG 0\n";        // Initial time      s
	lines += "TEND 5\n";        // Final time        s
	lines += "TDATA 0.01\n";    // Data period       s
	lines += "TPROC 1\n";       // Event period      ms
	
	lines += "\n";
	lines += "# Coordinates\n"; 
	lines += "XMIN -1\n";       // xmin              m
	lines += "YMIN 0\n";        // ymin              m
	lines += "XMAX 1\n";        // xmax              m
	lines += "YMAX 1\n";        // ymax              m
	
	lines += "\n";
	lines += "# Box\n"; 
	lines += "BOXH 1.00\n";     // Box height        m
	lines += "BOXW 2.00\n";     // Box width         m
	lines += "BOXT 2.00\n";     // Box thickness     m
	
	lines += "\n";
	lines += "# Grains and sub-grains\n";
	lines += "DIAG 0.5\n"       // Grains diameter   m
	lines += "RHOG 2000\n";     // Grains density    kg/m3
	lines += "NUMG 2\n";        // Number of grains  -
	lines += "NUMS 7\n";        // Number of sub-gr  -
	lines += "VELO 2\n";        // Velocity          m/s
	lines += "ORID 0.000\n";    // Orientation diff  rad
	lines += "SEQC 0\n";        // Sequence charge#  0
	
	var ta = arguments[0];
	ta.value = lines;
	ta.scrollTop = ta.scrollHeight;
}


// Read parameters
function readParameters() {
	var lines = arguments[0].value;
	
	// Get parameters information
	gacc = getValue(lines, "GACC");
	rhof = getValue(lines, "RHOF");
	etaf = getValue(lines, "ETAF");
	velf = getValue(lines, "VELF");
	kcol = getValue(lines, "KCOL");
	gcol = getValue(lines, "GCOL");
	kspr = getValue(lines, "KSPR");
	gspr = getValue(lines, "GSPR");
	kchg = getValue(lines, "KCHG");

	// Get simulation information
	tstep = getValue(lines, "TSTEP");
	tbeg = getValue(lines, "TBEG");
	tend = getValue(lines, "TEND");
	tdata = getValue(lines, "TDATA");
	tproc = getValue(lines, "TPROC");

	// Get coordinates information
	xmin = getValue(lines, "XMIN");
	ymin = getValue(lines, "YMIN");
	xmax = getValue(lines, "XMAX");
	ymax = getValue(lines, "YMAX");

	// Get box information
	boxh = getValue(lines, "BOXH");
	boxw = getValue(lines, "BOXW");
	boxt = getValue(lines, "BOXT");

	// Get bed particles information
	diag = getValue(lines, "DIAG");
	rhog = getValue(lines, "RHOG");
	numg = getValue(lines, "NUMG");
	nums = getValue(lines, "NUMS");
	velo = getValue(lines, "VELO");
	orid = getValue(lines, "ORID");
	seqc = getValue(lines, "SEQC");	
}


// Get value from a line inside parameter textarea
function getValue(lines, key) {
	var value = undefined;
	var line = lines.split("\n");
	var N = line.length;
	for(var i = 0; i < N; i++) {
		var col = line[i].split(" ");
		if(col[0] == key) {
			value = parseFloat(col[1]);
		}
	}
	return value;
}


// Initialize all parameters
function initParams() {
	// Define box size, width = 2R, height = L
	R = 0.5 * boxw; // m, boxt = boxw
	L = boxh;       // m
	
	// Define 8 points for box corners
	w1 = new Vect3(R, -R, 0);
	w2 = new Vect3(R, R, 0);
	w3 = new Vect3(-R, -R, 0);
	w4 = new Vect3(-R, R, 0);
	w5 = new Vect3(R, -R, L);
	w6 = new Vect3(R, R, L);
	w7 = new Vect3(-R, -R, L);
	w8 = new Vect3(-R, R, L);
	
	// Define 4 walls using previous points
	WL = [w1, w3, w7, w5];
	WR = [w2, w6, w8, w4];
	WT = [w5, w7, w8, w6];
	WB = [w1, w2, w4, w3];
	wall = [WL, WR, WT, WB];
	Nw = wall.length;
	
	// Calculate center of each wall
	wL = vect3Average(WL);
	wR = vect3Average(WR);
	wT = vect3Average(WT);
	wB = vect3Average(WB);
	
	// Define grains and sub-grains properties
	r = [];
	v = [];
	m = [];
	D = [];
	color = [];
	if(seqc == 0) {
		for(var i = 0; i < numg; i++) {
			D.push(diag);
			var Rg = 0.5 * diag;
			var Vg = (4 * Math.PI / 3) * Rg * Rg * Rg;
			m.push(rhog * Vg);
			color.push(["#000", "#8af"]);
		}
		
		var Nperlayer = parseInt(0.75 * boxw / diag);
		var dx = boxw / Nperlayer
		var Nlayer = Math.ceil(numg / Nperlayer);
		
		
		r.push(new Vect3(0, -0.5, 0.5));
		v.push(new Vect3(0, velo, 0));
		r.push(new Vect3(0, 0.5, 0.5));
		v.push(new Vect3(0, -velo, 0));
		
		
		var subgrainsColor = [
			["#000", "#0f0"],
			["#000", "#f00"],
			["#000", "#f00"],
			["#000", "#0f0"],
			["#000", "#00f"],
			["#000", "#00f"],
			["#000", "#0f0"],
		];
		
		// Sub-grains in particle 1
		var beta = 0;
		for(var i = 0; i < nums; i++) {
			var diags = diag / 3;
			D.push(diags);
			var Rg = 0.5 * diags;
			var Vg = (4 * Math.PI / 3) * Rg * Rg * Rg;
			m.push(rhog * Vg);
			color.push(subgrainsColor[i]);
			v.push(v[0]);
			
			var ri = new Vect3(r[0]);
			if(i > 0) {
				var fi = beta + Math.PI * (2 * i - 3) / 6;
				var xx = 0;
				var yy = diags * Math.cos(fi);
				var zz = diags * Math.sin(fi);
				var dr = new Vect3(xx, yy, zz);
				ri = Vect3.add(ri, dr);
			}
			r.push(ri);
		}
		
		// Sub-grains in particle 2
		beta += orid;
		for(var i = 0; i < nums; i++) {
			var diags = diag / 3;
			D.push(diags);
			var Rg = 0.5 * diags;
			var Vg = (4 * Math.PI / 3) * Rg * Rg * Rg;
			m.push(rhog * Vg);
			color.push(["#000", "#8af"]);
			r.push(new Vect3(0, 0.5, 0.5));
			v.push(v[1]);
		}
	}
	
	// Initialize simulation parameters
	t = tbeg;
	Ndata = Math.floor(tdata / tstep);
	idata = Ndata;
}


// Average some Vect3s
function vect3Average() {
	var r = arguments[0];
	var N = r.length;
	var c = new Vect3;
	for(var i = 0; i < N; i++) {
		c = Vect3.add(c, r[i]);
	}
	c = Vect3.div(c, N);
	return c;
}


// Get max of a component of some Vect3s
function vect3MaxZ() {
	var r = arguments[0];
	var Nint = arguments[1];
	var N = r.length - Nint;
	var zmax = r[0].z;
	for(var i = 1; i < N; i++) {
		if(r[i].z > zmax) {
			zmax = r[i].z;
		}
	}
	return zmax;
}

// Get average of a component of some Vect3s
function vect3AvgZ() {
	var r = arguments[0];
	var Nint = arguments[1];
	var N = r.length - Nint;
	var zavg = 0;
	for(var i = 0; i < N; i++) {
		zavg += r[i].z;
	}
	zavg /= N;
	return zavg;
}

// Display text in an output textarea
function tout() {
	var taOut = arguments[0];
	var msg = arguments[1];
	taOut.value += msg;
	taOut.scrollTop = taOut.scrollHeight;
}


// View current configuration
function viewConf() {
	var digit = -Math.floor(Math.log10(tdata));
	tout(taOut0, arguments[0] + " of grains\n");
	tout(taOut0, "# i x       y       z\n");
	//            000 +0.0000 -0.0670 +0.0052
	for(var i = 0; i < numg; i++) {
		var ii = ("000" + i).slice(-3);
		var xx = (r[i].x).toFixed(digit + 2);
		xx = (xx >= 0) ? "+" + xx : xx;
		var yy = (r[i].y).toFixed(digit + 2);
		yy = (yy >= 0) ? "+" + yy : yy;
		var zz = (r[i].z).toFixed(digit + 2);
		zz = (zz >= 0) ? "+" + zz : zz;
		tout(taOut0, ii + " " + xx + " " + yy + " " + zz + "\n");
	}
	tout(taOut0, "\n");
}
