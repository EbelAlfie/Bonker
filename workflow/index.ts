import { gitConf, llmConfig, teleConfig } from "../app/config"
import { TelegramChat } from "../modules/chat/Telegram"
import { FileManager } from "../modules/file/FileManager"
import { Github } from "../modules/github/Github"
import { OllamaLlm } from "../modules/ollama/OllamaLlm"
import { Chroma } from "../modules/RAG/Chroma"
import { KotlinChunker } from "../modules/code/KotlinChunker"
import { AgentWorkflow } from "./AgentWorkflow"

function run() {
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