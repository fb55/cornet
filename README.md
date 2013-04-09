##About

> The __cornet__ is a brass instrument very similar to the trumpet, distinguished by its conical bore, compact shape, and mellower tone quality. - [Wikipedia](http://en.wikipedia.org/wiki/Cornet)

This project is demonstrating how to use a couple of my libraries to replace [`substack/node-trumpet`](https://github.com/substack/node-trumpet) in just a couple of LOC.

Even better, there are some advantages over `trumpet`:

* The ammount of usable CSS selectors is increased dramatically thanks to [`fb55/CSSselect`](https://github.com/fb55/CSSselect).
* `cornet` works as a handler for [`fb55/htmlparser2`](https://github.com/fb55/htmlparser2), the probably fastest HTML parser currently available for node. And it's much less strict than the `sax` module used by `trumpet`.
* By using the great [`MatthewMueller/cheerio`](https://github.com/MatthewMueller/cheerio) module, you can do everything with your document that would be possible with jQuery.

_Please note that callbacks are fired as soon as an element was retrieved. That means that no content past the element will be available, so cheerio won't find anything, and, as the element is at this time the last child of it's parent, selectors like `:nth-last-child` won't work as expected._

##Install

	npm install cornet

##Example

```js
var Parser = require("htmlparser2").WritableStream,
    Cornet = require("cornet"),
    minreq = require("minreq"),
    $ = require("cheerio");

var cornet = new Cornet();

minreq.get("http://github.com/fb55").pipe(new Parser(cornet));

cornet.remove("script"); //remove all scripts

//show all repos
cornet.select(".repo_list", function(elem){
	$(elem).find("h3").each(function(i){
		console.log("repo %d: %s", i + 1, $(this).text().trim());
	});
});

//does the same
var i = 0;
cornet.select(".repo_list h3", function(elem){
	console.log("repo %d: %s", ++i, $(elem).text().trim());
});

//sometimes, you only want to get a single element
var onTitle = cornet.select("title", function(title){
	console.log("Page title:", $(title).text().trim());
	cornet.removeLister("element", onTitle);
});
```

##API

####`cornet(options)`
The constructor. `options` are the same you can pass to [`fb55/DomHandler`](https://github.com/fb55/DomHandler).

It's an `EventEmitter` that emits two events:

* `element` is emitted whenever an element was added to the DOM.
* `dom` is emitted when the DOM is complete.

####`cornet#select(selector | fn, cb)`
Calls the callback when the selector is matched or a passed function returns `true` (or any value that evaluates to true).

Internally, listenes for any `element` event and checks then if the selector is matched.

Returns the listening function, so you can remove it afterwards (as shown in the example above).

####`cornet#remove(selector | fn)`
Removes all elements that match the selector. Also returns the listener.
