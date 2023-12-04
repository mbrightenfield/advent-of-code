const fs = require("fs");
const util = require("util");

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");
let part1_sum = 0;
let part2_sum = 0;

let cards = rows.map(row => {
    let {id, winning_nums, your_nums} = [...row.matchAll(/Card\s+(?<id>\d+):\s+(?<winning_nums>(\d+\s+)+)\|\s+(?<your_nums>(\d+\s*)+)/ig)][0].groups;
    winning_nums = winning_nums.trim().split(/\s+/ig);
    your_nums = your_nums.trim().split(/\s+/ig);

    let matches = winning_nums.filter(x => your_nums.includes(x));
    
    if(matches.length){
        part1_sum += Math.pow(2, matches.length-1);
    }

    return {id:parseInt(id), winning_nums, your_nums, matches:matches.length, copies: 1};
});

recursiveWin = ({id, matches}) => {
    cards.filter(x => x.id > id && x.id <= id + matches).map(card => {
        cards.find(x => x.id == card.id).copies += recursiveWin(card);
    });
    return 1;
};

cards.map(x => recursiveWin(x));
part2_sum = cards.map(x => x.copies).reduce((a,b) => a+b, 0);

//console.log(util.inspect(cards));
//console.log(cards.map(({id, copies}) => copies));

console.log(`Part 1 Sum: ${part1_sum}`);
console.log(`Part 2 Sum: ${part2_sum}`);