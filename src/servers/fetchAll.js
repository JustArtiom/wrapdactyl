const axios = require('axios')

module.exports = async (config, lastcheck) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(lastcheck.application === null) throw 'Wrapdactyl - Application api key not configured'

    let arrayservers = [];
    
    let pagination = await axios.get(config.url() + '/api/application/servers', {
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

    if(pagination.error) return pagination
    pagination = pagination.data.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        await axios.get(config.url() + '/api/application/servers?page=' + page, {
            timeout: 5000, 
            headers: {
                "Authorization": "Bearer "+ config.application(),
                "Content-Type": "application/json"
            }
        }).then(d => arrayservers = arrayservers.concat(d.data.data)).catch((err) => {
            if(err?.response?.status < 500) return arrayservers = {
                error: true,
                panelError: true,
                status: err.response.status,
                message: err.response.data.errors
            }
    
            return arrayservers = {
                error: true,
                panelError: false,
                message: err
            }
        })
    }

    return arrayservers
}