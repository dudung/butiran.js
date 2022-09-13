/*
	agent.js
	Create and manipulate agent for abm-odm
	
	Sparisoma Viridi | https://github.com/dudung/abm-x
	
	20200604
	0552 Start this library.
	0740 Test random move but not painted.
	0742 Fix color from object type.
	0905 Add checkCity function to record in visitedCity.
	0908 Add visitedIter for time record.
	0916 Can record visited city in agent.
	1155 Try to implement Road direction for agent motion.
	1245 Fix random motion on a road.
	20200612
	1933 Extend Agent to AgenSIR according to [1].
	2036 Create setSusceptible, setInfected, setRecovered.
	2119 Fix how to use paint() in displaying agents in world.
	2136 Problem: infected can not heal itself.
	2139 Fix previous problem.
	20200613
	0633 Add infectedByAgent information.
	1016 Fix recover time information.
	1040 Try to create chain of infection.
	
	References
	1. https://stackoverflow.com/a/46244457/9475509
*/


// Define directions
var agentDirection = [
	[0, 0],   // 0 Still
	[1, 0],   // 1 Right
	[0, -1],  // 2 Top 
	[-1, 0],  // 3 Left
	[0, 1],   // 4 Down
];


// Define Agent class
class Agent {
	constructor() {
		this.x = 0;
		this.y = 0;
		if(arguments.length == 2) {
			this.x = arguments[0];
			this.y = arguments[1];
		}
		this.visitedCity = [];
		this.visitedIter = [];
	}
	
	setWorld() {
		var w = arguments[0];
		this.world = w;
	}
	
	setType() {
		var t = arguments[0];
		this.type = t;
	}
	
	paint() {
		var m = this.world.m;
		this.previousType = m[this.y][this.x];
		m[this.y][this.x] = this.type;
	}
	
	moveRandom() {
		var xsrc = this.x;
		var ysrc = this.y;
		
		var iDir = Math.floor(Math.random() * 5);
		var dx = agentDirection[iDir][0];
		var dy = agentDirection[iDir][1];
		
		var xdest = xsrc + dx;
		var ydest = ysrc + dy;
		
		var m = this.world.m;
		var type = m[ydest][xdest];
		if(0 < type && type < 12) {
			
			var previousType = this.previousType; 
			this.previousType = m[ydest][xdest];
			
			m[ydest][xdest] = this.type;
			m[ysrc][xsrc] = previousType;
			
			this.x = xdest;
			this.y = ydest;
		}
	}
		
	checkCity() {
		var c = arguments[0];
		var iter = arguments[1];
		for(var i = 0; i < c.length; i++) {
			var xmin = c[i].region[0];
			var ymin = c[i].region[1];
			var xmax = c[i].region[2];
			var ymax = c[i].region[3];
			
			var x = this.x;
			var y = this.y;
			
			var inXRange = (xmin <= x) && (x <= xmax);
			var inYRange = (ymin <= y) && (y <= ymax);
			var inRange = inXRange && inYRange;
			
			if(inRange) {
				var currentCity = i;
				var visitedCityRecord = this.visitedCity.length;
				if(visitedCityRecord > 0) {
					var lastCity =
						this.visitedCity[visitedCityRecord - 1];
					if(lastCity != currentCity) {
						this.visitedCity.push(currentCity);
						this.visitedIter.push(iter);
					}
				} else if(visitedCityRecord == 0) {
					this.visitedCity.push(currentCity);
					this.visitedIter.push(iter);
				}
			}
		}
	}
	
	moveOnRoad() {
		var road = arguments[0];

		var xsrc = this.x;
		var ysrc = this.y;
		
		var k = -1;
		for(var i = 0; i < road.length; i++) {
			for(var j = 0; j < road[i].regionXY.length; j++) {
				var xroad = road[i].regionXY[j][0];
				var yroad = road[i].regionXY[j][1];
				if(xsrc == xroad && ysrc == yroad) {
					k = i;
					break;
				}
			}
			if(k > -1) break;
		}
		
		var dx = 0;
		var dy = 0;
		
		if(k > -1) {
			var dir = road[k].direction;
			var prob = road[k].probability;
			
			var rnd = Math.random();
			
			var j = -1;
			var sum = 0;
			for(var i = 0; i < prob.length; i++) {
				sum += prob[i];
				if(rnd < sum) {
					j = i;
					break;
				}
			}
			
			if(j > -1) {
				var iDir = dir[j];
				dx = agentDirection[iDir][0];
				dy = agentDirection[iDir][1];
			}
			
		} else {
			var iDir = Math.floor(Math.random() * 5);
			
			dx = agentDirection[iDir][0];
			dy = agentDirection[iDir][1];
		}
		
		var xdest = xsrc + dx;
		var ydest = ysrc + dy;
		
		var m = this.world.m;
		var type = m[ydest][xdest];
		if(0 < type && type < 12) {
			
			var previousType = this.previousType; 
			this.previousType = m[ydest][xdest];
			
			m[ydest][xdest] = this.type;
			m[ysrc][xsrc] = previousType;
			
			this.x = xdest;
			this.y = ydest;
		}
	}	
}


// Defina agent type
typeS = 12;
typeI = 14;
typeR = 13;


// Define AgentSIR class
class AgentSIR extends Agent {
	constructor() {
		if(arguments.length == 2) {
			var x = arguments[0];
			var y = arguments[1];
			super(x, y);
		} else {
			super();
		}
		this.timeSusceptible = -1;
		this.timeInfected = -1;
		this.timeRecovered = -1;
		this.timeForHealing = 0;
		this.infectedByAgent = -1;
		this.chainInfection = [];
	}
	
	setHealingTime() {
		this.timeForHealing = arguments[0];
	}
	
	setSusceptible() {
		var iter = arguments[0];
		this.type = typeS;
		this.timeSusceptible = iter;
	}
	
	setInfected() {
		var iter = arguments[0];
		var otherId = arguments[1];
		if(this.timeSusceptible > -1 && this.timeInfected == -1) {
			this.type = typeI;
			this.timeInfected = iter;
			if(otherId == undefined) {
				this.infectedByAgent = this.id;
			} else {
				this.infectedByAgent = otherId;
			}
		}
	}
	
	setRecovered() {
		var iter = arguments[0];
		if(this.timeInfected > -1) {
			this.type = typeR;
			this.timeRecovered = iter;
		}
	}
	
	heal() {
		var iter = arguments[0];
		if(this.timeInfected > -1 &&
			iter - this.timeInfected >= this.timeForHealing &&
			this.timeRecovered == -1) {
			this.setRecovered(iter);
		}
	}
	
	spreadInfection() {
		var iter = arguments[0];
		var a = arguments[1];
		var N = a.length;
		
		if(this.timeInfected > -1 && this.timeRecovered == -1) {
			var xinf = this.x;
			var yinf = this.y;
			
			for(var i = 0; i < N; i++) {
				var xi = a[i].x;
				var yi = a[i].y;
				var NEAREST_NEIGBOR =
					(Math.abs(xi - xinf) == 1 &&
					Math.abs(yi - yinf) == 0)
					||
					(Math.abs(xi - xinf) == 0 &&
					Math.abs(yi - yinf) == 1)
					||
					(Math.abs(xi - xinf) == 1 &&
					Math.abs(yi - yinf) == 1);
				
				if(NEAREST_NEIGBOR) {
					a[i].setInfected(iter, this.id);
				}
			}
		}
	}
}

