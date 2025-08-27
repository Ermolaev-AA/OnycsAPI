import Utils from '../../utils/index.js'
import ServiceCustomers from '../../services/customers/index.js'

const Validation = Utils.Validation
const Formatted = Utils.Formatted
const Build = Utils.Build

export const create = async (req, res) => {
    try {
        const { body } = req

        if (!body) return res.status(400).json({ error: 'The required «body» parameter is missing!' })

        // const owner_id = body?.owner_id
        // const name = body?.name
        // const phone = Formatted.phone(body?.phone)
        // const url = body?.url || headers.referer || headers.origin
        // const ip = body?.ip || req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress

        // if (!name) return res.status(400).json({ error: 'The required «name» parameter is missing!' })
        // if (!phone) return res.status(400).json({ error: 'The required «phone» parameter is missing!' })
        // if (!url) return res.status(400).json({ error: 'The required «url» parameter is missing!' })
        // if (!ip) return res.status(400).json({ error: 'The required «ip» parameter is missing!' })

        // if (!Validation.isIPv4(ip)) return res.status(400).json({ error: 'Invalid IP address!' })
        // if (!Validation.isURL(url)) return res.status(400).json({ error: 'Invalid URL!' })

        // Is Build Model
        // const objUrl = new URL(url)
        // const strCookie = body?.cookie || headers?.cookie

        // const domain = Formatted.domainRemovePrefixWWW(objUrl?.hostname)
        // const params = Object.fromEntries(objUrl.searchParams.entries())
        // const cookies = Utils.parseCookies(strCookie)
        // const connect_report = {
        //     user_ip: ip,
        //     user_agent: headers['user-agent']
        // }

        const reqCustomer = Build.Customer.request(req)
        const result = await ServiceCustomers.create(reqCustomer)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const sendСomplaint = async (req, res) => {
    try {
        const { body, params } = req
        const phone = body?.phone || params?.phone
        const num = Formatted.phone(phone)

        if (!num) return res.status(400).json({ error: 'The required «phone» parameter is missing!' })

        const result = await ServiceCustomers.sendСomplaint(num)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const sendDeal = async (req, res) => {
    try {
        const { body, params } = req
        const id = body?.id || params?.id
        const dealId = body?.crm_deal_id || params?.crm_deal_id
        const contactId = body?.crm_contact_id || params?.crm_contact_id

        if (!id) return res.status(400).json({ error: 'The required «id» parameter is missing!' })
        if (!dealId) return res.status(400).json({ error: 'The required «crm_deal_id» parameter is missing!' })

        const result = await ServiceCustomers.sendDeal({ id, dealId, contactId })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const sendNewlead = async (req, res) => {
    try {
        const { body, query } = req

        if (!body) return res.status(400).json({ error: 'The required «body» parameter is missing!' })
        if (!query?.webhook) return res.status(400).json({ error: 'The required «webhook» parameter is missing!' })

        console.log('REQUEST ➜', req) // DEV
        console.log('BODY ➜', body) // DEV
        console.log('QUERY ➜', query) // DEV

        const result = await ServiceCustomers.sendNewlead(body, query)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}