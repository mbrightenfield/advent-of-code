const fs = require("fs");
let filename = process.argv[2];

let memory = fs.readFileSync(filename, "utf-8").replaceAll("\r\n", "");
let instructions = new RegExp(/(?<op>mul)\((?<x>[\d]{1,3}),(?<y>[\d]{1,3})\)/g);
let instructions_dont = new RegExp(/don't\(\)((?:(?!do\(\)).)*)do\(\)/g);
let proc = arr => arr.map(({groups}) => groups.x * groups.y).reduce((a,b) => a+b, 0);

let p1 = proc([...memory.matchAll(instructions)]);
let p2 = proc([...memory.replaceAll(instructions_dont, "").matchAll(instructions)]);

console.log(`Part 1: ${p1}`);
console.log(`Part 2: ${p2}`);