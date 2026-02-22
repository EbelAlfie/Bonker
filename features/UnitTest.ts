import { Runner } from "../app/app";
import { ChatBot } from "../domain/chat/ChatBot";
import { Feature } from "../domain/Feature";
import { Git } from "../domain/vcs/Git";

export class UnitTest implements Feature { 
    chatBot: ChatBot
    git: Git

    constructor({chatBot, git} : Runner) { 
        this.chatBot = chatBot
        this.git = git

        this.initFeature()
    }

    initFeature() { 
        this.chatBot.registerCommand([
            { name: "test", description: "Create a test"}
        ])

        this.chatBot.start()
    }

    execute() {
        
    }
}