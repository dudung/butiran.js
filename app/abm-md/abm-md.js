/*
	amb-md.js
	Agent-based model (ABM) and molecular dynamics (MD) method
	
	Sparisoma Viridi | https://github.com/dudung/abm-x
	
	20200616
	2020 Start from abm-sir app as base.
	2024 Move library from libs to libs/abm.
	2015 Copy libs/md from butiran.js, not adjusted yet.
	2044 Change to bgColor for ocean style.
	20200618
	2244 Rename main to main2 for archive only.
	20200619
	0515 Create clear function for Canvas and TextArea elements.
	0707 Draw grid on a Canvas element.
	0720 Create getValueOf to get params from input TextArea.
	0733 Fix return value of getValueOf function.
	0821 Use alert box.
	0825 Create empty event for all buttons.
	0843 Create tx and ty for coordinates transformation.
	0900 Can draw nanopattern but only zigzag.
	0926 Can draw nanowells and nanopillars.
	0950 Can draw empty space using abm matrix.
	1015 Renamae drawNanopattern to createNanopattern.
	1023 Make new drawNanopattern.
	1031 Correct createNanopattern without on(can).
	1039 Problem get certain grid from nano pattern.
	1113 Can draw per gridSize.
	1130 Finallya can draw right matrix for nanopattern.
	1139 Can draw single cell above substrat.
	1232 Set ytop for stem cell.
	20200620
	1051 Continue again.
	1105 Add grain to store granular cells.
	1628 Try to make substrateOverlapWith function.
	1648 Still problem with the function.
	1741 Work but old problem normal force.
	1800 Fix problem by negative root in circle equation.
	1826 Change color for float and static states.
	1922 Design deposition sites code.
	20200621
	0525 Force collide to stop program for debugging.
	0539 Find problem by collide.
	0548 Found, isolated the problem, should return new Vect3.
	0600 Show particles id.
	0612 Can show collided grid.
	0628 Try to introduce normal force from collided grid.
	0649 Force in x ok, but not in y.
	0801 Good only when grid at right, at left does not work.
	1606 Set option for grid and nanopattern.
	1627 Create test parameters.
	1658 Create drawArrows.
	1914 Create test 01.
	1916 Integrate arrow, collided grid to grain for debugging.
	2034 Can draw arrow and arc as part of grain.
	2044 Change test 01 and can draw force direction.
	2058 Change test 01 and try to record first data.
	2103 Oscillate and float by test 01, normal force wrong.
	
	References
	1. url https://stackoverflow.com/a/57474962/9475509
	2. url https://stackoverflow.com/a/58833088/9475509
	3. url https://www.w3schools.com/jsref/met_win_alert.asp
	   [20200619].
	4. url https://stackoverflow.com/a/43363105/9475509
	5. url https://www.w3schools.com/tags/canvas_textalign.asp
	   [20200621].
	6. url https://stackoverflow.com/a/52968208/9475509
*/


// Define global variabels
var backgroundColor, borderColor, fontColor;
var btnLoad, btnRead, btnStart, btnSave, btnAbout, btnHelp;
var taIn, taOut, can;
var um2px;
var proc, iter, iterMax, gridSize;
var Ncell, Dcell, Lcell, Hnpat, Wnpat, world, depoSite;
var XMIN, YMIN, XMAX, YMAX, xmin, ymin, xmax, ymax;
var grain, nanopattern;
var Grav, Norm, Visc;
var STOP, DRAW_GRID_LAST, DRAW_NANOPATTERN;
var STOP_WHEN_COLLIDING;

var testNum = "01";

// Perform some 
function performTest() {
	var tnum = arguments[0];
	var str;
	switch(tnum) {
	case "00": str = `
ITERTIME 0,1000
GRIDSIZE 8
CELLDIAM 3
CELLSNUM 2,1
CELLSSEP 1,1
NPHEIGHT 1,7
NPWIDTHX 6,2
DEPOSITE 0,0,0,0,0,0,7,7
`;break;
	case "01": str = `
ITERTIME 0,5000
GRIDSIZE 16
CELLDIAM 3
CELLSNUM 1
CELLSSEP 1,1
NPHEIGHT 1,2,3
NPWIDTHX 5,1,1
DEPOSITE 0,0,0
`;break;
	}
	
	line = str.split("\n");
	line.pop();
	line.shift();
	str = line.join("\n");
	addLine(str).to(taIn);
	
	btnRead.disabled = false;
}


// Call main function
main();


