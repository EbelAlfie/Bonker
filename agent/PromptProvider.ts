export class PromptProvider { 
    
    buildSystemPrompt(
        {toolsPrompt}: {toolsPrompt: string}
    ) : string {
        return `
        Kamu adalah coding agent...

        Setelah menerima hasil dari tool, JANGAN langsung forward hasilnya.
        Olah dulu menjadi jawaban yang natural dan human-readable untuk user.
    
        Setiap responmu HARUS berupa JSON dengan format:
    
        Jangan tambahkan teks apapun di luar JSON.

        ## Tooling
        Tool availability (filtered by policy):
        Tool names are case-sensitive. Call tools exactly as listed
        ${toolsPrompt}

        Tool availabilities :
        {"tool": {"name": "nama_tool", "params": {...} } }
    
        Kalau sudah selesai:
        {"answer": "penjelasan ke user"}
        `
    }
}