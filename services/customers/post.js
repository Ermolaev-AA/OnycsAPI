import Utils from '../../utils/index.js'

import ModelCustomers from '../../models/customers.js'
import ModelCompanies from '../../models/companies.js'
import ServiceIPQS from '../external/ipqs/index.js'

const Formatted = Utils.Formatted
const Validation = Utils.Validation

export const create = async (req) => {
    const { body, headers } = req
    const result = { created: [], errors: [] }

    try {
        const url = headers.referer || headers.origin || body.url
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || body.ip

        // Это наверное лучше в коллектор
        if (!Validation.isIPv4(ip)) {
            console.log('IP is valid!') // DEBUG

            result.errors.push({ input: body, message: 'IP is valid!' })
            return result
        }

        // Это наверное лучше в коллектор
        if (!Validation.isURL(url)) {
            console.log('URL is valid!') // DEBUG

            result.errors.push({ input: body, message: 'URL is not valid' })
            return result
        }

        const objUrl = new URL(url)
        const domain = Formatted.domainRemovePrefixWWW(objUrl.hostname)

        let ownerId = body.owner_id

        // Нужна отдельная функция по поиску компании по имеющимся данным
        if (!ownerId) {
            const company = await ModelCompanies.findOne({ domains: domain })

            if (!company) {
                result.errors.push({ input: body, message: `Owner not found for domain: ${domain}` })
                return result
            }

            ownerId = company._id
        }

        const customer = {
            // Father
            owner_id: ownerId,
            // Field
            name: body.name,
            phone: body.phone,
            // Web Data
            url: url,
            domain: domain,
            params: Object.fromEntries(objUrl.searchParams.entries()),
            cookies: headers?.cookie ? Utils.parseCookies(headers.cookie) : {},
            // User Report
            connection_report: await ServiceIPQS.getReport(ip),
            phone_report: 123
        }


        console.log(customer)
        

    } catch (error) {
        result.errors.push({
            input: body,
            message: error.message
        })
    }

    return result
}
