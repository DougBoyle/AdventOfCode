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

export async function populateGame(code: bigint[]) {
    const machine = new Machine(code, getInput);
    const machineInput: bigint[] = machine.input;
    const machineOutput = machine.run();
    var lastInput = 0;
    

    var tileInfo: [number, number, number] | undefined;
    while (tileInfo = readXYTileId(machineOutput)) {
     //   if (machine.inputIndex != lastInput) {
     //       lastInput = machine.inputIndex;
     //       await delay(200);
     //   }
      //  while (machine.inputIndex >= machineInput.length) {
      //      machineInput.push(ballPosition > paddlePosition ? 1n : ballPosition < paddlePosition ? -1n : 0n);
      //  }
        if (gotInput) {
            gotInput = false;
            await delay(10);
        }
        const [x, y, tileId] = tileInfo;
        if (x === -1 && y === 0) {
            // await delay(500);
            // console.log(`Score ${tileId}`);
        } else {
            if (tileId === 3) {
                paddlePosition = x;
            } else if (tileId == 4) {
                ballPosition = x;
            }
            maxWindowHeight = Math.max(y, maxWindowHeight);
            drawTile(x, y, tileId);
        }
    }
}

function drawTile(x: number, y: number, tileId: number) {
    switch (tileId) {
        case 0:
            drawSymbol(x, y, ' ');
            return;
        case 1:
            drawSymbol(x, y, '#');
            return;
        case 2: 
            drawSymbol(x, y, 'X');
            return;
        case 3: 
            drawSymbol(x, y, '-');
            return;
        case 4:
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
  
    populateGame(code);

    jetty.moveTo([maxWindowHeight + 10, 0]);


  //  process.stdout.write("Hello world!\nHello\nHello");
  //  process.stdout.cursorTo(0);
  //  process.stdout.write("Goodbye");

    /*
    jetty.text("hello world\n hello hello \n hellow world");
    jetty.moveTo([2,0]);
    jetty.text("hello panda");
    jetty.moveTo([2, 20]);
    jetty.text('hi');
    jetty.moveTo([5,0]);
    */
}