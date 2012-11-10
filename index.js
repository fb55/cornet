var DomHandler = require("domhandler"),
    DomUtils = require("domutils"),
    CSSselect = require("CSSselect");

function Handler(options){
	if(!(this instanceof Handler)) return new Handler(options);
	var that = this;
	DomHandler.call(this, function(e, dom){
		that.emit("dom", dom);
	}, options, function(elem){
		that.emit("element", elem);
	});
}

require("util").inherits(Handler, require("events").EventEmitter);
Object.getOwnPropertyNames(DomHandler.prototype).forEach(function(name){
	Handler.prototype[name] = DomHandler.prototype[name];
});

Handler.prototype.select = function(selector, cb){
	if(typeof selector === "string"){
		selector = CSSselect.parse(selector);
	}
	function onElem(elem){
		if(selector(elem)) cb(elem);
	}
	this.on("element", onElem);
	return onElem;
};

Handler.prototype.remove = function(selector){
	return this.select(selector, DomUtils.removeElement);
};

module.exports = Handler;