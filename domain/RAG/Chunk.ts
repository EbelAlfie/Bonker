
export type BaseSyntax = "unknown"

export type CodeChunk<SyntaxType extends string = BaseSyntax> = {
    type: SyntaxType,
    data: string
}