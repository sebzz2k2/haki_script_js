import { BinaryExpression, Identifier } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeValue, NumberValue, MAKE_NULL } from "../value";

export function evaluateBinaryExpression(expression: BinaryExpression, env: Environment): RuntimeValue {

    const lhs = evaluate(expression.left, env)
    const rhs = evaluate(expression.right, env)

    if (lhs.type === "number" && rhs.type === "number") {
        return evaluateNumericBinaryExpression(lhs as NumberValue, rhs as NumberValue, expression.operator)
    }

    return MAKE_NULL()

}

export function evaluateNumericBinaryExpression(lhs: NumberValue, rhs: NumberValue, operator: string): NumberValue {
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

export function evaluateIdentifier(expression: Identifier, env: Environment): RuntimeValue {
    const value = env.lookupVariable(expression.symbol)
    return value
}