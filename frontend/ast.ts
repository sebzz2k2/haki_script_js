export type NodeTypes = "Program" | "NumericalLiteral" | "Identifier" | "BinaryExpression" | "NullLiteral"

export interface Statement {
    type: NodeTypes
}

export interface Program extends Statement {
    type: "Program"
    body: Statement[]
}
export interface Expression extends Statement { }

export interface BinaryExpression extends Expression {
    type: "BinaryExpression",
    left: Expression,
    right: Expression,
    operator: string
}

export interface Identifier extends Expression {
    type: "Identifier"
    symbol: string
}

export interface NumericalLiteral extends Expression {
    type: "NumericalLiteral"
    value: number
}

export interface NullLiteral extends Expression {
    type: "NullLiteral"
    value: "null"
}
