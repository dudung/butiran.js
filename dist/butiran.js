/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/*
	butiran.js
	Simulation for granular particles system
	
	Sparisoma Viridi | dudung@gmail.com
	
	Execute:
	node main.js
	
	Compile:
	webpack main.js --mode=production -o dist\butiran.min.js
	webpack main.js --mode=none -o dist\butiran.js
	
	Version info:
		Node.js	v10.1.0
		webpack	4.8.3
		npm 5.6.0
	
	20180519
	Start recreating this library, now with node.js support
	and try to use ES modules, which is still experimental.
	20180520
	Write how to node and webpack of butiran.js to get
	butiran.js.min file in dest folder.
	Add class of Polynomial to this script, test it, and ok.
	Random, Integration, RGB functions and Timer class are
	also ok.
	20180527
	Port Vect3, Grain from old version.
	20180603
	Fix Grain and add new Buoyant, Gravitation, Electrostatic,
	Normal, Spring.
	Change folder structure.
	20180612
	Add grid/tablet.js for grid based simulation of tablet
	dissolution.
	20180613
	Find webpack with mode=none which produces not optimized
	output of butiran.js in one file.
	20180614
	Add css/style.js library to this. Change folder from lib/css
	to lib.
	Add tabtext.js and tabcanvas.js libraries and functions.
	20180618
	Add math/transformation.js for drawing in tab.js class.
	20180619
	Add tabs and bgroup from app to lib/ui folder.
	20180627
	Add pile from lib/grid folder.
	
	20190528 Revisit last year code and start selecting.
	0221 Remove Resistor in lib/electronic.
	0222 Remove lib/log.
	0223 Remove lib/ui.
	0230 Resort storing libraries in window.
	0232 Rename butiran.js to main.js as main library of butiran.
	0238 Test compiling after cleaning and ok.
	
	20190528
	0844 Add lib/math/path for scspg app.
	
	20190530
	1222 Add lib/data/points for spfwfs app.
*/

// lib
var Grain = __webpack_require__(1)();
var Style = __webpack_require__(3);
var Vect3 = __webpack_require__(2)();

// lib/color
var RGB = __webpack_require__(4);

// lib/force
var Buoyant = __webpack_require__(5)();
var Drag = __webpack_require__(6)();
var Electrostatic = __webpack_require__(7)();
var Gravitational = __webpack_require__(8)();
var Magnetic = __webpack_require__(9)();
var Normal = __webpack_require__(10)();
var Spring = __webpack_require__(11)();

// lib/generator
var Generator = __webpack_require__(12)();
var Random = __webpack_require__(14);
var Sequence = __webpack_require__(13)();
var Timer = __webpack_require__(15)();
var Sample = __webpack_require__(16)();

// lib/grid
var Tablet = __webpack_require__(17);
var Pile = __webpack_require__(18)();

// lib/math
var Integration = __webpack_require__(19);
var Polynomial = __webpack_require__(20)();
var Transformation = __webpack_require__(21);
var Path = __webpack_require__(22)();

// lib/data
var Points = __webpack_require__(23)();

