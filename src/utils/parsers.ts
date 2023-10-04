/**
 * Request query parser
 */
export const rQry = (qrys?: string[], q?: boolean) => {
    if (!qrys || !qrys.length) return "";
    else return `${q ? "&" : "?"}include=${qrys.join(",")}`;
};
