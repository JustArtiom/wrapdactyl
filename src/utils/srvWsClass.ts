import WebSocket from "ws";
import { EventEmitter } from "events";
import type { ClientClass } from "../clientClass";
// import type { serverWebsocketManagerEvents } from "../types";

type serverWebsocketManagerEvents = {
    example: (param: string) => any;
}

declare interface BaseServerWebsocketManager {
    on<U extends keyof serverWebsocketManagerEvents>(
      event: U, listener: serverWebsocketManagerEvents[U]
    ): this;
  
    emit<U extends keyof serverWebsocketManagerEvents>(
      event: U, ...args: Parameters<serverWebsocketManagerEvents[U]>
    ): boolean;
}
  
class BaseServerWebsocketManager extends EventEmitter {
    constructor() {
        super()
    }
}

export default (pass: any) => class extends BaseServerWebsocketManager {
    constructor(identifier: string) {
        super();
        console.log(pass)
    }

/*
Default export of the module has or is using private name 'StaticEventEmitterOptions'.ts(4082)
Default export of the module has or is using private name '_DOMEventTarget'.ts(4082)
Default export of the module has or is using private name '_NodeEventTarget'.ts(4082)
*/
