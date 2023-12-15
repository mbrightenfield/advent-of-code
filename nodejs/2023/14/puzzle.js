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
let rows = fs.readFileSync(filename, "utf-8").split("\r\n").map(row => Array.from(row));

const shift = arr => {
    while(arr.join("").includes(".O")){
        for(let i = 0; i<arr.length; i++){
            if(arr[i] == "." && arr[i+1] != undefined && arr[i+1] == "O"){
                arr[i] = "O";
                arr[i+1] = ".";
            }
        }
    }
    return arr;
}

const rotate = arr => {
    let rotated_arr = [];
    for(let i = 0; i < arr[0].length; i++){
        let row = [];
        for(let j = arr.length-1; j >= 0; j--){
            row.push(arr[j][i]);
        }
        rotated_arr.push(row);
    }

    return rotated_arr;
};

const rotateCC = arr =>{
    let rotated_arr = [];
    for(let i = arr[0].length; i >= 0; i--){
        let row = [];
        for(let j = 0; j < arr.length; j++){
            row.push(arr[j][i]);
        }
        rotated_arr.push(row);
    }

    return rotated_arr;
}

const display = arr => {
    console.log("========== DISPLAY ==========");
    arr.forEach(row => console.log(row.join("")));
}

const part1 = arr => {
    arr = rotate(rotateCC(arr).map(row => shift(row)));
    return arr.map((row, i) => [...row.join("").matchAll("O")].length * (arr.length - i)).reduce((a,b) => a+b, 0);
}

console.log(`Part 1: ${part1(rows)}`);