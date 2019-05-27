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
