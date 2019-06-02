/*
	tabs.js
	A GUI based on div element for containing visual elements,
	e.g. textarea and canvas, which can be hidden and shown
	using appropriate button
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180615
	Create this class in order to overcome problem of not
	unique ID of elements as TabText and TabCanvas functions
	are used.
	20180616
	Continue creating this class. Class style tablinks must
	also be labeled with id.
	20180617
	Fix referencing to this in event handler.
	Fix size of canvas.
	Canvas and textarea can be accessed through text(label)
	graphic(label).
	20180618
	Add element(label) for alternative to textarea(label) and
	canvas(label).
	20180714
	Remove a line in arch outputting to console.
*/

// Define class of Tabs
class Tabs {
	// Create constructor
	constructor() {
		// Set rules for number of arguments
		if(arguments.length == 0) {
			var msg = "Tabs requires id (and parentId) as "
				+ "arguments";
			throw new Error(msg);
		} else if(arguments.length == 1){
			this.id = arguments[0];
			this.parentId = "document.body";
			var msg = "Tabs " + this.id + " assumes that parent is"
				+ " document.body";
			console.warn(msg);
		} else {
			this.id = arguments[0];
			this.parentId = arguments[1]
		}
		
		// Check whether id already exists
		var el = document.getElementById(this.id);
		var idExist = (el != undefined)
		if(idExist) {
			var msg = this.id + " exists";
			throw new Error(msg)
		}
		
		// Create style
		this.createAllStyle(this.id);
		this.tabcs = "tab" + this.id;
		this.tabbtncs = "tab" + this.id + " button";
		this.tablinkscs =  "tablinks" + this.id;
		this.divcontcs =  "divcontent" + this.id;
		this.tabcontcs =  "tabcontent" + this.id;
		
		// Try not so good workaround
		localStorage.setItem(this.tablinkscs, this.tablinkscs);
		localStorage.setItem(this.tabcontcs, this.tabcontcs);
		
		// Define visual container
		var tab  = document.createElement("div");
		tab.id = this.id;
		tab.className = this.tabcs;
		this.tab = tab;
		
		// Set parent of Tabs instance
		if(this.parentId == "document.body") {
			document.body.append(this.tab);
		} else {
			var el = document.getElementById(this.parentId);
			el.append(this.tab);
		}
		
		// Define array for storing tab button information
		this.tabs = [];
		this.tabsType = [];
	}
	
	// Set background color
	setBackground(color) {
		Style.changeStyleAttribute('.' + this.tabcs,
			"background", color);
	}
	
	// Set width
	setWidth(width) {
		Style.changeStyleAttribute('.' + this.tabcs,
			"width", width);		
	}
	
	// Set hight
	setHeight(height) {
		Style.changeStyleAttribute('.' + this.tabcs,
			"height", height);		
	}
	
