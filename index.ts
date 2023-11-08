import Parser from "./frontend/parser";


function main() {
    const parser = new Parser()
    console.log("haki_script")

    while (true) {
        const input = prompt("> ")
        if (input === "exit" || !input) {
            process.exit(0)
        }
        const ast = parser.produceAST(input)
        console.log(ast)
    }
}

main()