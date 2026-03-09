import { Tool } from "../../domain/agent/tools";

export class CurrentTimeTool extends Tool<void> {
    name: string = "get_current_time";
    description: string = "Get the current time";
    paramDeclaration: Record<string, string> = {};

    parseParams(anyParam: Record<string, unknown>): void | undefined {
        return 
    }

    async run(params: void): Promise<string> {
        const now = new Date()
        return now.toLocaleTimeString()
    } 
}