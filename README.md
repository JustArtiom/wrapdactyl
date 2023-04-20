```js
import Wrapdactyl from "../src";
import config from "./config";

const ptero = new Wrapdactyl({
    url: config.url,
    client: config.client,
    application: config.application,
    options: {
        timeout: 7500,
        simplifyErrors: false
    }
})
const server = new ptero.client.servers.websocket("0c08a1c8");

(async () => {
    const data = await server.connect();
    
    server.on("connect", () => console.log("Connected to the server"));
    server.on("authentication", () => console.log("Authenticated and ready ready to communicate with the server"))
    server.on("tokenExpired", () => console.log("Token expired, disconnecting..."))
    server.on("disconnect", () => console.log("Disconnected from the server websocket"))

    // Await until the connection to the websocket has been done
    await data.awaitConnection();
    // Await until being authenticated
    await data.awaitAuth();

    server.power("start");
    server.requestLogs();
    server.requestStats();
    server.sendCommand("ls");

    server.on("installCompleted", () => console.log("Installation completed"))
    server.on("backupRestoreCompleted", () => console.log("Backup restore point completed"))
    server.on("backupCompleted", () => console.log("Taking backup of the server completed"))
    server.on("deleted", () => console.log("Server has been deleted. RIP"))

    server.on("error", (data) => console.log("Error: "+ data));
    server.on("daemonError", (data) => console.log("daemonError: "+ data));
    server.on("daemonMessage", (x) => console.log(`daemonMessage: ${x}`));
    server.on("console", (x) => console.log(`Console: ${x}`));
    server.on("status", (x) => console.log(`status: ${x}`));
    server.on("stats", (x) => console.log(x));
    server.on("transferLogs", (x) => console.log(`transferLogs: ${x}`))
    server.on("transferStatus", (x) => console.log(`transferStatus: ${x}`))
})();
```