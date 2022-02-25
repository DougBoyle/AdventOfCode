import { Square, SquareDictionary } from "./squareDictionary";

import { Machine } from "./day9";
const { read } = require("./fileReader");

export function scanGrid(code: bigint[]) {
    var total = 0;

    let x = 0;
    let y = 0;

    while (true) {
        // check for start of beam
        if (!getValue(code, x, y)) {
            const newStart = findStart(code, x, y);
            x = newStart[0];
            y = newStart[1];
            continue;
        }

        for (let i = 0; i < 100; i++) {
            // check wide enough
            if (!isOccupied(code, x + i, y)) {
                if (i === 0) {
                    x += 1;
                } else {
                    y += 1;
                } 
                break;
            }

            // check tall enough
            if (!isOccupied(code, x, y + i)) {
                if (i === 0) {
                    y += 1;
                } else {
                    x += 1;
                } 
                break;
            }

            if (i === 99) {
                console.log(`Square found at ${x}, ${y}`);
                return;
            }
        }
    }
}

function findStart(code: bigint[], x: number, y: number): Square {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (getValue(code, x+i, y+j)) {
                return [x+i, y+j];
            }
        }
    }
    throw "No start square found in range 10";
}

function drawField(code: bigint[], x: number, y: number, range: number) {
    for (var a = 0; a < range; a++) {
        let s = "";
        for (var b = 0; b < range; b++) {
            s += getValue(code, x + b, y + a) ? "#" : ".";
        }
        console.log(s);
    }
}

function isOccupied(code: bigint[], x: number, y: number): boolean {
    const machine = new Machine([...code], squareInput(x, y))
    return Number(machine.run().next().value) === 1;
}

function getValue(code: bigint[], x: number, y: number): number {
    const machine = new Machine([...code], squareInput(x, y))
    return Number(machine.run().next().value);
}

const squareInput = (x: number, y: number) => {
    let n = 0;
    return () => BigInt(n++ == 0 ? x : y)
}

export function run() {
    const code = read('./day19input.txt');
  
    scanGrid(code);
}