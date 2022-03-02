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
        machines.push(new Machine([...code], getInput(nat, i, queue)));
    }
    nat.firstQueue = machineQueues[0];

    while (true) {
        if (nat.isIdle()) {
            if (nat.deliveredY.includes(nat.y)) {
                console.log(`First repeat: ${nat.y}`);
                return;
            }
            nat.sendMessage(machineQueues[0]);
        }
        for (let i = 0; i < 50; i++) {
            const value = await threeOrNoOutputs(machines[i]);
            if (value !== undefined) {
                nat.resetCounters();
                const [target, x, y] = value;
                if (target >= 0 && target < 50) {
                    machineQueues[target].push(x);
                    machineQueues[target].push(y);
                } else if (target === 255) {
                    nat.x = x;
                    nat.y = y;
                }
            }
        }
    }
}

const getInput = (nat: NAT, i: number, queue: bigint[]) => () => {
    const value = queue.shift();
    if (value === undefined) {
        nat.idleMachines[i]++;
    } else {
        nat.idleMachines[i] = 0;
    }
    return Promise.resolve(value ?? -1n);
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
    n: number;
    idleMachines: number[] = [];

    x: bigint = 0n;
    y: bigint = 0n;

    firstQueue: bigint[] = [];
    deliveredY: bigint[] = [];

    constructor(n: number) {
        this.n = n;
        this.resetCounters();
    }

    resetCounters() {
        this.idleMachines = new Array(this.n).fill(0);
    }

    sendMessage(queue: bigint[]) {
        queue.push(this.x);
        queue.push(this.y);
        this.deliveredY.push(this.y);
        this.resetCounters();
    }

    isIdle(): boolean {
        return this.idleMachines.every(n => n > 1);
    }
}
