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
	1258 Can get region name from CSV data.
	1323 Change from id to region for better user friendly.
	1334 Correct it and it works.
	1339 Problem in obtaining date data.
	1345 Create getDateFromCSV and it works.
	1415 Begin SIR model but with different notation in [2].
	1509 Can view chart of SIR model.
	1529 Fix get region name, skip the header.
	1555 Create function for updating chart with new data.
	1721 Problem by select element, can not draw charts.
	1736 Problem at t = 0 that I = 0, SIR model does not work.
	
	References
	1. url https://github.com/dudung/butiran.js/blob/master/app
	   /fr0sir/fr0sir.js [20200513].
	2. url http://www.public.asu.edu/~hnesse/classes/sir.html
	   [20200513].
*/


// Define some global variables
var xxx, chart1, chart2, regions, params;


// Execute main function
main();


// Define main function
function main() {
	// Prepare id to get region
	regions = getRegionName(csv_a);
	
	// Use SIR model to produce simulation data with Euler
	params = {
		model: "SIR",     // model
		a: 0.5,           // rate of infection
		b: 0.1,           // rate of recovery
		N: 120,           // total population
		S: 100,           // initial susceptible population
		I: 9,             // initial infected population
		R: 11,            // initial recovered population
		method: "Euler",  // numerical method for solving ODE 
		dt: 1,            // simulation time step (day)
		tbeg: 0,          // begin time of simulation
		tend: 105,        // end time of simulation
	};
	
	// Create HTML elemenents with DOM
	createElements();
	
	// Region id 0 -- 33, 34 total, set initial id
	var id = 20;
	recalculate(id);
}


// Recalculate
function recalculate() {
	var sel = document.getElementById("region-name");
	var sidx = arguments[0];
	sel.selectedIndex = sidx;
	var region = sel.value;
	console.log(sel.selectedIndex);
	
	/*
		0 date
		1 active case
		2 recovered case
		3 death case
		4 confirmed case
	*/
	var data = getAllTimeSerisFromRegion(region);
	var date = data[0];
	
	// SIR model requires active (infected) case, observed data
	var Iobs = data[1];
	var Robs = data[2];
	
	// Change params according to observed data
	params.R = Robs[0];
	params.I = Iobs[0];
	
	/*
		0 time in day
		1 susceptible population
		2 infected population
		3 recovered population
	*/
	var sim = simulate(params);
	var day = sim[0]
	var Isim = sim[2];
	var Rsim = sim[3];
	
	console.log(region);
	
	updateChart(chart1, region, day, Iobs, Isim, "(active)");
	updateChart(chart2, region, day, Robs, Rsim, "(recovered)");
}

// Update chart with observed and simulation data
function updateChart() {
	var chart = arguments[0];
	var region = arguments[1];
	var day = arguments[2];
	var Xobs = arguments[3];
	var Xsim = arguments[4];
	var subtitle = arguments[5];
	
	chart.options.title.text = region
		+ " 2020-02-28 -- 2020-05-12 " + subtitle;
	chart.data.datasets[0].data = Xobs;
	chart.data.datasets[1].data = Xsim;
	chart.data.labels = day;
	chart.update();
	
	var a = params.a;
	var b = params.b;
	var r0 = a/b;
	showParams("r0 = " + r0);
}


// Create HTML elements using DOM
function createElements() {
	var div0 = document.createElement("div");
	div0.style.width = "100%";
	div0.style.background = "#fafafa";
	var span = document.createElement("span");
	span.innerHTML = "Region";
	span.style.padding = "5px 10px 5px 10px";
	var sel = document.createElement("select");
	sel.style.width = "200px";
	sel.id = "region-name"
	
	document.body.append(div0);
	div0.append(span);
	div0.append(sel);
	
	for(var i = 0; i < regions.length; i++) {
		var opt = document.createElement("option");
		opt.value = regions[i];
		opt.text = regions[i];
		sel.append(opt);
	}
	
	sel.addEventListener("change", function () {
		var idx = event.target.selectedIndex;
		recalculate(idx);
	});
	
	var div1 = document.createElement("div");
	div1.style.width = "49.7%";
	div1.style.background = "#fafafa";
	div1.style.border = "1px solid #eee";
	div1.style.float = "left";
	
	var can1 = document.createElement("canvas");
	can1.id = "line-chart-1";
	
	var div2 = document.createElement("div");
	div2.style.width = "49.7%";
	div2.style.background = "#fafafa";
	div2.style.border = "1px solid #eee";
	div2.style.float = "left";
	
	var can2 = document.createElement("canvas");
	can2.id = "line-chart-2";
	
	var div3 = document.createElement("div");
	div3.style.width = "100%";
	div3.style.background = "#fafafa";
	div3.id = "params";
	
	document.body.append(div1);
	div1.append(can1);
	document.body.append(div2);
	div2.append(can2);
	document.body.append(div3);
	
	chart1 = new Chart(document.getElementById("line-chart-1"),
	{
		type: 'line',
		data: {
			//labels: day,
			datasets: [
				{ 
					//data: Iobs,
					label: "Observed",
					pointRadius: 3,
					pointStyle: "circle",
					pointBorderColor: "#00f",
					pointBackgroundColor: "#ccf",
					showLine: false,
					borderColor: "#ccf",
					fill: false,
				},
				{ 
					//data: Isim,
					label: "SIR model",
					pointRadius: 0,
					pointStyle: "rect",
					pointBorderColor: "#f00",
					pointBackgroundColor: "#fcc",
					showLine: true,
					borderColor: "#f00",
					borderWidth: 2,
					borderDash: [1, 0],
					fill: false,
				},
			]
		},
		options: {
			title: {
				display: true,
				//text: region
				//	+ " 2020-02-28 -- 2020-05-12 (active)",
			},
			scales: {
				xAxes: [
					{
						ticks: {
							beginAtZero: false,
							maxTicksLimit: 11,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							//stepSize: 10,
						},
					},
				],
			},
		}
	});
	
	chart2 = new Chart(document.getElementById("line-chart-2"),
	{
		type: 'line',
		data: {
			//labels: day,
			datasets: [
				{ 
					//data: Robs,
					label: "Observed",
					pointRadius: 3,
					pointStyle: "circle",
					pointBorderColor: "#00f",
					pointBackgroundColor: "#ccf",
					showLine: false,
					borderColor: "#ccf",
					fill: false,
				},
				{ 
					//data: Rsim,
					label: "SIR model",
					pointRadius: 0,
					pointStyle: "rect",
					pointBorderColor: "#f00",
					pointBackgroundColor: "#fcc",
					showLine: true,
					borderColor: "#f00",
					borderWidth: 2,
					borderDash: [1, 0],
					fill: false,
				},
			]
		},
		options: {
			title: {
				display: true,
				//text: region
				//	+ " 2020-02-28 -- 2020-05-12 (recovered)",
			},
			scales: {
				xAxes: [
					{
						ticks: {
							beginAtZero: false,
							maxTicksLimit: 11,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							//stepSize: 10,
						},
					},
				],
			},
		}
	});

}


