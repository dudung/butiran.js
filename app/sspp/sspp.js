/*
	sspp.js
	Simulation of self-propelled particles
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	Ariq Dhia Irfanudin | 1157030004@student.uinsgd.ac.id
	Dinda Ravi Algifari | dinda.ravi.algivari@gmail.com
	Yudha Satya Perkasa | yudha@uinsgd.ac.id
	
	20190531
	1903 Start this project with cppcmf as template.	
	1912 Update co-authors email and update info.
	2003 Copy draw().on() from spfwfs app, test it, it works.
	20190601
	0851 Continue at home.
	1025 Add magnetic force.
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
var g, E, B, v;

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
	p += "GENV +1.00 +0.00 +0.00\n";
	p += "EENV +0.00 +1.00 +0.00\n";
	p += "BENV +0.00 +0.00 +1.00\n";
	p += "VENV -0.71 -0.71 +0.00\n";
	p += "\n";
	p += "# Particles\n";
	p += "MASS 1\n";
	p += "CHRG 1\n";
	p += "DIAM 2\n";
	p += "NUMP 4\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0.0\n";
	p += "TEND 100.0\n";
	p += "TSTP 0.1\n";
	p += "TDAT 0.1\n";
	p += "TPRC 10\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -100 -100 -100\n";
	p += "RMAX +100 +100 +100\n";
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
	g = getValue("GENV").from(taIn);
	E = getValue("EENV").from(taIn);
	B = getValue("BENV").from(taIn);
	v = getValue("VENV").from(taIn);
	
	// Get parameters of iteration
	tbeg = getValue("TBEG").from(taIn);
	tend = getValue("TEND").from(taIn);
	dt = getValue("TSTP").from(taIn);
	Tdata = getValue("TDAT").from(taIn);
	Tproc = getValue("TPRC").from(taIn);

	iter = 0;
	Niter = Math.floor(Tdata / dt);
	
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
	
	// Get parameters of particles
	var m = getValue("MASS").from(taIn);
	var q = getValue("CHRG").from(taIn);
	var D = getValue("DIAM").from(taIn);
	N = getValue("NUMP").from(taIn);
	
	t = tbeg;
	o = [];
	var Lx = 10;
	var Ly = 10;
	var Ny = Math.ceil(Math.sqrt(N));
	var Nx = N / Ny;
	var i = 0;
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {		
			
			var x = (ix - Nx/2) * Lx + xo;
			var y = (iy - Ny/2) * Ly + yo;
			
			var vx = Math.random() * 2 - 1; 
			var vy = Math.random() * 2 - 1; 
			
			var oi = new Grain();
			oi.m = m;
			oi.q = q;
			oi.D = D;
			oi.r = new Vect3(x, y, 0);
			oi.v = new Vect3(vx, vy, 0);
			oi.c = ["#800", "#faa"];
			
			o.push(oi);
			
			i++;
			if(i >= N) break;
		}
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
		info += "Ariq Dhia Irfanudin, ";
		info += "Dinda Ravi Algifari, ";
		info += "Yudha Satya Perkasa\n";
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
		addText("#t      x       y\n").to(taOut);
	}
	
	if(iter == 0) {
		var tt = t.toFixed(digit);
		var text = tt + "\n";
		addText(text).to(taOut);
	}
	
	clearCanvas(caOut);
	for(var i = 0; i < N; i++) {
		draw(o[i]).onCanvas(caOut);
	}
	
	var a = [];
	for(var i = 0; i < N; i++) {
		
		var v = o[i].v;
		var r = o[i].r;
		var q = o[i].q;
		var m = o[i].m;
		
		var FB = Vect3.mul(q, Vect3.cross(v, B));

		/*
		var un = o.q * magnetic.B.len() * dt / o.m;
		var alpha = 1 / Math.sqrt(1 + un * un);
		*/

		
		var F = new Vect3;
		F = Vect3.add(F, FB);
		
		a.push(Vect3.div(F, m));		
	}
	
	for(var i = 0; i < N; i++) {
		var r = o[i].r;
		var v = o[i].v;
		
		v = Vect3.add(v, Vect3.mul(a[i], dt));
		r = Vect3.add(r, Vect3.mul(v, dt));
		
		o[i].r = r;
		o[i].v = v;
	}
	
	var xIsOut = false;
	var yIsOut = false;
	for(var i = 0; i < N; i++) {
		var x = o[i].r.x;
		if(x < xmin || x > xmax) xIsOut = true;
		var y = o[i].r.y;
		if(y < ymin || y > xmax) yIsOut = true;
		if(xIsOut || yIsOut) break;
	}	
	
	if(t >= tend || xIsOut || yIsOut) {
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