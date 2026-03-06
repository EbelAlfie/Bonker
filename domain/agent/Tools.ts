export abstract class Tool<param> {
    abstract name: string
    abstract description: string
    abstract params: Record<string, string>

    abstract parseParams(anyParam: any): param | undefined

    async execute(rawParam: string) : Promise<string> { 
        const parsedParams = this.parseParams(rawParam)
        if (!parsedParams) throw new Error("Invalid params")

        return await this.run(parsedParams)
    }

    abstract run: (params: param) => Promise<string>

    asPrompt() : string {
        return `
            - ${this.name}: ${this.description}
            params: ${this.params}
        `
    }
}