const axios = require('axios');

module.exports = async (config, lastcheck, nestid, options) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(lastcheck.application === null) throw 'Wrapdactyl - Application api key not configured'

    if(!nestid) throw 'Wrapdactyl - The id of the nest must be present'

    let optionsarr = []
    if(options){
        if(options.eggs) optionsarr.push('eggs')
        if(options.servers) optionsarr.push('servers')
    }

    let data = await axios.get(config.url() + '/api/application/nests/' + nestid + `${optionsarr.length ? `?include=${optionsarr.join(',')}` : ''}`, {
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

    return data.data.attributes
}