const DomHandler = require("domhandler");
const DomUtils = require("domutils");
const { compile } = require("css-select");
const { EventEmitter } = require("events");

class Handler extends EventEmitter {
    constructor(options) {
        super();
        DomHandler.call(
            this,
            (e, dom) => this.emit("dom", dom),
            options,
            (elem) => this.emit("element", elem)
        );
    }
    select(selector, cb) {
        if (typeof selector === "string") {
            selector = compile(selector);
        }
        function onElem(elem) {
            if (selector(elem)) cb(elem);
        }
        this.on("element", onElem);
        return onElem;
    }
    remove(selector) {
        return this.select(selector, DomUtils.removeElement);
    }
}

Object.getOwnPropertyNames(DomHandler.prototype).forEach((name) => {
    Handler.prototype[name] = DomHandler.prototype[name];
});

module.exports = Handler;
