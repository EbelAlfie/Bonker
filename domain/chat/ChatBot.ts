import { Command } from "./Command"

export interface ChatBot { 
    start(): void

    registerCommand(commands: Command[]): void

    executeCommand(command: Command): void
}