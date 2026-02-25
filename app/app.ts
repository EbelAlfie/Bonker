import { ChatBot } from "../domain/chat/ChatBot";
import { Workspace } from "../domain/file/Workspace";
import { Git } from "../domain/vcs/Git";
import { UnitTestWorkflow } from "../workflow/UnitTest";
import { FileManager } from "../modules/file/FileManager";
import { LLM } from "../domain/Ai/LLM";

export type AppConfig = {
    chatBot: ChatBot, 
    git: Git,
    fileManager: Workspace,
    llm: LLM
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