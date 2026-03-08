export abstract class Tool<param> {
    abstract name: string
    abstract description: string
    abstract params: Record<string, string>

    abstract parseParams(anyParam: Record<string, unknown>): param | undefined

    async execute(rawParam: Record<string, unknown>) : Promise<string> { 
        const parsedParams = this.parseParams(rawParam)
        if (!parsedParams) throw new Error("Invalid params")

        return await this.run(parsedParams)
    }

    abstract run(params: param): Promise<string>

    asPrompt() : string {
        return `
            - ${this.name}: ${this.description}
            params: ${JSON.stringify(this.params)}
            format: {"tool": {"name": "${this.name}", "params": ${JSON.stringify(this.params)}}}
        `
    }
}