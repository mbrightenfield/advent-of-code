const fs = require("fs");
const util = require("util");

let filename = process.argv[2];
let [instructions, , ...map_data] = fs.readFileSync(filename, "utf-8").split("\r\n");

convertInstructions = arr => Array.from(arr).map(x => x == "L" ? 0:1);
let instruction_q = convertInstructions(instructions);
let maps = [];

map_data.forEach(map => {
    let {root, left, right} = [...map.matchAll(/(?<root>(.*){3}) = \((?<left>(.*){3}), (?<right>(.*){3})\)/ig)][0].groups;
    maps[root] = [left, right];
});

nextDir = () => {
    let next = instruction_q.shift();
    instruction_q.push(next);
    return next;
};

searchSteps = (root, node) => {
    let steps = 0;
    for(let _root = root; _root != node; _root = maps[_root][nextDir()]){
        steps++;
    }
    return steps;
}

searchSteps2 = () =>{
    let roots = Object.keys(maps).filter(x => x.charAt(2) == "A");
    let steps = 0;
    let next = nextDir();
    for(let _roots = roots; _roots.filter(x => x.charAt(2) == "Z").length != _roots.length; _roots = _roots.map(root => /*root.charAt(2) == "Z" ? root :*/ maps[root][next]), next = nextDir()){
        steps++;
    }

    return steps;
}

console.log(`Part 1: ${searchSteps("AAA", "ZZZ")}`);

instruction_q = convertInstructions(instructions);
console.log(`Part 2: ${searchSteps2()}`);

