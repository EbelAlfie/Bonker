import { Tool } from "../../domain/tools/agent/tools";
import { LLM } from "../../domain/llm/LLM";
import { VectorDb } from "../../domain/RAG/VectorDb";

export class SearchCodeTool extends Tool<{ query: string }> {
    vectorDb: VectorDb
    llm: LLM

    name: string = "search_code";
    description: string = "search code";
    parameters: Record<string, string> = { "query": "string" };

    constructor(
        {
            llm,
            vectorDb
        }:
        {
            llm: LLM,
            vectorDb: VectorDb
        }
    ) { 
        super()
        this.vectorDb = vectorDb
        this.llm = llm
    }

    parseParams(anyParam: Record<string, unknown>): { query: string; } | undefined {
        const query = anyParam.query 
        if (typeof query === "string") { 
            return {
                query: query as string ?? ""
            }
        }
        return undefined
    }

    async run(params: { query: string; }): Promise<string> {
        const embedding = await this.llm.generateEmbeddings({
            type: "text",
            codeText: params.query,
            filepath: ""
        })

        const result = await this.vectorDb.query(embedding)
        return result.map((item, i) => 
            `[${i + 1}] ${item.metadata?.filepath} — ${item.metadata?.type}\n${item.document}`
        ).join("\n\n---\n\n")
    }
}