// Define main function
function main() {
	initParams();
	
	[
		btnLoad, btnRead, btnStart, btnSave, btnAbout, btnHelp,
		taIn, taOut,
		can
	] = createElements();
	
	performTest(testNum);
	
	btnLoad.addEventListener("click", function() {
		loadParams();
		btnRead.disabled = false;
	});
	
	btnRead.addEventListener("click", function() {
		readParams();
		clear(can);

		var x, y;
		[x, y] = createNanopattern(Wnpat, Hnpat);
		nanopattern = {x: x, y: y};
		
		addPatternBelow(x, y).to(world);
		addDepositionSites(depoSite).to(world);
		
		paintMatrix(world).onCanvas("can");
		if(!DRAW_GRID_LAST) {
			drawGrid((gridSize * um2px) + "px", "#f0f0ff").on(can);
		}
		
		grain = createStemCells(Dcell, Ncell, Lcell)
		drawStemCells(grain).on(can);
		
		if(DRAW_GRID_LAST) {
			drawGrid((gridSize * um2px) + "px", "#f0f0ff").on(can);
		}
		if(DRAW_NANOPATTERN) {
			drawNanopattern(nanopattern.x, nanopattern.y).on(can);
		}
		
		Grav = new Gravitational();
		Grav.setField(new Vect3(0, -10, 0));
		
		Norm = new Normal();
		Norm.setConstants(1E4, 2);
		
		Visc = new Drag();
		Visc.setConstants(0, 0.1, 0);
		
		btnStart.disabled = false;
	});
	
	btnStart.addEventListener("click", function() {
		if(btnStart.innerHTML == "Start") {
			btnStart.innerHTML = "Stop";
			btnLoad.disabled = true;
			btnRead.disabled = true;
			btnAbout.disabled = true;
			btnHelp.disabled = true;
			taIn.disabled = true;
			
			proc = setInterval(simulate, 100);
			
		} else {
			btnStart.innerHTML = "Start";
			btnLoad.disabled = false;
			btnRead.disabled = false;
			btnAbout.disabled = false;
			taIn.disabled = false;
			btnHelp.disabled = false;
			
			clearInterval(proc);
		}
	});
	
	btnSave.addEventListener("click", function() {
	});
	
	btnAbout.addEventListener("click", function() {
		alert(
			"abm-md | About\n" + 
			"Version 20200620\n" +
			"Sparisoma Viridi | https://github.com/dudung/abm-x"
		);
	});
	
	btnHelp.addEventListener("click", function() {
		alert(
			"abm-md | Help\n" +
			"Use available buttons"
		);
	});
}


// Simulate
function simulate() {
	paintMatrix(world).onCanvas("can");
	if(!DRAW_GRID_LAST) {
		drawGrid((gridSize * um2px) + "px", "#f0f0ff").on(can);
	}
	
	var N = grain.length;
	var SF = [];
	for(var i = 0; i < N; i++) {
		var F = new Vect3();
		
		var Fg = Grav.force(grain[i]);
		F = Vect3.add(F, Fg);
		
		for(var j = 0; j < N; j++) {
			if(i != j) {
				var Fn = Norm.force(grain[i], grain[j]);
				F = Vect3.add(F, Fn);
			}
		}
		
		var Fd = Visc.force(grain[i]);
		F = Vect3.add(F, Fd);
		
		var Fn = collide(grain[i], world, 0);
		F = Vect3.add(F, Fn);
		
		SF.push(F);
	}
	
	drawStemCells(grain).on(can);
	
	addLine(
		iter + "\t" +
		grain[0].r.x.toFixed(2) + "\t" + 
		grain[0].r.y.toFixed(2) + "\t" + 
		grain[0].v.x.toFixed(2) + "\t" + 
		grain[0].v.y.toFixed(2) + "\n"
	).to(taOut);
	
	var dt = 0.02;
	
	for(var i = 0; i < N; i++) {
		if(grain[i].state == "float") {
			var a = Vect3.div(SF[i], grain[i].m);
					
			var v = grain[i].v;
			v = Vect3.add(v, Vect3.mul(a, dt));
			grain[i].v = v;
			
			var r = grain[i].r;
			r = Vect3.add(r, Vect3.mul(v, dt));
			grain[i].r = r;
			
			var isOverlap = false;
			isOverlap = depoSiteOverlapWith(grain[i], 4);
			if(isOverlap == true) {
				grain[i].state = "static";
			}
		}
	}
		
	if(DRAW_GRID_LAST) {
		drawGrid((gridSize * um2px) + "px", "#f0f0ff").on(can);
	}
	if(DRAW_NANOPATTERN) {
		drawNanopattern(nanopattern.x, nanopattern.y).on(can);
	}
	
	
	if(iter >= iterMax || STOP) {
		btnStart.innerHTML = "Start";
		btnStart.disabled = true;
		btnLoad.disabled = false;
		btnRead.disabled = false;
		btnAbout.disabled = false;
		taIn.disabled = false;
		btnHelp.disabled = false;
		
		clearInterval(proc);
	}
	
	if(STOP) {
		paintMatrix(world).onCanvas("can");
		drawGrid((gridSize * um2px) + "px", "#f0f0ff").on(can);
		drawStemCells(grain).on(can);
		if(DRAW_NANOPATTERN) {
			drawNanopattern(nanopattern.x, nanopattern.y).on(can);
		}
	}
	
	iter++;
}


// Collide grain with world of certain type
function collide() {
	var g = arguments[0];
	var w = arguments[1];
	var t = arguments[2];
	
	var Fn = new Vect3();

	var N = 20;
	var xc = g.r.x;
	var yc = g.r.y;
	var R = 0.5 * g.D;

	g.arc = [];
	g.grid = [];
	g.arrow = [];
	
	var dq = 2 * Math.PI / N;
	for(var i = 0; i < N; i++) {
		var qi = i * dq;
		var xi = xc + R * Math.cos(qi);
		var yi = yc + R * Math.sin(qi);
		
		var col = Math.floor(xi / gridSize);
		var row = Math.floor(yi / gridSize);
		var ROWS = w.m.length;
		var COLS = w.m[0].length;
		var row_ = ROWS - 1 - row;

		var m = w.m[row_][col];
		if(m == t) {
			if(!STOP_WHEN_COLLIDING) {
				STOP = true;
			}
			var msg = ""
				+ "iter=" + iter + " "
				+ "grain[" + g.i + "] grid["
				+ row_ + "][" + col + "]";
			//addLine(msg + " ").to(taOut);
			
			//w.m[row_][col] = 14;
			g.grid.push([row_, col]);  // Not yet implemented
			
			g.arc.push([xi, yi]);
		}
	}
	
	// Calculate average of overlap arc
	var xmid = 0;
	var ymid = 0;
	for(var i = 0; i < g.arc.length; i++) {
		xmid += g.arc[i][0];
		ymid += g.arc[i][1];
	}
	xmid /= g.arc.length;
	ymid /= g.arc.length;
	g.arrow.push([xmid, ymid, xc, yc]);
	
	// Use midpoint to calculate repulsion force
	var ri = new Vect3(xc, yc, 0);
	var rj = new Vect3(xmid, ymid, 0);
	var rij = Vect3.sub(ri, rj);
	var nij = rij.unit();
	var lij = rij.len();
	
	// Should be dependent on overlap
	var l = 0;
	if(xmid != 0 && ymid != 0) {
		var l = Math.max(0, R - lij);
	}
	
	var k = 100;
	Fn = Vect3.mul(k, nij);
	//console.log(nij);
	
	// It should return (0, 0, 0) for debugging.
	return Fn;
}


