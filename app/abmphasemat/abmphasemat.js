/*
	abmphasemat.js
	Simulate phase change of materials using ABM
	
	Sparisoma Viridi | dudung@gmail.com
	
	20181116
	Start this program.
	20181117
	Get information that updating agen using for will
	segregate them to a certain direction.
	Solve the problem by creating moveParticles2 function.
	Create moveParticlesWithDirProbs function.
	20181118
	Continue improving the code and move from HTML to JS,
	which is called from index.html file.
	Clear comments and not working functions.
	Rename all modified functions to original ones for better
	readable code.
	Create some phases of materials.
	Finish about 19 different phases at 1612.
	20181119
	Use this program to produce manuscript figures.
	20181120
	Change name to ab_phasemat according to name convention of
	butiran project and push it to github.com/dudung/butiran.
	Modify policy to publish JS file instead of HTML file.
	20191211
	Change ab_phasemat to abmphasemat and integrate to
	butiran.js in GitHub.
*/

// Generate integer random number in [min, max]
function randInt(min, max) {
	var x = Math.random() * (max + 1 - min) + min;
	var y = Math.floor(x);
	return y;
}

// Check uniformity of generated number
function checkRandomDist() {
	var N = 10;
	var dist = [];
	dist.length = N;
	dist.fill(0);
	
	var min = 0;
	var max = 9;
	var M = 10000;
	for(var i = 0; i < M; i++) {
		var gen = randInt(min, max);
		dist[gen]++;
	}
	for(var i = 0; i < N; i++) {
		dist[i] = dist[i] / M;
	}
	
	return(dist);
}

// Create zero matrix with dimension rows x cols
function createZeroMatrix(rows, cols) {
	var m = [];
	for(var r = 0; r < rows; r++) {
		var row = [];
		for(var c = 0; c < cols; c++) {
			row.push(0);
		}
		m.push(row);
	}
	return m;
}

// Create initial random position in binary matrix
function fillParticle(xmin, ymin, xmax, ymax, N, mat) {
	var j = 0;
	for(var i = 0; i < N; i++) {
		var x = randInt(xmin, xmax);
		var y = randInt(ymin, ymax);
		if(mat[y][x] == 0) {
			mat[y][x] = 1;
			j++;
		}
	}
	return j;
}

// Create border with value -1
function createBorder(M) {
	var rSize = M.length;
	var cSize = M[0].length;
	for(var y = 0; y < rSize; y++) {
		M[y][0] = -1;
		M[y][cSize - 1] = -1;
	}
	for(var x = 0; x < cSize; x++) {
		M[0][x] = -1;
		M[rSize - 1][x] = -1;
	}
}

// Function draw a matrix on a canvas
function drawMatrixOnCanvas(M, id) {
	var can = document.getElementById(id);
	var ctx = can.getContext("2d");
	var rSize = M.length;
	var cSize = M[0].length;
	for(var y = 0; y < rSize; y++) {
		for(var x = 0; x < cSize; x++) {
			if(M[y][x] >= 0) {
				var r = (1 - M[y][x]) * 255;
				var g = (1 - M[y][x]) * 255;
				var b = (1 - M[y][x]) * 255;
				ctx.fillStyle = "rgb("
					+ r + ", "
					+ g + ", "
					+ b + ")";
				ctx.fillRect(x, y, 1, 1);
			} else {
				var borderColor = "#abc";
				var r = 100;
				var g = 19;
				var b = 255;
				ctx.fillStyle = borderColor;
				ctx.fillRect(x, y, 1, 1);
			}
		}
	}
}

// Get direction from direction probability
function getDirFromProb(prob) {
	var dx = 0;
	var dy = 0;
	
	var N = prob.length;
	var upper = [];
	upper.length = N;
	
	for(var i = 0; i < N; i++) {
		upper[i] = 0;
		for(var j = 0; j < i + 1; j++) {
			upper[i] += prob[j];
		}
	}
	
	var r = Math.random();
	
	var n = -1;
	for(var i = 0; i < N; i++) {
		if(r < upper[i]) {
			n = i;
			break;
		}
	}
	
	switch(n) {
	case 0: dx = 0; dy = 1; break;
	case 1: dx = 1; dy = 1; break;
	case 2: dx = 1; dy = 0; break;
	case 3: dx = 1; dy = -1; break;
	case 4: dx = 0; dy = -1; break;
	case 5: dx = -1; dy = -1; break;
	case 6: dx = -1; dy = 0; break;
	case 7: dx = -1; dy = 1; break;
	}
	
	return {x: dx, y: dy};
}

