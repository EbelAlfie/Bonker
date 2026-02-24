import { existsSync, writeFile, writeFileSync } from "fs";
import { Workspace } from "../../domain/file/Workspace";
import path from "path";
import { rm } from "fs/promises";

export class FileManager implements Workspace {
    workingDir: string = path.join(__dirname, "tmp")

    constructor(workingDir: string = path.join(__dirname, "tmp")) { 
        this.workingDir = workingDir
    }

    updateWorkspace(newDir: string): void { 
        this.workingDir = newDir
    }

    createNewFile(fileName: string): string {
        if (!existsSync(this.workingDir)) {
            console.log("No dir")
            throw new Error("No dir")
        }

        const isi = `
        class LoginViewModelTest {
            fun should login successfully() {
                // TODO
            }
        }
        `

        const realPath = path.join(this.workingDir, fileName)
        writeFileSync(realPath, isi)
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