import { Square, SquareDictionary } from "./squareDictionary";

import { Machine } from "./day9";
const { read } = require("./fileReader");

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

enum Direction {
    NORTH = 1,
    SOUTH = 2,
    EAST = 3,
    WEST = 4
}

enum Status {
    WALL = 0,
    MOVED = 1,
    MOVED_TO_OXYGEN = 2
}

enum Tile {
    WALL = 0,
    EMPTY = 1,
    OXYGEN = 2
}

const directions = [[], [1, 0], [-1, 0], [0, 1], [0, -1]];
const oppositeDirections = [0, 2, 1, 4, 3];

function neighbour(square: Square, direction: Direction): [number, number] {
    return [square[0] + directions[direction][0], square[1] + directions[direction][1]];
}

let machine: Machine;
let generator: Generator<bigint>;

function step(direction: Direction): number {
    machine.getInput = () => BigInt(direction);
    return Number(generator.next().value);
}

// [ square, [directions remaining], back direction]
type stackEntry = [Direction[], Direction|undefined];
let oxygenSquare: Square;

function search(maze: SquareDictionary, startSquare: Square): number {
    const stack: stackEntry[] = [[[1, 2, 3, 4], undefined]];
    let currentSquare = startSquare;

    var nextStackEntry: stackEntry | undefined;
    while (nextStackEntry = stack.pop()) {
        currentSquare = exploreSquare(stack, maze, currentSquare, nextStackEntry);
    }

    const [distancesFromStart, _] = computeDijkstraWithFurthest(maze, startSquare);
    console.log(`Shortest distance to Oxygen: ${distancesFromStart.get(oxygenSquare)}`);

    return computeDijkstraWithFurthest(maze, oxygenSquare)[1];

}

function computeDijkstraWithFurthest(maze: SquareDictionary, startSquare: Square): [SquareDictionary, number] {
    let furthestMinimum = 0;

    let frontier = new SquareDictionary();
    frontier.set(startSquare, 0);
    let minDepths = new SquareDictionary();
    minDepths.set(startSquare, 0);

    var minSquare: [Square, number] | undefined;
    while (minSquare = frontier.popMin()) {
        const [square, depth] = minSquare;
        furthestMinimum = depth;

        const newDepth = depth + 1;
        for (var dir = 1; dir <= 4; dir++) {
            const nextSquare = neighbour(square, dir);
            var cell = maze.get(nextSquare);
            if (cell == Tile.EMPTY || cell == Tile.OXYGEN) {
                const oldDepth = minDepths.get(nextSquare);
                if (oldDepth === undefined || oldDepth > newDepth) {
                    minDepths.set(nextSquare, newDepth);
                    frontier.set(nextSquare, newDepth);
                }
            }
        }
    }

    return [minDepths, furthestMinimum];
}

function exploreSquare(stack: stackEntry[], maze: SquareDictionary, currentSquare: Square, stackEntry: stackEntry): Square {
    const [sidesToTest, backTrackDirection] = stackEntry;

    var direction: Direction | undefined;
    while (direction = sidesToTest.pop()) {
        const nextSquare = neighbour(currentSquare, direction);

        if (!maze.contains(nextSquare)) {

            const status = step(direction);
            switch (status) {
                case Status.WALL:
                    maze.set(nextSquare, Tile.WALL);
                    continue;
                case Status.MOVED:
                    maze.set(nextSquare, Tile.EMPTY);
                    stack.push([sidesToTest, backTrackDirection]);
                    stack.push([[1, 2, 3, 4], oppositeDirections[direction]]);
                    return nextSquare;
                case Status.MOVED_TO_OXYGEN:
                    maze.set(nextSquare, Tile.OXYGEN);
                    oxygenSquare = nextSquare;
                    stack.push([sidesToTest, backTrackDirection]);
                    stack.push([[1, 2, 3, 4], oppositeDirections[direction]]);
                    return nextSquare;
            }
        }
    }

    if (backTrackDirection != undefined) {
        step(backTrackDirection);
        return neighbour(currentSquare, backTrackDirection);
    } else {
        return currentSquare;
    }
}


export function searchMaze(code: bigint[]) {
    machine = new Machine(code, () => 0n);
    generator = machine.run();

    console.log(search(new SquareDictionary(), [0, 0]));
}


export function run() {
    const code = read('./day15input.txt');
  
    searchMaze(code);
}