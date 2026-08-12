export interface Workspace { 
    workingDir: string

    updateWorkspace(newDir: string): void
    
    createNewFile(fileName: string, content: string): string

    getAllFiles(subPath?: string): string[]

    getSubdirectories(subPath?: string): string[]

    findFile(fileName: string): string | undefined

    readFile(filepath: string): Promise<string>

    cleanWorkspace(): Promise<void>
    
    writeExistingFile(): void

    deleteFile(): void
}