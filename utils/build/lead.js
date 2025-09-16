import net from 'net'

import ServiceIPQS from '../../services/external/ipqs/index.js'
import ModelCustomers from '../../models/customers.js'
import ModelCompanies from '../../models/companies.js'

import { getPhoneReport } from '../../services/get.js'

import Formatted from '../formatted/index.js'
import Validation from '../validation/index.js'

const request = (req, settings = {}) => {
    try {
        const { body, headers } = req
        const { source = 'create' } = settings // if more var...
        const { data } = body

        const name = body?.name || data?.name
        const phone = Formatted.phone(body?.phone) || Formatted.phone(data?.phone)
        const url = req.clientReferer || body?.url || data?.url || headers.referer || headers.origin
        const userIP = req.clientIP || body?.user_ip || data?.user_ip || data?.['user-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
        const userAgent = req.clientUserAgent || body?.user_agent || data?.user_agent || data?.['user-agent'] || headers['user-agent']
    
        if (!name) throw new Error('The required «name» parameter is missing!')
        if (!phone) throw new Error('The required «phone» parameter is missing!')
        if (!url) throw new Error('The required «url» parameter is missing!')
        if (!userIP) throw new Error('The required «user_ip» parameter is missing!')
        if (!userAgent) throw new Error('The required «user_agent» parameter is missing!')
    
        if (!Validation.isIPv4(userIP)) throw new Error('Invalid USER IP address!')
        if (!Validation.isURL(url)) throw new Error('Invalid URL!')
    
        const ownerID = body?.owner_id || data?.owner_id || data?.['owner-id']

        const objURL = new URL(url)
        const domain = Formatted.domainRemovePrefixWWW(objURL?.hostname)

        const params = req.objURLParams || body?.params
        const cookies = req.objCookies || body?.cookies
    
        return { ownerID, name, phone, url, domain, params, cookies, userIP, userAgent }
    } catch (error) {
        if (!error.message) throw new Error('Unknown error occurred!')
        throw error
    }
}

const response = async (body) => {
    try {
        const { name, phone, url, domain, params, cookies, userIP, userAgent } = body
        const ownerID = body?.ownerID || await ModelCompanies.findOne({ domains: domain }).then(res => res._id) || '688b676870d49260494b5940'

        const orConditions = []
        const detailsIP = await getDetailsIP(userIP)
        const { octets } = detailsIP
        const incompleteIP = `${octets[0]}.${octets[1]}.${octets[2]}`
        
        if (phone) orConditions.push({ phone: phone })
        if (params?.yclid) orConditions.push({ 'params.yclid': params.yclid })
        if (cookies?._ym_uid) orConditions.push({ 'cookies._ym_uid': cookies._ym_uid })
        if (detailsIP?.network) orConditions.push({ 'connect_report.network': detailsIP.network })
        if (incompleteIP) orConditions.push({ 'connect_report.user_ip': { $regex: incompleteIP, $options: 'i' } })

        if (orConditions.length === 0) throw new Error('The required «phone» parameter is missing!')

        const globalDuplicates = await ModelCustomers.find({ $or: orConditions })
        const localDuplicates = globalDuplicates.filter(duplicate => 
            duplicate.owner_id.toString() === ownerID.toString()
        )

        const isLocalDuplicate  = Boolean(localDuplicates.length)
        const isGlobalDuplicate = Boolean(globalDuplicates.length)

        const contactReport = await getPhoneReport(phone)
        const connectReport = {
            user_ip: userIP,
            user_agent: userAgent,
            network_type: detailsIP.type,
            network: detailsIP.network,
            asn: detailsIP.asn,
            as_name: detailsIP.as_name,
            as_domain: detailsIP.as_domain,
            country: detailsIP.country,
            country_code: detailsIP.country_code,
            continent: detailsIP.continent,
            continent_code: detailsIP.continent_code,
            // ipqs_report: await ServiceIPQS.getReport(userIP), // (OLD)
        }

        const resEvaluateFraud = evaluateFraud({ globalDuplicates, localDuplicates, connectReport, contactReport })

        const response = {
            lead: {
                owner_id: ownerID,
                name,
                phone,
                url,
                domain,
                params,
                cookies,
                is_fraud: resEvaluateFraud.is_fraud,
                is_local_duplicate: isLocalDuplicate,
                is_global_duplicate: isGlobalDuplicate,
                connect_report: connectReport,
                contact_report: contactReport,
            },
            local_duplicates: localDuplicates,
            global_duplicates: globalDuplicates,
            evaluate_fraud: resEvaluateFraud,
        }

        return response
    } catch (error) {
        if (!error.message) throw new Error('Unknown error occurred!')
        throw error
    }
}

export default { request, response }


// Надо перенести
function evaluateFraud({ globalDuplicates, localDuplicates, connectReport, contactReport }) {
    let result = { is_fraud: false, reason: [] }

    const wa = contactReport?.whatsapp_exists || false
    const dupWithSameNetwork = globalDuplicates.find( duplicate => duplicate.connect_report?.network === connectReport?.network )
    const dupWithSameUserIP = globalDuplicates.find( duplicate => duplicate.connect_report?.user_ip === connectReport?.user_ip )
    const networkType = connectReport?.network_type
    const country = connectReport?.country || 'Russia'

    const currDate = new Date()
    const threeMonthsAgo = new Date(currDate.getTime())
    threeMonthsAgo.setMonth(currDate.getMonth() - 1)
    
    const dupLast3m = localDuplicates.filter(duplicate => {
        const createdAt = new Date(duplicate.createdAt)
        return createdAt >= threeMonthsAgo
    })

    if (wa === false) {
        result.is_fraud = true 
        result.reason.push('Whatsapp does not exist!')
    }
    if (dupWithSameNetwork || dupWithSameUserIP) {
        result.is_fraud = true 
        result.reason.push('There is a network duplicate!')
    }
    if (networkType !== 'IPv4') {
        result.is_fraud = true 
        result.reason.push('Invalid network type!')
    }
    if (country !== 'Russia') {
        result.is_fraud = true
        result.reason.push('Connection is not from Russia!')
    }
    if (dupLast3m.length > 3) {
        result.is_fraud = true
        result.reason.push('More than 3 duplicates in the last month!')
    }

    return result
}

// Надо перенести
const getDetailsIP = async (ip) => {
    const ipType = net.isIP(ip) === 4 ? "IPv4" : net.isIP(ip) === 6 ? "IPv6" : "Invalid"
    if (ipType !== "IPv4") {
        return { type: ipType }
    }
  
    // Разбиваем IPv4
    const octets = ip.split(".").map(Number)
  
    if (octets.length !== 4 || octets.some(o => o < 0 || o > 255)) {
        return { type: "Invalid" }
    }
  
    // Для простоты считаем /24
    const network = `${octets[0]}.${octets[1]}.${octets[2]}.0`
    const broadcast = `${octets[0]}.${octets[1]}.${octets[2]}.255`
    const hostMin = `${octets[0]}.${octets[1]}.${octets[2]}.1`
    const hostMax = `${octets[0]}.${octets[1]}.${octets[2]}.254`

    const url = `https://api.ipinfo.io/lite/${ip}?token=9aa765658b1895`
    const ipInfo = await fetch(url).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
    }).catch(error => {
        console.error('Ошибка при получении данных:', error)
        return null
    })

    return {
        type: ipType,
        octets,
        network,
        broadcast,
        hostMin,
        hostMax,
        asn: ipInfo.asn,
        as_name: ipInfo.as_name,
        as_domain: ipInfo.as_domain,
        country_code: ipInfo.country_code,
        country: ipInfo.country,
        continent_code: ipInfo.continent_code,
        continent: ipInfo.continent
    }
}