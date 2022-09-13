/*
	abm-sir.js
	Agent-based model (ABM) and susceptible-infected-recovered
	(SIR) model
	
	Sparisoma Viridi | https://github.com/dudung/abm-x
	Armi Susandi | https://fitb.itb.ac.id/dr-rer-nat-armi-susandi-mt
	
	20200608
	2040 Start this app using abm-odm as the base.
	2047 Clean some lines.
	2101 Test and the old still works. Save for today. Pause.
	20200611
	0849 Create center free area.
	20200612
	1032 Read [1].
	1130 Move libraries to libs folder.
	1133 Comment all cities and roads, make free space + border.
	1137 Get solution for SIR from [2].
	1638 Add referensi [3].
	1657 Archive previous function and clear the code.
	1733 Make four equal region with the same population density.
	1741 Simplify code, general vars, func for cities and agents.
	1753 Create vertical wall. Pause.
	1927 Set wall hole with dataSetId.
	20200612
	2141 Pause. To-Do is listing S, I, R in each city.
	20200613
	0746 Implement padStr() from [4].
	0828 Show SIR from all cities.
	0944 Obtain default style of textarea [5].
	1308 Clean layout.
	1310 Clear previousFunction.
	1320 Fix 0-1 to -01 for S only agents.
	1340 Make input textarea but not yet readable.
	1704 Archive ref for nowrap in textarea [6].
	1737 Convert array of string to number [7].
	1746 Can set initial inf and rec, but not work in history.
	1859 Fix history.
	1915 Fix both button.
	1926 Not implement sweetalert2 [8].
	2025 Try to save using [9].
	2046 Add header UI for parameters.
	2056 Try add time information [10].
	2113 Can use [9] but saving with Download default name.
	2117 Can open window dan write to it [11], but not md.
	2202 Try [12] and it works.
	2227 Can save canvas to PNG [13] and insert to .md file.
	2231 Open new window allowing multiple files download [14].
	2254 Can view result in new window [15], must allow pop-up.
	2258 That will help when file not ready if use [16] directly.
	2310 Add link to https://github.com/dudung/abm-x in md file.
	2313 Sometimes file not ready for window.open().
	
	References
	1. url https://stackoverflow.com/a/48906011/9475509
	2. Albert-László Barabási, "Spreading Phonomena", in Network
	   Science, chapter 10, Cambridge University Press, 1st
		 edition, Aug 2016,
		 url https://isbnsearch.org/isbn/9781107076266,
		 http://networksciencebook.com/chapter/10,
		 https://barabasi.com/f/617.pdf.
	3. Tiberiu Harko, Francisco S. N. Lobo, M. K. Mak, "Exact
	   analytical solutions of the Susceptible-Infected-Recovered
		 (SIR) epidemic model and of the SIR model with equal death
		 and birth rates", Applied Mathematics and Computation
		 [Appl. Math. Comput.], vol. 236, no., pp. 184-194, Jun
		 2014, url https://doi.org/10.1016/j.amc.2014.03.030.
	4. url https://stackoverflow.com/a/10073737/9475509
	5. url https://stackoverflow.com/a/20014039/9475509
	6. url https://stackoverflow.com/a/8136701/9475509
	7. url https://stackoverflow.com/a/58833088/9475509
	8. url https://sweetalert2.github.io [20200613].
	9. url https://stackoverflow.com/a/4551467/9475509
	10. url https://stackoverflow.com/a/4744635/9475509
	11. url https://stackoverflow.com/a/2109227/9475509
	12. url https://stackoverflow.com/a/25715985/9475509
	13. url https://stackoverflow.com/a/44487883/9475509
	14. url https://stackoverflow.com/a/2339452/9475509
	15. url https://www.w3schools.com/jsref/met_win_settimeout.asp
	16. url https://stackoverflow.com/a/34193305/9475509
*/


// Define global variabels
var proc, iter, iterMax;
var world, city, road, agent;
var healingTime;
var txa1, txa2, txa3, canId, btn, btn0, btn1, btn2;
var oiAgent;

// Call main function
main();


