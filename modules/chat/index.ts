import 'dotenv/config'
import { TelegramBot } from "./Telegram";
import { TeleConfig } from "./Config";
import { Config } from "../../config/config";

function main() { 
    const config: TeleConfig = {
        token: Config.TELEGRAM_TOKEN 
    }
    const teleg = new TelegramBot(config)

    teleg.start()
}

main()