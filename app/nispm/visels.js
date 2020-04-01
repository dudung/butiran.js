/*
	visels.js
	Visual elements for JS UI on a browser.
	
	Sparisoma Viridi | https://github.com/dudung
	
	20200401
	1640 Create this first time for nispm.js in butiran app.	
	1755 Finish move function from nispm.js to here.
*/

// Create division
function createDivision() {
	var w = arguments[0];
	var h = arguments[1];
	var b = arguments[2];
	var f = arguments[3];
	var div = document.createElement("div");
	with(div.style) {
		width = w + "px";
		height = h + "px";
		border = b;
		float = f;
	}
	return div;
}


// Create canvas
function createCanvas() {
	var w = arguments[0];
	var h = arguments[1];
	var b = arguments[2];
	var f = arguments[3];
	
	var can = document.createElement("canvas");
	with(can) {
		width = w;
		height = h;
		with(style) {
			border = b;
			width = w + "px";
			height = h + "px";
			float = f;
		}
	}
	
	return can;
}


// Create textarea
function createTextarea() {
	var w = arguments[0];
	var h = arguments[1];
	var ta = document.createElement("textarea");
	with(ta.style) {
		width = w + "px";
		height = h + "px";
		overflowY = "scroll";
	}
	return ta;
}


// Create button
function createButton() {
	var cap = arguments[0];
	var w = arguments[1];
	var h = arguments[2];
	var e = arguments[3];
	var btn = document.createElement("button");
	with(btn) {
		innerHTML = cap;
		with(style) {
			width = w +  "px";
			height = h + "px";
		}
		addEventListener("click", e);
	}
	return btn;
}


// Set buttons state
function setButtonsState() {
	var btns = document.getElementsByTagName("button");
	var states = arguments[0];
	for(var i = 0; i < states.length; i++) {
		btns[i].disabled = !states[i];
	}
}

