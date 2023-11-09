import {
    NumberValue,
    RuntimeValue,
} from "./value"

import {
    BinaryExpression,
    NumericalLiteral,
    Program,
    Statement, Identifier, VariableDeclaration, AssignmentExpression, ObjectLiteral
} from "../frontend/ast"
import Environment from "./environment"
import { evaluateProgram, evaluateVariableDecelaration } from "./eval/statements"
import { evaluateIdentifier, evaluateBinaryExpression, evaluateAssignmentExpression, evaluateObjectExpression } from "./eval/expressions"

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
    switch (astNode.type) {
        case "VariableDeclaration":
            return evaluateVariableDecelaration(astNode as VariableDeclaration, env)
        case "ObjectLiteral":
            return evaluateObjectExpression(astNode as ObjectLiteral, env)
        case "NumericalLiteral":
            return {
                value: ((astNode as NumericalLiteral).value),
                type: "number"
            } as NumberValue
        case "AssignmentExpression":
            return evaluateAssignmentExpression(astNode as AssignmentExpression, env)
        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, env)

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env)

        case "Program":
            return evaluateProgram(astNode as Program, env)

        default:
            console.log("Not set up", astNode)
            process.exit(1)

    }
}


