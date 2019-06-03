/*
	script.js
	Draw and calculate position and direction of relected ray
	of a right angle prism in a common ATR setup
	Sparisoma Viridi and Hendro
	dudung@fi.itb.ac.id, hendro@fi.itb.ac.id
	20131010.1111
	
	20190603
	1226 Change script to mrtatrmjs to fit in butiran.js name
	convention.
*/

// Initialize canvas and its events
function initialize() {
	// Get element in this document
	var c = document.getElementById("canvas0");
	
	c.addEventListener("mousedown", function(evt) { 
		th_change(evt);
	}, false);
	
	draw();
}

// Transform real coordinates to screen coordinates
function xyr2s(xr, yr) {
	// Get width and height of canvas0
	var width = document.getElementById("canvas0").width;
	var height = document.getElementById("canvas0").height;
	
	// Define screen coordinates
	var xsmin = 0;
	var ysmin = height;
	var xsmax = width;
	var ysmax = 0;
	
	// Get radius of source and detector
	var R_S = document.getElementById("R_S").value;
	var R_D = document.getElementById("R_D").value;
	var rmax = 1.2 * Math.max(R_D, R_S);
	
	// Define real world coordinates
	var xrmin = -rmax;
	var yrmin = -rmax;
	var xrmax = rmax;
	var yrmax = rmax;
	
	// Do transformation
	var scalex = (xsmax - xsmin) / (xrmax - xrmin);
	var xs = (xr - xrmin) * scalex + xsmin;
	var scaley = (ysmax - ysmin) / (yrmax - yrmin);
	var ys = (yr - yrmin) * scaley + ysmin;
	
	// Return the results
	return {
		x: xs,
		y: ys,
	}
}

// Transform screen coordinates to real coordinates
function xys2r(xs, ys) {
	// Get width and height of canvas0
	var width = document.getElementById("canvas0").width;
	var height = document.getElementById("canvas0").height;
	
	// Define screen coordinates
	var xsmin = 0;
	var ysmin = height;
	var xsmax = width;
	var ysmax = 0;
	
	// Get radius of source and detector
	var R_S = document.getElementById("R_S").value;
	var R_D = document.getElementById("R_D").value;
	var rmax = 1.2 * Math.max(R_D, R_S);
	
	// Define real world coordinates
	var xrmin = -rmax;
	var yrmin = -rmax;
	var xrmax = rmax;
	var yrmax = rmax;
	
	// Do transformation
	var scalex = (xrmax - xrmin) / (xsmax - xsmin);
	var xr = (xs - xsmin) * scalex + xrmin;
	var scaley = (yrmax - yrmin) / (ysmax - ysmin);
	var yr = (ys - ysmin) * scaley + yrmin;
	
	// Return the results
	return {
		x: xr,
		y: yr,
	}
}

// Draw center of rotation
function draw_center(ctx) {
	var tr = xyr2s(0.0, 0.0);
	var x = tr.x;
	var y = tr.y;
	var r = 4;
	
	ctx.beginPath();
	ctx.setLineDash([0]);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
}

