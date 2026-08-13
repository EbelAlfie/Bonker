export abstract class Tool<param> {
    abstract readonly name: string
    abstract readonly description: string
    abstract readonly parameters: Record<string, string>

    abstract parseParams(anyParam: Record<string, unknown>): param | undefined

    async execute(rawParam: Record<string, unknown>) : Promise<string> { 
        const parsedParams = this.parseParams(rawParam)

        if (parsedParams === undefined && Object.keys(this.parameters).length > 0) 
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
}