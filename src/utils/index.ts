import type {
    ClientServerFetchAll,
    ClientServerFetchQry,
    PaginatingMeta,
} from "../types/client";
import type { WrapdactylBaseClass } from "../wrapdactyl";
import { rQry } from "./parsers";

export const pageToPages = async <T, K extends string>(
    request: WrapdactylBaseClass["request"],
    url: string,
    page: number,
    qry?: K[]
) => {
    // Fetch defined page
    if (typeof page !== "number" || page !== 0)
        return request<T>(`${url}?page=${page}${rQry(qry, true)}`);

    // Fetch the first page
    let data = await request<T & { data: any[]; meta: PaginatingMeta }>(
        `${url}?page=1${rQry(qry, true)}`
    );

    // Return if there is only 1 page
    if (data.meta.pagination.total_pages === 1) return data;

    // Start from page 2 as page 1 is already fetched
    for (let i = 2; i <= data.meta.pagination.total_pages; i++) {
        await request(`${url}?page=${i}${rQry(qry, true)}`).then((x: any) => {
            data.data.push(...x.data);
        });
    }

    // Update the meta to remove confusion
    data.meta.pagination = {
        ...data.meta.pagination,
        current_page: data.meta.pagination.total_pages,
        count: data.data.length,
        per_page: data.data.length,
    };

    return data;
};
