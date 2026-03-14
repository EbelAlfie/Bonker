import { AppConfig } from "../app/app";
import { LLM } from "../domain/llm/LLM";
import { Prompt } from "../domain/llm/Prompt";
import { Decision, Message, ToolRequest } from "../domain/agent/types";
import { parseDecision, sanitizeCodeResponse } from "../utils/Utils";
import { Workspace } from "../domain/file/Workspace";
import { ToolRegistry } from "../agent/ToolRegistry";
import { ReadFileTool } from "../agent/tools/ReadFileTool";
import { ChatMessage } from "../domain/chat/Command";
import { Chat } from "../domain/chat/Chat";
import { Workflow } from "../domain/workflow/Workflow";
import { PromptProvider } from "../agent/PromptProvider";
import { CurrentTimeTool } from "../agent/tools/CurrentTimeTool";
import { SearchCodeTool } from "../agent/tools/SearchCodeTool";
import { VectorDb } from "../domain/RAG/VectorDb";

export class AgentWorkflow implements Workflow { 
    chat: Chat
    llm: LLM
    fileManager: Workspace
    vectorDb: VectorDb

    promptProvider: PromptProvider = new PromptProvider()

    toolRegistry: ToolRegistry = new ToolRegistry()

    constructor({chat, llm, fileManager, vectorDb} : AppConfig) { 
        this.chat = chat
        this.llm = llm
        this.fileManager = fileManager
        this.vectorDb = vectorDb

        this.toolRegistry.registerTools(
            [
                new ReadFileTool(fileManager),
                new CurrentTimeTool(),
                new SearchCodeTool({
                    llm: llm,
                    vectorDb: vectorDb
                })
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
            let llmDecision: Decision | null

            try { 
                llmDecision = await this.callLlm(context)
            } catch(error) { 
                console.log(error)
                continue
            }

            if (llmDecision === null) {
                telegramMessage.reply("Decision is null")
                return 
            }

            if (llmDecision.answer) { 
                console.log(`Answer ${llmDecision.answer}`)
                telegramMessage.reply(llmDecision.answer)
                return
            }

            if (llmDecision.tool) { 
                console.log(`Call tool ${llmDecision.tool?.name} ${llmDecision.tool?.params}`)
                const result = await this.onToolRequest(llmDecision.tool)

                const newContext: Message = {
                    role: "tool",
                    content: result
                }
                context = [...context, newContext]
            }
        }
    }

    async callLlm(context: Message[]): Promise<Decision | null> { 
        const contextMessage = context.map(message => { 
            return `${message.role}: ${message.content}`
        })

        const prompt: Prompt = { 
            prompt: contextMessage.join("\n"),
            systemMsg: this.promptProvider.buildSystemPrompt({ 
                toolsPrompt: this.toolRegistry.getPrompt()
            })
        }

        console.log(`Prompt: ${prompt}`)

        const response = await this.llm.call(prompt)
        const result = sanitizeCodeResponse(response) ?? response
        console.log(`response ${result}`)
        
        const decision = parseDecision(result)
        return decision 
    }

    async onToolRequest(toolRequest: ToolRequest) : Promise<string> { 
        const { name, params } = toolRequest
        const result = await this.toolRegistry.execute(name, params)
        return result
    }
}