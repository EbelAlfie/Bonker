import { App } from "./app/app"
import { Config } from "./config/config"
import { TeleConfig } from "./modules/chat/Config"
import { TelegramBot } from "./modules/chat/Telegram"
import { FileManager } from "./modules/file/FileManager"
import { GitConfig, Github } from "./modules/github/Github"
import { OllamaAgent, OllamaConfig } from "./modules/ollama/OllamaAgent"

const teleConfig: TeleConfig = {
    token: Config.TELEGRAM_TOKEN
}

const gitConf: GitConfig = { 
    owner: "EbelAlfie",
    repoUrl: Config.REPO_URL,
    branch: "main"
}

const llmConfig: OllamaConfig = {
    baseUrl: "http://localhost:11434",
    baseModel: "qwen2.5-coder:7b"
}

let app = new App({
    chatBot: new TelegramBot(teleConfig),
    git: new Github(gitConf),
    fileManager: new FileManager(),
    llm: new OllamaAgent(llmConfig)
})

app.start()