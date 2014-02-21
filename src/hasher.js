function Hasher() {
	this._data = {};
	this.clear();
}

Hasher.prototype = {
	constructor: Hasher,

	get: function(key) {
		var data = this._data[this.hash(key)];
		return data && data[1];
	},

	set: function(key, value) {
		this._data[this.hash(key)] = [key, value];
	},

	has: function(key) {
		return this.hash(key) in this._data;
	},

	remove: function(key) {
		delete this._data[this.hash(key)];
	},

	getKeys: function() {
		return Object.keys(this._data);
	},

	clear: function() {
		this._data = {};
	},

	type:function(key) {
		var str = Object.prototype.toString.call(key);
		var type = str.slice(8, -1).toLowerCase();
		return type;
	},

	hash: function(key) {
		switch (this.type(key)) {
			case 'string':
			return CryptoJS.SHA1(JSON.stringify(key));

			case 'array':
				var hashes = [];
				for (var i = 0; i < key.length; i++) {
					hashes[i] = this.hash(key[i]);
				}
				return CryptoJS.SHA1(key.toString());

			case 'object':
				return CryptoJS.SHA1(JSON.stringify(key));
		}
	},

	forEach: function(func) {
		for (var key in this._data) {
			var data = this._data[key];
			func(data[1], data[0]);
		}
	}
}