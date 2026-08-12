import * as fs from "fs";
import path from "path";
import { rm } from "fs/promises";
import { Workspace } from "../../../domain/tools/file/Workspace";
import { FileSanitizer } from "../../ollama/FileSanitizer";

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

    findFile(fileName: string): string | undefined {
        const files = fs.readdirSync(this.workingDir, { recursive: true, encoding: 'utf-8' })
        const target = files.find(f => f.includes(fileName))
        return target
    }

    async readFile(filePath: string): Promise<Buffer<ArrayBuffer> | undefined> { 
        const content = fs.readFileSync(path.join(this.workingDir, filePath!))
        return content
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

    getAllFiles(): (string | NonSharedBuffer)[] { 
        const root = fs.readdirSync(this.workingDir, { recursive: true })
        const files = root.filter((item) => { return item.includes(".kt") })
        console.log(files)
        return files
    }

    writeExistingFile(): void {
        throw new Error("Method not implemented.");
    }

    deleteFile(): void {
        throw new Error("Method not implemented.");
    } 
}