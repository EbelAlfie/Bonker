import { ChatBot } from "../domain/tools/chat/ChatBot";
import { Workspace } from "../domain/tools/file/Workspace";
import { Git } from "../domain/tools/vcs/Git";
import { UnitTestWorkflow } from "../workflow/UnitTest";
import { FileManager } from "../modules/file/FileManager";
import { LLM } from "../domain/llm/LLM";
import { VectorDb } from "../domain/RAG/VectorDb";
import { CodeChunker } from "../domain/RAG/CodeChunker";

export type AppConfig = {
    chatBot: ChatBot, 
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

        this.runner.chatBot.start() 
    }
}