const axios = require('axios');

module.exports = async (config, lastcheck) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(lastcheck.client === null) throw 'Wrapdactyl - Client api key not configured'

    let data = await axios.get(config.url() + '/api/client/permissions', {
        timeout: 5000, 
        headers: {
            "Authorization": "Bearer "+ config.client(),
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
    
    return data.data.attributes.permissions
}