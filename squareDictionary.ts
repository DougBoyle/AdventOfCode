export type Square = [number, number];

export class SquareDictionary {
    dict = new Map<String, number>();

    contains(square: Square) {
        return this.dict.has(squareToString(square));
    }

    set(square: Square, value: number) {
        this.dict.set(squareToString(square), value);
    }

    remove(square: Square) {
        this.dict.delete(squareToString(square));
    }

    get(square: Square): number | undefined {
        return this.dict.get(squareToString(square));
    }

    stringToSquare(square: String): Square {
        const parts = square.split(",");
        return [Number(parts[0]), Number(parts[1])];
    }

    popMin(): [Square, number] | undefined {
        const smallest: String = Array.from(this.dict.keys()).sort((k1, k2) => this.dict.get(k1)! - this.dict.get(k2)!)[0];
        if (smallest == undefined) return undefined;
        const value = this.dict.get(smallest)!
        this.dict.delete(smallest);
        return [this.stringToSquare(smallest), value];
    }
}

export function squareToString(square: Square): String {
    return square.join(",");
}