// Draw arrows for debugging
function drawArrows() {
	var arr = arguments[0];
	var o = {
		on: function() {
			var can = arguments[0];
			
			var cx = can.getContext("2d");
			cx.strokeStyle = "#f00";
			cx.lineWidth = 2;
			cx.beginPath();
			for(var i = 0; i < arr.length; i++) {
				var ar = arr[i];
				cx.moveTo(tx(ar[0]), ty(ar[1]));
				cx.lineTo(tx(ar[2]), ty(ar[3]));
			}
			cx.stroke();
		}
	};
	return o;
}


// Check whether stem cell overlap with deposition site
function depoSiteOverlapWith() {
	var g = arguments[0];
	var t = arguments[1];
	var ov = false;	
	
	var N = 20;
	var xc = g.r.x;
	var yc = g.r.y;
	var R = 0.5 * g.D;
	var dx = 2 * R / N;
	var xmin = xc - R;
	for(var i = 0; i <= N; i++) {
		var xi = xmin + dx * i
		var x2 = (xi - xc) * (xi - xc)
		var y2 = Math.abs(R * R - x2);
		var yi = yc - Math.sqrt(y2);
		
		var col = Math.floor(xi / gridSize);
		var row = Math.floor(yi / gridSize);
		var ROWS = world.m.length;
		var COLS = world.m[0].length;
		if(col > COLS) col = COLS - 1;
		
		var w = 1;
		if(row < ROWS) {
			w = world.m[ROWS - 1 - row][col];
		} else {
			console.log(row, yi, y2);
		}
		
		if(w == t) {
			ov = true;
			return ov;
		}
	}
	
	return ov;
}


// Load default parameters to input TextArea
function loadParams() {
	clear(taIn);
	addLine("ITERTIME 0,1000\n").to(taIn);
	addLine("GRIDSIZE 5\n").to(taIn);
	addLine("CELLDIAM 4\n").to(taIn);
	addLine("CELLSNUM 2\n").to(taIn);
	addLine("CELLSSEP 1,1\n").to(taIn);
	addLine("NPHEIGHT 1,7\n").to(taIn);
	addLine("NPWIDTHX 6,2\n").to(taIn);
	addLine("DEPOSITE 0,0,0,0,0,0,7,7").to(taIn);
}


// Read params from input TextArea
function readParams() {
	var it = getValueOf("ITERTIME").from(taIn);
	iter = it[0];
	iterMax = it[1];
	
	gridSize = getValueOf("GRIDSIZE").from(taIn)[0];
	
	Ncell = getValueOf("CELLSNUM").from(taIn);
	Dcell = getValueOf("CELLDIAM").from(taIn);
	Lcell = getValueOf("CELLSSEP").from(taIn);
	Hnpat = getValueOf("NPHEIGHT").from(taIn);
	Wnpat = getValueOf("NPWIDTHX").from(taIn);
	depoSite = getValueOf("DEPOSITE").from(taIn);
	
	XMIN = 0;
	XMAX = can.width;
	YMIN = can.height;
	YMAX = 0;

	xmin = XMIN / um2px;
	ymin = YMAX / um2px;
	xmax = XMAX / um2px;
	ymax = YMIN / um2px;
	
	var ROWS = ymax / gridSize;
	var COLS = xmax / gridSize;
	world = new Matrix(ROWS, COLS, 1);   // 1 = empty space
	matrixPixelSize = gridSize * um2px;  // Change grid size
}


// Create stem cells
function createStemCells() {
	var D = arguments[0] * gridSize;
	var N = arguments[1];
	var L = arguments[2];
	
	var Lx = L[0] * gridSize;
	var Ly = L[1] * gridSize;
	
	var xmid = 0.5 * (xmin + xmax);
	var ytop = ymax - gridSize - 0.5 * D;
	var R = 0.5 * (tx(D) - tx(0));
	
	var grain = [];
	var id = 0;
	for(var j = 0; j < N.length; j++) {
		var LLx = (N[j] - 1) * (D + Lx);
		
		for(var i = 0; i < N[j]; i++) {
			var x = (xmid - 0.5 * LLx) + i * (D + Lx);
			var y = ymax - gridSize - 0.5 * D - j * (D + Ly);
			
			var g = new Grain();
			g.r = new Vect3(x, y, 0);
			g.m = 1;
			g.D = D;
			g.v = new Vect3(0, 0, 0);
			g.i = id++;
			
			g.state = "float";
			g.arc = [];
			g.grid = [];
			g.arrow = [];
			
			grain.push(g);
		}
	}

	return grain;
}


