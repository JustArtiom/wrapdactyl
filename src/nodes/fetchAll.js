exports.wrapdactylscript = async (request, config, pteroptions, nodescache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.allocations) optionsarr.push('allocations')
        if(options.servers) optionsarr.push('servers')
        if(options.location) optionsarr.push('location')
    }

    let arraynodes = [];

    let pagination = await request({
        root: "/api/application/nodes",
        method: "GET"
    }).catch(e => e)

    if(pagination.error) return pagination
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        let data = await request({
            root: `/api/application/nodes?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).catch(e => e)

        if(data.error) return data
        arraynodes = arraynodes.concat(data.data)
    }


    if(pteroptions.cache) {
        for(node of arraynodes) {
            nodescache.set(node.attributes.id, node.attributes)
        }
    }
    
    return arraynodes.map(d => d.attributes)
}