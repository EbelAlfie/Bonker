import "dotenv/config"
import { TeleConfig } from "../modules/chat/Config"
import { GitConfig } from "../modules/github/Github"
import { OllamaConfig } from "../modules/ollama/OllamaLlm"

export const Config = {
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? "",
    GIT_REMOTE_TOKEN: process.env.GIT_REMOTE_TOKEN ?? "",
    REPO_URL: process.env.TARGET_REPO ?? ""
}

export const teleConfig: TeleConfig = {
    token: Config.TELEGRAM_TOKEN
}

export const gitConf: GitConfig = { 
    owner: "EbelAlfie",
    repoUrl: Config.REPO_URL,
    branch: "main"
}

export const llmConfig: OllamaConfig = {
    baseUrl: "http://localhost:11434",
    baseModel: "qwen2.5-coder:7b",
    embedModel: "nomic-embed-text"
}