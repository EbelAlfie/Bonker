import * as fs from "fs";
import { Workspace } from "../../domain/file/Workspace";
import path from "path";
import { rm } from "fs/promises";
import { FileSanitizer } from "../ollama/FileSanitizer";

export class FileManager implements Workspace {
    sanitizer: FileSanitizer

    workingDir: string = path.join(__dirname, "tmp")

    constructor(workingDir: string = this.workingDir) { 
        this.workingDir = workingDir
        this.sanitizer = new FileSanitizer()
    }

    updateWorkspace(newDir: string): void { 
        this.workingDir = newDir
    }

    async readFile(fileName: string): Promise<Buffer<ArrayBuffer> | undefined> { 
        const fullPath = path.join(this.workingDir, fileName)

        try { 
            const file = fs.readFileSync(fullPath)
            return file
        } catch(error) { 
            return undefined
        }
    }

    createNewFile(fileName: string, content: string): string {
        const formattedContent = this.sanitizer.sanitizeCodeResponse(content)

        if (!fs.existsSync(this.workingDir) || !formattedContent) {
            console.log("No dir")
            throw new Error("No dir")
        }

        const realPath = path.join(this.workingDir, fileName)
        fs.writeFileSync(realPath, formattedContent)
        return realPath
    }

    async cleanWorkspace(): Promise<void> {
        try {
            await rm(this.workingDir, { recursive: true, force: true })
            console.log("Workspace cleaned:", path)
        } catch (err) {
            console.error("Cleanup failed:", err)
        }
    }

    writeExistingFile(): void {
        throw new Error("Method not implemented.");
    }

    deleteFile(): void {
        throw new Error("Method not implemented.");
    } 
}