/*
	simlttcg.js
	Simulation of laser tracing through transparent cylindrical
	grain
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180509
	Start this simulation with still using canvas coordinates
	(not real world coordinates).
	
	20190603
	1418 Reformat for joining butiran.js with new name
	convention.
*/

// Create canvas element
var can = document.createElement("canvas");
can.width = "600";
can.style.width = "600px";
can.height = "220";
can.style.background = "#eee";
can.id = "drawingBoard";

// Create textarea element
var ta = document.createElement("textarea");
ta.style.overflowY = "scroll";
ta.style.width = "110px";
ta.style.height = "214px";

// Create div element
var div = document.createElement("div");
div.style.width = (parseInt(can.style.width) + 6
	+ parseInt(ta.style.width)) + "px";
div.style.border = "0px solid black";

// Create button element
var btn = document.createElement("button");
btn.innerHTML = "Start";
btn.addEventListener("click", buttonClick);

// Create step right button element
var btnR = document.createElement("button");
btnR.innerHTML = ">";
btnR.addEventListener("click", buttonRClick);

// Create step left button element
var btnL = document.createElement("button");
btnL.innerHTML = "<";
btnL.addEventListener("click", buttonLClick);

// Set document layout
document.body.appendChild(div);
	div.appendChild(can);
	div.appendChild(ta);
	div.appendChild(btnL);
	div.appendChild(btn);
	div.appendChild(btnR);

// Define global variables
var proc;
var M = 8;
var ws = 10;
var w = 200;
var l = 600;
var D = 100;
var x = 0.5 * l - 0.55 * D;
var y = 0.35 * w;
var xs = 0.5 * l;
var ys = w + ws;
var n = 1.5;
var dx = 1;

// Execute something after button is clicked
function buttonClick() {
	var target = window.event.target;
	var caption = target.innerHTML;
	if(caption == "Start") {
		caption = "Stop";
		proc = setInterval(simulate, 10);
	} else {
		caption = "Start";
		clearInterval(proc);
	}
	target.innerHTML = caption;
}

// Execute something after button step right is clicked
function buttonRClick() {
	dx = 1;
	simulate();
	dx = 1;
}

// Execute something after button step left is clicked
function buttonLClick() {
	dx = -1;
	simulate();
	dx = 1;
}

// Clear canvas
function clearCanvas(id) {
	var c = document.getElementById(id);
	var cx = c.getContext("2d");
	var w = c.width;
	var h = c.height;
	cx.clearRect(0, 0, w, h);
}

// Draw light source
function drawLightSource(id) {
	var c = document.getElementById(id);
	var cx = c.getContext("2d");
	var L = c.width;
	var W = c.height;
	var dL = L / 2;
	cx.beginPath();
	cx.fillStyle = "#fff";
	cx.strokeStyle = "#000";
	for(var i = 0; i < 2; i++) {
		var j = i + 1;
		var x = (j - 0.5) * dL;
		var y = 0.5 * ws;
		cx.fillRect(x - 0.5 * dL, W - ws + y - 0.5 * ws, dL, ws);
		cx.rect(x - 0.5 * dL, W - ws + y - 0.5 * ws, dL, ws);
	}
	cx.stroke();
	cx.closePath();
}

// Draw sensors
function drawSensors(id, N) {
	var c = document.getElementById(id);
	var cx = c.getContext("2d");
	var L = c.width;
	var dL = L / N;
	cx.beginPath();
	cx.fillStyle = "#fff";
	cx.strokeStyle = "#000";
	for(var i = 0; i < N; i++) {
		var j = i + 1;
		var x = (j - 0.5) * dL;
		var y = 0.5 * ws;
		cx.fillRect(x - 0.5 * dL, y - 0.5 * ws, dL, ws);
		cx.rect(x - 0.5 * dL, y - 0.5 * ws, dL, ws);
	}
	cx.stroke();
	cx.closePath();
}

