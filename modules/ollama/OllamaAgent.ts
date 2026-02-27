import axios, { AxiosRequestConfig } from "axios";
import { GenerateRequest, GenerateResponse } from "./Generate";
import { LLM } from "../../domain/llm/LLM";
import { PromptRequest } from "../../domain/llm/PromptRequest";

export type OllamaConfig = { 
    baseUrl: string,
    baseModel: string
}

export class OllamaAgent implements LLM { 
    config: OllamaConfig

    constructor(config: OllamaConfig) { 
        this.config = config
    }

    async call(request: PromptRequest): Promise<string> {
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
    
}