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
    */

    await new Promise(async (rep) => {
        const server = new ptero.client.servers.websocket("f7184f95");

        server.connect();

        server.on("connect", () => {
            console.log("connected");
            rep("yes");
        });

        server.on("authentication", () => {});
    });

    expect(true);
});
