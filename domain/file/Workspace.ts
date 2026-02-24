export interface Workspace { 
    workingDir: string

    updateWorkspace(newDir: string): void
    cleanWorkspace(): Promise<void>
    createNewFile(fileName: string): string
    writeExistingFile(): void
    deleteFile(): void
}