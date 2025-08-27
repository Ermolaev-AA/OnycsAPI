import Formatted from '../formatted/index.js'
import Validation from '../validation/index.js'

export const request = (req, settings = {}) => {
    try {
        const { body, headers } = req
        const { source = 'create' } = settings // if more var...
        const { data } = body

        const name = body?.name || data?.name
        const phone = Formatted.phone(body?.phone) || Formatted.phone(data?.phone)
        const url = body?.url || data?.url || headers.referer || headers.origin
        const userIP = body?.user_ip || data?.user_ip || data?.['user-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
        const userAgent = body?.user_agent || data?.user_agent || data?.['user-agent'] || headers['user-agent']
    
        if (!name) throw new Error('The required «name» parameter is missing!')
        if (!phone) throw new Error('The required «phone» parameter is missing!')
        if (!url) throw new Error('The required «url» parameter is missing!')
        if (!userIP) throw new Error('The required «user_ip» parameter is missing!')
        if (!userAgent) throw new Error('The required «user_agent» parameter is missing!')
    
        if (!Validation.isIPv4(userIP)) throw new Error('Invalid USER IP address!')
        if (!Validation.isURL(url)) throw new Error('Invalid URL!')
    
        const ownerID = body?.owner_id || data?.owner_id || data?.['owner-id']
        const cookie = body?.cookie || data?.cookie || headers?.cookie
    
        return { ownerID, name, phone, url, cookie, userIP, userAgent }
    } catch (error) {
        if (!error.message) throw new Error('Unknown error occurred!')
        throw error
    }
}