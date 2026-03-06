import { AppConfig } from "../app/app";
import { ChatBot } from "../domain/tools/chat/ChatBot";
import { ChatMessage } from "../domain/tools/chat/Command";
import { LLM } from "../domain/llm/LLM";
import { Prompt } from "../domain/llm/Prompt";
import { Decision, Message, ToolRequest } from "../domain/tools/agent/types";
import { Workflow } from "../domain/Workflow";
import { parseDecision } from "../modules/ollama/Agent";
import { FileSanitizer } from "../modules/ollama/FileSanitizer";
import { Tool, ToolRegistry } from "../domain/tools/agent/tools";
import { Workspace } from "../domain/tools/file/Workspace";

export class AgentWorkflow implements Workflow { 
    chatBot: ChatBot
    llm: LLM
    fileManager: Workspace
    fileSanitizer: FileSanitizer = new FileSanitizer()

    toolRegistry: ToolRegistry = new ToolRegistry()

    systemMessage: string = `
    Kamu adalah coding agent. Tugasmu mengerjakan hal yang berhubungan dengan kode.

    Setiap responmu HARUS berupa JSON dengan format:

    Kalau butuh tool:
    {"tool": {"name": "nama_tool", "params": {...}}}

    Kalau sudah selesai:
    {"answer": "penjelasan ke user"}

    Jangan tambahkan teks apapun di luar JSON.
    `

    constructor({chatBot, llm, fileManager} : AppConfig) { 
        this.chatBot = chatBot
        this.llm = llm
        this.fileManager = fileManager

        this.toolRegistry.registerTools(
            [
                new Tool({
                    name: "read_file",
                    description: "Baca file",
                    params: { "filePath": "string" },
                    handler: async (params) => { return "" } 
                })
            ]
        )
    }

    execute() { 
        this.chatBot.registerCommand([
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

        console.log(telegramMessage)
        
        while(true) { 
            const llmDecision = await this.runCycle(context)
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
                    content: llmDecision.tool.name
                }
                context = [...context, newContext]
                console.log(`Panggil ${llmDecision.tool?.name} ${llmDecision.tool?.params}`)
            }
        }
    }

    async runCycle(context: Message[]): Promise<Decision | null> { 
        const contextMessage = context.map(message => { 
            return `${message.role}: ${message.content}`
        })

        const prompt: Prompt = { 
            prompt: contextMessage.join("\n"),
            systemMsg: this.systemMessage
        }

        const response = await this.llm.call(prompt)
        const result = this.fileSanitizer.sanitizeCodeResponse(response) ?? response
        console.log(`response ${result}`)
        
        const decision = parseDecision(result)
        console.log(decision)
        return decision 
    }

    async onToolRequest(toolRequest: ToolRequest) { 
        const { name, params } = toolRequest
        const result = await this.toolRegistry.execute(name, params)
        return result
    }
}