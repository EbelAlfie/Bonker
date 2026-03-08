import { CodeChunk } from "../code/Chunk"

export type Embedding = {
    value: number[][],
    data: CodeChunk
}
export type EmbeddingQuery = {
    distance?: number,
    document?: string,
    metadata?: Record<string, any>
}