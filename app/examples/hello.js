/*
	hello.js
	
	A 'Hello, world!' program in butiran.js
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190528
	0306 Start this example.
	0307 Create in app/examples/0000_hello.
	0317 Finish example for the use of sum of two vectors.
*/

// Execute main function
main();


// Define main function
function main() {
	var r = new Vect3(1, -2, 3);
	var s = new Vect3(-1, 2, 7);
	console.log(
		"Hello, r = " + r.strval()
		+ " and s = " + s.strval()
		+ "!"
	);
	
	var t = Vect3.add(r, s);
	console.log("Sum of you are t = r + s = " + t.strval());
}