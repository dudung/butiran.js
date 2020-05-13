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
	1915 Able to initiate I > 0 at t = tbeg.
	1958 Can not fit I and R at the same time.
	2021 Concentrate first on total case and DKI Jakarta.
	2034 SIR model seem to be late than the data.
	2037 Add three buttons.
	2146 It seems does not work either with artificial data.
	2238 Adata params works for Bengkulu? Why?
	2304 Finish change of a (infection rate) for now.
	2306 Update github and tell the team.
	
	References
	1. url https://github.com/dudung/butiran.js/blob/master/app
	   /fr0sir/fr0sir.js [20200513].
	2. url http://www.public.asu.edu/~hnesse/classes/sir.html
	   [20200513].
*/


// Define some global variables
var xxx, chart1, chart2, regions, params;
var TEST_A_DATA = true;

// Execute main function
main();


// Define main function
function main() {
	// Prepare id to get region
	regions = getRegionName(csv_a);

	/* Artificial data, set true the TEST_A_DATA
		a: 0.2,           // rate of infection
		b: 0.05,          // rate of recovery
		N: 5000,          // total population
		S: 4999,          // initial susceptible population
		I: 1,             // initial infected population
		R: 0,             // initial recovered population
		method: "Euler",  // numerical method for solving ODE 
		dt: 0.01,         // simulation time step (day)
		tbeg: 10,         // begin time of simulation
		tend: 74,         // end time of simulation
	*/
	
	// Use SIR model to produce simulation data with Euler
	params = {
		model: "SIR",     // model
		a: 0.15,          // rate of infection
		b: 0.05,          // rate of recovery
		N: 5000,          // total population
		S: 4999,          // initial susceptible population
		I: 1,             // initial infected population
		R: 0,             // initial recovered population
		method: "Euler",  // numerical method for solving ODE 
		dt: 0.01,         // simulation time step (day)
		tbeg: 10,         // begin time of simulation
		tend: 74,         // end time of simulation
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
	var Cobs = data[4];
	
	/**/
	// Change params according to observed data
	for(var i = 0; i < Iobs.length; i++) {
		if(Iobs[i] > 0) {
			params.I = Iobs[i];
			params.tbeg = i; 
			break;
		}
	}
	/**/

	if(!TEST_A_DATA)
	params.N = Cobs[Cobs.length - 1];
	params.S = params.N - params.I;
	
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
	
	var err = errorOf(Iobs, Isim);
	
	updateChart(chart1, region, day, Iobs, Isim, "(active)");
	updateChart(chart2, region, day, Robs, Rsim, "(recovered)",
		err);
}

// Update chart with observed and simulation data
function updateChart() {
	var chart = arguments[0];
	var region = arguments[1];
	var day = arguments[2];
	var Xobs = arguments[3];
	var Xsim = arguments[4];
	var subtitle = arguments[5];
	var err = arguments[6];
	
	chart.options.title.text = region
		+ " 2020-02-28 -- 2020-05-12 " + subtitle;
	chart.data.datasets[0].data = Xobs;
	chart.data.datasets[1].data = Xsim;
	chart.data.labels = day;
	chart.update();
	
	var a = params.a;
	var b = params.b;
	var r0 = a/b;
	var N = params.N;
	
	var str = "r0 = " + r0.toFixed(2) + " | ";
	str += "a = " + a.toFixed(2) + " | ";
	str += "b = " + b.toFixed(2) + " | ";
	str += "N = " + N.toFixed(1);
	
	if(err != undefined) {
		str += " | err = " + err;
	}
	
	showParams(str);
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
	
	var div4 = document.createElement("div");
	div4.style.width = "100%";
	div4.style.background = "#fafafa";
	
	var btn1 = document.createElement("button");
	btn1.innerHTML = "Change a";
	var btn2 = document.createElement("button");
	btn2.innerHTML = "Change b";
	var btn3 = document.createElement("button");
	btn3.innerHTML = "Change N";
	
	btn1.addEventListener("click", changeA);
	btn2.addEventListener("click", changeB);
	btn3.addEventListener("click", changeN);
	
	document.body.append(div1);
	div1.append(can1);
	document.body.append(div2);
	div2.append(can2);
	document.body.append(div3);
	document.body.append(div4);
	div4.append(btn1);
	div4.append(btn2);
	div4.append(btn3);
	
	chart1 = new Chart(document.getElementById("line-chart-1"),
	{
		type: 'line',
		data: {
			//labels: day,
			datasets: [
				{ 
					//data: Iobs,
					label: "Observed",
					yAxisID: "y-axis-1",
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
					yAxisID: "y-axis-2",
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
							maxTicksLimit: 10,
						},
					},
				],
				yAxes: [
					{
						id: 'y-axis-1',                             
            type: 'linear',
            position: 'left',
						ticks: {
							beginAtZero: true,
							//stepSize: 10,
							//min: 0,
							//max: 2500,
						},
					},
					{
						id: 'y-axis-2',
            type: 'linear',
            position: 'right',
						ticks: {
							beginAtZero: true,
							//stepSize: 10,
							//min: 0,
							//max: 2500,
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
					yAxisID: "y-axis-1",
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
					yAxisID: "y-axis-2",
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
							maxTicksLimit: 10,
						},
					},
				],
				yAxes: [
					{
						id: 'y-axis-1',                             
            type: 'linear',
            position: 'left',
						ticks: {
							beginAtZero: true,
							//stepSize: 10,
						},
					},
					{
						id: 'y-axis-2',                             
            type: 'linear',
            position: 'right',
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


// Change value of a with gradient descent
function changeA() {
	var region = document
		.getElementById("region-name").value;
	
	var data = getAllTimeSerisFromRegion(region);
	var Iobs = data[1];
	var Robs = data[2];
	
	var err1, err2, err3;
	var Isim, Rsim;
	
	if(params.olda == undefined) {
		params.olda = [];
		var a1 = params.a;
		var a2 = a1 + 0.01
		
		params.a = a1;
		var sim = simulate(params);
		var Isim = sim[2];
		err1 = errorOf(Iobs, Isim);
		params.olda.push(parseFloat(a1.toFixed(3)));
		
		params.a = a2;
		var sim = simulate(params);
		var Isim = sim[2];
		err2 = errorOf(Iobs, Isim);
		params.olda.push(parseFloat(a2.toFixed(3)));
		
		var eta = 1E-7;
		var a3 = a2 - eta * (err2 - err1) / (a2 - a1);
		
		params.a = a3;
		var sim = simulate(params);
		var Isim = sim[2];
		err3 = errorOf(Iobs, Isim);
		day = sim[0]
		Rsim = sim[3];
		params.olda.push(parseFloat(a3.toFixed(3)));
	} else {
		var idx = params.olda.length;
		
		var a1 = params.olda[params.olda.length - 2];
		var a2 = params.olda[params.olda.length - 1];
		
		params.a = a1;
		var sim = simulate(params);
		var Isim = sim[2];
		err1 = errorOf(Iobs, Isim);
		
		params.a = a2;
		var sim = simulate(params);
		var Isim = sim[2];
		err2 = errorOf(Iobs, Isim);
		
		var eta = 1E-8;
		var a3;
		if(a2 != a1) {
			a3 = a2 - eta * (err2 - err1) / (a2 - a1);
		} else {
			a3 = a2;
		}
		params.a = a3;
		var sim = simulate(params);
		var Isim = sim[2];
		err3 = errorOf(Iobs, Isim);
		day = sim[0]
		Rsim = sim[3];
		params.olda.push(parseFloat(a3.toFixed(3)));
	}
	
	console.log(params.olda);
	
	updateChart(chart1, region, day, Iobs, Isim, "(active)");
	updateChart(chart2, region, day, Robs, Rsim, "(recovered)",
		err3);
}


// Change value of b with gradient descent
function changeB() {
	var region = document
		.getElementById("region-name").value;
	
	var data = getAllTimeSerisFromRegion(region);
	var Iobs = data[1];
	var Robs = data[2];
	
	var b1 = params.b;
	var b2 = b1 + 0.1 * b1;
	
	params.b = b1;
	var sim = simulate(params);
	var Isim = sim[2];
	var err1 = errorOf(Iobs, Isim);
	
	params.b = b2;
	var sim = simulate(params);
	var Isim = sim[2];
	var err2 = errorOf(Iobs, Isim);
	
	var eta = 0.0001;
	var b3 = b1 - eta * (err2 - err1) / (b2 - b1);
	
	params.b = b3;
	var sim = simulate(params);
	var Isim = sim[2];
	var err3 = errorOf(Iobs, Isim);
	var day = sim[0]
	var Rsim = sim[3];
	
	updateChart(chart1, region, day, Iobs, Isim, "(active)");
	updateChart(chart2, region, day, Robs, Rsim, "(recovered)",
		err3);
}


// Change value of N with gradient descent
function changeN() {
	var region = document
		.getElementById("region-name").value;
	
	var data = getAllTimeSerisFromRegion(region);
	var Iobs = data[1];
	var Robs = data[2];
	
	var N1 = params.N;
	var N2 = N1 + 0.5 * N1;
	
	params.N = N1;
	var sim = simulate(params);
	var Isim = sim[2];
	var err1 = errorOf(Iobs, Isim);
	
	params.N = N2;
	var sim = simulate(params);
	var Isim = sim[2];
	var err2 = errorOf(Iobs, Isim);
	
	var eta = 0.1;
	var N3 = N1 - eta * (err2 - err1) / (N2 - N1);
	
	params.N = N3;
	var sim = simulate(params);
	var Isim = sim[2];
	var err3 = errorOf(Iobs, Isim);
	var day = sim[0]
	var Rsim = sim[3];
	
	updateChart(chart1, region, day, Iobs, Isim, "(active)");
	updateChart(chart2, region, day, Robs, Rsim, "(recovered)",
		err3);
}


// Calculate error
function errorOf() {
	var obs = arguments[0];
	var sim = arguments[1];
	var err = 0;
	for(var i = 0; i < obs.length; i++) {
		err += Math.abs(obs[i] - sim[i]);
	}
	return err;
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
	
	var S = 1;
	var I = 0;
	var R = 0;
	
	if(model == "SIR" && method == "Euler") {
		var Ni = Math.ceil((tend - 0) / dt);
		for(var i = 0; i <= Ni; i++) {
			var t = i * dt;
			
			if(t == tbeg) {
				I = I0;
				R = 0;
				S = N - I - R;
			}
			
			if(t == Math.floor(t)) {
				tt.push(t);
				SS.push(S);
				II.push(I);
				RR.push(R);
				
				//console.log(t, (S + I + R) / N);
			}
			
			S = S - a * S * I * dt / N;
			I = I + a * S * I * dt / N - b * I * dt;
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
	
	var scale = params.N * 1 + 0;
	for(var i = 0; i < Isim.length; i++) {
		Isim[i] *= scale;
		Rsim[i] *= scale;
	}
}


//createArtificialData();

// Create artificial data
function createArtificialData() {
	// Use SIR model to produce simulation data with Euler
	params = {
		model: "SIR",     // model
		a: 0.2,           // rate of infection
		b: 0.05,          // rate of recovery
		N: 5000,          // total population
		S: 4999,          // initial susceptible population
		I: 1,             // initial infected population
		R: 0,             // initial recovered population
		method: "Euler",  // numerical method for solving ODE 
		dt: 0.01,         // simulation time step (day)
		tbeg: 10,         // begin time of simulation
		tend: 74,         // end time of simulation
	};
	
	var sim = simulate(params);
	var Isim = sim[2];
	var Rsim = sim[3];
	var Dsim = [];
	var Csim = [];
	
	var scale = params.N * 0 + 1;
	for(var i = 0; i < Isim.length; i++) {
		Isim[i] = Math.floor(Isim[i] * scale);
		Rsim[i] = Math.floor(Rsim[i] * scale);
		Dsim.push(0);
		Csim.push(Isim[i] + Dsim[i] + Rsim[i]);
	}
	
	console.log(Isim.toString());
	console.log(Dsim.toString());
	console.log(Rsim.toString());
	console.log(Csim.toString());
}