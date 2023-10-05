import WebSocket from "ws";
import { EventEmitter } from "events";
import type { ClientClass } from "../clientClass";
import type { serverWebsocketManagerEvents } from "../types";

declare interface BaseServerWebsocketManager {
    on<U extends keyof serverWebsocketManagerEvents>(
        event: U,
        listener: serverWebsocketManagerEvents[U]
    ): this;

    emit<U extends keyof serverWebsocketManagerEvents>(
        event: U,
        ...args: Parameters<serverWebsocketManagerEvents[U]>
    ): boolean;
}

class BaseServerWebsocketManager extends EventEmitter {
    constructor() {
        super();
    }
}

export interface WSConfiguration {
    origin: string;
    socket: string;
    token: string;
}

export default (
    wdctyl: ClientClass
): new (id: string) => BaseServerWebsocketManager & {
    server_id: string;
    config?: WSConfiguration;
    ws?: WebSocket;
    isConnected: () => boolean;
    updateCredentials: () => Promise<WSConfiguration>;
    auth: () => boolean;
    connect: () => Promise<BaseServerWebsocketManager>;
    disconnect: (code?: number, data?: string | Buffer) => void;
} =>
    class extends BaseServerWebsocketManager {
        constructor(id: string) {
            super();
            if (!id)
                throw new Error("Wrapdactyl - Expected 1 arguments, but got 0");
            this.server_id = id;
            Object.defineProperty(this, "config", { enumerable: false });
        }
        server_id!: string;
        config?: WSConfiguration;
        ws?: WebSocket;

        isConnected = () => !!(this.ws && this.ws.OPEN === WebSocket.OPEN);

        connect = async () => {
            if (this.isConnected())
                throw new Error("Wrapdactyl - Websocket is already connected");

            const config = await this.updateCredentials();
            this.createWebSocket(config);
            this.setupEventHandlers();

            return this;
        };

        disconnect = (code?: number, data?: string | Buffer) => {
            if (this.ws) {
                this.ws.close(code, data);
                this.ws = undefined;
            }
        };

        updateCredentials = () =>
            wdctyl.client.servers
                .websocketDetails(this.server_id)
                .then((wsinfo) => {
                    this.config = {
                        token: wsinfo.data.token,
                        socket: wsinfo.data.socket,
                        origin: wdctyl.options.url,
                    };
                    return this.config;
                });

        auth = (token?: string) => {
            if (token && this.ws) {
                this.ws.send(JSON.stringify({ event: "auth", args: [token] }));
                return true;
            }
            return false;
        };

        private createWebSocket(config: WSConfiguration) {
            this.ws = new WebSocket(config.socket, { origin: config.origin });
        }

        private setupEventHandlers() {
            // Useless if statement...
            if (!this.ws) return;
            this.ws.on("open", () => {
                this.emit("connect");
                const authResult = this.auth(this.config?.token);
                if (!authResult) this.disconnect();
            });
            this.ws.on("error", (error) => {
                this.emit("error", error);
                this.disconnect();
            });
            this.ws.on("message", (data) => {
                const message = JSON.parse(data.toString());

                switch (message.event) {
                    case "auth success":
                        this.emit("authentication");
                        break;
                    case "daemon message":
                        this.emit("daemonMessage", message.args);
                        break;
                    case "install output":
                        this.emit("installMessage", message.args);
                        break;
                    case "install started":
                        this.emit("installStarted");
                        break;
                    case "install completed":
                        this.emit("installCompleted");
                        break;
                    case "console output":
                        const sanitizedArgs = message.args.map((x: string) =>
                            x.replace(
                                /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                                ""
                            )
                        );
                        this.emit("console", sanitizedArgs);
                        break;
                    case "status":
                        this.emit("status", message.args);
                        break;
                    case "stats":
                        const parsedArgs = message.args.map((x: string) =>
                            JSON.parse(x)
                        );
                        this.emit("stats", parsedArgs);
                        break;
                    case "backup restore completed":
                        this.emit("backupRestoreCompleted");
                        break;
                    case "backup completed":
                        this.emit("backupCompleted");
                        break;
                    case "transfer logs":
                        this.emit("transferLogs", message.args);
                        break;
                    case "transfer status":
                        this.emit("transferStatus", message.args);
                        break;
                    case "deleted":
                        this.emit("deleted");
                        break;
                    case "token expiring":
                        this.handleTokenExpiring();
                        break;
                    case "token expired":
                        this.emit("tokenExpired");
                        break;
                    case "daemon error":
                        this.emit("daemonError", message.args);
                        break;
                    case "jwt error":
                        this.emit("error", message.args);
                        break;
                    default:
                        console.log(message); // Testing stage
                        break;
                }
            });
        }

        private handleTokenExpiring() {
            this.updateCredentials()
                .then((wscreds) => {
                    if (wscreds) {
                        this.auth(wscreds.token);
                    }
                })
                .catch(() => {});
        }
    };
