const axios = require('axios')

module.exports = async (config) => {
    let schema = {
        ping: Date.now(),
        panel: false,
        client: false,
        application: false,
        timestamp: Date.now()
    };

    await Promise.all([
        // Check panel status
        axios.get(config.url() + '/api/client', { 
            timeout: 5000 
        }).then(() => {
            schema.ping = Date.now() - schema.ping;
            schema.panel = null;
        }).catch((err) => {
            schema.ping = Date.now() - schema.ping
            if(err?.response?.status === 401){
                schema.panel = true
            } else {
                schema.panel = null
            } 
        }),

        // Check client token
        config.client() ? axios.get(config.url() + '/api/client', {
            timeout: 5000, 
            headers: {
                "Authorization": "Bearer "+ config.client(),
                "Content-Type": "application/json"
            }
        }).then(() => schema.client = true ).catch(() => {}) : schema.client = null,

        // Check application token
        config.application() ? axios.get(config.url() + '/api/application/users', {
            timeout: 5000,
            headers: {
                "Authorization": "Bearer "+ config.application(),
                "Content-Type": "application/json"
            }
        }).then(() => schema.application = true).catch(() => {}) : schema.application = null 
    ]);
    schema.timestamp = Date.now();

    return schema
}