	// Ada label for tab button
	addTab(label, type) {
		// Erase div
		var divid = this.id + "div";
		var div = document.getElementById(divid);
		if(div != undefined) {
			div.remove();
		}
		
		// Avoid same tab label
		var ilabel = this.tabs.indexOf(label);
		if(ilabel < 0) {
			this.tabs.push(label);
			this.tabsType.push(type);
		} else {
			var msg = "Duplicate label " + label + " is igonered";
			console.warn(msg);
		}
		
		// Create tab buttons
		var N = this.tabs.length;
		for(var i = 0; i < N; i++) {
			var id = this.id + this.tabs[i];
			var btn = document.getElementById(id);
			if(btn == undefined) {
				var btn = document.createElement("button");
				btn.id = id;
				btn.className = this.tablinkscs;
				btn.innerHTML = this.tabs[i];
				btn.addEventListener("click", this.toggleContent)
				this.tab.append(btn);
			}
		}
		
		// Recreate div -- without following line act differently
		// when number of tab buttons is odd or even
		div = document.getElementById(divid);
		if(div == undefined) {
			var div = document.createElement("div");
			div.id = divid;
			div.className = this.divcontcs;
			this.tab.append(div);
		}
		
		// Adjust textarea or canvas width
		var width = parseInt(Style.getStyleAttribute('.' +
			this.tabcs, "width"));
		var pl = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingLeft"));
		var pr = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingRight"));
		var dh = 14;
		var tcwidth = (width - pl - pr - dh) + "px";
		Style.changeStyleAttribute('.' + this.tabcontcs,
			"width", tcwidth);
		
		var height = parseInt(Style.getStyleAttribute('.' +
			this.tabcs, "height"));
		var pt = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingTop"));
		var pb = parseInt(Style.getStyleAttribute('.' +
			this.divcontcs, "paddingBottom"));
		var dv = 38;
		var tcheight = (height - pt - pb - dv) + "px";
		Style.changeStyleAttribute('.' + this.tabcontcs,
			"height", tcheight);

		// Create content of div
		for(var i = 0; i < N; i++) {
			var id = this.id + this.tabs[i] + "content";
			var el = document.getElementById(id);
			if(el == undefined) {
				var el;
				if(this.tabsType[i] == 0) {
					el = document.createElement("textarea");
					el.className = this.tabcontcs;
					el.innerHTML = this.tabs[i];
				} else if(this.tabsType[i] == 1) {
					el = document.createElement("canvas");
					el.className = this.tabcontcs;
					el.width = parseInt(tcwidth);
					el.height = parseInt(tcheight);
					el.getContext("2d").font = "12px Courier";
					el.getContext("2d").fillText(this.tabs[i], 2, 10);
					el.getContext("2d").beginPath();
					el.getContext("2d")
						.arc(45, 45, 20, 0, 2 * Math.PI);
					el.getContext("2d").stroke();
					el.getContext("2d").beginPath();
					el.getContext("2d")
						.arc(55, 25, 10, 0, 2 * Math.PI);
					el.getContext("2d").stroke();
				}
				el.id = id;
				div.append(el);
			}
		}
		
		// Adjust width according to number of tab buttons
		this.updateTabButtonsWidth();
		
		// Initiate visible tab -- 20180617.0918
		this.toggleContent(0);
	}
	
	// Remove label for tab button
	removeTab(label) {
		// 20180616.0445
		// Tom Wadley, Beau Smith
		// https://stackoverflow.com/a/5767357/9475509
		var i = this.tabs.indexOf(label);
		var remE = this.tabs.splice(i, 1);
		this.tabsType.splice(i, 1);
		
		// Warn only for unexisting label for removing
		if(i < 0) {
			var msg = "Unexisting label " + label + " for removing "
				+ "is igonered";
			console.warn(msg);
		}
		
		// 20180616.1612
		// Catalin Rosu
		// https://catalin.red/removing-an-element-with
		// -plain-javascript-remove-method/
		
		// Remove tab button
		var id = this.id + remE;
		var btn = document.getElementById(id);
		btn.remove();
		this.updateTabButtonsWidth();
		
		// Remove element related to tab button
		var id2 = this.id + remE + "content";
		var el = document.getElementById(id2);
		el.remove();
		
		// Initiate visible tab after remove a tab button
		// -- 20180617.1031
		this.toggleContent(0);
	}
	
	// Check and update tab buttons
	updateTabButtonsWidth() {
		var N = this.tabs.length;
		var M = document.getElementsByClassName(this.tablinkscs)
			.length;
		// Make sure that label and tabbutton have the same size
		if(M == N) {
			var width =
				Style.getStyleAttribute('.' + this.tabcs, "width");
			var btnWidth = parseInt(width) / N + "px";
			Style.changeStyleAttribute('.' + this.tabbtncs,
				"width", btnWidth);
		}
	}
	
	// Get class name -- problem by event also not work
	getStyleClassName() {
		var scn = [];
		scn.push(this.tabcs);
		scn.push(this.tabbtncs);
		scn.push(this.tablinkscs);
		scn.push(this.tabcontcs);
		return scn;
	}
		
