/*
	md_spfwfss.js
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
	1129 Change name from md_spfwfss to spfwfs and start to move to app (new butiran.js).
	
	References
	1. Sparisoma Viridi, Nurhayati, Johri Sabaryati, Dewi Muliyati, "Two-Dimensional Dynamics of Spherical Grain Floating on the Propagating Wave Fluid Surface", SPEKTRA: Jurnal Fisika dan Aplikasinya [], vol. 3, no. 3, pp. , December 2018, url https://doi.org/10.21009/SPEKTRA.033.01
*/


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