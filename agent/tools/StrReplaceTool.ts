import { Tool } from "../../domain/tools/agent/tools";

type StrReplaceParam = {
    path: string
}

const StrReplaceProps = {
    path: {
        "type": "string",
        "description": "The absolute path to the file to modify"
    },
    old_string: {
        "type": "string",
        "description": "The text to replace"
    },
    new_string: {
        "type": "string",
        "description": "The text to replace it with (must be different from old_string)"
    },
    replace_all: {
        "type": "boolean",
        "description": "Replace all occurrences of old_string (default false)"
    }
}

class StrReplaceTool extends Tool<StrReplaceParam, typeof StrReplaceProps> {
    name: string = "StrReplace"
    description: string = `
        Performs exact string replacements in files.\n\nUsage:\n- When editing text, ensure you preserve the exact indentation (tabs/spaces) as it appears before.\n- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.\n- The edit will FAIL if old_string is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use replace_all to change every instance of old_string.\n- Use replace_all for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.\n- Optional parameter: replace_all (boolean, default false) — if true, replaces all occurrences of old_string in the file.\n\nIf you want to create a new file, use the Write tool instead.
    `
    parameters = {
        type: "object",
        properties: { StrReplaceProps },
        required: [
            "query",
            "old_string",
            "new_string"
        ]
    }

    constructor(enabled: boolean) { 
        super(enabled)
    }

    parseParams(anyParam: Record<string, unknown>): StrReplaceParam | undefined {
        throw new Error("Method not implemented.");
    }
    run(params: StrReplaceParam): Promise<string> {
        throw new Error("Method not implemented.");
    } 

}