// Perform simulation using a model
function simulate() {
	var params = arguments[0];
	
	var method = params.method;
	var dt = params.dt;
	var tbeg = params.tbeg;
	var tend = params.tend;
	
	var model = params.model;
	// dS/dt = -aSI/N
	// dI/dt = aSI/n - bI
	// dR/dt = bI
	// N = S + I + R
	var a = params.a;
	var b = params.b;
	var N = params.N;
	var S0 = params.S;
	var I0 = params.I;
	var R0 = params.R;
	
	var tt = [];
	var SS = [];
	var II = [];
	var RR = [];
	
	var S = S0;
	var I = I0;
	var R = R0;
	
	if(model == "SIR" && method == "Euler") {
		var Ni = Math.ceil((tend - tbeg) / dt);
		for(var i = 0; i <= Ni; i++) {
			var t = tbeg + i * dt;
			
			tt.push(t);
			SS.push(S);
			II.push(I);
			RR.push(R);

			S = S - a * S * I / N * dt;
			I = I + a * S * I / N * dt - b * I * dt;
			R = R + b * I * dt;
			}
	}
	
	return [tt, SS, II, RR];
}


// Get all time series from a region
function getAllTimeSerisFromRegion() {
	var region = arguments[0];
	var date = getDateFromCSV(csv_a);
	var I = getRegionTimeSeriesFromCSV(csv_a, region);
	var R = getRegionTimeSeriesFromCSV(csv_r, region);
	var D = getRegionTimeSeriesFromCSV(csv_d, region)
	var C = getRegionTimeSeriesFromCSV(csv_c, region);	
	return [date, I, R, D, C];
}


// Get region name in array
function getRegionName() {
	var csv = arguments[0];
	
	var line = csv.split("\n");
	line.pop();
	line.shift();
	
	var name = [];
	for(var i = 1; i < line.length; i++) {
		var column = line[i].split(",");
		name.push(column[1]);
	}
	
	return name;
}


// Assure that active + recovered + death = confirmed
function checkRegionData() {
	var region = arguments[0];
	
	var data_a = getRegionTimeSeriesFromCSV(csv_a, region);
	var data_r = getRegionTimeSeriesFromCSV(csv_r, region);
	var data_d = getRegionTimeSeriesFromCSV(csv_d, region);
	var data_c = getRegionTimeSeriesFromCSV(csv_c, region);
	
	var aa = data_a.slice(-1)[0];
	var rr = data_r.slice(-1)[0];
	var dd = data_d.slice(-1)[0];
	var cc = data_c.slice(-1)[0];
	
	var checked;
	if((aa + rr + dd) === cc) {
		checked = true;
	} else {
		checked = false;
	}
	return checked;
}


// Get date of a region, e.g. province, state, others
function getDateFromCSV() {
	var csv = arguments[0];
	var region = arguments[1];
	
	var line = csv.split("\n");
	line.pop();
	line.shift();
	
	var series = [];
	var column = line[0].split(",");
	for(var j = 0; j < column.length - 2; j++) {
		series.push(column[j + 2]);
	}
	
	return series;
}



// Get time series of a region, e.g. province, state, others
function getRegionTimeSeriesFromCSV() {
	var csv = arguments[0];
	var region = arguments[1];
	
	var line = csv.split("\n");
	line.pop();
	line.shift();
	
	var series = [];
	for(var i = 0; i < line.length; i++) {
		var column = line[i].split(",");
		if(region == column[1]) {
			for(var j = 0; j < column.length - 2; j++) {
				series.push(parseInt(column[j + 2]));
			}
		}
	}
	
	return series;
}


// Show parameters
function showParams() {
	var str = arguments[0];
	var div = document.getElementById("params");
	div.innerHTML = str;
}


// Save unused things
function unused() {
	/*
		// SIR model benchmark
		http://www.public.asu.edu/~hnesse/classes/sir.html?
		Alpha=0.4&Beta=0.25
		&initialS=100&initialI=9&initialR=11
		&iters=105
	*/
}

