import { Bot, CommandContext, Context } from "grammy";
import { TeleConfig } from "./Config";

export class TelegramBot implements ChatBot { 
    bot: Bot

    constructor(config: TeleConfig) { 
        this.bot = new Bot(config.token)
    }

    start() { 
        this.bot.command("start", this.onStart);
        this.bot.on("message", this.onMessage);

        this.bot.start()
    }

    private async onStart(ctx: CommandContext<Context>) { 

    }

    private async onMessage(ctx: Context) { 
        const message = ctx.message
    }
}