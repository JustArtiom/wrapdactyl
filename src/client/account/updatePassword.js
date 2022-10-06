const axios = require('axios');

module.exports = async (config, lastcheck, current_password, new_password) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.panel) throw 'Wrapdactyl - Panel offline'
    if(!lastcheck.client) throw 'Wrapdactyl - client api key not configured or wrong' 

    if(!current_password) throw 'Wrapdactyl - Old password must be present'
    if(!new_password) throw 'Wrapdactyl - New password must be present'

    let data = await axios.put(config.url() + '/api/client/account/password', {
        current_password: current_password,
        password: new_password,
        password_confirmation: new_password
    }, {
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
    return true
}