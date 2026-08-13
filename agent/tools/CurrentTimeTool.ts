import { Tool, ToolParameter } from "../../domain/tools/agent/tools";

export class CurrentTimeTool extends Tool<void> {
    name: string = "get_current_time";
    description: string = "Get the current time";
    parameters = {} ;

    parseParams(anyParam: Record<string, unknown>): void {
        return 
    }

    async run(params: void): Promise<string> {
        const now = new Date()
        return now.toLocaleTimeString()
    } 
}