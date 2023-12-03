const fs = require("fs");

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");
let part1_sum = 0;
let part2_sum = 0;

for(let i = 0; i < rows.length; i++){
    
    // Part 1: Sum of the Part Numbers
    [...rows[i].matchAll(/\d+/g)].map( ({0:number, index}) => {
        
        // Check for symbols form the the left through the right for the the position of the current number on rows above, current, below.
        for(let row_num = (i > 0) ? i-1 : i; row_num <= Math.min(i+1, rows.length - 1); row_num++){
            if(rows[row_num].substring(index - 1, index + number.length + 1).match(/[^.|\d]/) != null){
                part1_sum += parseInt(number);
                return;
            }
        }
    });

    // Part 2: Sum of the Gear Ratios
    let potential_parts = [];
    for(let row_num = (i > 0) ? i-1 : i; row_num <= Math.min(i+1, rows.length - 1); row_num++){
        [...rows[row_num].matchAll(/\d+/g)].map( ({0:part_no, index}) => {
            potential_parts.push({part_no, part_idx:index});
        });
    }

    [...rows[i].matchAll(/[*]/g)].map( ({0:gear, index:gear_idx}) => {
        let adjacent_parts = [];
        
        for(let {part_no, part_idx} of potential_parts){
            if(part_idx <= gear_idx + 1 && part_idx + part_no.length - 1 >= gear_idx - 1){
                adjacent_parts.push(part_no);
            }
        }
        
        if(adjacent_parts.length == 2){
            part2_sum += adjacent_parts.reduce((a,b) => a * b, 1);
        }
    });
}

console.log(`Part 1 Sum: ${part1_sum}`);
console.log(`Part 2 Sum: ${part2_sum}`);