// Move particles with some direction probabilities
function moveParticlesWithDirProbs(M, dirProb) {
	var NR = Math.sqrt(dirProb.length);
	
	var rSize = M.length;
	var cSize = M[0].length;
	var Mi = rSize * cSize;
	for(var i = 0; i < Mi; i++) {
		
		var y = randInt(0, rSize - 1);
		var x = randInt(0, cSize - 1);
		
		var src = M[y][x];
		if(src != -1 && src != 0) {
			
			var xGrid = cSize / NR;
			var yGrid = rSize / NR;
			
			var ry = Math.floor(y / xGrid);
			var rx = Math.floor(x / xGrid);
			var r = ry * NR + rx;
			
			var dir = dirProb[r];
			
			var randDir = getDirFromProb(dir);
			var dx = randDir.x;
			var dy = -randDir.y;
			
			if(y + dy >= 0 && y + dy < rSize &&
				x + dx >= 0 && x + dx < cSize) {
				var dest = M[y + dy][x + dx];
				if(dest == 0) {
					M[y + dy][x + dx] = 1;
					M[y][x] = 0;
				}
			}
		}
	}
}

// Create directional fluid flow probability
function createDirProb(dir, prob) {
	var numDir = 8;
	var digit = 4;
	var strcprob = ((1 - prob) / (numDir - 1)).toFixed(digit);
	var cprob = parseFloat(strcprob);
	var dirProb = [];
	dirProb.length = numDir;
	dirProb.fill(cprob);
	dirProb[dir] = prob;
	return dirProb;
}

// Configure visual elements
function configure() {
	// Set document properties
	document.body.style.background = "#eee";
	
	// Set canvas properties
	var can = document.createElement("canvas");
	document.body.append(can);
	can.id = canId;
	can.style.background = background;
	can.width = width;
	can.height = height;
	can.style.width = width + "px";
	can.style.height = height + "px";
	
	// Set textarea properties
	var ta = document.createElement("textarea");
	document.body.append(ta);
	ta.id = taId;
	ta.style.background = background;
	ta.style.width = width + "px";
	ta.style.height = height + "px";
	ta.style.overflowY = "scroll";
}

