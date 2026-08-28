import { Tool } from "../domain/tools/agent/tools"
export class ToolRegistry { 
    private tools: Tool<any, any>[] = []

    registerTools(newTools: Tool<any, any>[]) { 
        this.tools = newTools
        this.addToSetting(this.tools)
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
            if (!tool) return Promise.resolve(`Tool named ${name} not found`)
                
            return await tool.execute(rawParam)
        } catch(error) { 
            return `Error: ${error}`
        }
    }

    getDefinition(): Object[] {
        const allTool = this.tools.map(tool => {
            return {type: "function", function: tool.asPrompt()}
        })

        return allTool
    }

    addToSetting(tools: Tool<any, any>[]) { 
        let toolSettings = tools.map(element => {
            return `"${element.name}" : { 
                enabled: ${element.enabled}
            }`
        });

        let json = `
            tools: {
                ${toolSettings}
            }
        `
    }
 }