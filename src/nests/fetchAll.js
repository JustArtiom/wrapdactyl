exports.wrapdactylscript = async (request, config, pteroptions, nestscache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.allocations) optionsarr.push('allocations')
        if(options.servers) optionsarr.push('servers')
        if(options.location) optionsarr.push('location')
    }

    let arraynests = [];
    let error = null

    let pagination = await request({
        root: "/api/application/nests",
        method: "GET"
    }).catch(error => {error = error})

    if(error) return error
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        await request({
            root: `/api/application/nests?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).then(({data}) => arraynests = arraynests.concat(data)).catch(error => {error = error})
    }

    if(error) return error

    if(pteroptions.cache) {
        for(nest of arraynests) {
            nestscache.set(nest.attributes.id, nest.attributes)
        }
    }
    
    return arraynests.map(d => d.attributes)
}