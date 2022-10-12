const axios = require('axios')

module.exports = class {

    /**
     * @typedef {Object} Options
     * @property {number} [timeout]
     * @property {boolean} [cache]
    */

    /**
     * @param {Object} config
     * @param {string} config.url
     * @param {string} config.name
     * @param {string} config.application
     * @param {Options} [config.options]
    */

    constructor(config) {
        // URL validation
        if(!config || typeof config !== 'object') throw new Error('Wrapdactyl - There must be a configuration when creating the panel')
        if(!config.url || typeof config.url !== 'string') throw new Error('Wrapdactyl - The panel url must be present in the configuration')
        if(!config.url.startsWith('http://') && !config.url.startsWith('https://')) throw new Error('Wrapdactyl - The url must start with http or https')

        // Create the config object
        Object.defineProperty(this, "config", {
            enumerable: false,
            value: {}
        })

        // Save the panel url
        this.config.url = config.url

        // Tokens Validations
        if(!config.client && !config.application) throw new Error('Wrapdactyl - One of the tokens must be present')
        if(config.client){
            if(typeof config.client !== 'string') throw new Error('Wrapdactyl - The client api key must be a string')
            if(config.client.length !== 48) throw new Error('Wrapdactyl - The client api key must be 48 characters long')

            // Save the client api key in the object class
            this.config.client = config.client
        }

        if(config.application){
            if(typeof config.application !== 'string') throw new Error('Wrapdactyl - The application api key must be a string')
            if(config.application.length !== 48) throw new Error('Wrapdactyl - The application api key must be 48 characters long')

            // Save the client api key in the object class
            this.config.application = config.application
        }

        if(config.options){
            if(config.options.timeout){
                if(typeof config.options.timeout !== 'number') throw new Error('Wrapdactyl - The timeout option must be a number')
                if(config.options.timeout < 1000) throw new Error('Wrapdactyl - The timeout option must be above 1000 (ms)')
                this.options.timeout = config.options.timeout
            }

            if(config.options.cache) this.options.cache = true
        }
    }

    /** @type {Options} @constant @default */
    options = {
        timeout: 5000,
        cache: false
    }

    client = {
        account: {
            cache: {}
        },
        servers: {
            cache: new Map(),
            /**
             * @param {Object} [options]
             * @param {boolean} [options.egg]
             * @param {boolean} [options.subusers]
             * 
             * @returns {Promise}
             */
            fetchAll: (options) => require('./client/servers/fetchAll').wrapdactylscript(this.request, this.config, this.options, this.client.servers.cache, options),
        }
    }
    users = {
        cache: new Map(),
        /**
         * @param {Object} [options] 
         * @param {boolean} [options.servers]
         * 
         * @returns {Promise}
        */
        fetchAll: async (options) => require('./users/fetchAll').wrapdactylscript(this.request, this.config, this.options, this.users.cache, options),
    }
    servers = {
        cache: new Map(),
        /**
         * @param {Object} [options] 
         * @param {boolean} [options.allocations]
         * @param {boolean} [options.users]
         * @param {boolean} [options.subusers]
         * @param {boolean} [options.pack]
         * @param {boolean} [options.nest]
         * @param {boolean} [options.egg]
         * @param {boolean} [options.variables]
         * @param {boolean} [options.location]
         * @param {boolean} [options.node]
         * @param {boolean} [options.databases]
         * 
         * @returns {Promise}
        */
       fetchAll: async (options) => require('./servers/fetchAll').wrapdactylscript(this.request, this.config, this.options, this.servers.cache, options)
    }
    nodes = {
        cache: new Map(),
        /**
         * @param {Object} [options] 
         * @param {boolean} [options.allocations]
         * @param {boolean} [options.location]
         * @param {boolean} [options.servers]
         * 
         * @returns {Promise}
         */
        fetchAll: async (options) => require('./nodes/fetchAll').wrapdactylscript(this.request, this.config, this.options, this.nodes.cache, options)
    }
    wings = () => {}
    locations = {
        cache: new Map(),
        /**
         * @param {Object} [options]
         * @param {boolean} [options.nodes]
         * @param {boolean} [options.servers]
         * 
         * @returns {Promise}
         */
        fetchAll: async (options) => require('./locations/fetchAll').wrapdactylscript(this.request, this.config, this.options, this.locations.cache, options)
    }
    nests = {
        cache: new Map(),
        /**
         * @param {Object} [options]
         * @param {boolean} [options.eggs]
         * @param {boolean} [options.servers]
         * 
         * @returns {Promise}
         */
        fetchAll: async (options) => require('./nests/fetchAll').wrapdactylscript(this.request, this.config, this.options, this.nests.cache, options)
    }


    /**
     * @param {{root: string, method: string, data: object}} data
     * @returns {Promise<T>} 
    */
    request = async (data) => {
        if(!data) throw new Error('Wrapdactyl - Custom request data must be present')
        const {root, method, body} = data 

        if(!root || (!root.startsWith('/api/client') && !root.startsWith('/api/application'))) throw new Error('Wrapdactyl - Custom request root needs to start /api/') 
        if(!method || !["GET", "POST", "PATCH", "DELETE"].includes(method.toUpperCase())) throw new Error('Wrapdactyl - Custom request method must be a string which could be get/post/patch/delete')
        
        let resp = await axios({
            url: `${this.config.url + root}`,
            method: method.toUpperCase(),
            timeout: 5000, 
            headers: {
                "Authorization": "Bearer "+ `${root.startsWith('/api/client') ? this.config.client : this.config.application}`,
                "Content-Type": "application/json"
            },
            data: body
        }).catch((err) => {
            if(err?.response?.status < 500) throw {
                error: true,
                panelError: true,
                status: err.response.status,
                message: err.response.data.errors
            }
            throw {
                error: true,
                panelError: false,
                status: err.toString(),
                message: err
            }
        })
        
        if(resp.data) return resp.data
        else if (resp.response) return resp.response
        else return resp
    }

    /**
     * @typedef {Object} Check
     * @property {!number} ping
     * @property {!boolean} panel
     * @property {!boolean} client 
     * @property {!boolean} application 
     * @property {!number} timestamp 
    */

    /**
     * @returns {Promise<Check>}
    */
    check = async () => require('./check')(this.request).then(d => this.lastcheck = d)

    /** @type {Check} */
    lastcheck = null


}