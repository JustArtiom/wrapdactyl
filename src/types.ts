export interface WrapdactylParams {
    url: string;
    client?: string;
    application?: string;
    options?: {
        timeout?: number;
        simplifyErrors?: boolean;
    }
}

export interface Config {
    url: string;
    client: string;
    application: string;
}

export interface WrapdactylRequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    timeout?: number;
    headers?: {
        [key: string]: string;
    };
    body?: any;
    simplifyError?: boolean;
}

export interface Check {
    ping: number;
    panel?: boolean | null;
    client?: boolean | null;
    application?: boolean | null;
    timestamp: number;
}

export interface ClientServer {
    server_owner: boolean,
    identifier: string,
    internal_id: number
    uuid: string,
    name: string,
    node: string,
    sftp_details: {
        ip: string,
        port: number
    },
    description: string,
    limits: {
        memory: number,
        swap: number,
        disk: number,
        io: number,
        cpu: number,
        threads: null | string,
        oom_disabled: boolean
    },
    invocation: string,
    docker_image: string,
    egg_features: null,
    feature_limits: {
        databases: number,
        allocations: number,
        backups: number
    },
    status: null,
    is_suspended: boolean,
    is_installing: boolean,
    relationships?: any,
}

export interface ClientAccount {
    id: number;
    admin: boolean;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    language: string;
}

export interface ClientApiKey {
    identifier: string,
    description: string,
    allowed_ips: string[],
    last_used_at: string,
    created_at: string
}

export interface ClientPermissions {
    object: "system_premissions";
    attributes: {
        permissions: {
            [key: string]: {
                description: string,
                keys: {
                    [key: string]: string
                }
            }
        }
    }
}

export interface ClientAccountFetch {
    object: "user",
    attributes: ClientAccount
}

export interface ClientServerFetchAllResponse {
    object: "list";
    data: { object: "server", attributes: ClientServer }[]
}

export interface ClientServerFetchResponse {
    object: "server";
    attributes: ClientServer,
    meta: {
        is_server_owner: boolean,
        user_permissions: string[]
    }
}

export interface ClientAccountApiKeysFetchAllResponse {
    object: "list",
    data: {
        object: "api_key",
        attributes: ClientApiKey
    }[]
}

export interface ClientAccountApiKeysCreateResponse {
    object: "api_key",
    attributes: ClientApiKey,
    meta: {
        secret_token: string
    }
}

export interface ClientAccountTwoFactorFetchResponse {
    data: {
        image_url_data: string,
        secret: string
    }
}

export interface ClientAccountTwoFactorEnableResponse {
    object: "recovery_tokens",
    attributes: {
        tokens: string[]
    }
}

export interface ClientAccountServerWebsocketDetails {
    data: {
        token: string,
        socket: string
    }
}

export interface serverWebsocketManagerConfig {
    socket?: string, 
    token?: string, 
    origin: string
}

export interface serverWebsocketManagerEvents {
    "connect": () => any;
    "authentication": () => any;
    "error": (data: string) => any;
    "disconnect": () => any;
    "tokenExpired": () => any;
    "daemonMessage": (message: string) => any;
    "installMessage": (message: string) => any;
    "installStarted": () => any;
    "installCompleted": () => any;
    "console": (message: string) => any;
    "status": (message: string) => any;
    "stats": (data: {
        cpu_absolute: number,
        disk_bytes: number,
        memory_bytes: number,
        memory_limit_bytes: number,
        network: {rx_bytes: number, tx_bytes: number},
        state: string,
        uptime: number
    }) => any;
    "backupRestoreCompleted": () => any;
    "backupCompleted": () => any;
    "transferLogs": (message: string) => any;
    "transferStatus": (data: string) => any;
    "deleted": () => any;
    "daemonError": (message: string) => any;
}