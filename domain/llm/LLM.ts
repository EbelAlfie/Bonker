import { Embedding } from "./Embedding";
import { Prompt } from "./Prompt";

export interface LLM { 
    call(prompt: Prompt): Promise<string>

    generateEmbeddings(input: any): Promise<Embedding>
}