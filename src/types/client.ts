// To-do: Check the typings as some of them are definetly wrong.
// I was too lazy to check the src of pterodactyl panel api

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
    identifier: string;
    description: string;
    allowed_ips: string[];
    last_used_at: null | Date;
    created_at: Date;
}

export interface ClientServer<T> {
    server_owner: boolean;
    identifier: string;
    internal_id: number;
    uuid: string;
    name: string;
    node: string;
    sftp_details: {
        ip: string;
        port: number;
    };
    description: string;
    limits: {
        memory: number;
        swap: number;
        disk: number;
        io: number;
        cpu: number;
        threads: null | string;
        oom_disabled: boolean;
    };
    invocation: string;
    docker_image: string;
    egg_features: string[];
    feature_limits: {
        databases: number;
        allocations: number;
        backups: number;
    };
    status: string | null;
    is_suspended: boolean;
    is_installing: boolean;
    is_transferring: boolean;
    relationships: {
        allocations: {
            object: "list";
            data: {
                object: "allocation";
                attributes: ClientAllocation;
            }[];
        };
        variables: {
            object: "list";
            data: {
                object: "egg_variable";
                attributes: ClientEggVariable;
            }[];
        };
    } & T;
}

export interface ClientAllocation {
    id: number;
    ip: string;
    ip_alias: null | string;
    port: number;
    notes: null | string;
    is_deafault: boolean;
}

export interface ClientEggVariable {
    name: string;
    description: string;
    env_variable: string;
    default_value: string;
    server_value: string;
    is_editable: boolean;
    rules: string;
}

export interface ClientServerSubuser {
    uuid: string;
    username: string;
    email: string;
    image: string;
    "2fa_enabled": boolean;
    created_at: Date;
    permissions: string[];
}

export interface ClientError {
    code: string;
    status: string;
    detail: string;
    meta: null | {
        source_field: string;
        rule: string;
    };
}

export interface PaginatingMeta {
    pagination: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
        /**
         * @todo find out what type does this value have
         */
        links: any;
    };
}

export interface ClientServerBackup {
    object: "backup";
    attributes: {
        uuid: string;
        name: string;
        ignored_files: string[];
        checksum: string | null;
        bytes: number;
        is_locked: boolean;
        is_successful: boolean;
        created_at: Date;
        completed_at: Date;
    };
}

export interface ClientServerDatabaseRelationshipsPassword {
    password: {
        object: string;
        attributes: {
            password: string;
        };
    };
}

export interface ClientServerDatabase<T> {
    id: string;
    host: {
        address: string;
        port: string;
    };
    name: string;
    username: string;
    connections_from: string;
    max_connections: number;
    relationships: T;
}

export interface ClientServerFileObject {
    name: string;
    mode: string;
    mode_bits: string;
    size: number;
    is_file: boolean;
    is_symlink: boolean;
    mimetype: string;
    created_at: Date;
    modified_at: Date;
}

export interface ClientPermissions {
    object: "system_premissions";
    attributes: {
        permissions: {
            [key: string]: {
                description: string;
                keys: {
                    [key: string]: string;
                };
            };
        };
    };
}

export interface ClientAccountFetch {
    object: "user";
    attributes: ClientAccount;
}

export interface ClientAccountApiKeysFetchAllResponse {
    object: "list";
    data: {
        object: "api_key";
        attributes: ClientApiKey;
    }[];
}

export interface ClientAccountApiKeysCreateResponse {
    object: "api_key";
    attributes: ClientApiKey;
    meta: {
        secret_token: string;
    };
}

export interface ClientAccountTwoFactorFetchResponse {
    data: {
        image_url_data: string;
        secret: string;
    };
}

export interface ClientAccountTwoFactorEnableResponse {
    object: "recovery_tokens";
    attributes: {
        tokens: string[];
    };
}

export interface ClientServerFetchQry {
    egg: {
        object: "egg";
        attributes: {
            uuid: string;
            name: string;
        };
    };
    subusers: {
        object: "list";
        data: {
            object: "server_subuser";
            attributes: ClientServerSubuser;
        }[];
    };
}

export interface ClientServerFetchResponse<T> {
    object: "server";
    attributes: ClientServer<T>;
    meta: {
        is_server_owner: boolean;
        user_permissions: string[];
    };
}

export interface ClientServerFetchAll<T> {
    object: "list";
    data: { object: "server"; attributes: ClientServer<T> }[];
    meta: PaginatingMeta;
}

export interface ClientAccountServerWebsocketDetails {
    data: {
        token: string;
        socket: string;
    };
}
