import { Config } from "../../../config/config"

export function getRepoName(repoUrl: string = Config.REPO_URL) { 
    const pathname = new URL(repoUrl).pathname
    const name = pathname.split("/").pop()
    return name?.endsWith(".git") ? name.slice(0, -4) : name
}