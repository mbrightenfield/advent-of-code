const fs = require("fs");

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");

let [times, distances] = rows.map(x => x.split(/:\s+/)[1].split(/\s+/).map(y => parseInt(y)));

calculate = (times, distances) => {
    return times.map((time, i) =>{
        let distance = distances[i];
        var discriminant = Math.sqrt(Math.pow(time,2) - 4 * distance);
        var max = Math.ceil((discriminant + time) / 2) - 1;
        var min = (time - discriminant) / 2 + 1;
        return Math.ceil(max-min) + 1;
    }).reduce((a,b) => a * b, 1);
}

console.log(`Part 1: ${calculate(times, distances)}`);

times = [parseInt(times.join(""))];
distances = [parseInt(distances.join(""))];

console.log(`Part 2: ${calculate(times, distances)}`);