const fs = require("fs");
const util = require("util");

let filename = process.argv[2];
let rows = fs.readFileSync(filename, "utf-8").split("\r\n");

const deck = {cards: "23456789TJQKA", wild: ""};
const HandType = {
    FiveKind: 7,
    FourKind: 6,
    FullHouse: 5,
    ThreeKind: 4,
    TwoPair: 3,
    OnePair: 2,
    HighCard: 1
};

getSum = arr => arr.map(({bid}, rank) => bid * (rank+1)).reduce((a,b) => a+b, 0);
count = hand => Array.from(hand).reduce((a,b) => {return a[b] ? ++a[b] : a[b]=1, a}, {});
getHandValueHex = (deck, hand) => Array.from(hand).map(val => deck.cards.match(val).index.toString(16)).join("");

getHandType = (deck,hand) => {
    let card_value_count = count(hand);
    let card_count = Object.values(card_value_count);

    let ruleset = {
        [HandType.FiveKind]:    () => card_count.filter(v => v == 5).length == 1,
        [HandType.FourKind]:    () => card_count.filter(v => v == 4).length == 1,
        [HandType.FullHouse]:   () => card_count.filter(v => v == 3).length == 1 && card_count.filter(v => v == 2).length == 1,
        [HandType.ThreeKind]:   () => card_count.filter(v => v == 3).length == 1 && card_count.filter(v => v != 3).length == 2,
        [HandType.TwoPair]:     () => card_count.filter(v => v == 2).length == 2,
        [HandType.OnePair]:     () => card_count.filter(v => v == 2).length == 1
    };

    for(let test = Math.max(...Object.keys(ruleset)); test >= Math.min(...Object.keys(ruleset)); test--){
        if(ruleset[test]()){
            return test;
        }
    }
    return HandType.HighCard;
};

getHandWilds = (deck, hand) => {
    let alternates = [hand];
    if(deck.wild != "" && hand.match(deck.wild)){
        (new Set(Array.from(hand.replaceAll(deck.wild, "")))).forEach(val => {
            alternates.push(hand.replaceAll(deck.wild, val));
        })
    }
    return alternates;
};

rank = (deck, rows) => {
    let hands = [];
    rows.forEach(row =>{
        let [hand, bid] = row.split(" ");
        let hand_alternates = getHandWilds(deck, hand);
        let hand_type = hand_alternates.map(hand => getHandType(deck, hand)).sort().reverse()[0];
        let hand_value = getHandValueHex(deck, hand);

        let data = {
            hand: hand,
            bid: bid,
            type: hand_type,
            value: hand_value,
            sort: parseInt(hand_type + hand_value, 16)
        }
        hands.push(data);
    })

    return hands.sort((a,b) => a.sort - b.sort);
};

let p1 = rank(deck, rows);
console.log(`Part 1: ${getSum(p1)}`);

deck.cards = "J23456789TQKA";
deck.wild = "J";
let p2 = rank(deck, rows);
console.log(`Part 2: ${getSum(p2)}`);
