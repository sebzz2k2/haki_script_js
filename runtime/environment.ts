import { MAKE_BOOLEAN, MAKE_NULL, RuntimeValue } from "./value"

export function setupGlobalEnv() {
    const env = new Environment()
    env.define("true", MAKE_BOOLEAN(true), true)
    env.define("false", MAKE_BOOLEAN(false), true)
    env.define("null", MAKE_NULL(), true)
    return env
}

export default class Environment {
    private parent?: Environment
    private variables: Map<string, RuntimeValue>
    private constants: Set<string>

    constructor(parentEnv?: Environment) {
        this.parent = parentEnv
        this.variables = new Map()
        this.constants = new Set()
    }

    public define(name: string, value: RuntimeValue, constant: boolean) {
        if (this.variables.has(name)) {
            throw new Error(`Variable ${name} already defined`)
        }
        if (constant) {
            this.constants.add(name)
        }
        this.variables.set(name, value)
        return value
    }

    public assign(name: string, value: RuntimeValue) {
        const env = this.resolve(name)
        if (env.constants.has(name)) {
            throw `Cannot reassign ${name} as it was declared as const`
        }
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