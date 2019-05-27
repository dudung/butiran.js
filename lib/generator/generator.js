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
var Sequence = require('./sequence')();

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
