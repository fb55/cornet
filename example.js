var Parser = require("htmlparser2").WritableStream,
    Cornet = require("./"),
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

