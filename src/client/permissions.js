const axios = require('axios');

module.exports = async (config, lastcheck) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.client) throw 'Wrapdactyl - client api key not configured or wrong' 

    let data = await axios.get(config.url() + '/api/client/permissions', {
        timeout: 5000, 
        headers: {
            "Authorization": "Bearer "+ config.client(),
            "Content-Type": "application/json"
        }
    }).catch((err) => {
        return {
            error: true,
            status: err.response.status,
            messages: err.response.data.errors
        }
    })
    if(data.error) return data
    
    return data.data.attributes.permissions
}