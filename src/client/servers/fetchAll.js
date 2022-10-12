exports.wrapdactylscript = async (request, config, pteroptions, serverscache, options) => {
    if(!config.client) throw new Error('Wrapdactyl - Client api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.subusers) optionsarr.push('subusers')
        if(options.egg) optionsarr.push('egg')
    }

    let arrayservers = [];

    let pagination = await request({
        root: "/api/client",
        method: "GET"
    }).catch(e => e)

    if(pagination.error) return pagination
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        let data = await request({
            root: `/api/client?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).catch(e => e)

        if(data.error) return arrayservers = data
        arrayservers = arrayservers.concat(data.data)
    }

    if(pteroptions.cache) {
        for(server of arrayservers) {
            serverscache.set(server.attributes.id, server.attributes)
        }
    }
    
    return arrayservers.map(d => d.attributes)
}