import { Square, SquareDictionary } from "./squareDictionary";

import { Machine } from "./day9";
const { read } = require("./fileReader");

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


export function run() {
    const code = read('./day21input.txt');
  
  interactive(code);
}

async function interactive(code: bigint[]) {
    const machine = new Machine([...code], getUserInput);
    for await (var value of  machine.run()) {
        const num = Number(value);
        if (num > 255) {
            console.log();
            console.log(num);
        } else {
            process.stdout.write(String.fromCharCode(num));
        }
    }
}

const getLine = (function () {
    const getLineGen = (async function* () {
        for await (const line of rl) {
            yield line;
        }
    })();
    return async () => ((await getLineGen.next()).value);
})();

// Jumps 3 sqaures, so check there is something that needs jumping over, and something on 4th square to land on
const scriptPart1 = `OR A T
AND B T
AND C T
NOT T J
AND D J
WALK
`;

// Additionally, don't jump prematurely when 5th square empty (so would immediately jump again) and 8th also empty (nowhere to land)
// i.e. !(A . B . C) . D . !(!E . !H) 
// = (!A + !B + !C) . ((E + H) . D)
const scriptPart2 = `OR A T
AND B T
AND C T
OR E J
OR H J
AND D J
NOT T T
AND T J
RUN
`;

let isPreSetInput = true;
let lastLine = scriptPart2;
async function getUserInput(): Promise<bigint> {
    if (lastLine.length === 0) {
        isPreSetInput = false;
        lastLine = (await getLine()) + "\n";
    } 
    const result = lastLine.charCodeAt(0);
    if (isPreSetInput) process.stdout.write(lastLine.charAt(0));
    lastLine = lastLine.substring(1);
    return BigInt(result);
}


/*
SpringScript

OR A T
AND B T
AND C T
NOT T J
AND D J

*/