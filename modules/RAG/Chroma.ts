import { Embedding } from "../../domain/llm/Embedding";
import { VectorDb } from "../../domain/RAG/VectorDb";
import { ChromaClient, Collection } from 'chromadb'

export class Chroma implements VectorDb { 
    client: ChromaClient
    codeCollection: Collection | null = null

    constructor() { 
        this.client = new ChromaClient()
    }

    async init(): Promise<void> { 
        this.codeCollection = await this.client.getOrCreateCollection(
            { 
                name: "codebase",
                embeddingFunction: null
            }
        )
    }

    async save(embedding: Embedding): Promise<void> { 
        if (!this.codeCollection) { await this.init() }
    }
}