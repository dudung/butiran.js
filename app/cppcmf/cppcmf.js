/*
	cppcmf.js
	
	Charged particle in perpendicular constant magnetic field
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190528
	0446 Start this app.
	0754 Continue at campus.
*/

// Define global variables
var params;
var taIn, taOut, caOut;
var btLoad, btRead, btStart, btInfo;
var tbeg, tend, dt, t, Tdata, Tproc, proc;
var B, m, q, D, r, v;


// Execute main function
main();


// Define main function
function main() {
	createVisualElements();
	initParams();
}


// Initialize parameters
function initParams() {
	var p = "";
	p += "# Environment\n";
	p += "BFLD 0.000 0.000 2.000\n";
	p += "\n";
	p += "# Particle\n";
	p += "MASS 0.100\n";
	p += "CHRG 3.141\n";
	p += "DIAM 0.010\n";
	p += "POST 1.000 0.000 0.000\n";
	p += "VELO 0.000 1.000 0.000\n";
	p += "\n";
	p += "# Iteration\n";
	p += "TBEG 0.000\n";
	p += "TEND 1.000\n";
	p += "TSTP 0.001\n";
	p += "TDAT 0.010\n";
	p += "TPRC 100\n";
	params = p;
}


// Load parameters
function loadParams() {
	addText(params).to(taIn);
}


// Create visual elements
function createVisualElements() {
	// Create textarea for input
	taIn = document.createElement("textarea");
	with(taIn.style) {
		overflowY = "scroll";
		width = "194px";
		height = "200px";
	}
	
	// Create textarea for output
	taOut = document.createElement("textarea");
	with(taOut.style) {
		overflowY = "scroll";
		width = "194px";
		height = "200px";
	}
	
	// Create button for loading default parameters
	btLoad = document.createElement("button");
	with(btLoad) {
		innerHTML = "Load";
		id = "Load";
		style.width = "50px";
		disabled = false;
		addEventListener("click", buttonClick);
	}

	// Create button for reading shown parameters
	btRead = document.createElement("button");
	with(btRead) {
		innerHTML = "Read";
		id = "Read";
		style.width = "50px";
		disabled = true;
		addEventListener("click", buttonClick);
	}
	
	// Create button for starting simulation
	btStart = document.createElement("button");
	with(btStart) {
		innerHTML = "Start";
		id = "Start";
		style.width = "50px";
		disabled = true;
		addEventListener("click", buttonClick);
	}
	
	// Create button for giving information
	btInfo = document.createElement("button");
	with(btInfo) {
		innerHTML = "Info";
		id = "Info";
		style.width = "50px";
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
		width = "200px";
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
	break;
	default:
	}
}


// Perform simulation
function simulate() {
	addText("He\n").to(taOut);
}


// Clear a Textarea
function clearText() {
	var result = {
		Of: function() {
			var ta = arguments[0];
			ta.value = "";
		}
	}
	return result;
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
	}
	return result;
}


// Get parameter value from a Textarea
function getValue() {
	var key = arguments[0];
	var result = {
		from: function() {
			var ta = arguments[0];
			
		}
	}
	return result;	
}