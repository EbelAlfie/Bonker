export type Message = { 
    role: "user"| "system" | "tool" | "assistant",
    content: string
}

export type Decision = {
    tool?: ToolRequest
    answer?: string
}

export type ToolRequest = {
    name: string
    params: Record<string, unknown>
}