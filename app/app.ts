import { ChatBot } from "../domain/chat/ChatBot";
import { Git } from "../domain/vcs/Git";

export type Runner = {
    chatBot: ChatBot, 
    git: Git
}

export class App { 
    chatBot: ChatBot
    git: Git

    constructor({chatBot, git} : Runner) { 
        this.chatBot = chatBot
        this.git = git
    }

    start() { 
       this.chatBot.start() 
    }
}