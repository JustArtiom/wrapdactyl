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
