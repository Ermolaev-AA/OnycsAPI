import ModelDeals from '../../models/deals.js'

export const getReport = async (data) => {
    try {
        const { by, dateType, from, to, users, tags } = data

        const currDate = new Date()
        const startOfMonth = new Date(Date.UTC( currDate.getUTCFullYear(), currDate.getUTCMonth(), 1, 0, 0, 0, 0 ))
        const endOfMonth = new Date(Date.UTC( currDate.getUTCFullYear(), currDate.getUTCMonth() + 1, 0, 23, 59, 59, 999 ))

        const dateFrom = (dateType === 'range') ? (from || startOfMonth) : startOfMonth
        const dateTo = (dateType === 'range') ? (to || endOfMonth) : endOfMonth

        const usersDel = [{
            name: 'all without admin', 
            users: ['Георгий Нетуков', 'Милана Ибрагимова', 'Сергей Антоненко', 'Дарья Шубина', 'Марина Сидельникова', 'Елизавета Скатова', 'Анастасия Белова', 'Мария Хабарова', 'Эдуард Матиящук', 'Александр Сафонов', 'Софья Алыпова', 'Элина Мовладинова']
        }]

        // Фильтры по users и tags
        const usersCondition = (() => {
            if (Array.isArray(users)) {
                return users.length ? { responsible_name: { $in: users } } : {}
            }
            if (typeof users === 'string') {
                if (users === 'all') return {}
                const group = usersDel.find(u => u.name === users)
                if (group && Array.isArray(group.users) && group.users.length) {
                    return { responsible_name: { $nin: group.users } }
                }
            }
            return {}
        })()

        const tagsCondition = (() => {
            if (Array.isArray(tags)) {
                return tags.length ? { tag_name: { $in: tags } } : {}
            }
            // 'all' или иное — без фильтра
            return {}
        })()

        const commonConditions = (dateField) => ({
            [dateField]: { $gte: dateFrom, $lte: dateTo },
            ...usersCondition,
            ...tagsCondition
        })

        const [ deals, dealsWorking, dealsQualified, dealsMeetingAgencyScheduled, dealsMeeting, dealsMeetingDeveloperScheduled, dealsMeetingDeveloper, dealsReserved, dealsWon, dealsRegistrationCompleted, dealsCommissionReceived ] = await Promise.all([
            ModelDeals.find({
                ...commonConditions('external_deal_created_at'),
                external_contact_created_at: { $gte: dateFrom, $lte: dateTo }
            }),
            ModelDeals.find(commonConditions('working_at')),
            ModelDeals.find(commonConditions('qualified_at')),
            ModelDeals.find(commonConditions('meeting_agency_scheduled_at')),
            ModelDeals.find(commonConditions('meeting_at')),
            ModelDeals.find(commonConditions('meeting_developer_scheduled_at')),
            ModelDeals.find(commonConditions('meeting_developer_at')),
            ModelDeals.find(commonConditions('reserved_at')),
            ModelDeals.find(commonConditions('won_at')),
            ModelDeals.find(commonConditions('registration_completed_at')),
            ModelDeals.find(commonConditions('commission_received_at'))
        ])

        console.log('FROM:', dateFrom) // DEV
        console.log('TO:', dateTo) // DEV

        console.log('ALL LEADS:', deals.length) // DEV
        console.log('ALL QUALIFIED:', dealsQualified.length) // DEV
        console.log('ALL MEETING:', dealsMeeting.length) // DEV
        console.log('ALL RESERVED:', dealsReserved.length) // DEV
        console.log('ALL WON:', dealsWon.length) // DEV

        // Группировка по пользователям и расчёт метрик
        const map = new Map()

        const ensure = (id, name) => {
            if (!id) return null
            if (!map.has(id)) {
                map.set(id, {
                    id,
                    name: name ?? null,
                    leads: 0,
                    working: 0,
                    qualifications: 0,
                    meetings_agency_scheduled: 0,
                    meetings: 0,
                    meetings_developer_scheduled: 0,
                    meetings_developer: 0,
                    reserved: 0,
                    won: 0,
                    registration_completed: 0,
                    commission_received: 0,
                    calls: 0,
                    amount: 0
                })
            }
            const row = map.get(id)
            if (!row.name && name) row.name = name
            return row
        }

        const toNum = (v) => {
            const n = Number(v)
            return Number.isFinite(n) ? n : 0
        }

        // leads + calls из deals
        for (const d of deals) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.leads += 1
            row.calls += toNum(d.calls)
        }

        for (const d of dealsWorking) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.working += 1
        }

        // qualifications
        for (const d of dealsQualified) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.qualifications += 1
        }

        for (const d of dealsMeetingAgencyScheduled) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.meetings_agency_scheduled += 1
        }

        // meetings
        for (const d of dealsMeeting) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.meetings += 1
        }

        for (const d of dealsMeetingDeveloperScheduled) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.meetings_developer_scheduled += 1
        }

        for (const d of dealsMeetingDeveloper) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.meetings_developer += 1
        }

        // reserved
        for (const d of dealsReserved) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.reserved += 1
        }

        // won + amount из dealsWon
        for (const d of dealsWon) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.won += 1
            row.amount += toNum(d.amount_won)
        }

        for (const d of dealsRegistrationCompleted) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.registration_completed += 1
        }

        for (const d of dealsCommissionReceived) {
            const row = ensure(d.responsible_id, d.responsible_name)
            if (!row) continue
            row.commission_received += 1
        }

        const report = Array.from(map.values())

        // console.log('LINES:', report.length)

        return report
    } catch (error) {
        return { error: error.message }
    }
}