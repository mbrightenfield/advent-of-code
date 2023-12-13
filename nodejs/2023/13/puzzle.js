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
let rows = fs.readFileSync(filename, "utf-8").split("\r\n\r\n").map(rows => rows.split("\r\n"));

const horizontal = pattern => {
    //console.log("==========HORIZONTAL==========");
    //console.log(util.inspect(pattern));
    for(let i = 0; i < pattern.length - 1; i++){
        if(pattern[i] == pattern[i+1]){
            //console.log("possible mirror: ", i, i+1);
            let checked_lines = 0;
            let mirror_lines = 0;
            for(let a = i-1, b = i+2; a >= 0 && b < pattern.length; a--, b++){
                checked_lines++;
                if(pattern[a] == pattern[b]){
                    mirror_lines++;
                }
            }
            if(checked_lines == mirror_lines || i == 0){
                return i+1;
            }
        }
    }
    return 0;
}

const horizontalSmudge = pattern => {
    for(let i = 0; i < pattern.length; i++){
        let smudge_patterns = smudgePatterns(pattern[i]);
        for(j = 0; j < smudge_patterns.length; j++){
            let new_pattern = JSON.parse(JSON.stringify(pattern));
            new_pattern[i] = smudge_patterns[j];
            let lines = horizontal(new_pattern);
            if(lines > 0){
                return lines;
            }
        }
    }
    return 0;
}

const horizontalSmudge2 = pattern => {
    retVal = 0;
    for(let i = 0; i < pattern.length; i++){
        let smudge_patterns = smudgePatterns(pattern[i]);
        for(j = 0; j < smudge_patterns.length; j++){
            let new_pattern = JSON.parse(JSON.stringify(pattern));
            new_pattern[i] = smudge_patterns[j];
            let lines = horizontal(new_pattern);
            if(lines > 0){
                retVal = retVal == 0 ? lines : Math.min(retVal, lines);
            }
        }
    }
    return retVal;
}

const vertical = pattern => {
    return horizontal(rotate(pattern));
}

const verticalSmudge = pattern => {
    return horizontalSmudge(rotate(pattern));
}

const rotate = pattern => {
    let rotated_pattern = [];
    for(let i = 0; i < pattern[0].length; i++){
        let row = "";
        for(let j = pattern.length-1; j >= 0; j--){
            row += pattern[j][i];
        }
        rotated_pattern.push(row);
    }

    return rotated_pattern;
};

const smudgePatterns = pattern => {
    let smudge_patterns = [];
    for(let x = 0; x < pattern.length; x++){
        let smudge_pattern = Array.from(pattern);
        smudge_pattern[x] = smudge_pattern[x] == "#" ? "." : "#";
        smudge_patterns.push(smudge_pattern.join(""));
    }

    return smudge_patterns;
}

const part1 = () => {
    return rows.map(pattern => 100 * horizontal(pattern) + vertical(pattern)).reduce((a,b) => a+b, 0);
}

const part2 = () => {
    return rows.map(pattern => {
        let horizontal = 100 * horizontalSmudge2(pattern);
        let vertical = 0;
        if(horizontal == 0){
            vertical = verticalSmudge(pattern);
        }
        return horizontal + vertical;
    }).reduce((a,b) => a+b, 0);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

/*rows.forEach(pattern => {
    console.log(horizontalSmudge(pattern), verticalSmudge(pattern));
});*/

//console.log(horizontalSmudge2(rows[0]));
