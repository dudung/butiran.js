/*
	fr0sir2.js
	Find R0 in SIR model for IDN data
	
	Sparisoma Viridi | https://github.com/dudung
	Aristyo Wijaya | https://github.com/aristyogresearch
	
	20200513
	1137 Use fr0sir.js as starting point.
	1140 Clean all but intermittent take a peek at [1].
	1208 Design conversion of CSV data to array.
	1226 Can get information of a reagion and check the sum.
	1245 Add series for date information and it works.
	
	References
	1. url https://github.com/dudung/butiran.js/blob/master/app
	   /fr0sir/fr0sir.js [20200513].
*/


// Define some global variables
var xxx;


// Execute main function
main();


// Define main function
function main() {
}


// Assure that active + recovered + death = confirmed
function checkRegionData() {
	var id = arguments[0];
	
	var data_a = getRegionTimeSeriesFromCSV(csv_a, id);
	var data_r = getRegionTimeSeriesFromCSV(csv_r, id);
	var data_d = getRegionTimeSeriesFromCSV(csv_d, id);
	var data_c = getRegionTimeSeriesFromCSV(csv_c, id);
	
	var aa = data_a.series[1].slice(-1)[0];
	var rr = data_r.series[1].slice(-1)[0];
	var dd = data_d.series[1].slice(-1)[0];
	var cc = data_c.series[1].slice(-1)[0];
	
	var checked;
	if((aa + rr + dd) === cc) {
		checked = true;
	} else {
		checked = false;
	}
	return checked;
}


// Get time series of a region, e.g. province, state, others
function getRegionTimeSeriesFromCSV() {
	var csv = arguments[0];
	var id = arguments[1];
	
	var line = csv.split("\n");
	line.pop();
	line.shift();
	
	var name = "";
	var series0 = [];
	var series1 = [];
	for(var i = 0; i < line.length; i++) {
		var column = line[i].split(",");
		if(id == parseInt(column[0])) {
			for(var j = 0; j < column.length - 2; j++) {
				series0.push(column[j + 1]);
				series1.push(parseInt(column[j + 2]));
			}
			name = column[1];
		}
	}
	
	return {name: name, series: [series0, series1]};
}
