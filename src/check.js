module.exports = async (request) => {
    let schema = {
        ping: Date.now(),
        panel: null,
        client: null,
        application: null,
        timestamp: Date.now()
    };

    await Promise.all([
        request({
            root: "/api/client",
            method: "GET"
        }).then(data => {
            schema.ping = Date.now() - schema.ping
            if((data.panelError && data.status === 401) || !data.error){
                schema.panel = true
            } else if (data.error && data.panelError & data.status === 404) {
                schema.panel = false
            }
        }),
        request({
            root: "/api/client",
            method: "GET"
        }).then(data => {
            if(!data.error) schema.client = true
            else if (data.panelError & data.status === 401) schema.client = false
        }),
        request({
            root: "/api/application/users",
            method: "GET"
        }).then(data => {
            if(!data.error) schema.application = true
            else if (data.panelError & data.status === 401) schema.application = false
        })
    ])

    schema.timestamp = Date.now();
    return schema
}