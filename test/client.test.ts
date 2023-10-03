import { expect, test } from "vitest";
import Wrapdactyl from "../src";
import config from "./config.json";

const ptero = new Wrapdactyl(config);

test("Client permissions", async () => {
    const permissions = await ptero.client.permissions();
    console.log(permissions);
    expect(permissions);
});
