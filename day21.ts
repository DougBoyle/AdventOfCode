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
  
  //  scanGrid(code);
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

let lastLine = "";
async function getUserInput(): Promise<bigint> {
    if (lastLine.length === 0) {
        lastLine = (await getLine()) + "\n";
    } 
    const result = lastLine.charCodeAt(0);
    lastLine = lastLine.substring(1);
    return BigInt(result);
}

const script = `OR A T
AND B T
AND C T
NOT T J
AND D J
`;

/*
SpringScript

OR A T
AND B T
AND C T
NOT T J
AND D J

*/