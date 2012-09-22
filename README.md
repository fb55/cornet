##About

> The __cornet__ is a brass instrument very similar to the trumpet, distinguished by its conical bore, compact shape, and mellower tone quality. - [Wikipedia](http://en.wikipedia.org/wiki/Cornet)

This project is demonstrating how to use a couple of my libraries to replace [`substack/node-trumpet`](https://github.com/substack/node-trumpet) in just a couple of LOC.

Even better, there are some advantages over `trumpet`:

* The ammount of usable CSS selectors is increased dramatically thanks to [`fb55/CSSselect`](https://github.com/fb55/CSSselect).
* `cornet` uses [`fb55/htmlparser2`](https://github.com/fb55/CSSselect), which is probably the fastest HTML parser currently available for node. And it's much less strict than the `sax` module used by `trumpet`.
* By using the great [`MatthewMueller/cheerio`](https://github.com/MatthewMueller/cheerio) module, you can do everything with your document that would be possible with jQuery.

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
		console.log("repo %d: %s", i, $(this).text());
	});
});
```