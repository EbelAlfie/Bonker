export interface Git { 
    clone(workingDir: string): Promise<string>

    checkout(branch: string): Promise<void>

    add(files: string | string[]): Promise<void>

    commit(message: string | string[], files: string | string[]): Promise<void>

    push(branch: string): Promise<void>

    pull(): void

    pullRequest(
        {
            sourceBranch,
            targetBranch
        }: 
        {
            sourceBranch: string, 
            targetBranch: string
        }
    ): Promise<number>

    deleteBranch(branch: string): Promise<void>

    updatePullRequest(number: number, state: "open" | "closed"): Promise<void>
}