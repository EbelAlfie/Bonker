import { Git } from "../domain/tools/vcs/Git";

export type GitConfig = {
    owner: string;
    repoUrl: string;
    branch: string;
};

export class Github implements Git {
    private config: GitConfig;

    constructor(config: GitConfig) {
        this.config = config;
    }

    async clone(workingDir: string): Promise<string> {
        // Implementation for cloning repo
        throw new Error("Not implemented");
    }

    async checkout(branch: string): Promise<void> {
        // Implementation for checking out branch
        throw new Error("Not implemented");
    }

    async add(files: string | string[]): Promise<void> {
        // Implementation for adding files
        throw new Error("Not implemented");
    }

    async commit(message: string | string[], files: string | string[]): Promise<void> {
        // Implementation for committing
        throw new Error("Not implemented");
    }

    async push(branch: string): Promise<void> {
        // Implementation for pushing
        throw new Error("Not implemented");
    }

    pull(): void {
        // Implementation for pulling
        throw new Error("Not implemented");
    }

    async pullRequest({
        sourceBranch,
        targetBranch
    }: {
        sourceBranch: string;
        targetBranch: string;
    }): Promise<number> {
        // Implementation for creating pull request
        throw new Error("Not implemented");
    }

    async deleteBranch(branch: string): Promise<void> {
        // Implementation for deleting branch
        throw new Error("Not implemented");
    }

    async updatePullRequest(number: number, state: "open" | "closed"): Promise<void> {
        // Implementation for updating pull request
        throw new Error("Not implemented");
    }
}
