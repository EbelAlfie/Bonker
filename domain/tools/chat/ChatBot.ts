import { ChatMessage, Command } from "./Command"

export type MessageCallback = (msg: ChatMessage) => Promise<void>
export interface ChatBot { 
    start(): void

    registerCommand(commands: Command[]): void

    onNewMessage(callback: MessageCallback): void
}