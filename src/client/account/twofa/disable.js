const axios = require('axios');

module.exports = async (config, lastcheck, password) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'

    if(!password || typeof password !== 'string') throw "Wrapdactyl - Password must be valid"

    let data = await axios.delete(config.url() + '/api/client/account/two-factor',{
        timeout: 5000,
        headers: {
            "Authorization": "Bearer "+ config.client(),
            "Content-Type": "application/json"
        },
        data: {
            password: password
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