// Draw source position
function draw_source(ctx) {
	// Get data of source
	var R_S = document.getElementById("R_S").value;
	var theta_S = document.getElementById("theta_S").value;
	
	// Calculate position of source and draw it
	for(var i = 0; i < 4; i++) {
		var RR = R_S * (1 + 0.05 * i);
		var xr = RR * Math.cos(theta_S * Math.PI / 180);
		var yr = RR * Math.sin(theta_S * Math.PI / 180);
		var tr = xyr2s(xr, yr);
		var x = tr.x;
		var y = tr.y;
		var r = 4;
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 1;
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.stroke();
	}
	
	// Draw dashed line from source to center of rotation
	var tr1 = xyr2s(0.0, 0.0);
	var x1 = tr1.x;
	var y1 = tr1.y;
	ctx.beginPath();
	ctx.setLineDash([4, 4]);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FF0000";
	ctx.moveTo(x, y);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

// Draw detector position
function draw_detector(ctx) {
	// Get data of detector
	var R_D = document.getElementById("R_D").value;
	var theta_D = document.getElementById("theta_D").value;
	
	// Calculate position of detector and draw it
	for(var i = 0; i < 4; i++) {
		var RR = R_D * (1 + 0.05 * i);
		var xr = RR * Math.cos(theta_D * Math.PI / 180);
		var yr = RR * Math.sin(theta_D * Math.PI / 180);
		var tr = xyr2s(xr, yr);
		var x = tr.x;
		var y = tr.y;
		var r = 4;
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.strokeStyle = "#00DD00";
		ctx.lineWidth = 1;
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.stroke();
	}
	
	// Draw dashed line from detector to center of rotation
	var tr1 = xyr2s(0.0, 0.0);
	var x1 = tr1.x;
	var y1 = tr1.y;
	ctx.beginPath();
	ctx.setLineDash([4, 4]);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#009900";
	ctx.moveTo(x, y);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

// Draw right angle prism
function draw_prism(ctx) {
	// Get data of prism
	var t = document.getElementById("t").value;
	
	// Calculate position pE (east)
	var pE = xyr2s(t, 0);
	var xE = pE.x;
	var yE = pE.y;

	// Calculate position pS (south)
	var pS = xyr2s(0, -t);
	var xS = pS.x;
	var yS = pS.y;

	// Calculate position pN (north)
	var pN = xyr2s(0, t);
	var xN = pN.x;
	var yN = pN.y;

	// Draw lines to form a right angle prism
	ctx.beginPath();
	ctx.setLineDash([0]);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#FFAA00";
	ctx.moveTo(xN, yN);
	ctx.lineTo(xS, yS);
	ctx.lineTo(xE, yE);
	ctx.closePath();
	ctx.stroke();
	
	// Fill it
	ctx.fillStyle = "#E0E0FF";
	ctx.fill();
}

// Draw rays
function draw_rays(ctx) {
	// Get data of prism
	var t = document.getElementById("t").value;
	var n = document.getElementById("n").value;
	
	// Calculate position pE (east)
	var pE = xyr2s(t, 0);
	var xE = pE.x;
	var yE = pE.y;

	// Calculate position pS (south)
	var pS = xyr2s(0, -t);
	var xS = pS.x;
	var yS = pS.y;

	// Calculate position pN (north)
	var pN = xyr2s(0, t);
	var xN = pN.x;
	var yN = pN.y;
	
	// Get source position
	var R_S = document.getElementById("R_S").value;
	var theta_S = document.getElementById("theta_S").value;
	var xsr = R_S * Math.cos(theta_S * Math.PI / 180);
	var ysr = R_S * Math.sin(theta_S * Math.PI / 180);
	
	// Get detector position
	var R_D = document.getElementById("R_D").value;
	var theta_D = document.getElementById("theta_D").value;
	var xdr = R_D * Math.cos(theta_D * Math.PI / 180);
	var ydr = R_D * Math.sin(theta_D * Math.PI / 180);
	
	// Choose side of prism from source
	var NE = false;
	var SE = false;
	var W = false;
	if((xsr > 0) && (ysr > 0)) NE = true;
	if((xsr > 0) && (ysr < 0)) SE = true;
	if(xsr < 0) W = true;
	
	if(SE) {
		var rs = xyr2s(xsr, ysr);
		var x0 =  - t / (Math.tan(theta_S * Math.PI / 180) - 1);
		var y0 = x0 - t
		var r0 = xyr2s(x0, y0);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(rs.x, rs.y);
		ctx.lineTo(r0.x, r0.y);
		ctx.stroke();
		
		// Mark intersection point
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(r0.x, r0.y, 2, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.font = "normal 16px Times";
		ctx.fillStyle = "#000000";
		ctx.fillText("0", r0.x - 20, r0.y + 10);
		
		// Show coordinates
		var xx = Math.floor(x0 * 100.0) / 100;
		var yy = Math.floor(y0 * 100.0) / 100;
		document.getElementById("x0y0").value = "(" + xx + ", " + yy + ")";
		
		// Apply Snell's law on SE surface
		var theta_nSE = 0.25 * Math.PI + 0.5 * Math.PI;
		var theta_iSE = theta_nSE - (theta_S * Math.PI / 180);
		var theta_fSE = Math.asin(Math.sin(theta_iSE) / n);
		
		// Calculate equation y1 = m1 * x1 + (y - m1 * x)
		var m1 = Math.tan(theta_nSE + theta_fSE);
		var x1 = 0.0;
		var y1 = y0 - m1 * x0;
		var r1 = xyr2s(x1, y1);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r0.x, r0.y);
		ctx.lineTo(r1.x, r1.y);
		ctx.stroke();
		
		// Mark intersection point
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(r1.x, r1.y, 2, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.font = "normal 16px Times";
		ctx.fillStyle = "#000000";
		ctx.fillText("1", r1.x - 20, r1.y);
		
		// Show coordinates
		var xx = Math.floor(x1 * 100.0) / 100;
		var yy = Math.floor(y1 * 100.0) / 100;
		document.getElementById("x1y1").value = "(" + xx + ", " + yy + ")";
		
		// Apply Snell's law on W surface
		var theta_nW = 0.5 * Math.PI - 0.5 * Math.PI;
		var theta_iW = theta_nW + (theta_nSE + theta_fSE);
		var theta_fW = -theta_iW;
		
		// Calculate equation y2 = m2 * x + y1
		var m2 = -Math.tan(theta_nW - theta_fW);
		var x2 = (t - y1) / (1 + m2);
		var y2 = m2 * x2 + y1;
		var r2 = xyr2s(x2, y2);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r1.x, r1.y);
		ctx.lineTo(r2.x, r2.y);
		ctx.stroke();
		
		// Mark intersection point
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(r2.x, r2.y, 2, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.font = "normal 16px Times";
		ctx.fillStyle = "#000000";
		ctx.fillText("2", r2.x - 5, r2.y - 10);
		
		// Show coordinates
		var xx = Math.floor(x2 * 100.0) / 100;
		var yy = Math.floor(y2 * 100.0) / 100;
		document.getElementById("x2y2").value = "(" + xx + ", " + yy + ")";
		
		// Apply Snell's law on NE surface
		var theta_nNE = -0.25 * Math.PI + 0.5 * Math.PI;
		var theta_iNE = theta_nNE - theta_fW;
		var theta_fNE = Math.asin(Math.sin(theta_iNE) * n);
		
		// Calculate equation y = m3 * x + (y3 - m3 * x3)
		var m3 = Math.tan(theta_nNE + theta_fNE);
		var x3 = x2;
		var y3 = y2;
		var th3 = Math.atan(m3);
		if(th3 < 0.25 * Math.PI) {
			x3 = R_D * Math.cos(th3);
			y3 = m3 * x3 + (y2 - m3 * x2);
		} else {
			y3 = R_D * Math.sin(th3);
			x3 = (y3 - y2 + m3 * x2) / m3;
		}
		var r3 = xyr2s(x3, y3);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r2.x, r2.y);
		ctx.lineTo(r3.x, r3.y);
		ctx.stroke();
		
		// Show value of refracted angle
		var thDD = 90 - (theta_nNE - theta_fNE) * 180 / Math.PI;
		thDD = 0.01 * Math.round(thDD * 100);
		document.getElementById("theta_D_").value = thDD;
		
		// Draw unrefracted ray
		var th3_ = Math.atan(m2);
		var x3_ = x2;
		var y3_ = y2;
		if(th3_ > 0.25 * Math.PI) {
			y3_ = R_D * Math.sin(th3);
			x3_ = (y3_ - y1) / m2;
		} else {
			x3_ = R_D * Math.cos(th3);
			y3_ = m2 * x3_ + y1;
		}
		var r3_ = xyr2s(x3_, y3_);

		ctx.beginPath();
		ctx.setLineDash([4, 4]);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r2.x, r2.y);
		ctx.lineTo(r3_.x, r3_.y);
		ctx.stroke();
		
	}
	
	if(NE) {
		var rs = xyr2s(xsr, ysr);
		var x0 =  t / (Math.tan(theta_S * Math.PI / 180) + 1);
		var y0 = Math.tan(theta_S * Math.PI / 180) * x0;
		var r0 = xyr2s(x0, y0);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(rs.x, rs.y);
		ctx.lineTo(r0.x, r0.y);
		ctx.stroke();
		
		// Mark intersection point
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(r0.x, r0.y, 2, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.font = "normal 16px Times";
		ctx.fillStyle = "#000000";
		ctx.fillText("0", r0.x - 20, r0.y + 10);
		
		// Show coordinates
		var xx = Math.floor(x0 * 100.0) / 100;
		var yy = Math.floor(y0 * 100.0) / 100;
		document.getElementById("x0y0").value = "(" + xx + ", " + yy + ")";
		
		// Apply Snell's law on NE surface
		var theta_nNE = -0.25 * Math.PI - 0.5 * Math.PI;
		var theta_iNE = theta_nNE - (theta_S * Math.PI / 180);
		var theta_fNE = Math.asin(Math.sin(theta_iNE) / n);
		
		// Calculate equation y1 = m1 * x1 + (y - m1 * x)
		var m1 = Math.tan(theta_nNE + theta_fNE);
		var x1 = 0.0;
		var y1 = y0 - m1 * x0;
		var r1 = xyr2s(x1, y1);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r0.x, r0.y);
		ctx.lineTo(r1.x, r1.y);
		ctx.stroke();
		
		// Mark intersection point
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(r1.x, r1.y, 2, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.font = "normal 16px Times";
		ctx.fillStyle = "#000000";
		ctx.fillText("1", r1.x - 20, r1.y);
		
		// Show coordinates
		var xx = Math.floor(x1 * 100.0) / 100;
		var yy = Math.floor(y1 * 100.0) / 100;
		document.getElementById("x1y1").value = "(" + xx + ", " + yy + ")";
		
		// Apply Snell's law on W surface
		var theta_nW = 0.5 * Math.PI - 0.5 * Math.PI;
		var theta_iW = theta_nW + (theta_nNE + theta_fNE);
		var theta_fW = -theta_iW;
		
		// Calculate equation y2 = m2 * x + y1
		var m2 = -Math.tan(theta_nW - theta_fW);
		//var x2 = (t + y1) / (1 - m2);
		//var y2 = m2 * x2 + y1;
		var y2 = (y1 + m2 * t) / (1 - m2);
		var x2 = (y2 - y1) / m2;
		var r2 = xyr2s(x2, y2);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r1.x, r1.y);
		ctx.lineTo(r2.x, r2.y);
		ctx.stroke();
		
		// Mark intersection point
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(r2.x, r2.y, 2, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.font = "normal 16px Times";
		ctx.fillStyle = "#000000";
		ctx.fillText("2", r2.x - 5, r2.y - 10);
		
		// Show coordinates
		var xx = Math.floor(x2 * 100.0) / 100;
		var yy = Math.floor(y2 * 100.0) / 100;
		document.getElementById("x2y2").value = "(" + xx + ", " + yy + ")";
		
		// Apply Snell's law on SE surface
		var theta_nSE = 0.25 * Math.PI + 0.5 * Math.PI;
		var theta_iSE = theta_nSE - theta_fW;
		var theta_fSE = Math.asin(Math.sin(theta_iSE) * n);
		
		// Calculate equation y = m3 * x + (y3 - m3 * x3)
		var m3 = Math.tan(theta_nSE - theta_fSE);
		var x3 = x2;
		var y3 = y2;
		var th3 = Math.atan(m3);
		if(th3 > -0.25 * Math.PI) {
			x3 = R_D * Math.cos(th3);
			y3 = m3 * x3 + (y2 - m3 * x2);
		} else {
			y3 = R_D * Math.sin(th3);
			x3 = (y3 - y2 + m3 * x2) / m3;
		}
		var r3 = xyr2s(x3, y3);
		
		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r2.x, r2.y);
		ctx.lineTo(r3.x, r3.y);
		ctx.stroke();
		
		// Show value of refracted angle
		var thDD = 180 - (theta_nSE - theta_fSE) * 180 / Math.PI;
		thDD = -0.01 * Math.round(thDD * 100);
		document.getElementById("theta_D_").value = thDD;
		
		// Draw unrefracted ray
		var th3_ = Math.atan(m2);
		var x3_ = x2;
		var y3_ = y2;
		if(th3_ < -0.25 * Math.PI) {
			y3_ = R_D * Math.sin(th3);
			x3_ = (y3_ - y1) / m2;
		} else {
			x3_ = R_D * Math.cos(th3);
			y3_ = m2 * x3_ + y1;
		}
		var r3_ = xyr2s(x3_, y3_);

		ctx.beginPath();
		ctx.setLineDash([4, 4]);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#FF0000";
		ctx.moveTo(r2.x, r2.y);
		ctx.lineTo(r3_.x, r3_.y);
		ctx.stroke();
	}
}

// Draw base
function draw_base(ctx) {
	// Define base size
	var lx = 5;
	var ly = 50;
	
	var topleft = xyr2s(-1.0 * lx, 0.5 * ly);
	var bottomright = xyr2s(0, -0.5 * ly);
	var width = bottomright.x - topleft.x;
	var height = bottomright.y - topleft.y;
	
	ctx.beginPath();
	ctx.fillStyle = "#F9F9F9";
	ctx.fillRect(topleft.x, topleft.y, width, height);
	ctx.strokeStyle = "#909090";
	ctx.setLineDash([0]);
	ctx.strokeRect(topleft.x, topleft.y, width, height);
}


// Draw all system
function draw() {
	// Get element in this document
	var c = document.getElementById("canvas0");
	
	// Get object for drawing on
	var ctx = c.getContext("2d");
		
	// Clear canvas0
	ctx.clearRect(0, 0, c.width, c.height);
	
	// Draw system components
	draw_base(ctx);
	draw_prism(ctx);
	draw_center(ctx);
	draw_source(ctx);
	//draw_detector(ctx);
	
	// Draw rays
	draw_rays(ctx);
}

function th_change(evt) {
	// Get mouse position as it downs
	var offX = document.getElementById("canvas0").getBoundingClientRect().left;
	var offY = document.getElementById("canvas0").getBoundingClientRect().top;
	var xy = xys2r(evt.clientX - offX, evt.clientY - offY);
	var x = xy.x;
	var y = xy.y;
	
	var th = 0;
	if(x != 0) {
		th = Math.atan(y/x) * 180 / Math.PI;
		th = Math.round(th);
	} else {
		th = 90;
	}
	
	if(x < 0) {
		if(y > 0) {
			th = th + 180;
		} else {
			th = th - 180;
		}
	}
	
	var R_S = document.getElementById("R_S").value;
	var R_D = document.getElementById("R_D").value;
	var R_mid = 0.5 * (parseFloat(R_S) + parseFloat(R_D));
	var r = Math.sqrt(x*x + y*y);
	
	if(r >= R_mid) {
		document.getElementById("theta_S").value = th;
	} else {
		document.getElementById("theta_D").value = th;
	}
	
	draw();
}

// Increase value of theta_S
function thS_up() {
	// Get current value and change it
	var thS = document.getElementById("theta_S").value;
	thS = parseInt(thS) + 1;
	if(thS > 359) {thS -= 360};
	document.getElementById("theta_S").value = thS;
	
	// Draw the change
	draw();
}

// Decrease value of theta_S
function thS_down() {
	// Get current value and change it
	var thS = document.getElementById("theta_S").value;
	thS = parseInt(thS) - 1;
	if(thS < -359) {thS += 360};
	document.getElementById("theta_S").value = thS;
	
	// Draw the change
	draw();
}

// Increase value of theta_D
function thD_up() {
	// Get current value and change it
	var thD = document.getElementById("theta_D").value;
	thD = parseInt(thD) + 1;
	if(thD > 359) {thD -= 360};
	document.getElementById("theta_D").value = thD;
	
	// Draw the change
	draw();
}

// Decrease value of theta_D
function thD_down() {
	// Get current value and change it
	var thD = document.getElementById("theta_D").value;
	thD = parseInt(thD) - 1;
	if(thD < -359) {thD += 360};
	document.getElementById("theta_D").value = thD;
	
	// Draw the change
	draw();
}

function dec(id) {
	var val = document.getElementById(id).value;
	val = parseInt(val) - 1;
	document.getElementById(id).value = val;

	// Draw the change
	draw();
}

function inc(id) {
	var val = document.getElementById(id).value;
	val = parseInt(val) + 1;
	document.getElementById(id).value = val;
	
	// Draw the change
	draw();
}