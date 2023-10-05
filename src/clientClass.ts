import type {
    ClientAccountApiKeysCreateResponse,
    ClientAccountApiKeysFetchAllResponse,
    ClientAccountFetch,
    ClientAccountServerWebsocketDetails,
    ClientAccountTwoFactorEnableResponse,
    ClientAccountTwoFactorFetchResponse,
    ClientPermissions,
    ClientServerFetchAll,
    ClientServerFetchQry,
    ClientServerFetchResponse,
} from "./types/client";
import { pageToPages } from "./utils";
import { rQry } from "./utils/parsers";
import srvWsClass from "./utils/srvWsClass";
import { WrapdactylBaseClass } from "./wrapdactyl";

export class ClientClass extends WrapdactylBaseClass {
    client = {
        /** @warn Types for this function wont be defined as new updates keeps updating them */
        permissions: () =>
            this.request<ClientPermissions>("/api/client/permissions"),

        /** Client account Manager*/
        account: {
            /**
             * @todo Implement up to date cache when webhooks will be added to pterodactyl (feature request)
             * @warn The cache isnt kept up to date.
             */
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
            }) => {
                if (!params)
                    throw new Error(
                        "Wrapdactyl - Expected 1 arguments, but got 0"
                    );
                if (!params.oldPassword || !params.newPassword)
                    throw new Error(
                        "Wrapdactyl - oldPassword and newPassword values must be defined"
                    );
                return this.request<void>({
                    url: "/api/client/account/password",
                    method: "PUT",
                    data: {
                        current_password: params.oldPassword,
                        password: params.newPassword,
                        password_confirmation: params.newPassword,
                    },
                }).then(() => {});
            },

            /** Client API keys manager */
            apiKeys: {
                fetchAll: () =>
                    this.request<ClientAccountApiKeysFetchAllResponse>(
                        "/api/client/account/api-keys"
                    ),
                create: (params: {
                    description: string;
                    allowed_ips?: string[];
                }) => {
                    if (!params)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    if (!params.description)
                        throw new Error(
                            "Wrapdactyl - description value must be defined"
                        );

                    return this.request<ClientAccountApiKeysCreateResponse>({
                        url: "/api/client/account/api-keys",
                        method: "POST",
                        data: params,
                    });
                },
                delete: (id: string) => {
                    if (!id)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    return this.request<void>({
                        url: `/api/client/account/api-keys/${id}`,
                        method: "DELETE",
                    }).then(() => {});
                },
            },
            /**
             * Two factor authentification manager
             * @todo Test this when i will understand how it works 😂
             */
            twofa: {
                fetch: () =>
                    this.request<ClientAccountTwoFactorFetchResponse>(
                        "/api/client/account/two-factor"
                    ),
                enable: (code: string | number) => {
                    if (!code)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    return this.request<ClientAccountTwoFactorEnableResponse>({
                        url: "/api/client/account/two-factor",
                        method: "POST",
                        data: { code: code.toString() },
                    });
                },
                disable: (params: { password: string }) => {
                    if (!params)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    if (!params.password)
                        throw new Error(
                            "Wrapdactyl - Password value must be present"
                        );
                    return this.request<void>({
                        url: "/api/client/account/two-factor",
                        method: "DELETE",
                        data: { password: params.password },
                    });
                },
            },
        },

        /** Client Servers manager */
        servers: {
            fetch: <K extends keyof ClientServerFetchQry = never>(
                id: string,
                qry?: K[]
            ) => {
                if (!id)
                    throw new Error(
                        "Wrapdactyl - Expected 1 arguments, but got 0"
                    );
                return this.request<
                    ClientServerFetchResponse<Pick<ClientServerFetchQry, K>>
                >(`/api/client/servers/${id}${rQry(qry)}`);
            },
            fetchAll: <K extends keyof ClientServerFetchQry = never>(
                page: number = 0,
                qry?: K[]
            ) =>
                pageToPages<
                    ClientServerFetchAll<Pick<ClientServerFetchQry, K>>,
                    K
                >(this.request, `/api/client`, page, qry),
            websocketDetails: (id: string) => {
                if (!id)
                    throw new Error(
                        "Wrapdactyl - Expected 1 arguments, but got 0"
                    );
                return this.request<ClientAccountServerWebsocketDetails>(
                    `/api/client/servers/${id}/websocket`
                );
            },
            websocket: srvWsClass(this),
        },
    };
}
