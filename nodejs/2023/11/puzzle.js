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

let SPACE_CHAR = ".";
let GALAXY_CHAR = "#";

const display = () =>{
    rows.forEach((row, i) => console.log(i + "\t" + row));
}

const expandCols = data => {
    let cols = [];
    for(let y = 0; y < data[0].length; y++){
        let empty = true;
        for(let x = 0; x < data.length; x++){
            if(data[x][y] != SPACE_CHAR){
                empty = false;
                break;
            }
        }
        if(empty){
            cols.push(y);
        }
    }

    cols.reverse().forEach(y => {
        for(let x = 0; x < data.length; x++){
            data[x] = data[x].slice(0, y) + SPACE_CHAR + data[x].slice(y);
        }
    });

    return data;
}

const expandRows = data => {
    let rows = [];
    for(let x = 0; x < data.length; x++){
        let empty = true;
        for(let y = 0; y < data[0].length; y++){
            if(data[x][y] != SPACE_CHAR){
                empty = false;
                break;
            }
        }
        if(empty){
            rows.push(x);
        }
    }

    rows.reverse().forEach(row => {
        data.splice(row, 0, SPACE_CHAR.repeat(data[0].length));
    });

    return data;
}

const findGalaxies = data => {
    let galaxies = [];
    for(let x = 0; x < data.length; x++){
        for(let y = 0; y < data[0].length; y++){
            if(data[x][y] == GALAXY_CHAR){
                galaxies.push({x,y});
            }
        }
    }

    return galaxies
}

const generatePairs = data => {
    let pairs = [];
    for(let x = 0; x < data.length; x++){
        for(let y = x+1; y < data.length; y++){
            data[x].id = x+1;
            data[y].id = y+1;
            pairs.push([data[x], data[y]]);
        }
    }
    return pairs;
}

const shortestPath = (coord1, coord2) => {
    let {x:x1, y:y1} = coord1;
    let {x:x2, y:y2} = coord2;

    let distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    return distance;
}

const generatePaths = pairs => {
    let paths = [];
    pairs.forEach(pair =>{
        paths.push({pair: pair, path: shortestPath(...pair)});
    })

    return paths;
}


expandCols(rows);
expandRows(rows);
let galaxies = findGalaxies(rows);
let pairs = generatePairs(galaxies);
let paths = generatePaths(pairs);
display();

//console.log(util.inspect(galaxies, inspect_options));
//console.log(util.inspect(pairs, inspect_options));
//console.log(pairs.length);
//console.log(util.inspect(paths, inspect_options));

let p1 = paths.map(({path}) => path).reduce((a,b) => a+b, 0);

console.log(`Part 1: ${p1}`);