import { AppConfig } from "../app/app";
import { ChatBot } from "../domain/chat/ChatBot";
import { Message } from "../domain/chat/Command";
import { Workflow } from "../domain/Workflow";
import { Workspace } from "../domain/file/Workspace";
import { Git } from "../domain/vcs/Git";
import { LLM } from "../domain/Ai/LLM";

export class UnitTestWorkflow implements Workflow { 
    chatBot: ChatBot
    git: Git
    fileManager: Workspace
    llm: LLM

    constructor({chatBot, git, fileManager, llm} : AppConfig) { 
        this.chatBot = chatBot
        this.git = git
        this.fileManager = fileManager
        this.llm = llm
    }

    execute() {
        this.chatBot.registerCommand([
            { name: "test", description: "Create a test", handler: this.generateTest.bind(this)}
        ])
    }

    private async generateTest(message: Message) {
        const originalDir = this.fileManager.workingDir
        const targetFilename = message.text
        const devBranch = `dev-test-${Date.now()}`

        if (!targetFilename || targetFilename === "")  {
            await message.reply("Failed Create PR! No files to test")
            return 
        }

        let workingBranch: string | undefined
        try { 
            const workspaceDir = await this.git.clone(this.fileManager.workingDir)

            await this.git.checkout(devBranch)

            this.fileManager.updateWorkspace(workspaceDir)

            const fileContent = await this.fileManager.readFile(targetFilename)

            const prompt = `
                Just create a test file for this file. No other Words
                ${fileContent}
            `
            const response = await this.llm.call(prompt)

            const fileName = this.fileManager.createNewFile("Test.kt", response)

            await this.git.add(fileName)
            
            await this.git.commit("test", fileName) //Generate message from AI
            
            await this.git.push(devBranch)
            workingBranch = devBranch

            await this.git.pullRequest({
                sourceBranch: devBranch,
                targetBranch: "main"
            })

            await message.reply("Success Create PR! Please review it")
        } catch(error) { 
            console.log(error)
            workingBranch ? this.git.deleteBranch(workingBranch) : null
            await message.reply("Failed Create PR! " + error)
        } finally { 
            this.fileManager.cleanWorkspace()
            this.fileManager.updateWorkspace(originalDir)
        }
    }
}