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
var Vect3 = require('../lib/vect3')();

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
