import axios, { AxiosRequestConfig } from "axios";
import { GenerateRequest, GenerateResponse } from "./Generate";
import { LLM } from "../../domain/llm/LLM";
import { Prompt } from "../../domain/llm/Prompt";
import { EmbeddingRequest, EmbeddingResponse, mapToEmbeddings } from "./Embedding";
import { Embedding } from "../../domain/RAG/Embedding";
import { CodeChunk } from "../../domain/code/Chunk";

export type OllamaConfig = { 
    baseUrl: string,
    baseModel: string,
    embedModel: string
}

export class OllamaLlm implements LLM { 
    config: OllamaConfig

    constructor(config: OllamaConfig) { 
        this.config = config
    }

    async call(request: Prompt): Promise<string> {
        const fullUrl = `${this.config.baseUrl}/api/generate`

        const requestBody: GenerateRequest = {
            model: this.config.baseModel,
            prompt: request.prompt,
            system: request.systemMsg,
            stream: false
        }

        const requestConfig: AxiosRequestConfig<GenerateRequest> = {
            url: fullUrl,
            method: "post",
            data: requestBody
        }
        const response = await axios.request<GenerateResponse>(requestConfig) 
        const data = response.data

        const result = data.response
        return result
    }
 
    async generateEmbeddings(input: CodeChunk): Promise<Embedding> { 
        const fullUrl = `${this.config.baseUrl}/api/embed`

        const body: EmbeddingRequest = {
            model: this.config.embedModel,
            input: input.codeText
        }

        const requestConfig: AxiosRequestConfig<EmbeddingRequest> = {
            url: fullUrl,
            method: "post",
            data: body
        }

        const response = await axios.request<EmbeddingResponse>(requestConfig)

        const data = response.data

        return mapToEmbeddings(input, data)
    }
}