// Define main function
function main() {
	var div0 = document.createElement("div");
	div0.style.width = "556px";
	div0.style.height = "367px";
	div0.style.border = "1px solid #888";
	div0.style.background = "#eee";
	div0.style.float = "left";
	document.body.append(div0);
		
	var div1 = document.createElement("div");
	div1.style.width = "552px";
	div1.style.fontFamily = "Monospace";
	div1.style.letterSpacing = "normal";
  div1.style.wordSpacing = "0px";
	div1.style.fontSize = "13.3333px";
  div1.style.fontStretch = "normal";
  div1.style.border = "1px solid #000";	
  div1.style.color = "#fff";	
  div1.style.background = "#000";	
	div1.style.fontWeight = 400;
	div1.style.paddingLeft = "2px";
	div1.innerHTML = "ITR "
		+ "C0S C0I C0R C0N "
		+ "C1S C1I C1R C1N "
		+ "C2S C2I C2R C2N "
		+ "C3S C3I C3R C3N "
		+ "CAN";
	div0.append(div1);
	
	txa1 = document.createElement("textarea");
	txa1.style.width = "550px";
	txa1.style.height = "4.4em";
	txa1.style.overflowY = "scroll";
	div0.append(txa1);
	
	var div2 = document.createElement("div");
	div2.style.width = "552px";
	div2.style.fontFamily = "Monospace";
	div2.style.letterSpacing = "normal";
  div2.style.wordSpacing = "0px";
	div2.style.fontSize = "13.3333px";
  div2.style.fontStretch = "normal";
  div2.style.border = "1px solid #000";	
  div2.style.color = "#fff";	
  div2.style.background = "#000";	
	div2.style.fontWeight = 400;
	div2.style.paddingLeft = "2px";
	div2.innerHTML = "AID "
		+ "SUS INF REC IBA HIS";
	div0.append(div2);
	
	txa2 = document.createElement("textarea");
	txa2.style.width = "550px";
	txa2.style.height = "11.4em";
	txa2.style.overflowY = "scroll";
	txa2.style.overflowX = "scroll";
	txa2.style.whiteSpace = "nowrap";
	div0.append(txa2);
	
	var div3 = document.createElement("div");
	div3.style.width = "552px";
	div3.style.fontFamily = "Monospace";
	div3.style.letterSpacing = "normal";
  div3.style.wordSpacing = "0px";
	div3.style.fontSize = "13.3333px";
  div3.style.fontStretch = "normal";
  div3.style.border = "1px solid #000";	
  div3.style.color = "#fff";	
  div3.style.background = "#000";	
	div3.style.fontWeight = 400;
	div3.style.paddingLeft = "2px";
	div3.innerHTML = "PARAMETR "
		+ "VALUE";
	div0.append(div3);
	
	var txa3 = document.createElement("textarea");
	txa3.style.width = "480px";
	txa3.style.height = "78px";
	div0.append(txa3);
	txa3.value = "SCENARIO 0\n"
		+ "HEALTIME 14\n"
		+ "ITERTIME 300\n"
		+ "INFAGENT 0\n"
		+ "RECAGENT 1,2,11,12,13,22,23,24";
	txa3.style.overflowY = "scroll";
	
	canId = "can0";
	var can = document.createElement("canvas");
	can.id = canId;
	can.width = 245 * 1.5;
	can.height = 245 * 1.5;
	can.style.width = can.width + "px";
	can.style.height = can.height + "px";
	can.style.border = "1px solid #444";
	document.body.append(can);
	
	// Default value is 10 with w = 500, h = 500
	matrixPixelSize = 5 * 1.5;
	
	var divBtn = document.createElement("div");
	divBtn.style.width = "70px";
	divBtn.style.float = "right";
	div0.append(divBtn);
	
	btn0 = document.createElement("button");
	btn0.innerHTML = "Read";
	btn0.style.width = "70px";
	divBtn.append(btn0);
	
	btn0.addEventListener("click", function() {
		// Define world
		world = new Matrix(49, 49, 1);
		
		// Define border -- actually not necessary
		world.setCol(0).to(0);
		world.setRow(0).to(0);
		world.setCol(48).to(0);
		world.setRow(48).to(0);
		
		iter = 0;

		var temp = getValueFromTextarea("ITERTIME", txa3);
		iterMax = parseInt(temp);

		var temp = getValueFromTextarea("SCENARIO", txa3);
		var dataSetId = parseInt(temp);
		if(dataSetId > 10) {
			console.log("WARNING: dataSetId > 10 will be set to 0");
		}
		
		var temp = getValueFromTextarea("HEALTIME", txa3);
		var healingTime = parseInt(temp);
		
		var temp = getValueFromTextarea("INFAGENT", txa3);
		var infagent = temp.split(",").map(i => parseInt(i));
		
		var temp = getValueFromTextarea("RECAGENT", txa3);
		var recagent = temp.split(",").map(i => parseInt(i));
		
		txa1.value = "";
		txa2.value = "";
		
		initialize(dataSetId, healingTime, infagent, recagent);
		
		btn.disabled = false;
		btn2.disabled = true;
	});

	btn = document.createElement("button");
	btn.innerHTML = "Start";
	btn.style.width = "70px";
	btn.disabled = true;
	divBtn.append(btn);
	
	btn.addEventListener("click", function() {
		var e = arguments[0];
		var t = e.target;
		console.log(t.innerHTML);
		if(t.innerHTML == "Start") {
			proc = setInterval(
				function() { 
					simulate(
						agent, road, city, 
						world, "can0") 
				},
				10
			);
			
			t.innerHTML = "Stop";
			btn0.disabled = true;
		} else {
			clearInterval(proc);
			t.innerHTML = "Start";
			btn0.disabled = false;
		}
	});
	
	btn2 = document.createElement("button");
	btn2.innerHTML = "Save";
	btn2.style.width = "70px";
	btn2.disabled = true;
	divBtn.append(btn2);
	
	btn2.addEventListener("click", function() {
		var params = txa3.value;
		var outCity = txa1.value;
		var outAgent = txa2.value;

		var sdt = new Date();
		var dd = sdt.getDate();
		var mm = ("0" + (sdt.getMonth() + 1)).slice(-2);
		var yyyy = sdt.getYear() + 1900;
		var HH = ("0" + sdt.getHours()).slice(-2);
		var MM = ("0" + sdt.getMinutes()).slice(-2);
		var SS = ("0" + sdt.getSeconds()).slice(-2);
		var datetime = yyyy + "-" + mm + "-" + dd + " " +
			HH + ":" + MM + ":" + SS;
		
		var fn = yyyy + "-" + mm + "-" + dd + "-" +
			HH + "-" + MM + "-" + SS;

		var content = "" +
			"# abm-sir\n" +
			"Output of `abm-sir` as part of [`abm-x`]" +
			"(https://github.com/dudung/abm-x)\n" +
			"\n" +
			"## Parameter\n```\n" +
			div3.innerHTML + "\n" +
			params +
			"\n```\n\n" +
			"## City\n" +
			"![](" + fn + ".png)\n\n```\n" +
			div1.innerHTML + "\n" +
			outCity +
			"\n```\n\n" +
			"## Agent\n```\n" +
			div2.innerHTML  + "\n" +
			outAgent +
			"\n```\n\n" +
			"## Note\n" +
			"Created on " + datetime;

		// Solution 0 -- only view the result
		/*
		console.log(content);
		*/
		
		/*
		// Solution 1 -- can not change filename
		var uriContent = "data:application/octet-stream," + 	
			encodeURIComponent(content);
		newWindow = window.open(uriContent, 'neuesDokument');
		*/
		
		/*
		// Solution 2 -- can not save new window
		var nw = window.open("");
		var div = document.createElement("pre");
		div.innerHTML = content;
		nw.document.body.append(div);
		*/
		
		// Solution 3 -- it works [12], even without append to body
		var nw = window.open("");
		var uriContent = "data:application/octet-stream," + 	
			encodeURIComponent(content);
		var a = document.createElement("a");
		nw.document.body.append(a);
		a.download = fn + ".md";
		a.href = uriContent;
		a.click();
		nw.close();
		
		var can = document.getElementById("can0");
		var a = document.createElement("a");
		a.download = fn + ".png";
		a.href = can.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");
		a.click();
		
		var ldir = "file:///C:/Users/Sparisoma%20Viridi/Downloads/";
		var ffn = ldir + fn + ".md";
		setTimeout(function() {	var nw2 = window.open(ffn); }, 2000);
		
	});
	
	btn1 = document.createElement("button");
	btn1.innerHTML = "About";
	btn1.style.width = "70px";
	divBtn.append(btn1);
	
	btn1.addEventListener("click", function() {
		alert(
			"abm-sir (version 20200613)\n" +
			"Sparisoma Viridi | https://gihub.com/dudung\n" +
			"Armi Susandi | https://fitb.itb.ac.id/" +
			"dr-rer-nat-armi-susandi-mt"
		);
	});

	can.addEventListener("click", function() {
		/*
		var e = arguments[0];
		var t = e.target;
		var x = e.offsetX;
		var y = e.offsetY;
		
		var dx = matrixPixelSize;
		var dy = matrixPixelSize;
		
		var c = Math.floor(x / dx);
		var r = Math.floor(y / dy);
		if(world != undefined) {
			world.m[r][c] = 1;
		}
		
		paintMatrix(world).onCanvas(canId);
		*/
	});
}


