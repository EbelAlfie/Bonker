import { AppConfig } from "../app/app";
import { Workspace } from "../domain/file/Workspace";
import { LLM } from "../domain/llm/LLM";
import { Git } from "../domain/vcs/Git";
import { CodeChunker } from "../domain/code/CodeChunker";
import { VectorDb } from "../domain/RAG/VectorDb";
import { Workflow } from "../domain/workflow/Workflow";
import { Chat } from "../domain/chat/Chat";
import path from "node:path";

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
        
            for (const subproject of this.fileManager.getSubdirectories()) {
                await this.generateEmbeds(subproject)
            }

        } catch(error) { //TODO: handle index error?
            console.log(error)
        } finally { 
            this.fileManager.updateWorkspace(defaultDir)
        }
    }

    async generateEmbeds(subproject: string) { 
        const subdir = path.join(this.fileManager.workingDir, subproject)
        const allFiles = this.fileManager.getAllFiles(subdir) 
        const chunks = (await Promise.all(allFiles.flatMap(async path => { 
                const content = await this.fileManager.readFile(path)
                
                const chunks = await this.codeChunker.parse(content, path)
                return chunks
            })
        )).flat()
        
        const collectionName = subproject ?? ""
        try {
            await this.vectorDb.drop(collectionName)
        } catch (error) {
            console.log(error)
        }
        
        await this.vectorDb.init(collectionName)

        for (const chunk of chunks) { 
            if (!chunk) continue
            console.log(chunk)
            const embedding = await this.llm.generateEmbeddings(chunk)
            
            await this.vectorDb.insert(embedding)
        }
    }
}