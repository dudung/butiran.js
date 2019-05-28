/*
	cppcmf.js
	
	Charged particle in perpendicular constant magnetic field
	
	Sparisoma Viridi | https://github.com/dudung/butiran.js
	
	20190528
	0446 Start this app.
*/

// Define global variables
var taIn, taOut, caOut;
var btClear, btLoad, btRead, btStart, btInfo;


// Execute main function
main();


// Define main function
function main() {
	createVisualElements();
}


// Create visual elements
function createVisualElements() {
	taIn = document.createElement("textarea");
	taIn.style.overflowY = "scroll";
	with taIn {
		
	}
	
	
	document.body.append(taIn);
}