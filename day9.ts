import { AddressMode, Opcode } from "./opcodes";

const { read } = require("./fileReader");

class Amp {
    pc: bigint = 0n;
    baseAddress: bigint = 0n;
    code: Map<bigint, bigint>;
    input: bigint[] = [];
    inputIndex: number = 0;

    constructor(code: bigint[]) {
        this.code = new Map();
        for (let i = 0; i < code.length; i++) {
            this.code.set(BigInt(i), code[i]);
        }
    }

    * run(): Generator<bigint> {
        let code = this.code;
        while (true) {
            const v = this.access(this.pc++);
            const [opcode, mode1, mode2, mode3] = splitOpcode(v);
            switch (opcode) {
                case Opcode.Exit: {
                    return;
                }
                case Opcode.Add: {
                    const xVal = this.getArg(this.pc++, mode1);
                    const yVal = this.getArg(this.pc++, mode2);
                    const dest = this.getPointer(this.pc++, mode3);
                    code.set(dest, xVal + yVal);
                    break;
                }
                case Opcode.Mult: {
                    const xVal = this.getArg(this.pc++, mode1);
                    const yVal = this.getArg(this.pc++, mode2);
                    const dest = this.getPointer(this.pc++, mode3);
                    code.set(dest, xVal * yVal);
                    break;
                }
                case Opcode.Input: {
                    const dest = this.getPointer(this.pc++, mode1);
                    if (this.inputIndex >= this.input.length) throw "Ran out of inputs";
                    const value = this.input[this.inputIndex++]; // fake reading input
                    console.log(`Read input ${value}`);
                    code.set(dest, value);
                    break;
                }
                case Opcode.Output: {
                    const value = this.getArg(this.pc++, mode1);
                    yield value;
                    break;
                }
                case Opcode.BNEZ: {
                    const jump = this.getArg(this.pc++, mode1) !== 0n;
                    const dest = this.getArg(this.pc++, mode2);
                    if (jump) this.pc = dest;
                    break;
                }
                case Opcode.BEQZ: {
                    const jump = this.getArg(this.pc++, mode1) === 0n;
                    const dest = this.getArg(this.pc++, mode2);
                    if (jump) this.pc = dest;
                    break;
                }
                case Opcode.SetLT: {
                    const x = this.getArg(this.pc++, mode1);
                    const y = this.getArg(this.pc++, mode2);
                    const dest = this.getPointer(this.pc++, mode3);
                    code.set(dest, x < y ? 1n : 0n);
                    break;
                }
                case Opcode.SetEQ: {
                    const x = this.getArg(this.pc++, mode1);
                    const y = this.getArg(this.pc++, mode2);
                    const dest = this.getPointer(this.pc++, mode3);
                    code.set(dest, x === y ? 1n : 0n);
                    break;
                }
                case Opcode.AdjustBase: {
                    this.baseAddress += this.getArg(this.pc++, mode1);
                    break;
                }
                default: {
                    throw `Unrecognised opcode ${opcode}`;
                }
            }
        }
    }

    getArg(pc: bigint, mode: AddressMode): bigint {
        if (mode == AddressMode.Immediate) return this.access(pc);
        var ptr = this.access(pc) + (mode == AddressMode.Address ? 0n : this.baseAddress);
        return this.access(ptr);
    }

    getPointer(pc: bigint, mode: AddressMode): bigint {
        var ptr = this.access(pc);
        return (mode == AddressMode.Address) ? ptr : this.baseAddress + ptr;
    }

    access(index: bigint): bigint {
        let val = this.code.get(index);
        if (val === undefined) {
            this.code.set(index, 0n);
            return 0n;
        }
        return val;
    }
}

function splitOpcode(valueBigInt: bigint): [Opcode, AddressMode, AddressMode, AddressMode] {
    if (valueBigInt > 100000n) throw "Number too large to be an operation";
    const value = Number(valueBigInt);
    const opcode = value % 100;
    var mode = value / 100 >> 0;
    const mode1 = mode % 10;
    mode = mode / 10 >> 0;
    const mode2 = mode % 10;
    mode = mode / 10 >> 0;
    const mode3 = mode % 10;
    return [opcode, mode1, mode2, mode3];
}

export function runMachineWithInput(code: bigint[], input: bigint[]) {
    var machine = new Amp(code);
    machine.input = input;
    for (let value of machine.run()) {
        console.log(value);
    }
}

export function runAmps(code: bigint[], amps: bigint[]): bigint {
    var output = 0n;
    var finalOutput = 0n;
    var machines = amps.map(_ => new Amp([...code]));
    var generators: Generator<bigint>[] = [];
    try { // exception thrown when machine halts
        // first pass - include amp settings
        for (var i = 0; i < amps.length; i++) {
            machines[i].input.push(amps[i]);
            generators.push(machines[i].run())
        } 
        while (true) {
            for (var i = 0; i < amps.length; i++) {
                machines[i].input.push(output);
                var value = generators[i].next();
                if (value.done) return finalOutput;
                else output = value.value;
            } 
            finalOutput = output;
        }
    } catch (e) { console.log(e); }
    return finalOutput;
}

export function boostTest() {
    const code = read('./day9input.txt');
    runMachineWithInput(code, [2n]);
}