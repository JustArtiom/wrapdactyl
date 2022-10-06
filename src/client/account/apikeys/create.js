const axios =  require('axios')

module.exports = async (config, lastcheck, description, allowed_ips) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.panel) throw 'Wrapdactyl - Panel offline'
    if(!lastcheck.client) throw 'Wrapdactyl - client api key not configured or wrong'

    if(!description) throw 'Wrapdactyl - Description must be present'
    if(!allowed_ips?.length) allowed_ips = []

    let data = await axios.post(config.url() + '/api/client/account/api-keys', {
        description: description,
        allowed_ips: allowed_ips
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