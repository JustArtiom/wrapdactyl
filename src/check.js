module.exports = async (request) => {
    let schema = {
        ping: Date.now(),
        panel: false,
        client: false,
        application: false,
        timestamp: Date.now()
    };

    await Promise.all([
        request({
            root: "/api/client",
            method: "GET"
        }).then(data => {
            schema.ping = Date.now() - schema.ping
            schema.panel = true
            schema.client = true
        }).catch(err => {
            if(err.panelError && err.status === 401) {
                schema.client = false
                schema.panel = true
            }
        }),
        request({
            root: "/api/application/users",
            method: "GET"
        }).then(data => {
            schema.application = true
        }).catch(err => {
            if(err.panelError & err.status === 401) schema.application = false
        })
    ])

    schema.timestamp = Date.now();
    return schema
}