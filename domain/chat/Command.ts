export type Command = {
    name: string,
    description: string,
    handler: (...args: any[]) => void
}

export type ChatMessage = {
    command: string,
    text: string | undefined,
    reply: (message: string) => Promise<void>
}