const fs = require("fs");
const util = require('util');

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");

makeCounter = (r,g,b) => { return {"red": r, "green": g, "blue": b} };
const bag = makeCounter(12, 13, 14);

let games = rows.map(row =>{
    let {game_id, colors} = [...row.matchAll(/Game (?<game_id>\d+)\: (?<colors>.*)/ig)][0].groups;
    let max = makeCounter(0,0,0);
    let hands = colors.split("; ").map(subset => {
        let hand = makeCounter(0,0,0);
        hand.possible = true;

        subset.split(", ").map(colors => {
            let color_data = colors.split(" ");
            let count = parseInt(color_data[0]);
            let color = color_data[1];
            hand[color] = count;

            if(max[color] < count){
                max[color] = count;
            }
        });

        for(let color in hand){
            if(hand[color] > bag[color]){
                hand.possible = false;
            }
        }

        return hand;
    });

    return{
        id: parseInt(game_id),
        hands: hands,
        max: max
    };
});

// Part 1
let possible_games = games.filter(game => game.hands.filter(hand => !hand.possible).length == 0);
let possible_games_sum = possible_games.reduce((a,b) => a + b.id, 0);

// Part 2
let power_games_sum = games.map(game => Object.values(game.max).reduce((a, b) => a * b, 1)).reduce((a, b) => a+b, 0);

//console.log(util.inspect(games, false, null, true));
//console.log(util.inspect(possible_games, false, null, true));

console.log(`Part 1 Sum: ${possible_games_sum}`);
console.log(`Part 2 Sum: ${power_games_sum}`);