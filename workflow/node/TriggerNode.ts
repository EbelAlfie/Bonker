import { Bot, CommandContext, Context } from "grammy"
import { Command, Message } from "../../domain/chat/Command"
import { TeleConfig } from "../../modules/chat/Config"

export interface TriggerNode { 
    run(): void
}

export class TelegramNode implements TriggerNode { 
    bot: Bot

    commands: Command[] = []

    constructor(config: TeleConfig) { 
        this.bot = new Bot(config.token)
    }

    run() { 
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

        this.bot.on("message:text", this.onMessage.bind(this))

        this.bot.start()
    }

    registerCommand(commands: Command[]): void {
        this.commands = commands
    }

    runCommand(ctx: Context, command: Command) { 
        const item = ctx.match
        const message: Message = {
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

    private async onMessage(ctx: Context) { 
        const message = ctx.message
        ctx.reply("on message")
    }
}