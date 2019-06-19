/*
	gfhtgr.js
	Granular flow in a HTGR (high temperature gas-cooled reactor)
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	Dwi Irwanto | dirwanto@fi.ac.id
	
	20190616
	0835 Start this project.
	0839 Continue in konsinyering at Staf Lama.
	0914 Finish veio in lib/ui.
	0954 Correct info menu.
	1000 Work for no container wall, begin working on box.
	1017 Collision between grains is corrected and works.
	1203 There is still problem by collision between two grains.
	1644 Try to get information related to box.
	1758 Finish drawing box projection in 2d canvas.
	2005 Finish drawing 2d silo with same color for stroke and fill.
	20190618
	0327 Start again by adding test mode.
	0426 Bug found in determining n but not solution came up yet.
*/

// Define global variables
var params;
var taIn, taOut, caOut;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var o, No, b, Nb, drag1, buoy1, grav1, norm2;
var TEST_MODE;

// Execute main function
main();


// Define main function
function main() {
	TEST_MODE = true;
	initParams();
	createVisualElements();
}


// Initialize parameters
function initParams() {
	var p = "";
	p += "# Environments\n";
	p += "TEMF 288\n";
	p += "ETAF 0 1.81E-5 0\n";
	p += "RHOF 1\n";
	p += "GACC 0 -9.80665 0\n";
	p += "\n";
	p += "# Interactions\n";
	p += "NINT 20000 1\n";
	p += "\n";
	p += "# Particles\n";
	if(TEST_MODE) {
		p += "NUMG 1\n";
		p += "DIAG 0.20\n";
	} else {
		p += "NUMG 144\n";
		p += "DIAG 0.05\n";
	}
	p += "RHOG 2000\n";
	p += "\n";
	p += "# Walls\n";
	if(TEST_MODE) {
		p += "NUMW 1\n";
		p += "BX1R +0.00 -0.30 +0.00\n";
		p += "BX1A +0.80 +0.00 +0.00\n";
		p += "BX1B +0.00 +0.10 +0.00\n";
		p += "BX1C +0.00 +0.00 +0.10\n";
		p += "BX2R -0.40 +0.05 +0.00\n";
		p += "BX2A +0.10 +0.00 +0.00\n";
		p += "BX2B +0.00 +0.80 +0.00\n";
		p += "BX2C +0.00 +0.00 +0.10\n";
		p += "BX3R +0.40 +0.05 +0.00\n";
		p += "BX3A +0.10 +0.00 +0.00\n";
		p += "BX3B +0.00 +0.80 +0.00\n";
		p += "BX3C +0.00 +0.00 +0.10\n";
	} else {
		p += "NUMW 6\n";
		p += "BX1R -0.40 +0.20 +0.00\n";
		p += "BX1A +0.10 +0.00 +0.00\n";
		p += "BX1B +0.00 +1.00 +0.00\n";
		p += "BX1C +0.00 +0.00 +0.10\n";
		p += "BX2R +0.40 +0.20 +0.00\n";
		p += "BX2A +0.10 +0.00 +0.00\n";
		p += "BX2B +0.00 +1.00 +0.00\n";
		p += "BX2C +0.00 +0.00 +0.10\n";
		p += "BX3R -0.26 -0.42 +0.00\n";
		p += "BX3A +0.30 -0.30 +0.00\n";
		p += "BX3B +0.07 +0.07 +0.00\n";
		p += "BX3C +0.00 +0.00 +0.10\n";
		p += "BX4R +0.26 -0.42 +0.00\n";
		p += "BX4A +0.30 +0.30 +0.00\n";
		p += "BX4B +0.07 -0.07 +0.00\n";
		p += "BX4C +0.00 +0.00 +0.10\n";
		p += "BX5R -0.12 -0.69 +0.00\n";
		p += "BX5A +0.10 +0.00 +0.00\n";
		p += "BX5B +0.00 +0.30 +0.00\n";
		p += "BX5C +0.00 +0.00 +0.10\n";
		p += "BX6R +0.12 -0.69 +0.00\n";
		p += "BX6A +0.10 +0.00 +0.00\n";
		p += "BX6B +0.00 +0.30 +0.00\n";
		p += "BX6C +0.00 +0.00 +0.10\n";
	}
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0.0\n";
	p += "TEND 100.0\n";
	p += "TSTP 0.001\n";
	p += "TDAT 0.1\n";
	p += "TPRC 10\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -1 -1 -1\n";
	p += "RMAX +1 +1 +1\n";
	p += "\n";
	
	params = p;
	
	digit = 4;
}


