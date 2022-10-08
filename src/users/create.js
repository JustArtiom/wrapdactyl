const axios = require('axios');

module.exports = async (config, lastcheck, usercahce, user) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.panel) throw 'Wrapdactyl - Panel offline'
    if(!lastcheck.application) throw 'Wrapdactyl - Application api key not configured or wrong'

    if(!user) throw 'Wrapdactyl - Data of the new user must be present'
    if(!user.email || typeof user.email !== 'string' || !user.email.includes('@') || !user.email.includes('.')) throw 'Wrapdactyl - Email must be a valid string'
    if(!user.username || typeof user.username !== 'string') throw 'Wrapdactyl - Username must be a valid string'
    if(!user.first_name || typeof user.first_name !== 'string') throw 'Wrapdactyl - first name must be a valid string'
    if(!user.last_name || typeof user.last_name !== 'string') throw 'Wrapdactyl - last name must be a valid string'
    if(!user.password || typeof user.password !== 'string') throw 'Wrapdactyl - Password must be present'
    if(!user.root_admin || typeof user.root_admin !== 'boolean') user.root_admin = false;

    let data = await axios.post(config.url() + '/api/application/users/', user, {
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

    if(usercahce.size){
        usercahce.set(data.data.attributes.id, data.data)
    }

    return data.data.attributes
}