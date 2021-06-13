import { Cornet } from "./";
import $ from "cheerio";
import https from "https";

const cornet = new Cornet();

https.get("http://github.com/fb55").pipe(cornet.parser);

cornet.remove("script"); // Remove all scripts

// Show all repos
let i = 0;
cornet.select(".repo_list h3", (elem) => {
    console.log("repo %d: %s", ++i, $(elem).text().trim());
});

// Show all repos using Cheerio
cornet.select(".repo_list", (elem) => {
    $(elem)
        .find("h3")
        .each((i, el) =>
            console.log("repo %d: %s", i + 1, $(el).text().trim())
        );
});

// Sometimes, you only want to get a single element
const finishTitle = cornet.select("title", (title) => {
    console.log("Page title:", $(title).text().trim());
    finishTitle();
});
