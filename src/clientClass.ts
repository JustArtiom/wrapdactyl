import type {
    ClientAccountApiKeysCreateResponse,
    ClientAccountApiKeysFetchAllResponse,
    ClientAccountFetch,
    ClientAccountTwoFactorEnableResponse,
    ClientAccountTwoFactorFetchResponse,
    ClientPermissions,
} from "./types/client";
import { WrapdactylBaseClass } from "./wrapdactyl";

export class clientClass extends WrapdactylBaseClass {
    client = {
        /**
         * @warn Types for this function wont be defined as new updates keeps updating them
         */
        permissions: () =>
            this.request<ClientPermissions>("/api/client/permissions"),

        account: {
            cache: {
                object: "user",
                attributes: {
                    id: 0,
                    admin: false,
                    username: "",
                    email: "",
                    first_name: "",
                    last_name: "",
                    language: "",
                },
                last_updated: 0,
            },

            fetch: () =>
                this.request<ClientAccountFetch>("/api/client/account").then(
                    (x) => {
                        if (this.options.cache)
                            this.client.account.cache = {
                                ...x,
                                last_updated: Date.now(),
                            };
                        return x;
                    }
                ),

            updateEmail: (params: { email: string; password: string }) => {
                if (!params)
                    throw new Error(
                        "Wrapdactyl - Expected 1 arguments, but got 0"
                    );
                if (!params.email || !params.password)
                    throw new Error(
                        "Wrapdactyl - Email and password values must be defined"
                    );

                return this.request<void>({
                    url: "/api/client/account/email",
                    method: "PUT",
                    data: params,
                }).then(() => {
                    if (this.options.cache) {
                        this.client.account.cache.attributes.email =
                            params.email.trim().toLowerCase();
                        this.client.account.cache.last_updated = Date.now();
                    }
                });
            },

            updatePassword: (params: {
                oldPassword: string;
                newPassword: string;
            }): Promise<void> => {
                if (!params)
                    throw new Error(
                        "Wrapdactyl - Expected 1 arguments, but got 0"
                    );
                if (!params.oldPassword || !params.newPassword)
                    throw new Error(
                        "Wrapdactyl - oldPassword and newPassword values must be defined"
                    );
                return this.request({
                    url: "/api/client/account/password",
                    method: "PUT",
                    data: {
                        current_password: params.oldPassword,
                        password: params.newPassword,
                        password_confirmation: params.newPassword,
                    },
                }).then(() => {});
            },

            apiKeys: {
                fetchAll: (): Promise<ClientAccountApiKeysFetchAllResponse> =>
                    this.request("/api/client/account/api-keys"),
                create: (params: {
                    description: string;
                    allowed_ips?: string[];
                }): Promise<ClientAccountApiKeysCreateResponse> => {
                    if (!params)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    if (!params.description)
                        throw new Error(
                            "Wrapdactyl - description value must be defined"
                        );

                    return this.request({
                        url: "/api/client/account/api-keys",
                        method: "POST",
                        data: params,
                    });
                },
                delete: (identifier: string): Promise<void> => {
                    if (!identifier)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    return this.request({
                        url: `/api/client/account/api-keys/${identifier}`,
                        method: "DELETE",
                    }).then(() => {});
                },
            },
            twofa: {
                fetch: (): Promise<ClientAccountTwoFactorFetchResponse> =>
                    this.request("/api/client/account/two-factor"),
                enable: (
                    code: string | number
                ): Promise<ClientAccountTwoFactorEnableResponse> => {
                    if (!code)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    return this.request({
                        url: "/api/client/account/two-factor",
                        method: "POST",
                        data: { code: code.toString() },
                    });
                },
                disable: (params: { password: string }): Promise<void> => {
                    if (!params)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    if (!params.password)
                        throw new Error(
                            "Wrapdactyl - Password value must be present"
                        );
                    return this.request({
                        url: "/api/client/account/two-factor",
                        method: "DELETE",
                        data: { password: params.password },
                    });
                },
            },
        },
    };
}