// Initialize
function initialize() {
	var dataSetId = arguments[0];
	var healingTime = arguments[1];
	var infagent = arguments[2];
	var recagent = arguments[3];
	
	// Select case according to dataSetId
	world.setRow(24).to(0);
	world.setCol(24).to(0);
	
	if(dataSetId < 6) {
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < dataSetId; j++) {
				world.m[24][3 + i * 5 + j] = 1;
				world.m[3 + i * 5 + j][24] = 1;
				world.m[24][45 - (i * 5 + j)] = 1;
				world.m[45 - (i * 5 + j)][24] = 1;
			}
		}
	} else if(dataSetId < 11) {
		for(var i = 0; i < 4; i++) {
			var jMax = dataSetId - 5;
			for(var j = 0; j < jMax; j++) {
				world.m[24][3 + i * 5 + j] = 1;
				world.m[24][45 - (i * 5 + j)] = 1;
				world.m[45 - (i * 5 + j)][24] = 1;
			}
		}
	} else {
	}
	
	// Define cities region
	city = [];
	createAllCities();
	
	// Define roads
	road = [];
	createAllRoads();
	
	// Create agents of type Agent, typeS
	agent = [];
	createAllAgents(healingTime);
	
	// Set origin infection agent
	/*
	oiAgent = 0;
	agent[oiAgent].setInfected(iter);
	*/
	for(var i = 0; i < infagent.length; i++) {
		var id = infagent[i];
		agent[id].setInfected(iter);
	}
	
	// Set origin recovered agent
	for(var i = 0; i < recagent.length; i++) {
		var id = recagent[i];
		agent[id].setInfected(iter);
		agent[id].setRecovered(iter);
	}
	
	// Display agents
	var N = agent.length;
	for(var i = 0; i < N; i++) {
		agent[i].paint();
	}
	
	// Paint the matrix on canvas
	paintMatrix(world).onCanvas(canId);
}


