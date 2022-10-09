const axios = require('axios');

module.exports = async (config, lastcheck, nodeid) => {
    if(!lastcheck) throw 'Wrapdactyl - Wrapdactyl is not ready'
    if(!lastcheck.panel) throw 'Wrapdactyl - Panel offline'
    if(!lastcheck.application) throw 'Wrapdactyl - Application api key not configured or wrong'

    if(!nodeid) throw 'Wrapdactyl - id of the node must be present'

    const { scheme, fqdn, daemon_listen, ...errorcase } = await require('../nodes/fetch')(config, lastcheck, nodeid)
    if( errorcase.error || !scheme || !fqdn || !daemon_listen ) return errorcase
    const { token, ...errorcase2 } = await require('../nodes/configuration')(config, lastcheck, nodeid)
    if( errorcase2.error || !token ) return errorcase2

    let data = await axios.get(`${scheme}://${fqdn}:${daemon_listen}/api/system`, {
        timeout: 5000,
        headers: {
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json"
        }
    }).catch((err) => {
        return {
            error: true,
            message: err
        }
    })
    
    if(data.error) return data
    return data
}