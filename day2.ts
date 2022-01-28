export function run(code: number[]) {
    let pc = 0;
    while (pc < code.length) {
        const opcode = code[pc++];
        switch (opcode) {
            case 99: {
                return;
            }
            case 1: {
                const [x, y, dest] = getArgs(pc, code);
                pc += 3;
                code[dest] = x + y;
                break;
            }
            case 2: {
                const [x, y, dest] = getArgs(pc, code);
                pc += 3;
                code[dest] = x * y;
                break;
            }
            default: {
                throw `Unrecognised opcode ${opcode}`;
            }
        }
    }
    throw "Something went wrong, ran out of instructions";
}

function getArgs(pc: number, code: number[]): [number, number, number] {
    if (pc + 2 >= code.length) {
        throw "Something went wrong, ran out of instructions";
    }
    const xPtr = code[pc++];
    const yPtr = code[pc++];
    const dest = code[pc];
    if (xPtr >= code.length || yPtr >= code.length || dest >= code.length) {
        throw "Something went wrong, index out of bounds";
    }
    return [code[xPtr], code[yPtr], dest];
}

var fs = require("fs");
var text: string = fs.readFileSync("./day2input.txt", 'utf8');
var code = text.split(',').map(x => parseInt(x));

function solve() {
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            const copy = [...code];
            copy[1] = x;
            copy[2] = y;
            var success = true;
            try {
                run(copy);
            } catch {
                success = false;
            }
            if (success && copy[0] === 19690720) {
                console.log(`Answer: x = ${x}, y = ${y}`);
                return;
            }
        }
    }
}

solve();