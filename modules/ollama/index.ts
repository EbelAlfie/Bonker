import { Embedding } from "../../domain/RAG/Embedding";
import { Prompt } from "../../domain/llm/Prompt";
import { CodeChunk } from "../../domain/code/Chunk";
import { OllamaLlm, OllamaConfig } from "./OllamaLlm";

const dummy = {
    prompt: `Generate unit test Jest untuk fungsi berikut:
    function tambah(a, b) {
        return a + b;
    }
    `,
    systemMsg: "Kamu adalah senior software engineer. Generate unit test untuk kode yang diberikan sesuai bahasa pemrogramannya. Jangan jelaskan apapun, langsung tulis kodenya saja."
}

const llmConfig: OllamaConfig = {
    baseUrl: "http://localhost:11434",
    baseModel: "qwen2.5-coder:7b",
    embedModel: "nomic-embed-text"
}

export async function call(prompt: Prompt = dummy): Promise<string> {
    let ollama = new OllamaLlm(llmConfig)
    const resp = await ollama.call(prompt)

    console.log("resp")
    console.log(resp)
    return resp
}

export async function embed(input: CodeChunk): Promise<Embedding> { 
    let ollama = new OllamaLlm(llmConfig)
    const resp = await ollama.generateEmbeddings(input)

    console.log("embedResp")
    console.log(resp)

    return resp
}

