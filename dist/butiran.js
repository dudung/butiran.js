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
	
	20190602
	1718 Add lib/ui for sslssgm app.
	
	20190616
	2019 Add lib/box for gfhtgr app.
	2032 Empty class is ok, fix at 2041.
	
	20160617
	0733 Finally install webpack in campus with command
	npm config set proxy http://user:pwd@proxy:port
	npm install -g webpack
	npm install -g webpack-cli
	0805 Done and webpack works as usual.
	0903 Add veio in lib/ui.
	
	References
	1. url https://www.competa.com/blog/how-to-run-npm
	   -without-sudo/ [20190617].
*/

// lib
var Grain = __webpack_require__(1)();
var Style = __webpack_require__(3);
var Vect3 = __webpack_require__(2)();
var Box = __webpack_require__(4)();

// lib/color
var RGB = __webpack_require__(5);

// lib/force
var Buoyant = __webpack_require__(6)();
var Drag = __webpack_require__(7)();
var Electrostatic = __webpack_require__(8)();
var Gravitational = __webpack_require__(9)();
var Magnetic = __webpack_require__(10)();
var Normal = __webpack_require__(11)();
var Spring = __webpack_require__(12)();

// lib/generator
var Generator = __webpack_require__(13)();
var Random = __webpack_require__(15);
var Sequence = __webpack_require__(14)();
var Timer = __webpack_require__(16)();
var Sample = __webpack_require__(17)();

// lib/grid
var Tablet = __webpack_require__(18);
var Pile = __webpack_require__(19)();

// lib/math
var Integration = __webpack_require__(20);
var Polynomial = __webpack_require__(21)();
var Transformation = __webpack_require__(22);
var Path = __webpack_require__(23)();

// lib/data
var Points = __webpack_require__(24)();

// lib/ui
var TabText = __webpack_require__(25);
var TabCanvas = __webpack_require__(26);
var Parse = __webpack_require__(27);
var Tabs = __webpack_require__(28)();
var Bgroup = __webpack_require__(29)();
var Veio = __webpack_require__(30);

