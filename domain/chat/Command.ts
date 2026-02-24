export type Command = {
    name: string,
    description: string,
    handler: (...args: any[]) => void
}

export type Message = {
    command: string,
    text: string | RegExpMatchArray | undefined,
    reply: (message: string) => Promise<void>
}