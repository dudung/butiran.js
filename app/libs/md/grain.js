/*
	grain.js
	Library of grain as granular particle
	Sparisoma Viridi | dudung@gmail.com
	Dimas Praja Purwa Aji | dmspraja2105@gmail.com
	Ismi Yasifa | yasifa.ismi@gmail.com
	
	20170214
	Create this library consists of only Grain class.
	20170216
	Add field for particle ID with type of integer.
	20180303
	Add argument A for age of grain particles.
	Add argument k for child of grain particles.
	Add argument M for mother of grain particles.
	20180403
	Correct arguments.length 9 --> 10.
	20180413
	Add angular variable.
	20180527
	Use node.js and webpack to wrap it to butiran.js library.
	20180602
	Fix dependency to Vect3 class.
	Future note for setting m, D --> rho, D, rho --> m.
	20190530
	1658 Modify the use c as array of color [color, bgcolor].
	20200618
	2141 Integrate to abm-x manually, comment the last part.
	2142 Commment require classes part.
	2224 Set webpack_libs_md_grain to false.
*/

// Require classes
if(webpack_libs_md_grain) {
	Vect3 = require('../libs/vect3')();
}

// Define class of Grain
function Grain() {
	if(arguments.length == 13) {
		this.i = arguments[0];
		this.m = arguments[1];
		this.D = arguments[2];
		this.q = arguments[3];
		this.c = arguments[4];
		this.r = arguments[5];
		this.v = arguments[6];
		this.A = arguments[7];
		this.k = arguments[8];
		this.M = arguments[9];
		this.I = arguments[10];
		this.the = arguments[11];
		this.w = arguments[12];
	} else if(arguments.length == 1) {
		this.i = arguments[0].i;
		this.m = arguments[0].m;
		this.D = arguments[0].D;
		this.q = arguments[0].q;
		this.c = arguments[0].c;
		this.r = arguments[0].r;
		this.v = arguments[0].v;
		this.A = arguments[0].A;
		this.k = arguments[0].k;
		this.M = arguments[0].M;
		this.I = arguments[0].I;
		this.the = arguments[0].the;
		this.w = arguments[0].w;
	} else {
		this.i = 0;
		this.m = 1.0;
		this.D = 1.0;
		this.q = 1.0;
		this.c = "#000";
		this.r = new Vect3;
		this.v = new Vect3;
		this.A = 0;
		this.k = new Array;
		this.M = 0;
		this.I = 10.0;
		this.the = 0;
		this.w = 0;
	}
	this.strval = function() {
		var str = "("
		str += this.i + ", ";
		str += this.m + ", ";
		str += this.D + ", ";
		str += this.q + ", ";
		str += this.c + ", ";
		str += this.r.strval() + ", ";
		str += this.v.strval() + ", ";
		str += this.A + ", ";
		str += this.k + ", ";
		str += this.M + ", ";
		str += this.I + ", ";
		str += this.the + ", ";
		str += this.w + ")";
		return str;
	}
}

// Export module -- 20180527.1608 ok
if(webpack_libs_md_grain) {
	module.exports = function() {
		return Grain;
	};
}
