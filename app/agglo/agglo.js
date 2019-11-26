/*
	agglo.js
	Agglomeration of composite particles due to self-gravitation
	
	Sparisoma Viridi | dudung@gmail.com
	
	20191111
	0821 Copy from mdfcp.js and save it to butiran.js in app folder.
	20191125
	0830 Start to make composite particles systematically.
	1937 Design composite particles function.
	20191126
	0626 Beg conf part constr.
	0841 Fin 2x1 conf, end beg 3x1 conf.
	0850 Fix 2x1 sub array.
	0931 Fin 3x1 conf.
	0941 Fin 4x1 conf.
	
	References
	1. Sparisoma Viridi et al., "Aggregation of two-dimension
		 composite grains due to self-gravitation, OSF
		 url https://doi.org/10.17605/osf.io/bph8f
*/

// Define global variables
var params;
var taIn, taOut, caOut1, caOut2, caOut3, caOut4;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var dx;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var wA, wT, wL;
var o;
var normal, attractive, spring;
var ND;
var partID, neighID, neighLN, scenario;

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
	p += "# Interaction\n";
	p += "KNXX 1000\n";
	p += "GNXX 0.1\n";
	p += "KAXX 1E-2\n";
	p += "KSXX 8000\n";
	p += "GSXX 0.2\n";
	p += "\n";
	p += "# Particle\n";
	p += "RHOG 500.0\n";
	p += "DIAM 0.1000\n";
	p += "POST 0.0000 0.0000 0.0000\n";
	p += "VELO 0.0000 0.0000 0.0000\n";
	p += "NXYZ 10 1 10\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0\n";
	p += "TEND 20\n";
	p += "TSTP 0.005\n";
	p += "TDAT 1.000\n";
	p += "TPRC 1\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -0.75 -0.25 -0.75\n";
	p += "RMAX +0.75 +0.25 +0.75\n";
	p += "\n";
	p += "# Simulation\n";
	p += "SCEN 3\n";
	
	params = p;
	
	digit = 4;	
}


// Load parameters
function loadParams() {
	clearText(taIn);
	addText(params).to(taIn);
	
	// Clear all canvas
	clearCanvas(caOut1);	
	clearCanvas(caOut2);
	clearCanvas(caOut3);
}


// Read parameters
function readParams() {
	tbeg = getValue("TBEG").from(taIn);
	tend = getValue("TEND").from(taIn);
	dt = getValue("TSTP").from(taIn);
	Tdata = getValue("TDAT").from(taIn);
	Tproc = getValue("TPRC").from(taIn);

	iter = 0;
	Niter = Math.floor(Tdata / dt);
	t = tbeg;

	var rhog = getValue("RHOG").from(taIn);
	var D = getValue("DIAM").from(taIn);
	var r = getValue("POST").from(taIn);
	var v = getValue("VELO").from(taIn);
	var NXYZ = getValue("NXYZ").from(taIn);

	scenario = getValue("SCEN").from(taIn);
	
	var V = (Math.PI / 6) * D * D * D;
	var m = rhog * V;

	// Define initial configuration
	o = [];
	createCompositeParticles(
		NXYZ, D, m,
		r, v,
		scenario
	);
	
	var kN = getValue("KNXX").from(taIn);
	var gN = getValue("GNXX").from(taIn);
	var kA = getValue("KAXX").from(taIn);
	var kS = getValue("KSXX").from(taIn);
	var gS = getValue("GSXX").from(taIn);
		
	normal = new Normal();
	normal.setConstants(kN, gN);

	attractive = new Gravitational();
	attractive.setConstant(kA);
	
	spring = new Spring();
	spring.setConstants(kS, gS);

	var rmin = getValue("RMIN").from(taIn);
	var rmax = getValue("RMAX").from(taIn);
	
	xmin = rmin.x;
	ymin = rmin.y;
	zmin = rmin.z;
	xmax = rmax.x;
	ymax = rmax.y;
	zmax = rmax.z;

	caOut1.xmin = xmin;
	caOut1.xmax = xmax;
	
	XMIN = 0;
	XMAX = caOut1.width;
	YMIN = caOut1.height;
	YMAX = 0;
	ZMIN = -1;
	ZMAX = 1;
	
	// Clear all canvas
	clearCanvas(caOut1);	
	clearCanvas(caOut2);
	clearCanvas(caOut3);
	
	// Draw object in all canvas
	for(var i = 0; i < o.length; i++) {
		draw(o[i]).onCanvas(caOut1);
		draw(o[i], "xz").onCanvas(caOut2);
	}
}


