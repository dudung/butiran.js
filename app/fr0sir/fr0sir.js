/*
	fr0sir.js
	Find R0 in SIR model
	
	Sparisoma Viridi | https://github.com/dudung
	Aristyo Wijaya | https://www.researchgate.net/profile/Aristyo_Wijaya
	
	20200512
	1541 Start to answer the question.
	1557 Learn about Chart.js from [1].
	1602 Try to hack [1] into full JS.
	1627 Can rewrite the code in our style almost completely.
	1714 Get raw data and save it to idn-20200512.js file from [2].
	1717 Add to fr0sir.htm file to data with script tag.
	1907 Can select column number for extracting data.
	1922 Can get all desired column, but date and integer only.
	1937 Can show a Chart.js scatter chart.
	1946 Try another approach in creating chart [3],
	1952 Change to [4].
	2006 Modify according to [5].
	2032 Start to develop model.
	2105 Clean the code.
	2120 Find that Npop, I0, a, R0 play different role.
	2137 Disable 2nd button and discuss with Aristyo.
	2215 View log of error.
	2237 Finish for today, gradient descent works.
	2244 Add clickCount for better observation.
	
	References
	1. url https://www.chartjs.org/samples/latest/charts/scatter/basic.html
	   [20200512].
	2. WHO-COVID-19-global-data.csvCSV (357.1K)
	   url https://data.humdata.org/dataset/coronavirus-covid-19-cases-and-deaths
     [20200512].
	3. url https://canvasjs.com/docs/charts/chart-options/data/datapoints/markersize/ [20200512].
	4. url https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/ [20200512].
	5. url https://www.chartjs.org/docs/latest/charts/line.html
	   [20200512].
*/

// Define globar variables
var clickCount;


// Execute main function
main();


