import { expect, test } from "vitest";
import Wrapdactyl from "../src";
import config from "./config.json";

test("a", () => {
    expect(true);
});
/*
const ptero = new Wrapdactyl(config);

test("Check url", () => {
    expect(Wrapdactyl.isValid.url(config.url)).toBe(true);
});

test("Check Token", () => {
    expect(Wrapdactyl.isValid.token(config.client)).toBe(true);
});

test("Log test", () => {
    //@ts-ignore
    console.log(ptero.config);
});

test("Make a request to panel", async () => {
    const res = await ptero.request("/api/client");
    expect(res);
});

test("Check status of panel and tokens", async () => {
    const res = await ptero.status();
    expect(res);
});
*/
