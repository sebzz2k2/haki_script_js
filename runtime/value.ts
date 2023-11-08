export type valueTypes = "null" | "number"

export interface RuntimeValue {
    type: valueTypes
}

export interface NullValue extends RuntimeValue {
    type: "null"
    value: "null"
}

export interface NumberValue extends RuntimeValue {
    type: "number"
    value: number
}

