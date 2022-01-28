const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getLine = (function () {
    const getLineGen = (async function* () {
        for await (const line of rl) {
            yield line;
        }
    })();
    return async () => ((await getLineGen.next()).value);
})();

// fake input, so no longer async
export function run(code: number[], input: number[]): number {
    let pc = 0;
    let inputIndex = 0;
    while (pc < code.length) {
        const v = code[pc++];
        let modes = v/100 >> 0;
        const [opcode, mode1, mode2, mode3] = splitOpcode(v);
        switch (opcode) {
            case 99: {
                throw "Expected early return on output";
           //     return;
            }
            case 1: {
                const xVal = getArgOrImmediate(pc++, mode1, code);
                const yVal = getArgOrImmediate(pc++, mode2, code);
                const dest = getArg(pc++, code);
                code[dest] = xVal + yVal;
                break;
            }
            case 2: {
                const xVal = getArgOrImmediate(pc++, mode1, code);
                const yVal = getArgOrImmediate(pc++, mode2, code);
                const dest = getArg(pc++, code);
                code[dest] = xVal * yVal;
                break;
            }
            case 3: {
                const dest = getArg(pc++, code);
                if (dest >= code.length) throw "Something went wrong, index out of bounds";
                const value = input[inputIndex++]; // fake reading input
                code[dest] = value;
                break;
            }
            case 4: {
                const value = getArgOrImmediate(pc++, mode1, code);
                return value;// fake output
             //   console.log(value);
             //   break;
            }
            case 5: {
                const jump = getArgOrImmediate(pc++, mode1, code) !== 0;
                const dest = getArgOrImmediate(pc++, mode2, code);
                if (jump) pc = dest;
                break;
            }
            case 6: {
                const jump = getArgOrImmediate(pc++, mode1, code) === 0;
                const dest = getArgOrImmediate(pc++, mode2, code);
                if (jump) pc = dest;
                break;
            }
            case 7: {
                const x = getArgOrImmediate(pc++, mode1, code);
                const y = getArgOrImmediate(pc++, mode2, code);
                const dest = getArg(pc++, code);
                code[dest] = x < y ? 1 : 0;
                break;
            }
            case 8: {
                const x = getArgOrImmediate(pc++, mode1, code);
                const y = getArgOrImmediate(pc++, mode2, code);
                const dest = getArg(pc++, code);
                code[dest] = x === y ? 1 : 0;
                break;
            }
            default: {
                throw `Unrecognised opcode ${opcode}`;
            }
        }
    }
    throw "Something went wrong, ran out of instructions";
}

function splitOpcode(value: number): [number, boolean, boolean, boolean] {
    const opcode = value % 100;
    var mode = value / 100 >> 0;
    const mode1 = mode % 10 === 1;
    mode = mode / 10 >> 0;
    const mode2 = mode % 10 === 1;
    mode = mode / 10 >> 0;
    const mode3 = mode % 10 === 1;
    return [opcode, mode1, mode2, mode3];
}

function getArgOrImmediate(pc: number, mode: boolean, code: number[]): number {
    if (pc >= code.length) {
        throw "Something went wrong, ran out of instructions";
    }
    if (mode) return code[pc];
    var ptr = code[pc];
    if (ptr >= code.length) {
        throw "Something went wrong, ran out of instructions";
    }
    return code[ptr];
}

function getArg(pc: number, code: number[]): number {
    if (pc >= code.length) {
        throw "Something went wrong, ran out of instructions";
    }
    return code[pc];
}

var fs = require("fs");
var text: string = fs.readFileSync("./day7input.txt", 'utf8');
var code = text.split(',').map(x => parseInt(x));

//code[1] = 12;
//code[2] = 2;

export function runAmps(code: number[], amps: number[]) {
    var output = 0;
    for (var i = 0; i < 5; i++) {
        var copy = [...code];
        var output = run(copy, [amps[i], output]);
    }
    return output;
}

var best = 0;
for (var a = 0; a < 5; a++) {
    for (var b = 0; b < 5; b++) {
        for (var c = 0; c < 5; c++) {
            for (var d = 0; d < 5; d++) {
                for (var e = 0; e < 5; e++) {
                    const amps = [a, b, c, d, e];
                    if (amps.includes(0) && amps.includes(1) && amps.includes(2) 
                    && amps.includes(3) && amps.includes(4)) {
                        const result = runAmps(code, amps);
                        if (result > best) {
                            best = result;
                        }
                    }
                }
            }
        }
    }
}
console.log(best);