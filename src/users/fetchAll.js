const axios = require('axios')

module.exports = async (config) => {
    if(!config.application()) throw new Error('Wrapdactyl - You need to configure application api key to run this function')
    let arrayusers = [];
    
    let pagination = (await axios.get(config.url() + '/api/application/users', {
        timeout: 5000, 
        headers: {
            "Authorization": "Bearer "+ config.application(),
            "Content-Type": "application/json"
        }
    }).catch(() => {}))?.data?.meta?.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        await axios.get(config.url() + '/api/application/users?page='+page, {
            timeout: 5000, 
            headers: {
                "Authorization": "Bearer "+ config.application(),
                "Content-Type": "application/json"
            }
        }).then(d => arrayusers = arrayusers.concat(d.data.data)).catch(() => {})
    }

    return arrayusers
}