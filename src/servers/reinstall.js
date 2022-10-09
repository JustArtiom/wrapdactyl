const axios = require('axios');

module.exports = async (config, lastcheck, serverid) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(lastcheck.application === null) throw 'Wrapdactyl - Application api key not configured'

    if(!serverid) throw 'Wrapdactyl - server id must be present'

    let data = await axios.post(config.url() + '/api/application/servers/' + serverid + '/reinstall', {}, {
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