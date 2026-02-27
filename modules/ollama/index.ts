import { PromptRequest } from "../../domain/llm/PromptRequest";
import { OllamaAgent, OllamaConfig } from "./OllamaAgent";

async function main() {
    const llmConfig: OllamaConfig = {
        baseUrl: "http://localhost:11434",
        baseModel: "qwen2.5-coder:7b"
    }

    let ollama = new OllamaAgent(llmConfig)
    const req: PromptRequest = {
        prompt: `
        package cinema

fun displaySeats(map: MutableList<MutableList<String>>){
  print("Cinema:\n  ")
    for(index in 0..map.size){
      print("${index + 1} ")
    }
    println()
    for(index in map.indices){
      println("${index+1} ${map[index].joinToString(" ")}")
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
        `,
        systemMsg: "Kamu adalah senior software engineer. Generate unit test untuk kode yang diberikan sesuai bahasa pemrogramannya. Jangan jelaskan apapun, langsung tulis kodenya saja."
    }
    const resp = await ollama.call(req)

    console.log("resp")
    console.log(resp)
}

main()