import { Embedding } from "../llm/Embedding"

export interface VectorDb { 
    init(): Promise<void>

    save(embedding: Embedding): Promise<void>
}