export class FileSanitizer { 
    sanitizeCodeResponse(response: string): string | null { 
        const regex = new RegExp(/```(?:[a-zA-Z]+)?\n?([\s\S]*?)```/) 
        const matching = response.match(regex)
        console.log(matching)
        return matching && matching[1]
            ? matching[1].trim()
            : response.trim()
    }
}