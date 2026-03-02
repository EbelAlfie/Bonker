import path from "node:path";
import { AppConfig } from "../app/app";
import { ChatBot } from "../domain/chat/ChatBot";
import { Workspace } from "../domain/file/Workspace";
import { LLM } from "../domain/llm/LLM";
import { Git } from "../domain/vcs/Git";
import { Workflow } from "../domain/Workflow";
import { CodeChunker } from "../domain/RAG/CodeChunker";
import { VectorDb } from "../domain/RAG/VectorDb";
import { getRepoName } from "../modules/github/Utils";

export class IndexingWorkflow implements Workflow {
    chatBot: ChatBot
    git: Git
    fileManager: Workspace
    llm: LLM
    codeChunker: CodeChunker
    vectorDb: VectorDb

    constructor({chatBot, git, fileManager, llm, codeChunker, vectorDb} : AppConfig) { 
        this.chatBot = chatBot
        this.git = git
        this.fileManager = fileManager
        this.llm = llm
        this.codeChunker = codeChunker
        this.vectorDb = vectorDb
    }

    execute(): void {
        this.indexCode()
    }

    async indexCode() { 
        const defaultDir = this.fileManager.workingDir
        try { 
            const newDir = await this.git.clone(this.fileManager.workingDir)
            this.fileManager.updateWorkspace(newDir)
        
            await this.generateEmbeds()

        } catch(error) {
            console.log(error)
        } finally { 
            this.fileManager.updateWorkspace(defaultDir)
        }
    }

    async generateEmbeds() { 
        const allFiles = this.fileManager.getAllFiles() 
        const chunks = (await Promise.all(allFiles.flatMap(async path => { 
                const content = await this.fileManager.readFile(path.toString())
                const contentString = content?.toString()
                
                if (!contentString || contentString === "") return

                const chunks = await this.codeChunker.parse(contentString)
                return chunks
            })
        )).flat()
        
        const collectionName = getRepoName() ?? ""
        await this.vectorDb.init(collectionName)

        chunks.forEach(async chunk =>{
            if (!chunk) return 
            console.log(chunk)
            const embedding = await this.llm.generateEmbeddings(chunk)
            
            this.vectorDb.insert(embedding)
        })
    }
}