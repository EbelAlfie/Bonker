import { CodeChunk } from "../code/Chunk";
import { Embedding } from "../RAG/Embedding";
import { Prompt } from "./Prompt";

export interface LLM { 
    call(prompt: Prompt): Promise<string>

    generateEmbeddings(input: CodeChunk): Promise<Embedding>
}