const { run } = require("./day2");
console.log(run);


function testOriginalProgram(): Boolean {
    const code = [1,9,10,3,2,3,11,0,99,30,40,50];
    const expected = [3500,  9, 10, 70, 2,  3, 11,  0, 99, 30, 40, 50];
    run(code);
    for (var i = 0; i < expected.length; i++) {
        if (code[i] !== expected[i]) return false;
    }
    return true;
}

console.log(`Test pass: ${testOriginalProgram()}`);