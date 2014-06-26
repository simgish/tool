(function (window, undefined) {

	'use strict';

	var root = this,
		doc = root.document,
		hasOwnProperty = Object.prototype.hasOwnProperty;

	var tool = function(selector, context) {
		return new Tool(selector, context);
	};

	// Constructor
	var Tool = function(selector, context) {
		// context can be a selector, element, this document, or iframe document
		var d,
			nodes;

		if (context && context.nodeType) {
			// node
			if (context.nodeType === 1) {
				// element
				d = context.ownerDocument;
			}
			else {
				// document or iframe
				d = context.body.ownerDocument;
			}
		}
		else {
			// selector
			d = doc;
		}

		if (typeof selector === 'string') {
			nodes = document.querySelectorAll(selector);
		}

		for (var i = 0; i < nodes.length; i++) {
			this[i] = nodes[i];
		}

		this.length = nodes.length;
		
		return this;
	};

	tool.fn = Tool.prototype = {
		constructor: tool
	};

	tool.fn.size = function() {
		return this.length;
	};

	tool.fn.children = function() {
		return this[0].children;
	};

	tool.fn.text = function(data) {
		return this.textContent;
	};

	tool.fn.has = function(obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	tool.fn.map = function(callback) {
		var res = [];

		for (var i = 0; i < this.length; i++) {
			res.push(callback.call(this, this[i], i));
		}

		return res;
	};

	tool.fn.forEach = function(callback) {
		this.map(callback);

		return this;
	};

	tool.fn.get = function(index) {
		return index === undefined ? this[0] : this[index];
	}

	tool.fn.id = function(id) {
		return document.getElementById(id);
	};

	tool.fn.tag = function(tag) {
		return document.getElementsByTagName(tag);
	};

	root.tool = tool;

}).call(this);
