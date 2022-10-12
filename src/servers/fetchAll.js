exports.wrapdactylscript = async (request, config, pteroptions, serverscache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.allocations) optionsarr.push('allocations')
        if(options.user) optionsarr.push('user')
        if(options.subusers) optionsarr.push('subusers')
        if(options.pack) optionsarr.push('pack')
        if(options.nest) optionsarr.push('nest')
        if(options.egg) optionsarr.push('egg')
        if(options.variables) optionsarr.push('variables')
        if(options.location) optionsarr.push('location')
        if(options.node) optionsarr.push('node')
        if(options.databases) optionsarr.push('databases')
    }

    let arrayservers = [];
    let error = null

    let pagination = await request({
        root: "/api/application/servers",
        method: "GET"
    }).catch(error => {error = error})

    if(error) return error
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        await request({
            root: `/api/application/servers?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).then(({data}) => arrayservers = arrayservers.concat(data)).catch(error => {error = error})
    }

    if(error) return error

    if(pteroptions.cache) {
        for(server of arrayservers) {
            serverscache.set(server.attributes.id, server.attributes)
        }
    }
    
    return arrayservers.map(d => d.attributes)
}