	// Toggle tab content when button clicked
	toggleContent() {
		// The idea using styles is from
		// https://www.w3schools.com/howto/howto_js_tabs.asp
		
		if(event != undefined) {
			// Get style name with workaround using localStorage
			var parent = event.target.parentElement;
			var tlcs = localStorage
				.getItem("tablinks" + parent.id);
			var tccs = localStorage
				.getItem("tabcontent" + parent.id);

			// Remove active from all button
			var tablinks = document.getElementsByClassName(tlcs);
			var N = tablinks.length;
			for(var i = 0; i < N; i++) {
				var className = tablinks[i].className;
				var newClassName = className.replace("active", "");
				tablinks[i].className = newClassName;
			}
			
			// Hide all tabcontent
			var tabcont = document.getElementsByClassName(tccs);
			var N = tabcont.length;
			for(var i = 0; i < N; i++) {
				tabcont[i].style.display = "none";
			}
			
			// Set active to current button and show related content
			var target = event.target;
			target.className += " active";
			var id = target.id + "content";
			var el = document.getElementById(id);
			el.style.display = "block";
		} else {
			var i = arguments[0];
			var id = this.id;
			var tlcs = localStorage.getItem("tablinks" + id);
			var tccs = localStorage.getItem("tabcontent" + id);
			var tablinks = document.getElementsByClassName(tlcs);
			var tabcont = document.getElementsByClassName(tccs);
			
			// Fixed -- 20180617.0918 for undefined
			// -- 1020 for multiple active
			if(tablinks.length > 0 && tabcont.length > 0) {
				var className = tablinks[i].className;
				var newClassName = className.replace("active", "");
				tablinks[i].className = newClassName;
				tablinks[i].className += " active";
				tabcont[i].style.display = "block";
			}
		}
	}
	
	// Create default style for this class
	createAllStyle(id) {
		// Set style of the tab
		Style.createStyle(
		'.tab' + id + ` {
			overflow: hidden;
			width: 240px;
			height: 200px;
			background: #f1f1f1;
			border: 1px solid #ccc;
			float: left;
		}
		`);

		// Set style of the buttons inside the tab
		Style.createStyle(
		'.tab' + id +  ` button {
			background: #ddd;
			float: left;
			outline: none;
			border: none;
			padding: 6px 6px;
			width: 60px;
			height: 28px;
			cursor: pointer;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		`);

		// Set style of the buttons inside the tab on mouse hover
		Style.createStyle(
		'.tab' + id + ` button:hover {
			background: #e7e7e7;
			color: #000;
		}
		`);

		// Set style of current active button
		Style.createStyle(
		'.tab' + id + ` button.active {
			background: #f1f1f1;
			color: #000;
		}
		`);
		
		// Set style of div content, parent of textarea
		Style.createStyle(
		'.divcontent' + id + ` {
			clear: both;
			padding: 4px 4px;
			background: inherit;
		}
		`);
		
		// Set style of tab content, which is a textarea
		Style.createStyle(
		'.tabcontent' + id + ` {
			width: 182px;
			display: none;
			padding: 4px 6px;
			overflow-Y: scroll;
			border: 1px solid #aaa;
			background: #fff;
			margin: 0px;
		}
		`);
	}
	
	// Get access to textarea of tab with name
	textarea(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var nottextarea = !(el instanceof HTMLTextAreaElement);
		if(nottextarea) {
			var msg = "Tabs " + this.id + " " + label +
				" is not as a textarea";
			throw new Error(msg);
		} else {
			return el;
		}
	}
	
	// Get access to canvas of tab with name
	canvas(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var notcanvas = !(el instanceof HTMLCanvasElement);
		if(notcanvas) {
			var msg = "Tabs " + this.id + " " + label +
				" is not as a canvas";
			throw new Error(msg);
		} else {
			return el;
		}
	}
	
	// Get element
	element(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		return el;
	}
	
	// Manipulate directly tab content of type text
	text(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var textarea = (el instanceof HTMLTextAreaElement);
		
		// Handle content as textarea
		if(textarea) {
			var lines = el.value.split("\n");
			var tav = {
				push: function(line) {
					// Avoid first empty line after clear textarea
					if(lines.length == 1 && lines[0].length == 0) {
						lines[0] = line;
					} else {
						lines.push(line);
					}
					var val = lines.join("\n");
					el.value = val;
				},
				pop: function() {
					var pl = lines.pop();
					var val = lines.join("\n");
					el.value = val;
					return pl;
				},
				popAll: function() {
					el.value;
					return lines;
				},
				clear: function() {
					el.value = "";
				},
			}
			return tav;
		} else {
			var msg = this.id + " " + this.tabs[i] +
				" is not a textarea";
			throw new Error(msg);
		}
	}

