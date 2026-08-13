import { Bot, CommandContext, Context } from "grammy";
import { TeleConfig } from "./Config";
import { ChatBot, MessageCallback } from "../../../domain/tools/chat/ChatBot";
import { Command, ChatMessage } from "../../../domain/tools/chat/Command";

export class TelegramBot implements ChatBot { 
    bot: Bot

    commands: Command[] = []

    onMessage: MessageCallback | undefined 

    constructor(config: TeleConfig) { 
        this.bot = new Bot(config.token)
    }

    start() { 
        this.bot.command("start", this.onStart.bind(this))

        this.bot.api.setMyCommands(
            this.commands.map(value => { 
                return {
                    command: value.name,
                    description: value.description
                }
            })
        )

        this.commands.forEach(value => {
            this.bot.command(value.name, async ctx => this.runCommand(ctx, value))
        })

        this.bot.on("message:text", (ctx: Context) => { 
            let msg = ctx.message
            const message: ChatMessage = {
                command: undefined,
                text: msg?.text,
                reply: async (message: string) => {
                    await ctx.reply(message)
                }
            }

            if (this.onMessage) this.onMessage(message)
        })

        this.bot.start()
    }

    registerCommand(commands: Command[]): void {
        this.commands = commands
    }

    runCommand(ctx: Context, command: Command) { 
        let item = ctx.match

        if (Array.isArray(item)) { item = item[0] }

        const message: ChatMessage = {
            command: command.name,
            text: item,
            reply: async (message: string) => {
                await ctx.reply(message)
            }
        }
        command.handler(message)
    }

    private async onStart(ctx: CommandContext<Context>) { 
        ctx.reply("on start")
    }

    onNewMessage(callback: MessageCallback): void { 
        this.onMessage = callback
    }
}