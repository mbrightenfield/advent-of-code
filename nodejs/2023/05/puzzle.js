const fs = require("fs");
const util = require("util");

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");
let seeds = [];
let seed_regex = new RegExp(/seeds:\s+(?<seeds>((\d+)\s*)+)/ig);
let maps_regex = new RegExp(/(?<source>[a-z]+)\-to\-(?<destination>[a-z]+)\s+map:/ig);
let nums_regex = new RegExp(/^(?<destination>\d+)\s+(?<source>\d*)\s+(?<range>\d+)\s*$/g);
let cur_src = "";
let cur_dst = "";

updateUnmapped = (src, dst) => {
    seeds.forEach(seed =>{
        if(seed[dst] == undefined)
            seed[dst] = seed[src];
    });
} 

rows.map(line => {
    if(!seeds.length && line.match(seed_regex)){
        // Part 1
        seeds = [...line.matchAll(seed_regex)][0].groups.seeds.split(/\s+/).map(x => {return {seed:parseInt(x)}});
    
        // Part 2
        // Brute force solution - super slow/memory intensive on large data sets
        // Need to rethink solution with overlapping ranges
        /*seeds_range = [...line.matchAll(seed_regex)][0].groups.seeds.split(/\s+/).map(x => parseInt(x));
        for(let i = 0; i < seeds_range.length; i += 2){
            for(let j = seeds_range[i]; j < seeds_range[i] + seeds_range[i+1]; j++){
                seeds.push({seed: j});
            }
        }*/
    }
    else if(line.match(maps_regex)){
        let {source, destination} = [...line.matchAll(maps_regex)][0].groups;

        if(cur_src != "" && cur_dst != "" && cur_src != source){
            updateUnmapped(cur_src, cur_dst);
        }

        cur_src = source
        cur_dst = destination;
    }
    else if(line.match(nums_regex)){
        let {source, destination, range} = [...line.matchAll(nums_regex)][0].groups;
        source = parseInt(source);
        destination = parseInt(destination);
        range = parseInt(range);

        seeds.forEach(seed => {
            if(seed[cur_src] >= source && seed[cur_src] <= source + range - 1){
                seed[cur_dst] = parseInt(destination) + (seed[cur_src] - source);
            }
        });
    }
});
updateUnmapped(cur_src, cur_dst);

console.log(`Part 1: ${Math.min(...seeds.map(({location}) => location))}`);