// Draw stem cells
function drawStemCells() {
	var g = arguments[0];
	var N = g.length;
	
	var o = {
		on: function() {
			var el = arguments[0];
			var cx = el.getContext("2d");
			
			for(var i = 0; i < N; i++) {
				var D = g[i].D;
				var R = 0.5 * (tx(D) - tx(0));
				
				var x = g[i].r.x;
				var y = g[i].r.y;
				
				var X = tx(x);
				var Y = ty(y);
				
				if(g[i].state == "float") {
					cx.strokeStyle  = "#0c0";
					cx.fillStyle  = "#8f8";
				} else {
					cx.strokeStyle  = "#cc0";
					cx.fillStyle  = "#ff8";
				}
				
				cx.lineWidth = 4;
				cx.beginPath();
				cx.arc(X, Y, R, 0, 2 * Math.PI);
				cx.stroke();
				
				cx.lineWidth = 2;
				cx.beginPath();
				cx.arc(X, Y, R, 0, 2 * Math.PI);
				cx.fill();
				
				cx.font = "10px arial";
				cx.textAlign = "center";
				cx.textBaseline = "middle";
				cx.beginPath();
				cx.fillStyle = "#000";
				cx.fillText(g[i].i, X, Y);
				cx.closePath();
				
				cx.beginPath();
				cx.lineWidth = 2;
				cx.strokeStyle = "#f00";
				for(var j = 0; j < g[i].arc.length; j++) {
					var xx = g[i].arc[j][0];
					var yy = g[i].arc[j][1];
					if(j == 0) {
						cx.moveTo(tx(xx), ty(yy));
					} else {
						cx.lineTo(tx(xx), ty(yy));
					}
				}
				cx.stroke();
				
				if(g[i].arrow.length > 0) {
					var xT = g[i].arrow[0][0];
					var yT = g[i].arrow[0][1];
					var xH = g[i].arrow[0][2];
					var yH = g[i].arrow[0][3];
					
					var hS = Math.sqrt(
						(xH - xT) * (xH - xT) + (yH - yT) * (yH - yT)
					);
					var aHS = 0.4 * hS;
					
					var dq = Math.PI / 6;
					var q = Math.atan((yH - yT) / (xH - xT));
					var s = 1;
					if(xH - xT >= 0) {
						s = -1;
					}
					var qL = q - dq;
					var qR = q + dq;
					
					var xL = xH + s * aHS * Math.cos(qL);
					var yL = yH + s * aHS * Math.sin(qL);
					var xR = xH + s * aHS * Math.cos(qR);
					var yR = yH + s * aHS * Math.sin(qR);
					
					cx.beginPath();
					cx.lineWidth = 2;
					cx.strokeStyle = "#f00";
					cx.moveTo(tx(xT), ty(yT));
					cx.lineTo(tx(xH), ty(yH));
					cx.lineTo(tx(xL), ty(yL));
					cx.moveTo(tx(xH), ty(yH));
					cx.lineTo(tx(xR), ty(yR));
					cx.stroke();
				}
				
			}
		}
	};
	
	return o;
}


// Add pattern below array of x and y
function addPatternBelow() {
	var xx = arguments[0];
	var yy = arguments[1];
	var N = xx.length;
	var ROWS = world.m.length;
	
	var o = {
		to: function() {
			var m = arguments[0];
			
			for(var i = 0; i < N; i++) {
				
				if(
					i >= 0 &&
					(xx[i + 1] != xx[i]) &&
					i < N - 1
				) {
					var x = xx[i];
					var col = (x - xmin) / gridSize;
					
					var y = yy[i];
					var row = (y - ymin) / gridSize;
					
					m.setRows(ROWS - row, ROWS-1).cols(col, col).to(0);
				}				
			}
		}
	};
	
	return o;
}


// Add deposition sites
function addDepositionSites() {
	var site = arguments[0];
	var w;
	
	var o = {
		to: function() {
			w = arguments[0];
			var M = site.length;
			var ROWS = w.m.length;
			var COLS = w.m[0].length;
			var j = 0;
			for(var i = 0; i < COLS; i++) {
				if(j > M - 1) j = 0;
				
				if(site[j] > 0) {
					w.m[ROWS - site[j]][i] = 4;
				}
				
				j++;
			}
		}
	};
	
	/*
	*/
	
	return o;
}


// Transform x to X
function tx() {
	var x = arguments[0];
	var X = (x - xmin) / (xmax - xmin);
	X *= (XMAX- XMIN);
	X += XMIN;
	return X;
}


// Transform y to Y
function ty() {
	var y = arguments[0];
	var Y = (y - ymin) / (ymax - ymin);
	Y *= (YMAX- YMIN);
	Y += YMIN;
	return Y;
}


// Get value of pattern from a TextArea
function getValueOf() {
	var pattern = arguments[0];
	var o = {
		from: function() {
			var el = arguments[0];
			var val;;
			
			var lines = el.value.split("\n");
			var N = lines.length;
			if(lines[N - 1].length == 0) {
				lines.pop();
				N = lines.length;
			}
			for(var i = 0; i < N; i++) {
				var cols = lines[i].split(" ");
				var M = cols.length;
				for(var j = 0; j < M; j++) {
					if(cols[0] == pattern) {
						var arr = cols[1].split(",");
						val = arr.map(e => parseFloat(e));
						break;
					}
				}
			}
			return val;
		}
	};
	
	/*
	var x = getValueOf("XRANGE").from(taIn);
	*/
	
	return o;
}


// Draw nanopattern
function drawNanopattern() {
	var x = arguments[0];
	var y = arguments[1];
	var N = x.length;
	
	var o = {
		on: function() {
			var el = arguments[0];
			var cx = el.getContext("2d");
			
			cx.strokeStyle = "#f00";
			cx.lineWidth = 2;
			cx.beginPath();
			
			for(var i = 0; i < N; i++) {
				
				var X = tx(x[i]);
				var Y = ty(y[i]);
				
				if(i == 0) {
					cx.moveTo(X, Y);
				} else {
					cx.lineTo(X, Y);
				}
			}
			cx.stroke();
		}
	};
	
	return o;
}


