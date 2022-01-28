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

export async function run(code: number[]) {
    let pc = 0;
    while (pc < code.length) {
        const v = code[pc++];
        let modes = v/100 >> 0;
        const [opcode, mode1, mode2, mode3] = splitOpcode(v);
        switch (opcode) {
            case 99: {
                return;
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
                const value = Number(await getLine());
                code[dest] = value;
                break;
            }
            case 4: {
                const value = getArgOrImmediate(pc++, mode1, code);
                console.log(value);
                break;
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
var text: string = fs.readFileSync("./day5input.txt", 'utf8');
var code = text.split(',').map(x => parseInt(x));

//code[1] = 12;
//code[2] = 2;
run(code);