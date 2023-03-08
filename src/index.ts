
import { WrapdactylParams, WrapdactylRequestOptions } from "./types";
import axios from "axios";

import request from "./utils/request";
import check from "./utils/check";
export default class Wrapdactyl {
    constructor(params: WrapdactylParams) {
        // Validation
        if(!params) 
            throw new Error("Wrapdactyl - class object param is missing")
        
        Object.defineProperty(this, 'config', {
            enumerable: false
        })

        // URL
        if(!params.url) 
            throw new Error("Wrapdactyl - url is not configured")
        if(!params.url.startsWith('http://') && !params.url.startsWith('https://')) 
            throw new Error ("Wrapdactyl - The url must start with http:// or https://")
        
        this.config.url = params.url

        // API keys
        if(!params.client && !params.application) 
            throw new Error('Wrapdactyl - at least one api key must be configured')
        if(params.client) {
            if(typeof params.client !== "string") 
                throw new Error("Wrapdactyl - The client api key must be a valid")

            this.config.client = params.client
        }
        if(params.application) {
            if(typeof params.application !== "string") 
                throw new Error("Wrapdactyl - The client api key must be a valid")

            this.config.application = params.application
        }

        // Options
        if(params.options) {
            if(params.options.timeout && typeof params.options.timeout === "number") 
                this.options.timeout = params.options.timeout
            if(params.options.simplifyErrors && typeof params.options.simplifyErrors === "boolean")
                this.options.simplifyErrors = params.options.simplifyErrors
        }
    }

    config = {
        url: "",
        client: "",
        application: ""
    }

    options = {
        timeout: 5000,
        simplifyErrors: false,
    }

    request = (url: string, options?: WrapdactylRequestOptions) => request(this, url, options)
    check = () => check(this)

    
}