// Create nanopattern
function createNanopattern() {
	var w = arguments[0];
	var h = arguments[1];
	var Nw = w.length;
	
	var xxx = [];
	var yyy = [];
	
	var dx = w.reduce((a, b) => a + b, 0) * gridSize;
	
	var N = (xmax - xmin) / dx;
	for(var i = 0; i < N; i++) {
		var x = xmin + i * dx + gridSize;
		for(var j = 0; j < Nw; j++) {
			x -= gridSize;
			
			for(var k = 0; k <= w[j]; k++) {
				xxx.push(x);
				yyy.push(ymin + h[j] * gridSize);
				
				x += gridSize;
			}			
		}
	}
	
	return [xxx, yyy];
}

// Draw square grid with certain size
function drawGrid() {
	var l = parseInt(arguments[0]);
	var c = arguments[1];
	var o = {
		on: function() {
			var can = arguments[0];
			var w = can.width;
			var h = can.height;
			var Nx = w / l;
			var Ny = h / l;
			
			var cx = can.getContext("2d");
			cx.strokeStyle = c;
			cx.lineWidth = 1;
			
			for(var j = 0; j < Ny; j++) {
				for(var i = 0; i < Nx; i++) {
					var x = i * l;
					var y = j * l;
					cx.beginPath();
					cx.rect(x, y, x + l, y + l);
					cx.stroke();
				}
			}
		}
	};
	
	/*
	drawGrid("10px", "#e0e0ff").on(can);
	*/
	
	return o;
}


// Add a line to a TextArea element
function addLine() {
	var line = arguments[0];
	var o = {
		to: function() {
			var el = arguments[0];
			el.value += line;
			el.scrollTop = el.scrollHeight;
		}
	};
	
	/*
	addLine("ITERTIME 1000\n").to(taIn);
	*/
	
	return o;
}


// Intialize parameters
function initParams() {
	backgroundColor = "#fff";
	borderColor = "#aae";
	fontColor = "#00f";
	
	/*
		width = 800 px = 400 µm
		1 = 2 (px / µm)
		
		cell = 20 µm = 40 px
		grid = 10 px
	*/
	um2px = 2;
	
	STOP = false;
	DRAW_GRID_LAST = true;
	DRAW_NANOPATTERN = false;
	STOP_WHEN_COLLIDING = true;
}


// Create required HTML DOM elements
function createElements() {
	var elems = [];
	
	var div0 = document.createElement("div");
	div0.style.width = "800px";
	div0.style.height = "240px";
	div0.style.border = "1px solid " + borderColor;
	div0.style.borderBottom = "0px solid " + borderColor;
	div0.style.background = backgroundColor;
	
	var can = document.createElement("canvas");
	can.width = 800;
	can.height = 240;
	can.style.width = can.width + "px";
	can.style.height = can.height + "px";
	can.id = "can";
	
	var div1 = document.createElement("div");
	div1.style.width = "802px";
	div1.style.height = "124px";
	div1.style.border = "0px solid " + borderColor;
	div1.style.background = backgroundColor;
	
	var taIn = document.createElement("textarea");
	taIn.style.width = "300px";
	taIn.style.height = "122px";
	taIn.style.overflowY = "scroll";
	taIn.style.border = "1px solid " + borderColor;
	taIn.style.background = backgroundColor;
	taIn.style.float = "left"
	
	var div2 = document.createElement("div");
	div2.style.width = "60px";
	div2.style.height = "126px";
	div2.style.border = "1px solid " + borderColor;
	div2.style.background = backgroundColor;
	div2.style.float = "left"

	var taOut = document.createElement("textarea");
	taOut.style.width = "428px";
	taOut.style.height = "122px";
	taOut.style.overflowY = "scroll";
	taOut.style.border = "1px solid " + borderColor;
	taOut.style.background = backgroundColor;
	taOut.style.float = "left"
	
	var btnLoad = document.createElement("button");
	btnLoad.innerHTML = "Load";
	btnLoad.style.width = "60px";
	btnLoad.disabled = false;
	
	var btnRead = document.createElement("button");
	btnRead.innerHTML = "Read";
	btnRead.style.width = "60px";
	btnRead.disabled = true;
	
	var btnStart = document.createElement("button");
	btnStart.innerHTML = "Start";
	btnStart.style.width = "60px";
	btnStart.disabled = true;

	var btnSave = document.createElement("button");
	btnSave.innerHTML = "Save";
	btnSave.style.width = "60px";
	btnSave.disabled = true;

	var btnAbout = document.createElement("button");
	btnAbout.innerHTML = "About";
	btnAbout.style.width = "60px";
	btnAbout.disabled = false;
	
	var btnHelp = document.createElement("button");
	btnHelp.innerHTML = "Help";
	btnHelp.style.width = "60px";
	btnHelp.disabled = false;

	document.body.append(div0);
		div0.append(can);
	document.body.append(div1);
		div1.append(taIn);
		div1.append(div2);
			div2.append(btnLoad);
			div2.append(btnRead);
			div2.append(btnStart);
			div2.append(btnSave);
			div2.append(btnAbout);
			div2.append(btnHelp);
		div1.append(taOut);

	elems.push(btnLoad);
	elems.push(btnRead);
	elems.push(btnStart);
	elems.push(btnSave);
	elems.push(btnAbout);
	elems.push(btnHelp);
	elems.push(taIn);
	elems.push(taOut);
	elems.push(can);
	
	return elems;
}


