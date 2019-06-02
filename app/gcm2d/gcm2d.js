/*
	gcm2d.js
	Granular catenary model in two-dimension
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	Aufa Nu’man Fadhilah Rudiawan | aufa.rudiawan@gmail.com
	Ismi Yasifa | yasifa.ismi@gmail.com
	
	20190602
	0650 Start this project with gpcspp as template.
	1341 Continue the progress.
	
	References
	1. Aufa Nu’man Fadhilah Rudiawan, Ismi Yasifa, Sparisoma
		 Viridi, "Perumusan Gaya antar Butiran pada Kasus Rantai
		 Butiran Magnetik Terentang Horizontal", Prosiding
		 Seminar Nasional Fisika (SNF 2018), vol. 7, pp. SNF2018-PA-92, 30 Oktober 2018, url
		 https://doi.org/10.21009/03.SNF2018.02.PA.12
		 http://journal.unj.ac.id/unj/index.php/prosidingsnf
		 /article/view/9181
	2. "Viscosity of air, dynamic and kinematic", url
		 https://www.engineersedge.com/physics/viscosity
		 _of_air_dynamic_and_kinematic_14483.htm [20190602].
*/

// Define global variables
var params;
var taIn, taOut, caOut;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var o, N;
var grav1, sprn2;

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
	p += "# Environments\n";
	p += "GENV 0 -9.807 0\n";
	p += "TENV 298\n";
	p += "ETAF 0 1.86E-5 0\n";
	p += "\n";
	p += "# Interactions\n";
	p += "SINT 1000 1\n";
	p += "\n";
	p += "# Catenary\n";
	p += "MASS 0.1\n";
	p += "LENG 2\n";
	p += "NUMP 20\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0.0\n";
	p += "TEND 100.0\n";
	p += "TSTP 0.002\n";
	p += "TDAT 0.1\n";
	p += "TPRC 10\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -1.5 -1.5 -1.5\n";
	p += "RMAX +1.5 +1.5 +1.5\n";
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
	// Get parameters of enviroment
	var eta = getValue("ETAF").from(taIn);
	var g = getValue("GENV").from(taIn);
	
	drag1 = new Drag;
	drag1.setField(new Vect3);
	drag1.setConstants(eta.x, eta.y, eta.z);
	
	grav1 = new Gravitational;
	grav1.setField(g);
	
	// Get parameters of catenary
	var M = getValue("MASS").from(taIn);
	var L = getValue("LENG").from(taIn);
	N = getValue("NUMP").from(taIn);
	
	var dL = L / (N - 1);
	var dM = M / N;

	// Get parameters of interaction
	var kS = getValue("SINT").from(taIn);
	
	sprn2 = new Spring;
	sprn2.setConstants(kS[0], kS[1]);
	sprn2.setUncompressedLength(dL);
	
	// Get parameters of iteration
	tbeg = getValue("TBEG").from(taIn);
	tend = getValue("TEND").from(taIn);
	dt = getValue("TSTP").from(taIn);
	Tdata = getValue("TDAT").from(taIn);
	Tproc = getValue("TPRC").from(taIn);

	iter = 0;
	Niter = Math.floor(Tdata / dt);
	t = tbeg;
	
	// Get parameters of coordinates
	var rmin = getValue("RMIN").from(taIn);
	var rmax = getValue("RMAX").from(taIn);

	xmin = rmin.x;
	ymin = rmin.y;
	zmin = rmin.z;
	xmax = rmax.x;
	ymax = rmax.y;
	zmax = rmax.z;
	
	xo = 0.5 * (xmin + xmax);
	yo = 0.5 * (ymin + ymax);
	
	XMIN = 0;
	XMAX = caOut.width;
	YMIN = caOut.height;
	YMAX = 0;
	ZMIN = -1;
	ZMAX = 1;
	
	// Create initial position of all particles
	o = [];
	var xo = 0.5 * (xmax + xmin) - 0.5 * L;
	for(var i = 0; i < N; i++) {
		var x = xo + i * dL;
		var y = 0;
		var z = 0;
		var r = new Vect3(x, y, z);
		var v = new Vect3;
		
		oi = new Grain();
		oi.m = dM;
		oi.q = 0;
		oi.D = 0.5 * dL;
		if(i == 0 || i == N - 1) {
			oi.c = ["#0a0", "#8f8"];
		} else {
			oi.c = ["#00a", "#88f"];			
		}
		oi.r = r;
		oi.v = v;
		
		o.push(oi);
	}
	
	// Draw all particles
	clearCanvas(caOut);
	for(var i = 0; i < N; i++) {
		draw(o[i]).onCanvas(caOut);
	}
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
		fontSize = "11px";
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
		
		clearCanvas(caOut);
		for(var i = 0; i < N; i++) {
			draw(o[i]).onCanvas(caOut);
		}
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
		info += "sspp.js\n";
		info += "Simulation of self-propelled particles";
		info += "Sparisoma Viridi, ";
		info += "Yudha Satya Perkasa\n";
		info += "Ariq Dhia Irfanudin, ";
		info += "Dinda Ravi Algifari, ";
		info += "https://github.com/dudung/butiran.js\n"
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
		//       0.0740 -0.0009 -0.0162
		addText("#t      xcom    ycom    K\n").to(taOut);
	}
	
	var K = 0;
	var xcom = 0;
	var ycom = 0;
	for(var i = 0; i < N; i++) {
		xcom += o[i].r.x;
		ycom += o[i].r.y;
		var m = o[i].m;
		var v = o[i].v.len();
		K += 0.5 * m * v * v;
	}
	xcom /= N;
	ycom /= N;
	
	if(iter == 0) {
		//var tt = t.toFixed(digit);
		var tt = t.toFixed(1);
		tt = (t < 100) ? ("00" + tt).slice(-5) : tt;
		var xx = xcom.toExponential(1);
		xx = (xcom >= 0) ? "+" + xx : xx;
		var yy = ycom.toExponential(1);
		yy = (ycom >= 0) ? "+" + yy : yy;
		var KK = K.toExponential(3);
		var text = tt + " ";
		text += xx + " ";
		text += yy + " ";
		text += KK + "\n";
		addText(text).to(taOut);
	}
	
	clearCanvas(caOut);
	for(var i = 0; i < N; i++) {
		draw(o[i]).onCanvas(caOut);
	}
	
	// Calculate total force and acceleration
	var a = [];
	a.push(Vect3);
	for(var i = 1; i < N-1; i++) {
		
		var F = new Vect3;
		var m = o[i].m;
		
		var FD = drag1.force(o[i]);
		F = Vect3.add(F, FD);
		
		var FG = grav1.force(o[i]);
		F = Vect3.add(F, FG);

		var FSL = sprn2.force(o[i], o[i-1]);
		var FSR = sprn2.force(o[i], o[i+1]);
		var FS = Vect3.add(FSL, FSR);
		F = Vect3.add(F, FS);
		
		a.push(Vect3.div(F, m));
	}
	a.push(Vect3);
	
	// Integrate acceleration and velocity
	for(var i = 1; i < N-1; i++) {
		var r = o[i].r;
		var v = o[i].v;
		
		v = Vect3.add(v, Vect3.mul(a[i], dt));
		r = Vect3.add(r, Vect3.mul(v, dt));
		
		o[i].r = r;
		o[i].v = v;
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


// Draw grain on canvas
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
				
				var X, DX;
				if(ca.xmin == undefined) {
					X = lintrans(xg, [xmin, xmax], [XMIN, XMAX]);
					DX = lintrans(dx, [xmin, xmax], [XMIN, XMAX]);
				} else {
					X = lintrans(xg, [ca.xmin, ca.xmax], [XMIN, XMAX]);
					DX = lintrans(dx, [ca.xmin, ca.xmax], [XMIN, XMAX]);
				}
				
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
					cx.arc(X, Y, 0.5 * D, 0, 2 * Math.PI);
					cx.fill();
				}
				cx.lineWidth = "2";
				cx.arc(X, Y, 0.5 * D, 0, 2 * Math.PI);
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
					} else if(Nw == 3) {
						value = [];
						value.push(parseFloat(words[1]));
						value.push(parseFloat(words[2]));
					}
					return value;
				}
			}
		}
	};
	return result;	
}