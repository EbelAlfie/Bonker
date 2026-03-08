import { Command } from "./Command"

export interface Chat { 
    start(): void

    registerCommand(commands: Command[]): void
}