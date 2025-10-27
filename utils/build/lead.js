import net from 'net'

import ServiceIPQS from '../../services/external/ipqs/index.js'
import ModelCustomers from '../../models/customers.js'
import ModelCompanies from '../../models/companies.js'

import { getPhoneReport } from '../../services/get.js'
import { defaultFraudRules } from '../../configs/defaultFraudRules.js'

import Formatted from '../formatted/index.js'
import Validation from '../validation/index.js'
import { type } from 'os'

export const request = (req, settings = {}) => {
    try {
        const { body, headers } = req
        const { source = 'create' } = settings // if more var...
        const { data, metadata } = body

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

        const captchaData = body?.captcha_data || data?.captcha_data || metadata?.captcha_data
        const pageTime = body?.page_time || data?.page_time || metadata?.page_time
        const focusTime = body?.focus_time || data?.focus_time || metadata?.focus_time

        // Нужен валидатор правил
        const fraudRules = body?.fraud_rules || data?.fraud_rules || metadata?.fraud_rules || defaultFraudRules
    
        return { ownerID, name, phone, url, domain, params, cookies, userIP, userAgent, captchaData, pageTime, focusTime, fraudRules }
    } catch (error) {
        if (!error.message) throw new Error('Unknown error occurred!')
        throw error
    }
}

