const fs = require("fs");

let filename = process.argv[2];
let left = [];
let right = [];

fs.readFileSync(filename, "utf-8").split("\r\n")
    .map(x => x.split(/\s+/))
    .map(row => {
        left.push(row[0]);
        right.push(row[1]);
    });

left.sort();
right.sort();

let p1 = left.map((x, i) => Math.abs(x - right[i])).reduce((a,b) => a+b, 0);
let p2 = left.map(x => x * right.filter(y => y === x ).length).reduce((a,b) => a+b, 0);

console.log(`Part 1: ${p1}`);
console.log(`Part 2: ${p2}`);