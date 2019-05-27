/*
	tablet.js
	Grid based tablet
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180612
	Start this application gstd.js by creating functions
	createBlockTablet, setMaxValue, stepDissolve, and move
	them to grid/tablet.js library. And also tested in HTML.
	Create this library of functions from gstd.js with
	functions createBlockTablet, setMaxValue, stepDissolve.
	20180620
	Create getRemains, createEllipsoidTablet,
	createCylinderTablet, getProjectionOf, getMaxProjection,
	normalizeProjection, normalizeProjectionInitial,
	createHollowCylinderTablet. Add eight new functions.
*/

// Create three dimension hollow cylinder tablet
function createHollowCylinderTablet(Nx, Ny, Nz, Nxh, Nyh) {
	var tab = [];
	
	var Rx = Nx / 2;
	var Ry = Ny / 2;
	var Rxh = Nxh / 2;
	var Ryh = Nyh / 2;

	var xo = 0.5 * (0 + Nx - 1);
	var yo = 0.5 * (0 + Ny - 1);
	
	for(var z = 0; z < Nz; z++) {
		var row = [];
		for(var y = 0; y < Ny; y++) {
			var col = [];
			for(var x = 0; x < Nx; x++) {
				var rx2 = 1.0 * (x - xo) * (x - xo) / (Rx * Rx);
				var ry2 = 1.0 * (y - yo) * (y - yo) / (Ry * Ry);
				var rr2 = rx2 + ry2;
				
				var rx2h = 1.0 * (x - xo) * (x - xo) / (Rxh * Rxh);
				var ry2h = 1.0 * (y - yo) * (y - yo) / (Ryh * Ryh);
				var rr2h = rx2h + ry2h;
								
				var val = ((1 < rr2h) && (rr2 < 1)) ? 1 : 0;
				
				var empx = (x == 0 || x == Nx - 1);
				var empy = (y == 0 || y == Ny - 1);
				var empz = (z == 0 || z == Nz - 1);
				val = (empx || empy || empz) ? 0 : val;
				
				col.push(val);
			}
			row.push(col);
		}
		tab.push(row);
	}
	return tab;
}

// Normalize projection matrix with initial value
function normalizeProjectionInitial(proj, max) {
	var row = proj.length;
	var col = proj[0].length;
	for(var r = 0; r < row; r++) {
		for(var c = 0; c < col; c++) {
			proj[r][c] /= max;
		}
	}
}

// Normalize projection matrix
function normalizeProjection(proj) {
	var row = proj.length;
	var col = proj[0].length;
	var max = getMaxProjection(proj);
	for(var r = 0; r < row; r++) {
		for(var c = 0; c < col; c++) {
			procj[r][c] /= max;
		}
	}
}

// Get maximum value from projection matrix
function getMaxProjection(proj) {
	var row = proj.length;
	var col = proj[0].length;
	var max = 0;
	for(var r = 0; r < row; r++) {
		for(var c = 0; c < col; c++) {
			max = (proj[r][c] > max) ? proj[r][c] : max;
		}
	}
	return max;
}

// Get projection of tablet on certain plane (xy, yz, xz)
function getProjectionOf(tab) {
	var Nz = tab.length;
	var Ny = tab[0].length;
	var Nx = tab[0][0].length;
	var projection = {
		onPlane: function(plane) {
			var mat;
			if(plane == "xy") {
				var rows = [];
				for(var y = 0; y < Ny; y++) {
					var cols = [];
					for(var x = 0; x < Nx; x++) {
						var sum = 0;
						for(var z = 0; z < Nz; z++) {
							sum += tab[z][y][x];
						}
						cols.push(sum);
					}
					rows.push(cols);
				}
				mat = rows;
			} else if(plane == "yz") {
				var rows = [];
				for(var z = 0; z < Nz; z++) {
					var cols = [];
					for(var y = 0; y < Ny; y++) {
						var sum = 0;
						for(var x = 0; x < Nx; x++) {
							sum += tab[z][y][x];
						}
						cols.push(sum);
					}
					rows.push(cols);
				}
				mat = rows;
			} else if(plane == "xz") {
				var rows = [];
				for(var z = 0; z < Nz; z++) {
					var cols = [];
					for(var x = 0; x < Nx; x++) {
						var sum = 0;
						for(var y = 0; y < Ny; y++) {
							sum += tab[z][y][x];
						}
						cols.push(sum);
					}
					rows.push(cols);
				}
				mat = rows;
			}
			return mat;
		}
	};
	return projection;
}

// Create three dimension cylinder tablet -- 0641 ok
function createCylinderTablet(Nx, Ny, Nz) {
	var tab = [];
	
	var Rx = Nx / 2;
	var Ry = Ny / 2;

	var xo = 0.5 * (0 + Nx - 1);
	var yo = 0.5 * (0 + Ny - 1);
	
	for(var z = 0; z < Nz; z++) {
		var row = [];
		for(var y = 0; y < Ny; y++) {
			var col = [];
			for(var x = 0; x < Nx; x++) {
				var rx2 = 1.0 * (x - xo) * (x - xo) / (Rx * Rx);
				var ry2 = 1.0 * (y - yo) * (y - yo) / (Ry * Ry);
				var rr2 = rx2 + ry2;
				var val = (rr2 < 1) ? 1 : 0;
				
				var empx = (x == 0 || x == Nx - 1);
				var empy = (y == 0 || y == Ny - 1);
				var empz = (z == 0 || z == Nz - 1);
				val = (empx || empy || empz) ? 0 : val;
				
				col.push(val);
			}
			row.push(col);
		}
		tab.push(row);
	}
	return tab;
}

