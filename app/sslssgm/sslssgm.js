/*
	sslssgm.js
	Simulation of snake-like swimming system
	based on granular model
	
	Sparisoma Viridi | dudung@gmail.com
	
	20181012
	Start this project for tomorrow presentation.
	20181013
	Change CDN from https://rawgit.com/ to
	https://raw.githack.com/
	Remove log.
	Finish initial parameters but length at 0757.
	Create fake simulation for testing result visualization
	at 0837.
	Can produce zero motion since spring force is tested
	manually.
	CDN https://raw.githack.com/dudung/butiran/master/app
	/md_sslssgm.html
	20181120
	Change to JS.
	20190602
	1713 Change to butiran.js new version, md_sslssgm->sslssgm.
*/

// Define some global variables
var gacc, rhof, etaf;
var rhob, Db, kb, boneb, muscleb, Ab, Tb;
var N, r, v;
var t, dt, tbeg, tend;
var Tdata, sample;
var proc;
var tabs1, tabs2, bgroup;
var coordMin, coordMax;

// Call main function
main();

// Define main function
function main() {
	// Set layout of elements
	setLayout();
	
	// Set timer for processing simulation
	proc = new Timer(simulate, 1);
}

// Perform simulation
function simulate() {
	
	var TESTING = false;
	if(TESTING) {
		// -------------- Fake simulation ------------------
		for(var i = 0; i < N; i++) {
			r[i].x += 0.001;
			var A = 0.1;
			var x0 = 5 * Db;
			var y0 = 0.5;
			var x = r[i].x;
			var lambda = 0.5;
			var k = 2 * Math.PI / lambda;
			var y = (y0 + A * Math.sin(k * (x - x0))).toFixed(4);
			r[i].y = y;
		}
		// -------------------------------------------------
	}
	
	// Change muscle
	for(var i = 0; i < N - 2; i++) {
		var omega = 2 * Math.PI / Tb;
		var dl = Ab * Math.sin(omega * t);
		muscleb[i] += dl;
	}
	
	var SoF = [];
	
	for(var i = 0; i < N; i++) {
		var neigh = [];
		if(i == 0) {
			neigh = [+1, +2];
		} else if(i == 1) {
			neigh = [-1, +1, +2];
		} else if(i == N - 2) {
			neigh = [-2, -1, +1];
		} else if(i == N - 1) {
			neigh = [-2, -1];
		} else {
			neigh = [-2, -1, +1, +2];
		}
		
		var F = new Vect3;
		
		for(var ne = 0; ne < neigh.length; ne++ ) {
			var j = i + neigh[ne];
			var rij = Vect3.sub(r[i], r[j]);
			var lij = rij.len();
			var nij = rij.unit();
			var l0 = 0;
			
			if(Math.abs(neigh[ne]) < 2) {
				// Interact through bone
				l0 = (i < j) ? boneb[i] : boneb[j];
			} else {
				// Interact through muscle
				l0 = (i < j) ? muscleb[i] : muscleb[j];
			}
			var dl = lij - l0;
			var Fij = Vect3.mul(-kb * dl, nij);
			
			F = Vect3.add(F, Fij);
		}
		
		SoF.push(F);
	}
	
	// Calculate viscos force
	for(var i = 0; i < N; i++) {
		var f = Vect3.mul(-3 * Math.PI * etaf * Db, v[i]);
		
		// Make correction due to direction
		var nf = f.unit();
		if(0 < i && i < N - 1) {
			var nn = (Vect3.sub(r[i -1], r[i + 1])).unit();
			var frac = Math.abs(Vect3.dot(nf, nn));
			f = Vect3.mul(f, frac);
		}
		
		SoF[i] = Vect3.add(SoF[i], f);
	}
		
	var Rb = 0.5 * Db;
	var Rb3 = Rb * Rb * Rb;
	var Vb = 4 * Math.PI * Rb3 / 3;
	var mb = rhob * Vb;
	
	// Calculate acceleration
	var a =[];
	
	for(var i = 0; i < N; i++) {
		a[i] = Vect3.div(SoF[i], mb);
	}
	
	// Calculate velocity
	for(var i = 0; i < N; i++) {
		v[i] = Vect3.add(v[i], Vect3.mul(a[i], dt));
	}
	
	// Calculate position
	for(var i = 0; i < N; i++) {
		r[i] = Vect3.add(r[i], Vect3.mul(v[i], dt));
	}
	
	// Display result in certain period of time
	if(sample.sampling()) {
		// Calculate average position
		var xavg = 0;
		var yavg = 0;
		for(var i = 0; i < N; i++) {
			xavg += r[i].x;
			yavg += r[i].y;
		}
		xavg /= N;
		yavg /= N;
		
		var data = t.toFixed(3) + " "
			+ xavg.toFixed(5) + " "
			+ yavg.toFixed(5);
		tabs1.text("Results").push(data)
		var ta = tabs1.element("Results");
		ta.scrollTop = ta.scrollHeight;
		
		// Clear drawing area
		tabs2.graphic("xy").clear();
		
		// Draw spherical particle
		tabs2.graphic("xy").setLineColor("#f00");
		for(var i = 0; i < N; i++) {
			var xx = r[i].x;
			var yy = r[i].y;
			var RR = 0.5 * Db;
			tabs2.graphic("xy").strokeCircle(xx, yy, RR);
		}
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
	p.innerHTML = "Simulation of snake-like swimming system "
		+ "based on granular model";
	p.style.fontWeight = "bold";
	document.body.append(p);

	// Define first Tabs
	tabs1 = new Tabs("tabs1");
	tabs1.setWidth("300px");
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
	tabs1.text("Params").push("# Environment");
	tabs1.text("Params").push("GRAVFIELD 0 0 -10");
	tabs1.text("Params").push("DENSITYF 1000");
	tabs1.text("Params").push("VISCOSITYF 0.01");
	tabs1.text("Params").push();
	
	tabs1.text("Params").push("# Balls");
	tabs1.text("Params").push("DENSITYB 500");
	tabs1.text("Params").push("DIAMETERB 0.025");
	tabs1.text("Params").push("SPRINGB 100");
	tabs1.text("Params").push("AMPLITB 1E-5");
	tabs1.text("Params").push("PERIODB 1");
	tabs1.text("Params").push("GRAINBEG");
	// -------------- Generated value ------------------
	var N = 21;
	var lambda = 0.5;
	var A = 0.1;
	var k = 2 * Math.PI / lambda;
	var D = lambda / (N - 1);
	var x0 = 5 * D;
	var y0 = 0.5;
	for(var i = 0; i < N; i++) {
		var x = (x0 + (i - 1) * D).toFixed(2);
		var y = (y0 + A * Math.sin(k * (x - x0))).toFixed(4);
		var z = 0;
		tabs1.text("Params").push(x + " " + y + " " + z);
	}
	// -------------------------------------------------
	tabs1.text("Params").push("GRAINEND");
	tabs1.text("Params").push();
	
	tabs1.text("Params").push("# Simulation");
	tabs1.text("Params").push("TSTEP 1E-3");
	tabs1.text("Params").push("TDATA 1E-1");
	tabs1.text("Params").push("TBEG 0");
	tabs1.text("Params").push("TEND 20");
	tabs1.text("Params").push();
	
	tabs1.text("Params").push("# Visualization");
	tabs1.text("Params").push("COORDMIN 0 0 0");
	tabs1.text("Params").push("COORDMAX 1 1 1");
	var ta = tabs1.element("Params");
	ta.scrollTop = ta.scrollHeight;
}
	
// Get parameters
function readParameters() {
	var text = tabs1.element("Params").value;
	
	gacc = Parse.getFrom(text).valueOf("GRAVFIELD");
	rhof = Parse.getFrom(text).valueOf("DENSITYF");
	etaf = Parse.getFrom(text).valueOf("VISCOSITY");
	rhob = Parse.getFrom(text).valueOf("DENSITYB");
	Db = Parse.getFrom(text).valueOf("DIAMETERB");
	kb = Parse.getFrom(text).valueOf("SPRINGB");
	Ab = Parse.getFrom(text).valueOf("AMPLITB");
	Tb = Parse.getFrom(text).valueOf("PERIODB");
	
	var seq = Parse.getFrom(text).valueBetween(
		"GRAINBEG", "GRAINEND");
	N = seq.length / 3;
	r = [];
	v = [];
	for(var i = 0; i < N; i++) {
		var xx = seq[i * 3 + 0];
		var yy = seq[i * 3 + 1];
		var zz = seq[i * 3 + 2];
		var rr = new Vect3(xx, yy, zz);
		r.push(rr);
		
		var vv = new Vect3;
		v.push(vv);
	}
	
	boneb = [];
	for(var i = 0; i < N - 1; i++) {
		var dx = r[i].x - r[i + 1].x;
		var dy = r[i].y - r[i + 1].y;
		var dl = Math.sqrt(dx * dx + dy * dy);
		boneb[i] = dl;
	}
	
	muscleb = [];
	for(var i = 0; i < N - 2; i++) {
		var dx = r[i].x - r[i + 2].x;
		var dy = r[i].y - r[i + 2].y;
		var dl = Math.sqrt(dx * dx + dy * dy);
		muscleb[i] = dl;
	}
	
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
			"sslssgm | "
			+ "Simulation of snake-like swimming system "
			+ "based on granular model"
			+ "\n"
			+ "Version 201810112"
			+ "\n"
			+ "Sparisoma Viridi | dudung@gmail.com"
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
	/*
	var tt = Parse.getFrom(text).column(0);
	var rxp = Parse.getFrom(text).column(1);
	var ryp = Parse.getFrom(text).column(2);
	var vxp = Parse.getFrom(text).column(3);
	var vyp = Parse.getFrom(text).column(4);
	*/
	
	// Draw on related chart
	tabs2.graphic("xy").clear();
	tabs2.graphic("xy").setLineColor("#f00");	
	/*
	tabs2.graphic("xy").lines(rxp, ryp);
	*/
}
