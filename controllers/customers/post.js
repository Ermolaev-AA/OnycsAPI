import Utils from '../../utils/index.js'
import ServiceCustomers from '../../services/customers/index.js'

const Validation = Utils.Validation
const Formatted = Utils.Formatted

export const create = async (req, res) => {
    try {
        const { body, headers } = req
        const owner_id = body?.owner_id
        const name = body?.name
        const phone = Formatted.phone(body?.phone)
        const url = body?.url || headers.referer || headers.origin
        const ip = body?.ip || req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress

        if (!name) return res.status(400).json({ error: 'The required «name» parameter is missing!' })
        if (!phone) return res.status(400).json({ error: 'The required «phone» parameter is missing!' })
        if (!url) return res.status(400).json({ error: 'The required «url» parameter is missing!' })
        if (!ip) return res.status(400).json({ error: 'The required «ip» parameter is missing!' })

        if (!Validation.isIPv4(ip)) return res.status(400).json({ error: 'Invalid IP address!' })
        if (!Validation.isURL(url)) return res.status(400).json({ error: 'Invalid URL!' })

        const objUrl = new URL(url)
        const strCookie = body?.cookie || headers?.cookie

        const domain = Formatted.domainRemovePrefixWWW(objUrl?.hostname)
        const params = Object.fromEntries(objUrl.searchParams.entries())
        const cookies = Utils.parseCookies(strCookie)
        const connect_report = {
            user_ip: ip,
            user_agent: headers['user-agent']
        }

        const newCustomer = { owner_id, name, phone, url, domain, params, cookies, connect_report }

        const result = await ServiceCustomers.create(newCustomer)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const sendСomplaint = async (req, res) => {
    try {
        const { body } = req
        const phone = Formatted.phone(body?.phone)

        if (!phone) return res.status(400).json({ error: 'The required «phone» parameter is missing!' })

        const result = await ServiceCustomers.sendСomplaint(phone)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}