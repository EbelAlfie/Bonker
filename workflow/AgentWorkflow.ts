import { AppConfig } from "../app/app";
import { LLM } from "../domain/llm/LLM";
import { Prompt } from "../domain/llm/Prompt";
import { Decision, Message, ToolRequest } from "../domain/agent/types";
import { parseDecision } from "../modules/ollama/Agent";
import { FileSanitizer } from "../modules/file/FileSanitizer";
import { Workspace } from "../domain/file/Workspace";
import { ToolRegistry } from "../agent/ToolRegistry";
import { ReadFileTool } from "../agent/tools/ReadFileTool";
import { ChatMessage } from "../domain/chat/Command";
import { Chat } from "../domain/chat/Chat";
import { Workflow } from "../domain/workflow/Workflow";

export class AgentWorkflow implements Workflow { 
    chat: Chat
    llm: LLM
    fileManager: Workspace
    fileSanitizer: FileSanitizer = new FileSanitizer()

    toolRegistry: ToolRegistry = new ToolRegistry()

    systemMessage: string = `
    Kamu adalah coding agent. Tugasmu mengerjakan hal yang berhubungan dengan kode.

    Setiap responmu HARUS berupa JSON dengan format:

    Jangan tambahkan teks apapun di luar JSON.

    Tool names are case-sensitive. Call tools exactly as listed.
    Tool availabilities :
    {"tool": {"name": "nama_tool", "params": {...}}}

    Kalau sudah selesai:
    {"answer": "penjelasan ke user"}
    `

    constructor({chat, llm, fileManager} : AppConfig) { 
        this.chat = chat
        this.llm = llm
        this.fileManager = fileManager

        this.toolRegistry.registerTools(
            [
                new ReadFileTool(fileManager)
            ]
        )
    }

    execute() { 
        this.chat.registerCommand([
            {
                name: "agent",
                description: "run agent",
                handler: this.runAgent.bind(this)
            }
        ])
    }

    async runAgent(telegramMessage: ChatMessage) {
        let context : Message[] = [{
            role: "user",
            content: telegramMessage.text ?? ""
        }]
        
        while(true) { 
            const llmDecision = await this.callLlm(context)
            if (llmDecision === null) {
                telegramMessage.reply("Decision is null")
                return 
            }

            if (llmDecision.answer) { 
                telegramMessage.reply(llmDecision.answer)
                return
            }

            if (llmDecision.tool) { 
                const result = await this.onToolRequest(llmDecision.tool)

                const newContext: Message = {
                    role: "tool",
                    content: result
                }
                context = [...context, newContext]
                console.log(`Panggil ${llmDecision.tool?.name} ${llmDecision.tool?.params}`)
            }
        }
    }

    async callLlm(context: Message[]): Promise<Decision | null> { 
        const contextMessage = context.map(message => { 
            return `${message.role}: ${message.content}`
        })

        const prompt: Prompt = { 
            prompt: contextMessage.join("\n"),
            systemMsg: `
            ${this.systemMessage}
            ${this.toolRegistry.getPrompt()}
            `
        }
        console.log(prompt)

        const response = await this.llm.call(prompt)
        const result = this.fileSanitizer.sanitizeCodeResponse(response) ?? response
        console.log(`response ${result}`)
        
        const decision = parseDecision(result)
        console.log(`decision ${decision}`)
        return decision 
    }

    async onToolRequest(toolRequest: ToolRequest) : Promise<string> { 
        const { name, params } = toolRequest
        const result = await this.toolRegistry.execute(name, params)
        return result
    }
}