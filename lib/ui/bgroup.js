/*
	bgroup.js
	A GUI based on div element for containing buttons
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180619
	Create this based on Tabs.
	Add enable, disable, setCaption.
*/

// Define class of Bgroup
class Bgroup {
	// Create constructor
	constructor() {
		// Set rules for number of arguments
		if(arguments.length == 0) {
			var msg = "Bgroup requires id (and parentId) as "
				+ "arguments";
			throw new Error(msg);
		} else if(arguments.length == 1){
			this.id = arguments[0];
			this.parentId = "document.body";
			var msg = "Bgroup " + this.id + " assumes that " + 
				"parent is document.body";
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
		this.bgroupcs = "bgroup" + this.id;
		this.buttoncs = "button" + this.id;
		
		// Define visual container
		var bgroup  = document.createElement("div");
		bgroup.id = this.id;
		bgroup.className = this.bgroupcs;
		this.bgroup = bgroup;
		
		// Set parent of Tabs instance
		if(this.parentId == "document.body") {
			document.body.append(this.bgroup);
		} else {
			var el = document.getElementById(this.parentId);
			el.append(this.bgroup);
		}
		
		// Define array for storing tab button information
		this.buttons = [];
		this.funcs = [];
	}
	
	// Set background color
	setBackground(color) {
		Style.changeStyleAttribute('.' + this.bgroupcs,
			"background", color);
	}
	
	// Set width
	setWidth(width) {
		Style.changeStyleAttribute('.' + this.bgroupcs,
			"width", width);		
	}
	
	// Set hight
	setHeight(height) {
		Style.changeStyleAttribute('.' + this.bgroupcs,
			"height", height);		
	}
	
	// Ada button
	addButton(label, func) {
		// Avoid same button
		var ibutton = this.buttons.indexOf(label);
		if(ibutton < 0) {
			this.buttons.push(label);
		} else {
			var msg = "Duplicate label " + label + " is igonered";
			console.warn(msg);
		}
		
		// Create tab buttons
		var N = this.buttons.length;
		for(var i = 0; i < N; i++) {
			var id = this.id + this.buttons[i];
			var btn = document.getElementById(id);
			if(btn == undefined) {
				var btn = document.createElement("button");
				btn.id = id;
				btn.className = this.buttoncs;
				btn.innerHTML = this.buttons[i];
				btn.addEventListener("click", buttonClick)
				this.bgroup.append(btn);
			}
		}
	}
	
	// Remove label for tab button
	removeButton(label) {
		// 20180616.0445
		// Tom Wadley, Beau Smith
		// https://stackoverflow.com/a/5767357/9475509
		var i = this.buttons.indexOf(label);
		var remE = this.buttons.splice(i, 1);
		
		// Warn only for unexisting label for removing
		if(i < 0) {
			var msg = "Unexisting label " + label + " for removing "
				+ "is igonered";
			console.warn(msg);
		}
		
		// Remove tab button
		var id = this.id + remE;
		var btn = document.getElementById(id);
		btn.remove();
		this.updateTabButtonsWidth();
		
		// Initiate visible tab after remove a tab button
		// -- 20180617.1031
		//this.toggleContent(0);
	}
	
	// Enable button with certain label
	disable(label) {
		var i = this.buttons.indexOf(label);
		if(i < 0) {
			var msg = "Disable button " + label
				+ " of unexisting is igonered";
			console.warn(msg);
		} else {
			var id = this.id + this.buttons[i];
			var btn = document.getElementById(id);
			btn.disabled = true;
		}
	}
	
	// Disable button with certain label
	enable(label) {
		var i = this.buttons.indexOf(label);
		if(i < 0) {
			var msg = "Enable button " + label
				+ " of unexisting is igonered";
			console.warn(msg);
		} else {
			var id = this.id + this.buttons[i];
			var btn = document.getElementById(id);
			btn.disabled = false;
		}
	}

	// Set button caption
	setCaption(label) {
		var i = this.buttons.indexOf(label);
		var id = this.id + this.buttons[i];
		if(i < 0) {
			var msg = "Set button caption " + label
				+ " of unexisting is igonered";
			console.warn(msg);
		} else {
			var bt = {
				to: function(caption) {
					var btn = document.getElementById(id);
					btn.innerHTML = caption;
				}
			}
			return bt;
		}
	}
	
	// Create default style for this class
	createAllStyle(id) {
		// Set style of the tab
		Style.createStyle(
		'.bgroup' + id + ` {
			overflow: hidden;
			width: 150px;
			height: 100px;
			background: #f1f1f1;
			border: 1px solid #ccc;
			padding: 4px 4px;
			float: left;
		}
		`);

		// Set style of the buttons inside the tab
		Style.createStyle(
		'.button' + id +  ` {
			background: #ddd;
			float: left;
			width: 60px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		`);
	}
}

// Export module
module.exports = function() {
	return Bgroup;
};
