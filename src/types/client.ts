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
    attributes: {
        id: number;
        admin: boolean;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        language: string;
    };
}

export interface ClientApiKey {
    identifier: string;
    description: string;
    allowed_ips: string[];
    last_used_at: null | Date;
    created_at: Date;
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
