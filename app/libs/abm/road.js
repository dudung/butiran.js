/*
	road.js
	Create road for abm-odm
	
	Sparisoma Viridi | https://github.com/dudung/abm-x
	
	20200604
	0930 Start this library.
	1148 Paint is tested and ok.
	1154 Continue setDirection.
*/


// Define Road class
class Road {
	constructor() {
	}
	
	setName() {
		this.name = arguments[0];;
	}
	
	setType() {
		this.type = arguments[0];
	}
	
	setDirection() {
		this.direction = arguments[0];
		this.probability = arguments[1];
	}
	
	setRegionXY() {
		this.regionXY = arguments[0];
	}
	
	setWorld() {
		this.world = arguments[0];
	}
	
	paint() {
		var m = this.world.m;
		var rxy = this.regionXY;
		var N = rxy.length;
		for(var i = 0; i < N; i++) {
			m[rxy[i][1]][rxy[i][0]] = this.type;
		}
	}	
}

