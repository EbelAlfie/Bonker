export interface Workspace { 
    workingDir: string

    updateWorkspace(newDir: string): void
    
    createNewFile(fileName: string, content: string): string

    findFile(fileName: string): string | undefined

    readFile(filepath: string): Promise<Buffer<ArrayBuffer> | undefined>

    cleanWorkspace(): Promise<void>

    getAllFiles(): (string | NonSharedBuffer)[]
    
    writeExistingFile(): void

    deleteFile(): void
}