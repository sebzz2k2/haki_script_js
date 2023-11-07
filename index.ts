import Parser from "./parser";


function main() {
    const parser = new Parser()
    const ast = parser.produceAST("10 - 5 *( x)")
    console.log(ast)
}

main()