// Create visual elements
function createVisualElements() {
	// Create textarea for input
	taIn = document.createElement("textarea");
	with(taIn.style) {
		overflowY = "scroll";
		width = "214px";
		height = "207px";
	}
	
	// Create textarea for output
	taOut = document.createElement("textarea");
	with(taOut.style) {
		overflowY = "scroll";
		width = "464px";
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
	caOut1 = document.createElement("canvas");
	caOut1.width = "330";
	caOut1.height = "110";
	with(caOut1.style) {
		width = caOut1.width +  "px";
		height = caOut1.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	caOut2 = document.createElement("canvas");
	caOut2.width = "330";
	caOut2.height = "330";
	with(caOut2.style) {
		width = caOut2.width +  "px";
		height = caOut2.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
	caOut3 = document.createElement("canvas");
	caOut3.width = "248";
	caOut3.height = "211";
	with(caOut3.style) {
		width = caOut3.width +  "px";
		height = caOut3.height +  "px";
		border = "1px solid #aaa";
		background = "#fff";
	}
		
	// Create div for left part
	var dvLeft = document.createElement("div");
	with(dvLeft.style) {
		width = "470px";
		height = "450px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Create div for right part
	var dvRight = document.createElement("div");
	with(dvRight.style) {
		width = "334px";
		height = "450px";
		border = "1px solid #eee";
		background = "#eee";
		float = "left";
	}
	
	// Append element in structured order
	document.body.append(dvLeft);
		dvLeft.append(taIn);
		dvLeft.append(caOut3);
		dvLeft.append(taOut);
		dvLeft.append(btLoad);
		dvLeft.append(btRead);
		dvLeft.append(btStart);
		dvLeft.append(btInfo);
	document.body.append(dvRight);
		dvRight.append(caOut1);
		dvRight.append(caOut2);
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
		info += "agglo.js\n";
		info += "Agglomeration of composite particles due to self-gravitation\n";
		info += "Sparisoma Viridi\n";
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


// Perform simulation
function simulate() {
	if(iter >= Niter) {
		iter = 0;
	}
	
	if(t == tbeg) {
		//       00 000
		addText("#t x   y\n").to(taOut);
	}
	
	if(iter == 0) {
		var tt = ("00" + t.toFixed(0)).slice(-2);
		
		var C = 0;
		for(var i = 0; i < o.length - 1; i++) {
			for(var j = i + 1; j < o.length; j++) {
				var ri = o[i].r;
				var rj = o[j].r;
				var rij = Vect3.sub(ri, rj).len();
				var Ri = 0.5 * o[i].D;
				var Rj = 0.5 * o[j].D;
				var ksi = Math.max(0, Ri + Rj - rij);
				if(ksi > 0) C++;
			}
		}
		C = ("000" + C).slice(-3);
		
		var Davg = 0;
		for(var i = 0; i < o.length; i++) {
			Davg += o[i].D;
		}
		Davg /= o.length;
		
		var Nclass = 100;
		ND = [];
		ND.length = Nclass;
		ND.fill(0);
		for(var i = 0; i < o.length - 1; i++) {
			for(var j = i + 1; j < o.length; j++) {
				var ri = o[i].r;
				var rj = o[j].r;
				var rij = Vect3.sub(ri, rj).len();
				var k = Math.floor((rij - 0.5 *Davg) / (Davg / Nclass));
				if(k < ND.length) ND[k]++
			}
		}
		var NDtot = 0;
		for(var i = 0; i < ND.length; i++) {
			NDtot += ND[i];
		}
		var NDstr = [];
		for(var i = 0; i < ND.length; i++) {
			ND[i] /= NDtot;
			NDstr.push(ND[i].toFixed(2));
		}
		var NDstra = "";
		for(var i = 0; i < ND.length; i++) {
			NDstra += NDstr[i];
			if(i < ND.length - 1) {
				NDstra += " ";
			}
		}
		
		var info = tt + " " + C + " " + NDstra + "\n";
		addText(info).to(taOut);
	}
	
	// Calculate total force acted on all particles
	var SF = [];
	for(var i = 0; i < o.length; i++) {

		var F = new Vect3();
		
		// Calculate normal force
		var Fn = new Vect3();
		for(var j = 0; j < o.length; j++) {
			if(j != i) {
				var Fni = normal.force(o[i], o[j]);
				Fn = Vect3.add(Fn, Fni);
			}
		}
		F = Vect3.add(F, Fn);
		
		// Calculate attractive force
		var Fa = new Vect3();
		for(var j = 0; j < o.length; j++) {
			if(j != i) {
				var Fai = attractive.force(o[i], o[j]);
				Fa = Vect3.add(Fa, Fai);
			}
		}
		F = Vect3.add(F, Fa);
		
		if(partID.length > 0) {
			// Calculate spring force
			var Fs = new Vect3();
			for(var id = 0; id < partID.length; id++) {
				if(partID[id] == i) {
					for(var k = 0; k < neighID[id].length; k++) {
						var L = neighLN[id][k];
						spring.setUncompressedLength(L);
						var j = neighID[id][k];
						var Fsi = spring.force(o[i], o[j]);
						Fs = Vect3.add(Fs, Fsi);
					}
				}
			}
			F = Vect3.add(F, Fs);
		}
		
		// Save total force for particle i
		SF.push(F);
	}
	
	// Update motion variables
	for(var i = 0; i < o.length; i++) {
		// Apply Newton second law of motion
		var a = Vect3.div(SF[i], o[i].m);
		
		// Implement Euler algorithm
		o[i].v = Vect3.add(o[i].v, Vect3.mul(a, dt));
		o[i].r = Vect3.add(o[i].r, Vect3.mul(o[i].v, dt));
	}
	
	// Clear all canvas
	clearCanvas(caOut1);	
	clearCanvas(caOut2);
	clearCanvas(caOut3);
	
	// Draw object in all canvas
	for(var i = 0; i < o.length; i++) {
		draw(o[i]).onCanvas(caOut1);
		draw(o[i], "xz").onCanvas(caOut2);
	}
	
	// Draw distribution of nearest distance between two
	// particles
	drawDist(ND, caOut3);
	
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


//Create composite particles
function createCompositeParticles() {
	var NXYZ = arguments[0];
	var D = arguments[1];
	var m = arguments[2];
	var r = arguments[3];
	var v = arguments[4];
	var scenario = arguments[5];
	
	// Get number of particles
	var Nx = NXYZ.x;
	var Ny = NXYZ.y * 0 + 1;
	var Nz = NXYZ.z;
	
	// Create particles in grid
	var id = 0;
	for(var ix = 0; ix < Nx; ix++) {
		for(var iy = 0; iy < Ny; iy++) {
			for(var iz = 0; iz < Nz; iz++) {
				oi = new Grain();
				oi.m = m;
				oi.q = 0;
				oi.D = D;
				oi.id = id;
				id++;
				
				var rndx = 0.01 * D * Math.random() * 1;
				var rndy = 0.00 * D * Math.random() * 1;
				var rndz = 0.01 * D * Math.random() * 1;
				
				var x = D * (ix - 0.5 * (Nx - 1)) * (1 + rndx);
				var y = D * (iy - 0.5 * (Ny - 1)) * (1 + rndy);
				var z = D * (iz - 0.5 * (Nz - 1)) * (1 + rndz);
				oi.r = Vect3.add(r, new Vect3(x, y, z));
				oi.v = v;
				oi.c = ["#aaa", "#fafafa"];
				o.push(oi);
			}
		}
	}

	// Define color table
	colors = [
		["#000", "#fff"],
		["#000", "#faa"],
		["#000", "#aaf"],
		["#000", "#afa"],
		["#000", "#ffa"],
		["#000", "#aff"],
		["#000", "#faf"],
		["#000", "#aaa"],
		["#000", "#fcc"],
		["#000", "#ccf"],
		["#000", "#cfc"],
		["#000", "#ffc"],
		["#000", "#cff"],
		["#000", "#fcf"],
		["#000", "#ccc"],
	];
			
	// Create composite particles
	var D1 = D;
	var D2 = D * Math.sqrt(2);
	
	partID = [];
	neighID = [];
	neighLN = [];
		
	if(scenario == 0) {
		partID = [];
		neighID = [];
		neighLN = [];
	}
	
	if(scenario == 1) {
		partID = [];
		neighID = [];
		neighLN = [];
		
		var Ni = id / 2;
		for(var i = 0; i < Ni; i++) {
			var i1 = 2 * i;
			var i2 = i1 + 1;
			
			partID.push(i1);
			neighID.push([i2]);
			neighLN.push([D1]);

			partID.push(i2);
			neighID.push([i1]);
			neighLN.push([D1]);
			
			/*
			var c1 = (Math.floor(Math.random() * 16)) * 8 + 135;
			var c2 = (Math.floor(Math.random() * 16)) * 8 + 135;
			var c3 = (Math.floor(Math.random() * 16)) * 8 + 135;
			
			c1 = ("0" + c1.toString(16)).slice(-2);
			c2 = ("0" + c2.toString(16)).slice(-2);
			c3 = ("0" + c3.toString(16)).slice(-2);
			
			var fill = c1 = "#" + c1 + c2 + c3;
			var line = "#000";
			var colors = [line, fill];
			*/
			var c = Math.floor(Math.random() * colors.length);
			o[i1].c = colors[c];
			o[i2].c = colors[c];
		}
	}

	if(scenario == 2) {
		partID = [];
		neighID = [];
		neighLN = [];
		
		var x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		var y = [0, 1, 2];
		
		for(var ix in x) {
			for(var iy in y) {
				var i1 = ix * Nz + iy * 3;
				var i2 = i1 + 1;
				var i3 = i1 + 2;
				
				partID.push(i1);
				neighID.push([i2, i3]);
				neighLN.push([D1, 2*D1]);

				partID.push(i2);
				neighID.push([i1, i3]);
				neighLN.push([D1, D1]);

				partID.push(i3);
				neighID.push([i1, i2]);
				neighLN.push([2*D1, D1]);

				var c = Math.floor(Math.random() * colors.length);		
				o[i1].c = colors[c];
				o[i2].c = colors[c];
				o[i3].c = colors[c];
			}
		}
		
		partID.push(09);
		neighID.push([19, 29]);
		neighLN.push([D1, 2*D1]);

		partID.push(19);
		neighID.push([09, 29]);
		neighLN.push([D1, D1]);

		partID.push(29);
		neighID.push([09, 19]);
		neighLN.push([2*D1, D1]);
		
		var c = Math.floor(Math.random() * colors.length);		
		o[09].c = colors[c];
		o[19].c = colors[c];
		o[29].c = colors[c];
		
		partID.push(39);
		neighID.push([49, 59]);
		neighLN.push([D1, 2*D1]);

		partID.push(49);
		neighID.push([39, 59]);
		neighLN.push([D1, D1]);

		partID.push(59);
		neighID.push([39, 49]);
		neighLN.push([2*D1, D1]);

		var c = Math.floor(Math.random() * colors.length);		
		o[39].c = colors[c];
		o[49].c = colors[c];
		o[59].c = colors[c];
		
		partID.push(69);
		neighID.push([79, 89]);
		neighLN.push([D1, 2*D1]);

		partID.push(79);
		neighID.push([69, 89]);
		neighLN.push([D1, D1]);

		partID.push(89);
		neighID.push([69, 79]);
		neighLN.push([2*D1, D1]);
		
		var c = Math.floor(Math.random() * colors.length);		
		o[69].c = colors[c];
		o[79].c = colors[c];
		o[89].c = colors[c];		
	}
	
	if(scenario == 3) {
		partID = [];
		neighID = [];
		neighLN = [];
		
		var x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		var y = [0, 1];
		
		for(var ix in x) {
			for(var iy in y) {
				var i1 = ix * Nz + iy * 4;
				var i2 = i1 + 1;
				var i3 = i1 + 2;
				var i4 = i1 + 3;
				
				partID.push(i1);
				neighID.push([i2, i3, i4]);
				neighLN.push([D1, 2*D1, 3*D1]);

				partID.push(i2);
				neighID.push([i1, i3, i4]);
				neighLN.push([D1, D1, 2 *D1]);

				partID.push(i3);
				neighID.push([i1, i2, i4]);
				neighLN.push([2*D1, D1, D1]);

				partID.push(i4);
				neighID.push([i1, i2, i3]);
				neighLN.push([3*D1, 2*D1, D1]);

				var c = Math.floor(Math.random() * colors.length);		
				o[i1].c = colors[c];
				o[i2].c = colors[c];
				o[i3].c = colors[c];
				o[i4].c = colors[c];
			}
		}
		
		partID.push(09);
		neighID.push([19, 29, 39]);
		neighLN.push([D1, 2*D1, 3*D1]);

		partID.push(19);
		neighID.push([09, 29, 39]);
		neighLN.push([D1, D1, 2*D1]);

		partID.push(29);
		neighID.push([09, 19, 39]);
		neighLN.push([2*D1, D1, D1]);
		
		partID.push(39);
		neighID.push([09, 19, 29]);
		neighLN.push([3*D1, 2*D1, D1]);
		
		var c = Math.floor(Math.random() * colors.length);		
		o[09].c = colors[c];
		o[19].c = colors[c];
		o[29].c = colors[c];
		o[39].c = colors[c];		
		
		partID.push(49);
		neighID.push([59, 69, 79]);
		neighLN.push([D1, 2*D1, 3*D1]);

		partID.push(59);
		neighID.push([49, 69, 79]);
		neighLN.push([D1, D1, 2*D1]);

		partID.push(69);
		neighID.push([49, 59, 79]);
		neighLN.push([2*D1, D1, D1]);
		
		partID.push(79);
		neighID.push([49, 59, 69]);
		neighLN.push([3*D1, 2*D1, D1]);
		
		var c = Math.floor(Math.random() * colors.length);		
		o[49].c = colors[c];
		o[59].c = colors[c];
		o[69].c = colors[c];
		o[79].c = colors[c];		
		
		partID.push(08);
		neighID.push([18, 28, 38]);
		neighLN.push([D1, 2*D1, 3*D1]);

		partID.push(18);
		neighID.push([08, 28, 38]);
		neighLN.push([D1, D1, 2*D1]);

		partID.push(28);
		neighID.push([08, 18, 38]);
		neighLN.push([2*D1, D1, D1]);
		
		partID.push(38);
		neighID.push([08, 18, 28]);
		neighLN.push([3*D1, 2*D1, D1]);
		
		var c = Math.floor(Math.random() * colors.length);		
		o[08].c = colors[c];
		o[18].c = colors[c];
		o[28].c = colors[c];
		o[38].c = colors[c];		
		
		partID.push(48);
		neighID.push([58, 68, 78]);
		neighLN.push([D1, 2*D1, 3*D1]);

		partID.push(58);
		neighID.push([48, 68, 78]);
		neighLN.push([D1, D1, 2*D1]);

		partID.push(68);
		neighID.push([48, 58, 78]);
		neighLN.push([2*D1, D1, D1]);
		
		partID.push(78);
		neighID.push([48, 58, 68]);
		neighLN.push([3*D1, 2*D1, D1]);
		
		var c = Math.floor(Math.random() * colors.length);		
		o[48].c = colors[c];
		o[58].c = colors[c];
		o[68].c = colors[c];
		o[78].c = colors[c];		
	}
	
	/*
	if(scenario == 0) {
		partID = [
			// S-Family
			00, 01, 10, 11, 04, 05, 14, 15, 08, 09, 18, 19,
		];
		neighID = [
			// S-family
			[10, 11, 01], [00, 10, 11], [00, 01, 11], [10, 00, 01],
			[14, 15, 05], [04, 14, 15], [04, 05, 15], [14, 04, 05],
			[18, 19, 09], [08, 18, 19], [08, 09, 19], [18, 08, 09],
		];
		neighLN = [
			// S-family
			[D0, D1, D0], [D0, D1, D0], [D0, D1, D0], [D0, D1, D0],
			[D0, D1, D0], [D0, D1, D0], [D0, D1, D0], [D0, D1, D0],
			[D0, D1, D0], [D0, D1, D0], [D0, D1, D0], [D0, D1, D0],
		];
		// S-family
		o[00].c = ["#f44", "#fcc"];
		o[01].c = ["#f44", "#fcc"];
		o[10].c = ["#f44", "#fcc"];
		o[11].c = ["#f44", "#fcc"];
		o[04].c = ["#f44", "#fcc"];
		o[05].c = ["#f44", "#fcc"];
		o[14].c = ["#f44", "#fcc"];
		o[15].c = ["#f44", "#fcc"];
		o[08].c = ["#f44", "#fcc"];
		o[09].c = ["#f44", "#fcc"];
		o[18].c = ["#f44", "#fcc"];
		o[19].c = ["#f44", "#fcc"];
	}
	*/
}


function s00() {
	
}


// Draw distribution on canvas
function drawDist() {
	var x = arguments[0];
	var N = x.length;
	
	var can = arguments[1];
	var cx = can.getContext("2d");
	
	var lx = 9;
	var ly = 10;
	var dx = (can.width - 2 * lx) / N;
	var xo = lx;
	var yo = can.height - ly;
	var h = can.height - 2 * ly;
	
	cx.beginPath();
	for(var i = 0; i < N; i++) {
		cx.rect(xo + i * dx, yo, dx, -h * x[i]);
	}
	cx.stroke();
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
	var plane = arguments[1];
	var result = {
		onCanvas: function() {
			var ca = arguments[0];
			var cx = ca.getContext("2d");
			var lintrans = Transformation.linearTransform;
			
			if(o instanceof Grain) {
				var xg = o.r.x;
				var dx = xg + 0.5 * o.D;
				var yg = o.r.y;
				
				if(plane != undefined) {
					xg = o.r.x;
					yg = o.r.z;
				}
				
				var X, DX;
				if(ca.xmin == undefined) {
					X = lintrans(xg, [xmin, xmax], [0, ca.width]);
					DX = lintrans(dx, [xmin, xmax], [0, ca.width]);
				} else {
					X = lintrans(xg, [ca.xmin, ca.xmax], [0, ca.width]);
					DX = lintrans(dx, [ca.xmin, ca.xmax], [0, ca.width]);
				}
				
				var D = DX - X;
				var Y = lintrans(yg, [ymin, ymax], [ca.height, 0]);
				
				if(plane != undefined) {
					Y = lintrans(yg, [zmin, zmax], [ca.height, 0]);
				}
				
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
				
				// Draw outline of particles
				cx.lineWidth = "1";
				cx.arc(X, Y, D, 0, 2 * Math.PI);
				cx.stroke();
				
				// Draw particle id
				cx.font = "12px Times";
				cx.fillStyle = "black";
				cx.textAlign = "center";
				cx.textBaseline = "middle";
				var oid = ("0" + o.id).slice(-2);
				cx.fillText(oid, X, Y);
				
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
				for(var i = 0; i <= N; i++) {
					var X;
					if(ca.xmin == undefined) {
						X = lintrans(o.data[0][i], [xmin, xmax],
							[XMIN, XMAX]);
					} else {
						X = lintrans(o.data[0][i], [ca.xmin, ca.xmax],
							[XMIN, XMAX]);
					}
					var Y = lintrans(o.data[1][i], [ymin, ymax],
						[YMIN, YMAX]);
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
