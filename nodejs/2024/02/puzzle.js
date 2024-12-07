const fs = require("fs");

let filename = process.argv[2];

let rows = fs.readFileSync(filename, "utf-8").split("\r\n")
    .map(x => x.split(/\s+/));

const safe = (report) => {
    let test = report.slice(1).map((x,i) => x - report[i]);

    let increasing = test.map(x => x > 0).reduce((a,b) => a && b);
    let decreasing = test.map(x => x < 0).reduce((a,b) => a && b);
    let in_range = test.map(x => Math.abs(x) >= 1 && Math.abs(x) <= 3).reduce((a,b) => a && b);

    return (increasing || decreasing) && in_range;
}

let p1 = rows.map(x => safe(x)).reduce((a,b) => a+b, 0);
let p2 = rows.map(x => x.map((_,i) => x.filter((_,j) => i !== j)).map(y => safe(y)).reduce((a,b) => a || b)).reduce((a,b) => a+b, 0);

console.log(`Part 1: ${p1}`);
console.log(`Part 2: ${p2}`);