/*
	spfwfss.js
	Spherical particle floating on waving fluid surface
	
	Sparisoma Viridi | dudung@gmail.com
	Nurhayati | firstnur1708@gmail.com
	Johri Sabaryati | joyafarashy@gmail.com
	Dewi Muliyati | dmuliyati@gmail.com
	
	20180713
	Start creating this application based on slide posted at
	https://osf.io/94vsk/
	20180714
	Continue creating the application.
	20180802
	Fix water viscosity value from 1 Pa.s to 1 mPa.s and it does not work. Still use the previous value.
	Add direction of fluid surface wave with dirf.
	Modify fluid velocity, whose components is from vibration and traveling wave.
	20180929
	Change name according to new naming convention.
	CDN https://rawgit.com/dudung/butiran/master/app
	/md_spfwfss.html
	20181120
	Change to JS.
	20190529
	1129 Change name from md_spfwfss to spfwfs and start to
	move to app (new butiran.js).
	20190530
	1025 Migrate to (new) butiran.js library and add a
	reference.
	1310 Finish drawing wave.
	1724 Draw initial position as circle with background only.
	
	References
	1. Sparisoma Viridi, Nurhayati, Johri Sabaryati,
		 Dewi Muliyati, "Two-Dimensional Dynamics of Spherical
		 Grain Floating on the Propagating Wave Fluid Surface",
		 SPEKTRA: Jurnal Fisika dan Aplikasinya [], vol. 3,
		 no. 3, pp. , December 2018, url
		 https://doi.org/10.21009/SPEKTRA.033.01
*/

// Define global variables
var params;
var taIn, taOut, caOut;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var dx;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var wA, wT, wL, wX, wY;
var o, o0;

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
	p += "# Environment\n";
	p += "WAMP 0.0500\n";
	p += "WTIM 1.0000\n";
	p += "WLEN 1.0000\n";
	p += "LSTP 0.0100\n";
	p += "\n";
	p += "# Particle\n";
	p += "MASS 0.1000\n";
	p += "DIAM 0.1000\n";
	p += "POST 0.0000 0.0000 0.0000\n";
	p += "VELO 0.0000 1.0000 0.0000\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0.0000\n";
	p += "TEND 100.00\n";
	p += "TSTP 0.0100\n";
	p += "TDAT 0.1000\n";
	p += "TPRC 5\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -1.000 -1.000 -1.000\n";
	p += "RMAX +1.000 +1.000 +1.000\n";
	p += "\n";
	
	params = p;
	
	digit = 4;
}


// Load parameters
function loadParams() {
	clearText(taIn);
	addText(params).to(taIn);
}