// Store information 
if(typeof window !== 'undefined') {
	// Store to window object -- 20180519.2358
	
	// lib
	window["Grain"] = Grain;
	window["Style"] = Style;
	window["Vect3"] = Vect3;
	window["Box"] = Box;
	
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
	
	// lib/data/points
	window["Points"] = Points;
	
	// lib/ui
	window["TabText"] = TabText;
	window["TabCanvas"] = TabCanvas;
	window["Parse"] = Parse;
	window["Tabs"] = Tabs;
	window["Bgroup"] = Bgroup;
	window["Veio"] = Veio;
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
	20190530
	1658 Modify the use c as array of color [color, bgcolor].
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
/***/ (function(module, exports, __webpack_require__) {

/*
	box.js
	Library of box for colliding with granular particle
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	Dwi Irwanto | dirwanto@fi.ac.id
	
	20190616
	2011 Start for sustaining gfhtgr in app.
	2059 Finish defining 8 points, simplify with _ for .neg().
	2119 Modify strval function.
*/

// Require classes
var Vect3 = __webpack_require__(2)();

// Define class of Box
function Box() {
	// Define constructor
	if(arguments.length == 0) {
		this.r = new Vect3;
		this.s = [];
		this.s.push(new Vect3(1, 0, 0));
		this.s.push(new Vect3(0, 1, 0));
		this.s.push(new Vect3(0, 0, 1));
	} else if(arguments.length == 1) {
		this.r = arguments[0];
		this.s = [];
		this.s.push(new Vect3(1, 0, 0));
		this.s.push(new Vect3(0, 1, 0));
		this.s.push(new Vect3(0, 0, 1));
	} else if(arguments.length == 4) {
		this.r = arguments[0];
		this.s = [];
		this.s.push(arguments[1]);
		this.s.push(arguments[2]);
		this.s.push(arguments[3]);
	}
	
	// Initialize eight points
	var a = Vect3.div(this.s[0], 2);
	var b = Vect3.div(this.s[1], 2);
	var c = Vect3.div(this.s[2], 2);
	var a_ = a.neg();
	var b_ = b.neg();
	var c_ = c.neg();
	
	this.p = [];
	this.p.push(Vect3.add(this.r, a_, b_, c_));
	this.p.push(Vect3.add(this.r, a , b_, c_));
	this.p.push(Vect3.add(this.r, a , b , c_));
	this.p.push(Vect3.add(this.r, a_, b , c_));
	this.p.push(Vect3.add(this.r, a_, b_, c ));
	this.p.push(Vect3.add(this.r, a , b_, c ));
	this.p.push(Vect3.add(this.r, a , b , c ));
	this.p.push(Vect3.add(this.r, a_, b , c ));
	
	// View content in string format
	this.strval = function() {
		var str = "(";
		str += this.r.strval() + ", ";
		str += "[";
		str += this.s[0].strval() + ", ";
		str += this.s[1].strval() + ", ";
		str += this.s[2].strval() + "";
		str += "], ";
		str += "[";
		str += this.p[0].strval() + ", ";
		str += this.p[1].strval() + ", ";
		str += this.p[2].strval() + ", ";
		str += this.p[3].strval() + ", ";
		str += this.p[4].strval() + ", ";
		str += this.p[5].strval() + ", ";
		str += this.p[6].strval() + ", ";
		str += this.p[7].strval() + "";
		str += "]";
		str += ")";
		return str;
	}
}

// Export module -- 20190616.2021 ok (empty), 2100 ok (basic).
module.exports = function() {
	return Box;
};


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	buoyant.js
	Buoyant force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180602
	Create this library from previous force.js library.
	20190630
	2000 Add dir for non-horizontal fluid surface.
	20190531
	0630 Fix sliding on water surface plane.
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
	force() {
		var f = new Vect3;
		if(arguments[0] instanceof Grain) {
			if(arguments.length == 1) {
				// Fully immersed in water
				var D = arguments[0].D;
				var V = (Math.PI / 6) * D * D * D;
				var g = this.g.len();
				var rhof = this.rho;
				var n = this.g.unit().neg();
				f = Vect3.mul(rhof * g * V, n);
			} else if(arguments.length == 2) {
				// Only in -gacc direction
				var D = arguments[0].D;
				var yf = arguments[1];
				var y = arguments[0].r.y;
				
				var V = 0;
				if(y < yf - 0.5 * D) {
					V = (Math.PI / 6) * D * D * D;
				} else if(yf - 0.5 * D <= y && y <= yf + 0.5 * D) {
					var dy = yf - y;
					var V1 = 0.25 * D * D * (dy + 0.5 * D);
					var V2 = -(1/3) * (dy * dy * dy + D * D * D / 8);
					V = Math.PI * (V1 + V2);
				} else {
					V = 0;
				}
				var g = this.g.len();
				var rhof = this.rho;
				var n = this.g.unit().neg();
				f = Vect3.mul(rhof * g * V, n);				
			} else if(arguments.length == 4) {
				// Make an angle with -gacc direction
				var x = arguments[0].r.x;
				var D = arguments[0].D;
				var GField = this.g;
				var xA = x + 0.5 * D;
				var xB = x - 0.5 * D;
				var yA = arguments[1];
				var yB = arguments[2];
				var yf = arguments[3];
				//var yf = 0.5 * (yA + yB);
				var rA = new Vect3(xA, yA, 0);
				var rB = new Vect3(xB, yB, 0);
				var rAB = Vect3.sub(rA, rB);
				var nAB = rAB.unit();
				var nG = GField.unit();
				var nGaccent = Vect3.cross(Vect3.cross(nG, nAB), nAB);
				var fB;
				var rhof = this.rho;
				var y = arguments[0].r.y;
				if(y < yf - 0.5 * D) {
					//console.log("case 1");
					fB = (Math.PI / 6) * rhof * D * D * D * GField.len();
					nGaccent = Vect3.mul(-1, nG);
				} else if(yf - 0.5 * D <= y && y <= yf + 0.5 * D) {
					//console.log("case 2");
					var dy = yf - y;
					var term1 = 0.25 * D * D * (dy + 0.5 * D);
					var term2 = -(1/3) * (dy * dy * dy + D * D * D / 8);
					fB = Math.PI * rhof * (term1 + term2) * GField.len();
				} else {
					//console.log("case 3");
					fB = 0;
				}
				//console.log(y, yf - 0.5 * D, fB, nGaccent);
				f = Vect3.mul(fB, nGaccent);
			}
		}
		return f;
	}
}

// Export module -- 20180602.1944 ok
module.exports = function() {
	return Buoyant;
};


/***/ }),
/* 7 */
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
	setConstants(c0, c1, c2) {
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
/* 8 */
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
/* 9 */
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
/* 10 */
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
/* 11 */
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
	20190601
	1610 Change setConstant to setConstants.
	1903 Fix gamma term with sign of ksi.
	20190617
	1011 Change unit vector for ksidot term.
	1206 There is still a problem but unknown.
	2006 Add require of Box class.
	2049 Still error.
*/

// Require classes
var Vect3 = __webpack_require__(2)();
var Grain = __webpack_require__(1)();
var Box = __webpack_require__(4)();

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
	setConstants(k, gamma) {
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
			var ur12 = r12.unit();
			var l12 = r12.len();
			var v1 = arguments[0].v;
			var v2 = arguments[1].v;
			var v12 = Vect3.sub(v1, v2);
			var uv12 = v12.unit();
			
			var k = this.k;
			var gamma = this.gamma;
			
			var R12 = 0.5 * (D1 + D2);
			var ksi = Math.max(0, R12 - l12);
			var ksidot = v12.len() * Math.sign(ksi);
			
			var fr = Vect3.mul(k * ksi, ur12);
			var fv = Vect3.mul(-gamma * ksidot, uv12);
			f = Vect3.add(fr, fv);
		} else if(arguments[0] instanceof Grain &&
			arguments[1] instanceof Box) {
			var D1 = arguments[0].D;
			var r1 = arguments[0].r;
			var v1 = arguments[0].v;
			
			var n = [];
			var b = arguments[1];
			var r2 = b.r;
			var n1 = b.s[0].unit(); n.push(n1);
			var n2 = b.s[1].unit(); n.push(n2);
			var n3 = b.s[2].unit(); n.push(n3);
			var n4 = n1.neg(); n.push(n4);
			var n5 = n2.neg(); n.push(n5);
			var n6 = n3.neg(); n.push(n6);
			var r12 = Vect3.sub(r1, r2);
			var ur12 = r12.unit();
			
			var v2 = new Vect3;
			var v12 = Vect3.sub(v1, v2);
			var uv12 = v12.unit();
			
			var dotmax;
			var j = -1;
			for(var i = 0; i < n.length; i++) {
				if(i == 0) {
					dotmax = Vect3.dot(n[i], ur12);
					j = i;
				} else {
					if(Vect3.dot(n[i], ur12) > dotmax) {
						dotmax = Vect3.dot(n[i], ur12);
						j = i;
					}
				}
			}
			var un = n[j];
			
			var stot = Vect3.add(b.s[0], b.s[1], b.s[2]);
			var h12 = Vect3.dot(r12, un) - 0.5 * Vect3.dot(stot, un);
			var ksi = Math.max(0, 0.5 * D1 - h12);
			
			var k = this.k;
			var gamma = this.gamma;
						
			var ksidot = v12.len() * Math.sign(ksi);
			
			var fr = Vect3.mul(k * ksi, ur12);
			var fv = Vect3.mul(-gamma * ksidot, uv12);
			f = Vect3.add(fr, fv);
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	spring.js
	Spring force
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180603
	Create this library from previous force.js and
	normal.js libraries.
	20190601
	1608 Change setConstant to setConstants.
	1625 Fix comment normal to spring.
	20190602
	1508 Seek problem by relaxing spring.
	1515 Fix it for two grains but not yet tested for one.
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
	setConstants(k, gamma) {
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
	
	// Calculate spring force
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
				
				var fr = Vect3.mul(-k * ksi, u12);
				var fv = Vect3.mul(-gamma * ksidot, v12);
				f = Vect3.add(fr, fv);
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
				
				var fr = Vect3.mul(-k * ksi, u12);
				var fv = Vect3.mul(-gamma * ksidot, v12);
				f = Vect3.add(fr, fv);
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
/* 13 */
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
var Sequence = __webpack_require__(14)();

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
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
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
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
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
/* 23 */
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
/* 24 */
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


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/*
	tabtext.js
	Tabs of textarea for input and output in simulation using
	butiran.js library.
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180613
	Start it from lib/grid/table.js in butiran.js libraries and
	functions.
	Constructing createAndSetLayoutElements, createStyle.
	20180614
	Continue creating this application, with functions
	createIODiv, createAllStyles, changeStyleAttribute, openTA.
	Rename createIODiv to createIOTabText.
	Add pop and push.
	Two or more instance will still sharing same elementId.
	It is still a bug.
*/

// Reserver id of textareas
var taIds = [];
var taId;

// Create IO division based on several divs and a textarea
function createTabTextIO(menu, parent, dimension) {
	// Set style of the tab
	Style.createStyle(`
	.tab {
		overflow: hidden;
		width: 200px;
		height: 300px;
		background: #f1f1f1;
		border: 1px solid #ccc;
		float: left;
	}
	`);

	// Set style of the buttons inside the tab
	Style.createStyle(`
	.tab button {
		background: #ddd;
		float: left;
		outline: none;
		border: none;
		padding: 6px 6px;
		width: 60px;
		height: 28px;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	`);

	// Set style of the buttons inside the tab on mouse hover
	Style.createStyle(`
	.tab button:hover {
		background: #e7e7e7;
		color: #000;
	}
	`);

	// Set style of current active button
	Style.createStyle(`
	.tab button.active {
		background: #f1f1f1;
		color: #000;
	}
	`);
	
	// Set style of div content, parent of textarea
	Style.createStyle(`
	.divcontent {
		clear: both;
		padding: 4px 4px;
		background: inherit;
	}
	`);
	
	// Set style of tab content, which is a textarea
	Style.createStyle(`
	.tabcontent {
		width: 182px;
		display: none;
		padding: 4px 6px;
		overflow-Y: scroll;
		border: 1px solid #aaa;
	}
	`);
	
	// Get IODiv dimension
	width = dimension.width;
	height = dimension.height;
	
	// Get number of menu item
	var N = menu.length;

	// Adjust IODiv dimension
	var div = document.createElement("div");
	div.className = "tab";
	Style.changeStyleAttribute(".tab", "width", width);
	Style.changeStyleAttribute(".tab", "height", height);
	parent.append(div);
	
	// Adjust button width	
	var btnWidth = Math.floor(parseInt(dimension.width) / N) +
		"px";
	Style.changeStyleAttribute(".tab button", "width",
		btnWidth);
	
	for(var i = 0; i < N; i++) {
		var btnMenu = document.createElement("button");
		btnMenu.id = "btn" + menu[i];
		btnMenu.innerHTML = menu[i];
		btnMenu.className = "tablinks";
		btnMenu.addEventListener("click", openTabText);
		div.append(btnMenu);
	}
	
	var divMenu = document.createElement("div");
	divMenu.className = "divcontent";
	divMenu.id = "divMenu";
	for(var i = 0; i < N; i++) {
		var taMenu = document.createElement("textarea");
		taMenu.id = "ta" + menu[i];
		taIds.push(taMenu.id);
		taMenu.innerHTML = menu[i];
		taMenu.className = "tabcontent";
		divMenu.append(taMenu);
	}
	div.append(divMenu);
	
	// Get dimension of elements and set its children's
	var btnPadTop =
		Style.getStyleAttribute(".tab button", "paddingTop");
	var btnPadBtm =
		Style.getStyleAttribute(".tab button", "paddingBottom");
	var btnHeight =
		Style.getStyleAttribute(".tab button", "height");
	var divHeight = (parseInt(height) - parseInt(btnHeight)
		- parseInt(btnPadTop) - parseInt(btnPadBtm)) + "px";
	Style.changeStyleAttribute(".divcontent", "height",
		divHeight);
	
	var divPadTop =
		Style.getStyleAttribute(".divcontent", "paddingTop");
	var divPadBtm =
		Style.getStyleAttribute(".divcontent", "paddingBottom");
	var tabCoB =
		Style.getStyleAttribute(".tabcontent", "borderWidth");
	var tabCoH = (parseInt(divHeight) - parseInt(divPadTop)
		- parseInt(divPadBtm) + 2 * parseInt(tabCoB)) + "px";
	Style.changeStyleAttribute(".tabcontent", "height",
		tabCoH);
	
	var tabCoPL = 
		Style.getStyleAttribute(".tabcontent", "paddingLeft");
	var tabCoPR = 
		Style.getStyleAttribute(".tabcontent", "paddingRight");
	var scrollBarWidth = 10; // Not known
	var tabCoW = (parseInt(width) - parseInt(tabCoPL)
		- parseInt(tabCoPR) - scrollBarWidth) + "px";
	Style.changeStyleAttribute(".tabcontent", "width", tabCoW);
	
	/*
	20180614.1301 There are still some problems with dimension,
	and child - parent size relations in width and height.
	*/
	
	// Call initial active button and textarea
	openTabText(0);
	
	return taIds;
}

// Open a textarea
function openTabText(event) {
	// Remove active from all button
	var tablinks = document.getElementsByClassName("tablinks");
	var N = tablinks.length;
	for(var i = 0; i < N; i++) {
		var className = tablinks[i].className;
		var newClassName = className.replace("active", "");
		tablinks[i].className = newClassName;
	}
	
	// Hide all tabcontent
	var tabcont = document.getElementsByClassName("tabcontent");
	var N = tabcont.length;
	for(var i = 0; i < N; i++) {
		tabcont[i].style.display = "none";
	}
	
	// Set active to current button and show related content
	var target = event.target;
	if(target != undefined) {
		target.className += " active";
		var id = "ta" + target.id.substring(3);
		var ta = document.getElementById(id);
		ta.style.display = "block";
	} else {
		var id = event;
		tablinks[0].className += " active";
		tabcont[0].style.display = "block";
	}
}

// Set id
function setId(id) {
	taId = taIds[id];
}

// Pop last line from textarea
function pop(id) {
	var ta = document.getElementById(taId);
	var val = ta.value;
	var lines = val.split("\n");
	var last = lines.pop();
	val = lines.join("\n");
	ta.value = val;
	return last;
}

// Push to textarea
function push(line) {
	var ta = document.getElementById(taId);
	var val = ta.value;
	var lines = val.split("\n");
	lines.push(line);
	val = lines.join("\n");
	ta.value = val;
}

// Export module
module.exports = {
	createTabTextIO: function(menu, parent, dimension) {
		return createTabTextIO(menu, parent, dimension)
	},
	openTabText: function(event) {
		return openTabText(event);
	},
	setId: function(id) {
		return setId(id);
	},
	pop: function() {
		return pop();
	},
	push: function(line) {
		return push(line);
	},
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/*
	tabcanvas.js
	Tabs of canvas for input and output in simulation using
	butiran.js library.
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180614
	Start by modifying lib/ui/tabcanvas.js libraries and
	functions.
	Two or more instance will still sharing same elementId.
	It is still a bug.
*/

// Reserver id of textareas
var canIds = [];
var canId;

// Create IO division based on several divs and a textarea
function createTabCanvasIO(menu, parent, dimension) {
	// Set style of the tab
	Style.createStyle(`
	.tabcan {
		overflow: hidden;
		width: 200px;
		height: 300px;
		background: #f1f1f1;
		border: 1px solid #ccc;
		float: left;
	}
	`);

	// Set style of the buttons inside the tab
	Style.createStyle(`
	.tabcan button {
		background: #ddd;
		float: left;
		outline: none;
		border: none;
		padding: 6px 6px;
		width: 60px;
		height: 28px;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	`);

	// Set style of the buttons inside the tab on mouse hover
	Style.createStyle(`
	.tabcan button:hover {
		background: #e7e7e7;
		color: #000;
	}
	`);

	// Set style of current active button
	Style.createStyle(`
	.tabcan button.active {
		background: #f1f1f1;
		color: #000;
	}
	`);
	
	// Set style of div content, parent of textarea
	Style.createStyle(`
	.divcontentcan {
		clear: both;
		padding: 4px 4px;
		background: inherit;
	}
	`);
	
	// Set style of tab content, which is a textarea
	Style.createStyle(`
	.tabcontentcan {
		width: 182px;
		display: none;
		padding: 4px 6px;
		overflow-Y: scroll;
		border: 1px solid #aaa;
	}
	`);
	
	// Get IODiv dimension
	width = dimension.width;
	height = dimension.height;
	
	// Get number of menu item
	var N = menu.length;

	// Adjust IODiv dimension
	var div = document.createElement("div");
	div.className = "tabcan";
	Style.changeStyleAttribute(".tabcan", "width", width);
	Style.changeStyleAttribute(".tabcan", "height", height);
	parent.append(div);
	
	// Adjust button width	
	var btnWidth = Math.floor(parseInt(dimension.width) / N) +
		"px";
	Style.changeStyleAttribute(".tabcan button", "width",
		btnWidth);
	
	for(var i = 0; i < N; i++) {
		var btnMenu = document.createElement("button");
		btnMenu.id = "btc" + menu[i];
		btnMenu.innerHTML = menu[i];
		btnMenu.className = "tablinkscan";
		btnMenu.addEventListener("click", openTabCanvas);
		div.append(btnMenu);
	}
	
	var divMenu = document.createElement("div");
	divMenu.className = "divcontentcan";
	divMenu.id = "divMenuCan";
	for(var i = 0; i < N; i++) {
		var taMenu = document.createElement("textarea");
		taMenu.id = "can" + menu[i];
		canIds.push(taMenu.id);
		taMenu.innerHTML = menu[i];
		taMenu.className = "tabcontentcan";
		divMenu.append(taMenu);
	}
	div.append(divMenu);
	
	// Get dimension of elements and set its children's
	var btnPadTop =
		Style.getStyleAttribute(".tabcan button", "paddingTop");
	var btnPadBtm =
		Style.getStyleAttribute(".tabcan button", "paddingBottom");
	var btnHeight =
		Style.getStyleAttribute(".tabcan button", "height");
	var divHeight = (parseInt(height) - parseInt(btnHeight)
		- parseInt(btnPadTop) - parseInt(btnPadBtm)) + "px";
	Style.changeStyleAttribute(".divcontent", "height",
		divHeight);
	
	var divPadTop =
		Style.getStyleAttribute(".divcontentcan", "paddingTop");
	var divPadBtm =
		Style.getStyleAttribute(".divcontentcan", "paddingBottom");
	var tabCoB =
		Style.getStyleAttribute(".tabcontentcan", "borderWidth");
	var tabCoH = (parseInt(divHeight) - parseInt(divPadTop)
		- parseInt(divPadBtm) + 2 * parseInt(tabCoB)) + "px";
	Style.changeStyleAttribute(".tabcontentcan", "height",
		tabCoH);
	
	var tabCoPL = 
		Style.getStyleAttribute(".tabcontentcan", "paddingLeft");
	var tabCoPR = 
		Style.getStyleAttribute(".tabcontentcan", "paddingRight");
	var scrollBarWidth = 10; // Not known
	var tabCoW = (parseInt(width) - parseInt(tabCoPL)
		- parseInt(tabCoPR) - scrollBarWidth) + "px";
	Style.changeStyleAttribute(".tabcontentcan", "width", tabCoW);
	
	/*
	20180614.1301 There are still some problems with dimension,
	and child - parent size relations in width and height.
	*/
	
	// Call initial active button and textarea
	openTabCanvas(0);
	
	return canIds;
}

// Open a canvas
function openTabCanvas(event) {
	// Remove active from all button
	var tablinks = document.getElementsByClassName("tablinkscan");
	var N = tablinks.length;
	for(var i = 0; i < N; i++) {
		var className = tablinks[i].className;
		var newClassName = className.replace("active", "");
		tablinks[i].className = newClassName;
	}
	
	// Hide all tabcontent
	var tabcont = document.getElementsByClassName("tabcontentcan");
	var N = tabcont.length;
	for(var i = 0; i < N; i++) {
		tabcont[i].style.display = "none";
	}
	
	// Set active to current button and show related content
	var target = event.target;
	if(target != undefined) {
		target.className += " active";
		var id = "can" + target.id.substring(3);
		var ta = document.getElementById(id);
		ta.style.display = "block";
	} else {
		var id = event;
		tablinks[0].className += " active";
		tabcont[0].style.display = "block";
	}
}

// Set id
function setId(id) {
	canId = canIds[id];
}

// Pop last line from textarea
function pop(id) {
	var ta = document.getElementById(taId);
	var val = ta.value;
	var lines = val.split("\n");
	var last = lines.pop();
	val = lines.join("\n");
	ta.value = val;
	return last;
}

// Push to textarea
function push(line) {
	var ta = document.getElementById(taId);
	var val = ta.value;
	var lines = val.split("\n");
	lines.push(line);
	val = lines.join("\n");
	ta.value = val;
}

// Export module
module.exports = {
	createTabCanvasIO: function(menu, parent, dimension) {
		return createTabCanvasIO(menu, parent, dimension)
	},
	openTabCanvas: function(event) {
		return openTabCanvas(event);
	},
	setId: function(id) {
		return setId(id);
	},
	pop: function() {
		return pop();
	},
	push: function(line) {
		return push(line);
	},
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/*
	parse.js
	Parse key and value pair
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180618
	Create this library of functions.
	20180619
	Get column from multiline text.
	20180627
	Add new function for handling 4 parameters in a line.
	20190602
	1736 Try to recover missing getFrom().valueBetween().
	2005 Finally done.
*/

// Require classes
var Vect3 = __webpack_require__(2)();

// Get value of related key from multi line text with '\n'
function getFrom(text) {
	var par = {
		valueOf: function(key) {
			var lines = text.split('\n');
			var N = lines.length;
			var val;
			for(var i = 0; i < N; i++) {
				var j = lines[i].indexOf(key);
				if(j != -1) {
					var cols = lines[i].split(' ');
					var M = cols.length;
					if(M == 2) {
						val = parseFloat(cols[1]);
					} else if(M == 4) {
						var x = parseFloat(cols[1]);
						var y = parseFloat(cols[2]);
						var z = parseFloat(cols[3]);
						val = new Vect3(x, y, z)
					} else if(M == 5) {
						val = [
							parseFloat(cols[1]),
							parseFloat(cols[2]),
							parseFloat(cols[3]),
							parseFloat(cols[4])
						];
					}
				}
			}
			return val;
		},
		column: function(jcol) {
			var lines = text.split('\n');
			var N = lines.length;
			var val = [];
			for(var i = 0; i < N; i++) {
				var cols = lines[i].split(" ");
				val.push(parseFloat(cols[jcol]));
			}
			return val;
		},
		valueBetween: function(beg, end) {
			var lines = text.split('\n');
			var N = lines.length;
			var val = [];
			var iBeg, iEnd;
			for(var i = 0; i < N; i++) {
				if(lines[i].indexOf(beg) == 0) {
					iBeg = i;
				}
				if(lines[i].indexOf(end) == 0) {
					iEnd = i;
				}
			}
			
			for(var i = iBeg + 1; i < iEnd-1; i++) {
				var cols = lines[i].split(" ");
				for(var j = 0; j < cols.length; j++) {
					var rrr = parseFloat(cols[j]);
					val.push(rrr);
				}
			}
			
			/*
			// For testing only
			val.push(0); val.push(0); val.push(0);
			val.push(1); val.push(0); val.push(0);
			val.push(2); val.push(0); val.push(0);
			*/
			
			return val;
		},
	};
	return par;
}

// Export module
module.exports = {
	getFrom: function(text) {
		return getFrom(text)
	},
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/*
	tabs.js
	A GUI based on div element for containing visual elements,
	e.g. textarea and canvas, which can be hidden and shown
	using appropriate button
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180615
	Create this class in order to overcome problem of not
	unique ID of elements as TabText and TabCanvas functions
	are used.
	20180616
	Continue creating this class. Class style tablinks must
	also be labeled with id.
	20180617
	Fix referencing to this in event handler.
	Fix size of canvas.
	Canvas and textarea can be accessed through text(label)
	graphic(label).
	20180618
	Add element(label) for alternative to textarea(label) and
	canvas(label).
	20180714
	Remove a line in arch outputting to console.
*/

// Define class of Tabs
class Tabs {
	// Create constructor
	constructor() {
		// Set rules for number of arguments
		if(arguments.length == 0) {
			var msg = "Tabs requires id (and parentId) as "
				+ "arguments";
			throw new Error(msg);
		} else if(arguments.length == 1){
			this.id = arguments[0];
			this.parentId = "document.body";
			var msg = "Tabs " + this.id + " assumes that parent is"
				+ " document.body";
			console.warn(msg);
		} else {
			this.id = arguments[0];
			this.parentId = arguments[1]
		}
		
		// Check whether id already exists
		var el = document.getElementById(this.id);
		var idExist = (el != undefined)
		if(idExist) {
			var msg = this.id + " exists";
			throw new Error(msg)
		}
		
		// Create style
		this.createAllStyle(this.id);
		this.tabcs = "tab" + this.id;
		this.tabbtncs = "tab" + this.id + " button";
		this.tablinkscs =  "tablinks" + this.id;
		this.divcontcs =  "divcontent" + this.id;
		this.tabcontcs =  "tabcontent" + this.id;
		
		// Try not so good workaround
		localStorage.setItem(this.tablinkscs, this.tablinkscs);
		localStorage.setItem(this.tabcontcs, this.tabcontcs);
		
		// Define visual container
		var tab  = document.createElement("div");
		tab.id = this.id;
		tab.className = this.tabcs;
		this.tab = tab;
		
		// Set parent of Tabs instance
		if(this.parentId == "document.body") {
			document.body.append(this.tab);
		} else {
			var el = document.getElementById(this.parentId);
			el.append(this.tab);
		}
		
		// Define array for storing tab button information
		this.tabs = [];
		this.tabsType = [];
	}
	
	// Set background color
	setBackground(color) {
		Style.changeStyleAttribute('.' + this.tabcs,
			"background", color);
	}
	
	// Set width
	setWidth(width) {
		Style.changeStyleAttribute('.' + this.tabcs,
			"width", width);		
	}
	
	// Set hight
	setHeight(height) {
		Style.changeStyleAttribute('.' + this.tabcs,
			"height", height);		
	}
	
	// Ada label for tab button
	addTab(label, type) {
		// Erase div
		var divid = this.id + "div";
		var div = document.getElementById(divid);
		if(div != undefined) {
			div.remove();
		}
		
		// Avoid same tab label
		var ilabel = this.tabs.indexOf(label);
		if(ilabel < 0) {
			this.tabs.push(label);
			this.tabsType.push(type);
		} else {
			var msg = "Duplicate label " + label + " is igonered";
			console.warn(msg);
		}
		
		// Create tab buttons
		var N = this.tabs.length;
		for(var i = 0; i < N; i++) {
			var id = this.id + this.tabs[i];
			var btn = document.getElementById(id);
			if(btn == undefined) {
				var btn = document.createElement("button");
				btn.id = id;
				btn.className = this.tablinkscs;
				btn.innerHTML = this.tabs[i];
				btn.addEventListener("click", this.toggleContent)
				this.tab.append(btn);
			}
		}
		
		// Recreate div -- without following line act differently
		// when number of tab buttons is odd or even
		div = document.getElementById(divid);
		if(div == undefined) {
			var div = document.createElement("div");
			div.id = divid;
			div.className = this.divcontcs;
			this.tab.append(div);
		}
		
		// Adjust textarea or canvas width
		var width = parseInt(Style.getStyleAttribute('.' +
			this.tabcs, "width"));
		var pl = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingLeft"));
		var pr = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingRight"));
		var dh = 14;
		var tcwidth = (width - pl - pr - dh) + "px";
		Style.changeStyleAttribute('.' + this.tabcontcs,
			"width", tcwidth);
		
		var height = parseInt(Style.getStyleAttribute('.' +
			this.tabcs, "height"));
		var pt = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingTop"));
		var pb = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingBottom"));
		var dv = 38;
		var tcheight = (height - pt - pb - dv) + "px";
		Style.changeStyleAttribute('.' + this.tabcontcs,
			"height", tcheight);

		// Create content of div
		for(var i = 0; i < N; i++) {
			var id = this.id + this.tabs[i] + "content";
			var el = document.getElementById(id);
			if(el == undefined) {
				var el;
				if(this.tabsType[i] == 0) {
					el = document.createElement("textarea");
					el.className = this.tabcontcs;
					el.innerHTML = this.tabs[i];
				} else if(this.tabsType[i] == 1) {
					el = document.createElement("canvas");
					el.className = this.tabcontcs;
					el.width = parseInt(tcwidth);
					el.height = parseInt(tcheight);
					el.getContext("2d").font = "12px Courier";
					el.getContext("2d").fillText(this.tabs[i], 2, 10);
					el.getContext("2d").beginPath();
					el.getContext("2d")
						.arc(45, 45, 20, 0, 2 * Math.PI);
					el.getContext("2d").stroke();
					el.getContext("2d").beginPath();
					el.getContext("2d")
						.arc(55, 25, 10, 0, 2 * Math.PI);
					el.getContext("2d").stroke();
				}
				el.id = id;
				div.append(el);
			}
		}
		
		// Adjust width according to number of tab buttons
		this.updateTabButtonsWidth();
		
		// Initiate visible tab -- 20180617.0918
		this.toggleContent(0);
	}
	
	// Remove label for tab button
	removeTab(label) {
		// 20180616.0445
		// Tom Wadley, Beau Smith
		// https://stackoverflow.com/a/5767357/9475509
		var i = this.tabs.indexOf(label);
		var remE = this.tabs.splice(i, 1);
		this.tabsType.splice(i, 1);
		
		// Warn only for unexisting label for removing
		if(i < 0) {
			var msg = "Unexisting label " + label + " for removing "
				+ "is igonered";
			console.warn(msg);
		}
		
		// 20180616.1612
		// Catalin Rosu
		// https://catalin.red/removing-an-element-with
		// -plain-javascript-remove-method/
		
		// Remove tab button
		var id = this.id + remE;
		var btn = document.getElementById(id);
		btn.remove();
		this.updateTabButtonsWidth();
		
		// Remove element related to tab button
		var id2 = this.id + remE + "content";
		var el = document.getElementById(id2);
		el.remove();
		
		// Initiate visible tab after remove a tab button
		// -- 20180617.1031
		this.toggleContent(0);
	}
	
	// Check and update tab buttons
	updateTabButtonsWidth() {
		var N = this.tabs.length;
		var M = document.getElementsByClassName(this.tablinkscs)
			.length;
		// Make sure that label and tabbutton have the same size
		if(M == N) {
			var width =
				Style.getStyleAttribute('.' + this.tabcs, "width");
			var btnWidth = parseInt(width) / N + "px";
			Style.changeStyleAttribute('.' + this.tabbtncs,
				"width", btnWidth);
		}
	}
	
	// Get class name -- problem by event also not work
	getStyleClassName() {
		var scn = [];
		scn.push(this.tabcs);
		scn.push(this.tabbtncs);
		scn.push(this.tablinkscs);
		scn.push(this.tabcontcs);
		return scn;
	}
		
	// Toggle tab content when button clicked
	toggleContent() {
		// The idea using styles is from
		// https://www.w3schools.com/howto/howto_js_tabs.asp
		
		if(event != undefined) {
			// Get style name with workaround using localStorage
			var parent = event.target.parentElement;
			var tlcs = localStorage
				.getItem("tablinks" + parent.id);
			var tccs = localStorage
				.getItem("tabcontent" + parent.id);

			// Remove active from all button
			var tablinks = document.getElementsByClassName(tlcs);
			var N = tablinks.length;
			for(var i = 0; i < N; i++) {
				var className = tablinks[i].className;
				var newClassName = className.replace("active", "");
				tablinks[i].className = newClassName;
			}
			
			// Hide all tabcontent
			var tabcont = document.getElementsByClassName(tccs);
			var N = tabcont.length;
			for(var i = 0; i < N; i++) {
				tabcont[i].style.display = "none";
			}
			
			// Set active to current button and show related content
			var target = event.target;
			target.className += " active";
			var id = target.id + "content";
			var el = document.getElementById(id);
			el.style.display = "block";
		} else {
			var i = arguments[0];
			var id = this.id;
			var tlcs = localStorage.getItem("tablinks" + id);
			var tccs = localStorage.getItem("tabcontent" + id);
			var tablinks = document.getElementsByClassName(tlcs);
			var tabcont = document.getElementsByClassName(tccs);
			
			// Fixed -- 20180617.0918 for undefined
			// -- 1020 for multiple active
			if(tablinks.length > 0 && tabcont.length > 0) {
				var className = tablinks[i].className;
				var newClassName = className.replace("active", "");
				tablinks[i].className = newClassName;
				tablinks[i].className += " active";
				tabcont[i].style.display = "block";
			}
		}
	}
	
	// Create default style for this class
	createAllStyle(id) {
		// Set style of the tab
		Style.createStyle(
		'.tab' + id + ` {
			overflow: hidden;
			width: 240px;
			height: 200px;
			background: #f1f1f1;
			border: 1px solid #ccc;
			float: left;
		}
		`);

		// Set style of the buttons inside the tab
		Style.createStyle(
		'.tab' + id +  ` button {
			background: #ddd;
			float: left;
			outline: none;
			border: none;
			padding: 6px 6px;
			width: 60px;
			height: 28px;
			cursor: pointer;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		`);

		// Set style of the buttons inside the tab on mouse hover
		Style.createStyle(
		'.tab' + id + ` button:hover {
			background: #e7e7e7;
			color: #000;
		}
		`);

		// Set style of current active button
		Style.createStyle(
		'.tab' + id + ` button.active {
			background: #f1f1f1;
			color: #000;
		}
		`);
		
		// Set style of div content, parent of textarea
		Style.createStyle(
		'.divcontent' + id + ` {
			clear: both;
			padding: 4px 4px;
			background: inherit;
		}
		`);
		
		// Set style of tab content, which is a textarea
		Style.createStyle(
		'.tabcontent' + id + ` {
			width: 182px;
			display: none;
			padding: 4px 6px;
			overflow-Y: scroll;
			border: 1px solid #aaa;
			background: #fff;
			margin: 0px;
		}
		`);
	}
	
	// Get access to textarea of tab with name
	textarea(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var nottextarea = !(el instanceof HTMLTextAreaElement);
		if(nottextarea) {
			var msg = "Tabs " + this.id + " " + label +
				" is not as a textarea";
			throw new Error(msg);
		} else {
			return el;
		}
	}
	
	// Get access to canvas of tab with name
	canvas(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var notcanvas = !(el instanceof HTMLCanvasElement);
		if(notcanvas) {
			var msg = "Tabs " + this.id + " " + label +
				" is not as a canvas";
			throw new Error(msg);
		} else {
			return el;
		}
	}
	
	// Get element
	element(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		return el;
	}
	
	// Manipulate directly tab content of type text
	text(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var textarea = (el instanceof HTMLTextAreaElement);
		
		// Handle content as textarea
		if(textarea) {
			var lines = el.value.split("\n");
			var tav = {
				push: function(line) {
					// Avoid first empty line after clear textarea
					if(lines.length == 1 && lines[0].length == 0) {
						lines[0] = line;
					} else {
						lines.push(line);
					}
					var val = lines.join("\n");
					el.value = val;
				},
				pop: function() {
					var pl = lines.pop();
					var val = lines.join("\n");
					el.value = val;
					return pl;
				},
				popAll: function() {
					el.value;
					return lines;
				},
				clear: function() {
					el.value = "";
				},
			}
			return tav;
		} else {
			var msg = this.id + " " + this.tabs[i] +
				" is not a textarea";
			throw new Error(msg);
		}
	}

	// Manipulate directly tab content of type graphic
	graphic(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var canvas = (el instanceof HTMLCanvasElement);
		var ctx = el.getContext("2d");
		
		// Handle content as canvas
		if(canvas) {
			// Define COORD
			el.RANGE = [0, el.height, el.width, 0];
			
			// Define object for handling drawing process
			var can = {
				setCoord: function(range) {
					el.range = range;
				},
				getCoord: function() {
					return el.range;
				},
				getCOORD: function() {
					return el.RANGE;
				},
				setLineColor: function(color) {
					ctx.strokeStyle = color;
				},
				setFillColor: function(color) {
					ctx.fillStyle = color;
				},
				trect: function(x, y, width, height) {
					var xx = Transformation.linearTransform(
						x,
						[el.range[0], el.range[2]], 
						[el.RANGE[0], el.RANGE[2]]
					);
					var yy = Transformation.linearTransform(
						y,
						[el.range[1], el.range[3]], 
						[el.RANGE[1], el.RANGE[3]]
					);
					var xxdx = Transformation.linearTransform(
						x + width,
						[el.range[0], el.range[2]], 
						[el.RANGE[0], el.RANGE[2]]
					);
					var yydy = Transformation.linearTransform(
						y + height,
						[el.range[1], el.range[3]], 
						[el.RANGE[1], el.RANGE[3]]
					);
					var ww = xxdx - xx;
					var hh = yydy - yy;
					return [xx, yy, ww, hh];
				},
				rect: function(x, y, width, height) {
					var tc = this.trect(x, y, width, height);
					ctx.rect(tc[0], tc[1], tc[2], tc[3]);
				},
				strokeRect: function(x, y, width, height) {
					var tc = this.trect(x, y, width, height);
					ctx.strokeRect(tc[0], tc[1], tc[2], tc[3]);
				},
				fillRect: function(x, y, width, height) {
					var tc = this.trect(x, y, width, height);
					ctx.fillRect(tc[0], tc[1], tc[2], tc[3]);
				},
				arc: function(x, y, r, sAngle, eAngle) {
					var tc = this.trect(x, y, r, r);
					ctx.beginPath();
					ctx.arc(tc[0], tc[1], tc[2], sAngle, eAngle);
					ctx.stroke();
				},
				strokeCircle: function(x, y, r) {
					this.arc(x, y, r, 0, 2 * Math.PI);
				},
				fillCircle: function(x, y, r) {
					this.arc(x, y, r, 0, 2 * Math.PI);
					ctx.fill();
				},
				setPointType: function(pointType) {
					el.pointType = pointType;
				},
				setPointSize: function(pointSize) {
					el.pointSize = pointSize;
				},
				point: function(x, y) {
					var r = el.pointSize;
					var t = el.pointType;
					if(t == "circle") {
						var tc = this.trect(x, y, r, r);
						ctx.beginPath();
						ctx.arc(tc[0], tc[1], 0.5 * r, 0, 2 * Math.PI);
						ctx.stroke();
					} else if(t == "box") {
						var tc = this.trect(x, y, r, r);
						var dr = 0.5 * r;
						ctx.strokeRect(tc[0] - dr, tc[1] - dr, r, r);
					}
				},
				points: function(x, y) {
					var Nx = x.length;
					var Ny = y.length;
					var N = Math.min(Nx, Ny);
					for(var i = 0; i < N; i++) {
						this.point(x[i], y[i]);
					}
				},
				lines: function(x, y) {
					var Nx = x.length;
					var Ny = y.length;
					var N = Math.min(Nx, Ny);
					ctx.beginPath();
					for(var i = 0; i < N; i++) {
						var xi = x[i];
						var yi = y[i];
						var tc = this.trect(xi, yi, 0, 0);
						if(i == 0) {
							ctx.moveTo(tc[0], tc[1]);
						} else {
							ctx.lineTo(tc[0], tc[1]);
						}
					}
					ctx.stroke();
				},
				clear: function() {
					ctx.clearRect(0, 0, el.width, el.height);
				},
			}
			return can;
		} else {
			var msg = this.id + " " + this.tabs[i] +
				" is not a canvas";
			throw new Error(msg);
		}
	}
}

// Export module
module.exports = function() {
	return Tabs;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/*
	bgroup.js
	A GUI based on div element for containing buttons
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180619
	Create this based on Tabs.
	Add enable, disable, setCaption.
*/

// Define class of Bgroup
class Bgroup {
	// Create constructor
	constructor() {
		// Set rules for number of arguments
		if(arguments.length == 0) {
			var msg = "Bgroup requires id (and parentId) as "
				+ "arguments";
			throw new Error(msg);
		} else if(arguments.length == 1){
			this.id = arguments[0];
			this.parentId = "document.body";
			var msg = "Bgroup " + this.id + " assumes that " + 
				"parent is document.body";
			console.warn(msg);
		} else {
			this.id = arguments[0];
			this.parentId = arguments[1]
		}
		
		// Check whether id already exists
		var el = document.getElementById(this.id);
		var idExist = (el != undefined)
		if(idExist) {
			var msg = this.id + " exists";
			throw new Error(msg)
		}
		
		// Create style
		this.createAllStyle(this.id);
		this.bgroupcs = "bgroup" + this.id;
		this.buttoncs = "button" + this.id;
		
		// Define visual container
		var bgroup  = document.createElement("div");
		bgroup.id = this.id;
		bgroup.className = this.bgroupcs;
		this.bgroup = bgroup;
		
		// Set parent of Tabs instance
		if(this.parentId == "document.body") {
			document.body.append(this.bgroup);
		} else {
			var el = document.getElementById(this.parentId);
			el.append(this.bgroup);
		}
		
		// Define array for storing tab button information
		this.buttons = [];
		this.funcs = [];
	}
	
	// Set background color
	setBackground(color) {
		Style.changeStyleAttribute('.' + this.bgroupcs,
			"background", color);
	}
	
	// Set width
	setWidth(width) {
		Style.changeStyleAttribute('.' + this.bgroupcs,
			"width", width);		
	}
	
	// Set hight
	setHeight(height) {
		Style.changeStyleAttribute('.' + this.bgroupcs,
			"height", height);		
	}
	
	// Ada button
	addButton(label, func) {
		// Avoid same button
		var ibutton = this.buttons.indexOf(label);
		if(ibutton < 0) {
			this.buttons.push(label);
		} else {
			var msg = "Duplicate label " + label + " is igonered";
			console.warn(msg);
		}
		
		// Create tab buttons
		var N = this.buttons.length;
		for(var i = 0; i < N; i++) {
			var id = this.id + this.buttons[i];
			var btn = document.getElementById(id);
			if(btn == undefined) {
				var btn = document.createElement("button");
				btn.id = id;
				btn.className = this.buttoncs;
				btn.innerHTML = this.buttons[i];
				btn.addEventListener("click", buttonClick)
				this.bgroup.append(btn);
			}
		}
	}
	
	// Remove label for tab button
	removeButton(label) {
		// 20180616.0445
		// Tom Wadley, Beau Smith
		// https://stackoverflow.com/a/5767357/9475509
		var i = this.buttons.indexOf(label);
		var remE = this.buttons.splice(i, 1);
		
		// Warn only for unexisting label for removing
		if(i < 0) {
			var msg = "Unexisting label " + label + " for removing "
				+ "is igonered";
			console.warn(msg);
		}
		
		// Remove tab button
		var id = this.id + remE;
		var btn = document.getElementById(id);
		btn.remove();
		this.updateTabButtonsWidth();
		
		// Initiate visible tab after remove a tab button
		// -- 20180617.1031
		//this.toggleContent(0);
	}
	
	// Enable button with certain label
	disable(label) {
		var i = this.buttons.indexOf(label);
		if(i < 0) {
			var msg = "Disable button " + label
				+ " of unexisting is igonered";
			console.warn(msg);
		} else {
			var id = this.id + this.buttons[i];
			var btn = document.getElementById(id);
			btn.disabled = true;
		}
	}
	
	// Disable button with certain label
	enable(label) {
		var i = this.buttons.indexOf(label);
		if(i < 0) {
			var msg = "Enable button " + label
				+ " of unexisting is igonered";
			console.warn(msg);
		} else {
			var id = this.id + this.buttons[i];
			var btn = document.getElementById(id);
			btn.disabled = false;
		}
	}

	// Set button caption
	setCaption(label) {
		var i = this.buttons.indexOf(label);
		var id = this.id + this.buttons[i];
		if(i < 0) {
			var msg = "Set button caption " + label
				+ " of unexisting is igonered";
			console.warn(msg);
		} else {
			var bt = {
				to: function(caption) {
					var btn = document.getElementById(id);
					btn.innerHTML = caption;
				}
			}
			return bt;
		}
	}
	
	// Create default style for this class
	createAllStyle(id) {
		// Set style of the tab
		Style.createStyle(
		'.bgroup' + id + ` {
			overflow: hidden;
			width: 150px;
			height: 100px;
			background: #f1f1f1;
			border: 1px solid #ccc;
			padding: 4px 4px;
			float: left;
		}
		`);

		// Set style of the buttons inside the tab
		Style.createStyle(
		'.button' + id +  ` {
			background: #ddd;
			float: left;
			width: 60px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		`);
	}
}

// Export module
module.exports = function() {
	return Bgroup;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/*
	veio.js
	Visual elements for input and output 
	
	Sparisoma Viridi | dudung@gmail.com
	
	20190617
	Create this library of functions as supporting gfhtgr app.
*/

// Require classes
var Vect3 = __webpack_require__(2)();


// Clear a Textarea
function clearText() {
	var ta = arguments[0];
	ta.value = "";
}


// Clear canvas
function clearCanvas() {
	var ca = arguments[0];
	var width = ca.width;
	var height = ca.height;
	var cx = ca.getContext("2d");
	cx.clearRect(0, 0, width, height);
}


// Add text to a textarea
function addText() {
	var text = arguments[0];
	var result = {
		to: function() {
			var ta = arguments[0];
			ta.value += text;
			ta.scrollTop = ta.scrollHeight;
		}
	};
	return result;
}


// Get parameter value from a Textarea
function getValue() {
	var key = arguments[0];
	var result = {
		from: function() {
			var ta = arguments[0];
			var lines = ta.value.split("\n");
			var Nl = lines.length;
			for(var l = 0; l < Nl; l++) {
				var words = lines[l].split(" ");
				var Nw = words.length;
				var value;
				if(words[0].indexOf(key) == 0) {
					if(Nw == 2) {
						value = parseFloat(words[1]);
					} else if(Nw == 4) {
						value = new Vect3(
							parseFloat(words[1]),
							parseFloat(words[2]),
							parseFloat(words[3])
						);
					} else if(Nw == 3) {
						value = [];
						value.push(parseFloat(words[1]));
						value.push(parseFloat(words[2]));
					}
					return value;
				}
			}
		}
	};
	return result;	
}


// Export module -- 20190617.0902 test
module.exports = {
	clearText: function() {
		return clearText(arguments[0])
	},
	clearCanvas: function() {
		return clearCanvas(arguments[0])
	},
	addText: function() {
		return addText(arguments[0])
	},
	getValue: function() {
		return getValue(arguments[0])
	},
};


/***/ })
/******/ ]);