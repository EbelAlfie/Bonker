import { randomUUID } from "node:crypto";
import { Embedding, EmbeddingQuery } from "../../domain/llm/Embedding";
import { VectorDb } from "../../domain/RAG/VectorDb";
import { ChromaClient, Collection } from 'chromadb'

export class Chroma implements VectorDb { 
    client: ChromaClient
    codeCollection: Collection | null = null

    defaultName = "codebase"

    constructor() { 
        this.client = new ChromaClient()
    }

    async init(collectionName: string = this.defaultName): Promise<void> { 
        this.codeCollection = await this.client.getOrCreateCollection(
            { 
                name: collectionName === "" ? this.defaultName : collectionName,
                embeddingFunction: null
            }
        )
    }

    async insert(embedding: Embedding): Promise<void> { 
        if (!this.codeCollection) { await this.init() }

        await this.codeCollection?.add({ 
            ids: [`chunk-${randomUUID()}`],
            embeddings: embedding.value,
            metadatas: [embedding.data],
            documents: [embedding.data.codeText],
        })
    }

    async query(input: Embedding): Promise<EmbeddingQuery[]> { 
        if (!this.codeCollection) { await this.init() }

        const result = await this.codeCollection?.query({
            queryEmbeddings: input.value
        })

        const queryModel: EmbeddingQuery[] = result?.distances[0].map((distance, i) => (
            {
                distance: distance ?? 0,
                document: result.documents[0][i] ?? "",
                metadata: result.metadatas[0][i] ?? {}
            }
        )) ?? []

        console.log("RESULT")
        console.log(result)

        return queryModel
    }

    async drop(collectionName: string = this.defaultName) { 
        await this.client.deleteCollection({ name: collectionName })
    }
}