	// Manipulate directly tab content of type graphic
	graphic(label) {
		var i = this.tabs.indexOf(label);
		var id = this.id + this.tabs[i] + "content";
		var el = document.getElementById(id);
		var canvas = (el instanceof HTMLCanvasElement);
		var ctx = el.getContext("2d");
		
		// Handle content as canvas
		if(canvas) {
			// Define COORD
			el.RANGE = [0, el.height, el.width, 0];
			
			// Define object for handling drawing process
			var can = {
				setCoord: function(range) {
					el.range = range;
				},
				getCoord: function() {
					return el.range;
				},
				getCOORD: function() {
					return el.RANGE;
				},
				setLineColor: function(color) {
					ctx.strokeStyle = color;
				},
				setFillColor: function(color) {
					ctx.fillStyle = color;
				},
				trect: function(x, y, width, height) {
					var xx = Transformation.linearTransform(
						x,
						[el.range[0], el.range[2]], 
						[el.RANGE[0], el.RANGE[2]]
					);
					var yy = Transformation.linearTransform(
						y,
						[el.range[1], el.range[3]], 
						[el.RANGE[1], el.RANGE[3]]
					);
					var xxdx = Transformation.linearTransform(
						x + width,
						[el.range[0], el.range[2]], 
						[el.RANGE[0], el.RANGE[2]]
					);
					var yydy = Transformation.linearTransform(
						y + height,
						[el.range[1], el.range[3]], 
						[el.RANGE[1], el.RANGE[3]]
					);
					var ww = xxdx - xx;
					var hh = yydy - yy;
					return [xx, yy, ww, hh];
				},
				rect: function(x, y, width, height) {
					var tc = this.trect(x, y, width, height);
					ctx.rect(tc[0], tc[1], tc[2], tc[3]);
				},
				strokeRect: function(x, y, width, height) {
					var tc = this.trect(x, y, width, height);
					ctx.strokeRect(tc[0], tc[1], tc[2], tc[3]);
				},
				fillRect: function(x, y, width, height) {
					var tc = this.trect(x, y, width, height);
					ctx.fillRect(tc[0], tc[1], tc[2], tc[3]);
				},
				arc: function(x, y, r, sAngle, eAngle) {
					var tc = this.trect(x, y, r, r);
					ctx.beginPath();
					ctx.arc(tc[0], tc[1], tc[2], sAngle, eAngle);
					ctx.stroke();
				},
				strokeCircle: function(x, y, r) {
					this.arc(x, y, r, 0, 2 * Math.PI);
				},
				fillCircle: function(x, y, r) {
					this.arc(x, y, r, 0, 2 * Math.PI);
					ctx.fill();
				},
				setPointType: function(pointType) {
					el.pointType = pointType;
				},
				setPointSize: function(pointSize) {
					el.pointSize = pointSize;
				},
				point: function(x, y) {
					var r = el.pointSize;
					var t = el.pointType;
					if(t == "circle") {
						var tc = this.trect(x, y, r, r);
						ctx.beginPath();
						ctx.arc(tc[0], tc[1], 0.5 * r, 0, 2 * Math.PI);
						ctx.stroke();
					} else if(t == "box") {
						var tc = this.trect(x, y, r, r);
						var dr = 0.5 * r;
						ctx.strokeRect(tc[0] - dr, tc[1] - dr, r, r);
					}
				},
				points: function(x, y) {
					var Nx = x.length;
					var Ny = y.length;
					var N = Math.min(Nx, Ny);
					for(var i = 0; i < N; i++) {
						this.point(x[i], y[i]);
					}
				},
				lines: function(x, y) {
					var Nx = x.length;
					var Ny = y.length;
					var N = Math.min(Nx, Ny);
					ctx.beginPath();
					for(var i = 0; i < N; i++) {
						var xi = x[i];
						var yi = y[i];
						var tc = this.trect(xi, yi, 0, 0);
						if(i == 0) {
							ctx.moveTo(tc[0], tc[1]);
						} else {
							ctx.lineTo(tc[0], tc[1]);
						}
					}
					ctx.stroke();
				},
				clear: function() {
					ctx.clearRect(0, 0, el.width, el.height);
				},
			}
			return can;
		} else {
			var msg = this.id + " " + this.tabs[i] +
				" is not a canvas";
			throw new Error(msg);
		}
	}
}

// Export module
module.exports = function() {
	return Tabs;
};
