export const isURL = (str) => {
    try {
        new URL(str)
        return true
    } catch {
        return false
    }
}