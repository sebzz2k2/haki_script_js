import { AssignmentExpression, BinaryExpression, CallExpression, Identifier, ObjectLiteral } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeValue, NumberValue, MAKE_NULL, ObjectValue, NativeFunctionValue, FunctionValue } from "../value";

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
export function evaluateCallExpression(callExpression: CallExpression, env: Environment): RuntimeValue {
    const args = callExpression.arguments.map(arg => evaluate(arg, env))
    const caller = evaluate(callExpression.caller, env)
    if (caller.type === "nativeFunction") {
        return (caller as NativeFunctionValue).callMethod(args, env)
    }
    if (caller.type === "function") {
        const functionValue = caller as FunctionValue
        const newEnv = new Environment(functionValue.env)
        for (let i = 0; i < functionValue.params.length; i++) {
            if (args[i] === undefined) {
                throw new Error("Not enough arguments")
            }
            newEnv.define(functionValue.params[i], args[i], false)
        }
        let result: RuntimeValue = MAKE_NULL()
        for (const statement of functionValue.body) {
            result = evaluate(statement, newEnv)
        }
        return result
    }
    throw new Error("Not implemented")
}
export function evaluateAssignmentExpression(expression: AssignmentExpression, env: Environment): RuntimeValue {
    if (expression.assignee.type !== "Identifier") {
        throw new Error("Can only assign to identifiers")
    }
    const value = (expression.assignee as Identifier).symbol
    return env.assign(value, evaluate(expression.value, env))
}