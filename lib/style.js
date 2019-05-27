/*
	style.js
	Create style, get attribute, change attribute
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180614
	Create this library of functions by moving it from gstd.js
	application.
	Move it from lib/css to lib since it is only one.
*/

// Get attribute value of a style
function getStyleAttribute(style, attr) {
	var N = document.styleSheets.length;
	var styles = document.styleSheets;
	var value;
	for(var i = 0; i < N; i++)
	{
		if(styles[i].rules[0].selectorText == style)
		value = styles[i].rules[0].style[attr];
	}
	return value;
}

// Change style attribute with value
function changeStyleAttribute(style, attr, value) {
	// dudung, "Modify previously defined style in JS"
	// https://stackoverflow.com/q/50847689/9475509
	var N = document.styleSheets.length;
	var styles = document.styleSheets;
	for(var i = 0; i < N; i++)
	{
		if(styles[i].rules[0].selectorText == style)
		styles[i].rules[0].style[attr] = value;
	}
}

// Create a style
function createStyle(css) {
	// Christoph, TomFuertes, answer of "How to create
	// a <style> tag with Javascript"
	// https://stackoverflow.com/a/524721/9475509
	var head = document.head ||
		document.getElementsByTagName("head")[0];
	var style = document.createElement("style");
	style.type = "text/css";
	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		var textNode = document.createTextNode(css);
		style.append(textNode);
	}
	head.append(style);
}

// Export module
module.exports = {
	createStyle: function(css) {
		return createStyle(css)
	},
	changeStyleAttribute: function(style, attr, value) {
		return changeStyleAttribute(style, attr, value);
	},
	getStyleAttribute: function(style, attr) {
		return getStyleAttribute(style, attr);
	},
};