// Clear Canvas and TextArea elements
function clear() {
	var el = arguments[0];
	if( el instanceof HTMLCanvasElement) {
		var cx = el.getContext("2d");
		cx.beginPath();
		cx.clearRect(0, 0, el.width, el.height);
		cx.fill();
	}
	if(el instanceof HTMLTextAreaElement) {
		el.value = "";
	}

	/*
	var cx = can.getContext("2d");
	cx.beginPath();
	cx.fillRect(0, 0, 800, 200);
	cx.fill();
	
	clear(can);
	*/
}




// Define main2 function -- archive for easier editing
function main2() {
	var div0 = document.createElement("div");
	div0.style.width = "556px";
	div0.style.height = "367px";
	div0.style.border = "1px solid #88f";
	div0.style.background = "#eee";
	div0.style.float = "left";
	div0.style.border = "1px solid #00f";
	document.body.append(div0);
		
	var div1 = document.createElement("div");
	div1.style.width = "552px";
	div1.style.fontFamily = "Monospace";
	div1.style.letterSpacing = "normal";
  div1.style.wordSpacing = "0px";
	div1.style.fontSize = "13.3333px";
  div1.style.fontStretch = "normal";
  div1.style.border = "1px solid #008";	
  div1.style.color = "#fff";	
  div1.style.background = "#00a";	
	div1.style.fontWeight = 400;
	div1.style.paddingLeft = "2px";
	div1.innerHTML = "ITR "
		+ "C0S C0I C0R C0N "
		+ "C1S C1I C1R C1N "
		+ "C2S C2I C2R C2N "
		+ "C3S C3I C3R C3N "
		+ "CAN";
	div0.append(div1);
	
	txa1 = document.createElement("textarea");
	txa1.style.width = "550px";
	txa1.style.height = "4.4em";
	txa1.style.overflowY = "scroll";
	txa1.style.border = "1px solid #00f";
	txa1.style.background = bgColor;
	div0.append(txa1);
	
	var div2 = document.createElement("div");
	div2.style.width = "552px";
	div2.style.fontFamily = "Monospace";
	div2.style.letterSpacing = "normal";
  div2.style.wordSpacing = "0px";
	div2.style.fontSize = "13.3333px";
  div2.style.fontStretch = "normal";
  div2.style.border = "1px solid #009";	
  div2.style.color = "#fff";	
  div2.style.background = "#00a";	
	div2.style.fontWeight = 400;
	div2.style.paddingLeft = "2px";
	div2.innerHTML = "AID "
		+ "SUS INF REC IBA HIS";
	div0.append(div2);
	
	txa2 = document.createElement("textarea");
	txa2.style.width = "550px";
	txa2.style.height = "11.4em";
	txa2.style.overflowY = "scroll";
	txa2.style.overflowX = "scroll";
	txa2.style.whiteSpace = "nowrap";
	txa2.style.border = "1px solid #00f";
	txa2.style.background = bgColor;
	div0.append(txa2);
	
	var div3 = document.createElement("div");
	div3.style.width = "552px";
	div3.style.fontFamily = "Monospace";
	div3.style.letterSpacing = "normal";
  div3.style.wordSpacing = "0px";
	div3.style.fontSize = "13.3333px";
  div3.style.fontStretch = "normal";
  div3.style.border = "1px solid #008";	
  div3.style.color = "#fff";	
  div3.style.background = "#00a";	
	div3.style.fontWeight = 400;
	div3.style.paddingLeft = "2px";
	div3.innerHTML = "PARAMETR "
		+ "VALUE";
	div0.append(div3);
	
	var txa3 = document.createElement("textarea");
	txa3.style.width = "480px";
	txa3.style.height = "78px";
	div0.append(txa3);
	txa3.value = "SCENARIO 0\n"
		+ "HEALTIME 14\n"
		+ "ITERTIME 300\n"
		+ "INFAGENT 0\n"
		+ "RECAGENT 1,2,11,12,13,22,23,24";
	txa3.style.overflowY = "scroll";
	txa3.style.border = "1px solid #00f";
	txa3.style.background = bgColor;
	
	canId = "can0";
	var can = document.createElement("canvas");
	can.id = canId;
	can.width = 245 * 1.5;
	can.height = 245 * 1.5;
	can.style.width = can.width + "px";
	can.style.height = can.height + "px";
	can.style.border = "1px solid #44f";
	can.style.background = bgColor;
	document.body.append(can);
	
	// Default value is 10 with w = 500, h = 500
	matrixPixelSize = 5 * 1.5;
	
	var divBtn = document.createElement("div");
	divBtn.style.width = "70px";
	divBtn.style.float = "right";
	div0.append(divBtn);
	
	btn0 = document.createElement("button");
	btn0.innerHTML = "Read";
	btn0.style.width = "70px";
	divBtn.append(btn0);
	
	btn0.addEventListener("click", function() {
		// Define world
		world = new Matrix(49, 49, 1);
		
		// Define border -- actually not necessary
		world.setCol(0).to(0);
		world.setRow(0).to(0);
		world.setCol(48).to(0);
		world.setRow(48).to(0);
		
		iter = 0;

		var temp = getValueFromTextarea("ITERTIME", txa3);
		iterMax = parseInt(temp);

		var temp = getValueFromTextarea("SCENARIO", txa3);
		var dataSetId = parseInt(temp);
		if(dataSetId > 10) {
			console.log("WARNING: dataSetId > 10 will be set to 0");
		}
		
		var temp = getValueFromTextarea("HEALTIME", txa3);
		var healingTime = parseInt(temp);
		
		var temp = getValueFromTextarea("INFAGENT", txa3);
		var infagent = temp.split(",").map(i => parseInt(i));
		
		var temp = getValueFromTextarea("RECAGENT", txa3);
		var recagent = temp.split(",").map(i => parseInt(i));
		
		txa1.value = "";
		txa2.value = "";
		
		initialize(dataSetId, healingTime, infagent, recagent);
		
		btn.disabled = false;
		btn2.disabled = true;
	});

	btn = document.createElement("button");
	btn.innerHTML = "Start";
	btn.style.width = "70px";
	btn.disabled = true;
	divBtn.append(btn);
	
	btn.addEventListener("click", function() {
		var e = arguments[0];
		var t = e.target;
		console.log(t.innerHTML);
		if(t.innerHTML == "Start") {
			proc = setInterval(
				function() { 
					simulate(
						agent, road, city, 
						world, "can0") 
				},
				10
			);
			
			t.innerHTML = "Stop";
			btn0.disabled = true;
		} else {
			clearInterval(proc);
			t.innerHTML = "Start";
			btn0.disabled = false;
		}
	});
	
	btn2 = document.createElement("button");
	btn2.innerHTML = "Save";
	btn2.style.width = "70px";
	btn2.disabled = true;
	divBtn.append(btn2);
	
	btn2.addEventListener("click", function() {
		var params = txa3.value;
		var outCity = txa1.value;
		var outAgent = txa2.value;

		var sdt = new Date();
		var dd = sdt.getDate();
		var mm = ("0" + (sdt.getMonth() + 1)).slice(-2);
		var yyyy = sdt.getYear() + 1900;
		var HH = ("0" + sdt.getHours()).slice(-2);
		var MM = ("0" + sdt.getMinutes()).slice(-2);
		var SS = ("0" + sdt.getSeconds()).slice(-2);
		var datetime = yyyy + "-" + mm + "-" + dd + " " +
			HH + ":" + MM + ":" + SS;
		
		var fn = yyyy + "-" + mm + "-" + dd + "-" +
			HH + "-" + MM + "-" + SS;

		var content = "" +
			"# abm-sir\n" +
			"Output of `abm-sir` as part of [`abm-x`]" +
			"(https://github.com/dudung/abm-x)\n" +
			"\n" +
			"## Parameter\n```\n" +
			div3.innerHTML + "\n" +
			params +
			"\n```\n\n" +
			"## City\n" +
			"![](" + fn + ".png)\n\n```\n" +
			div1.innerHTML + "\n" +
			outCity +
			"\n```\n\n" +
			"## Agent\n```\n" +
			div2.innerHTML  + "\n" +
			outAgent +
			"\n```\n\n" +
			"## Note\n" +
			"Created on " + datetime;

		// Solution 0 -- only view the result
		/*
		console.log(content);
		*/
		
		/*
		// Solution 1 -- can not change filename
		var uriContent = "data:application/octet-stream," + 	
			encodeURIComponent(content);
		newWindow = window.open(uriContent, 'neuesDokument');
		*/
		
		/*
		// Solution 2 -- can not save new window
		var nw = window.open("");
		var div = document.createElement("pre");
		div.innerHTML = content;
		nw.document.body.append(div);
		*/
		
		// Solution 3 -- it works [12], even without append to body
		var nw = window.open("");
		var uriContent = "data:application/octet-stream," + 	
			encodeURIComponent(content);
		var a = document.createElement("a");
		nw.document.body.append(a);
		a.download = fn + ".md";
		a.href = uriContent;
		a.click();
		nw.close();
		
		var can = document.getElementById("can0");
		var a = document.createElement("a");
		a.download = fn + ".png";
		a.href = can.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");
		a.click();
		
		var ldir = "file:///C:/Users/Sparisoma%20Viridi/Downloads/";
		var ffn = ldir + fn + ".md";
		setTimeout(function() {	var nw2 = window.open(ffn); }, 2000);
		
	});
	
	btn1 = document.createElement("button");
	btn1.innerHTML = "About";
	btn1.style.width = "70px";
	divBtn.append(btn1);
	
	btn1.addEventListener("click", function() {
		alert(
			"abm-md (version 20200616)\n" +
			"Sparisoma Viridi | https://github.com/dudung"
		);
	});

	can.addEventListener("click", function() {
		/*
		var e = arguments[0];
		var t = e.target;
		var x = e.offsetX;
		var y = e.offsetY;
		
		var dx = matrixPixelSize;
		var dy = matrixPixelSize;
		
		var c = Math.floor(x / dx);
		var r = Math.floor(y / dy);
		if(world != undefined) {
			world.m[r][c] = 1;
		}
		
		paintMatrix(world).onCanvas(canId);
		*/
	});
}


