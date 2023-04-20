import axios from "axios";
import Wrapdactyl from "..";
import { Check } from "../types";
export default async (that: Wrapdactyl) => {
    let schema: Check = {
        ping: Date.now(),
        panel: undefined,
        client: undefined,
        application: undefined,
        timestamp: Date.now(),
    };

    await axios.get(that.config.url + "/api/client").then(() => {
        schema.ping = 0
    }).catch((err) => {
        err = err.toJSON()
        if(err.status === 401) {
            schema.panel = true
            schema.ping = Date.now() - schema.ping
        } else schema.ping = 0
    })

    if(schema.panel !== undefined) await Promise.all([
        that.config.client ? that.request('/api/client/account').then(data => {
            schema.client = true
        }).catch(() => {
            schema.client = false
        }) : null,
        that.config.application ? that.request('/api/application/locations').then(() => {
            schema.application = true
        }).catch(() => {
            schema.application = false
        }) : null
    ])

    return schema
}