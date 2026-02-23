export interface AIAgent { 
    callLLM(prompt: string): string
}