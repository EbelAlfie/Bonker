import { CodeChunk } from "../../domain/RAG/Chunk"
import { getRepoName } from "../github/Utils"
import { embed } from "../ollama"
import { Chroma } from "./Chroma"
import { KotlinChunker } from "./KotlinChunker"

const dummy = `
package cinema

fun displaySeats(map: MutableList<MutableList<String>>){
  print("Cinema:\n  ")
    for(index in 0..map.size){
      print("asdads ")
    }
    println()
    for(index in map.indices){
      println("addsasdsd")
    }
}

fun buyTicket(map : MutableList<MutableList<String>>, seats: Int): Int{
    try {
      var choosenRow: Int 
      var choosenCol: Int
      do {
        println("Enter a row number:")
        choosenRow = readln().toInt()
        println("Enter a seat number in that row:")
        choosenCol = readln().toInt()
        if(map[choosenRow-1][choosenCol-1] == "B") println("That ticket has already been purchased!")
      } while(map[choosenRow-1][choosenCol-1] == "B")
      
      map[choosenRow-1][choosenCol-1] = "B"
      val price = if(seats <= 60) 10 else if(choosenRow in 1..map.size/2) 10 else 8
      println("Ticket price: \$$price")
      return price
    }catch (e: Exception){
      println("Wrong input!")
      return 0
    }
    return 0
}

fun showStatistics(custTotal: Int, percentage: Double, totalPurchased: Int, totalIncome: Int) {
  val formatedPercent = "%.2f".format(percentage)
  println("Number of purchased tickets: $custTotal")
  println("Percentage: $formatedPercent%")
  println("Current income: \$$totalPurchased")
  println("Total income: \$$totalIncome")
}

fun main() {
    // write your code here
    var totalPurchasedTicket = 0
    var custTotal =0
    
    print("Enter the number of rows:")
    val row = readln().toInt()
    print("Enter the number of seats in each row:")
    val col = readln().toInt()
    val seats = row * col
    val map = MutableList(row){MutableList(col){"S"}}
    var choice: Int
    do {
      println("1. Show the seats")
      println("2. Buy a ticket")
      println("3. Statistics")
      println("0. Exit")
      choice = readln().toInt()
      when (choice) {
        1 -> displaySeats(map)
        2 -> {
          totalPurchasedTicket += buyTicket(map, seats)
          custTotal++
         } 
        3 -> {
          var totalIncome = 1
          totalIncome = if(seats > 60) ((row/2) * (seats/row) * 10) + (((row/2)+ row%2) * (seats/row) * 8) else 10 * seats
          var percentage = (custTotal.toDouble() / seats) * 100.0
          showStatistics(custTotal, percentage, totalPurchasedTicket, totalIncome)
          }
        0 -> break 
        else -> "Wrong input"
      }
    } while (choice != 0)
}
`

export async function main(input: string = dummy): Promise<CodeChunk[]> { 
    const chunker = new KotlinChunker()
    await chunker.init()
    const chunks = await chunker.parse(input)

    chunks.forEach(async chunk => {
      const result = await embed(chunk)

      console.log(result)  
      console.log("storing")  

      const chromaDb = new Chroma()
      await chromaDb.init()
      await chromaDb.insert(result)
    })

    return chunks
}

export async function query(input: string = "ViewModel that handle gas station") { 
    const chunker = new KotlinChunker()
    await chunker.init()
    const chunks = await chunker.parse(input)

    const embedding = await embed(chunks[0])

    const chromaDb = new Chroma()
    const name = getRepoName()
    await chromaDb.init(name)
    
    const result = await chromaDb.query(embedding)
}

query()

export async function deleteAll() { 
  const chromaDb = new Chroma()
  const name = getRepoName()
  await chromaDb.init(name)
  await chromaDb.drop(name)
}