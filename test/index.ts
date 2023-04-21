import Wrapdactyl from "../src";
import config from "./config";
import { setTimeout } from "node:timers/promises";
const ptero = new Wrapdactyl({
    url: config.url,
    client: config.client,
    application: config.application,
    options: {
        timeout: 7500,
    }
})

ptero.client.account.fetchAllActivities().then(d => console.log(d.data.map(x => x.attributes))).catch(err => console.log(err.response.data))


/*
const server = ptero.client.servers.websocket("0fc78e08");

(async () => {
    let data = await server.connect().catch(err => console.log(err.response.data));
 
    server.on("connect", () => console.log("Connected to the server"));
    server.on("authentication", () => console.log("Authenticated and ready ready to communicate with the server"))
    server.on("tokenExpired", () => console.log("Token expired, disconnecting..."))
    server.on("disconnect", async () => {
        console.log("Disconnected from the server websocket")
        await setTimeout(10000)
        data = await server.connect();
    })

    // Await until the connection to the websocket has been done
    // await data.awaitConnection();
    // Await until being authenticated
    // await data.awaitAuth();

    // server.power("start");
    // server.requestLogs();
    // server.requestStats();
    // server.sendCommand("ls");

    server.on("installCompleted", () => console.log("Installation completed"))
    server.on("backupRestoreCompleted", () => console.log("Backup restore point completed"))
    server.on("backupCompleted", () => console.log("Taking backup of the server completed"))
    server.on("deleted", () => console.log("Server has been deleted. RIP"))

    server.on("error", (data) => console.log("Error: "+ data));
    server.on("daemonError", (data) => console.log("daemonError: "+ data));
    server.on("daemonMessage", (x) => console.log(`daemonMessage: ${x}`));
    server.on("console", (x) => console.log(`Console: ${x}`));
    server.on("status", (x) => console.log(`status: ${x}`));
    // server.on("stats", (x) => console.log(x));
    server.on("transferLogs", (x) => console.log(`transferLogs: ${x}`))
    server.on("transferStatus", (x) => console.log(`transferStatus: ${x}`))
})();
*/