// Initialize
function initialize() {
	var dataSetId = arguments[0];
	var healingTime = arguments[1];
	var infagent = arguments[2];
	var recagent = arguments[3];
	
	// Select case according to dataSetId
	world.setRow(24).to(0);
	world.setCol(24).to(0);
	
	if(dataSetId < 6) {
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < dataSetId; j++) {
				world.m[24][3 + i * 5 + j] = 1;
				world.m[3 + i * 5 + j][24] = 1;
				world.m[24][45 - (i * 5 + j)] = 1;
				world.m[45 - (i * 5 + j)][24] = 1;
			}
		}
	} else if(dataSetId < 11) {
		for(var i = 0; i < 4; i++) {
			var jMax = dataSetId - 5;
			for(var j = 0; j < jMax; j++) {
				world.m[24][3 + i * 5 + j] = 1;
				world.m[24][45 - (i * 5 + j)] = 1;
				world.m[45 - (i * 5 + j)][24] = 1;
			}
		}
	} else {
	}
	
	// Define cities region
	city = [];
	createAllCities();
	
	// Define roads
	road = [];
	createAllRoads();
	
	// Create agents of type Agent, typeS
	agent = [];
	createAllAgents(healingTime);
	
	// Set origin infection agent
	/*
	oiAgent = 0;
	agent[oiAgent].setInfected(iter);
	*/
	for(var i = 0; i < infagent.length; i++) {
		var id = infagent[i];
		agent[id].setInfected(iter);
	}
	
	// Set origin recovered agent
	for(var i = 0; i < recagent.length; i++) {
		var id = recagent[i];
		agent[id].setInfected(iter);
		agent[id].setRecovered(iter);
	}
	
	// Display agents
	var N = agent.length;
	for(var i = 0; i < N; i++) {
		agent[i].paint();
	}
	
	// Paint the matrix on canvas
	paintMatrix(world).onCanvas(canId);
}


