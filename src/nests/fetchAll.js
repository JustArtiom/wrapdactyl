exports.wrapdactylscript = async (request, config, pteroptions, nestscache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.allocations) optionsarr.push('allocations')
        if(options.servers) optionsarr.push('servers')
        if(options.location) optionsarr.push('location')
    }

    let arraynests = [];

    let pagination = await request({
        root: "/api/application/nests",
        method: "GET"
    }).catch(e => e)

    if(pagination.error) return pagination
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        let data = await request({
            root: `/api/application/nests?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).catch(e => e);

        if(data.error) return data
        arraynests = arraynests.concat(data.data)
    }

    if(pteroptions.cache) {
        for(nest of arraynests) {
            nestscache.set(nest.attributes.id, nest.attributes)
        }
    }
    
    return arraynests.map(d => d.attributes)
}