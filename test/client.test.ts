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
        email: "example@xample.com",
        password: "987654321",
    })
    .catch((e) => console.log(e.response));
    const res = await ptero.client.account.updatePassword({
        oldPassword: "987654321",
        newPassword: "123456789",
    });
    const res = await ptero.client.account.apiKeys.fetchAll();
    const res = await ptero.client.account.apiKeys.create({
        description: "Hello world",
    });
    const res = await ptero.client.account.apiKeys.delete("ptlc_Jwer9u39aXK");
    const res = await ptero.client.account.twofa.fetch();
    const res = await ptero.client.account.twofa.enable(164342);
    const res = await ptero.client.account.twofa.disable({password: "123456789"})
    */
    const res = await ptero.client.servers.fetch("f7184f95", [
        "egg",
        "subusers",
    ]);
    console.log(res.attributes.relationships);
    expect(res);
});
