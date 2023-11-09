export type valueTypes = "null" | "number" | "boolean" | "object"

export interface RuntimeValue {
    type: valueTypes
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean"
    value: boolean
}

export interface NullValue extends RuntimeValue {
    type: "null"
    value: null
}

export interface NumberValue extends RuntimeValue {
    type: "number"
    value: number
}

export interface ObjectValue extends RuntimeValue {
    type: "object"
    properties: Map<string, RuntimeValue>
}

export function MAKE_NUMBER(value: number = 0): NumberValue {
    return {
        type: "number",
        value
    }
}

export function MAKE_NULL(): NullValue {
    return {
        type: "null",
        value: null
    }
}

export function MAKE_BOOLEAN(value: boolean): BooleanValue {
    return {
        type: "boolean",
        value
    }
}