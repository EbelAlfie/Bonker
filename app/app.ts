
import { LLM } from "../domain/llm/LLM";
import { VectorDb } from "../domain/RAG/VectorDb";
import { CodeChunker } from "../domain/RAG/CodeChunker";
import { Git } from "../domain/tools/vcs/Git";
import { Workspace } from "../domain/tools/file/Workspace";
import { ChatBot } from "../domain/tools/chat/ChatBot";
import { AgentWorkflow } from "../workflow/AgentWorkflow";
import { IndexingWorkflow } from "../workflow/IndexingWorkflow";

export type AppConfig = {
    chat: ChatBot,
    git: Git,
    fileManager: Workspace,
    llm: LLM,
    vectorDb: VectorDb,
    codeChunker: CodeChunker
}

export class App { 
    runner: AppConfig

    agent: AgentWorkflow
    indexing: IndexingWorkflow

    constructor(runner : AppConfig) { 
        this.runner = runner
        this.agent = new AgentWorkflow(runner)
        this.indexing = new IndexingWorkflow(runner)
    }

    start() { 
        // this.indexing.execute()
        this.agent.execute()

        this.runner.chat.start()
    }
}