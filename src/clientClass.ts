import type { ClientAccountFetch, ClientPermissions } from "./types/client";
import { WrapdactylBaseClass } from "./wrapdactyl";

export class clientClass extends WrapdactylBaseClass {
    client = {
        /**
         * @warn Types for this function wont be defined as new updates keeps updating them
         */
        permissions: () =>
            this.request<ClientPermissions>("/api/client/permissions"),

        account: {
            cache: new Map(),
            fetch: () =>
                this.request<ClientAccountFetch>("/api/client/account"),
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
                    body: params,
                }).then(() => {});
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
                    body: {
                        current_password: params.oldPassword,
                        password: params.newPassword,
                        password_confirmation: params.newPassword,
                    },
                }).then(() => {});
            },
        },
    };
}
