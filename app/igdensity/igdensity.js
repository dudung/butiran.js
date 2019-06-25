/*
	igdensity.js
	Intruder and granular density
	
	Sparisoma Viridi | https://github.com/dudung/butiran
	Dewi Muliyati | dmuliyati@gmail.com
	
	Include: <script src="igdensity.js"></script> in a HTML fie
	Execute: Refresh web browser viewing the HTML file
	
	20190619
	0321 Beg from ipendepthf as app template, all as copied
			 first.
	0415 Add second author.
	0520 Try to adjust it for the project, but not yet
			 compatible with the (new) butiran.js, force lib
			 has not been used.
	0722 Begin add spring force to floating object.
	0731 Add block form spring force inside intruder at L193.
	1049 Fix color but not spring force.
	xxxx y.
*/

// Define global variables for walls
var L, R;
var w1, w2, w3, w4, w5, w6, w7, w8;
var WL, WR, WT, WB;
var wL, wR, wT, wB;
var wall, Nw, kw;

// Define global variables for parameters
var gacc, rhof, etaf, velf, kcol, gcol, kspr, gspr, leno;

// Define global variables for simulation
var tstep, tbeg, tend, tdata, tproc, proc, t, Ndata, idata;

// Define global variables for coordinates
var xmin, ymin, xmax, ymax, XMIN, YMIN, XMAX, YMAX;

// Define global variables for box
var boxh, boxw, boxt;

// Define global variables for bed particles
var diag, rhog, numg, geng, r, v, m, D, color;

