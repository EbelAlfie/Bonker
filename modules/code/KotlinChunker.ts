import { Language, Node, Parser } from "web-tree-sitter";
import { CodeChunker } from "../../domain/code/CodeChunker";
import { CodeChunk } from "../../domain/code/Chunk";

type KotlinSyntax = "text" | "package" | "function" | "class" | "import"

export class KotlinChunker implements CodeChunker { 
    private parser: Parser | null = null

    async init() { 
        await Parser.init()
        this.parser = new Parser()
        const lang = await Language.load('./tree-sitter-kotlin.wasm');
        this.parser.setLanguage(lang);
    }

    async parse(content: string, filepath: string | null = null): Promise<CodeChunk[]> {
        if (!this.parser) { await this.init() }
        const tree = this.parser?.parse(content);
        if (!tree) return []

        return this.parseNode(tree.rootNode, content, filepath, null)
    }

    private parseNode(
        node: Node, 
        content: string, 
        filepath: string | null,
        parentContext: string | null
    ): CodeChunk[] {
        let chunks: CodeChunk[] = []

        for (const child of node.children) {
            if (child.type === "class_declaration") {
                chunks = [...chunks, ...this.parseClass(child, content, filepath, parentContext)]
                continue
            }

            chunks.push({
                type: this.getType(child.type),
                codeText: parentContext ? `// Context: ${parentContext}\n\n${child.text}` : child.text,
                filepath
            })
        }

        return chunks
    }

    private parseClass(
        classNode: Node,
        content: string,
        filepath: string | null,
        parentContext: string | null
    ): CodeChunk[] {
        const chunks: CodeChunk[] = []
        const classBody = classNode.children.find(c => c.type === "class_body")

        // Build class header (everything before the body)
        const classHeader = classBody
            ? content.slice(classNode.startIndex, classBody.startIndex).trim()
            : classNode.text

        const fullContext = parentContext 
            ? `${parentContext}\n${classHeader}` 
            : classHeader

        if (!classBody) {
            chunks.push({ type: "class", codeText: classHeader, filepath })
            return chunks
        }

        // Kumpulin properties dulu
        const properties = classBody.children
            .filter(m => m.type === "property_declaration")
            .map(m => m.text)

        const contextWithProps = properties.length > 0
            ? `${fullContext}\n\n// Properties:\n${properties.join("\n")}`
            : fullContext

        // Push class header + properties sebagai 1 chunk
        chunks.push({ type: "class", codeText: contextWithProps, filepath })

        // Proses semua members
        for (const member of classBody.children) {
            if (member.type === "function_declaration") {
                chunks.push({
                    type: "function",
                    codeText: `// Context: ${contextWithProps}\n\n${member.text}`,
                    filepath
                })
                continue
            }

            if (member.type === "class_declaration") {
                // Rekursif! Nested class bawa context parent
                const nestedChunks = this.parseClass(member, content, filepath, contextWithProps)
                chunks.push(...nestedChunks)
                continue
            }
        }

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