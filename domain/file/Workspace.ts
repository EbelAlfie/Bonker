export interface Workspace { 
    workingDir: string

    updateWorkspace(newDir: string): void
    
    createNewFile(fileName: string, content: string): string

    readFile(fileName: string): Promise<Buffer<ArrayBuffer> | undefined>

    cleanWorkspace(): Promise<void>

    writeExistingFile(): void

    deleteFile(): void
}