// Define global variables for intruder
var diai, widi, heii, rhoi, Tint, zint, INTRUDER_CREATED;
var Nint;

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
		
		var ravg = vect3Average(r);
		var zavg = (ravg.z).toFixed(digit + 2);
		
		var zmax = vect3MaxZ(r).toFixed(digit + 2);
		
		var zi = INTRUDER_CREATED ? r[numg - 1].z : zint;
		zi = zi.toFixed(digit + 2);
		
		// Display header for first run
		if(t == tbeg) {
			tout(taOut0, "# t     zavg   zmax   zint\n");
			//            0.00e+0 0.0689 0.1309 0.0000
		}
		
		tout(taOut0,
			tt + " " +
			zavg + " " +
			zmax + " " +
			zi + "\n"
		);
		
		document.title = "ipendepthf: " + t.toFixed(2)
			+ " of " + tend;
		
		if(t >= tend) {
			tout(taOut0, "\n");
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
				var fs1 = kspr * (lij - lo) * 0;
				var Fs1 = Vect3.mul(fs1, nij);
				
				var vij = Vect3.sub(v[i + bid], v[j + bid]);
				var mij = vij.unit();
				var uij = vij.len();
				var ksidot = uij;
				var fs2 = -gspr * uij * 0;
				var Fs2 = Vect3.mul(fs2, mij);
				
				console.log(i, j, i + bid, j + bid);
				
				Fs = Vect3.add(Fn, Vect3.add(Fs1, Fs2));
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
	
	// Create an intruder
	if(t >= Tint && !INTRUDER_CREATED) {
		
		Nint = 0;
		for(var j = 0; j < heii; j++) {
			for(var i = 0; i < widi; i++) {
				D.push(diai);
				var Ri = 0.5 * diai;
				var Vi = (4 * Math.PI / 3) * Ri * Ri * Ri;
				m.push(rhoi * Vi);

				v.push(new Vect3());
				
				var x = 0;
				var y = -0.5 * diai * (widi - 1) + diai * i;
				var z = zint + 0.5 * diai * (heii - 1) + diai * j;
				r.push(new Vect3(x, y, z));
				
				color.push(["#000", "#fa8"]);
				
				numg++;
				Nint++;
			}
		}
		INTRUDER_CREATED = true;
		
		
		// Get initial length
		var did = numg - Nint;
		for(var j = 0; j < Nint; j++) {
			var idle = [];
			for(var i = 0; i < Nint; i++) {
				var k = i + j * widi;
				if(k == 0) {
					var i2 = i + 1;
					var j2 = j;
					var k2 = i2 + j2 * widi;
					var l2 = Vect3.sub(
						r[k + did], r[k2 + did]).len();
					idle.push([k2, l2]);
					var i3 = i;
					var j3 = j + 1;
					var k3 = i3 + j3 * widi;
					var l3 = Vect3.sub(
						r[k + did], r[k3 + did]).len();
					idle.push([k3, l3]);
				}
			}
			if(idle.length > 0) {
				leno.push(idle);
			}
		}
		
		// View condensed middle configuration
		viewConf("Initial configuration");
	}
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
	caOut.width = "150";
	caOut.height = "394";
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
	taOut0.style.width = "270px";
	taOut0.style.height = "192px"
	taOut0.style.overflowY = "scroll";
	taOut0.style.float = "right";
	
	// Create ouput textarea 1
	taOut1 = document.createElement("textarea");
	taOut1.style.width = "270px";
	taOut1.style.height = "192px";
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
	div0.style.width = 358
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
	
	// Create control division
	var div2 = document.createElement("div");
	div2.style.width = "70px";
	div2.style.height = "130px";
	div2.style.border = "#aaa 1px solid";
	div2.style.textAlign = "center";
	
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
	tout(taOut1, cap + "\n");
	
	// Perform according to the clicked button
	if(cap == "Load") {
		loadParameters(taIn);
		btRead.disabled = false;
		tout(taOut1, "Parameters are loaded\n\n");
	} else if(cap == "Clear") {
		clearAll();
		btRead.disabled = true;
		btStart.disabled = true;
		tout(taOut1, "All are cleared except this element\n\n");
	} else if(cap == "Read") {
		readParameters(taIn);
		initParams();
		clearCanvas();
		drawSystem();
		btStart.disabled = false;
		tout(taOut1, "Parameters are read\n");
		tout(taOut1, "Slightly random grains position "
			+ "are generated\n\n");
	} else if(cap == "Start") {
		target.innerHTML = "Stop";
		btRead.disabled = true;
		taIn.disabled = true;
		tout(taOut1, "Simulation starts\n\n");
		proc = setInterval(simulate, tproc);
	} else if(cap == "Stop") {
		target.innerHTML = "Start";
		btRead.disabled = false;
		taIn.disabled = false;
		tout(taOut1, "Simulation stops\n\n");
		clearInterval(proc);
	} else if(cap == "Info") {
		tout(taOut1, "igdensity.js -- 20190619\n"
			+ "Intruder and granular density\n"
			+ "Sparisoma Viridi, Dewi Muliyati, Nuryati, Johri Sabaryati\n"
			+ "https://github.com/dudung/butiran"
			+ "\n\n"
		);
	}
}