// Define main function
function main() {
	var clickCount = 0;
	
	var csvData2 = removeEmptyLines(csvData);
	var header = getHeaderLine(csvData2);
	var column = getDataColumn(
		csvData2,  // a csv data
		header[0], // OBJECTID    --> column 0
		header[4], // date_epicrv --> column 1
		header[5], // NewCase     --> column 2
		header[6], // CumCase     --> column 3
		header[7], // NewDeath    --> column 4
		header[8], // CumDeath    --> column 5
	);
	
	// Get horizontal axis
	var x0 = [];
		
	// Get CumCase start from 2020-03-02 -- 2020-05-12
	var y1 = [];
	
	// Get DeathCase start from 2020-03-02 -- 2020-05-12
	var y2 = [];
	
	var objID0 = column[0][0];
	var N = column[0].length;
	for(var i = 0; i < N; i++) {
		//var xx0 = column[0][i] - objID0;
		var xx0 = column[1][i];
		var yy1 = column[3][i];
		var yy2 = column[5][i];
		
		x0.push(xx0);
		y1.push(yy1);
		y2.push(yy2);
	}

	var additionalDay = 72;
	var lastDay = 12;
	for(var i = 1; i < additionalDay + 1; i++) {
		var label = "2020-05-" + (lastDay + i);
		x0.push(label);
	}
	
	var r0 = 2;
	
	var a = 0.1;
	var b = a / r0;
	var Nday = N;
	var Npop = 31000;
	var I0 = 150;
	var S0 = Npop - I0;
	var R0 = 0;
	
	ySIR = simulateSIR(
		2 * Nday,
		{
			Npop: Npop,
			a: a,
			b: b,
			dt: 1,
			S: S0,
			I: I0,
			R: R0,
		}
	);

	var div = document.createElement("div");
	div.style.width = "80%";
	
	var can = document.createElement("canvas");
	can.id = "canvas";
	
	var btn = document.createElement("button");
	btn.id = "button";
	btn.innerHTML = "Change R0 manually";
	
	var btn2 = document.createElement("button");
	btn2.id = "button2";
	btn2.innerHTML = "Change R0";
	//btn2.disabled = true;

	var div2 = document.createElement("div");
	div2.style.paddingTop = "10px";
	
	document.body.append(div);
	div.append(can);
	document.body.append(btn);
	document.body.append(btn2);
	document.body.append(div2);
	
	var error = getErr(Nday, y1, ySIR);
	div2.innerHTML = "log(Error) = "
		+ Math.log10(error).toFixed(2);

	btn.addEventListener("click", function() {
		clickCount++;
		
		// Change r0 manually only in one direction
		r0 += 0.5;
		b = a / r0;
		
		ySIR = simulateSIR(
			2 * Nday,
			{
				Npop: Npop,
				a: a,
				b: b,
				dt: 1,
				S: S0,
				I: I0,
				R: R0,
			}
		);
		
		chart.data.datasets[1].data = ySIR;
		chart.update();
		
		var error = getErr(Nday, y1, ySIR);
		div2.innerHTML = "Attempt " + clickCount
			+ " | log(Error) = "
			+ Math.log10(error).toFixed(2);
		
	});

	btn2.addEventListener("click", function() {
		clickCount++;
		
		var r0_1 = r0;
		var error1 = getErr(Nday, y1, ySIR);
		console.log("1", error1, r0_1);
		
		// Try to change r0 in false direction
		r0 -= 0.5;
		var r0_2 = r0;
		b = a / r0;
		ySIR = simulateSIR(
			2 * Nday,
			{
				Npop: Npop,
				a: a,
				b: b,
				dt: 1,
				S: S0,
				I: I0,
				R: R0,
			}
		);
		var error2 = getErr(Nday, y1, ySIR);
		console.log("2", error2, r0_2);
		
		var c = 2.5E-5;
		r0 = r0 - c * (error2 - error1) / (r0_2 - r0_1);
		var r0_3 = r0;
		b = a / r0;
		ySIR = simulateSIR(
			2 * Nday,
			{
				Npop: Npop,
				a: a,
				b: b,
				dt: 1,
				S: S0,
				I: I0,
				R: R0,
			}
		);
		var error3 = getErr(Nday, y1, ySIR);
		console.log("3", error3, r0_3);
		
		chart.data.datasets[1].data = ySIR;
		chart.update();
		
		div2.innerHTML = "Attempt " + clickCount
			+ " | log(Error) = "
			+ Math.log10(error3).toFixed(2);
		
	});
	
	chart = new Chart(document.getElementById("canvas"), {
		type: 'line',
		data: {
			labels: x0,
			datasets: [
				{ 
					data: y1,
					label: "CumCase",
					pointRadius: 3,
					pointStyle: "circle",
					pointBorderColor: "#00f",
					pointBackgroundColor: "#ccf",
					showLine: false,
					borderColor: "#ccf",
					fill: false,
				},
				{ 
					data: ySIR,
					label: "SIR",
					pointRadius: 0,
					pointStyle: "rect",
					pointBorderColor: "#00f",
					pointBackgroundColor: "#ccf",
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
				text: "2020-03-02 -- 2020-05-12",
			},
			scales: {
				xAxes: [
					{
						ticks: {
							beginAtZero: false,
							maxTicksLimit: 14,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							stepSize: 4000,
						},
					},
				],
			},
		}
	});
	
}


function getErr() {
	var Nday = arguments[0];
	var y1 = arguments[1];
	var ySIR = arguments[2];
	
	var err = 0;
	for(var i = 0; i < Nday; i++) {
		var erri = Math.abs(y1[i] - ySIR[i]);
		err += erri;
	}
	
	return err;
}


function simulateSIR() {
	var Nday = arguments[0];
	var params = arguments[1];
	
	var N = params.Npop;
	var a = params.a;
	var b = params.b;
	var dt = params.dt;
	var S = params.S;
	var S = params.S;
	var I = params.I;
	var R = params.R;
	
	var ySIR = [];
	for(var i = 0; i < Nday; i++) {
		S = S - a * I * (S / N) * dt;
		I = I + a * I * (S / N) * dt - b * I;
		R = R + b * I;
		ySIR.push(I);
	}
	
	return ySIR;
}



// Get data only for certain column(s)
function getDataColumn() {
	var csvData = arguments[0];
	var COLS = arguments.length - 1;
	var cols = [];
	for(var c = 0; c < COLS; c++) {
		var col = [];
		cols.push(col);
	}
	
	var selHeader = [];
	for(var i = 1; i < COLS + 1; i++) {
		selHeader.push(arguments[i]);
	}
	
	var header = getHeaderLine(csvData);
	
	var selCol = [];
	for(var h = 0; h < header.length; h++) {
		for(var i = 0; i < selHeader.length; i++) {
			if(selHeader[i] == header[h]) {
				selCol.push(h);
				break;
			}
		}			
	}
	
	var line = csvData.split("\n");
	for(var i = 1; i < line.length; i++) {
		var column = line[i].split(",");
		for(var j = 0; j < selCol.length; j++) {
			var k = selCol[j];
			
			var d = column[k].slice(0, 10);
			var n = parseInt(column[k]);
			if(d == n) {
				cols[j].push(n);
			} else {
				cols[j].push(d);
			}
		}
	}
	
	return cols;
}


// Get from raw data from [1] saved in idn-20200512.js file
function removeEmptyLines() {
	var csvData = arguments[0];
	var line = csvData.split("\n");
	var N = line.length;
	if(line[N-1].length == 0) line.pop();
	if(line[0].length == 0) line.shift();
	csvData = line.join("\n");
	return csvData;
}


// Get data header
function getHeaderLine() {
	var csvData = arguments[0];
	var line = csvData.split("\n");
	var header = line[0].split(",");
	return header;
}	

// Create elements, also from [1]
function createElements() {
	var div = document.createElement("div");
	div.style.width = "75%";
	
	var can = document.createElement("canvas");
	can.id = "canvas";
	
	var btn = document.createElement("button");
	btn.innerHTML = "Randomize Data";
	btn.id = "randomizeData";
	btn.addEventListener('click',
		function() {
			reCreateData(scatterChartData);
		}
	);
	
	document.body.append(div);
	div.append(can);
	document.body.append(btn);
	
	var color = Chart.helpers.color;
	
	var scatterChartData = {
		datasets: [{
			label: 'My First dataset',
			borderColor: window.chartColors.red,
			backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
			data: generateData()
		}, {
			label: 'My Second dataset',
			borderColor: window.chartColors.blue,
			backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
			data: generateData()
		}]
	};

	createChart(scatterChartData);
}


// From [1]
function reCreateData() {
	var scatterChartData = arguments[0];
	scatterChartData.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return {
				x: randomScalingFactor(),
				y: randomScalingFactor()
			};
		});
	});
	window.myScatter.update();
}


// From [1]
function createChart() {
	var scatterChartData = arguments[0];
	var title = arguments[1];
	var ctx = document.getElementById('canvas')
		.getContext('2d');
	window.myScatter = Chart.Scatter(ctx, {
		data: scatterChartData,
		options: {
			title: {
				display: true,
				text: title,
			},
		}
	});
}


// From [1]
function generateData() {
	var data = [];
	for (var i = 0; i < 7; i++) {
		data.push({
			x: randomScalingFactor(),
			y: randomScalingFactor()
		});
	}
	return data;
}


// Learn from [1] and put here change with [4]
function unused0() {
	createElements();
	
	var color = Chart.helpers.color;
	
	var scatterChartData = {
		datasets: [
			{
				label: 'CumCase',
				borderColor: window.chartColors.red,
				backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
				data: data1,
			},
			{
				label: 'CumDeath',
				borderColor: window.chartColors.blue,
				backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
				data: data2,
			},
		]
	};
	
	createChart(scatterChartData, "2020-03-02 -- 2020-05-12");
}