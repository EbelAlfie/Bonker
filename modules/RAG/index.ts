import { BaseSyntax, CodeChunk } from "../../domain/RAG/Chunk"
import { embed } from "../ollama"
import { Chroma } from "./Chroma"
import { KotlinChunker } from "./KotlinChunker"

const dummy = `
package cinema

fun displaySeats(map: MutableList<MutableList<String>>){
  print("Cinema:\n  ")
    for(index in 0..map.size){
      print("adadsad")
    }
    println()
    for(index in map.indices){
      println("asdasdasd")
    }
}
`

export async function main(input: string = dummy): Promise<CodeChunk<string>[]> { 
    const chunker = new KotlinChunker()
    await chunker.init()
    const chunks = await chunker.parse(input)

    // chunks.forEach(async chunk => { 
    //     const result = await embed(chunk.data)

    //     console.log(result)  
    // })

    const chromaDb = new Chroma()
    await chromaDb.connect()

    return chunks
}

main()