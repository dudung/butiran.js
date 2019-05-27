/*
	pile.js
	Class of granular pile based on grid model
	
	Sparisoma Viridi | dudung@gmail.compile
	
	20180625
	Start this class during visiting Osaka Univesity and
	staying in room 113 at RCNP.
	20180627
	Add to butiran.js library.
	Add value of to be filled.
*/

class Pile {
	// Constructor of 1-D, 2-D, 3-D of empty room
	constructor() {
		var D = arguments.length;
		var value = [];
		if(D == 0) {
			var msg = "Pile requires at least one dimension size";
			throw new Error(msg);
		} else if(D == 1) {
			this.Nx = arguments[0];
			for(var ix = 0; ix < this.Nx; ix++) {
				var x = 0;
				value.push(x);
			}
		} else if(D == 2) {
			this.Nx = arguments[0];
			this.Ny = arguments[1];
			for(var iy = 0; iy < this.Ny; iy++) {
				var y = [];
				for(var ix = 0; ix < this.Nx; ix++) {
					var x = 0;
					y.push(x);
				}
				value.push(y);
			}
		} else if(D == 3) {
			this.Nx = arguments[0];
			this.Ny = arguments[1];
			this.Nz = arguments[2];
			for(var iz = 0; iz < this.Nz; iz++) {
				var z = [];
				for(var iy = 0; iy < this.Ny; iy++) {
					var y = [];
					for(var ix = 0; ix < this.Nx; ix++) {
						var x = 0;
						y.push(x);
					}
					z.push(y);
				}
				value.push(z);
			}
		}
		this.value = value;
		this.dimension = D;
	}
	
	// Adjust filler
	setFill(type) {
		this.fillType = type;
	}
	
	// Create pile
	fillGrid() {
		var D = arguments.length;
		if(D == 0) {
			var msg = "Pile is empty";
			throw new Error(msg);
		} else if(D != this.dimension) {
			var msg = "Dimension mismatch";
			throw new Error(msg);
		} else if(D == 1) {
			var xmin = arguments[0][0];
			var xmax = arguments[0][1];
			for(var ix = xmin; ix <= xmax; ix++) {
				if(this.fillType == undefined) {
					this.value[ix] = 1;
				} else {
					this.value[ix] = this.fillType;
				}
			}
		} else if(D == 2) {
			var xmin = arguments[0][0];
			var xmax = arguments[0][1];
			var ymin = arguments[1][0];
			var ymax = arguments[1][1];
			for(var iy = ymin; iy <= ymax; iy++) {
				for(var ix = xmin; ix <= xmax; ix++) {
					if(this.fillType == undefined) {
						this.value[iy][ix] = 1;
					} else {
						this.value[iy][ix] = this.fillType;
					}
				}
			}
		} else if(D == 3) {
			var xmin = arguments[0][0];
			var xmax = arguments[0][1];
			var ymin = arguments[1][0];
			var ymax = arguments[1][1];
			var zmin = arguments[2][0];
			var zmax = arguments[2][1];
			for(var iz = zmin; iz <= zmax; iz++) {
				for(var iy = ymin; iy <= ymax; iy++) {
					for(var ix = xmin; ix <= xmax; ix++) {
						if(this.fillType == undefined) {
							this.value[iz][iy][ix] = 1;
						} else {
							this.value[iz][iy][ix] = this.fillType;
						}
					}
				}
			}
		}
	}
};

// Export module -- 20180627.1017 ok @RCNP.113
module.exports = function() {
	return Pile;
};
