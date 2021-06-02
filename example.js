const { WritableStream: Parser } = require("htmlparser2");
const Cornet = require("./");
const minreq = require("minreq");
const $ = require("cheerio");

const cornet = new Cornet();

minreq.get("http://github.com/fb55").pipe(new Parser(cornet));

cornet.remove("script"); // Remove all scripts

// Show all repos
cornet.select(".repo_list", (elem) => {
    $(elem)
        .find("h3")
        .each((i, el) =>
            console.log("repo %d: %s", i + 1, $(el).text().trim())
        );
});

// Does the same
let i = 0;
cornet.select(".repo_list h3", (elem) => {
    console.log("repo %d: %s", ++i, $(elem).text().trim());
});

// Sometimes, you only want to get a single element
const onTitle = cornet.select("title", (title) => {
    console.log("Page title:", $(title).text().trim());
    cornet.removeLister("element", onTitle);
});
