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
