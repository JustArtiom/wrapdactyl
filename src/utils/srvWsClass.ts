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

type ExtendedServerWebsocketManager = BaseServerWebsocketManager & {
    server_id: string;
    config?: WSConfiguration;
    authed: boolean;
    status: string;
    ws?: WebSocket;

    isConnected: () => boolean;
    isAuthed: () => boolean;

    connect: () => ExtendedServerWebsocketManager;
    disconnect: (code?: number, data?: string | Buffer) => void;

    awaitConnection: () => Promise<void>;
    awaitAuth: () => Promise<void>;

    start: () => Promise<void>;
    restart: () => Promise<void>;
    stop: () => Promise<void>;
    kill: () => Promise<void>;

    request: {
        logs: () => void;
        stats: () => void;
    };

    cmd: (s: string) => void;
};

export default (
    wdctyl: ClientClass
): new (id: string) => ExtendedServerWebsocketManager =>
    class ServerWebsocketManager extends BaseServerWebsocketManager {
        constructor(id: string) {
            super();
            if (!id)
                throw new Error("Wrapdactyl - Expected 1 arguments, but got 0");
            this.server_id = id;
            Object.defineProperty(this, "config", { enumerable: false });
        }
        server_id!: string;
        config?: WSConfiguration;
        status: string = "offline";
        authed: boolean = false;
        ws?: WebSocket;

        /** Check if youre connected to the server */
        isConnected = () => !!(this.ws && this.ws.OPEN === WebSocket.OPEN);
        /** Check if youre authenticated  */
        isAuthed = () => !!(this.ws && this.authed);

        /** Connect to the server */
        connect = () => {
            if (this.isConnected())
                throw new Error("Wrapdactyl - Websocket is already connected");

            this.updateCredentials().then((config) => {
                this.createWebSocket(config);
                this.setupEventHandlers();
            });

            return this;
        };

        /** Disconnect from the server */
        disconnect = (code?: number, data?: string | Buffer) => {
            if (this.ws) {
                this.authed = false;
                this.ws.close(code, data);
                this.ws = undefined;
            }
        };

        /** Await until connected to the server */
        awaitConnection = () =>
            new Promise<void>((resolve, _) => {
                if (this.isConnected()) return resolve();
                this.on("connect", () => resolve());
            });
        /** Await until authenticated*/
        awaitAuth = () =>
            new Promise<void>((resolve, _) => {
                if (this.isAuthed()) return resolve();
                this.ws?.on("message", async (data) => {
                    let message = JSON.parse(data.toString());
                    if (message.event === "auth success") {
                        resolve();
                    }
                });
            });

        /** Power on the server */
        start = () =>
            new Promise<void>((resolve, reject) => {
                if (!this.ws || !this.isConnected() || !this.isAuthed())
                    return reject("Wrapdactyl - Server is not authorised");

                const target_status = "running";
                if (this.status === target_status) resolve();
                this.on("status", (i) => {
                    if (i === target_status) resolve();
                });

                this.ws.send(
                    JSON.stringify({ event: "set state", args: ["start"] })
                );
            });

        /** Restart the server */
        restart = () =>
            new Promise<void>((resolve, reject) => {
                if (!this.ws || !this.isConnected() || !this.isAuthed())
                    return reject("Wrapdactyl - Server is not authorised");

                const target_status = "running";
                if (this.status === target_status) resolve();
                this.on("status", (i) => {
                    if (i === target_status) resolve();
                });

                this.ws.send(
                    JSON.stringify({ event: "set state", args: ["start"] })
                );
            });

        /** Power off the server */
        stop = () =>
            new Promise<void>((resolve, reject) => {
                if (!this.ws || !this.isConnected() || !this.isAuthed())
                    return reject("Wrapdactyl - Server is not authorised");
                const target_status = "offline";
                if (this.status === target_status) resolve();
                this.on("status", (i) => {
                    if (i === target_status) resolve();
                });

                this.ws.send(
                    JSON.stringify({ event: "set state", args: ["stop"] })
                );
            });

        /** Kill the server */
        kill = () =>
            new Promise<void>((resolve, reject) => {
                if (!this.ws || !this.isConnected() || !this.isAuthed())
                    return reject("Wrapdactyl - Server is not authorised");
                const target_status = "offline";
                if (this.status === target_status) resolve();
                this.on("status", (i) => {
                    if (i === target_status) resolve();
                });

                this.ws.send(
                    JSON.stringify({ event: "set state", args: ["kill"] })
                );
            });

        request = {
            /** Request previous console data */
            logs: () => {
                if (!this.ws || !this.isConnected() || !this.isAuthed())
                    throw new Error("Wrapdactyl - Server is not authorised");
                this.ws.send(
                    JSON.stringify({ event: "send logs", args: [null] })
                );
            },
            /** Request hardware stats from the server */
            stats: () => {
                if (!this.ws || !this.isConnected() || !this.isAuthed())
                    throw new Error("Wrapdactyl - Server is not authorised");
                this.ws.send(
                    JSON.stringify({ event: "send stats", args: [null] })
                );
            },
        };

        /** Send a command to the server trough console */
        cmd = (s: string) => {
            if (!this.ws || !this.isConnected() || !this.isAuthed())
                throw new Error("Wrapdactyl - Server is not authorised");
            this.ws.send(JSON.stringify({ event: "send command", args: [s] }));
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
                        this.authed = true;
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
                        this.status = message.args[0];
                        this.emit("status", message.args[0]);
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
                        this.disconnect();
                        break;
                    case "daemon error":
                        this.emit("daemonError", message.args);
                        break;
                    case "jwt error":
                        this.emit("error", message.args);
                        break;
                    default:
                        console.log("Wrapdactyl - Unhandled Message Event:");
                        console.log(message); // Testing stage
                        break;
                }
            });
        }

        private updateCredentials = () =>
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

        private auth = (token?: string) => {
            if (token && this.ws) {
                this.ws.send(JSON.stringify({ event: "auth", args: [token] }));
                return true;
            }
            return false;
        };

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
