const axios = require('axios');

const events = [];
const conf = new Map();

module.exports = class {
    /**
     * Creating a new client and config it
     * @param {Object} config
     * @param {String} config.url
     * @param {String} config.client 
     * @param {String} config.application
     * @param {Object} config.options 
     * @param {Boolean} config.options.cache
     * @param {Boolean} config.options.events
     * @param {Number} config.options.checkInterval 
     * @param {Number} config.options.updateCacheInterval  
    */

    constructor(config) {
        // URL validation
        if(!config || typeof config !== 'object') throw new Error('Wrapdactyl - There must be a configuration when creating the panel')
        if(!config.url || typeof config.url !== 'string') throw new Error('Wrapdactyl - The panel url must be present in the configuration')
        if(!config.url.startsWith('http')) throw new Error('Wrapdactyl - The url must start with http or https')

        // Save the panel url in cache
        conf.set('url', config.url);

        // Tokens Validations
        if(!config.client && !config.application) throw new Error('Wrapdactyl - One of the tokens must be present')
        if(config.client){
            if(typeof config.client !== 'string') throw new Error('Wrapdactyl - The client api key must be a string')
            if(config.client.length !== 48) throw new Error('Wrapdactyl - The client api key must be 48 characters long')

            // Save client token in cache
            conf.set('client', config.client)
        }

        if(config.application){
            if(typeof config.application !== 'string') throw new Error('Wrapdactyl - The application api key must be a string')
            if(config.application.length !== 48) throw new Error('Wrapdactyl - The application api key must be 48 characters long')

            // Save application token in cache
            conf.set('application', config.application)
        }

        // Options
        if(config.options && typeof config.options === 'object') {
            // Event option
            if(config.options.cache) {
                if(!this.config.application()) throw new Error('Wrapdactyl - You cannot enable cache without application api key')
                this.options.cache = true
            }

            // Cache option
            if(config.options.events) {
                this.options.events = true
            }

            // Inverval check option
            if(config.options.checkInterval) {
                if(isNaN(config.options.checkInterval) || config.options.checkInterval < 5000) throw new Error('Wrapdactyl - The interval check must be a number in miliseconds abobe 5000 ( 5 seconds )')
                this.options.checkInterval = config.options.checkInterval

                setInterval(() => {
                    this.check().then(d => {
                        if(this.options.events) emit('checkUpdate', d)
                    })
                }, config.options.checkInterval)
            }

            if(config.options.updateCacheInterval) {
                if(!this.options.cache) throw new Error('Wrapdactyl - You cannot update cache unless the option is enabled')
                if(isNaN(config.options.updateCacheInterval) || config.options.updateCacheInterval < 30000) throw new Error('Wrapdactyl - The interval check must be a number in miliseconds abobe 30000 ( 30 seconds )')
                setInterval(() => {
                    this.updateCache().then(() => {
                        if(this.options.events) emit('cacheUpdate', null)
                    })
                }, config.options.updateCacheInterval)
            }
        }
    }


    // Variables 
    ready = false
    cacheReady = false
    config = {
        url: () => conf.get('url'),
        client: () => conf.get('client'),
        application: () => conf.get('application')
    }

    options = {
        cache: false,
        events: false,
        checkInterval: false,
        updateCacheInterval: false
    }
    lastcheck = null

    client = {
        permissions: () => require('./client/permissions')(this.config, this.lastcheck),
        account: {
            fetch: () => require('./client/account/fetch')(this.config, this.lastcheck),
            updateEmail: (email, password) => require('./client/account/updateEmail')(this.config, this.lastcheck, this.users.cache, email, password),
            updatePassword: (current_password, new_password) => require('./client/account/updatePassword')(this.config, this.lastcheck, current_password, new_password),
            apikeys: {
                fetch: () => require('./client/account/apikeys/fetch')(this.config, this.lastcheck),
                create: (description, allowed_ips) => require('./client/account/apikeys/create')(this.config, this.lastcheck, description, allowed_ips),
                delete: (id) => require('./client/account/apikeys/delete')(this.config, this.lastcheck, id)
            },
            twofa: {
                fetch: () => require('./client/account/twofa/fetch')(this.config, this.lastcheck),
                enable: (password, code) => require('./client/account/twofa/enable')(this.config, this.lastcheck, password, code),
                disable: (password) => require('./client/account/twofa/disable')(this.config, this.lastcheck, password)
            }
        },
        servers: {
            fetchAll: () => require('./client/servers/fetchAll')(this.config, this.lastcheck),
            fetch: (uuid, options) => require('./client/servers/fetch')(this.config, this.lastcheck, uuid, options),
            consoleDetails: (uuid) => require('./client/servers/consoleDetails')(this.config, this.lastcheck, uuid),
            websocket: require('./client/servers/websocket'),
            resources: (uuid) => require('./client/servers/resources')(this.config, this.lastcheck, uuid),
            sendCommand: (uuid, command) => require('./client/servers/sendCommand')(this.config, this.lastcheck, uuid, command),
            power: (uuid, power) => require('./client/servers/power')(this.config, this.lastcheck, uuid, power),
            rename: (uuid, name) => require('./client/servers/rename')(this.config, this.lastcheck, uuid, name),
            reinstall: (uuid) => require('./client/servers/reinstall')(this.config, this.lastcheck, uuid),
        }
    }

    users = {
        cache: new Map(),
        fetchAll: (options) => require('./users/fetchAll')(this.config, this.lastcheck, options),
        fetch: (id, options) => require('./users/fetch')(this.config, this.lastcheck, id, options),
        create: (userdata) => require('./users/create')(this.config, this.lastcheck, this.users.cache, userdata),
        update: (id, userdata) => require('./users/update')(this.config, this.lastcheck, this.users.cache, id, userdata),
        delete: (id) => require('./users/delete')(this.config, this.lastcheck, this.users.cache, id),
    }
    servers = {
        cache: new Map(),
        fetchAll: () => require('./servers/fetchAll')(this.config, this.lastcheck)
    }
    nodes = {
        cache: new Map(),
        fetchAll: (options) => require('./nodes/fetchAll')(this.config, this.lastcheck, options),
        fetch: (id, options) => require('./nodes/fetch')(this.config, this.lastcheck, id, options),
        configuration: (id) => require('./nodes/configuration')(this.config, this.lastcheck, id),
        create: (configuration) => require('./nodes/create')(this.config, this.lastcheck, configuration),
        update: (id, configuration) => require('./nodes/update')(this.config, this.lastcheck, id, configuration),
        delete: (id) => require('./nodes/delete')(this.config, this.lastcheck, id)
    }
    wings = (id) => require('./wings')(this.config, this.lastcheck, id)

    on = (name, callback) => {
        if(name && callback) events.push({name, callback})
    }

    check = async () => {
        let data = await require('./util/check')(this.config)
        this.ready = true
        this.lastcheck = data
        return data
    }

    updateCache = async () => {
        if(!this.options.cache) throw new Error('Wrapdactyl - You cannot update cache unless the option is enabled')
        if(!this.ready) throw new Error('Wrapdactyl - You cannot update cache unless you do a check. ptero.check()')
        if(!this.lastcheck.application) throw new Error('Wrapdactyl - The cache update cannot be completed if the application api key is wrong or not configured')

        let users;
        let servers;
        
        await Promise.all([
            this.servers.fetchAll(this.config).then(d => servers = d).catch(() => {}),
            this.users.fetchAll(this.config).then(d => users = d).catch(() => {})
        ])
        for(let user of users){
            this.users.cache.set(user.attributes.id, user)
        }
        for(let server of servers) {
            this.servers.cache.set(server.attributes.identifier, server)
        }
        this.cacheReady = true;

        return {
            users,
            servers
        }
    }
}

function emit (name, ...data) {
    let event = events.filter(x => x.name === name)
    if(!event.length) return
    event.forEach(e => {
        e.callback(...data)
    })
}