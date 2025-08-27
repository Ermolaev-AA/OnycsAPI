// services/customers/create.js
import ModelCustomers from '../../models/customers.js'
import ModelCompanies from '../../models/companies.js'
import ServiceIPQS from '../external/ipqs/index.js'
import { getPhoneReport } from '../get.js'

import Formatted from '../../utils/formatted/index.js'

export const create = async (body) => {
    try {
        const { name, phone, url, cookie, userIP, userAgent } = body

        const objURL = new URL(url)
        const domain = Formatted.domainRemovePrefixWWW(objURL?.hostname)
        const ownerID = body?.ownerID || await ModelCompanies.findOne({ domains: domain }).then(res => res._id) || '688b676870d49260494b5940'

        // console.log('OWNER ID →', ownerID)s
        // return ownerID

        // 2) Дубликаты: локальный факт + последний глобальный документ + кол-во за 3 месяца
        const currDate = new Date()
        const threeMonthsAgo = currDate.setMonth(currDate.getMonth() - 3)

        const [hasLocalDup, latestGlobalDoc, dupCount3m] = await Promise.all([
            ModelCustomers.exists({ owner_id: ownerID, phone }),
            ModelCustomers.findOne({ phone })
                .sort({ createdAt: -1 })
                .select('createdAt is_fraud complaints contact_report connect_report')
                .lean(),
            ModelCustomers.countDocuments({ phone, createdAt: { $gte: threeMonthsAgo } })
        ])

        // return { hasLocalDup, latestGlobalDoc, dupCount3m }

        const isLocalDuplicate  = Boolean(hasLocalDup)
        const isGlobalDuplicate = Boolean(latestGlobalDoc)
        // console.log(`[CREATE] Duplicates → local:${is_local_duplicate}, global:${is_global_duplicate}, last3m:${dupCount3m}`)

        // 3) Решаем, какие отчёты брать (reuse, если свежий глобальный дубль)
        // const currIp  = userIP || null
        const lastUserIP  = latestGlobalDoc?.connect_report?.user_ip || null
        const freshEnough = latestGlobalDoc && latestGlobalDoc.createdAt >= threeMonthsAgo

        let contact_report, ipqs_report

        if (isGlobalDuplicate && freshEnough) {
            // console.log(`[CREATE] ♻ Using cached reports from latest global duplicate`)
            contact_report = latestGlobalDoc.contact_report ?? null

            if (userIP && lastUserIP && userIP === lastUserIP) {
                // console.log(`[CREATE] ♻ IP unchanged, reuse cached IPQS`)
                ipqs_report = latestGlobalDoc.connect_report?.ipqs_report ?? null
            } else {
                // console.log(`[CREATE] 🌐 IP changed/missing, requesting new IPQS`)
                ipqs_report = userIP ? await ServiceIPQS.getReport(userIP) : null
            }
        } else {
            // console.log(`[CREATE] 🆕 No fresh duplicate, requesting new reports`)
            const [ipqs, phoneRep] = await Promise.all([
                userIP ? ServiceIPQS.getReport(userIP) : Promise.resolve(null),
                getPhoneReport(phone),
            ])

            ipqs_report = ipqs
            contact_report = phoneRep
        }

        // 4) Оценка мошенничества по правилам
        const isFraud = evaluateFraud({ dupCount3m, latestGlobalDoc, contact_report, ipqs_report })

        return 

        // 5) Собираем и создаём документ
        const customer = {
            owner_id: ownerID,
            name: body.name,
            phone,
            url: body.url,
            domain: body.domain,
            params: body.params,
            cookies: body.cookies,

            is_fraud: isFraud,
            is_local_duplicate: isLocalDuplicate,
            is_global_duplicate: isGlobalDuplicate,

            connect_report: {
                ...(body.connect_report || {}),
                ipqs_report,
            },
            contact_report,
        }

        // const created = await ModelCustomers.create(customer)
        // console.log(`[CREATE] ✅ Created customer ${created._id}`)
        return customer
    } catch (error) {
        // console.error(`[CREATE] ❌ Error creating customer: ${error.message}`)
        return { error: error.message }
    }
}

export const sendСomplaint = async (phone) => {
    try {
        const customer = await ModelCustomers.findOne({ phone }).sort({ createdAt: 1 })
        if (!customer) return { error: `Customer with phone ${phone} not found!` }

        customer.complaints = (customer.complaints || 0) + 1
        if (customer.complaints >= 5) customer.is_fraud = true

        await customer.save()

        return { success: true, complaints: customer.complaints, is_fraud: customer.is_fraud }
    } catch (error) {
        return { error: error.message }
    }
}

export const sendDeal = async (body) => {
    try {
        const { id, dealId, contactId } = body
        const customer = await ModelCustomers.findOne({ _id: id })

        if (!customer) return { error: `Customer with id ${id} not found!` }

        customer.crm_deal_id = dealId
        customer.crm_contact_id = contactId
        await customer.save()

        return { success: true, id: customer._id, crm_deal_id: customer.crm_deal_id, crm_contact_id: customer.crm_contact_id }
    } catch (error) {
        return { error: error.message }
    }
}

export const sendNewlead = async (body, query) => {
    try {
        const { data } = body

        const reqCustomer = Build.Customer.request({ body }, { source: 'newlead' })
        const customer = await create(reqCustomer)

        const url = query?.webhook
        const body = {
            ...data,
            customer_id: customer._id,
            // ...newlead
        }

        const result = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        return result
    } catch (error) {
        return { error: error.message }
    }
}

/**
 * Правила:
 * 1) Если whatsapp_exists = true И fraud_score < 50 → is_fraud = false (единственное исключение).
 * 2) Иначе:
 *    - если глобальных дублей за 3 мес > 5 → true
 *    - если у последнего дубля is_fraud = true → true
 *    - если у последнего дубля complaints > 5 → true
 *    - во всех остальных случаях → true (по ТЗ)
 */

function evaluateFraud({ dupCount3m, latestGlobalDoc, contact_report, ipqs_report }) {
    const waExists = contact_report?.whatsapp_exists === true
    const fraudScore = Number(ipqs_report?.fraud_score)
    const lastIsFraud = latestGlobalDoc?.is_fraud === true
    const lastComplaints = Number(latestGlobalDoc?.complaints || 0)

    if (dupCount3m > 3) return true
    if (lastIsFraud) return true
    if (lastComplaints > 5) return true

    // Исключение: только здесь разрешено false 
    // if (waExists && Number.isFinite(fraudScore) && fraudScore < 50) {
    //     return { is_fraud: false, reason: 'whatsapp_exists && fraud_score<50' }
    // }

    if (waExists) return false

    return true
}
