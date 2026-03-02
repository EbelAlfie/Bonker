import { CodeChunk } from "./Chunk";

export interface CodeChunker {
    parse(content: string): Promise<CodeChunk[]>
}