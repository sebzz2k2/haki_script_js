import Parser from "./frontend/parser";
import { evaluate } from "./runtime/interpreter"


function main() {
    const parser = new Parser()
    console.log("haki_script")

    while (true) {
        const input = prompt("> ")
        if (input === "exit" || !input) {
            process.exit(0)
        }
        const ast = parser.produceAST(input)
        const result = evaluate(ast)

        console.log(result)
    }
}

main()