import { Language, Parser } from "web-tree-sitter";
import { CodeChunker } from "../../domain/RAG/CodeChunker";
import { BaseSyntax, CodeChunk } from "../../domain/RAG/Chunk";

type KotlinSyntax = BaseSyntax | "package" | "function" | "class"

export class KotlinChunker implements CodeChunker<KotlinSyntax> { 
    parser: Parser | null = null

    async init() { 
        await Parser.init()
        this.parser = new Parser()
        const lang = await Language.load('./tree-sitter-kotlin.wasm');
        this.parser.setLanguage(lang);
    }

    async parse(content: string): Promise<CodeChunk<KotlinSyntax>[]> {
        if (!this.parser) { await this.init() }
        const tree = this.parser?.parse(content);
        if (!tree) { 
            return []
        }

        const root = tree.rootNode
        
        const chunks = root.children.map(child => { 
            const chunk: CodeChunk<KotlinSyntax> = {
                type: this.getType(child.type),
                data: child.text
            }

            return chunk
        })

        console.log(chunks)

        return chunks
    }

    private getType(rawValue: string): KotlinSyntax { 
        switch (rawValue) { 
            case "function_declaration":
                return "function"
            case "class_declaration":
                return "class"
            case "package_header":
                return "package"
            default:
                return "unknown"
        }
    }
}