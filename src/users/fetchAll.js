exports.wrapdactylscript = async (request, config, pteroptions, userscache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.servers) optionsarr.push('servers')
    }

    let arrayusers = [];

    let pagination = await request({
        root: "/api/application/users",
        method: "GET"
    }).catch(e => e)

    if(pagination.error) return pagination
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        let data = await request({
            root: `/api/application/users?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).catch(e => e)

        if(data.error) return data
        arrayusers = arrayusers.concat(data.data)        
    }

    if(pteroptions.cache) {
        for(user of arrayusers) {
            userscache.set(user.attributes.id, user.attributes)
        }
    }
    
    return arrayusers.map(d => d.attributes)
}