import Parser from "./frontend/parser";
import { setupGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter"

async function fileRead(filename: string): Promise<string> {
    const extension = filename.split(".").pop()
    if (extension !== "haki") {
        throw new Error("Invalid file extension")
    }

    const fileContents = Bun.file(filename)
    const arrayBuffer = await fileContents.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return buffer.toString()
}


async function main() {
    let fileContents
    if (Bun.argv[2]) {
        fileContents = await fileRead(Bun.argv[2])
    }
    const parser = new Parser()
    const env = setupGlobalEnv()

    if (fileContents) {
        const ast = parser.produceAST(fileContents)
        const result = evaluate(ast, env)
        console.log(result)
        return
    }

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