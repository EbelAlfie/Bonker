
import { LLM } from "../domain/llm/LLM";
import { VectorDb } from "../domain/RAG/VectorDb";
import { CodeChunker } from "../domain/code/CodeChunker";
import { Git } from "../domain/vcs/Git";
import { Workspace } from "../domain/file/Workspace";
import { Chat } from "../domain/chat/Chat";
import { AgentWorkflow } from "../workflow/AgentWorkflow";

export type AppConfig = {
    chat: Chat, 
    git: Git,
    fileManager: Workspace,
    llm: LLM,
    vectorDb: VectorDb,
    codeChunker: CodeChunker
}

export class App { 
    runner: AppConfig

    agent: AgentWorkflow

    constructor(runner : AppConfig) { 
        this.runner = runner
        this.agent = new AgentWorkflow(runner)
    }

    start() { 
        this.agent.execute()

        this.runner.chat.start() 
    }
}