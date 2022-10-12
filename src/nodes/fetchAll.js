exports.wrapdactylscript = async (request, config, pteroptions, nodescache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.allocations) optionsarr.push('allocations')
        if(options.servers) optionsarr.push('servers')
        if(options.location) optionsarr.push('location')
    }

    let arraynodes = [];
    let error = null

    let pagination = await request({
        root: "/api/application/nodes",
        method: "GET"
    }).catch(error => {error = error})

    if(error) return error
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        await request({
            root: `/api/application/nodes?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).then(({data}) => arraynodes = arraynodes.concat(data)).catch(error => {error = error})
    }

    if(error) return error

    if(pteroptions.cache) {
        for(node of arraynodes) {
            nodescache.set(node.attributes.id, node.attributes)
        }
    }
    
    return arraynodes.map(d => d.attributes)
}