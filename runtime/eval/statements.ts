import { Program, VariableDeclaration } from "../../frontend/ast"
import Environment from "../environment"
import { evaluate } from "../interpreter"
import { RuntimeValue, MAKE_NULL } from "../value"


export function evaluateProgram(program: Program, env: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MAKE_NULL()
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env)
    }
    return lastEvaluated
}


export function evaluateVariableDecelaration(arg0: VariableDeclaration, env: Environment): RuntimeValue {
    const value = arg0.value
        ? evaluate(arg0.value, env) :
        MAKE_NULL()
    return env.define(arg0.identifier, value, arg0.constant)
}