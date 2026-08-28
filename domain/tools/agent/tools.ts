export type ToolProperties = {
    type: string, 
    description: string
}

export interface ToolParameter<property extends Record<string, ToolProperties>> { 
    type: string
    properties: property
    required: string[]
}

export abstract class Tool<param, properties extends Record<string, ToolProperties>> {
    //tool schema
    abstract readonly name: string
    abstract readonly description: string
    abstract readonly parameters: ToolParameter<properties> | undefined

    readonly enabled: boolean = true

    constructor(enabled: boolean) { 
        this.enabled = enabled
    }

    abstract parseParams(anyParam: Record<string, unknown>): param | undefined

    async execute(rawParam: Record<string, unknown>) : Promise<string> { 
        if (!this.enabled) return ""
        const parsedParams = this.parseParams(rawParam)

        if (parsedParams === undefined) 
            throw new Error(`Error: Invalid parameter! expected in the format of ${JSON.stringify(this.parameters)}`)

        return await this.run(parsedParams as param)
    }

    abstract run(params: param): Promise<string>

    asPrompt() : string {
        return !this.enabled ? `
            - ${this.name}: ${this.description}
            params: ${JSON.stringify(this.parameters)}
            format: {"tool": {"name": "${this.name}", "params": ${JSON.stringify(this.parameters)}}}
        ` : ""
    }

    asDefinition() {
        return !this.enabled ? {
            name: this.name,
            description: this.description,
            parameters: this.parameters
        } : {}
    }
}