(function (window, undefined) {

	'use strict';

	var root = this,
	doc = root.document,

	slice = Array.prototype.slice,
	hasOwnProperty = Object.prototype.hasOwnProperty;

	var regXContainsTag = /^\s*<(\w+|!)[^>]*>/;
	var regXDataType = /^\[object\s+(.*?)\]$/;

	var tool = function(selector, context) {
		return new Tool(selector, context);
	};

	// Constructor
	var Tool = function(selector, context) {

		var nodes, currentContext = doc;

        if (context){
			if (context.nodeType){//it's either a document node or element node
				currentContext = context;
			} else { //else it's a string selector, use it to select a node
				currentContext = doc.querySelector(context);
			}
		}

		if (!selector || selector === '' || typeof selector === 'string' && selector.trim() === '') {
			this.length = 0;
			return this;
		}

		if (typeof selector === 'string' && regXContainsTag.test(selector)) {
			var divEl = currentContext.createElement('div');
			divEl.className = 'tool-frag';

			var docFrag = currentContext.createDocumentFragment();
			docFrag.appendChild(divEl);

			var queryDiv = docFrag.querySelector('div');
			queryDiv.textContent = selector;

			var numChildren = queryDiv.children.length;

			for (var c = 0; c < numChildren; c++) {
				this[c] = queryDiv[c];
			}

			this.length = numChildren;

			return this;
		}

		if (typeof selector === 'object' && selector.nodeName) {
			this.length = 1;
			this[0] = selector;

			return this;
		}

		if (typeof selector !== 'string') {
			nodes = selector;
		}
		else {
			nodes = currentContext.querySelectorAll(selector.trim());
		}


		for (var i = 0, nodeLen = nodes.length; i < nodeLen; i++) {
			this[i] = nodes[i];
		}

		this.length = nodes.length;
		
		return this;
	};

	root.tool = tool;

	tool.fn = Tool.prototype = {
		constructor: tool,

		version: '0.0.1',

		each: function(callback) {
			var len = this.length;

			for (var i = 0; i < len; i++) {
				callback.call(this[i], i, this[i]);
			}

			return this;
			// return tool.each(this, callback);
		},

		size: function() {
			console.log(this.type());
			return this.length;
		},

		get: function(index) {
			return index === undefined ? this[0] : this[index];
		},

		at: function(index) {
			var res = this.get(index);
			return tool(res);
		},

		first: function() {
			return tool(this[0]);
		},

		last: function() {
			return tool(this[this.length - 1]);
		},

		map: function (callback) {
			var results = [];

			this.each(function(value, key) {

			})

			for (var i = 0; i < this.length; i++) {
				results.push(callback.call(this, this[i], i));
			}

			return results;
        },

		show: function() {
			return this.each(function() {
				this.style.display = 'block';
			});
		},

		hide: function() {
			return this.each(function() {
				this.style.display = 'none';
			});
		},

		html: function(html) {
			if (html) {
				return this.each(function() {
					this.innerHTML = html;
				});
			}
			else {
				return this[0].innerHTML;
			}
		},

		text: function(text) {
			if (text) {
				return this.each(function() {
					this.textContent = text;
				});
			}
			else {
				return this[0].textContent.trim();
			}
		},

		empty: function() {
			return this.each(function() {
				this.textContent = '';
			});
		},

		children: function() {
			var res = [],
				kids = this[0].childNodes;


			for (var i in kids) {
				if (kids[i].nodeType === 1) {
					res.push(kids[i]);
				}
			}

			return tool(res);
		},

		has: function(selector) {
			var found = false;

			this.each(function() {
				var collection = this.querySelectorAll(selector);
				if (collection.length) {
					found = true;
				}
			});

			return found;
		},

		find: function(selector) {
			var res = [];

			this.each(function() {
				var collection = this.querySelectorAll(selector);
				if (collection.length) {
					tool.each(collection, function() {
						res.push(this);
					});
				}
			});

			return tool(res);
		},

		append: function(thing) {
			return this.each(function() {
				if (typeof thing === 'string') {
					this.insertAdjacentHTML('beforeend', thing);
				}
				else {
					var that = this;
					tool(thing).each(function(name, value) {
						that.insertAdjacentHTML('beforeend', value.outerHTML);
					});
				}
			});
		},

		prepend: function(thing) {
			return this.each(function() {
				if (typeof thing === 'string') {
					this.insertAdjacentHTML('afterbegin', thing);
				}
				else {
					var that = this;
					tool(thing).each(function(name, value) {
						that.insertAdjacentHTML('afterbegin', value.outerHTML);
					});
				}
			});
		}

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

		return tool(obj);
	};

	tool.type = function(obj) {
		var res = Object.prototype.toString.call(obj).match(regXDataType)[1].toLowerCase();
		return res;
	};

}).call(this);
