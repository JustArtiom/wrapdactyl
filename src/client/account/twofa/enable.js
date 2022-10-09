const axios = require('axios');

module.exports = async (config, lastcheck, password, code) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'

    if(!password || typeof password !== 'string') throw "Wrapdactyl - Password must be valid"

    if(!code) throw 'Wrapdactyl - Validation Code must be present'
    if(typeof code === 'number') code = code.toString()
    if(typeof code !== 'string') throw 'Wrapdactyl - Validation Code must be a string'


    let data = await axios.post(config.url() + '/api/client/account/two-factor', {
        password: password,
        code: code
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

    return data.data
}