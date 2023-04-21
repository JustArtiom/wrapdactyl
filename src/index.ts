
import { 
    WrapdactylParams, 
    WrapdactylRequestOptions,
    ClientPermissions,
    ClientAccountFetch, 
    ClientServerFetchResponse,
    ClientServerFetchAllResponse,
    ClientAccountApiKeysFetchAllResponse,
    ClientAccountApiKeysCreateResponse,
    ClientAccountTwoFactorFetchResponse,
    ClientAccountTwoFactorEnableResponse,
    ClientAccountServerWebsocketDetails,
    ClientServerResourcesResponse,
    ClientAccountFetchAllActivities
} from "./types";
import request from "./utils/request";
import wrapdactylCheck from "./utils/check";
import serverWebsocketManager from "./utils/serverWebsocketManager";

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
        }
    };

    config = {
        url: "",
        client: "",
        application: ""
    };

    options = {
        timeout: 5000,
    };

    request = (url: string, options?: WrapdactylRequestOptions) => request(this, url, options);
    check = () => wrapdactylCheck(this);

    client = {
        /* This wont have a dedicated interface as it might be modified in the future */
        permissions: (): Promise<ClientPermissions> => this.request('/api/client/permissions'),
        account: {
            fetch: (): Promise<ClientAccountFetch> => 
                this.request("/api/client/account"),
            updateEmail: ({email, password}: {email: string, password: string}): Promise<void> => 
                this.request("/api/client/account/email", { method: "PUT", body: {email, password} })
                .then(() => {}),
            updatePassword: ({oldPassword, newPassword}: {oldPassword: string, newPassword: string}): Promise<void> =>
                this.request("/api/client/account/password", { method: "PUT", body: { current_password: oldPassword, password: newPassword, password_confirmation: newPassword}})
                .then(() => {}),
            fetchAllActivities: async ({page}: {page?: number | string} = {}): Promise<ClientAccountFetchAllActivities> => {
                const toSend: ClientAccountFetchAllActivities = {
                    object: 'list',
                    data: [],
                }

                const pagination = await this.request(`/api/client/account/activity?page=${page ? page : ""}`)
                toSend.data.push(...pagination.data)
                
                if(pagination.meta.pagination.total_pages === 1) return toSend
                for(let page = 2; page <= pagination.meta.pagination.total_pages; page++) {
                    await this.request(`/api/client/account/activity?page=${page ? page : ""}`).then(d => toSend.data.push(...d.data))
                }

                return toSend
            },
            apiKeys: {
                fetchAll: (): Promise<ClientAccountApiKeysFetchAllResponse> => 
                    this.request("/api/client/account/api-keys"),
                create: ({description, allowed_ips}: {description: string, allowed_ips?: string[]}): Promise<ClientAccountApiKeysCreateResponse> => 
                    this.request("/api/client/account/api-keys", { method: "POST", body: {description, allowed_ips}}),
                delete: ({identifier}: {identifier: string}): Promise<void> => 
                    this.request("/api/client/account/api-keys/"+identifier, { method: "DELETE" })
                    .then(() => {})
            },
            twofa: {
                fetch: (): Promise<ClientAccountTwoFactorFetchResponse> => 
                    this.request("/api/client/account/two-factor"),
                enable: ({code}: {code: string | number}): Promise<ClientAccountTwoFactorEnableResponse> => 
                    this.request("/api/client/account/two-factor", { method: "POST", body: {code: code.toString()}}),
                disable: ({password}: {password: string}): Promise<void> => 
                    this.request("/api/client/account/two-factor", { method: "DELETE", body: {password} })
            },
            sshKeys: {
                /* To do for future */
            }
        },
        servers: {
            fetch: (identifier: string, data?: { params?: ["egg", "subusers"] }): Promise<ClientServerFetchResponse> => {
                if(!identifier) throw new Error("Wrapdactyl - Server identifier must be present")
                return this.request(`/api/client/servers/${identifier}${data?.params?.length ? `?includes=${data.params.join(",")}` : ""}`)
            },
            fetchAll: async ({params, page}: { page?: number | string, params?: ["egg", "subusers"] } = {}) => {
                const toSend: ClientServerFetchAllResponse = {
                    object: 'list',
                    data: [],
                }
                
                const pagination = await this.request(`/api/client${params?.length ? `?includes=${params.join(",")}` : ""}${page ? `${params?.length ? "&" : "?"}page=${page}` : ""}`)
                toSend.data.push(...pagination.data)
                
                if(pagination.meta.pagination.total_pages === 1) return toSend
                for(let page = 2; page <= pagination.meta.pagination.total_pages; page++) {
                    await this.request('/api/client'+ `?page=${page}` + (params?.length ? `&includes=${params.join(",")}` : "")).then(d => toSend.data.push(...d.data))
                }
                return toSend
            },
            websocketDetails: (identifier: string): Promise<ClientAccountServerWebsocketDetails> => {
                if(!identifier) throw new Error("Wrapdactyl - Server identifier must be present")
                return this.request(`/api/client/servers/${identifier}/websocket`)
            },
            websocket: (identifier: string) => new serverWebsocketManager(this, identifier),
            resources: (identifier: string): Promise<ClientServerResourcesResponse> => {
                if(!identifier) throw new Error("Wrapdactyl - Server identifier must be present")
                return this.request(`/api/client/servers/${identifier}/resources`)
            },
            sendCommand: (identifier: string, command: string) => {
                if(!identifier) throw new Error("Wrapdactyl - Server identifier must be present")
                return this.request(`/api/client/servers/${identifier}/command`, {method: "POST", body: {command}})
            },
            power: (identifier: string, signal: "start" | "stop" | "restart" | "kill") => {
                if(!identifier) throw new Error("Wrapdactyl - Server identifier must be present")
                if(!["start" || "stop" || "restart" || "kill"].includes(signal)) throw new Error("Wrapdactyl - Invalid Signal power type")
                return this.request(`/api/client/servers/${identifier}/power`, {method: "POST", body: {signal}})
            },
            changeName: () => {}, // To do for future
            reinstall: () => {}, // To do for future
            database: {
                /* To do for future */
            },
            files: {
                /* To do for future */
            },
            schedule: {
                /* To do for future */
            },
            network: {
                /* To do for future */
            },
            users: {
                /* To do for future */
            },
            backup: {
                /* To do for future */
            },
            startup: {
                /* To do for future */
            },
        },
    };
}