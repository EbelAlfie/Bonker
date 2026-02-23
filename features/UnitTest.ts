import { Runner } from "../app/app";
import { ChatBot } from "../domain/chat/ChatBot";
import { Message } from "../domain/chat/Command";
import { Feature } from "../domain/Feature";
import { Git } from "../domain/vcs/Git";

export class UnitTest implements Feature { 
    chatBot: ChatBot
    git: Git

    constructor({chatBot, git} : Runner) { 
        this.chatBot = chatBot
        this.git = git
    }

    execute() {
        this.chatBot.registerCommand([
            { name: "test", description: "Create a test", handler: this.generateTest.bind(this)}
        ])

        this.chatBot.start() ///dont start here
    }

    generateTest(message: Message) { 
        
    }
}