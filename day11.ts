const { Machine } = require("./day9");
const { read } = require("./fileReader");

 const row = 0;
 const col = 1;
 const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function readColourAndDirection(machineOutput: Generator<bigint>): [number, number] | undefined {
    var firstValue = machineOutput.next();
    if (firstValue.done) return undefined
    var secondValue = machineOutput.next();
    if (secondValue.done) return undefined;
    return [Number(firstValue.value), 2 * Number(secondValue.value) - 1];
}

function pairToString(pair: [number, number]): string {
    return pair.join(',');
}

export function paintAndRead(code: bigint[]) {
    const startingTileColour = 1n;
    const machine = new Machine(code);
    const machineInput = machine.input;
    const machineOutput = machine.run();

    const visitedSquares = new Map<string, number>();
    let currentDirection = 0;
    let currentSquare: [number, number] = [0, 0];

    machineInput.push(startingTileColour);
    let colourAndDirection: [number, number] | undefined;
    while (colourAndDirection = readColourAndDirection(machineOutput)) {
        visitedSquares.set(pairToString(currentSquare), colourAndDirection[0]);
        currentDirection = (currentDirection + colourAndDirection[1] + 4) % 4;

        currentSquare = [
            currentSquare[row] + directions[currentDirection][row],
            currentSquare[col] + directions[currentDirection][col]
        ];
        
        const existingColourOrUndefined = visitedSquares.get(pairToString(currentSquare));
        if (existingColourOrUndefined !== undefined) {
            machineInput.push(BigInt(existingColourOrUndefined));
        } else {
            machineInput.push(0n);
        }
    }

    printWhiteSquares(visitedSquares);
}

function printWhiteSquares(visitedSquares: Map<string, number>) {
    const whiteSquares = [...visitedSquares].filter(entry => entry[1] === 1).map(entry => entry[0]);
    const [top, bottom, left, right] = findCorners(whiteSquares);

    // printing
    for (let row = top; row >= bottom; row--) {
        let rowString = "";
        for (let col = left; col <= right; col++) {
            const colour = visitedSquares.get(row + ',' + col) ?? 0;
            rowString += colour ? '#' : '.';
        }
        console.log(rowString);
    }
}

function findCorners(whiteSquares: string[]): [number, number, number, number] {
    const rows = whiteSquares.map(square => Number(square.split(',')[row]));
    const cols = whiteSquares.map(square => Number(square.split(',')[col]));
    const top = Math.max(...rows);
    const bottom = Math.min(...rows);
    const left = Math.min(...cols);
    const right = Math.max(...cols);
    return [top, bottom, left, right]
}

export function run() {
    const code = read('./day11input.txt');
    paintAndRead(code);
}