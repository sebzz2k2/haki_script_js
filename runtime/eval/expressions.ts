import { AssignmentExpression, BinaryExpression, Identifier, ObjectLiteral } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeValue, NumberValue, MAKE_NULL, ObjectValue } from "../value";

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

export function evaluateObjectExpression(obj: ObjectLiteral, env: Environment): RuntimeValue {
    const object = {
        type: "object",
        properties: new Map()
    } as ObjectValue

    for (const { key, value } of obj.properties) {
        const evaluatedValue = value === undefined ? env.lookupVariable(key) : evaluate(value, env)
        object.properties.set(key, evaluatedValue)
    }
    return object
}
export function evaluateAssignmentExpression(expression: AssignmentExpression, env: Environment): RuntimeValue {
    if (expression.assignee.type !== "Identifier") {
        throw new Error("Can only assign to identifiers")
    }
    const value = (expression.assignee as Identifier).symbol
    return env.assign(value, evaluate(expression.value, env))
}