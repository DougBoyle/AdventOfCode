import { Machine } from "./day9";
const { read } = require("./fileReader");

export function run() {
    const code = read('./day23input.txt');
    runNetwork(code);
}

async function runNetwork(code: bigint[]) {
    const nat = new NAT(50);

    const machines =  [];
    const machineQueues: bigint[][] = [];
    for (let i = 0; i < 50; i++) {
        const queue: bigint[] = [BigInt(i)];
        machineQueues.push(queue);
        machines.push(new Machine([...code], getInput(queue)));
    }

    while (true) {
        for (let i = 0; i < 50; i++) {
            const value = await threeOrNoOutputs(machines[i]);
            if (value !== undefined) {
                const [target, x, y] = value;
                if (target >= 0 && target < 50) {
                    machineQueues[target].push(x);
                    machineQueues[target].push(y);
                } else if (target === 255) {
                    console.log(y);
                    return;
                }
            }
        }
    }
}

const getInput = (nat: NAT, queue: bigint[]) => () => {
    Promise.resolve(queue.shift() ?? -1n);
}

async function threeOrNoOutputs(machine: Machine): Promise<[number, bigint, bigint] | undefined> {
    const v1 = await machine.step();
    if (v1 !== undefined) {
        const v2 = await runUntilOutput(machine);
        const v3 = await runUntilOutput(machine);
        return [Number(v1), v2, v3];
    }
}

async function runUntilOutput(machine: Machine): Promise<bigint> {
    while (true) {
        const value = await machine.step();
        if (value !== undefined) return value;
    }
}

class NAT {
    idleMachines: number[]

    constructor(n: number) {
        this.idleMachines = new Array(n).fill(0);
    }

    isIdle(): boolean {
        return this.idleMachines.every(n => n > 1);
    }
}
