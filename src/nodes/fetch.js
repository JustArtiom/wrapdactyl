const axios = require('axios');

module.exports = async (config, lastcheck, id, options) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.panel) throw 'Wrapdactyl - Panel offline'
    if(!lastcheck.application) throw 'Wrapdactyl - Application api key not configured or wrong'

    if(!id) throw 'Wrapdactyl - The id of the node must be present'

    let optionsarr = []
    if(options){
        if(options.allocations) optionsarr.push('allocations')
        if(options.location) optionsarr.push('location')
        if(options.servers) optionsarr.push('servers')
    }

    let data = await axios.get(config.url() + '/api/application/nodes/' + id + `${optionsarr.length ? `?include=${optionsarr.join(',')}` : ''}`, {
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