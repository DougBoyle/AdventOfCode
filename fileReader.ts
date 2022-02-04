var fs = require("fs");

export function read(filename: string): BigInt[] {
    var text: string = fs.readFileSync(filename, 'utf8');
    return text.split(',').map(x => BigInt(x));
}