// Create three dimension ellipsoid tablet -- 0637 ok
function createEllipsoidTablet(Nx, Ny, Nz) {
	var tab = [];
	
	var Rx = Nx / 2;
	var Ry = Ny / 2;
	var Rz = Nz / 2;

	var xo = 0.5 * (0 + Nx - 1);
	var yo = 0.5 * (0 + Ny - 1);
	var zo = 0.5 * (0 + Nz - 1);
	
	for(var z = 0; z < Nz; z++) {
		var row = [];
		for(var y = 0; y < Ny; y++) {
			var col = [];
			for(var x = 0; x < Nx; x++) {
				var rx2 = 1.0 * (x - xo) * (x - xo) / (Rx * Rx);
				var ry2 = 1.0 * (y - yo) * (y - yo) / (Ry * Ry);
				var rz2 = 1.0 * (z - zo) * (z - zo) / (Rz * Rz);
				var rr2 = rx2 + ry2 + rz2;
				var val = (rr2 < 1) ? 1 : 0;
				
				var empx = (x == 0 || x == Nx - 1);
				var empy = (y == 0 || y == Ny - 1);
				var empz = (z == 0 || z == Nz - 1);
				val = (empx || empy || empz) ? 0 : val;
				
				col.push(val);
			}
			row.push(col);
		}
		tab.push(row);
	}
	return tab;
}

// Get tablet remains -- 0458 ok
function getRemains(tab) {
	var Nz = tab.length;
	var Ny = tab[0].length;
	var Nx = tab[0][0].length;
	var remains = 0;
	for(var z = 0; z < Nz; z++) {
		for(var y = 0; y < Ny; y++) {
			for(var x = 0; x < Nx; x++) {
				remains += tab[z][y][x];
			}
		}
	}
	return remains;
}

// Dissolve tablet in one step -- 1702 ok
function stepDissolve(tab) {
	var Nz = tab.length;
	var Ny = tab[0].length;
	var Nx = tab[0][0].length;
	for(var z = 0; z < Nz; z++) {
		for(var y = 0; y < Ny; y++) {
			for(var x = 0; x < Nx; x++) {
				var tabx = (0 < x && x < Nx - 1);
				var taby = (0 < y && y < Ny - 1);
				var tabz = (0 < z && z < Nz - 1);
				if(tabx && taby && tabz) {
					var val = tab[z][y][x];
					var dval = 0;
					if(tab[z][y][x-1] == 0) dval++;
					if(tab[z][y][x+1] == 0) dval++;
					if(tab[z][y-1][x] == 0) dval++;
					if(tab[z][y+1][x] == 0) dval++;
					if(tab[z-1][y][x] == 0) dval++;
					if(tab[z+1][y][x] == 0) dval++;
					val -= dval;
					if(val < 0) val = 0;
					tab[z][y][x] = val;
				}
			}
		}
	}
}

// Set maximum value -- 1613 ok
function setMaxValue(tab, val) {
	var Nz = tab.length;
	var Ny = tab[0].length;
	var Nx = tab[0][0].length;
	for(var z = 0; z < Nz; z++) {
		for(var y = 0; y < Ny; y++) {
			for(var x = 0; x < Nx; x++) {
				tab[z][y][x] *= val;
			}
		}
	}
}

// Create three dimension block tablet -- 1536 ok
function createBlockTablet(Nx, Ny, Nz) {
	var tab = [];
	for(var z = 0; z < Nz; z++) {
		var row = [];
		for(var y = 0; y < Ny; y++) {
			var col = [];
			for(var x = 0; x < Nx; x++) {
				var empx = (x == 0 || x == Nx - 1);
				var empy = (y == 0 || y == Ny - 1);
				var empz = (z == 0 || z == Nz - 1);
				var val = (empx || empy || empz) ? 0 : 1;
				col.push(val);
			}
			row.push(col);
		}
		tab.push(row);
	}
	return tab;
}

// Export module
module.exports = {
	createBlockTablet: function(Nx, Ny, Nz) {
		return createBlockTablet(Nx, Ny, Nz)
	},
	setMaxValue: function(tab, val) {
		return setMaxValue(tab, val);
	},
	stepDissolve: function(tab) {
		return stepDissolve(tab);
	},
	createHollowCylinderTablet: function(Nx, Ny, Nz, Nxh, Nyh) {
		return createHollowCylinderTablet(Nx, Ny, Nz, Nxh, Nyh);
	},
	getRemains: function(tab) {
		return getRemains(tab);
	},
	createEllipsoidTablet: function(Nx, Ny, Nz) {
		return createEllipsoidTablet(Nx, Ny, Nz);
	},
	createCylinderTablet: function(Nx, Ny, Nz) {
		return createCylinderTablet(Nx, Ny, Nz);
	},
	getProjectionOf: function(tab) {
		return getProjectionOf(tab);
	},
	getMaxProjection: function(proj) {
		return getMaxProjection(proj);
	},
	normalizeProjection: function(proj) {
		return normalizeProjection(proj);
	},
	normalizeProjectionInitial: function(proj, max) {
		return normalizeProjectionInitial(proj, max);
	},
};
