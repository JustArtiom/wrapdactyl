exports.wrapdactylscript = async (request, config, pteroptions, locationcache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.nodes) optionsarr.push('nodes')
        if(options.servers) optionsarr.push('servers')
    }

    let arraylocations = [];
    let error = null

    let pagination = await request({
        root: "/api/application/locations",
        method: "GET"
    }).catch(error => {error = error})

    if(error) return error
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        await request({
            root: `/api/application/locations?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).then(({data}) => arraylocations = arraylocations.concat(data)).catch(error => {error = error})
    }

    if(error) return error

    if(pteroptions.cache) {
        for(location of arraylocations) {
            locationcache.set(location.attributes.id, location.attributes)
        }
    }
    
    return arraylocations.map(d => d.attributes)
}