import { Tool } from "../domain/agent/tools"

export class ToolRegistry { 
    private tools: Tool<any>[] = []

    registerTools(newTools: Tool<any>[]) { 
        this.tools = newTools
    }

    validateTool(name: string) { 
        const selectedTool = this.tools.find(item => item.name === name)
        return selectedTool 
    }

    async execute(
        name: string,
        rawParam: Record<string, unknown>
    ): Promise<string> { 
        try { 
            const tool = this.validateTool(name)
            if (!tool) return Promise.resolve(`Tool with name ${name} not found`)
                
            return await tool.execute(rawParam)
        } catch(error) { 
            return `Error: ${error}`
        }
    }

    getPrompt(): string {
        const allTool = this.tools.map(tool => tool.asPrompt()).join("\n\n")
        return `
            Tools yang tersedia:

            ${allTool}
        `
    }
}