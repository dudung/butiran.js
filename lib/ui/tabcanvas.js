/*
	tabcanvas.js
	Tabs of canvas for input and output in simulation using
	butiran.js library.
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180614
	Start by modifying lib/ui/tabcanvas.js libraries and
	functions.
	Two or more instance will still sharing same elementId.
	It is still a bug.
*/

// Reserver id of textareas
var canIds = [];
var canId;

// Create IO division based on several divs and a textarea
function createTabCanvasIO(menu, parent, dimension) {
	// Set style of the tab
	Style.createStyle(`
	.tabcan {
		overflow: hidden;
		width: 200px;
		height: 300px;
		background: #f1f1f1;
		border: 1px solid #ccc;
		float: left;
	}
	`);

	// Set style of the buttons inside the tab
	Style.createStyle(`
	.tabcan button {
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
	Style.createStyle(`
	.tabcan button:hover {
		background: #e7e7e7;
		color: #000;
	}
	`);

	// Set style of current active button
	Style.createStyle(`
	.tabcan button.active {
		background: #f1f1f1;
		color: #000;
	}
	`);
	
	// Set style of div content, parent of textarea
	Style.createStyle(`
	.divcontentcan {
		clear: both;
		padding: 4px 4px;
		background: inherit;
	}
	`);
	
	// Set style of tab content, which is a textarea
	Style.createStyle(`
	.tabcontentcan {
		width: 182px;
		display: none;
		padding: 4px 6px;
		overflow-Y: scroll;
		border: 1px solid #aaa;
	}
	`);
	
	// Get IODiv dimension
	width = dimension.width;
	height = dimension.height;
	
	// Get number of menu item
	var N = menu.length;

	// Adjust IODiv dimension
	var div = document.createElement("div");
	div.className = "tabcan";
	Style.changeStyleAttribute(".tabcan", "width", width);
	Style.changeStyleAttribute(".tabcan", "height", height);
	parent.append(div);
	
	// Adjust button width	
	var btnWidth = Math.floor(parseInt(dimension.width) / N) +
		"px";
	Style.changeStyleAttribute(".tabcan button", "width",
		btnWidth);
	
	for(var i = 0; i < N; i++) {
		var btnMenu = document.createElement("button");
		btnMenu.id = "btc" + menu[i];
		btnMenu.innerHTML = menu[i];
		btnMenu.className = "tablinkscan";
		btnMenu.addEventListener("click", openTabCanvas);
		div.append(btnMenu);
	}
	
	var divMenu = document.createElement("div");
	divMenu.className = "divcontentcan";
	divMenu.id = "divMenuCan";
	for(var i = 0; i < N; i++) {
		var taMenu = document.createElement("textarea");
		taMenu.id = "can" + menu[i];
		canIds.push(taMenu.id);
		taMenu.innerHTML = menu[i];
		taMenu.className = "tabcontentcan";
		divMenu.append(taMenu);
	}
	div.append(divMenu);
	
	// Get dimension of elements and set its children's
	var btnPadTop =
		Style.getStyleAttribute(".tabcan button", "paddingTop");
	var btnPadBtm =
		Style.getStyleAttribute(".tabcan button", "paddingBottom");
	var btnHeight =
		Style.getStyleAttribute(".tabcan button", "height");
	var divHeight = (parseInt(height) - parseInt(btnHeight)
		- parseInt(btnPadTop) - parseInt(btnPadBtm)) + "px";
	Style.changeStyleAttribute(".divcontent", "height",
		divHeight);
	
	var divPadTop =
		Style.getStyleAttribute(".divcontentcan", "paddingTop");
	var divPadBtm =
		Style.getStyleAttribute(".divcontentcan", "paddingBottom");
	var tabCoB =
		Style.getStyleAttribute(".tabcontentcan", "borderWidth");
	var tabCoH = (parseInt(divHeight) - parseInt(divPadTop)
		- parseInt(divPadBtm) + 2 * parseInt(tabCoB)) + "px";
	Style.changeStyleAttribute(".tabcontentcan", "height",
		tabCoH);
	
	var tabCoPL = 
		Style.getStyleAttribute(".tabcontentcan", "paddingLeft");
	var tabCoPR = 
		Style.getStyleAttribute(".tabcontentcan", "paddingRight");
	var scrollBarWidth = 10; // Not known
	var tabCoW = (parseInt(width) - parseInt(tabCoPL)
		- parseInt(tabCoPR) - scrollBarWidth) + "px";
	Style.changeStyleAttribute(".tabcontentcan", "width", tabCoW);
	
	/*
	20180614.1301 There are still some problems with dimension,
	and child - parent size relations in width and height.
	*/
	
	// Call initial active button and textarea
	openTabCanvas(0);
	
	return canIds;
}

// Open a canvas
function openTabCanvas(event) {
	// Remove active from all button
	var tablinks = document.getElementsByClassName("tablinkscan");
	var N = tablinks.length;
	for(var i = 0; i < N; i++) {
		var className = tablinks[i].className;
		var newClassName = className.replace("active", "");
		tablinks[i].className = newClassName;
	}
	
	// Hide all tabcontent
	var tabcont = document.getElementsByClassName("tabcontentcan");
	var N = tabcont.length;
	for(var i = 0; i < N; i++) {
		tabcont[i].style.display = "none";
	}
	
	// Set active to current button and show related content
	var target = event.target;
	if(target != undefined) {
		target.className += " active";
		var id = "can" + target.id.substring(3);
		var ta = document.getElementById(id);
		ta.style.display = "block";
	} else {
		var id = event;
		tablinks[0].className += " active";
		tabcont[0].style.display = "block";
	}
}

// Set id
function setId(id) {
	canId = canIds[id];
}

// Pop last line from textarea
function pop(id) {
	var ta = document.getElementById(taId);
	var val = ta.value;
	var lines = val.split("\n");
	var last = lines.pop();
	val = lines.join("\n");
	ta.value = val;
	return last;
}

// Push to textarea
function push(line) {
	var ta = document.getElementById(taId);
	var val = ta.value;
	var lines = val.split("\n");
	lines.push(line);
	val = lines.join("\n");
	ta.value = val;
}

// Export module
module.exports = {
	createTabCanvasIO: function(menu, parent, dimension) {
		return createTabCanvasIO(menu, parent, dimension)
	},
	openTabCanvas: function(event) {
		return openTabCanvas(event);
	},
	setId: function(id) {
		return setId(id);
	},
	pop: function() {
		return pop();
	},
	push: function(line) {
		return push(line);
	},
};
