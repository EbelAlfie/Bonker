import { TriggerNode } from "./node/TriggerNode"

export class MainWorkFlow { 

    triggerNode: TriggerNode

    start() { 
        this.chatBot.registerCommand([
            { name: "test", description: "Create a test", handler: this.generateTest.bind(this)}
        ])
    }
}