// Draw TCG
function drawTCG(id, x, y, D) {
	var c = document.getElementById(id);
	var cx = c.getContext("2d");
	var L = c.width;
	cx.beginPath();
	cx.arc(x, y, 0.5 * D, 0, 2 * Math.PI);
	cx.strokeStyle = "#000";
	cx.stroke();
	cx.fillStyle = "#fff";
	cx.fill();
	cx.closePath();
	
	// Draw other object for PBC
	if(x < D) {
		cx.beginPath();
		cx.strokeStyle = "#000";
		cx.arc(L + x, y, 0.5 * D, 0, 2 * Math.PI);
		cx.stroke();
		cx.fillStyle = "#fff";
		cx.fill();
		cx.closePath();
	}
	if(x > L - D) {
		cx.beginPath();
		cx.strokeStyle = "#000";
		cx.arc(x - L, y, 0.5 * D, 0, 2 * Math.PI);
		cx.stroke();
		cx.fillStyle = "#fff";
		cx.fill();
		cx.closePath();
	}
}

// Draw laser beam
function drawLaser(id, xs, ys, x) {
	
	var j = -100;

	var c = document.getElementById(id);
	var cx = c.getContext("2d");
	var L = c.width;
	if(
		x <= 0.5 * L - 0.5 * D ||
		x == 0.5 * L ||
		x >= 0.5 * L + 0.5 * D
	) {
		var xj = xs;
		var yj = ws;
		cx.beginPath();
		cx.strokeStyle = "#f00";
		cx.moveTo(xs, ys);
		cx.lineTo(xj, yj);
		cx.stroke();
		cx.closePath();
	}
	
	if(0.5 *(L - D) < x && x < 0.5 * L) {
		var xin = xs;
		var temp1 = 0.25 * D * D;
		var temp2 = (xin - x) * (xin - x);
		var yin = y + Math.sqrt(temp1 - temp2);
		
		var rs = new Vect3(xs, ys, 0);
		var rin = new Vect3(xin, yin, 0);
		var ri = new Vect3(x, y, 0);
		var ui = (Vect3.sub(rin, rs)).unit();
		var un = (Vect3.sub(rin, ri)).unit();
		
		var idotn = -Vect3.dot(ui, un);
		var idotn2 = idotn * idotn;
		var sinqr = Math.sqrt(1 - idotn2) / n;
		var sinqr2 = sinqr * sinqr;
		var cosqr = Math.sqrt(1 - sinqr2);
		
		var ux = new Vect3(1, 0, 0);
		var uy = new Vect3(0, -1, 0); // Due to canvas coordinates
		var uz = new Vect3(0, 0, 1);
		
		var urx = Vect3.mul(-cosqr, un);
		var ury = Vect3.mul(sinqr, Vect3.cross(un, uz));
		var ur = Vect3.add(urx, ury);
		
		var rdotn = Vect3.dot(ur, un);
		
		var beta = Math.PI - 2 * Math.acos(rdotn);
		var lc = D * Math.sin(beta) / (2 * sinqr);
		
		var ndotx = Vect3.dot(un, ux);
		var rdotx = Vect3.dot(ur, ux);
		var ndoty = Vect3.dot(un, uy);
		var rdoty = Vect3.dot(ur, uy);
		
		// Due to canvas coordinates
		var xout = x - 0.5 * D * ndotx + lc * rdotx;
		var yout = y - 0.5 * D * ndoty + lc * rdoty;
		
		var cosqi_ = cosqr;
		var cosqi_2 = cosqi_ * cosqi_;
		var sinqi_ = Math.sqrt(1 - cosqi_2);
		var sinqr_ = n * sinqi_;
		var sinqr_2 = sinqr_ * sinqr_;
		var cosqr_ = Math.sqrt(1 -  sinqr_2);
		
		var rout = new Vect3(xout, yout, 0);
		var un_ = (Vect3.sub(rout, ri)).unit();

		var zcrossn_ = Vect3.cross(uz, un_)
		var ur_ = Vect3.add(
			Vect3.mul(cosqr_, un_),
			Vect3.mul(sinqr, zcrossn_)
		);
		
		var tanqout = ur_.y / ur_.x;
		var yj = ws;
		var xj = xout - (yj - yout) / tanqout;
		
		cx.beginPath();
		cx.strokeStyle = "#f00";
		cx.moveTo(xs, ys);
		cx.lineTo(xin, yin);
		cx.lineTo(xout, yout);
		cx.lineTo(xj, yj);
		cx.stroke();
		cx.closePath();
		
		j = 1 + Math.floor(xj / (l / M));
	}

	if(0.5 * L < x && x < 0.5 *(L + D)) {
		var xin = xs;
		var temp1 = 0.25 * D * D;
		var temp2 = (xin - x) * (xin - x);
		var yin = y + Math.sqrt(temp1 - temp2);
		
		var rs = new Vect3(xs, ys, 0);
		var rin = new Vect3(xin, yin, 0);
		var ri = new Vect3(x, y, 0);
		var ui = (Vect3.sub(rin, rs)).unit();
		var un = (Vect3.sub(rin, ri)).unit();
		
		var idotn = -Vect3.dot(ui, un);
		var idotn2 = idotn * idotn;
		var sinqr = Math.sqrt(1 - idotn2) / n;
		var sinqr2 = sinqr * sinqr;
		var cosqr = Math.sqrt(1 - sinqr2);
		
		var ux = new Vect3(1, 0, 0);
		var uy = new Vect3(0, -1, 0); // Due to canvas coordinates
		var uz = new Vect3(0, 0, 1);
		
		var urx = Vect3.mul(cosqr, un); // Different than line 222
		var ury = Vect3.mul(sinqr, Vect3.cross(un, uz));
		var ur = Vect3.add(urx, ury);
		
		var rdotn = Vect3.dot(ur, un);
		
		var beta = Math.PI - 2 * Math.acos(rdotn);
		var lc = D * Math.sin(beta) / (2 * sinqr);
		
		var ndotx = Vect3.dot(un, ux);
		var rdotx = Vect3.dot(ur, ux);
		var ndoty = Vect3.dot(un, uy);
		var rdoty = Vect3.dot(ur, uy);
		
		// Due to canvas coordinates
		var xout = x - 0.5 * D * ndotx + lc * rdotx;
		var yout = y - 0.5 * D * ndoty + lc * rdoty;
		
		var cosqi_ = cosqr;
		var cosqi_2 = cosqi_ * cosqi_;
		var sinqi_ = Math.sqrt(1 - cosqi_2);
		var sinqr_ = n * sinqi_;
		var sinqr_2 = sinqr_ * sinqr_;
		var cosqr_ = Math.sqrt(1 -  sinqr_2);
		
		var rout = new Vect3(xout, yout, 0);
		var un_ = (Vect3.sub(rout, ri)).unit();

		var zcrossn_ = Vect3.cross(uz, un_)
		var ur_ = Vect3.add(
			Vect3.mul(-cosqr_, un_), // Different than line 251
			Vect3.mul(sinqr, zcrossn_)
		);
		
		var tanqout = ur_.y / ur_.x;
		var yj = ws;
		var xj = xout - (yj - yout) / tanqout;
		
		cx.beginPath();
		cx.strokeStyle = "#f00";
		cx.moveTo(xs, ys);
		cx.lineTo(xin, yin);
		cx.lineTo(xout, yout);
		cx.lineTo(xj, yj);
		cx.stroke();
		cx.closePath();
		
		j = 1 + Math.floor(xj / (l / M));
	}
	
	var sbin = "00000000";
	if(0 < j && j <= M) {
		
		var bin = "";
		for(var ii = 0; ii < M; ii++) {
			bin = (ii == j) ? bin + "1" : bin + "0";
		}
		sbin = bin;
	}
	var sint = parseInt(sbin, 2);
	ta.value += sbin + " " + sint + "\n";
	ta.scrollTop = ta.scrollHeight;
}

// Perform simulation
function simulate() {
	// Set periodic boundary condition
	var L = can.width;
	if(x >= L) {
		x -= L;
	}
	x += dx;
	
	// Draw anything
	clearCanvas("drawingBoard");
	drawSensors("drawingBoard", M);
	drawLightSource("drawingBoard");
	drawTCG("drawingBoard", x, y, D);
	drawLaser("drawingBoard", xs, ys, x);
}

// Initiate simulation
function initiate() {
	clearCanvas("drawingBoard");
	drawSensors("drawingBoard", M);
	drawLightSource("drawingBoard");
	drawTCG("drawingBoard", x, y, D);
	drawLaser("drawingBoard", xs, ys, x);
}
initiate();
