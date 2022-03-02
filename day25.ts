import { Machine } from "./day9";
const { read } = require("./fileReader");

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

class TextMachine {
    lastLine = "";
    intMachine: Machine;

    constructor(code: bigint[]) {
        this.getUserInput = this.getUserInput.bind(this);
        this.intMachine = new Machine(code, this.getUserInput);
    }

    async* run(): AsyncGenerator<bigint> {
        yield* this.intMachine.run();
    }
    
    async getUserInput(): Promise<bigint> {
        if (this.lastLine.length === 0) {
            this.lastLine = (await getLine()) + "\n";
        } 
        const result = this.lastLine.charCodeAt(0);
        this.lastLine = this.lastLine.substring(1);
        return BigInt(result);
    }
}

export function run() {
    const code = read('./day25input.txt');
    explore(code);
}

async function explore(code: bigint[]) {
    const machine = new TextMachine(code);
    for await (var charCode of machine.run()) {
        process.stdout.write(String.fromCharCode(Number(charCode)))
    }
}

