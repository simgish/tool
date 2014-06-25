;(function (window, document, undefined) {

	var root = this;

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	// Constructor
	var Tool = function Tool(els) {
		// console.log(els)

		for (var i = 0; i < els.length; i++) {
			this[i] = els[i];
		}

		this.length = els.length;
	};

	Tool.prototype.has = function(obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	Tool.prototype.map = function(callback) {
		var res = [];

		for (var i = 0; i < this.length; i++) {
			results.push(callback.call(this, this[i], i));
		}

		return res;
	};

	Tool.prototype.forEach = function(callback) {
		this.map(callback);

		return this;
	};

	Tool.prototype.ready = function(func) {
		document.addEventListener('DOMContentLoaded', func);
	};

	Tool.prototype.log = function(m) {
		console.log(m);
	};

	Tool.prototype.id = function(id) {
		return document.getElementById(id);
	};

	Tool.prototype.tag = function(tag) {
		return document.getElementsByTagName(tag);
	};

	var tool = {
		get: function(sel) {
			var els;

			if (typeof sel === 'string') {
				els = document.querySelectorAll(sel);
			}
			else if (sel.length) {
				els = sel;
			}
			else {
				els = [sel];
			}

			return new Tool(els);
		},

		create: function(tag, attrs) {
			var el = new Tool([document.createElement(tag)]);

			if (attrs) {
				for (var key in attrs) {
					if (this.has(attrs, key)) {
						el.attr(key, attrs[key]);
					}
				}
			}

			return el;
		}

	};

	window.Tool = tool;

})(this, document);
