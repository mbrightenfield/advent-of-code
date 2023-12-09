const fs = require("fs");
const util = require("util");
const inspect_options = {
    showHidden: false,
    depth: null,
    colors: true,
    compact:true,
    breakLength: 240,
    maxArrayLength: null
};

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");
let sequences = rows.map(row => [row.split(/\s+/).map(x => parseInt(x))]);
const arraySum = arr => arr.reduce((a,b) => a+b, 0);
const arrayIsZero = arr => arr.filter(x => x == 0).length == arr.length;

const findDiffs = sequence => {
    let next = [];
    for(let i = 1; i < sequence.length; i++){
        next.push(sequence[i] - sequence[i-1]);
    }
    return next;
};

const findNextNum = sequence => {
    //let [seq, ...diffs] = sequence;
    //return seq.at(-1) + arraySum(diffs.map(diff => diff.at(-1)));

    sequence.at(-1).push(0);
    for(let i = sequence.length-1; i > 0; i--){
        let cur = sequence[i-1];
        let next = sequence[i];

        cur.push(cur.at(-1) + next.at(-1));
    }
    return sequence[0].at(-1);
};

const findPrevNum = sequence => {
    //let [seq, ...diffs] = sequence;
    //return seq.at(0) - arraySum(diffs.map(diff => diff.at(0)));

    sequence.at(-1).unshift(0);
    for(let i = sequence.length-1; i > 0; i--){
        let cur = sequence[i-1];
        let next = sequence[i];

        cur.unshift(cur.at(0) - next.at(0));
    }
    return sequence[0].at(0);
};

sequences.forEach(sequence => {
    while(!arrayIsZero(sequence.at(-1))){
        sequence.push(findDiffs(sequence.at(-1)));
    }

    findNextNum(sequence);
    findPrevNum(sequence);
});

let p1 = arraySum(sequences.map(sequence => sequence[0].at(-1)));
let p2 = arraySum(sequences.map(sequence => sequence[0].at(0)));

/*
sequences.forEach((sequence, i) => {
    console.log(i);
    console.log(util.inspect(sequence, inspect_options));
})
*/

console.log(`Part 1: ${p1}`); 
console.log(`Part 2: ${p2}`); 