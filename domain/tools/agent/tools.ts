export abstract class Tool<param> {
    //tool schema
    abstract readonly name: string
    abstract readonly description: string
    abstract readonly parameters: ToolParameter | {}

    abstract parseParams(anyParam: Record<string, unknown>): param | undefined

    async execute(rawParam: Record<string, unknown>) : Promise<string> { 
        const parsedParams = this.parseParams(rawParam)

        if (parsedParams === undefined) 
            throw new Error(`Error: Invalid parameter! expected in the format of ${JSON.stringify(this.parameters)}`)

        return await this.run(parsedParams as param)
    }

    abstract run(params: param): Promise<string>

    asPrompt() : string {
        return `
            - ${this.name}: ${this.description}
            params: ${JSON.stringify(this.parameters)}
            format: {"tool": {"name": "${this.name}", "params": ${JSON.stringify(this.parameters)}}}
        `
    }

    asDefinition() {
        const properties: Record<string, ToolProperties> = {}
        for (const [key, {type, description}] of Object.entries(this.parameters)) {
            properties[key] = { type, description }
        }

        return {
            name: this.name,
            description: this.description,
            parameters: {
                type: "object" as const,
                properties,
                required: Object.keys(this.parameters)
            }
        }
    }
}

export type ToolProperties = {
    type: string, 
    description: string
}

export interface ToolParameter { 
    type: "object"
    properties: Record<string, ToolProperties>
    required: string[]
}