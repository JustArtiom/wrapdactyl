import type { WrapdactylOptions } from "../types";
import type { WrapdactylBaseClass } from "../wrapdactyl";
import axios from "axios";

export const isValid = {
    token_struc: (token: string) => typeof token === "string",
    url_struc: (url: string) =>
        /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(\d+\.\d+\.\d+\.\d+))(:[0-9]{1,5})?([^\s]*)?$/.test(
            url
        ),

    pingWebsite: async (
        url: string,
        options: WrapdactylOptions
    ): Promise<number> => {
        try {
            const start = Date.now();
            await axios.get(url, {
                headers: {
                    timeout: options?.timeout,
                    "User-Agent": options?.userAgent,
                },
            });
            return Date.now() - start;
        } catch (error) {
            return 0; // Website is offline
        }
    },

    checkToken: async (
        request: WrapdactylBaseClass["request"],
        token: string | undefined,
        path: string
    ): Promise<boolean | null> => {
        if (!token) {
            return null; // Token is not configured
        }

        try {
            await request({
                url: path,
            });
            return true; // Token is valid
        } catch (error) {
            return false; // Token is not valid
        }
    },
};
