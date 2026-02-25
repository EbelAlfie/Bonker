import { Runner } from "../app/app";
import { ChatBot } from "../domain/chat/ChatBot";
import { Message } from "../domain/chat/Command";
import { Workflow } from "../domain/Workflow";
import { Workspace } from "../domain/file/Workspace";
import { Git } from "../domain/vcs/Git";

export class UnitTestWorkflow implements Workflow { 
    chatBot: ChatBot
    git: Git
    fileManager: Workspace

    constructor({chatBot, git, fileManager} : Runner) { 
        this.chatBot = chatBot
        this.git = git
        this.fileManager = fileManager
    }

    execute() {
        this.chatBot.registerCommand([
            { name: "test", description: "Create a test", handler: this.generateTest.bind(this)}
        ])
    }

    async generateTest(message: Message) {
        const originalDir = this.fileManager.workingDir
        try { 
            console.log("Start")
            const devBranch = `dev-test-${Date.now()}`
            const workspaceDir = await this.git.clone(this.fileManager.workingDir)
            await this.git.checkout(devBranch)

            this.fileManager.updateWorkspace(workspaceDir)

            const fileName = this.fileManager.createNewFile("Test.kt")

            await this.git.add(fileName)
            
            await this.git.commit("test", fileName)
            await this.git.push(devBranch)

            await this.git.pullRequest({
                sourceBranch: devBranch,
                targetBranch: "main"
            })

            await message.reply("Success Create PR! Please review it")
        } catch(error) { 
            console.log(error)
            await message.reply("Failed Create PR! " + error)
        } finally { 
            this.fileManager.cleanWorkspace()
            this.fileManager.updateWorkspace(originalDir)
        }
    }
}