// Initialize parameters
function initialize() {
	// Set size of system matrix
	rowSize = 100;
	colSize = 100;
	mat = createZeroMatrix(rowSize, colSize);
	
	// Set particles initial position
	N = 10000;
	xmin = 30;
	ymin = 30;
	xmax = 70;
	ymax = 70;
	M = fillParticle(xmin, ymin, xmax, ymax, N, mat);
	
	// Create system border
	createBorder(mat);
	
	// Set iteration parameters
	period = 10;
	tbeg = 0;
	tend = 10000;
	dt = 1;
	t = tbeg;

	// Define probabilities for single phase
	var pGas = [
		0.125, 0.125, 0.125, 0.125, 
		0.125, 0.125, 0.125, 0.125
	];
	var pLiq = [
		0.060, 0.110, 0.110, 0.125, 
		0.250, 0.125, 0.110, 0.110
	];
	var pGra = [
		0.000, 0.000, 0.000, 0.250,
		0.500, 0.250, 0.000, 0.000
	];
	var pSol = [
		0.000, 0.000, 0.000, 0.000,
		1.000, 0.000, 0.000, 0.000		
	];
	
	// Define probabilities for fluid flow in eight directions
	var pNO = createDirProb(0, 0.650);
	var pNE = createDirProb(1, 0.650);
	var pEA = createDirProb(2, 0.650);
	var pSE = createDirProb(3, 0.650);
	var pSO = createDirProb(4, 0.650);
	var pSW = createDirProb(5, 0.650);
	var pWE = createDirProb(6, 0.650);
	var pNW = createDirProb(7, 0.650);
	var pIS = createDirProb(0, 0.125);

	// Wrap it to a directional probability
	switch(phase) {
	
	// Grid 1x1
	case 0: probs = [pSol]; break;
	case 1: probs = [pLiq]; break;
	case 2: probs = [pGas]; break;
	case 3: probs = [pGra]; break;
	
	// Grid 2x2
	case 4: 
		probs = [
			pSE, pSW,
			pNE, pNW
		];
	break;
	case 5: 
		probs = [
			pNW, pNE,
			pSW, pSE
		];
	break;
	
	// Grid 3x3
	case 6: 
		probs = [
			pSE, pWE, pSW,
			pNO, pIS, pSO,
			pNE, pEA, pNW
		];
	break;
	case 7: 
		probs = [
			pSE, pEA, pSW,
			pSO, pIS, pNO,
			pNE, pWE, pNW
		];
	break;
	case 8: 
		probs = [
			pSW, pSO, pSW,
			pEA, pIS, pWE,
			pNE, pNO, pNW
		];
	break;
	
	// Grid 4x4
	case 9: 
		probs = [
			pNW, pNO, pNO, pNE,
			pWE, pIS, pIS, pEA,
			pWE, pIS, pIS, pEA,
			pSW, pSO, pSO, pSE
		];
	break;
	case 10: 
		probs = [
			pSE, pSO, pSO, pSW,
			pWE, pIS, pIS, pEA,
			pWE, pIS, pIS, pEA,
			pNE, pNO, pNO, pNW
		];
	break;
	case 11: 
		probs = [
			pSE, pNO, pNO, pSW,
			pEA, pIS, pIS, pWE,
			pEA, pIS, pIS, pWE,
			pNE, pSO, pSO, pNW
		];
	break;
	case 12: 
		probs = [
			pSE, pSO, pSO, pSW,
			pEA, pIS, pIS, pWE,
			pEA, pIS, pIS, pWE,
			pNE, pNO, pNO, pNW
		];
	break;
	case 13:
		probs = [
			pNE, pEA, pEA, pSE,
			pNO, pIS, pIS, pSO,
			pNO, pIS, pIS, pSO,
			pNW, pWE, pWE, pSW
		];
	break;
	case 14: 
		probs = [
			pNE, pEA, pEA, pSE,
			pNO, pNW, pNE, pSO,
			pNO, pSW, pSE, pSO,
			pNW, pWE, pWE, pSW
		];
	break;
	case 15: 
		probs = [
			pNE, pSE, pSW, pNW,
			pNO, pSO, pSO, pNO,
			pNO, pSO, pSO, pNO,
			pNW, pSW, pSE, pNE
		];
	break;
	case 16: 
		probs = [
			pSW, pNW, pNE, pSE,
			pSO, pNO, pNO, pSO,
			pSO, pNO, pNO, pSO,
			pSE, pNE, pNW, pSW
		];
	break;
	
	// Grid 5x5
	case 17: 
		probs = [
			pNE, pSE, pIS, pNE, pSE,
			pNO, pSO, pIS, pNO, pSO,
			pNO, pSO, pIS, pNO, pSO,
			pNO, pSO, pIS, pNO, pSO,
			pNW, pSW, pIS, pNW, pSW
		];
	break;
	
	// Grid 6x6
	case 18: 
		probs = [
			pSE, pSO, pSW, pSE, pSO, pNW,
			pEA, pIS, pWE, pEA, pIS, pWE,
			pNE, pNO, pNW, pNE, pNO, pNW,
			pIS, pIS, pIS, pSE, pSO, pSW,
			pIS, pIS, pIS, pEA, pIS, pWE,
			pIS, pIS, pIS, pNE, pNO, pNW
		];
	break;
	case 19: 
		probs = [
			pSE, pSO, pSW, pSE, pSO, pNW,
			pEA, pIS, pWE, pEA, pIS, pWE,
			pNE, pNO, pNW, pNE, pNO, pNW,
			pSE, pSO, pSW, pSE, pSO, pSW,
			pEA, pIS, pWE, pEA, pIS, pWE,
			pNE, pNO, pNW, pNE, pNO, pNW
		];
	break;
	}
	
	// Set visual elements properties
	canId = "canvas1";
	taId = "textarea1";
	width = 100;
	height = 100;
	background = "#fff";
}

// Add string to a textarea
function addStringToTextarea(string, id) {
	var ta = document.getElementById(id);
	ta.value += string;
	ta.scrollTop = ta.scrollHeight;
}

// Perform simulation
function simulate() {
	// Draw position matrix on canvas
	drawMatrixOnCanvas(mat, canId);
	
	// Add time series information to textarea
	addStringToTextarea(t + "\n", taId);
	
	// Change particles state
	moveParticlesWithDirProbs(mat, probs);
	
	// Increase time
	t += dt;
	
	// Terminate simulation if final condition achieved
	if(t > tend) {
		clearInterval(proc);
	}
}

// Start simulation
function start() {
	// Call simulate with period time in ms
	proc = setInterval(simulate, period);
}

// Define global variables
var rowSize, colSize, mat;
var N, xmin, ymin, xmax, ymax, M;
var period, tbeg, tend, dt, t;
var probs;
var proc;
var canId, taId, width, height, background;
var phase;

// Execute this program
function main() {
	// Set material phase
	// 0 = solid, 1 = liquid, 2 = gas, 3 = granular,
	// 4 = to-center, 5 = to-corner,
	// 6 = two center-\, 7 = two center-/, 8 = one-center,
	// 9 = clear center, 10 = horizontal, 11 = vertical,
	// 12 = confined fluid,
	// 13 = circular center-iso, 14 = circular center-out
	// 15 = convection center-down, 16 = center up
	// 17 = two-cw-loop,
	// 18 = two-center-\, 19 four-center
	phase = 5;
	
	// Initialize values
	initialize();
	
	// Configure visual elements
	configure();
	
	// Start simulation
	start();
}
