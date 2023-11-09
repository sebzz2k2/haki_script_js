import {
    MAKE_NULL,
    NumberValue,
    RuntimeValue,
} from "./value"

import {
    BinaryExpression,
    NumericalLiteral,
    Program,
    Statement, Identifier
} from "../frontend/ast"
import Environment from "./environment"


function evaluateBinaryExpression(expression: BinaryExpression, env: Environment): RuntimeValue {

    const lhs = evaluate(expression.left, env)
    const rhs = evaluate(expression.right, env)

    if (lhs.type === "number" && rhs.type === "number") {
        return evaluateNumericBinaryExpression(lhs as NumberValue, rhs as NumberValue, expression.operator)
    }

    return MAKE_NULL()

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

function evaluateIdentifier(expression: Identifier, env: Environment): RuntimeValue {
    const value = env.lookupVariable(expression.symbol)
    return value
}

function evaluateProgram(program: Program, env: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MAKE_NULL()

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env)
    }

    return lastEvaluated
}

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
    switch (astNode.type) {
        case "NumericalLiteral":
            return {
                value: ((astNode as NumericalLiteral).value),
                type: "number"
            } as NumberValue

        case "NullLiteral":
            return MAKE_NULL()
        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, env)

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env)

        case "Program":
            return evaluateProgram(astNode as Program, env)

        default:
            console.log("Not set up")
            process.exit(1)

    }
}