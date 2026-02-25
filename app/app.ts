import { ChatBot } from "../domain/chat/ChatBot";
import { Workspace } from "../domain/file/Workspace";
import { Git } from "../domain/vcs/Git";
import { UnitTestWorkflow } from "../workflow/UnitTest";
import { FileManager } from "../modules/file/FileManager";

export type Runner = {
    chatBot: ChatBot, 
    git: Git,
    fileManager: Workspace
}

export class App { 
    chatBot: ChatBot
    git: Git
    fileManager: FileManager

    unitTest: UnitTestWorkflow

    constructor(runner : Runner) { 
        this.chatBot = runner.chatBot
        this.git = runner.git
        this.fileManager = runner.fileManager

        this.unitTest = new UnitTestWorkflow(runner)
    }

    start() { 
        this.unitTest.execute()
        this.chatBot.start() 
    }
}