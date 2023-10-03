import { version as projectVersion } from "../package.json";
import type {
    WrapdactylConfig,
    WrapdactylOptions,
    WrapdactylParams,
    WrapdactylRequest,
} from "./types";
import { isValid } from "./utils/validation";
import { pingWebsite, checkToken } from "./utils/apiCheck";
import axios from "axios";

export class WrapdactylBaseClass {
    constructor(params: WrapdactylParams) {
        if (!params)
            throw new Error("Wrapdactyl - Expected 1 arguments, but got 0");

        // Updating the config
        Object.defineProperty(this, "config", {
            enumerable: false,
            value: {
                url: params.url,
                client: params.client,
                application: params.application,
            },
        });

        // Validating the URL
        if (!isValid.url(params.url))
            throw new Error("Wrapdactyl - Invalid panel url");

        // Validating the tokens
        if (!params.client && !params.application)
            throw new Error(
                "Wrapdactyl - One of the API tokens must be present"
            );
        if (params.client && !isValid.token(params.client))
            throw new Error("Wrapdactyl - Invalid Client API token");
        else
            Object.defineProperty(this.config, "client", {
                enumerable: false,
            });
        if (params.application && !isValid.token(params.application))
            throw new Error("Wrapdactyl - Invalid Application API token");
        else
            Object.defineProperty(this.config, "application", {
                enumerable: false,
            });

        // Update options
        this.options = {
            url: params.url,
            timeout: 5000,
            userAgent: `Wrapdactyl/${projectVersion} (Node.js/${process.version}; ${process.platform}; Beta)`,
            cache: false,
            ...params.options,
        };
    }

    // Variables
    protected config!: WrapdactylConfig;
    options!: WrapdactylOptions;

    static isValid = isValid;

    /**
     * Make a request to pterodactyl panel
     */
    request = async <T>(params: WrapdactylRequest): Promise<T> => {
        if (!params)
            throw new Error("Wrapdactyl - Expected 1 arguments, but got 0");
        if (typeof params === "string") params = { url: params };

        // Check how the route starts
        const token = params.url.startsWith("/api/client")
            ? this.config.client
            : params.url.startsWith("/api/application")
            ? this.config.application
            : undefined;
        if (!token) throw new Error("Wrapdactyl - Invalid URL startpoint path");

        // Initialise configuration before making the request
        params.url = this.config.url + params.url;
        params.timeout = this.options.timeout;
        params.headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": this.options.userAgent,
            ...params.headers,
        };

        return axios(params).then((x) => x.data);
    };

    /**
     * Checks the status of the Pterodactyl panel and tokens.
     */
    status = async (): Promise<{
        panel: boolean;
        client: null | boolean;
        application: null | boolean;
        ping: number;
    }> => {
        const [ping, client, application] = await Promise.all([
            pingWebsite(this.config.url, this.options),
            checkToken(this.request, this.config.client, "/api/client"),
            checkToken(
                this.request,
                this.config.application,
                "/api/application/locations"
            ),
        ]);

        return {
            panel: !!ping,
            client,
            application,
            ping,
        };
    };
}
