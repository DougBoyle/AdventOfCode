const { read } = require("./fileReader");

class Amp {
    pc: number;
    code: number[];

    constructor(code: number[]) {
        this.pc = 0;
        this.code = code;
    }

    run(input: number[]): number {
        let inputIndex = 0;
        let code = this.code;
        while (this.pc < code.length) {
            const v = code[this.pc++];
            const [opcode, mode1, mode2, mode3] = splitOpcode(v);
            switch (opcode) {
                case 99: {
                    throw "Expected early return on output"; // TODO: Indicate a halt
               //     return;
                }
                case 1: {
                    const xVal = getArgOrImmediate(this.pc++, mode1, code);
                    const yVal = getArgOrImmediate(this.pc++, mode2, code);
                    const dest = getArg(this.pc++, code);
                    code[dest] = xVal + yVal;
                    break;
                }
                case 2: {
                    const xVal = getArgOrImmediate(this.pc++, mode1, code);
                    const yVal = getArgOrImmediate(this.pc++, mode2, code);
                    const dest = getArg(this.pc++, code);
                    code[dest] = xVal * yVal;
                    break;
                }
                case 3: {
                    const dest = getArg(this.pc++, code);
                    if (dest >= code.length) throw "Something went wrong, index out of bounds";
                    const value = input[inputIndex++]; // fake reading input
                //    console.log(`Read input value ${value}`);
                    code[dest] = value;
                    break;
                }
                case 4: {
                    const value = getArgOrImmediate(this.pc++, mode1, code);
                    return value;// fake output
                 //   console.log(value);
                 //   break;
                }
                case 5: {
                    const jump = getArgOrImmediate(this.pc++, mode1, code) !== 0;
                    const dest = getArgOrImmediate(this.pc++, mode2, code);
                    if (jump) this.pc = dest;
                    break;
                }
                case 6: {
                    const jump = getArgOrImmediate(this.pc++, mode1, code) === 0;
                    const dest = getArgOrImmediate(this.pc++, mode2, code);
                    if (jump) this.pc = dest;
                    break;
                }
                case 7: {
                    const x = getArgOrImmediate(this.pc++, mode1, code);
                    const y = getArgOrImmediate(this.pc++, mode2, code);
                    const dest = getArg(this.pc++, code);
                    code[dest] = x < y ? 1 : 0;
                    break;
                }
                case 8: {
                    const x = getArgOrImmediate(this.pc++, mode1, code);
                    const y = getArgOrImmediate(this.pc++, mode2, code);
                    const dest = getArg(this.pc++, code);
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

export function runAmps(code: number[], amps: number[]): number {
    var output = 0;
    var finalOutput = 0;
    var machines = amps.map(_ => new Amp([...code]));
    try { // exception thrown when machine halts
        // first pass - include amp settings
        for (var i = 0; i < amps.length; i++) {
            output = machines[i].run([amps[i], output]);
        } 
        finalOutput = output;
        while (true) {
            for (var i = 0; i < amps.length; i++) {
                output = machines[i].run([output]);
            } 
            finalOutput = output;
        }
    } catch {}
    return finalOutput;
}

const ampSettings = [5, 6, 7, 8, 9];

function* permutations(inputArr: number[]): Generator<number[]> {
    function* permute(remaining: number[], used: number[]): Generator<number[]> {
      if (remaining.length === 0) {
          yield used;
      } else {
        for (let i = 0; i < remaining.length; i++) {
          let curr = remaining.slice();
          let next = curr.splice(i, 1);
          yield* permute(curr.slice(), used.concat(next))
       }
     }
   }
  
   yield* permute(inputArr, [])
}


export function findBest() {
    const code = read('./day7input.txt');
    var best = 0;
    for (let amps of permutations(ampSettings)) {
        const result = runAmps(code, amps);
        if (result > best) {
            best = result;
        }
    }

    console.log(best);
}
