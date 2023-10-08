import type {
    ClientAccountApiKeysCreateResponse,
    ClientAccountApiKeysFetchAllResponse,
    ClientAccountFetch,
    ClientAccountServerWebsocketDetails,
    ClientAccountTwoFactorEnableResponse,
    ClientAccountTwoFactorFetchResponse,
    ClientPermissions,
    ClientServer,
    ClientServerFetchAll,
    ClientServerFetchQry,
    ClientServerFetchResponse,
    ClientServerFilesCompress,
    ClientServerFilesSignedURL,
    ClientServerFilesFetch,
    ClientServerResourcesResponse,
} from "./types/client";
import { pageToPages } from "./utils";
import { rQry } from "./utils/parsers";
import srvWsClass from "./utils/srvWsClass";
import { WrapdactylBaseClass } from "./wrapdactyl";
import fs from "node:fs";
import FormData from "form-data";
import axios, { Axios, type AxiosProgressEvent } from "axios";
import path from "path";

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
            cache: new Map<
                string,
                ClientServer<Partial<ClientServerFetchQry>>
            >(),
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
                >(`/api/client/servers/${id}${rQry(qry)}`).then((srv) => {
                    if (this.options.cache)
                        this.client.servers.cache.set(
                            srv.attributes.identifier,
                            srv.attributes
                        );
                    return srv;
                });
            },
            fetchAll: <K extends keyof ClientServerFetchQry = never>(
                page: number = 0,
                qry?: K[]
            ) =>
                pageToPages<
                    ClientServerFetchAll<Pick<ClientServerFetchQry, K>>,
                    K
                >(
                    this.request,
                    `/api/client`,
                    page,
                    qry,
                    this.options.cache ? this.client.servers.cache : undefined
                ),
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
            resources: (id: string) => {
                if (!id)
                    throw new Error(
                        "Wrapdactyl - Expected 1 arguments, but got 0"
                    );
                return this.request<ClientServerResourcesResponse>(
                    `/api/client/servers/${id}/resources`
                );
            },
            sendCommand: (id: string, cmd: string) => {
                if (!id || !cmd)
                    throw new Error(
                        "Wrapdactyl - Expected 2 arguments, but got " +
                            (!id && !cmd ? "0" : "1")
                    );
                return this.request<void>({
                    url: `/api/client/servers/${id}/command`,
                    method: "POST",
                    data: { command: cmd },
                }).then(() => {});
            },
            power: (id: string, signal: string) => {
                if (!id || !signal)
                    throw new Error(
                        "Wrapdactyl - Expected 2 arguments, but got " +
                            (!id && !signal ? "0" : "1")
                    );
                if (!["start", "restart", "stop", "kill"].includes(signal))
                    throw new Error(
                        "Wrapdactyl - Invalid power signal. Extected start, restart, stop, kill, but got " +
                            signal
                    );
                return this.request<void>({
                    url: `/api/client/servers/${id}/power`,
                    method: "POST",
                    data: { signal },
                }).then(() => {});
            },
            rename: (id: string, name: string) => {
                if (!id || !name)
                    throw new Error(
                        "Wrapdactyl - Expected 2 arguments, but got " +
                            (!id && !name ? "0" : "1")
                    );
                return this.request<void>({
                    url: `/api/client/servers/${id}/settings/rename`,
                    method: "POST",
                    data: { name },
                }).then(() => {
                    const cahced_server = this.client.servers.cache.get(id);
                    if (this.options.cache && cahced_server) {
                        this.client.servers.cache.set(id, {
                            ...cahced_server,
                            name: name,
                        });
                    }
                });
            },
            reinstall: (id: string) => {
                if (!id)
                    throw new Error(
                        "Wrapdactyl - Expected 1 arguments, but got 0"
                    );
                return this.request<void>({
                    url: `/api/client/servers/${id}/settings/reinstall`,
                    method: "POST",
                }).then(() => {});
            },

            /** File manager */
            files: {
                fetch: (id: string, dir: string = "/") => {
                    if (!id)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    return this.request<ClientServerFilesFetch>(
                        `/api/client/servers/${id}/files/list?directory=${encodeURIComponent(
                            dir
                        )}`
                    );
                },
                content: (id: string, file: string) => {
                    if (!id || !file)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !file ? "0" : "1")
                        );
                    return this.request<string>(
                        `/api/client/servers/${id}/files/contents?file=${encodeURIComponent(
                            file
                        )}`
                    );
                },
                rename: (
                    id: string,
                    obj: { root: string; files: { from: string; to: string }[] }
                ) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.root || !Array.isArray(obj.files))
                        throw new Error(
                            "Wrapdactyl - Expected { root: string, files: { from: string, to: string }[] }"
                        );
                    return this.request<void>({
                        url: `/api/client/servers/${id}/files/rename`,
                        method: "PUT",
                        data: obj,
                    }).then(() => {});
                },
                copy: (id: string, file: string) => {
                    if (!id || !file)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !file ? "0" : "1")
                        );
                    return this.request<void>({
                        url: `/api/client/servers/${id}/files/copy`,
                        method: "POST",
                        data: {
                            location: file,
                        },
                    }).then(() => {});
                },
                create: (id: string, obj: { file: string; data: string }) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.file || !obj.data)
                        throw new Error(
                            "Wrapdactyl - 2nd argument (object) must have defined file and content as strings"
                        );
                    return this.request<void>({
                        url: `/api/client/servers/${id}/files/write?file=${encodeURIComponent(
                            obj.file
                        )}`,
                        headers: {
                            "Content-Type": "text/plain",
                        },
                        method: "POST",
                        data: obj.data.toString(),
                    });
                },
                compress: (
                    id: string,
                    obj: { root: string; files: string[] }
                ) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.root || !Array.isArray(obj.files))
                        throw new Error(
                            "Wrapdactyl - Expected { root: string, files: string[] }"
                        );
                    return this.request<ClientServerFilesCompress>({
                        url: `/api/client/servers/${id}/files/compress`,
                        method: "POST",
                        data: obj,
                    });
                },
                decompress: (
                    id: string,
                    obj: { root: string; file: string }
                ) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.root || !obj.file)
                        throw new Error(
                            "Wrapdactyl - Expected { root: string, file: string }"
                        );
                    return this.request<void>({
                        url: `/api/client/servers/${id}/files/decompress`,
                        method: "POST",
                        data: obj,
                    }).then(() => {});
                },
                delete: (
                    id: string,
                    obj: { root: string; files: string[] }
                ) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.root || !Array.isArray(obj.files))
                        throw new Error(
                            "Wrapdactyl - Expected { root: string, files: { from: string, to: string }[] }"
                        );
                    return this.request<void>({
                        url: `/api/client/servers/${id}/files/delete`,
                        method: "POST",
                        data: obj,
                    }).then(() => {});
                },
                createDir: (
                    id: string,
                    obj: { root: string; name: string }
                ) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.root || !obj.name)
                        throw new Error(
                            "Wrapdactyl - Expected { root: string, name: string }"
                        );
                    return this.request<void>({
                        url: `/api/client/servers/${id}/files/create-folder`,
                        method: "POST",
                        data: obj,
                    }).then(() => {});
                },
                download_url: (id: string, file: string) => {
                    if (!id || !file)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !file ? "0" : "1")
                        );
                    return this.request<ClientServerFilesSignedURL>(
                        `/api/client/servers/${id}/files/download?file=${encodeURIComponent(
                            file
                        )}`
                    );
                },
                download: async (
                    id: string,
                    obj: {
                        toDownload: string;
                        destination: string;
                    },
                    stats?: (stats: AxiosProgressEvent) => any
                ) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.toDownload || !obj.destination)
                        throw new Error(
                            "Wrapdactyl - Expected { toDownload: string, destination: string }"
                        );

                    const token = await this.client.servers.files.download_url(
                        id,
                        obj.toDownload
                    );
                    return axios
                        .get(token.attributes.url, {
                            responseType: "arraybuffer",
                            headers: {
                                "User-Agent": this.options.userAgent,
                            },
                            onDownloadProgress: stats,
                        })
                        .then(
                            (response) =>
                                new Promise<void>((resolve, reject) => {
                                    const contentDisposition =
                                        response.headers["content-disposition"];
                                    let filename = "undefiend_name";

                                    if (contentDisposition) {
                                        const match = /filename="(.+?)"/.exec(
                                            contentDisposition
                                        );
                                        if (match) {
                                            filename = match[1];
                                        }
                                    }

                                    const localFilePath = path.join(
                                        __dirname,
                                        filename
                                    );

                                    const fileData = Buffer.from(
                                        response.data,
                                        "binary"
                                    );
                                    fs.writeFile(
                                        localFilePath,
                                        fileData,
                                        (err) => {
                                            if (err) reject();
                                            else resolve();
                                        }
                                    );
                                })
                        );
                },
                upload_url: (id: string) => {
                    if (!id)
                        throw new Error(
                            "Wrapdactyl - Expected 1 arguments, but got 0"
                        );
                    return this.request<ClientServerFilesSignedURL>(
                        `/api/client/servers/${id}/files/upload`
                    );
                },
                upload: async (
                    id: string,
                    obj: { toUpload: string; destination?: string },
                    stats?: (stats: AxiosProgressEvent) => any
                ) => {
                    if (!id || !obj)
                        throw new Error(
                            "Wrapdactyl - Expected 2 arguments, but got " +
                                (!id && !obj ? "0" : "1")
                        );
                    if (!obj.toUpload)
                        throw new Error(
                            "Wrapdactyl - Expected { toUpload: string, destination?: string }"
                        );
                    const token = await this.client.servers.files.upload_url(
                        id
                    );

                    const fileStream = fs.createReadStream(obj.toUpload);
                    const form = new FormData();
                    form.append("files", fileStream);

                    return axios
                        .post<void>(
                            `${token.attributes.url}&directory=${
                                obj.destination
                                    ? encodeURIComponent(obj.destination)
                                    : "/"
                            }`,
                            form,
                            {
                                headers: {
                                    ...form.getHeaders(),
                                    "User-Agent": this.options.userAgent,
                                },
                                onUploadProgress: stats,
                            }
                        )
                        .then(() => {});
                },
            },
        },
    };
}
