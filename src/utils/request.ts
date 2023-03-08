import axios from "axios"
import Wrapdactyl from ".."
import { WrapdactylRequestOptions } from "../types"

export default async (that: Wrapdactyl, route: string = "", options: WrapdactylRequestOptions = {})=> {
    return await axios({
        url: that.config.url + route,
        method: options.method,
        timeout: options.timeout ?? that.options.timeout,
        headers: {
            "Authorization": "Bearer " + (route.startsWith("/api/client") ? that.config.client : that.config.application),
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...options.headers
        },
        data: options.body
    }).then((data) => data.data).catch((error) => {
        if(
            (options.simplifyError === undefined && that.options.simplifyErrors) 
            || options.simplifyError
        ){
        
            if(error.response) throw {
                error: true,
                simplified: true,
                code: error.code,
                status: error.response.status,
                statusText: error.response.statusText,
                config: error.config,
                data: error.response.data
            }
            
            error = error.toJSON()
            throw {
                error: true,
                simplified: true,
                code: error.code,
                status: error.status,
                statusText: error.message,
                name: error.name,
                description: error.description,
                config: error.config,
                data: undefined
            }
        }
        throw error
    })
}