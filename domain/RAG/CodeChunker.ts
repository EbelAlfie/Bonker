import { BaseSyntax, CodeChunk } from "./Chunk";

export interface CodeChunker<SyntaxType extends string = BaseSyntax> {
    parse(content: string): Promise<CodeChunk<SyntaxType>[]>
}