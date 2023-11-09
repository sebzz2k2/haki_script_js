

import {
    NumericalLiteral, Identifier, BinaryExpression, Program, Statement, Expression, VariableDeclaration, AssignmentExpression
} from "./ast"
import { tokenize, Token, TokenType } from "./lexer"

export default class Parser {
    private tokens: Token[] = []
    private notEof(): boolean {
        return this.tokens[0].type !== TokenType.EOF
    }

    private parseExpression(): Expression {
        return this.parseAssignmetExpression()
    }

    private parseAssignmetExpression(): Expression {
        const left = this.parseAdditiveExpression()

        if (this.at().type === TokenType.Equals) {
            this.consume()
            const right = this.parseAssignmetExpression()
            return {
                type: "AssignmentExpression",
                assignee: left,
                value: right
            } as AssignmentExpression
        }
        return left
    }

    private at() {
        return this.tokens[0]
    }

    private consume() {
        return this.tokens.shift()
    }

    private parseVariableDeclaration(): Statement {
        const token = this.consume()
        const isConstant = token && token.type === TokenType.Const;
        const identifier = this.expect(TokenType.Identifier, "Expected let or const").value
        if (this.at().type === TokenType.SemiColon) {
            this.consume()
            if (isConstant) {
                throw ("Must assign value to constants. No value provided")
            }
            return {
                type: "VariableDeclaration",
                identifier: identifier,
                constant: false
            } as VariableDeclaration
        }
        this.expect(TokenType.Equals, "Expected equals")
        const declatration = {
            type: "VariableDeclaration",
            constant: isConstant,
            identifier,
            value: this.parseExpression()
        } as VariableDeclaration
        this.expect(TokenType.SemiColon, "Variable declaration must end in semi colon")
        return declatration
    }




    private expect(toknType: TokenType, errorMsg: string) {
        const previous = this.tokens.shift() as Token
        if (!previous || previous.type !== toknType) {
            console.error(errorMsg)
            process.exit(0)
        }
        return previous
    }


    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression()

        while (this.at().value === "*" || this.at().value === "/") {
            const operator = this.consume()!.value
            const right = this.parsePrimaryExpression()
            left = {
                type: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression()

        while (this.at().value === "+" || this.at().value === "-") {
            const operator = this.consume()!.value
            const right = this.parseMultiplicativeExpression()
            left = {
                type: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left
    }

    private parsePrimaryExpression(): Expression {
        const token = this.at().type;
        switch (token) {
            case TokenType.Identifier:
                return {
                    type: "Identifier",
                    symbol: this.consume()!.value
                } as Identifier
            case TokenType.Number:
                return {
                    type: "NumericalLiteral",
                    value: Number(this.consume()!.value)
                } as NumericalLiteral
            case TokenType.OpenParen:
                this.consume()
                const value = this.parseExpression()
                this.expect(TokenType.CloseParen, "Expecting closing parenthesis")
                return value
            default:
                console.error("Unexpected token", this.at())
                process.exit(1)
        }
    }

    private parseStatement(): Statement {
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parseVariableDeclaration()
            default:
                return this.parseExpression()
        }
    }


    public produceAST(input: string): Program {
        this.tokens = tokenize(input)
        const program: Program = {
            type: "Program",
            body: []
        }
        while (this.notEof()) {
            program.body.push(this.parseStatement())
        }
        return program
    }
}

