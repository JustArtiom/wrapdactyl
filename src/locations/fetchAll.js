exports.wrapdactylscript = async (request, config, pteroptions, locationcache, options) => {
    if(!config.application) throw new Error('Wrapdactyl - Application api key must be configured to run this function')

    let optionsarr = []
    if(options){
        if(options.nodes) optionsarr.push('nodes')
        if(options.servers) optionsarr.push('servers')
    }

    let arraylocations = [];

    let pagination = await request({
        root: "/api/application/locations",
        method: "GET"
    }).catch(e => e)

    if(pagination.error) return pagination
    pagination = pagination.meta.pagination

    for(let page = 1; page <= pagination.total_pages; page++){
        let data = await request({
            root: `/api/application/locations?page=${page}${optionsarr.length ? `&include=${optionsarr.join(',')}` : ''}`,
            method: "GET"
        }).catch(e => e)

        if(data.error) return data
        arraylocations = arraylocations.concat(data.data)
    }
    
    if(pteroptions.cache) {
        for(location of arraylocations) {
            locationcache.set(location.attributes.id, location.attributes)
        }
    }
    
    return arraylocations.map(d => d.attributes)
}