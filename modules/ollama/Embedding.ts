import { Embedding } from "../../domain/RAG/Embedding"
import { CodeChunk } from "../../domain/code/Chunk"

export type EmbeddingRequest = {
  model: string
  input: string
}

export type EmbeddingResponse = {
    embeddings: number[][]
}

export function mapToEmbeddings(chunk: CodeChunk, response: EmbeddingResponse): Embedding { 
    return {
        value: response.embeddings,
        data: chunk
    } 
}