const axios = require('axios')

module.exports = async (config, lastcheck, options) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.panel) throw 'Wrapdactyl - Panel offline'
    if(!lastcheck.application) throw 'Wrapdactyl - Application api key not configured or wrong' 

    let optionsarr = []
    if(options){
        if(options.servers) optionsarr.push('servers')
    }

    let arrayusers = [];
    
    let pagination = await axios.get(config.url() + '/api/application/users', {
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
        await axios.get(config.url() + '/api/application/users?page=' + page + `${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`, {
            timeout: 5000, 
            headers: {
                "Authorization": "Bearer "+ config.application(),
                "Content-Type": "application/json"
            }
        }).then(d => arrayusers = arrayusers.concat(d.data.data)).catch((err) => {
            if(err?.response?.status < 500) return arrayusers = {
                error: true,
                panelError: true,
                status: err.response.status,
                message: err.response.data.errors
            }
    
            return arrayusers = {
                error: true,
                panelError: false,
                message: err
            }
        })
    }

    return arrayusers
}