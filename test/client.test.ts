import { expect, test } from "vitest";
import Wrapdactyl from "../src";
import config from "./config.json";

const ptero = new Wrapdactyl(config);

test("Client requests", async () => {
    /*
    const res = await ptero.client.permissions();
    const res = await ptero.client.account.fetch();
    const res = await ptero.client.account
    .updateEmail({
        email: "love_you_mom@xample.com",
        password: "987654321",
    })
    const res = await ptero.client.account.updatePassword({
        oldPassword: "987654321",
        newPassword: "123456789",
    });
    const res = await ptero.client.account.apiKeys.fetchAll();
    const res = await ptero.client.account.apiKeys.create({
        description: "Hi mom",
    });
    const res = await ptero.client.account.apiKeys.delete("ptlc_Jwer9u39aXK");
    const res = await ptero.client.account.twofa.fetch();
    const res = await ptero.client.account.twofa.enable(164342);
    const res = await ptero.client.account.twofa.disable({password: "123456789"})
    const res = await ptero.client.servers.fetch("f7184f95", ["egg", "subusers"]);
    const res = await ptero.client.servers.fetchAll(0, ["egg", "subusers"]); // 0 means every page
    const res = await ptero.client.servers.websocketDetails("f7184f95");

    await new Promise(async (rep) => {
        const server = new ptero.client.servers.websocket("f7184f95").connect();

        // Alerts when the connection to the websocket has been established
        server.on("connect", () => console.log("Connected to the server"));
        // Alerts when the connection has been authorised
        server.on("authentication", () => console.log("Authenticated"));
        // Alerts when the token couldnt be updated
        server.on("tokenExpired", () => console.log("The Token expired"));
        // Alerts when the connection to the websocket has closed
        server.on("disconnect", () =>
            console.log("Disconnected from the websocket")
        );
        // When a error occours in the websocket
        server.on("error", (data) => console.log("Error: " + data));

        // Server management and information trough the websocket
        // Alerts when the server installation has been completed
        server.on("installCompleted", () =>
            console.log("Installation completed")
        );
        // Alerts when the backup restore has been completed
        server.on("backupRestoreCompleted", () =>
            console.log("Backup restore point completed")
        );
        // Alerts when a back has been made of the server files
        server.on("backupCompleted", () =>
            console.log("Taking backup of the server completed")
        );
        // Alerts when the server has been deleted
        // (resulting in automatically diconnecting you from the websocket)
        server.on("deleted", () => console.log("Server has been deleted. RIP"));

        // Server information
        // Daemon errors that occour in the docker container
        server.on("daemonError", (data) => console.log("daemonError: " + data));
        // Daemon errors that are logged in the console
        server.on("daemonMessage", (x) => console.log(`daemonMessage: ${x}`));
        // Console messages
        server.on("console", (x) => console.log(`Console: ${x}`));
        // Status of the server (online offline etc.)
        server.on("status", (x) => console.log(`status: ${x}`));
        // Stats and usage of the hardware
        server.on("stats", (x) => console.log(x));
        // Transfer information
        server.on("transferLogs", (x) => console.log(`transferLogs: ${x}`));
        // Transfer status when it started or completed
        server.on("transferStatus", (x) => console.log(`transferStatus: ${x}`));

        // Await for connection to the websocket to be established
        await server.awaitConnection();
        console.log("Connected to the websocket (awaited)");
        // Await for the authorisation
        await server.awaitAuth();
        console.log("Authenticated (awaited)");

        // Manage server status
        // Start the server. Await to wait untill the server is running
        await server.start();
        await server.restart();
        // Stop the server. Await to wait untill the server is offline
        await server.stop();
        await server.kill();

        // Request console logs from the server
        // They are going to be logged in the "console" event
        server.request.logs();
        // Request stats from the server
        // They are going to be logged in the "stats" event
        server.request.stats();
    });
    */
});
