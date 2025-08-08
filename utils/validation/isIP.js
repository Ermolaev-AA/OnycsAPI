import net from 'net'

export const isIPv4 = (str) => {
    const v = net.isIP(str)

    if (v !== 4) return false
    return true
}

export const isIPv6 = (str) => {
    const v = net.isIP(str)

    if (v !== 6) return false
    return true
}