// Draw all parts of the system
function drawSystem() {
	var cx = caOut.getContext("2d");
	for(var i = 0; i < numg; i++) {
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
	taOut0.value = "";
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
	lines += "GACC 9.807\n";    // Gravitation      m/s2
	lines += "RHOF 1000\n";     // Fluid density    kg/m3
	lines += "ETAF 8.90E-4\n";  // Fluid vicosity   Pa.s
	lines += "VELF 0\n";        // Fluid velocity   m/s
	lines += "KCOL 400\n";      // Normal constant  N/m
	lines += "GCOL 0.1\n";      // Normal damping   N/m
	lines += "KSPR 5000\n";     // Spring constant  N/m
	lines += "GSPR 0.1\n";      // Spring damping   N/m
	
	lines += "\n";
	lines += "# Simulation\n";
	lines += "TSTEP 0.001\n";   // Time step         s
	lines += "TBEG 0\n";        // Initial time      s
	lines += "TEND 6\n";        // Final time        s
	lines += "TDATA 0.01\n";    // Data period       s
	lines += "TPROC 1\n";       // Event period      ms
	
	lines += "\n";
	lines += "# Coordinates\n"; 
	lines += "XMIN -0.075\n";   // xmin              m
	lines += "YMIN 0\n";        // ymin              m
	lines += "XMAX 0.075\n";    // xmax              m
	lines += "YMAX 0.400\n";    // ymax              m
	
	lines += "\n";
	lines += "# Box\n"; 
	lines += "BOXH 0.40\n";     // Box height        m
	lines += "BOXW 0.15\n";     // Box width         m
	lines += "BOXT 0.15\n";     // Box thickness     m
	
	lines += "\n";
	lines += "# Bed particles\n";
	lines += "DIAG 0.01\n"      // Grains diameter   m
	lines += "RHOG 2000\n";     // Grains density    kg/m3
	lines += "NUMG 154\n";      // Number of grains  -
	lines += "GENG 0\n";        // Generation type   0 random
	
	lines += "\n";
	lines += "# An intruder\n";
	lines += "DIAI 0.01\n"       // Intruder diameter m
	lines += "WIDI 3\n"       // Intruder width (in D)
	lines += "HEII 3\n"       // Intruder height(in D)
	lines += "RHOI 2000\n";      // Intruder density  kg/m3
	lines += "ZINT 0.18\n";      // Intruder position m
	lines += "TINT 0.3\n";       // Time appearance   kg/m3
	
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
	geng = getValue(lines, "GENG");
	
	// Get intruder information
	diai = getValue(lines, "DIAI");
	widi = getValue(lines, "WIDI");
	heii = getValue(lines, "HEII");
	rhoi = getValue(lines, "RHOI");
	zint = getValue(lines, "ZINT");
	Tint = getValue(lines, "TINT");
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
	
	// Define bed particles properties
	r = [];
	v = [];
	m = [];
	D = [];
	color = [];
	if(geng == 0) {
		for(var i = 0; i < numg; i++) {
			D.push(diag);
			var Rg = 0.5 * diag;
			var Vg = (4 * Math.PI / 3) * Rg * Rg * Rg;
			m.push(rhog * Vg);
			v.push(new Vect3());
			color.push(["#000", "#8af"]);
		}
		
		var Nperlayer = parseInt(0.75 * boxw / diag);
		var dx = boxw / Nperlayer
		var Nlayer = Math.ceil(numg / Nperlayer);
		
		var k = 0;
		for(var i = 0; i < Nlayer; i++) {
			for(var j = 0; j < Nperlayer; j++) {
				var x = 0;
				var rndy = 0.1 * dx * Math.random();
				var rndz = 0.1 * dx * Math.random();
				var y = -0.5 * boxw + (j + 0.5) * dx + rndy;
				var z = (i + 0.5) * dx + rndz;
				r.push(new Vect3(x, y, z));
				k++;
				if(k >= numg) {
					break;
				}
			}
		}
	}
	
	// Set intruder parameters
	INTRUDER_CREATED = false;
	leno = [];
	
	// Initialize simulation parameters
	t = tbeg;
	Ndata = Math.floor(tdata / tstep);
	idata = Ndata;
}


// Average some Vect3s
function vect3Average() {
	var r = arguments[0];
	var N = r.length;
	N = INTRUDER_CREATED ? N - 1 : N;
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
	var N = r.length;
	N = INTRUDER_CREATED ? N - 1 : N;
	var zmax = r[0].z;
	for(var i = 1; i < N; i++) {
		if(r[i].z > zmax) {
			zmax = r[i].z;
		}
	}
	return zmax;
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
	tout(taOut1, arguments[0] + " of grains\n");
	tout(taOut1, "# i x       y       z\n");
	//            000 +0.0000 -0.0670 +0.0052
	for(var i = 0; i < numg; i++) {
		var ii = ("000" + i).slice(-3);
		var xx = (r[i].x).toFixed(digit + 2);
		xx = (xx >= 0) ? "+" + xx : xx;
		var yy = (r[i].y).toFixed(digit + 2);
		yy = (yy >= 0) ? "+" + yy : yy;
		var zz = (r[i].z).toFixed(digit + 2);
		zz = (zz >= 0) ? "+" + zz : zz;
		tout(taOut1, ii + " " + xx + " " + yy + " " + zz + "\n");
	}
	tout(taOut1, "\n");
}
