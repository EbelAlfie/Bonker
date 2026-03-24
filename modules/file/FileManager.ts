import * as fs from "fs";
import { rm } from "fs/promises";
import { Workspace } from "../../domain/file/Workspace";
import path from "path";
import { Config } from "../../app/config";

export class FileManager implements Workspace {

    workingDir: string = Config.WORKSPACE

    constructor(workingDir: string = this.workingDir) { 
        this.workingDir = workingDir
    }

    updateWorkspace(newDir: string): void { 
        this.workingDir = newDir
    }

    getSubdirectories(subPath?: string): string[] {
        const targetPath = subPath ? path.join(this.workingDir, subPath) : this.workingDir
        const root = fs.readdirSync(targetPath, { recursive: true, withFileTypes: true })
        const files = root.filter((item) => { return item.isDirectory() })
        return files.map(item => { return item.name })
    }

    getAllFiles(targetPath: string): string[] { 
        const root = fs.readdirSync(targetPath, { recursive: true })
        const files = root.filter((item) => { return item.includes(".kt") })
        console.log(files)
        return files.map(item => path.join(targetPath, item.toString()))
    }

    findFile(fileName: string): string | undefined {
        const files = fs.readdirSync(this.workingDir, { recursive: true, encoding: 'utf-8' })
        const target = files.find(f => f.includes(fileName))
        return target
    }

    async readFile(filePath: string): Promise<string> { 
        const realPath = filePath
        const content = fs.readFileSync(realPath)
        return content.toString()
    }

    createNewFile(fileName: string, content: string): string {

        if (!fs.existsSync(this.workingDir)) {
            console.log("No dir")
            throw new Error("No dir")
        }

        const realPath = path.join(this.workingDir, fileName)
        fs.writeFileSync(realPath, content)
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