/*
	mdfhcp.js
	Molecular dynamics simulation of floating hcp structure
	
	Sparisoma Viridi | dudung@gmail.com
	Veinardi Suendo | suendo@gmail.com
	
	20190709
	0958 Create from spfwfs as template.
	1006 Remove o0.
	1010 Try to add more than one o.
	1102 Try with 10 liniear configuration.
	1142 Fix wrong drawing D --> R.
	1150 Change coordinates on canvas1.
	1156 Implement gravitational-like attractive force.
	1208 Try to draw in xz plane.
	1218 Not yet success.
	1359 Better visualization.
	1741 Con to get data from app.
	1838 Find better wave parameters.
	20190710
	0522 Change data time output format to 2 digit every 1 s.
	0545 Create distribution function.
	0554 Change layout.
	
	References
	1. Sparisoma Viridi, Veinardi Suendo, "Molecular dynamics
	   simulation of floating sphere forming two-dimensional
		 hexagonal close packed structure", OSF,
		 url https://doi.org/10.17605/osf.io/a3gjv
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
var buoyant, gravitational, drag, normal, attractive;
var ND;

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
	p += "WAMP 0.001\n";
	p += "WTIM 2.000\n";
	p += "WLEN 1.000\n";
	p += "LSTP 0.0100\n";
	p += "RHOF 1000.0\n";
	p += "ETAF 8.9E-4\n";
	p += "TEMF 298\n";
	p += "GACC 0 -9.8067 0\n";
	p += "\n";
	p += "# Interaction\n";
	p += "KNXX 1000\n";
	p += "GNXX 0.1\n";
	p += "KAXX 0.01\n";
	p += "\n";
	p += "# Particle\n";
	p += "RHOG 500.0\n";
	p += "DIAM 0.1000\n";
	p += "POST 0.0000 0.0000 0.0000\n";
	p += "VELO 0.0000 0.0000 0.0000\n";
	p += "NXYZ 2 1 2\n";
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
	tbeg = getValue("TBEG").from(taIn);
	tend = getValue("TEND").from(taIn);
	dt = getValue("TSTP").from(taIn);
	Tdata = getValue("TDAT").from(taIn);
	Tproc = getValue("TPRC").from(taIn);

	wA = getValue("WAMP").from(taIn);
	wT = getValue("WTIM").from(taIn);
	wL = getValue("WLEN").from(taIn);
	dx = getValue("LSTP").from(taIn);

	iter = 0;
	Niter = Math.floor(Tdata / dt);
	t = tbeg;

	var rhog = getValue("RHOG").from(taIn);
	var D = getValue("DIAM").from(taIn);
	var r = getValue("POST").from(taIn);
	var v = getValue("VELO").from(taIn);
	var NXYZ = getValue("NXYZ").from(taIn);

	var V = (Math.PI / 6) * D * D * D;
	var m = rhog * V;

	// Define initial position
	o = [];
	var Nx = NXYZ.x;
	var Ny = NXYZ.y;
	var Nz = NXYZ.z;

	for(var ix = 0; ix < Nx; ix++) {
		for(var iy = 0; iy < Ny; iy++) {
			for(var iz = 0; iz < Nz; iz++) {
				oi = new Grain();
				oi.m = m;
				oi.q = 0;
				oi.D = D;
				
				var rndx = 0.01 * D * Math.random();
				var rndy = 0.00 * D * Math.random();
				var rndz = 0.01 * D * Math.random();
				
				var x = D * (ix - 0.5 * (Nx - 1)) * (1 + rndx);
				var y = D * (iy - 0.5 * (Ny - 1)) * (1 + rndy);
				var z = D * (iz - 0.5 * (Nz - 1)) * (1 + rndz);
				oi.r = Vect3.add(r, new Vect3(x, y, z));
				oi.v = v;
				oi.c = ["#f00"];
				o.push(oi);
			}
		}
	}

	var rhof = getValue("RHOF").from(taIn);
	var etaf = getValue("ETAF").from(taIn);
	var Temf = getValue("TEMF").from(taIn);
	var g = getValue("GACC").from(taIn);
	var kN = getValue("KNXX").from(taIn);
	var gN = getValue("GNXX").from(taIn);
	var kA = getValue("KAXX").from(taIn);

	buoyant = new Buoyant();
	buoyant.setFluidDensity(rhof);
	buoyant.setGravity(g);

	gravitational = new Gravitational();
	gravitational.setField(g);

	drag = new Drag();
	drag.setConstants(0, 3 * Math.PI * etaf * D, 0);

	normal = new Normal();
	normal.setConstants(kN, gN);

	attractive = new Gravitational();
	attractive.setConstant(kA);

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
		info += "mdfhcp.js\n";
		info += "Molecular dynamics simulation of HCP structure\n";
		info += "Sparisoma Viridi, Veinardi Suendo\n";
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
	
	var xlength = xmax - xmin;
	var N = 4 * xlength / dx;
	for(var i = 0; i <= N; i++) {
		var xx = xmin - 1.5 * xlength + i * dx;
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
		
		// Calculate gravitational force
		var Fg = gravitational.force(o[i]);
		F = Vect3.add(F, Fg);
			
		// Calculate buoyant force
		var V = (Math.PI / 6) * o[i].D * o[i].D * o[i].D;
		var yA = waveFunction(o[i].r.x + 0.5 * o[i].D, t);
		var yB = waveFunction(o[i].r.x - 0.5 * o[i].D, t);
		var yf = waveFunction(o[i].r.x, t);
		var Fb = buoyant.force(o[i], yA, yB, yf);
		F = Vect3.add(F, Fb);
		
		// Calculate drag force
		var dy = waveFunction(o[i].r.x, t + dt)
			- waveFunction(o[i].r.x, t);
		var vf = new Vect3(0, dy / dt, 0);
		drag.setField(vf);
		var Fd = drag.force(o[i])
		F = Vect3.add(F, Fd);
		
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
	
	// Create wave curve
	p = createWave(t);
	
	// Clear all canvas
	clearCanvas(caOut1);	
	clearCanvas(caOut2);
	clearCanvas(caOut3);
	
	// Draw object in all canvas
	for(var i = 0; i < o.length; i++) {
		draw(o[i]).onCanvas(caOut1);
		draw(o[i], "xz").onCanvas(caOut2);
	}
	
	// Draw wave in all canvas
	draw(p).onCanvas(caOut1);
	
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
