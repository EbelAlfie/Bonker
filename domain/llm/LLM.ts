import { PromptRequest } from "./PromptRequest";

export interface LLM { 
    call(prompt: PromptRequest): Promise<string>
}