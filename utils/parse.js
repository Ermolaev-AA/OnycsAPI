export const parseCookies = (strCookies = '') => {
    return Object.fromEntries(
        strCookies
            .split('; ')
            .map(c => c.split('='))
            .filter(([k, v]) => k && v)
            .map(([k, v]) => [k, decodeURIComponent(v)])
    )
}