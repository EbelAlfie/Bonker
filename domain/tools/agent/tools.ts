export class Tool {
    name: string
    description: string
    params: Record<string, string>
    handler: (params: Record<string, unknown>) => Promise<string>

    constructor(config: {
        name: string
        description: string
        params: Record<string, string>,
        handler: (params: Record<string, unknown>) => Promise<string>
    }) {
        const {
            name,
            description,
            params,
            handler
        } = config

        this.name = name
        this.description = description
        this.params = params
        this.handler = handler
    }

    asPrompt() : string {
        return `
            - ${this.name}: ${this.description}
            params: ${this.params}
        `
    }
}

export class ToolRegistry { 
    private tools: Tool[] = []

    registerTools(newTools: Tool[]) { 
        this.tools = newTools
    }

    validateTool(name: string) { 
        const selectedTool = this.tools.find(item => item.name === name)
        return selectedTool 
    }

    execute(
        name: string,
        rawParam: string
    ): Promise<string> { 
        const param = JSON.parse(rawParam)
        const tool = this.validateTool(name)
        if (!tool) return Promise.resolve(`Tool with name ${name} not found`)
            
        return tool.handler(param)
    }
}