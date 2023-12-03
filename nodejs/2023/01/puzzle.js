const fs = require('fs');

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");
let digits = ["one","two","three","four","five","six","seven","eight","nine"];

findDigitString = (digit) => {
    return (!isNaN(parseInt(digit)) ? digit : digits.indexOf(digit) + 1).toString();
}

findDigitSum = (rows, search_pattern) => {
    let sum = 0;
    let regex = new RegExp(search_pattern, "ig");

    for(let row of rows){
        let matches = Array.from(row.matchAll(regex), match => match[1]); 

        let first_digit = findDigitString(matches[0]);
        let last_digit = findDigitString(matches[matches.length - 1]);

        let value = first_digit + last_digit;
        sum += parseInt(value);
    }

    return sum;
}

console.log("Part 1 Sum:", findDigitSum(rows, "(?=([0-9]))"));
console.log("Part 2 Sum:", findDigitSum(rows, "(?=([0-9]|" + digits.join("|") + "))")); // need to use lookahead assertion in order to match overlapping. ex. "oneight" = 18