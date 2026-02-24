import axios, { AxiosRequestConfig } from "axios";
import { LLM } from "../../domain/agent/LLM";
import { GenerateRequest } from "./Generate";

export type OllamaConfig = { 
    baseUrl: string,
    baseModel: string
}

class OllamaAgent implements LLM { 
    config: OllamaConfig

    constructor(config: OllamaConfig) { 
        this.config = config
    }

    async call(prompt: string): Promise<string> {
        const fullUrl = `${this.config.baseUrl}/api/generate`

        const requestBody: GenerateRequest = {
            model: this.config.baseModel,
            prompt: prompt,
            stream: false
        }

        const requestConfig: AxiosRequestConfig<GenerateRequest> = {
            method: "post",
            data: requestBody
        }
        const response = await axios.request(requestConfig) 

        return response.data
    }
    
}