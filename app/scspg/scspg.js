/*
	scsgp.js
	Semi-circle segmented path generator
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190528
	2037 Start this app.
	20190529
	0824 Continue at campus.
	0833 Note: an 
	
	References
	1. Sparisoma Viridi, Siti Nurul Khotimah, "SCSPG (Semi-
		 Circle Segmented Path Generator): How to Use and
		 an Example in Calculating Work of Friction along Curved
		 Path", arXiv:1203.0796v1 [physics.comp-ph] 5 Mar 2012,
		 url https://arxiv.org/abs/1203.0796v1
*/

// Define global variables
var params;
var taIn, taOut, caOut;
var btLoad, btRead, btStart, btInfo;
var ds, segments;
var digit;
var xmin, ymin, zmin, xmax, ymaz, zmax;
var XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX;
var proc, Tproc, iter, Niter;
var x, y;

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
	p += "# Step\n";
	p += "SSTP 0.0100\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TPRC 100\n";
	p += "\n";
	p += "# Coordinates\n";
	p += "RMIN -10 -10 -10\n";
	p += "RMAX +10 +10 +10\n";
	p += "\n";
	p += "# Segments\n";
	p += "0.0000 0.0000 4.0000\n";
	p += "0.0000 0.2500 1.5708\n"; // R = 2
	p += "0.2500 0.2500 6.0000\n";
	p += "0.2500 0.3750 1.1781\n"; // R = 3
	p += "0.3750 0.3750 2.0000\n";
	p += "0.3750 0.5000 2.3562\n"; // R = 6
	p += "0.5000 0.5000 1.0000\n";
	p += "0.5000 0.7500 3.1416\n"; // R = 2
	p += "0.7500 0.7500 1.0000\n";
	p += "0.7500 0.0000 1.5708\n"; // R = 1
	p += "0.0000 0.0000 2.0000\n";
	
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
var ds = getValue("SSTP").from(taIn);

Tproc = getValue("TPRC").from(taIn);

var rmin = getValue("RMIN").from(taIn);
var rmax = getValue("RMAX").from(taIn);

xmin = rmin.x;
ymin = rmin.y;
zmin = rmin.z;
xmax = rmax.x;
ymax = rmax.y;
zmax = rmax.z;

XMIN = 0;
XMAX = caOut.width;
YMIN = caOut.height;
YMAX = 0;
ZMIN = -1;
ZMAX = 1;

segments = getBlockValue("# Segments").from(taIn);
iter = 0;
Niter = segments.length;

x = 0;
y = 0;
}


// Get block of value form a textarea
function getBlockValue() {
	var pattern = arguments[0];
	var results = {
		from: function() {
			var ta = arguments[0];
			var lines = ta.value.split("\n");
			var Nl = lines.length;
			
			var lbeg = -1;
			var lend = -1;
			for(var l = 0; l < Nl; l++) {
				if(lines[l].indexOf(pattern) == 0) {
					lbeg = l + 1;
				}
				if(lines[l].length == 0 && l > lbeg) {
					lend = l - 1;
				}
			}
			
			var block = [];
			for(var l = lbeg; l <= lend; l++) {
				var words = lines[l].split(" ");
				var r = new Vect3(
					parseFloat(words[0]),
					parseFloat(words[1]),
					parseFloat(words[2])
				);
				block.push(r);
			}
			
			return block;
		}
	};
	return results;
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
		info += "scsgp.js\n";
		info += "Semi-circle segmented path generator\n";
		info += "Sparisoma Viridi\n";
		info += "https://github.com/dudung/butiran.js\n"
		info += "Load  load parameters\n";
		info += "Read  read parameters\n";
		info += "Start start generation\n";
		info += "Info  show this messages\n";
		info += "\n";
		addText(info).to(taOut);
	break;
	default:
	}
}


// Perform simulation
function simulate() {
	
	if(iter == 0) {
		addText("#s" + "\n").to(taOut);
	}
	addText(iter + "\n").to(taOut);
	
	clearCanvas(caOut);
	draw(segments[iter]).onCanvas(caOut);
	
	if(iter >= Niter - 1) {
		btLoad.disabled = false;
		btRead.disabled = false;
		btStart.disabled = true;
		btInfo.disabled = false;
		btStart.innerHTML = "Start";
		clearInterval(proc);
		addText("\n").to(taOut);
	}
	
	iter++;
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
			
			
			if(o instanceof Grain) {
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
			} else if(o instanceof Vect3) {
				var thetai = 
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