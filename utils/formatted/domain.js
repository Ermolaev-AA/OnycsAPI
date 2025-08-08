export const domainRemovePrefixWWW = (str) => {
    return str.startsWith('www.') ? str.slice(4) : str
}