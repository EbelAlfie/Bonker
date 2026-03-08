import { Config } from "../config/config"
import { TeleConfig } from "../modules/chat/Config"
import { TelegramChat } from "../modules/chat/Telegram"
import { FileManager } from "../modules/file/FileManager"
import { GitConfig, Github } from "../modules/github/Github"
import { OllamaConfig, OllamaLlm } from "../modules/ollama/OllamaLlm"
import { Chroma } from "../modules/RAG/Chroma"
import { KotlinChunker } from "../modules/RAG/KotlinChunker"
import { AgentWorkflow } from "./AgentWorkflow"
import { IndexingWorkflow } from "./Indexing"

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
    baseModel: "qwen2.5-coder:7b",
    embedModel: "nomic-embed-text"
}

function run() { 
    // const indexing = new IndexingWorkflow(
    //     {
    //         chatBot: new TelegramBot(teleConfig),
    //         git: new Github(gitConf),
    //         fileManager: new FileManager(),
    //         llm: new OllamaAgent(llmConfig),
    //         codeChunker: new KotlinChunker(),
    //         vectorDb: new Chroma()
    //     }
    // )

    // indexing.execute()

    let chat = new TelegramChat(teleConfig)

    const agent = new AgentWorkflow(
        {
            chat: chat,
            git: new Github(gitConf),
            fileManager: new FileManager(),
            llm: new OllamaLlm(llmConfig),
            codeChunker: new KotlinChunker(),
            vectorDb: new Chroma()
        }
    )

    agent.execute()

    chat.start()
}

run()