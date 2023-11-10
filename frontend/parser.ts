

import {
    NumericalLiteral,
    Identifier,
    BinaryExpression,
    Program,
    Statement,
    Expression,
    VariableDeclaration,
    AssignmentExpression,
    Property,
    ObjectLiteral,
    CallExpression,
    MemberExpression
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

    private parseObjectExpression(): Expression {
        if (this.at().type !== TokenType.OpenBrace) {
            return this.parseAdditiveExpression()
        }
        this.consume()
        const properties = new Array<Property>();

        while (this.notEof() && this.at().type !== TokenType.CloseBrace) {
            const key = this.expect(TokenType.Identifier, "Expected identifier").value
            if (this.at().type === TokenType.Comma) {
                this.consume()
                properties.push({
                    key,
                    value: undefined,
                    type: "Property"
                } as Property)
                continue
            }
            if (this.at().type === TokenType.CloseBrace) {
                properties.push({
                    key,
                    value: undefined,
                    type: "Property"
                } as Property)
                continue
            }
            this.expect(TokenType.Colon, "Expected colon")
            const value = this.parseExpression()
            properties.push({
                key,
                value,
                type: "Property"
            } as Property)
            if (this.at().type !== TokenType.CloseBrace) {
                this.expect(TokenType.Comma, "Expected comma")
            }
        }

        this.expect(TokenType.CloseBrace, "Expected closing brace")

        return {
            type: "ObjectLiteral",
            properties
        } as ObjectLiteral
    }

    private parseAssignmetExpression(): Expression {

        const left = this.parseObjectExpression()

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
        let left = this.parseCallMemberExpression()

        while (this.at().value === "*" || this.at().value === "/") {
            const operator = this.consume()!.value
            const right = this.parseCallMemberExpression()
            left = {
                type: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }
        return left
    }
    private parseCallMemberExpression(): Expression {
        const member = this.parseMemberExpression()

        if (this.at().type === TokenType.OpenParen) {
            return this.parseCallExpression(member)
        }
        return member

    }
    private parseCallExpression(caller: Expression): Expression {
        let callExpression: Expression = {
            type: "CallExpression",
            caller,
            arguments: this.parseArguments()
        } as CallExpression
        if (this.at().type === TokenType.OpenParen) {
            callExpression = this.parseCallExpression(callExpression)
        }
        return callExpression;
    }

    private parseArguments(): Expression[] {
        this.expect(TokenType.OpenParen, "Expecting opening parenthesis")
        const args = this.at().type === TokenType.CloseParen ? [] : this.parseArgumentList()
        this.expect(TokenType.CloseParen, "Expecting closing parenthesis")
        return args
    }

    private parseArgumentList(): Expression[] {
        const args = [this.parseAssignmetExpression()]
        while (this.notEof() && this.at().type === TokenType.Comma && this.consume()) {
            args.push(this.parseAssignmetExpression())
        }
        return args
    }

    private parseMemberExpression(): Expression {
        let object = this.parsePrimaryExpression()
        while (this.at().type === TokenType.Dot || this.at().type === TokenType.OpenBracket) {
            const operator = this.consume()
            let property: Expression
            let computed: boolean
            if (operator!.type === TokenType.Dot) {
                property = this.parsePrimaryExpression()
                computed = false
                if (property.type !== "Identifier") {
                    throw new Error("Expected identifier")
                }
            }
            else {
                property = this.parseExpression()
                computed = true
                this.expect(TokenType.CloseBracket, "Expecting closing bracket")
            }
            object = {
                type: "MemberExpression",
                object,
                property,
                computed
            } as MemberExpression
        }
        return object
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

