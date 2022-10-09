const axios = require('axios');

module.exports = async (config, lastcheck, id) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    
    if(!id) throw 'Wrapdactyl - id of the node must be present'

    let data = await axios.delete(config.url() + '/api/application/nodes/' + id, {
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