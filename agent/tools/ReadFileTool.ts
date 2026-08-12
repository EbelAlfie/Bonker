import { Tool } from "../../domain/agent/tools";
import { Workspace } from "../../domain/file/Workspace";

export class ReadFileTool extends Tool<{ path: string }> {
    name: string = "read_file"
    
    description: string = "Read and get file"
    
    parameters: Record<string, string> = { "path" : "string" }

    fileManager: Workspace

    constructor(fileManager: Workspace) { 
        super()
        this.fileManager = fileManager
    }

    parseParams(anyParam: Record<string, unknown>): { path: string } | undefined {
        const path = anyParam?.path

        if (typeof path !== "string" || path.trim() === "")
            return undefined

        return {
            path: path
        }
    }

    async run(params: { path: string }): Promise<string> { 
        const fileContent = await this.fileManager.readFile(params.path)
        return fileContent?.toString() ?? "File tidak ditemukan"
    }
}