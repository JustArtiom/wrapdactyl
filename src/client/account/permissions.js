const axios = require('axios');

module.exports = async (config, lastcheck) => {
    if(!lastcheck) throw new Error('Wrapdactyl - Wrapdactyl is not ready')
    if(!lastcheck.client) throw new Error('Wrapdactyl - client api key not configured or wrong') 

    let data = await axios.get(config.url() + '/api/client/permissions', {
        timeout: 5000, 
        headers: {
            "Authorization": "Bearer "+ config.client(),
            "Content-Type": "application/json"
        }
    }).catch((err) => {
        return err.response
    })

    return data.data.attributes.permissions
}