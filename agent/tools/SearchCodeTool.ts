import { Tool, ToolParameter } from "../../domain/tools/agent/tools";
import { LLM } from "../../domain/llm/LLM";
import { VectorDb } from "../../domain/RAG/VectorDb";

type SearchCodeProp = { 
    query: string
}

export class SearchCodeTool extends Tool<SearchCodeProp> {
    vectorDb: VectorDb
    llm: LLM

    name: string = "search_code";
    description: string = "search code";
    parameters: ToolParameter = {
        type: "object",
        properties: {
            path: {
                type: "string",
                description: "bebas lah apapun ini hehe"
            }
        },
        required: ["query"]
    }

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

    parseParams(anyParam: Record<string, unknown>): SearchCodeProp | undefined {
        const query = anyParam.query 
        if (typeof query === "string") { 
            return {
                query: query as string ?? ""
            }
        }
        return undefined
    }

    async run(params: SearchCodeProp): Promise<string> {
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