// Read parameters
function readParams() {
var m = getValue("MASS").from(taIn);
var D = getValue("DIAM").from(taIn);
var r = getValue("POST").from(taIn);
var v = getValue("VELO").from(taIn);

tbeg = getValue("TBEG").from(taIn);
tend = getValue("TEND").from(taIn);
dt = getValue("TSTP").from(taIn);
Tdata = getValue("TDAT").from(taIn);
Tproc = getValue("TPRC").from(taIn);

wA = getValue("WAMP").from(taIn);
wT = getValue("WTIM").from(taIn);
wL = getValue("WLEN").from(taIn);
dx = getValue("LSTP").from(taIn);
wX = [];
wY = [];

var rmin = getValue("RMIN").from(taIn);
var rmax = getValue("RMAX").from(taIn);

iter = 0;
Niter = Math.floor(Tdata / dt);

xmin = rmin.x;
ymin = rmin.y;
zmin = rmin.z;
xmax = rmax.x;
ymax = rmax.y;
zmax = rmax.z;

t = tbeg;

o = new Grain();
o.m = m;
o.q = 0;
o.D = D;
o.r = r;
o.v = v;
o.c = ["#f00"];

o0 = new Grain();
o0.D = D;
o0.r = new Vect3(r);
o0.c = ["#fff", "#fcc"];

XMIN = 0;
XMAX = caOut.width;
YMIN = caOut.height;
YMAX = 0;
ZMIN = -1;
ZMAX = 1;
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
		height = "200px";
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
	caOut.width = "439";
	caOut.height = "439";
	with(caOut.style) {
		width = caOut.width +  "px";
		height = caOut.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	
	// Create div for left part
	var dvLeft = document.createElement("div");
	with(dvLeft.style) {
		width = "220px";
		height = "442px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Create div for right part
	var dvRight = document.createElement("div");
	with(dvRight.style) {
		width = "442px";
		height = "442px";
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
		info += "spfwfss.js\n";
		info += "Spherical particle floating on waving fluid ";
		info += "surface\n";
		info += "Sparisoma Viridi, Nuryahati, Johri Sabaryati, Dewi Muliyai\n";
		info += "https://github.com/dudung/butiran.js\n";
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


// Define wave function
function waveFunction() {
	var x = arguments[0];
	var t = arguments[1];
	
	var A = wA;
	var T = wT;
	var lambda = wL;
	var omega = 2 * Math.PI / T;
	var k = 2 * Math.PI / lambda;
	
	var y = A * Math.sin(k * x - omega * t);
	return y;
}


// Create wave
function createWave() {
	var t = arguments[0];
	
	var x = [];
	var y = [];
	
	var N = (xmax - xmin) / dx;
	for(var i = 0; i < N; i++) {
		var xx = xmin + i * dx;
		var yy = waveFunction(xx, t);
		
		x.push(xx);
		y.push(yy);
	}
	
	var p = new Points();
	p.addSeries(x);
	p.addSeries(y);
	return p;
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
		var tt = t.toFixed(digit);
		var info = tt + "\n";
		addText(info).to(taOut);
	}
	
	/*
	var FB = magnetic.force(o);
	var F = FB;
	var a = Vect3.div(F, o.m);
	o.v = Vect3.add(o.v, Vect3.mul(a, dt));
	if(corv != 0) {
		var un = o.q * magnetic.B.len() * dt / o.m;
		var alpha = 1 / Math.sqrt(1 + un * un);
		o.v = Vect3.mul(o.v, alpha);
	}
	o.r = Vect3.add(o.r, Vect3.mul(o.v, dt));
	*/
	
	p = createWave(t);
	o.r.y = waveFunction(o.r.x, t);
		
	clearCanvas(caOut);	
	draw(o0).onCanvas(caOut);
	draw(o).onCanvas(caOut);
	draw(p).onCanvas(caOut);
	
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


// Draw Grain, Path, Points on canvas
function draw() {
	var o = arguments[0];
	var result = {
		onCanvas: function() {
			var ca = arguments[0];
			var cx = ca.getContext("2d");
			var lintrans = Transformation.linearTransform;
			
			if(o instanceof Grain) {
				var xg = o.r.x;
				var dx = xg + o.D;
				var yg = o.r.y;
				
				var X = lintrans(xg, [xmin, xmax], [XMIN, XMAX]);
				var DX = lintrans(dx, [xmin, xmax], [XMIN, XMAX]);
				var D = DX - X;
				var Y = lintrans(yg, [ymin, ymax], [YMIN, YMAX]);
				
				cx.beginPath();
				if(o.c instanceof Array) {
					cx.strokeStyle = o.c[0];
					if(o.c.length > 1) {
						cx.fillStyle = o.c[1];
					}
				} else {
					cx.strokeStyle = o.c;
				}
				
				if(o.c instanceof Array && o.c.length > 1) {
					cx.arc(X, Y, D, 0, 2 * Math.PI);
					cx.fill();
				}
				cx.lineWidth = "2";
				cx.arc(X, Y, D, 0, 2 * Math.PI);
				cx.stroke();
			} else if(o instanceof Path) {
				var qi = o.qi * 2 * Math.PI;
				var qf = o.qf * 2 * Math.PI;
				var L = o.l;
				var color = o.c;
				
				var N = Math.floor(L / ds);
				var q = qi;
				var dq = (qf - qi) / N;
				
				var xx = [];
				var yy = [];
				for(i = 0; i < N; i++) {
					var dx = ds * Math.cos(q);		
					x += dx;
					xx.push(x);
					sx.push(x);
					
					var dy = ds * Math.sin(q);		
					y += dy;
					yy.push(y);
					sy.push(y);
					
					q += dq;
				}
				
				cx.beginPath();
				cx.strokeStyle = color;
				cx.lineWidth = "1";
				for(i = 0; i < N; i++) {
					var X = lintrans(xx[i], [xmin, xmax], [XMIN, XMAX]);
					var Y = lintrans(yy[i], [ymin, ymax], [YMIN, YMAX]);
					if(i == 0) {
						cx.moveTo(X, Y);
					} else {
						cx.lineTo(X, Y);
					}
				}
				cx.stroke();
				
				cx.beginPath();
				var X = lintrans(xx[0], [xmin, xmax], [XMIN, XMAX]);
				var Y = lintrans(yy[0], [ymin, ymax], [YMIN, YMAX]);
				cx.strokeStyle = "#000";
				cx.arc(X, Y, 2, 0, 2 * Math.PI);
				cx.stroke();
				
			} else if(o instanceof Points) {
				var N = o.data[0].length;
				cx.beginPath();
				cx.lineWidth = "2";
				cx.strokeStyle = "#00f";
				for(var i = 0; i < N; i++) {
					var X = lintrans(o.data[0][i], [xmin, xmax], [XMIN, XMAX]);
					var Y = lintrans(o.data[1][i], [ymin, ymax], [YMIN, YMAX]);
					if(i == 0) {
						cx.moveTo(X, Y);
					} else {
						cx.lineTo(X, Y);
					}
				}
				cx.stroke();
			}
		}
	};
	return result;
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


/*
// Define some global variables
var rhop, D, r, v;
var rhof, Amp, freq, lamda, phi0, Tempf, etaf, dirf;
var GField;
var t, dt, tbeg, tend;
var Tdata, sample;
var proc;
var tabs1, tabs2, bgroup;
var coordMin, coordMax;
var xf, yf, Nf;

// Call main function
main();

// Define main function
function main() {
	// Set layout of elements
	setLayout();
	
	// Log something
	log();
		
	// Set timer for processing simulation
	proc = new Timer(simulate, 1);
}

// Perform simulation
function simulate() {

	// Define fluid surface function
	function yFluid(x, t) {
		var omega = 2 * Math.PI * freq;
		var k = 2 * Math.PI / lambda * dirf;
		var y = Amp * Math.sin(omega * t - k * x + phi0);
		return y;
	}
	
	// Define time derivation of fluid surface
	function vyFluid(x, t) {
		var omega = 2 * Math.PI * freq;
		var k = 2 * Math.PI / lambda * dirf;
		var y = omega * Amp * Math.cos(omega * t - k * x + phi0);
		return y;
	}
	
	// Format time t
	t = +t.toFixed(10);
	
	// Calculate mass
	var R = 0.5 * D;
	var V = (4 * Math.PI / 3) * R * R * R;
	var m = rhop * V;
	
	// Calculate gravitational force
	var FG = Vect3.mul(m, GField);
	
	// Calculate buoyant force
	var xA = r.x + 0.5 * D;
	var yA = yFluid(xA, t);
	var xB = r.x - 0.5 * D;
	var yB = yFluid(xB, t);
	var rA = new Vect3(xA, yA, 0);
	var rB = new Vect3(xB, yB, 0);
	var rAB = Vect3.sub(rA, rB);
	var nAB = rAB.unit();
	var nG = GField.unit();
	var nGaccent = Vect3.cross(Vect3.cross(nG, nAB), nAB);
	var fB;
	var yff = yFluid(r.x, t);
	if(r.y < yff - 0.5 * D) {
		fB = (Math.PI / 6) * rhof * D * D * D * GField.len();
		nGaccent = Vect3.mul(-1, nG);
	} else if(yff - 0.5 * D <= r.y && r.y <= yff + 0.5 * D) {
		var dy = yff - r.y;
		var term1 = 0.25 * D * D * (dy + 0.5 * D);
		var term2 = -(1/3) * (dy * dy * dy + D * D * D / 8);
		fB = Math.PI * rhof * (term1 + term2) * GField.len();
	} else {
		fB = 0;
	}
	var FB = Vect3.mul(fB, nGaccent);
	
	// Calculate drag force
	var Db;
	if(r.y < yff) {
		Db = D;
	} else if(yff <= r.y && r.y <= yff + 0.5 * D) {
		var RR = 0.5 * D;
		var R2 = RR * RR - (r.y - yff) * (r.y - yff);
		Db = 2 * Math.sqrt(R2);
	} else {
		Db = 0;
	}
	var b = 3 * Math.PI * etaf * Db;
	var omega = 2 * Math.PI * freq;
	var k = 2 * Math.PI / lambda * dirf;
	var vfx = omega / k * 0;
	var vfy = vyFluid(r.x, t);
	var vf = new Vect3(vfx, vfy, 0);
	var FD = Vect3.mul(-b, Vect3.sub(v, vf));
	
	// Apply Newton second law of motion
	var F = Vect3.add(FG, FB, FD);
	var a = Vect3.div(F, m);
	
	// Integrate using Euler algorithm
	v = Vect3.add(v, Vect3.mul(a, dt));
	r = Vect3.add(r, Vect3.mul(v, dt));
	
	
	// Set periodic boundary condition
	var PERIODIC_BC = false;
	if(PERIODIC_BC) {
		if(r.x > coordMax.x) {
			r.x = coordMin.x + (r.x - coordMax.x);
		}
		if(r.x < coordMin.x) {
			r.x = coordMax.x + (r.x - coordMin.x);
		}
	}

	v.x = +v.x.toFixed(10);
	v.y = +v.y.toFixed(10);
	v.z = +v.z.toFixed(10);
	r.x = +r.x.toFixed(10);
	r.y = +r.y.toFixed(10);
	r.z = +r.z.toFixed(10);
	
	// Display result in certain period of time
	if(sample.sampling()) {
		var data = t + " "
			+ r.x.toExponential(2) + " "
			+ r.y.toExponential(2) + " "
			+ v.x.toExponential(2) + " "
			+ v.y.toExponential(2);
		tabs1.text("Results").push(data);
		var textarea = tabs1.element("Results");
		textarea.scrollTop = textarea.scrollHeight;
			
		// Generate waving fluid surface
		xf = [];
		yf = [];
		var xmin = coordMin.x;
		var xmax = coordMax.x;
		var dx = (xmax - xmin) / Nf; 
		for(var i = 0; i <= Nf; i++) {
			var x = xmin + i * dx;
			var y = yFluid(x, t);
			xf.push(x);
			yf.push(y);
		}
		
		// Clear drawing area
		tabs2.graphic("xy").clear();
		
		// Draw waving fluid surface
		tabs2.graphic("xy").setLineColor("#00f");	
		tabs2.graphic("xy").lines(xf, yf);
		
		// Draw spherical particle
		tabs2.graphic("xy").setLineColor("#f00");	
		tabs2.graphic("xy").strokeCircle(r.x, r.y, 0.5 * D);
	}
	
	// Terminate simulation when end time is reached
	if(t >= tend) {
		proc.stop();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Simulation stopped t = tend");
		bgroup.disable("Start");
		bgroup.setCaption("Start").to("Start");
		bgroup.enable("Draw");
	}
	
	// Increase time t
	t += dt;
}

// Set layout of elements
function setLayout() {
	// Create title page
	var p = document.createElement("p");
	p.innerHTML = "Spherical particle floating " + 
		"on waving fluid surface";
	p.style.fontWeight = "bold";
	document.body.append(p);

	// Define first Tabs
	tabs1 = new Tabs("tabs1");
	tabs1.setWidth("450px");
	tabs1.setHeight("300px");
	tabs1.addTab("Log", 0);
	tabs1.addTab("Params", 0);
	tabs1.addTab("Results", 0);
	
	// Define second Tabs
	tabs2 = new Tabs("tabs2");
	tabs2.setWidth("300px");
	tabs2.setHeight("300px");
	tabs2.addTab("xy", 1);
	
	// Clear all tabs
	tabs1.text("Params").clear();
	tabs1.text("Results").clear();
	tabs1.text("Log").clear();
	tabs2.graphic("xy").clear();

	// Define bgroup
	bgroup = new Bgroup("bgroup");
	bgroup.setWidth("60px");
	bgroup.setHeight("147px");
	bgroup.addButton("Clear");
	bgroup.addButton("Load");
	bgroup.addButton("Read");
	bgroup.addButton("Start");
	bgroup.addButton("Draw");
	bgroup.addButton("Help");
	bgroup.addButton("About");
	bgroup.disable("Read");
	bgroup.disable("Start");
	bgroup.disable("Draw");
}

// Load parameters
function loadParameters() {
	tabs1.text("Params").push("# Spherical particle");
	tabs1.text("Params").push("DENSITYP 800");
	tabs1.text("Params").push("DIAMETER 0.05");
	tabs1.text("Params").push("POSITION -0.5 0 0");
	tabs1.text("Params").push("VELOCITY 0 0 0");
	tabs1.text("Params").push();
	
	tabs1.text("Params").push("# Fluids");
	tabs1.text("Params").push("DENSITYF 1000");
	tabs1.text("Params").push("AMPLITUDE 0.05");
	tabs1.text("Params").push("FREQUENCY 0.5");
	tabs1.text("Params").push("WAVELENGTH 1");
	tabs1.text("Params").push("DIRECTION 1");
	tabs1.text("Params").push("PHASE0 0");
	tabs1.text("Params").push("TEMPERATURE 293");
	tabs1.text("Params").push("VISCOSITY 1");
	tabs1.text("Params").push("NDATAF 100");
	tabs1.text("Params").push();
	
	tabs1.text("Params").push("# Environment");
	tabs1.text("Params").push("GRAVFIELD 0 -9.81 0");
	tabs1.text("Params").push();
	
	tabs1.text("Params").push("# Simulation");
	tabs1.text("Params").push("TSTEP 1E-3");
	tabs1.text("Params").push("TDATA 1E-1");
	tabs1.text("Params").push("TBEG 0");
	tabs1.text("Params").push("TEND 20");
	tabs1.text("Params").push();
	
	tabs1.text("Params").push("# Visualization");
	tabs1.text("Params").push("COORDMIN -1 -1 -1");
	tabs1.text("Params").push("COORDMAX 1 1 1");
	var ta = tabs1.element("Params");
	ta.scrollTop = ta.scrollHeight;
}
	
// Get parameters
function readParameters() {
	var text = tabs1.element("Params").value;
	
	rhop = Parse.getFrom(text).valueOf("DENSITYP");
	D = Parse.getFrom(text).valueOf("DIAMETER");
	r = Parse.getFrom(text).valueOf("POSITION");
	v = Parse.getFrom(text).valueOf("VELOCITY");
	
	rhof = Parse.getFrom(text).valueOf("DENSITYF");
	Amp = Parse.getFrom(text).valueOf("AMPLITUDE");
	freq = Parse.getFrom(text).valueOf("FREQUENCY");
	lambda = Parse.getFrom(text).valueOf("WAVELENGTH");
	phi0 = Parse.getFrom(text).valueOf("PHASE0");
	Tempf = Parse.getFrom(text).valueOf("TEMPERATURE");
	etaf = Parse.getFrom(text).valueOf("VISCOSITY");
	dirf = Parse.getFrom(text).valueOf("DIRECTION");
	Nf = Parse.getFrom(text).valueOf("NDATAF");
	
	GField = Parse.getFrom(text).valueOf("GRAVFIELD");
	
	dt = Parse.getFrom(text).valueOf("TSTEP");
	Tdata = Parse.getFrom(text).valueOf("TDATA");
	tbeg = Parse.getFrom(text).valueOf("TBEG");
	tend = Parse.getFrom(text).valueOf("TEND");
	
	coordMin = Parse.getFrom(text).valueOf("COORDMIN");
	coordMax = Parse.getFrom(text).valueOf("COORDMAX");
	
	// Initiate time
	t = tbeg;
	
	// Set sampling
	sample = new Sample(Tdata, dt);
	
	// Set coordinate ranges
	tabs2.graphic("xy").setCoord(
		[coordMin.x, coordMin.y, coordMax.x, coordMax.y]);
}	

// Log something and show manually	
function log() {
	try { 
		console.log(
			showOnly(logjs).forFilter(
				{
					app: "spfwfs",
					date: "20180714",
					after: "0500",
				}
			)
		);
	}
	catch(err) {
		var msg = "opsebf logs only in development stage";
		console.warn(msg);
	}
}

// Do something when buttons clicked
function buttonClick(event) {
	var target = event.target;
	
	if(target.innerHTML == "Start") {
		target.innerHTML = "Stop";
		proc.start();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Simulation is starting");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.disable("Draw");
	} else if(target.innerHTML == "Stop"){
		target.innerHTML = "Start";
		proc.stop();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Simulation stopped");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.enable("Draw");
	}
	
	if(target.innerHTML == "About") {
		alert(
			"spfwfs | "
			+ "Spherical particle floating on waving fluid surface"
			+ "\n"
			+ "Version 20180714"
			+ "\n"
			+ "Sparisoma Viridi | dudung@gmail.com"
			+ "\n"
			+ "Nurhayati | firstnur1708@gmail.com"
			+ "\n"
			+ "Johri Sabaryati | joyafarashy@gmail.com"
			+ "\n"
			+ "Dewi Muliyati | dmuliyati@gmail.com"
			+ "\n"
			+ "\n"
			+ "Based on butiran "
			+ "| https://github.com/dudung/butiran"
			+ "\n"
			+ "MIT License | "
			+ "Copyright (c) 2018 Sparisoma Viridi"
		);
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "About is called");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
	}
	
	if(target.innerHTML == "Help") {
		alert(""
			+ "[Clear]    clear all text and graphic\n"
			+ "[Load]     load default parameters\n"
			+ "[Read]     read parameters from text\n"
			+ "[Start]     start simulation\n"
			+ "[Draw]     draw results\n"
			+ "[Help]     show this help\n"
			+ "[About]   describe this application\n"
		);
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Help is called");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
	}
	
	if(target.innerHTML == "Load") {
		tabs1.text("Params").clear();
		loadParameters();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Default parameters are loaded");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.enable("Read");
	}
	
	if(target.innerHTML == "Read") {
		readParameters();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Parameters are read");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.enable("Start");
	}
	
	if(target.innerHTML == "Clear") {
		tabs1.text("Params").clear();
		tabs1.text("Results").clear();
		tabs1.text("Log").clear();
		tabs2.graphic("xy").clear();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Parameters, Results, "
			+ "and Log are cleared");
		tabs1.text("Log").push(ts + "xy "
			+ "is cleared");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.disable("Read");
		bgroup.disable("Start");
	}
	
	if(target.innerHTML == "Draw") {
		drawResults();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Results will be drawn");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
	}
}

// Draw on chart
function drawResults() {
	// Get results
	var text = tabs1.element("Results").value;
	var tt = Parse.getFrom(text).column(0);
	var rxp = Parse.getFrom(text).column(1);
	var ryp = Parse.getFrom(text).column(2);
	var vxp = Parse.getFrom(text).column(3);
	var vyp = Parse.getFrom(text).column(4);
	
	// Draw on related chart
	tabs2.graphic("xy").clear();
	tabs2.graphic("xy").setLineColor("#f00");	
	tabs2.graphic("xy").lines(rxp, ryp);
}
*/