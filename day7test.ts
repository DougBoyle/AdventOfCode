const { runAmps } = require("./day7");


function testOriginalProgram(): Boolean {
    const code = [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33, 1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0];
    const amps = [1, 0, 4, 3, 2];
    const expected = 65210;
    const actual = runAmps(code, amps);
    return expected === actual;
}

console.log(`Test pass: ${testOriginalProgram()}`);