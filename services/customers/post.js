// services/customers/create.js
import ModelCustomers from '../../models/customers.js'
import ModelCompanies from '../../models/companies.js'
import ServiceIPQS from '../external/ipqs/index.js'
import { getPhoneReport } from '../get.js'

export const create = async (body) => {
    try {
        const phone = body.phone
        let ownerId = body.owner_id

        // 1) Найти компанию при отсутствии owner_id
        if (!ownerId) {
            const company = await ModelCompanies.findOne({ domains: body.domain }).select('_id').lean()
        if (!company) {
            // console.log(`[CREATE] ❌ Company not found for domain: ${body.domain}`)
            return { created: body, message: `Owner not found for domain: ${body.domain}` }
        }
            ownerId = company._id
            // console.log(`[CREATE] ✅ Found company by domain: ${body.domain} -> ${ownerId}`)
        }

        // 2) Дубликаты: локальный факт + последний глобальный документ + кол-во за 3 месяца
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        const [hasLocalDup, latestGlobalDoc, dupCount3m] = await Promise.all([
            ModelCustomers.exists({ owner_id: ownerId, phone }),
            ModelCustomers.findOne({ phone })
                .sort({ createdAt: -1 })
                .select('createdAt is_fraud complaints contact_report connect_report')
                .lean(),
            ModelCustomers.countDocuments({ phone, createdAt: { $gte: threeMonthsAgo } })
        ])

        const is_local_duplicate  = Boolean(hasLocalDup)
        const is_global_duplicate = Boolean(latestGlobalDoc)
        // console.log(`[CREATE] Duplicates → local:${is_local_duplicate}, global:${is_global_duplicate}, last3m:${dupCount3m}`)

        // 3) Решаем, какие отчёты брать (reuse, если свежий глобальный дубль)
        const currIp  = body.connect_report?.user_ip || null
        const lastIp  = latestGlobalDoc?.connect_report?.user_ip || null
        const freshEnough = latestGlobalDoc && latestGlobalDoc.createdAt >= threeMonthsAgo

        let contact_report, ipqs_report

        if (is_global_duplicate && freshEnough) {
            // console.log(`[CREATE] ♻ Using cached reports from latest global duplicate`)
            contact_report = latestGlobalDoc.contact_report ?? null

            if (currIp && lastIp && currIp === lastIp) {
                // console.log(`[CREATE] ♻ IP unchanged, reuse cached IPQS`)
                ipqs_report = latestGlobalDoc.connect_report?.ipqs_report ?? null
            } else {
                // console.log(`[CREATE] 🌐 IP changed/missing, requesting new IPQS`)
                ipqs_report = currIp ? await ServiceIPQS.getReport(currIp) : null
            }
        } else {
            // console.log(`[CREATE] 🆕 No fresh duplicate, requesting new reports`)
            const [ipqs, phoneRep] = await Promise.all([
                currIp ? ServiceIPQS.getReport(currIp) : Promise.resolve(null),
                getPhoneReport(phone),
            ])

            ipqs_report = ipqs
            contact_report = phoneRep
        }

        // 4) Оценка мошенничества по правилам
        const { is_fraud, reason } = evaluateFraud({
            dupCount3m,
            latestGlobalDoc,
            contact_report,
            ipqs_report
        })

        // console.log(`[CREATE] Fraud decision → is_fraud:${is_fraud} (reason: ${reason})`)

        // 5) Собираем и создаём документ
        const customer = {
            owner_id: ownerId,
            name: body.name,
            phone,
            url: body.url,
            domain: body.domain,
            params: body.params,
            cookies: body.cookies,

            is_fraud,
            is_local_duplicate,
            is_global_duplicate,

            connect_report: {
                ...(body.connect_report || {}),
                ipqs_report,
            },
            contact_report,
        }

        const created = await ModelCustomers.create(customer)
        // console.log(`[CREATE] ✅ Created customer ${created._id}`)
        return created
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

    if (dupCount3m > 3) {
        return { is_fraud: true, reason: 'duplicates_last_3m>3' }
    }
    if (lastIsFraud) {
        return { is_fraud: true, reason: 'latest_duplicate_is_fraud' }
    }
    if (lastComplaints > 5) {
        return { is_fraud: true, reason: 'latest_duplicate_complaints>5' }
    }

    // Исключение: только здесь разрешено false
    if (waExists && Number.isFinite(fraudScore) && fraudScore < 50) {
        return { is_fraud: false, reason: 'whatsapp_exists && fraud_score<50' }
    }

    // По твоему ТЗ — "во всех остальных случаях true"
    return { is_fraud: true, reason: 'default_true' }
}