// Simulate
function simulate() {
	var a = arguments[0];
	var r = arguments[1];
	var c = arguments[2];
	var w = arguments[3];
	var id = arguments[4];
	
	for(var i = 0; i < a.length; i++) {
		a[i].moveOnRoad(r);
		a[i].checkCity(c, iter);
		a[i].heal(iter);
		a[i].spreadInfection(iter, a);
	}
	paintMatrix(w).onCanvas(id);
	
	for(var i = 0; i < c.length; i++) {
		c[i].calcSIR(iter, a);
	}
	
	/*
	var str = iter + "\n";
	for(var i = 0; i < agent.length; i++) {
		str += ("0" + i).slice(-2) + " | ";
		str += agent[i].visitedCity + " | ";
		str += agent[i].visitedIter + "\n";
	}
	txa.value = str;
	*/
	
	var N = 0;
	var str = iter.toString().padStart(3, "0") + " ";
	for(var i = 0; i < city.length; i++) {
		var lastS = city[i].S[city[i].S.length - 1];
		var lastI = city[i].I[city[i].I.length - 1];
		var lastR = city[i].R[city[i].R.length - 1];
		var lastN = city[i].N[city[i].N.length - 1];
		
		N += lastN;
		
		str += lastS.toString().padStart(3, "0") + " ";
		str += lastI.toString().padStart(3, "0") + " ";
		str += lastR.toString().padStart(3, "0") + " ";
		str += lastN.toString().padStart(3, "0") + " ";
	}
	str += N.toString().padStart(3, "0");
	if(iter > 0) txa1.value += "\n";
	txa1.value += str;
	txa1.scrollTop = txa1.scrollHeight;
	
	if(iter >= iterMax) {
		for(var i = 0; i < agent.length; i++) {
			var iba = agent[i].infectedByAgent;
			for(var j = 0; j < agent.length; j++) {
				if(iba == -1) {
					break;
				} else if(iba === agent[i].id) {
					agent[i].chainInfection.push(
						iba.toString().padStart(3, "0")
					);
					break;
				} else if(iba == agent[i].chainInfection[agent[i].
					chainInfection.length -1]) {
					break;
				} else {
					agent[i].chainInfection.push(
						iba.toString().padStart(3, "0")
					);
				}
				iba = agent[iba].infectedByAgent;
			}
		}
	}
	
	var str = "";
	for(var i = 0; i < agent.length; i++) {
		str += agent[i].id.toString().padStart(3, "0");
		str += " ";
		
		var sus = agent[i].timeSusceptible.toString()
			.padStart(3, "0");
		str += sus;
		str += " ";
		
		var inf = agent[i].timeInfected.toString()
			.padStart(3, "0");
		if(inf == "0-1") inf = "-01";
		str += inf;
		str += " ";
		
		var rec = agent[i].timeRecovered.toString()
			.padStart(3, "0");
		if(rec == "0-1") rec = "-01";
		str += rec;
		str += " ";
		
		var iba = agent[i].infectedByAgent.toString()
			.padStart(3, "0");
		if(iba == "0-1") iba = "-01";
		str += iba;
		str += " ";
		
		str += agent[i].chainInfection.join("-");
		
		if(i < agent.length - 1) str += "\n";
	}
	txa2.value = str;
	
	iter++;
	if(iter > iterMax) {
		clearInterval(proc);
		btn.innerHTML = "Start";
		btn.disabled = true;
		btn0.disabled = false;
		btn2.disabled = false;
	}
}


