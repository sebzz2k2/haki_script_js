export enum TokenType {
    Number,
    Identifier,
    Equals,
    SemiColon,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
    Const,
    EOF,
}


const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
    "const": TokenType.Const
}

export interface Token {
    value: string,
    type: TokenType
}

function isDigit(c: string): boolean {
    return c >= "0" && c <= "9"
}
function isLetter(c: string): boolean {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z"
}
function isSkipable(c: string): boolean {
    return c === " " || c === "\n" || c === "\t"
}

export function tokenize(input: string): Token[] {
    const tokens = new Array<Token>()
    const src = input.split("")
    while (src.length > 0) {
        const c = src.shift()
        if (c === "=") {
            tokens.push({ value: c, type: TokenType.Equals })
        }
        else if (c === ";") {
            tokens.push({
                value: c,
                type: TokenType.SemiColon
            })
        }
        else if (c === "(") {
            tokens.push({ value: c, type: TokenType.OpenParen })
        }
        else if (c === ")") {
            tokens.push({ value: c, type: TokenType.CloseParen })
        }
        else if (c === "+" || c === "-" || c === "*" || c === "/") {
            tokens.push({ value: c, type: TokenType.BinaryOperator })
        }
        else {
            if (isDigit(c!)) {
                let number = c
                while (isDigit(src[0])) {
                    if (number) {
                        number += src.shift()
                    }
                }
                tokens.push({ value: number!, type: TokenType.Number })
            }
            else if (isLetter(c!)) {
                let identifier = c
                while (isLetter(src[0])) {
                    if (identifier) {
                        identifier += src.shift()
                    }
                }
                if (KEYWORDS[identifier!]) {
                    tokens.push({ value: identifier!, type: KEYWORDS[identifier!] })
                }
                else {
                    tokens.push({ value: identifier!, type: TokenType.Identifier })
                }

            } else if (isSkipable(c!)) {
                continue;
            }
            else {
                throw new Error(`Unexpected token ${c}`)
            }
        }
    }
    tokens.push({ value: "EOF", type: TokenType.EOF })
    return tokens
}