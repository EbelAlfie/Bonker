import { Tool } from "../../domain/agent/tools";
import { Workspace } from "../../domain/file/Workspace";

export class ReadFileTool extends Tool<{ path: string }> {
    name: string = "read_file"
    
    description: string = "Read and get file"
    
    params: Record<string, string> = { "path" : "string" }

    fileManager: Workspace

    constructor(fileManager: Workspace) { 
        super()
        this.fileManager = fileManager
    }

    parseParams(anyParam: Record<string, unknown>): { path: string } | undefined {
        return {
            path: anyParam?.path as string ?? ""
        }
    }

    async run(params: { path: string }): Promise<string> { 
        const fileContent = await this.fileManager.readFile(params.path)
        return fileContent?.toString("utf-8") ?? "File tidak ditemukan"
    }
}