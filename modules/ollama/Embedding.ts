import { Embedding } from "../../domain/llm/Embedding"

export type EmbeddingRequest = {
  model: string
  input: string
}

export type EmbeddingResponse = {
    embeddings: number[][]
}

export function mapToEmbeddings(response: EmbeddingResponse): Embedding { 
    return {
        value: response.embeddings
    } 
}