// Load parameters
function loadParams() {
	Veio.clearText(taIn);
	Veio.addText(params).to(taIn);
}


// Read parameters
function readParams() {
	// Get parameters of enviroment
	var temf = Veio.getValue("TEMF").from(taIn);
	var etaf = Veio.getValue("ETAF").from(taIn);
	var rhof = Veio.getValue("RHOF").from(taIn);
	var gacc = Veio.getValue("GACC").from(taIn);
	
	drag1 = new Drag;
	drag1.setField(new Vect3);
	drag1.setConstants(etaf.x, etaf.y, etaf.z);
	
	buoy1 = new Buoyant;
	buoy1.setFluidDensity(rhof);
	buoy1.setGravity(gacc);
	
	grav1 = new Gravitational;
	grav1.setField(gacc);
	
	// Get parameters of interaction
	var kN = Veio.getValue("NINT").from(taIn);
	
	norm2 = new Normal;
	norm2.setConstants(kN[0], kN[1]);
	
	// Get parameters of iteration
	tbeg = Veio.getValue("TBEG").from(taIn);
	tend = Veio.getValue("TEND").from(taIn);
	dt = Veio.getValue("TSTP").from(taIn);
	Tdata = Veio.getValue("TDAT").from(taIn);
	Tproc = Veio.getValue("TPRC").from(taIn);

	iter = 0;
	Niter = Math.floor(Tdata / dt);
	
	// Get parameters of coordinates
	var rmin = Veio.getValue("RMIN").from(taIn);
	var rmax = Veio.getValue("RMAX").from(taIn);

	xmin = rmin.x;
	ymin = rmin.y;
	zmin = rmin.z;
	xmax = rmax.x;
	ymax = rmax.y;
	zmax = rmax.z;
	
	xo = 0.5 * (xmin + xmax);
	if(TEST_MODE) {
		xo += 0.0;
	}
	yo = 0.5 * (ymin + ymax) + 0.1;
	
	XMIN = 0;
	XMAX = caOut.width;
	YMIN = caOut.height;
	YMAX = 0;
	ZMIN = -1;
	ZMAX = 1;
	
	// Get parameters of particles
	var rho = Veio.getValue("RHOG").from(taIn);
	var D = Veio.getValue("DIAG").from(taIn);
	var V = (Math.PI / 6) * D * D * D;
	var m = rho * V;
	No = Veio.getValue("NUMG").from(taIn);
	
	t = tbeg;
	
	o = [];
	var Lx = 1.1 * D;
	var Ly = 1.1 * D;
	var Ny = Math.ceil(Math.sqrt(No));
	var Nx = No / Ny;
	var i = 0;
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			
			var x = ((ix + 0.5) - 0.5 * Nx) * Lx + xo;
			var y = ((iy + 0.5) - 0.5 * Ny) * Ly + yo;
						
			var rndx = 0.0001 * (Math.random() - 0.5) * D;
			var rndy = 0.0001 * (Math.random() - 0.5) * D;
			
			x += rndx;
			y += rndy;
			
			var oi = new Grain();
			oi.m = m;
			oi.D = D;
			oi.r = new Vect3(x, y, 0);
			oi.v = new Vect3;
			oi.c = ["#800", "#faa"];
			
			o.push(oi);
			
			i++;
			if(i >= No) break;
		}
	}
	
	
	b = [];
	Nb = Veio.getValue("NUMW").from(taIn);
	for(var i = 0; i < Nb; i++) {
		var pre = "BX" + (i + 1);
		var rpattern = pre + "R";
		var apattern = pre + "A";
		var bpattern = pre + "B";
		var cpattern = pre + "C";
		
		var r = Veio.getValue(rpattern).from(taIn);
		var sa = Veio.getValue(apattern).from(taIn);
		var sb = Veio.getValue(bpattern).from(taIn);
		var sc = Veio.getValue(cpattern).from(taIn);
		
		var bi = new Box(r, sa, sb, sc);
		b.push(bi);
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
		
		Veio.clearCanvas(caOut);
		for(var i = 0; i < No; i++) {
			draw(o[i]).onCanvas(caOut);
		}
		for(var i = 0; i < Nb; i++) {
			draw(b[i]).onCanvas(caOut);
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
		info += "gfhtgr.js\n";
		info += "Granular flow in a HTGR (high temperature gas-";
		info += "cooled reactor)\n";
		info += "Sparisoma Viridi, ";
		info += "Dwi Irwanto\n";
		info += "https://github.com/dudung/butiran.js\n"
		info += "Load  load parameters\n";
		info += "Read  read parameters\n";
		info += "Start start simulation\n";
		info += "Info  show this messages\n";
		info += "\n";
		Veio.addText(info).to(taOut);
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
		Veio.addText("#t      xcom    ycom    K\n").to(taOut);
	}
	
	var K = 0;
	var xcom = 0;
	var ycom = 0;
	for(var i = 0; i < No; i++) {
		xcom += o[i].r.x;
		ycom += o[i].r.y;
		var m = o[i].m;
		var v = o[i].v.len();
		K += 0.5 * m * v * v;
	}
	xcom /= No;
	ycom /= No;
	
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
		Veio.addText(text).to(taOut);
	}
	
	// Clear canvas
	Veio.clearCanvas(caOut);
	
    // Draw grains on canvas
    for(var i = 0; i < No; i++) {
		draw(o[i]).onCanvas(caOut);
	}
	
    // Draw boxes on canvas
    for(var i = 0; i < Nb; i++) {
		draw(b[i]).onCanvas(caOut);
	}
	
	var a = [];
	for(var i = 0; i < No; i++) {
		
		var F = new Vect3;
		
		var FD = drag1.force(o[i]);
		F = Vect3.add(F, FD);
		
		for(var j = 0; j < No; j++) {
			if(j != i) {
				var FN = norm2.force(o[i], o[j]);
				F = Vect3.add(F, FN);
			}
		}
		
		for(var j = 0; j < Nb; j++) {
			var FN = norm2.force(o[i], b[j]);
			F = Vect3.add(F, FN);
		}
		
		var FB = buoy1.force(o[i]);
		F = Vect3.add(F, FB);
		
		var FG = grav1.force(o[i]);
		F = Vect3.add(F, FG);
		
		var m = o[i].m;
		a.push(Vect3.div(F, m));
	}
	
	for(var i = 0; i < No; i++) {
		var r = o[i].r;
		var v = o[i].v;
		
		v = Vect3.add(v, Vect3.mul(a[i], dt));
		r = Vect3.add(r, Vect3.mul(v, dt));
		
		o[i].r = r;
		o[i].v = v;
	}
	
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
			} else if(o instanceof Box) {
				cx.beginPath();
				cx.lineWidth = "2";
				var N = o.p.length;
				for(var i = 0; i < N/2; i++) {
					var x = o.p[i].x;
					var y = o.p[i].y;
					var X = lintrans(x, [xmin, xmax], [XMIN, XMAX]);
					var Y = lintrans(y, [ymin, ymax], [YMIN, YMAX]);
					if(i == 0) {
						cx.moveTo(X, Y);
					} else {
						cx.lineTo(X, Y);
					}
				}
				cx.closePath();
				cx.strokeStyle = "#000";
				cx.stroke();
				cx.fillStyle = "#fff";
				cx.fill();
			}
		}
	};
	return result;
}
