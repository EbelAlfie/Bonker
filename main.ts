import { App } from "./app/app"
import { Config } from "./config/config"
import { TeleConfig } from "./modules/chat/Config"
import { TelegramBot } from "./modules/chat/Telegram"
import { FileManager } from "./modules/file/FileManager"
import { GitConfig, Github } from "./modules/github/Github"

const teleConfig: TeleConfig = {
    token: Config.TELEGRAM_TOKEN
}

const gitConf: GitConfig = { 
    owner: "EbelAlfie",
    repoUrl: Config.REPO_URL,
    branch: "main"
}

const chatBot = new TelegramBot(teleConfig)
const git = new Github(gitConf)
const fileManager = new FileManager()

let app = new App({
    chatBot: chatBot,
    git: git,
    fileManager: fileManager
})

app.start()