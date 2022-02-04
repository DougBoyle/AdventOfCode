var fs = require("fs");

export function read(filename: string): number[] {
    var text: string = fs.readFileSync("./day7input.txt", 'utf8');
    return text.split(',').map(x => parseInt(x));
}


