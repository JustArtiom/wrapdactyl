const axios = require('axios')

module.exports = async (config, lastcheck, nodeid, options) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!nodeid) throw 'Wrapdactyl - node id must be present'

    let optionsarr = []
    if(options){
        if(options.node) optionsarr.push('node')
        if(options.server) optionsarr.push('server')
    }

    let arrayallocations = [];
    
    let pagination = await axios.get(config.url() + '/api/application/nodes/' + nodeid + '/allocations', {
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
        await axios.get(config.url() + '/api/application/nodes/' + nodeid + '/allocations?page=' + page + `${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`, {
            timeout: 5000, 
            headers: {
                "Authorization": "Bearer "+ config.application(),
                "Content-Type": "application/json"
            }
        }).then(d => arrayallocations = arrayallocations.concat(d.data.data)).catch((err) => {
            if(err?.response?.status < 500) return arrayallocations = {
                error: true,
                panelError: true,
                status: err.response.status,
                message: err.response.data.errors
            }
    
            return arrayallocations = {
                error: true,
                panelError: false,
                message: err
            }
        })
    }

    return arrayallocations
}