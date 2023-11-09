export type NodeTypes = "Program" | "VariableDeclaration" | "NumericalLiteral" | "Identifier" | "BinaryExpression" | "AssignmentExpression"

export interface Statement {
    type: NodeTypes
}

export interface Program extends Statement {
    type: "Program"
    body: Statement[]
}
export interface Expression extends Statement { }

export interface AssignmentExpression extends Expression {
    type: "AssignmentExpression"
    assignee: Expression // for objects
    value: Expression
}
export interface VariableDeclaration extends Statement {
    type: "VariableDeclaration"
    constant: boolean,
    identifier: string
    value?: Expression
}

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

