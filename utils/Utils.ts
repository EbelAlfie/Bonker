import { Decision } from "../domain/agent/types"

export function parseDecision(response: string): Decision | null {
    try {
        const jsonRes = JSON.parse(sanitizeJson(response))
        return {
            tool: jsonRes?.tool,
            answer: jsonRes?.answer
        }

    } catch(error) { 
        console.log(error)
        return null
    }
}

export function sanitizeCodeResponse(response: string): string | null { 
    const regex = new RegExp(/```(?:[a-zA-Z]+)?\n?([\s\S]*?)```/) 
    const matching = response.match(regex)
    return (matching && matching[1] ? matching[1] : response).trim()
}

export function sanitizeJson(raw: string): string {
    const opens = (raw.match(/{/g) ?? []).length
    const closes = (raw.match(/}/g) ?? []).length
    const missing = opens - closes
    return raw + "}".repeat(missing)
}