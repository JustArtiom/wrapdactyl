const axios = require('axios');

module.exports = async (config, lastcheck, usercahce, email, password) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'

    if(!email) throw 'Wrapdactyl - Email must be present'
    if(!password) throw 'Wrapdactyl - Password must be present'

    if(!email.includes('@') || !email.includes('.')) throw 'Wrapdactyl - Email is invalid'

    let data = await axios.put(config.url() + '/api/client/account/email', {
        email: email,
        password: password
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

    if(usercahce.size){
        let account = await require('./fetch')(config, lastcheck)
        if(!account.error){
            usercahce.set(account.id, {
                account
            })
        }
    }

    return true
}