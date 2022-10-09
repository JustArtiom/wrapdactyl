const axios = require('axios');

module.exports = async (config, lastcheck, id, options) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(lastcheck.application === null) throw 'Wrapdactyl - Application api key not configured'
    
    if(!id) throw 'Wrapdactyl - The id of the server must be provided'

    let optionsarr = []
    if(options){
        if(options.allocations) optionsarr.push('allocations')
        if(options.user) optionsarr.push('user')
        if(options.subusers) optionsarr.push('subusers')
        if(options.pack) optionsarr.push('pack')
        if(options.nest) optionsarr.push('nest')
        if(options.egg) optionsarr.push('egg')
        if(options.variables) optionsarr.push('variables')
        if(options.location) optionsarr.push('location')
        if(options.node) optionsarr.push('node')
        if(options.databases) optionsarr.push('databases')
    }

    let data = await axios.get(config.url() + '/api/application/servers/' + id + `${optionsarr.length !== 0 ? `?include=${optionsarr.join(',')}` : ''}`, {
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

    return data.data
}