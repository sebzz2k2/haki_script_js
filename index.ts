import Parser from "./frontend/parser";
import Environment from "./runtime/environment";
import { evaluate } from "./runtime/interpreter"
import { NumberValue } from "./runtime/value";


function main() {
    const parser = new Parser()
    const env = new Environment()
    env.define("x", { type: "number", value: 10 } as NumberValue)
    console.log("haki_script")

    while (true) {
        const input = prompt("> ")
        if (input === "exit" || !input) {
            process.exit(0)
        }
        const ast = parser.produceAST(input)
        const result = evaluate(ast, env)

        console.log(result)
    }
}

main()