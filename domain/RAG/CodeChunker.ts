import { CodeChunk } from "./Chunk";

export interface CodeChunker {
    parse(content: string, filepath: string): Promise<CodeChunk[]>
}