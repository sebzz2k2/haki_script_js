import {
    NullValue,
    NumberValue,
    RuntimeValue,
} from "./value"

import {
    BinaryExpression,
    NumericalLiteral,
    Program,
    Statement
} from "../frontend/ast"


function evaluateBinaryExpression(expression: BinaryExpression): RuntimeValue {

    const lhs = evaluate(expression.left)
    const rhs = evaluate(expression.right)

    if (lhs.type === "number" && rhs.type === "number") {
        return evaluateNumericBinaryExpression(lhs as NumberValue, rhs as NumberValue, expression.operator)
    }

    return {
        type: "null",
        value: "null"
    } as NullValue

}

function evaluateNumericBinaryExpression(lhs: NumberValue, rhs: NumberValue, operator: string): NumberValue {
    let result = 0;
    if (operator === "+") {
        result = lhs.value + rhs.value
    }
    if (operator === "-") {
        result = lhs.value - rhs.value
    } if (operator === "*") {
        result = lhs.value * rhs.value
    } if (operator === "+") {
        result = lhs.value + rhs.value
    }

    return {
        value: result, type: "number"
    }

}

function evaluateProgram(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = {
        type: "null",
        value: "null"
    } as NullValue

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement)
    }

    return lastEvaluated
}

export function evaluate(astNode: Statement): RuntimeValue {
    switch (astNode.type) {
        case "NumericalLiteral":
            return {
                value: ((astNode as NumericalLiteral).value),
                type: "number"
            } as NumberValue

        case "NullLiteral":
            return {
                value: "null", type: "null"
            } as NullValue

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression)

        case "Program":
            return evaluateProgram(astNode as Program)

        default:
            console.log("Not set up")
            process.exit(1)

    }
}