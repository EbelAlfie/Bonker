import { FileManager } from "./FileManager";

export async function main() { 
    const fileManager = new FileManager("/Users/gli-davis/Documents/Bonker/modules/file/tmp/tmp1")
    fileManager.getAllFiles()
}

main()