// Store information 
if(typeof window !== 'undefined') {
	// Store to window object -- 20180519.2358
	
	// lib
	window["Grain"] = Grain;
	window["Style"] = Style;
	window["Vect3"] = Vect3;
	
	// lib/color
	window["RGB"] = RGB;
	
	// lib/force
	window["Buoyant"] = Buoyant;
	window["Drag"] = Drag;
	window["Electrostatic"] = Electrostatic;
	window["Gravitational"] = Gravitational;
	window["Magnetic"] = Magnetic;
	window["Normal"] = Normal;
	window["Spring"] = Spring;
	
	// lib/generator
	window["Generator"] = Generator;
	window["Random"] = Random;
	window["Sequence"] = Sequence;
	window["Timer"] = Timer;
	window["Sample"] = Sample;
	
	// lib/grid
	window["Tablet"] = Tablet;
	window["Pile"] = Pile;
	
	// lib/math
	window["Path"] = Path;
	window["Polynomial"] = Polynomial;
	window["Integration"] = Integration;
	window["Transformation"] = Transformation;
	
	// data/points
	window["Points"] = Points;
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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
*/

// Require classes
var Vect3 = __webpack_require__(2)();

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
module.exports = function() {
	return Grain;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	vect3.js
	Vector in 3-d Cartesian coordinate system
	
	Sparisoma Viridi | dudung@gmail.com
	
	20170214
	Create this library with following functions defined for
	Vect3 class
	add()	add two Vect3,
	sub() subtract two Vect3,
	dot()	dot product of two Vect3,
	crs()	cross product of two Vect3,
	mul()	multiplication of Vect3 with scalar,
	div() division of Vect3 with scalar,
	len() length of a Vect3,
	uni()	unit vector of a Vect3,
	neg()	negative of a Vect3.
	All are tested and works.
	20171226
	Create this object (again).
	Change crs() to cross(), uni() to unit(), 
	20171227
	Add some comments for clearer documentation.
	20180527
	Use node.js and webpack to wrap it to butiran.js and
	add node neg() from vect3old.js library.
	20180603
	Fix unit vector of 0 vector.
*/

// Define class of Vect3
class Vect3 {
	// Create three different types of constructor
	constructor() {
		if(arguments.length == 0) {
			this.x = 0.0;
			this.y = 0.0;
			this.z = 0.0;
		} else if(arguments.length == 3) {
			this.x = arguments[0];
			this.y = arguments[1];
			this.z = arguments[2];
		} else if(arguments.length == 1) {
			if(arguments[0] instanceof Vect3)
			this.x = arguments[0].x;
			this.y = arguments[0].y;
			this.z = arguments[0].z;
		}
	}
	
	// Get string value
	strval() {
		var s = "(";
		s += this.x + ", ";
		s += this.y + ", ";
		s += this.z;
		s += ")";
		return s;
	}
	
	// Add some Vect3
	static add() {
		var N = arguments.length;
		var x = 0.0;
		var y = 0.0;
		var z = 0.0;
		for(var i = 0; i < N; i++) {
			x += arguments[i].x;
			y += arguments[i].y;
			z += arguments[i].z;
		}
		var p = new Vect3(x, y, z);
		return p;
	}
	
	// Substract two Vect3
	static sub() {
		var x = arguments[0].x - arguments[1].x;
		var y = arguments[0].y - arguments[1].y;
		var z = arguments[0].z - arguments[1].z;
		var p = new Vect3(x, y, z);
		return p;
	}
	
	// Multiply Vect3 with scalar or vice versa
	static mul() {
		var a = arguments[0];
		var b = arguments[1];
		var x, y, z;
		if(a instanceof Vect3) {
			x = a.x * b;
			y = a.y * b;
			z = a.z * b;
		} else if(b instanceof Vect3) {
			x = a * b.x;
			y = a * b.y;
			z = a * b.z;
		}
		var p = new Vect3(x, y, z);
		return p;
	}
	
	// Divide Vect3 with scalar
	static div() {
		var a = arguments[0];
		var b = arguments[1];
		var	x = a.x / b;
		var	y = a.y / b;
		var	z = a.z / b;
		var p = new Vect3(x, y, z);
		return p;
	}
	
	// Dot two Vect3
	static dot() {
		var a = arguments[0];
		var b = arguments[1];
		var	xx = a.x * b.x;
		var	yy = a.y * b.y;
		var	zz = a.z * b.z;
		var d = xx + yy + zz;
		return d;
	}
	
	// Cross two Vect3
	static cross() {
		var a = arguments[0];
		var b = arguments[1];
		var	x = a.y * b.z - a.z * b.y;
		var	y = a.z * b.x - a.x * b.z;
		var	z = a.x * b.y - a.y * b.x;
		var p = new Vect3(x, y, z)
		return p;
	}
	
	// Get length of a Vect3
	len() {
		var l = Math.sqrt(Vect3.dot(this, this));
		return l;
	}
	
	// Get unit vector of a Vect3
	unit() {
		var l = this.len();
		var p = new Vect3;
		if(l > 0) {
			p = Vect3.div(this, l);
		}
		return p;
	}
	
	// Get negative of a vector
	neg() {
		var xx = -this.x;
		var yy = -this.y;
		var zz = -this.z;
		var rr = new Vect3(xx, yy, zz);
		return rr;
	}
}

// Export module -- 20180527.1515 ok
module.exports = function() {
	return Vect3;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	style.js
	Create style, get attribute, change attribute
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180614
	Create this library of functions by moving it from gstd.js
	application.
	Move it from lib/css to lib since it is only one.
*/

// Get attribute value of a style
function getStyleAttribute(style, attr) {
	var N = document.styleSheets.length;
	var styles = document.styleSheets;
	var value;
	for(var i = 0; i < N; i++)
	{
		if(styles[i].rules[0].selectorText == style)
		value = styles[i].rules[0].style[attr];
	}
	return value;
}

// Change style attribute with value
function changeStyleAttribute(style, attr, value) {
	// dudung, "Modify previously defined style in JS"
	// https://stackoverflow.com/q/50847689/9475509
	var N = document.styleSheets.length;
	var styles = document.styleSheets;
	for(var i = 0; i < N; i++)
	{
		if(styles[i].rules[0].selectorText == style)
		styles[i].rules[0].style[attr] = value;
	}
}

// Create a style
function createStyle(css) {
	// Christoph, TomFuertes, answer of "How to create
	// a <style> tag with Javascript"
	// https://stackoverflow.com/a/524721/9475509
	var head = document.head ||
		document.getElementsByTagName("head")[0];
	var style = document.createElement("style");
	style.type = "text/css";
	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		var textNode = document.createTextNode(css);
		style.append(textNode);
	}
	head.append(style);
}

// Export module
module.exports = {
	createStyle: function(css) {
		return createStyle(css)
	},
	changeStyleAttribute: function(style, attr, value) {
		return changeStyleAttribute(style, attr, value);
	},
	getStyleAttribute: function(style, attr) {
		return getStyleAttribute(style, attr);
	},
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	rgb.js
	Conversion from and to RBG color format
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180107
	Create this library of functions.
	20180520
	Add module.export for ES module support, tested and ok.
*/

// Convert integer to RGB color format
function int2rgb(r, g, b) {
	var B = (b).toString(16);
	var G = (g).toString(16);
	var R = (r).toString(16);
	if(B.length < 2) B = "0" + B;
	if(G.length < 2) G = "0" + G;
	if(R.length < 2) R = "0" + R;
	var hexColor = "#" + R + G + B;
	return hexColor;
}

// Convert double to RGB color format
function double2rgb(r, g, b) {
	var B = Math.round(b * 255);
	var G = Math.round(g * 255);
	var R = Math.round(r * 255);
	var hexColor = int2rgb(R, G, B);
	return hexColor;
}

// Export module
module.exports = {
	int2rgb: function(r, g, b) {
		return int2rgb(r, g, b)
	},
	double2rgb: function(r, g, b) {
		return double2rgb(r, g, b);
	}
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
	buoyant.js
	Buoyant force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180602
	Create this library from previous force.js library.
*/

// Require classes
var Vect3 = __webpack_require__(2)();

// Define class of Buoyant
class Buoyant {
	// Create constructor
	constructor() {
		// Set default fluid to water
		this.rho = 1000; // kg m^-3
		
		// Set default gravity
		this.g = new Vect3(0, 0, -10); // kg m s^-2
	}
	
	// Set fluid density
	setFluidDensity(rho) {
		this.rho = rho;
	}
	
	// Set gravity
	setGravity(g) {
		this.g = g;
	}
	
	// Calculate buoyant force due to immersed volume V
	force(V) {
		var rho = this.rho;
		var g = this.g;
		var f = Vect3.mul(g.neg(), rho * V);
		return f;
	}
}

// Export module -- 20180602.1944 ok
module.exports = function() {
	return Buoyant;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	drag.js
	Drag force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180602
	Create this library from previous force.js and viscous.js
	library.
*/

// Require classes
var Vect3 = __webpack_require__(2)();
var Grain = __webpack_require__(1)();

// Define class of Drag
class Drag {
	// Create constructor
	constructor() {
		// Set default constants
		this.c0 = 0; // N
		this.c1 = 0; // N s m^-1
		this.c2 = 0; // N s^2 m^-2
		
		// Set default fluid velocity
		this.vf = new Vect3;
	}
	
	// Set constants
	setConstant(c0, c1, c2) {
		this.c0 = c0;
		this.c1 = c1;
		this.c2 = c2;
	}
	
	// Set fluid velocity 'field'
	setField(vf) {
		this.vf = vf;
	}
	
	// Calculate drag force
	force() {
		var f = new Vect3;
		if(arguments[0] instanceof Grain) {
			var c0 = this.c0;
			var c1 = this.c1;
			var c2 = this.c2;
			var vf = this.vf;
			var v = arguments[0].v;
			var v12 = Vect3.sub(v, vf);
			var u12 = v12.unit();
			var s12 = v12.len();
			var mag = c0 + c1 * s12 + c2 * (s12 * s12);
			var f = Vect3.mul(mag, u12.neg());
		}
		return f;
	}
}

// Export module -- 20180603.1340 !ok
module.exports = function() {
	return Drag;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
	electrostatic.js
	Electrostatic force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	gravitation.js libraries.
*/

// Require classes
var Vect3 = __webpack_require__(2)();
var Grain = __webpack_require__(1)();

// Define class of Electrostatic
class Electrostatic {
	// Create constructor
	constructor() {
		// Set Coulomb's constant
		this.k = 8.987551787E9; // N m^2 C^-2 
		
		// Set default electrostatic field
		this.E = new Vect3(1, 0, 0); // N C^-1
	}
	
	// Set electrostatic field
	setField(E) {
		this.E = E;
		delete this.k;
	}
	
	// Set Coulomb's constant
	setConstant(k) {
		this.k = k;
		delete this.E;
	}
	
	// Calculate gravitational force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(this.E != undefined) {
			if(arguments[0] instanceof Grain) {
				var q = arguments[0].q;
				var E = this.E;
				f = Vect3.mul(q, E);				
			}
		} if(this.k != undefined) {
			if(arguments[0] instanceof Grain &&
				arguments[1] instanceof Grain) {
				var q1 = arguments[0].q;
				var q2 = arguments[1].q;
				var r1 = arguments[0].r;
				var r2 = arguments[1].r;
				var r12 = Vect3.sub(r1, r2);
				var u12 = r12.unit();
				var l12 = r12.len();
				var k = this.k;
				f = Vect3.mul(k * q1 * q2 / (l12 * l12), u12);
			}
		}
		
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180603.1155 ok
module.exports = function() {
	return Electrostatic;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
	gravitational.js
	Gravitational force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180602
	Create this library from previous force.js and buoyant.js
	libraries.
	20180603
	Rename from gravitation to gravitational.
*/

// Require classes
var Vect3 = __webpack_require__(2)();
var Grain = __webpack_require__(1)();

// Define class of Gravitational
class Gravitational {
	// Create constructor
	constructor() {
		// Set gravitational constant
		this.G = 6.67408E-11; // m^3 kg^-1 s^-2 
		
		// Set default gravitational field
		this.g = new Vect3(0, 0, -9.80665); // m s^-1
	}
	
	// Set gravity
	setField(g) {
		this.g = g;
		delete this.G;
	}
	
	// Set gravitational constant
	setConstant(G) {
		this.G = G;
		delete this.g;
	}
	
	// Calculate gravitational force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(this.g != undefined) {
			if(arguments[0] instanceof Grain) {
				var m = arguments[0].m;
				var g = this.g;
				f = Vect3.mul(m, g);				
			}
		} if(this.G != undefined) {
			if(arguments[0] instanceof Grain &&
				arguments[1] instanceof Grain) {
				var m1 = arguments[0].m;
				var m2 = arguments[1].m;
				var r1 = arguments[0].r;
				var r2 = arguments[1].r;
				var r12 = Vect3.sub(r1, r2);
				var u12 = r12.unit();
				var l12 = r12.len();
				var G = this.G;
				f = Vect3.mul(-G * m1 * m2 / (l12 * l12), u12);
			}
		}
		
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180602.2020 ok
module.exports = function() {
	return Gravitational;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/*
	magnetic.js
	Magnetic force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	electrostatic.js libraries.
*/

// Require classes
var Vect3 = __webpack_require__(2)();
var Grain = __webpack_require__(1)();

// Define class of Magnetic
class Magnetic {
	// Create constructor
	constructor() {
		// Set magnetic constant
		// with mu0 = 1.25663706E-6; // m kg s^-2 A^-2
		// and k = mu0 / 4 pi
		this.k = 1E-7; // T m A^-1
				
		// Set default magnetic field
		this.B = new Vect3(1, 0, 0); // T
	}
	
	// Set magnetic field
	setField(B) {
		this.B = B;
		delete this.k;
	}
	
	// Set magnetic constant
	setConstant(k) {
		this.k = k;
		delete this.B;
	}
	
	// Calculate magnetic force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(this.B != undefined) {
			if(arguments[0] instanceof Grain) {
				var q = arguments[0].q;
				var v = arguments[0].v;
				var B = this.B;
				f = Vect3.mul(q, Vect3.cross(v, B));				
			}
		} if(this.k != undefined) {
			if(arguments[0] instanceof Grain &&
				arguments[1] instanceof Grain) {
				var q1 = arguments[0].q;
				var q2 = arguments[1].q;
				var r1 = arguments[0].r;
				var r2 = arguments[1].r;
				var r12 = Vect3.sub(r1, r2);
				var l12 = r12.len();
				var v1 = arguments[0].v;
				var v2 = arguments[1].v;
				var k = this.k;
				var v1v2r12 = Vect3.cross(v1, Vect3.cross(v2, r12))
				f = Vect3.mul(k * q1 * q2 / (l12 * l12), v1v2r12);
			}
		}
		
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180603.1432 ok
module.exports = function() {
	return Magnetic;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
	normal.js
	Normal force for linear spring-dashpot model
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	gravitation.js libraries.
	Value of gamma and its implementation is still a subject
	for discussion.
*/

// Require classes
var Vect3 = __webpack_require__(2)();
var Grain = __webpack_require__(1)();

// Define class of Normal
class Normal {
	// Create constructor
	constructor() {
		// Set default spring constant
		this.k = 10000; // N m^-1 
		
		// Set default damping constant
		this.gamma = 10; // N s m^-1
	}
	
	// Set constants
	setConstant(k, gamma) {
		this.k = k;
		this.gamma = gamma;
	}
	
	// Calculate normal force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(arguments[0] instanceof Grain &&
			arguments[1] instanceof Grain) {
			var D1 = arguments[0].D;
			var D2 = arguments[1].D;
			var r1 = arguments[0].r;
			var r2 = arguments[1].r;
			var r12 = Vect3.sub(r1, r2);
			var u12 = r12.unit();
			var l12 = r12.len();
			var v1 = arguments[0].v;
			var v2 = arguments[1].v;
			var v12 = Vect3.sub(v1, v2);
			var k = this.k;
			var gamma = this.gamma;
			var R12 = 0.5 * (D1 + D2);
			var ksi = Math.max(0, R12 - l12);
			var ksidot = v12.len();
			
			f = Vect3.mul(k * ksi - gamma * ksidot, u12);
		}
		
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180603.1231 ok
module.exports = function() {
	return Normal;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
	spring.js
	Spring force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	normal.js libraries.
*/

// Require classes
var Vect3 = __webpack_require__(2)();
var Grain = __webpack_require__(1)();

// Define class of Spring
class Spring {
	// Create constructor
	constructor() {
		// Set default spring constant
		this.k = 1; // N m^-1 
		
		// Set default spring uncompressed length
		this.l = 1; // m
		
		// Set default damping constant
		this.gamma = 1; // N s m^-1
		
		// Set default origin
		this.o = new Vect3;
	}
	
	// Set constants
	setConstant(k, gamma) {
		this.k = k;
		this.gamma = gamma;
	}
	
	// Set uncompressed length
	setUncompressedLength(l) {
		this.l = l;
	}
	
	// Set origin
	setOrigin(o) {
		this.o = o;
	}
	
	// Calculate normal force
	force() {
		// Set default value to (0, 0, 0)
		var f = new Vect3;
		if(arguments.length == 1) {
			if(arguments[0] instanceof Grain) {
				var r1 = arguments[0].r;
				var r2 = this.o;
				var r12 = Vect3.sub(r1, r2);
				var u12 = r12.unit();
				var l12 = r12.len();
				var l = this.l;
				var v1 = arguments[0].v;
				var v2 = new Vect3;
				var v12 = Vect3.sub(v1, v2);
				var k = this.k;
				var gamma = this.gamma;
				var ksi = l12 - l;
				var ksidot = v12.len();
				
				f = Vect3.mul(-k * ksi - gamma * ksidot, u12);
			}
		} else if(arguments.length == 2) {
			if(arguments[0] instanceof Grain &&
				arguments[1] instanceof Grain) {
				var r1 = arguments[0].r;
				var r2 = arguments[1].r;
				var r12 = Vect3.sub(r1, r2);
				var u12 = r12.unit();
				var l12 = r12.len();
				var l = this.l;
				var v1 = arguments[0].v;
				var v2 = arguments[1].v;
				var v12 = Vect3.sub(v1, v2);
				var k = this.k;
				var gamma = this.gamma;
				var ksi = l12 - l;
				var ksidot = v12.len();
				
				f = Vect3.mul(-k * ksi - gamma * ksidot, u12);
			}
		}
		
		// Note that (0, 0, 0) value could be due to error
		return f;
	}
}

// Export module -- 20180603.1324 ok
module.exports = function() {
	return Spring;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	generator.js
	An object for generate something
	
	Sparisoma Viridi | dudung@gmail.com
	Tatang Suheri | tatangpl@yahoo.com
	
	20180301
	Start this library and setRandomInt, setSeries, and
	setPolynom are ok. setFunction is not implemented.
	It is triggered by the need for industry framework
	simulation.
	20180520
	Change from framework to butiran/lib with the same name
	but different imlementation, and create this object for
	generating periodic signal in butiran, which requires
	class of Sequence.
*/

// List dependencies
var Sequence = __webpack_require__(13)();

// Define class of Generator
class Generator {
	
	// Define constructor
	constructor(dt, seq, amp) {
		// Define default attributes and their initial value
		this.t = 0;
		this.dt = 0.001;
		this.sequence = [];
		this.amplitude = [];
		
		// Change default value if given as arguments
		if(arguments.length == 3) {
			this.dt = dt;
			this.sequence = seq;
			this.amplitude = amp;
		}
	}
	
	// Restart generator
	restart() {
		this.t = 0;
		var N = this.sequence.length;
		for(var i = 0; i < N; i++) {
			this.sequence[i].pos = 0;
		}
	}
		
	// Get value for all sources
	ping() {
		
		// Define output variable
		var output = [];
		
		// Add time data
		output.push(this.t);
		this.t += this.dt;
		
		// Add value from all sequences
		var N = this.sequence.length;
		for(var i = 0; i < N; i++) {
			var out = this.sequence[i].ping();
			out *= this.amplitude[i];
			output.push(out);
		}
		
		return output;
	}
	
	// Define test function -- 20180520.1649 ok
	static test() {
		// Define time step
		var dt = 0.001; // s

		// Define pattern for sequence as voltage source
		var ptn1 = [
			0, 0, 0, 0, 0,
			1, 1, 1, 1, 1,
		];
		var ptn2 = [
			0, 0,
			1, 1
		];
		
		// Define sequences
		var seq1 = new Sequence(ptn1);
		var seq2 = new Sequence(ptn2);

		// Define signal amplitudo
		var amp1 = 8; // V
		var amp2 = 10; // V
		
		// Define generator
		var gen = new Generator(dt, [seq1, seq2], [amp1, amp2]);
		
		var N = 15;
		for(var i = 0; i < N; i++) {
			var signal = gen.ping();
			console.log(signal);
		}
		
	}
}

// Export module
module.exports = function() {
	return Generator;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/*
	sequence.js
	An object for storing sequence of periodic values
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180519
	Create this object as part of function generator
	in butiran.
*/

// Define class of Sequence
class Sequence {
	
	// Define constructor
	constructor() {
		// Define default periodic values in one period
		this.name = "Sequence";
		this.value = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
		this.pos = 0;
		
		// Change default value if given as arguments
		if(arguments.length == 1) {
			this.value = arguments[0];
		}
		
		// Calculate length of sequence
		this.end = this.value.length;
	}
	
	// Get value and increase pos by one
	ping() {
		var value = this.value[this.pos];
		this.pos++;
		if(this.pos == this.end) {
			this.pos = 0;
		}
		return value;
	}
	
	// Define test function -- 20180519.1925 ok
	static test() {
		var seq = new Sequence();
		var N = 16;
		for(var i = 0; i < N; i++) {
			console.log(seq.ping());
		}
	}
}

// Export module -- 20180519.2357 ok
module.exports = function() {
	return Sequence;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/*
	random.js
	Generate random number
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180302
	Create this library of functions.
	20180520
	Add module.export for ES module support.
*/

// Generate int \in [min, max]
function randInt(min, max) {
	var x = Math.random() * (max - min) + min;
	x = Math.round(x);
	return x;
}

// Generate array of N number of int
function randIntN(min, max, N) {
	var x = [];
	for(var i = 0; i < N; i++) {
		x.push(randInt(min, max));
	}
	return x;
}

// Export module -- 20180520.0724 ok
module.exports = {
	randInt: function(min, max) {
		return randInt(min, max);
	},
	randIntN: function(min, max, N) {
		return randIntN(min, max, N);
	}
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/*
	timer.js
	Generate timing event using setInterval and clearInterval
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180302
	Start this library.
	20180520
	Add module.export for ES module support.
	20180619
	Add ts.
*/

// Define class of Timer
class Timer {
	
	// Define constructor
	constructor(func, period) {
		this.func = func;
		this.period = period;
		this.ticking = false;
		this.uid = 0;
	}
	
	start() {
		if(!this.ticking) {
			this.ticking = true;
			this.uid = setInterval(this.func, this.period);
		}
	}
	
	stop() {
		if(this.ticking) {
			this.ticking = false;
			clearInterval(this.uid);
		}
	}

	static ts() {
		var d = new Date;
		var hh = ("00" + d.getHours()).slice(-2);
		var mm = ("00" + d.getMinutes()).slice(-2);
		var ss = ("00" + d.getSeconds()).slice(-2);
		var ts = "" + hh + mm + ss;
		return ts;	
	}
}

// Export module
module.exports = function() {
	return Timer;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/*
	sample.js
	Sample data from calculated one
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180619
	Start this library.
*/

// Define class of Sample
class Sample {
	
	// Define constructor
	constructor(period, dt) {
		this.period = period;
		this.dt = dt;
		this.maxCount = parseInt(period / dt);
		this.count = this.maxCount;
	}
	
	sampling() {
		var state = false;
		if(this.count >= this.maxCount) {
			this.count = 0;
			state = true;
		}
		this.count++;
		return state;
	}
}

// Export module
module.exports = function() {
	return Sample;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

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


/***/ }),
/* 18 */
/***/ (function(module, exports) {

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


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/*
	integration.js
	Simple numerical integration
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180303
	Create this library of functions.
	20180520
	Add module.export for ES module support to about 14
	functions.
*/

// Integrate using Milne's rule until some error
function integMilneError(func, xbeg, xend, error) {
	var N = 1;
	var Aold = integMilneN(func, xbeg, xend, N);
	var dA = 1;
	while(dA > error) {
		N *= 2;
		var A = integMilneN(func, xbeg, xend, N);
		dA = Math.abs(A - Aold);
		Aold = A;
	}
	return Aold;
}

// Integrate a function using Milne's rule
function integMilneN(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg;
	for(var i = 0; i < N; i++) {
		var Ai = 2 * func(x) - func(x + dx / 2);
		Ai += 2 * func(x + dx);
		Ai *= dx / 3;
		A += Ai;
		x += dx;
	}
	return A;
}

// Integrate using Boole's rule until some error
function integBooleError(func, xbeg, xend, error) {
	var N = 1;
	var Aold = integBooleN(func, xbeg, xend, N);
	var dA = 1;
	while(dA > error) {
		N *= 2;
		var A = integBooleN(func, xbeg, xend, N);
		dA = Math.abs(A - Aold);
		Aold = A;
	}
	return Aold;
}

// Integrate a function using Boole's rule
function integBooleN(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg;
	for(var i = 0; i < N; i++) {
		var Ai = 7 * func(x) + 32 * func(x + dx / 4);
		Ai += 12 * func(x + 2 * dx / 4);
		Ai += 32 * func(x + 3 * dx / 4) + 7 * func(x + dx);
		Ai *= dx / 90;
		A += Ai;
		x += dx;
	}
	return A;
}

// Integrate using Simpson's 3/8 rule until some error
function integSimps38Error(func, xbeg, xend, error) {
	var N = 1;
	var Aold = integSimps38N(func, xbeg, xend, N);
	var dA = 1;
	while(dA > error) {
		N *= 2;
		var A = integSimps38N(func, xbeg, xend, N);
		dA = Math.abs(A - Aold);
		Aold = A;
	}
	return Aold;
}

// Integrate a function using Simpson's 3/8 rule
function integSimps38N(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg;
	for(var i = 0; i < N; i++) {
		var Ai = func(x) + 3 * func(x + dx / 3);
		Ai += 3 * func(x + 2 * dx / 3) + func(x + dx);
		Ai *= dx / 8;
		A += Ai;
		x += dx;
	}
	return A;
}

// Integrate using Simpson's rule until some error
function integSimpsError(func, xbeg, xend, error) {
	var N = 1;
	var Aold = integSimpsN(func, xbeg, xend, N);
	var dA = 1;
	while(dA > error) {
		N *= 2;
		var A = integSimpsN(func, xbeg, xend, N);
		dA = Math.abs(A - Aold);
		Aold = A;
	}
	return Aold;
}

// Integrate a function using Simpson's rule
function integSimpsN(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg;
	for(var i = 0; i < N; i++) {
		var Ai = func(x) + 4 * func(x + dx / 2) + func(x + dx);
		Ai *= dx / 6;
		A += Ai;
		x += dx;
	}
	return A;
}

// Integrate using trapezium rule until some error
function integTrapezError(func, xbeg, xend, error) {
	var N = 1;
	var Aold = integTrapezN(func, xbeg, xend, N);
	var dA = 1;
	while(dA > error) {
		N *= 2;
		var A = integRectNMid(func, xbeg, xend, N);
		dA = Math.abs(A - Aold);
		Aold = A;
	}
	return Aold;
}

// Integrate a function using trapezium rule
function integTrapezN(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg;
	for(var i = 0; i < N; i++) {
		var Ai = (func(x) + func(x + dx)) * dx / 2;
		A += Ai;
		x += dx;
	}
	return A;
}

// Integrate using rectangle rule until some error
function integRectError(func, xbeg, xend, error) {
	var N = 1;
	var Aold = integRectNMid(func, xbeg, xend, N);
	var dA = 1;
	while(dA > error) {
		N *= 2;
		var A = integRectNMid(func, xbeg, xend, N);
		dA = Math.abs(A - Aold);
		Aold = A;
	}
	return Aold;
}

// Integrate a function using rectangle rule (begin value)
function integRectNBeg(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg;
	for(var i = 0; i < N; i++) {
		var Ai = func(x) * dx;
		A += Ai;
		x += dx;
	}
	return A;
}

// Integrate a function using rectangle rule (mid value)
function integRectNMid(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg + dx / 2;
	for(var i = 0; i < N; i++) {
		var Ai = func(x) * dx;
		A += Ai;
		x += dx;
	}
	return A;
}

// Integrate a function using rectangle rule (end value)
function integRectNEnd(func, xbeg, xend, N) {
	var dx = (xend - xbeg) / N;
	var A = 0;
	var x = xbeg + dx;
	for(var i = 0; i < N;i ++) {
		var Ai = func(x) * dx;
		A += Ai;
		x += dx;
	}
	return A;
}

// Export module -- 20180520.0739 ok
module.exports = {
	integMilneError: function(func, xbeg, xend, error) {
		return integMilneError(func, xbeg, xend, error);
	},
	integMilneN: function(func, xbeg, xend, N) {
		return integMilneN(func, xbeg, xend, N);
	},
	integBooleError: function(func, xbeg, xend, error) {
		return integBooleError(func, xbeg, xend, error);
	},
	integBooleN: function(func, xbeg, xend, N) {
		return integBooleN(func, xbeg, xend, N);
	},
	integSimps38Error: function(func, xbeg, xend, error) {
		return integSimps38Error(func, xbeg, xend, error);
	},
	integSimps38N: function(func, xbeg, xend, N) {
		return integSimps38N(func, xbeg, xend, N);
	},
	integSimpsError: function(func, xbeg, xend, error) {
		return integSimpsError(func, xbeg, xend, error);
	},
	integSimpsN: function(func, xbeg, xend, N) {
		return integSimpsN(func, xbeg, xend, N);
	},
	integTrapezError: function(func, xbeg, xend, error) {
		return integTrapezError(func, xbeg, xend, error);
	},
	integTrapezN: function(func, xbeg, xend, N) {
		return integTrapezN(func, xbeg, xend, N);
	},
	integRectError: function(func, xbeg, xend, error) {
		return integRectError(func, xbeg, xend, error);
	},
	integRectNBeg: function(func, xbeg, xend, N) {
		return integRectNBeg(func, xbeg, xend, N);
	},
	integRectNMid: function(func, xbeg, xend, N) {
		return integRectNMid(func, xbeg, xend, N);
	},
	integRectNEnd: function(func, xbeg, xend, N) {
		return integRectNEnd(func, xbeg, xend, N);
	},
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/*
	polynomial.js
	Polynomial function of one variable
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180301
	Create this library and tested.
	20180519
	Fix unnecessary typo and implement node.js module.exports
	command.
	20180520
	Add comments and adjust export format as sequence.js script.
	Modify constructor by introducing single coefs with 0 value
	to avoid error in calculating polynomial order.
*/

// Define class of Polynomial
class Polynomial {
	
	// Define constructor
	constructor(coefs) {
		this.coefs = [0];
		this.order = 0;
		if(arguments.length > 0) {
			this.coefs = coefs;
			this.calcOrder();			
		}
	}
	
	// Calculate order of polynomial
	calcOrder() {
		var N = this.coefs.length;
		this.order = N;
	}
	
	// Set coefficients
	setCoefs(coefs) {
		this.coefs = coefs;
		this.calcOrder();
	}
	
	// Get coefficients
	getCoefs() {
		return this.coefs;
	}
	
	// Get value of function
	value(x) {
		var xn = 1;
		var f = 0;
		var N = this.order;
		for(var i = 0; i < N; i++) {
			var df = this.coefs[i] * xn;
			f += df;
			xn *= x;
		}
		return f;
	}
}

// Export module -- 20180520.0647 ok
module.exports = function() {
	return Polynomial;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/*
	transformation.js
	Simple coordinates transformation
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180221
	Create as a part of Chart2 class.
	20180618
	Move to this separate file for more broader use.
*/

// Transform linearly coordinate from real to screen
function linearTransform(x, src, dest) {
	// Get range of src and dest coordinates
	var xmin = src[0];
	var xmax = src[1];
	var XMIN = dest[0];
	var XMAX = dest[1];
	
	// Perform transformation
	var M = (XMAX - XMIN) / (xmax - xmin);
	var X = (x - xmin) * M + XMIN;
	
	return X;
}

// Export module -- 20180618.1133 ok
module.exports = {
	linearTransform: function(x, src, dest) {
		return linearTransform(x, src, dest);
	},
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/*
	path.js
	Path in the form of straight line or circular arc
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190529
	0838 Create this library based on lib/math/polynomial
	0934 Test and works. Add color c.
*/

// Define class of Path
class Path {
	
	// Define constructor
	constructor() {
		this.qi = arguments[0];
		this.qf = arguments[1];
		this.l = arguments[2];
		this.c = arguments[3];
	}
	
	// Set initial angle
	setQi() {
		this.qi = arguments[0];
		this.calcOrder();
	}
	
	// Set final angle
	setQf() {
		this.qf = arguments[0];
	}
	
	// Set angles
	setQ() {
		this.qi = arguments[0];
		this.qf = arguments[1];
	}
	
	// Set length
	setL() {
		this.l = arguments[0];
	}
	
	// Set color
	setL() {
		this.c = arguments[0];
	}
}

// Export module -- 20190529.0848 ok
module.exports = function() {
	return Path;
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/*
	points.js
	Points of x and y (and z) data
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190530
	1215 Create this library based on lib/math/path
*/

// Define class of Points
class Points {
	
	// Define constructor
	constructor() {
		this.data = [];
	}
	
	addSeries() {
		this.data.push(arguments[0]);
	}
}

// Export module -- 20190530.1227 ok
module.exports = function() {
	return Points;
};


/***/ })
/******/ ]);