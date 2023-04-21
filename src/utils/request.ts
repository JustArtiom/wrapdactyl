import axios from "axios";
import Wrapdactyl from "..";
import { WrapdactylRequestOptions } from "../types";

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
    }).then((data) => data.data)
}