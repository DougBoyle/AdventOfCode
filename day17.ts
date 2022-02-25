import { Square, SquareDictionary } from "./squareDictionary";

import { Machine } from "./day9";
const { read } = require("./fileReader");

enum Direction {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3
}

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const scaffold = "#".charCodeAt(0);
const space = ".".charCodeAt(0);
const robotDirs = ["^".charCodeAt(0), ">".charCodeAt(0), "v".charCodeAt(0), "<".charCodeAt(0)];
const fellOff = "X".charCodeAt(0);

var charsToDirections = new Map<number, Direction>();
charsToDirections.set("^".charCodeAt(0), Direction.NORTH);
charsToDirections.set(">".charCodeAt(0), Direction.EAST);
charsToDirections.set("v".charCodeAt(0), Direction.SOUTH);
charsToDirections.set("<".charCodeAt(0), Direction.WEST);


export function displayCamera(code: bigint[]) {
    const machine = new Machine(code, getInput);
    let x = 0;
    let y = 0;
    let startPos: Square = [0, 0];
    let startDir: Direction = Direction.NORTH;
    let squares = new SquareDictionary();
    for (var value of machine.run()) {
        const numVal = Number(value)

        if (numVal > 255) {
            console.log(numVal);
            return;
        }

        if (value === 10n) {
            if (x == 0) {
                console.log("\n");
                console.log(getPath(squares, startPos, startDir, 0));
            }
            x = 0;
            y++;
        } else {
            squares.set([x, y], numVal);
            if (robotDirs.includes(numVal)) {
                startPos = [x, y];
                startDir = charsToDirections.get(numVal)!;
            } 
            x++;
        }
        process.stdout.write(String.fromCharCode(numVal));
    }
}


function computeAlignment(squares: SquareDictionary): number {
    let result = 0;
    squares.forEach((square, value) => {
        if (isTile(value)
            && isTile(squares.get([square[0], square[1] + 1]))
            && isTile(squares.get([square[0], square[1] - 1]))
            && isTile(squares.get([square[0] + 1, square[1]]))
            && isTile(squares.get([square[0] - 1, square[1]]))
        ) {
            result += square[0] * square[1];
        }
    });
    return result;
}


function isTile(tile: number | undefined) {
    return tile != undefined && (tile == scaffold || robotDirs.includes(tile));
}

function getPath(squares: SquareDictionary, position: Square, direction: Direction, steps: number): String {
    let nextSquare: Square = [position[0] + directions[direction][0], position[1] + directions[direction][1]];
    let next = squares.get(nextSquare);
    if (next === scaffold) {
        return getPath(squares, nextSquare, direction, steps + 1);
    } 

    let result = steps > 0 ? steps + ", " : "";

    let leftDir: Direction = (direction + 3) % 4;
    let rightDir: Direction = (direction + 1) % 4;
    let leftSquare: Square = [position[0] + directions[leftDir][0], position[1] + directions[leftDir][1]];
    let rightSquare: Square =  [position[0] + directions[rightDir][0], position[1] + directions[rightDir][1]];
    if (squares.get(leftSquare) === scaffold) return result + "L, " + getPath(squares, position, leftDir, 0);
    else if (squares.get(rightSquare) === scaffold) return result + "R, " + getPath(squares, position, rightDir, 0);
    else return result;
}

/*
Result from getPath:

R, 12, L, 8, R, 12, R, 8, R, 6, R, 6, R, 8, R, 12, L, 8, R, 12, R, 8, R, 6, R, 6, R, 8, R, 8, L, 8, R, 8, R, 4, R, 4, R, 8, L, 8, R, 8, R, 4, R, 4, R, 8, R, 6, R, 6, R, 8, R, 8, L, 8, R, 8, R, 4, R, 4, R, 8, R, 6, R, 6, R, 8, R, 12, L, 8, R, 12

A = R,12,L,8,R,12
B = R,8,R,6,R,6,R,8
C = R,8,L,8,R,8,R,4,R,4

A,B,A,B,C,C,B,C,B,A


Main = 20 chars = max 11
A, B, C = 20 chars = max 11 instructions

121
*/

const solutionInput = "A,B,A,B,C,C,B,C,B,A\n" + "R,12,L,8,R,12\n" + "R,8,R,6,R,6,R,8\n" + "R,8,L,8,R,8,R,4,R,4\n" + "n\n";
let inputPosition = 0;
function getInput(): bigint {
    const c = solutionInput.charCodeAt(inputPosition++);
    return BigInt(c);
}

export function run() {
    const code = read('./day17input.txt');
    code[0] = 2n;
  
    displayCamera(code);
}