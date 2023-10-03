import axios from "axios";
import type { WrapdactylBaseClass } from "../wrapdactyl";
import type { WrapdactylOptions } from "../types";

export async function pingWebsite(
    url: string,
    options: WrapdactylOptions
): Promise<number> {
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
}

export async function checkToken(
    request: WrapdactylBaseClass["request"],
    token: string | undefined,
    path: string
): Promise<boolean | null> {
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
}
