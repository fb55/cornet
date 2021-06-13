import { Parser, DomUtils, ParserOptions } from "htmlparser2";
import { DomHandler, Element, Document, DomHandlerOptions } from "domhandler";
import { compile } from "css-select";
import { EventEmitter } from "events";

export interface Options extends DomHandlerOptions, ParserOptions {}

export class Cornet extends EventEmitter implements PromiseLike<Document> {
    handler: DomHandler;
    public parser: Parser;

    constructor(options?: Options) {
        super();
        this.handler = new DomHandler(
            (e, dom) => (e ? this.emit("error", e) : this.emit("dom", dom)),
            options,
            (elem) => this.emit("element", elem)
        );
        this.parser = new Parser(this.handler, options);
    }

    select(
        selector: string | ((elem: Element) => boolean),
        cb: (elem: Element) => void
    ) {
        const sel = typeof selector === "string" ? compile(selector) : selector;

        function onElem(elem: Element) {
            if (sel(elem)) cb(elem);
        }

        this.on("element", onElem);
        return () => this.removeListener("element", onElem);
    }

    remove(selector: string | ((elem: Element) => boolean)) {
        return this.select(selector, DomUtils.removeElement);
    }

    then<TRes1 = Document, TRes2 = never>(
        onSuccess: (value: Document) => TRes1 | PromiseLike<TRes1>,
        onFailure: (reason: Error) => TRes2 | PromiseLike<TRes2>
    ) {
        return new Promise<Document>((succ, fail) => {
            this.once("dom", () => succ(this.handler.root));
            this.once("error", fail);
        }).then<TRes1, TRes2>(onSuccess, onFailure);
    }
}
