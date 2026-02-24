import { Octokit } from "@octokit/rest";
import { Git } from "../../domain/vcs/Git";
import { Config } from "../../config/config";
import simpleGit, { SimpleGit } from "simple-git";
import path from "node:path";
import { getRepoName } from "./Utils";

export type GitConfig = {
    repoUrl: string,
    branch: string,
    owner: string,
}

export class Github implements Git { //retry mechanism?
    config: GitConfig
    client: Octokit
    localGit: SimpleGit

    constructor(config: GitConfig) { 
        this.config = config
        this.client = new Octokit({ auth: Config.GIT_REMOTE_TOKEN })
        this.localGit = simpleGit()
    }
    
    async clone(workingDir: string): Promise<string> { 
        try { 
            const dir = path.join(workingDir, "tmp1")
            await this.localGit.clone(this.config.repoUrl, dir)
            this.localGit = simpleGit(dir)
            return dir
        } catch(error) { 
            throw new Error(`Failed to clone: ${error}`)
        }
    }

    async checkout(branch: string): Promise<void> { 
        try { 
            await this.localGit.checkoutLocalBranch(branch)
        } catch(error) { 
            throw new Error(`Failed checkout : ${error}`)
        }
    }

    async add(files: string | string[]): Promise<void> {
        try { 
            await this.localGit.add(files)
        } catch(error) { 
            throw new Error(`Failed to add : ${error}`)
        }
    }

    async commit(message: string | string[], files: string | string[]): Promise<void> {
        try { 
            await this.localGit.commit(message, files)
        } catch(error) { 
            throw new Error(`Failed to commit : ${error}`)
        }
    }

    async push(branch: string): Promise<void> {
        try { 
            await this.localGit.push("origin", branch)
        } catch (error) { 
            throw new Error(`Failed push: ${error}`)
        }
    }
    
    pull(): void {
        throw new Error("Method not implemented.");
    }

    async pullRequest(
        {
            sourceBranch,
            targetBranch
        }: 
        {
            sourceBranch: string, 
            targetBranch: string
        }
    ): Promise<void> {
        const repo = getRepoName(this.config.repoUrl)
        
        if (!repo) {
            throw new Error("No repository found")
        }

        await this.client.pulls.create({ 
            owner: this.config.owner,
            repo: repo,
            title: "title",
            body: "Body",
            head: sourceBranch,
            base: targetBranch
        })
    } 
}