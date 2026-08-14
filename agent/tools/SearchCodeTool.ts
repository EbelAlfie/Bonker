import { Tool, ToolParameter } from "../../domain/tools/agent/tools";
import { LLM } from "../../domain/llm/LLM";
import { VectorDb } from "../../domain/RAG/VectorDb";

type SearchCodeParam = { 
    path: string
}

type SearchCodeProp = {
    path: {
        type: "string",
        description: "bebas lah apapun ini hehe"
    }
}

export class SearchCodeTool extends Tool<SearchCodeParam, SearchCodeProp> {
    vectorDb: VectorDb
    llm: LLM

    name: string = "search_code";
    description: string = "search code";
    parameters: ToolParameter<SearchCodeProp> = {
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

    parseParams(anyParam: Record<string, unknown>): SearchCodeParam | undefined {
        const path = anyParam.path 
        if (typeof path === "string") { 
            return {
                path: path as string ?? ""
            }
        }
        return undefined
    }

    async run(params: SearchCodeParam): Promise<string> {
        const embedding = await this.llm.generateEmbeddings({
            type: "text",
            codeText: params.path,
            filepath: ""
        })

        const result = await this.vectorDb.query(embedding)
        return result.map((item, i) => 
            `[${i + 1}] ${item.metadata?.filepath} — ${item.metadata?.type}\n${item.document}`
        ).join("\n\n---\n\n")
    }
}