import { Octokit } from "octokit";
import { Git } from "../../domain/vcs/Git";
import { Config } from "../../config/config";

class Github implements Git {
    client: Octokit

    constructor() { 
        this.client = new Octokit({ auth: Config.GIT_REMOTE_TOKEN})
    }
    
    commit(): void {
        throw new Error("Method not implemented.");
    }
    pull(): void {
        throw new Error("Method not implemented.");
    }
    push(): void {
        throw new Error("Method not implemented.");
    }
    pullRequest(): void {
        throw new Error("Method not implemented.");
    } 

}