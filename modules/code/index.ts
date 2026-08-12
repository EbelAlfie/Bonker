import { llmConfig } from "../../app/config"
import { FileManager } from "../file/FileManager"
import { OllamaLlm } from "../ollama/OllamaLlm"
import { KotlinChunker } from "./KotlinChunker"

async function main() { 
    const ollama = new OllamaLlm(llmConfig)
    const chunker = new KotlinChunker()
    chunker.init()

    const fileManager = new FileManager()

    const code = await fileManager.readFile("ChatManager.kt")

    const chunks = await chunker.parse(code?.toString() ?? "", "ChatManager.kt")

    chunks.forEach(async chunk => { 
        const response = await ollama.generateEmbeddings(chunk)
        console.log("START")
        console.log(response)
        console.log("END")
    })
    
}

main()