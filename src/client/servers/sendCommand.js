const axios = require('axios');

module.exports = async (config, lastcheck, uuid, command) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'

    if(!uuid) throw 'Wrapdactyl - The uuid of the server must be provided'
    if(uuid.split('-').length > 1) uuid = uuid.split('-')[0]

    if(!command || typeof command !== 'string') throw 'Wrapdactyl - Command must be a present string'
    if(!command.length) throw 'Wrapdactyl - Command must not be an empty string'

    let data = await axios.post(config.url() + '/api/client/servers/'+uuid+'/command',{
        command: command
    }, {
        timeout: 5000,
        headers: {
            "Authorization": "Bearer "+ config.client(),
            "Content-Type": "application/json"
        }
    }).catch((err) => {
        if(err?.response?.status === 502) return {
            error: true,
            panelError: true,
            status: err.response.status,
            message: 'Server offline'
        }

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