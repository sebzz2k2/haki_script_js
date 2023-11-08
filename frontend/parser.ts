
import {
    NumericalLiteral, Identifier, BinaryExpression, Program, Statement, Expression, NullLiteral
} from "./ast"
import { tokenize, Token, TokenType } from "./lexer"

export default class Parser {
    private tokens: Token[] = []
    private notEof(): boolean {
        return this.tokens[0].type !== TokenType.EOF
    }

    private parseExpression(): Expression {
        return this.parseAdditiveExpression()
    }

    private at() {
        return this.tokens[0]
    }
    private consume() {
        return this.tokens.shift()
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
            case TokenType.Null:
                this.consume();
                return {
                    type: "NullLiteral",
                    value: "null"
                } as NullLiteral
            case TokenType.OpenParen:
                this.consume()
                const expression = this.parseExpression()
                if (this.at().type !== TokenType.CloseParen) {
                    console.error("Expected closing parenthesis")
                    process.exit(1)
                }
                this.consume()
                return expression
            default:
                console.error("Unexpected token", this.at())
                process.exit(1)
        }
    }

    private parseStatement(): Statement {
        return this.parseExpression()
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

