const axios = require('axios');

module.exports = async (config, lastcheck, nodeid, allocationid) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    
    if(!nodeid) throw 'Wrapdactyl - id of the node must be present'
    if(!allocationid) throw 'Wrapdactyl - allocation id must be present'

    let data = await axios.delete(config.url() + '/api/application/nodes/' + nodeid + '/allocations/' + allocationid, {
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

    return true
}