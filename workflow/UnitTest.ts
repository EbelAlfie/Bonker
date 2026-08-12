import { AppConfig } from "../app/app";
import { ChatBot } from "../domain/tools/chat/ChatBot";
import { ChatMessage } from "../domain/tools/chat/Command";
import { Workflow } from "../domain/Workflow";
import { Workspace } from "../domain/tools/file/Workspace";
import { Git } from "../domain/tools/vcs/Git";
import { LLM } from "../domain/llm/LLM";
import { Prompt } from "../domain/llm/Prompt";
import { VectorDb } from "../domain/RAG/VectorDb";
import { CodeChunker } from "../domain/RAG/CodeChunker";
import { getRepoName } from "../modules/github/Utils";
import { EmbeddingQuery } from "../domain/llm/Embedding";

export class UnitTestWorkflow implements Workflow { 
    chatBot: ChatBot
    git: Git
    fileManager: Workspace
    llm: LLM
    vectorDb: VectorDb
    codeChunker: CodeChunker

    constructor({chatBot, git, fileManager, llm, vectorDb, codeChunker} : AppConfig) { 
        this.chatBot = chatBot
        this.git = git
        this.fileManager = fileManager
        this.llm = llm
        this.vectorDb = vectorDb
        this.codeChunker = codeChunker
    }

    execute() {
        this.chatBot.registerCommand([
            { name: "test", description: "Create a test", handler: this.generateTest.bind(this)}
        ])
    }

    private async generateTest(message: ChatMessage) {
        const originalDir = this.fileManager.workingDir
        const targetFilename = message.text
        const devBranch = `dev-test-${Date.now()}`

        if (!targetFilename || targetFilename === "")  {
            await message.reply("Failed Create PR! No files to test")
            return 
        }

        let workingBranch: string | undefined
        try { 
            await message.reply("Creating unit test")

            const workspaceDir = await this.git.clone(this.fileManager.workingDir)

            await this.git.checkout(devBranch)

            this.fileManager.updateWorkspace(workspaceDir)

            const filePath = this.fileManager.findFile(targetFilename)
            if (!filePath) throw new Error("Content unavailable")

            const fileContent = await this.fileManager.readFile(filePath)
            if (!fileContent) throw new Error("Content unavailable")

            const context = await this.getContext(fileContent, filePath)

            const files = context.map(embed => {
                return `${embed.metadata?.filepath}${embed.document}`
            }).join("\n\n")

            const prompt: Prompt = {
                prompt: `
                Target file:
                    ${fileContent}
                other files:
                    ${files}
                `,
                systemMsg: `
                    Kamu adalah senior software engineer.
                    Generate unit test untuk kode yang diberikan.

                    Reply dalam format berikut PERSIS, tanpa teks lain:
                    FILENAME: NamaFileTest.kt
                    ---
                    isi unit test disini
                `
            }

            console.log(prompt)

            const response = await this.llm.call(prompt)

            const [header, ...rest] = response.split("---")
            const filename = header.replace("FILENAME:", "").trim()
            const content = rest.join("---").trim()

            const fileName = this.fileManager.createNewFile(filename, content)

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

    async getContext(content: Buffer<ArrayBuffer>, filePath: string): Promise<EmbeddingQuery[]> { 
        const THRESHOLD = 0.5

        const collectionName = getRepoName() ?? ""
        await this.vectorDb.init(collectionName)

        const chunks = await this.codeChunker.parse(content.toString(), filePath)
        
        const concate = chunks.map((chunk) => chunk.codeText).join()
        const embedding = await this.llm.generateEmbeddings({
            type: "text",
            codeText: concate,
            filepath: filePath
        })

        const context = (await this.vectorDb.query(embedding))
            .filter(embed => embed.distance !== undefined && embed.distance < THRESHOLD)
            .filter(embed => { 
                if (embed.metadata?.filepath) { return embed.metadata.filepath !== filePath }
                return true
            })

        return context
    }
}