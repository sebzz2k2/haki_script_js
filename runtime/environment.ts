import { RuntimeValue } from "./value"


export default class Environment {
    private parent?: Environment
    private variables: Map<string, RuntimeValue>

    constructor(parentEnv?: Environment) {
        this.parent = parentEnv
        this.variables = new Map()
    }

    public define(name: string, value: RuntimeValue) {
        if (this.variables.has(name)) {
            throw new Error(`Variable ${name} already defined`)
        }
        this.variables.set(name, value)
    }

    public assign(name: string, value: RuntimeValue) {
        const env = this.resolve(name)
        env.variables.set(name, value)
        return value
    }

    public lookupVariable(name: string): RuntimeValue {
        const env = this.resolve(name)
        return env.variables.get(name) as RuntimeValue
    }

    private resolve(variable: string): Environment {
        if (this.variables.has(variable)) {
            return this
        } else if (this.parent) {
            return this.parent.resolve(variable)
        } else {
            throw new Error(`Cannot resolve variable ${variable} as it is not defined`)
        }

    }
}