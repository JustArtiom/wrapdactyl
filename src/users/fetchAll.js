exports.wrapdactylscript = async (request, config, pteroptions, userscache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.servers) optionsarr.push('servers')
    }

    let arrayusers = [];
    let error = null

    let pagination = await request({
        root: "/api/application/users",
        method: "GET"
    }).catch(error => {error = error})

    if(error) return error
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        let users = await request({
            root: `/api/application/users?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).catch(error => {error = error})
        if(users && users.data) arrayusers = arrayusers.concat(users.data)
    }

    if(error) return error

    if(pteroptions.cache) {
        for(user of arrayusers) {
            userscache.set(user.attributes.id, user.attributes)
        }
    }
    
    return arrayusers.map(d => d.attributes)
}