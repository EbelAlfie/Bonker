import { Decision } from "../../domain/agent/types"

export function parseDecision(response: string): Decision | null {
    try {
        const jsonRes = JSON.parse(response)
        return {
            tool: jsonRes?.tool,
            answer: jsonRes?.answer
        }

    } catch(error) { 
        return null
    }
}