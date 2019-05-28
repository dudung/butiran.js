/*
	cppcmf.js
	Charged particle in perpendicular constant magnetic field
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190528
	0446 Start this app.
	0754 Continue at campus.
	1222 Finish at campus, proposed color c --> c1, c2.
	1658 Implement correction from [1] and it works.
	1705 Add text for info button.
	
	References
	1. Dani Irawan, Sparisoma Viridi, Siti Nurul Khotimah,
		 Fourier Dzar Eljabbar Latief, and Novitrian, "Modeling
		 and characterization of charged particle trajectories
		 in an oscillating magnetic field", AIP Conference
		 Proceedings [AIP Conf. Proc.], vol. 1656, no. 1,
		 p. 060009, 17 April 2015, url
		 https://doi.org/10.1063/1.4917140
*/

// Define global variables
var params;
var taIn, taOut, caOut;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc, iter, Niter;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var o, magnetic, corv;

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
	p += "BFLD 0.0000 0.0000 -2.0000\n";
	p += "\n";
	p += "# Particle\n";
	p += "MASS 0.1000\n";
	p += "CHRG 3.1415\n";
	p += "DIAM 0.001\n";
	p += "POST 0.0159 0.0000 0.0000\n";
	p += "VELO 0.0000 1.0000 0.0000\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0.0000\n";
	p += "TEND 0.1000\n";
	p += "TSTP 0.0001\n";
	p += "TDAT 0.0020\n";
	p += "TPRC 1\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -0.020 -0.020 -0.020\n";
	p += "RMAX +0.020 +0.020 +0.020\n";
	p += "\n";
	p += "# Method\n";
	p += "CORV 0\n";
	
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
var B = getValue("BFLD").from(taIn);
var m = getValue("MASS").from(taIn);
var q = getValue("CHRG").from(taIn);
var D = getValue("DIAM").from(taIn);
var r = getValue("POST").from(taIn);
var v = getValue("VELO").from(taIn);

tbeg = getValue("TBEG").from(taIn);
tend = getValue("TEND").from(taIn);
dt = getValue("TSTP").from(taIn);
Tdata = getValue("TDAT").from(taIn);
Tproc = getValue("TPRC").from(taIn);

var rmin = getValue("RMIN").from(taIn);
var rmax = getValue("RMAX").from(taIn);

corv = getValue("CORV").from(taIn);

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
o.q = q;
o.D = D;
o.r = r;
o.v = v;
o.c = "#f00";

magnetic = new Magnetic();
magnetic.setField(B);

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
		info += "cppcmf.js\n";
		info += "Charged particle in perpendicular ";
		info += "constant magnetic field\n";
		info += "Sparisoma Viridi\n";
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
		var xx = o.r.x.toFixed(digit);
		var yy = o.r.y.toFixed(digit);
		var text = tt + " " + xx + " " + yy;
		addText(text + "\n").to(taOut);
	}
	
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
	
	
	clearCanvas(caOut);
	draw(o).onCanvas(caOut);
	
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


// Draw grain on canvas
function draw() {
	var o = arguments[0];
	var result = {
		onCanvas: function() {
			var ca = arguments[0];
			var cx = ca.getContext("2d");
			
			var x = o.r.x;
			var dx = x + o.D;
			var y = o.r.y;
			
			var lintrans = Transformation.linearTransform;
			var X = lintrans(x, [xmin, xmax], [XMIN, XMAX]);
			var DX = lintrans(dx, [xmin, xmax], [XMIN, XMAX]);
			var D = DX - X;
			var Y = lintrans(y, [ymin, ymax], [YMIN, YMAX]);
			
			cx.beginPath();
			cx.strokeStyle = o.c;
			cx.arc(X, Y, D, 0, 2 * Math.PI);
			cx.stroke();
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