export const response = async (body) => {
    try {
        const { name, phone, url, domain, params, cookies, userIP, userAgent, captchaData, pageTime, focusTime, fraudRules } = body
        const ownerID = body?.ownerID || await ModelCompanies.findOne({ domains: domain }).then(res => res._id) || '688b676870d49260494b5940'

        const orConditions = []
        const detailsIP = await getDetailsIP(userIP)
        const { octets } = detailsIP
        const incompleteIP = `${octets[0]}.${octets[1]}.${octets[2]}`

        if (phone) orConditions.push({ phone: phone })
        if (params?.yclid) orConditions.push({ 'params.yclid': params.yclid })
        if (cookies?._ym_uid) orConditions.push({ 'cookies._ym_uid': cookies._ym_uid })
        if (detailsIP?.network) orConditions.push({ 'connect_report.network': detailsIP.network }, { 'network_metadata.network': detailsIP.network })
        if (incompleteIP) orConditions.push({ 'connect_report.user_ip': { $regex: incompleteIP, $options: 'i' } }, { 'network_metadata.user_ip': { $regex: incompleteIP, $options: 'i' } })

        if (orConditions.length === 0) throw new Error('The required «phone» parameter is missing!')

        // На случай если не получится рабораться что тут за суета с массивами...
        // В этой части кода образуются 4 массива с лидами filteredLeads, localFilteredLeads, globalDuplicates
        // и localDuplicates. Каждый играет свою роль в проверке на фрод / не форд и дубль / не дубль.
        // Ключивое отличе групп в жестко зафиксируемых параметрах на пользователе, то есть те парраметры,
        // которые могут существовать только у одного рельного человека. filteredLeads и localFilteredLeads имеют
        // в себе еще параметры которые необходимы для проверки но фактически не относят пользователя к дублю (это network и user_ip),
        // эти данные необходимы для проверки времени жизни IP адресов и сетей в процессе определения мошенеческих действий (фрод / не фрод)
        // Парраметры которые определяют реальные дубли phone, yclid, _ym_uid (в будущем мб появяться еще куки и параметры), иммено эти 
        // данные могут существовать внутри одного пользователя то есть массывы globalDuplicates или localDuplicates

        // console.log({ $or: orConditions })

        const filteredLeads = await ModelCustomers.find({ $or: orConditions })
        const localFilteredLeads = filteredLeads.filter(duplicate => 
            duplicate.owner_id.toString() === ownerID.toString()
        )

        const globalDuplicates = filteredLeads.filter(duplicate => 
            (phone && duplicate.phone === phone) ||
            (params?.yclid && duplicate.params?.yclid === params.yclid) ||
            (cookies?._ym_uid && duplicate.cookies?._ym_uid === cookies._ym_uid)
        )
        
        const localDuplicates = localFilteredLeads.filter(duplicate => 
            (phone && duplicate.phone === phone) ||
            (params?.yclid && duplicate.params?.yclid === params.yclid) ||
            (cookies?._ym_uid && duplicate.cookies?._ym_uid === cookies._ym_uid)
        )

        const isLocalDuplicate  = Boolean(localDuplicates.length)
        const isGlobalDuplicate = Boolean(globalDuplicates.length)

        // console.log(localDuplicates.length)
        // console.log(globalDuplicates.length)

        const personMetadata = await getPhoneReport(phone)
        const networkMetadata = {
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

        const fraudData = { filteredLeads, localFilteredLeads, globalDuplicates, localDuplicates, captchaData, pageTime, focusTime, networkMetadata, personMetadata }
        const fraudMetadata = evaluateFraud(fraudData, fraudRules)

        // console.log(fraudMetadata)

        const response = {
            owner_id: ownerID,
            name,
            phone,
            url,
            domain,
            params,
            cookies,
            is_fraud: fraudMetadata.is_fraud,
            is_local_duplicate: isLocalDuplicate,
            is_global_duplicate: isGlobalDuplicate,
            // connect_report: networkMetadata, // DEL
            // contact_report: personMetadata, // DEL
            person_metadata: personMetadata,
            network_metadata: networkMetadata,
            fraud_metadata: fraudMetadata
        }

        return response
    } catch (error) {
        if (!error.message) throw new Error('Unknown error occurred!')
        throw error
    }
}

// Надо перенести
function evaluateFraud(data, rules) {
    const { filteredLeads, localFilteredLeads, globalDuplicates, localDuplicates, captchaData, pageTime, focusTime, networkMetadata, personMetadata } = data

    const localDuplicatesTTLDate = new Date(Date.now() - rules?.local_duplicates_allowed?.ttl)
    const localDuplicatesTTLArr = localDuplicates.filter(lead => lead.createdAt >= localDuplicatesTTLDate)
    const localDuplicatesExists = localDuplicatesTTLArr.length > rules?.local_duplicates_allowed?.quantity

    const globalDuplicatesTTLDate = new Date(Date.now() - rules?.global_duplicates_allowed?.ttl)
    const globalDuplicatesTTLArr = globalDuplicates.filter(lead => lead.createdAt >= globalDuplicatesTTLDate)
    const globalDuplicatesExists = globalDuplicatesTTLArr.length > rules?.global_duplicates_allowed?.quantity

    const ipUniqueTTLDate = new Date(Date.now() - rules?.ip_unique_ttl)
    const ipUniqueTTLArr = localFilteredLeads.filter(lead => 
        (lead.network_metadata?.user_ip === networkMetadata.user_ip || lead.connect_report?.user_ip === networkMetadata.user_ip) && 
        (lead.createdAt >= ipUniqueTTLDate)
    )
    const ipUniqueExists = ipUniqueTTLArr.length > 0

    const networkUniqueTTLDate = new Date(Date.now() - rules?.network_unique_ttl)
    const networkUniqueTTLArr = localFilteredLeads.filter(lead => 
        (lead.network_metadata?.network === networkMetadata.network || lead.connect_report?.network === networkMetadata.network) && 
        (lead.createdAt >= networkUniqueTTLDate)
    )
    const networkUniqueExists = networkUniqueTTLArr.length > 0

    // console.log('localDuplicatesExists', localDuplicatesExists)
    // console.log('globalDuplicatesExists', globalDuplicatesExists)
    // console.log('ipUniqueExists', ipUniqueExists)
    // console.log('networkUniqueExists', networkUniqueExists)

    let result = { 
        is_fraud: null, 
        verify_enabled: null,
        verify_success: null,
        rules: rules,
        verify: [
            {
                name: 'captcha',
                type: captchaData?.type,
                enabled: rules?.captcha_required,
                success: captchaData?.success === true,
                error_reason: 'Captcha verification failed!'
            },
            {
                name: 'network_type',
                enabled: rules?.valid_ip_required,
                success: networkMetadata?.network_type === 'IPv4',
                error_reason: 'The network type is not valid!'
            },
            {
                name: 'whatsapp',
                enabled: rules?.whatsapp_required,
                success: personMetadata?.whatsapp_exists === true,
                error_reason: 'Whatsapp does not exist!'
            },
            {
                name: 'telegram',
                enabled: rules?.telegram_required,
                success: personMetadata?.telegram_exists === true,
                error_reason: 'Telegram does not exist!'
            },
            {
                name: 'page_time',
                enabled: rules?.page_time > 0,
                success: pageTime > rules?.page_time,
                error_reason: 'page_time'
            },
            {
                name: 'focus_time',
                enabled: rules?.focus_time > 0,
                success: focusTime > rules?.focus_time,
                error_reason: 'focus_time'
            },
            {
                name: 'local_duplicates',
                enabled: rules?.local_duplicates_allowed != null,
                success: localDuplicatesExists === false,
                id_duplicates: localDuplicatesTTLArr.map(lead => lead._id),
                error_reason: 'local_duplicates'
            },
            {
                name: 'global_duplicates',
                enabled: rules?.global_duplicates_allowed != null,
                success: globalDuplicatesExists === false,
                id_duplicates: globalDuplicatesTTLArr.map(lead => lead._id),
                error_reason: 'global_duplicates'
            },
            {
                name: 'ip_unique',
                enabled: rules?.ip_unique_ttl > 0,
                success: ipUniqueExists === false,
                id_duplicates: ipUniqueTTLArr.map(lead => lead._id),
                error_reason: 'ip_unique'
            },
            {
                name: 'network_unique',
                enabled: rules?.network_unique_ttl > 0,
                success: networkUniqueExists === false,
                id_duplicates: networkUniqueTTLArr.map(lead => lead._id),
                error_reason: 'network_unique'
            },
            {
                name: 'geo_whitelist',
                enabled: rules?.geo_whitelist?.length > 0,
                success: rules?.geo_whitelist?.includes(networkMetadata?.country_code),
                error_reason: 'geo_whitelist'
            }
        ],
        error_reason: [] 
    }

    const verifyEnabledArr = result.verify.filter(conditions => conditions.enabled === true)
    const verifySuccessArr = verifyEnabledArr.filter(conditions => conditions.success === true)
    const ifFraud = (verifySuccessArr.length >= verifyEnabledArr.length) && (verifySuccessArr.length > rules.allowed_failures)

    result.is_fraud = !ifFraud
    result.verify_enabled = verifyEnabledArr.length
    result.verify_success = verifySuccessArr.length

    verifyEnabledArr.forEach(verify => { if (verify.success === false) result.error_reason.push(verify.error_reason) })

    // console.log(result)

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