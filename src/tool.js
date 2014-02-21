function Tool() {
	this.$$watchers = [];
}

Tool.prototype.$watch = function(watchFn, listenerFn) {
	var watcher = {
		watchFn: watchFn,
		listenerFn: listenerFn,
		lastVal: null
	}

	this.$$watchers.push(watcher);
}

Tool.prototype.$digest = function() {
	var self = this;

	for (var watch in this.$$watchers) {
		var newVal = watch.watchFn(self);
		var oldVal = watch.last;
		if (newVal !== oldVal) {
			watch.listenerFn(newVal, oldVal, self);
			watch.last = newVal;
		}
	}
}

function has (obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}