// Create all agents
function createAllAgents() {
	var healingTime = arguments[0];

	// Create of agent in NW region, typeS
	var xmin = 2;
	var xmax = 23;
	var dx = 2;
	var ymin = 2;
	var ymax = 23;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
	
	// Create of agent in NE region, typeS
	var xmin = 26;
	var xmax = 47;
	var dx = 2;
	var ymin = 2;
	var ymax = 23;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
	
	// Create of agent in SW region, typeS
	var xmin = 2;
	var xmax = 23;
	var dx = 2;
	var ymin = 26;
	var ymax = 47;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
	
	// Create of agent in SE region, typeS
	var xmin = 26;
	var xmax = 47;
	var dx = 2;
	var ymin = 26;
	var ymax = 47;
	var dy = 2;
	for(var y = ymin; y <= ymax; y += dy) {
		for(var x = xmin; x <= xmax; x += dx) {
			var a = new AgentSIR(x, y);
			a.setWorld(world);
			a.setSusceptible(iter);
			a.setHealingTime(healingTime);
			a.checkCity(city, iter);
			agent.push(a);
			a.id = agent.length - 1;
		}
	}
}	

	
// Create all roads
function createAllRoads() {
}


// Create all cities
function createAllCities() {
	// Define NW city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([01, 01, 23, 23]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);

	// Define NE city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([25, 01, 47, 23]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);
	
	// Define SW city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([01, 25, 23, 47]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);
	
	// Define SE city
	var c1 = new CitySIR;
	c1.setName("NW");
	c1.setType(5);
	c1.setRegion([25, 25, 47, 47]);
	c1.setWorld(world);
	c1.paint();
	city.push(c1);
}


// Get value from textarea -- note different format
function getValueFromTextarea() {
	var pattern = arguments[0];
	var txa = arguments[1];
	var val = "";
	var lines = txa.value.split("\n");
	for(var i = 0; i < lines.length; i++) {
		var cols = lines[i].split(" ");
		if(cols[0] == pattern) {
			val = cols[1];
			break;
		}
	}
	return val;
}