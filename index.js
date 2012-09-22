var DomHandler = require("domhandler").Handler,
    DomUtils = require("domhandler").Utils,
    CSSselect = require("CSSselect");

function Handler(options){
	if(!(this instanceof Handler)) return new Handler(options);
	var that = this;
	this._handler = DomHandler.call(this, function(dom){
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

	this.on("element", function(elem){
		if(selector(elem)) cb(elem);
	});
};

Handler.prototype.remove = function(selector){
	this.select(selector, DomUtils.removeElement);
};

module.exports = Handler;