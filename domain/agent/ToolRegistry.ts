import { Tool } from "./tools"

export class ToolRegistry { 
    private tools: Tool<any>[] = []

    registerTools(newTools: Tool<any>[]) { 
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
        const tool = this.validateTool(name)
        if (!tool) return Promise.resolve(`Tool with name ${name} not found`)
            
        return tool.execute(rawParam)
    }
}