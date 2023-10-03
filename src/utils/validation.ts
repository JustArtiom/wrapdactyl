export const isValid = {
    token: (token: string) => typeof token === "string",
    url: (url: string) =>
        /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,})(:[0-9]{1,5})?([^\s]*)?$/.test(
            url
        ),
};