// Simulate --> rename to 2
function simulate2() {
	var a = arguments[0];
	var r = arguments[1];
	var c = arguments[2];
	var w = arguments[3];
	var id = arguments[4];
	
	for(var i = 0; i < a.length; i++) {
		a[i].moveOnRoad(r);
		a[i].checkCity(c, iter);
		a[i].heal(iter);
		a[i].spreadInfection(iter, a);
	}
	paintMatrix(w).onCanvas(id);
	
	for(var i = 0; i < c.length; i++) {
		c[i].calcSIR(iter, a);
	}
	
	/*
	var str = iter + "\n";
	for(var i = 0; i < agent.length; i++) {
		str += ("0" + i).slice(-2) + " | ";
		str += agent[i].visitedCity + " | ";
		str += agent[i].visitedIter + "\n";
	}
	txa.value = str;
	*/
	
	var N = 0;
	var str = iter.toString().padStart(3, "0") + " ";
	for(var i = 0; i < city.length; i++) {
		var lastS = city[i].S[city[i].S.length - 1];
		var lastI = city[i].I[city[i].I.length - 1];
		var lastR = city[i].R[city[i].R.length - 1];
		var lastN = city[i].N[city[i].N.length - 1];
		
		N += lastN;
		
		str += lastS.toString().padStart(3, "0") + " ";
		str += lastI.toString().padStart(3, "0") + " ";
		str += lastR.toString().padStart(3, "0") + " ";
		str += lastN.toString().padStart(3, "0") + " ";
	}
	str += N.toString().padStart(3, "0");
	if(iter > 0) txa1.value += "\n";
	txa1.value += str;
	txa1.scrollTop = txa1.scrollHeight;
	
	if(iter >= iterMax) {
		for(var i = 0; i < agent.length; i++) {
			var iba = agent[i].infectedByAgent;
			for(var j = 0; j < agent.length; j++) {
				if(iba == -1) {
					break;
				} else if(iba === agent[i].id) {
					agent[i].chainInfection.push(
						iba.toString().padStart(3, "0")
					);
					break;
				} else if(iba == agent[i].chainInfection[agent[i].
					chainInfection.length -1]) {
					break;
				} else {
					agent[i].chainInfection.push(
						iba.toString().padStart(3, "0")
					);
				}
				iba = agent[iba].infectedByAgent;
			}
		}
	}
	
	var str = "";
	for(var i = 0; i < agent.length; i++) {
		str += agent[i].id.toString().padStart(3, "0");
		str += " ";
		
		var sus = agent[i].timeSusceptible.toString()
			.padStart(3, "0");
		str += sus;
		str += " ";
		
		var inf = agent[i].timeInfected.toString()
			.padStart(3, "0");
		if(inf == "0-1") inf = "-01";
		str += inf;
		str += " ";
		
		var rec = agent[i].timeRecovered.toString()
			.padStart(3, "0");
		if(rec == "0-1") rec = "-01";
		str += rec;
		str += " ";
		
		var iba = agent[i].infectedByAgent.toString()
			.padStart(3, "0");
		if(iba == "0-1") iba = "-01";
		str += iba;
		str += " ";
		
		str += agent[i].chainInfection.join("-");
		
		if(i < agent.length - 1) str += "\n";
	}
	txa2.value = str;
	
	iter++;
	if(iter > iterMax) {
		clearInterval(proc);
		btn.innerHTML = "Start";
		btn.disabled = true;
		btn0.disabled = false;
		btn2.disabled = false;
	}
}


// Create all agents
function createAllAgents() {
	var healingTime = arguments[0];

	// Create of agent in NW region, typeS
	var xmin = 2;
	var xmax = 23;
	var dx = 2;
	var ymin = 2;
	var ymax = 23;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
	
	// Create of agent in NE region, typeS
	var xmin = 26;
	var xmax = 47;
	var dx = 2;
	var ymin = 2;
	var ymax = 23;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
	
	// Create of agent in SW region, typeS
	var xmin = 2;
	var xmax = 23;
	var dx = 2;
	var ymin = 26;
	var ymax = 47;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
	
	// Create of agent in SE region, typeS
	var xmin = 26;
	var xmax = 47;
	var dx = 2;
	var ymin = 26;
	var ymax = 47;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
}	

	
// Create all roads
function createAllRoads() {
}


// Create all cities
function createAllCities() {
	// Define NW city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([01, 01, 23, 23]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);

	// Define NE city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([25, 01, 47, 23]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);
	
	// Define SW city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([01, 25, 23, 47]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);
	
	// Define SE city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([25, 25, 47, 47]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);
}


// Get value from textarea -- note different format
function getValueFromTextarea() {
	var pattern = arguments[0];
	var txa = arguments[1];
	var val = "";
	var lines = txa.value.split("\n");
	for(var i = 0; i < lines.length; i++) {
		var cols = lines[i].split(" ");
		if(cols[0] == pattern) {
			val = cols[1];
			break;
		}
	}
	return val;
}