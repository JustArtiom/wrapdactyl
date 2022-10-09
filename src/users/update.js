const axios = require('axios');

module.exports = async (config, lastcheck, usercahce, id, userdata) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'

    if(!id) throw 'Wrapdactyl - Id of the new user must be present'
    if(!userdata || typeof userdata !== 'object') throw 'Wrapdactyl - Userdata must be present'

    let data = await axios.patch(config.url() + '/api/application/users/'+id, userdata, {
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

    if(usercahce.has(data.data.attributes.id)){
        let userdata = usercahce.get(data.data.attributes.id)
        userdata.attributes = data.data.attributes
        usercahce.set(data.data.attributes.id, userdata)
    }

    return data.data.attributes
}