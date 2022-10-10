const axios = require('axios')

module.exports = class {

    /**
     * @typedef {Object} Options
     * @property {boolean} [cache]
     * @property {number} [timeout]
     * @property {number} [cacheUpdate]
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

        // Save the panel url in the object class
        Object.defineProperty(this, "url", {
            enumerable: false,
            value: config.url
        })

        // Tokens Validations
        if(!config.client && !config.application) throw new Error('Wrapdactyl - One of the tokens must be present')
        if(config.client){
            if(typeof config.client !== 'string') throw new Error('Wrapdactyl - The client api key must be a string')
            if(config.client.length !== 48) throw new Error('Wrapdactyl - The client api key must be 48 characters long')

            // Save the client api key in the object class
            Object.defineProperty(this, "client", {
                enumerable: false,
                value: config.client
            })
        }

        if(config.application){
            if(typeof config.application !== 'string') throw new Error('Wrapdactyl - The application api key must be a string')
            if(config.application.length !== 48) throw new Error('Wrapdactyl - The application api key must be 48 characters long')

            // Save the client api key in the object class
            Object.defineProperty(this, "application", {
                enumerable: false,
                value: config.application
            })
        }

        if(config.options){
            if(config.options.timeout){
                if(typeof config.options.timeout !== 'number') throw new Error('Wrapdactyl - The timeout option must be a number')
                if(config.options.timeout < 1000) throw new Error('Wrapdactyl - The timeout option must be above 1000 (ms)')
                this.options.timeout = config.options.timeout
            }
        }
    }

    /** @type {Options} @constant @default */
    options = {
        cache: false,
        timeout: 5000,
        cacheUpdate: 0
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
        return axios({
            url: `${this.url + root}`,
            method: method.toUpperCase(),
            timeout: 5000, 
            headers: {
                "Authorization": "Bearer "+ `${root.startsWith('/api/client') ? this.client : this.application}`,
                "Content-Type": "application/json"
            },
            data: body
        }).catch((err) => {
            if(err?.response?.status < 500) return {
                error: true,
                panelError: true,
                status: err.response.status,
                message: err.response.data.errors
            }
            return {
                error: true,
                panelError: false,
                status: err.toString(),
                message: err
            }
        })
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