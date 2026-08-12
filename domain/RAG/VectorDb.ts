import { Embedding, EmbeddingQuery } from "./Embedding"

export interface VectorDb { 
    init(collectionName: string): Promise<void>

    insert(embedding: Embedding): Promise<void>

    query(input: Embedding): Promise<EmbeddingQuery[]>

    drop(collectionName: string): Promise<void>
}