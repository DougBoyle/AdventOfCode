export enum Opcode {
    Add = 1,
    Mult = 2,
    Input = 3,
    Output = 4,
    BNEZ = 5,
    BEQZ = 6,
    SetLT = 7,
    SetEQ = 8,
    AdjustBase = 9,
    Exit = 99,
}

export enum AddressMode {
    Address = 0,
    Immediate = 1,
    RelativeAddress = 2,
}