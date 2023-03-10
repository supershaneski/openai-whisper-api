export function getSimpleId() {
    return Math.random().toString(26).slice(2);
}

export function removeTrailingSlash(s) {
    return s.replace(/\/+$/,'')
}
