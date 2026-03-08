
import { FileManager } from "../modules/file/FileManager";
import { LLM } from "../domain/llm/LLM";
import { VectorDb } from "../domain/RAG/VectorDb";
import { CodeChunker } from "../domain/code/CodeChunker";
import { Git } from "../domain/vcs/Git";
import { Workspace } from "../domain/file/Workspace";
import { Chat } from "../domain/chat/Chat";

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

    unitTest: UnitTestWorkflow

    constructor(runner : AppConfig) { 
        this.runner = runner
        this.unitTest = new UnitTestWorkflow(runner)
    }

    start() { 
        this.unitTest.execute()

        this.runner.chat.start() 
    }
}