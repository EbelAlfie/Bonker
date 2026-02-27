import { AppConfig } from "../app/app";
import { ChatBot } from "../domain/chat/ChatBot";
import { Message } from "../domain/chat/Command";
import { Workflow } from "../domain/Workflow";
import { Workspace } from "../domain/file/Workspace";
import { Git } from "../domain/vcs/Git";
import { LLM } from "../domain/llm/LLM";
import { PromptRequest } from "../domain/llm/PromptRequest";

export class UnitTestWorkflow implements Workflow { 
    chatBot: ChatBot
    git: Git
    fileManager: Workspace
    llm: LLM

    basePrompt: string = `
    Generate high-quality Kotlin unit tests using JUnit5.
    Follow these constraints:

    - Do NOT test main().
    - Test business logic only.
    - Avoid asserting full console output strings.
    - Prefer asserting return values.
    - Do not hardcode arbitrary constants.
    - Do not guess missing parameters.
    - If information is missing, leave a TODO comment.
    - Output only raw Kotlin code.
    `

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

            const prompt: PromptRequest = {
                prompt: `
                    ${fileContent}
                `,
                systemMsg: "Kamu adalah senior software engineer. Generate unit test untuk kode yang diberikan sesuai bahasa pemrogramannya. Jangan jelaskan apapun, langsung tulis kodenya saja."
            }
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