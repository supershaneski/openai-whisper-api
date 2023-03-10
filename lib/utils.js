export function getSimpleId() {
    return Math.random().toString(26).slice(2);
}

export function removeTrailingSlash(s) {
    return s.replace(/\/+$/,'')
}

export function cleanInput(s) {
    if (typeof s === "undefined") return "";
    if (s === null) return "";
    return s.trim();
}
