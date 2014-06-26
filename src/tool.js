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

		if (!selector) {
			this.length = 1;
			this[0] = doc.documentElement;

			return this;
		}

		//if HTML string, construct domfragment, fill object, then return object
		if (typeof selector === 'string' &&
			selector.charAt(0) === "<" &&
			selector.charAt( selector.length - 1 ) === ">" &&
			selector.length >= 3){var divElm = d.createElement('div');
			divElm.className = 'hippo-doc-frag-wrapper';
			var docFrag = d.createDocumentFragment();
			docFrag.appendChild(divElm);
			var queryDiv = docFrag.querySelector('div');
			queryDiv.innerHTML = selector;
			var numberOfChildren = queryDiv.children.length;

			//loop over nodelist and fill object, needs to be done because a string of html can be passed with siblings
			for (var z = 0; z < numberOfChildren; z++) {
				this[z] = queryDiv.children[z];
			}

			//give the object a length value
			this.length = numberOfChildren;

			return this;
		}

		//if a single element node reference is passed, fill object, return object
		if (typeof selector === 'object' && selector.nodeName) {
			this.length = 1;
			this[0] = selector;

			return this;
		}

		if (typeof selector !== 'string') {//its not a string so its an array or nodelist
			nodes = selector; //so... is already something that can be looped with for loop
		}
		else {//if its a string create a nodelist, use context if provided
			if (typeof context === 'string' && d.querySelectorAll(context)[0] === undefined) {//bad context return nothing
				nodes = []; //no context
			}
			else {//its a string selector, create a context first, then run query again, or use current document
				nodes = (typeof context === 'string' ? d.querySelectorAll(context)[0] : d).querySelectorAll(selector);
			}
		}

		for (var i = 0; i < nodes.length; i++) {
			this[i] = nodes[i];
		}

		this.length = nodes.length;
		
		return this;
	};

	root.tool = tool;

	tool.fn = Tool.prototype = {
		constructor: tool
	};

	tool.each = function(obj, callback) {
		var name,
			length = obj.length;

		if (length === undefined) {
			for (name in obj) {
				if (callback.call(obj[name], name) === false) {
					break;
				}
			}
		}
		else {
			for (var i = 0; i < length; i++) {
				if (callback.call(obj[i], i) === false) {
					break;
				}
			}
		}

		return obj;
	};

	tool.fn.size = function() {
		return this.length;
	};

	tool.fn.each = function(callback) {
		return tool.each(this, callback);
	};

	tool.fn.get = function(index) {
		return index === undefined ? this[0] : this[index];
	};

	tool.fn.at = function(index) {
		return tool(this.get(index));
	}

	tool.fn.first = function() {
		return tool(this[0]);
	};

	tool.fn.last = function() {
		return tool(this[this.length - 1]);
	};

	tool.fn.show = function() {
		this[0].style.display = 'block';
	}

	tool.fn.hide = function() {
		this[0].style.display = 'none';
	};

}).call(this);
