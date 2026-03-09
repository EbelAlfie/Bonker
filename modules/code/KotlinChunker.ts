import { Language, Parser } from "web-tree-sitter";
import { CodeChunker } from "../../domain/code/CodeChunker";
import { CodeChunk } from "../../domain/code/Chunk";

type KotlinSyntax = "text" | "package" | "function" | "class" | "import"

export class KotlinChunker implements CodeChunker { 
    parser: Parser | null = null

    async init() { 
        await Parser.init()
        this.parser = new Parser()
        const lang = await Language.load('./tree-sitter-kotlin.wasm');
        this.parser.setLanguage(lang);
    }

    async parse(content: string, filepath: string | null = null): Promise<CodeChunk[]> {
        if (!this.parser) { await this.init() }
        const tree = this.parser?.parse(content);
        if (!tree) { 
            return []
        }

        const root = tree.rootNode
        
        const chunks = root.children.map(child => { 
            const chunk: CodeChunk = {
                type: this.getType(child.type),
                codeText: child.text,
                filepath: filepath
            }

            return chunk
        })

        return chunks
    }

    private getType(rawValue: string): KotlinSyntax { 
        console.log(rawValue)
        switch (rawValue) { 
            case "function_declaration":
                return "function"
            case "class_declaration":
                return "class"
            case "package_header":
                return "package"
            case "import_list":
                return "import"
            default:
                return "text"
        }
    }
}