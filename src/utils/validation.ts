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

        return await request({
            url: path,
        })
            .then(() => true)
            .catch(() => false);
    },
};

export function includes<S extends string>(
    haystack: readonly S[],
    needle: string
): needle is S {
    const _haystack: readonly string[] = haystack;
    return _haystack.includes(needle);
}
