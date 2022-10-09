const axios = require('axios');

module.exports = async (config, lastcheck, nodeid, configuration) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!nodeid) throw 'Wrapdactyl - node id must be present'
    if(!configuration || typeof configuration !== 'object') throw 'Wrapdactyl - configuration must be a present object'

    let data = await axios.post(config.url() + '/api/application/nodes/' + nodeid + '/allocations', configuration, {
        timeout: 5000,
        headers: {
            "Authorization": "Bearer "+ config.application(),
            "Content-Type": "application/json"
        }
    }).catch((err) => {
        if(err?.response?.status < 500) return {
            error: true,
            panelError: true,
            status: err.response.status,
            message: err.response.data.errors
        }

        return {
            error: true,
            panelError: false,
            message: err
        }
    })
    if(data.error) return data

    return true
}