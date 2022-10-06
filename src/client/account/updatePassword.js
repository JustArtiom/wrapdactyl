const axios = require('axios');

module.exports = async (config, lastcheck, oldpassword, newpassword) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.client) throw 'Wrapdactyl - client api key not configured or wrong' 

    if(!email) throw 'Wrapdactyl - Old password must be present'
    if(!password) throw 'Wrapdactyl - New password must be present'

    
}