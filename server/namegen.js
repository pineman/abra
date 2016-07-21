const fs = require("fs");
const words = fs.readFileSync("wordsEn.txt", "ascii").split("\n");
const REASONABLY_SIZED_PRIME_NUMBER = 31;

function stringHash(string) {
    let hash = 0;
    for (var i = 0; i < string.length; i++) {
       hash = hash * REASONABLY_SIZED_PRIME_NUMBER + string.charCodeAt(i);
    }
    return hash;
}

function wordFor(idStr) {
    return words[stringHash(idStr) % words.length];
}

module.exports = {stringHash, wordFor};