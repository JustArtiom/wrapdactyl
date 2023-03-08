export type WrapdactylParams = {
    url: string;
    client?: string;
    application?: string;
    options?: {
        timeout?: number;
        simplifyErrors?: boolean;
    }
}

export type Config = {
    url: string;
    client: string;
    application: string;
}

export type WrapdactylRequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    timeout?: number;
    headers?: {
        [key: string]: string;
    };
    body?: any;
    simplifyError?: boolean;
}