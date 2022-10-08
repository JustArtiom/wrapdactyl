const axios = require('axios');

module.exports = async (config, lastcheck, usercahce, id, userdata) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.panel) throw 'Wrapdactyl - Panel offline'
    if(!lastcheck.application) throw 'Wrapdactyl - Application api key not configured or wrong'

    if(!id) throw 'Wrapdactyl - Id of the new user must be present'
    if(!userdata || typeof userdata !== 'object') throw 'Wrapdactyl - Userdata must be present'
    if(!userdata.email || typeof userdata.email !== 'string' || !userdata.email.includes('@') || !userdata.email.includes('.')) throw 'Wrapdactyl - Email must be a valid string'
    if(!userdata.username || typeof userdata.username !== 'string') throw 'Wrapdactyl - Username must be a valid string'
    if(!userdata.first_name || typeof userdata.first_name !== 'string') throw 'Wrapdactyl - first name must be a valid string'
    if(!userdata.last_name || typeof userdata.last_name !== 'string') throw 'Wrapdactyl - last name must be a valid string'

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