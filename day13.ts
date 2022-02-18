const { Machine } = require("./day9");
const { read } = require("./fileReader");

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function readXYTileId(machineOutput: Generator<bigint>): [number, number, number] | undefined {
    var firstValue = machineOutput.next();
    if (firstValue.done) return undefined
    var secondValue = machineOutput.next();
    if (secondValue.done) return undefined;
    var thirdValue = machineOutput.next();
    if (thirdValue.done) return undefined;
    return [Number(firstValue.value), Number(secondValue.value), Number(thirdValue.value)];
}

var ballPosition = 0;
var paddlePosition = 0;
var gotInput = false;
function getInput(): bigint {
    gotInput = true;
    return ballPosition > paddlePosition ? 1n : ballPosition < paddlePosition ? -1n : 0n;
}

enum Tile {
    EMPTY = 0,
    WALL = 1,
    BLOCK = 2,
    PADDLE = 3,
    BALL = 4
}


class SquareDictionary {
    dict = new Set<String>();

    contains(square: [number, number]) {
        return this.dict.has(this.squareToString(square));
    }

    add(square: [number, number]) {
        this.dict.add(this.squareToString(square));
    }

    remove(square: [number, number]) {
        this.dict.delete(this.squareToString(square));
    }

    squareToString(square: [number, number]) {
        return square.join(",");
    }
}

export async function populateGame(code: bigint[]): Promise<number> {
    const machine = new Machine(code, getInput);
    const machineOutput = machine.run();
    const bricks = new SquareDictionary();
    let score = 0;

    var tileInfo: [number, number, number] | undefined;
    while (tileInfo = readXYTileId(machineOutput)) {

        if (gotInput) {
            gotInput = false;
            await delay(5);
        }
        const [x, y, tileId] = tileInfo;
        if (x === -1 && y === 0) {
            score = tileId;
        } else {
            if (tileId === Tile.PADDLE) {
                paddlePosition = x;
            } else if (tileId == Tile.BALL) {
                ballPosition = x;
            }
            maxWindowHeight = Math.max(y, maxWindowHeight);
            drawTile(x, y, tileId);
        }
    }
    return score;
}

function drawTile(x: number, y: number, tileId: number) {
    switch (tileId) {
        case Tile.EMPTY:
            drawSymbol(x, y, ' ');
            return;
        case Tile.WALL:
            drawSymbol(x, y, '#');
            return;
        case Tile.BLOCK: 
            drawSymbol(x, y, 'X');
            return;
        case Tile.PADDLE: 
            drawSymbol(x, y, '-');
            return;
        case Tile.BALL:
            drawSymbol(x, y, 'O');
            return;
    }
}

function drawSymbol(x: number, y: number, symbol: string) {
    jetty.moveTo([y, x]);
    jetty.text(symbol);
}

var Jetty = require("jetty");
var jetty = new Jetty(process.stdout);
jetty.clear();
jetty.moveTo([1,0]);
var maxWindowHeight = 0;

export function run() {
    const code = read('./day13input.txt');
    code[0] = 2;
  
    populateGame(code).then(
        result => {
            jetty.moveTo([maxWindowHeight + 10, 0]);
            console.log(`Final score: ${result}`);
        }
    );
}