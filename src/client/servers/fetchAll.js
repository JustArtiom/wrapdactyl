const axios = require('axios');

module.exports = async (config, lastcheck) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(lastcheck.client === null) throw 'Wrapdactyl - Client api key not configured'

    let data = await axios.get(config.url() + '/api/client', {
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
    if(data.data.meta.pagination.total === 1) return data.data.data

    let servers = data.data.data

    for(let page = 2; page <= data.data.meta.pagination.total_pages; page++){
        await axios.get(config.url() + '/api/client?page='+page, {
            timeout: 5000, 
            headers: { 
                "Authorization": "Bearer "+ config.client(),
                "Content-Type": "application/json"
            }
        }).then(data => servers = servers.concat(data.data.data)).catch((err) => {
            if(err?.response?.status < 500) return servers = {
                error: true,
                panelError: true,
                status: err.response.status,
                message: err.response.data.errors
            }
    
            return servers = {
                error: true,
                panelError: false,
                message: err
            }
        })
    }

    return servers
}