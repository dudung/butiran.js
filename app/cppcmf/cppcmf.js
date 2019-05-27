/*
	cppcmf.js
	
	Charged particle in perpendicular constant magnetic field
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190528
	0446 Start this app.
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