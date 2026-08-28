import { Tool, ToolParameter } from "../../domain/tools/agent/tools";
import { Workspace } from "../../domain/tools/file/Workspace";

type ReadFileProp = { 
    path: string
}

type ReadFileParam = {
    path: { 
        type: string,
        description: string
    }
}

export class ReadFileTool extends Tool<ReadFileProp, ReadFileParam> {
    name: string = "read_file"
    
    description: string = "Read and get file"
    
    parameters: ToolParameter<ReadFileParam> = {
        type: "object",
        properties: {
            path: {
                type: "string",
                description: "bebas lah apapun ini hehe"
            }
        },
        required: ["path"]
    }

    fileManager: Workspace

    constructor(
        enabled: boolean,
        fileManager: Workspace
    ) { 
        super(enabled)
        this.fileManager = fileManager
    }

    parseParams(anyParam: Record<string, unknown>): ReadFileProp | undefined {
        const path = anyParam?.path

        if (typeof path !== "string" || path.trim() === "")
            return undefined

        return {
            path: path
        }
    }

    async run(params: ReadFileProp): Promise<string> { 
        const fileContent = await this.fileManager.readFile(params.path)
        return fileContent?.toString() ?? "File tidak ditemukan"
    }
}