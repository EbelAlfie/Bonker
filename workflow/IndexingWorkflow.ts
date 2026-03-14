import path from "node:path";
import { AppConfig } from "../app/app";
import { Workspace } from "../domain/file/Workspace";
import { LLM } from "../domain/llm/LLM";
import { Git } from "../domain/vcs/Git";
import { CodeChunker } from "../domain/code/CodeChunker";
import { VectorDb } from "../domain/RAG/VectorDb";
import { getRepoName } from "../modules/github/Utils";
import { Workflow } from "../domain/workflow/Workflow";
import { Chat } from "../domain/chat/Chat";

export class IndexingWorkflow implements Workflow {
    chat: Chat
    git: Git
    fileManager: Workspace
    llm: LLM
    codeChunker: CodeChunker
    vectorDb: VectorDb

    constructor({chat, git, fileManager, llm, codeChunker, vectorDb} : AppConfig) { 
        this.chat = chat
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
            // const newDir = await this.git.clone(this.fileManager.workingDir)
            this.fileManager.updateWorkspace(defaultDir)
        
            await this.generateEmbeds()

        } catch(error) { //TODO: handle index error?
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

                const chunks = await this.codeChunker.parse(contentString, path.toString())
                return chunks
            })
        )).flat()
        
        const collectionName = getRepoName() ?? ""
        await this.vectorDb.init(collectionName)

        for (const chunk of chunks) { 
            if (!chunk) continue
            console.log(chunk)
            const embedding = await this.llm.generateEmbeddings(chunk)
            
            await this.vectorDb.insert(embedding)
        }
    }
}