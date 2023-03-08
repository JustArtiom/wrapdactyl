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

ptero.request('/api/clientt', { simplifyError: true }).then(d => {
    console.log(d)
}).catch(d => {
    console.error(d)
})