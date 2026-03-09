export abstract class Tool<param> {
    abstract name: string
    abstract description: string
    abstract paramDeclaration: Record<string, string>

    abstract parseParams(anyParam: Record<string, unknown>): param | undefined

    async execute(rawParam: Record<string, unknown>) : Promise<string> { 
        const parsedParams = this.parseParams(rawParam)

        if (parsedParams === undefined && Object.keys(this.paramDeclaration).length > 0) 
            throw new Error(`Error: Invalid parameter! expected in the format of ${JSON.stringify(this.paramDeclaration)}`)

        return await this.run(parsedParams as param)
    }

    abstract run(params: param): Promise<string>

    asPrompt() : string {
        return `
            - ${this.name}: ${this.description}
            params: ${JSON.stringify(this.paramDeclaration)}
            format: {"tool": {"name": "${this.name}", "params": ${JSON.stringify(this.paramDeclaration)}}}
        `
    }
}