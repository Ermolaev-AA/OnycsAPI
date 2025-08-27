import ServiceDeals from '../../services/deals/index.js'
import Utils from '../../utils/index.js'

export const getReport = async (req, res) => {
    try {
        const { query } = req
        if (!query) return res.status(400).json({ error: 'The required «query» parameter is missing!' })

        const by = query?.by // 'brokers' or 'months'
        const dateType = query?.date_type // 'range' or 'month'
        const from = query.from ? Utils.parseDate(query.from) : null // Date from
        const to = query.to ? Utils.parseDate(query.to) : null // Date to

        if (!by) return res.status(400).json({ error: 'The required «by» parameter is missing!' })
        if (by === 'brokers' && !dateType) return res.status(400).json({ error: 'The required «date_type» parameter is missing!' })

        if (by !== 'brokers' && by !== 'months') return res.status(400).json({ error: 'The «by» parameter should be «brokers» or «months»' })
        if (dateType && dateType !== 'range' && dateType !== 'month') return res.status(400).json({ error: 'The «date_type» parameter should be «range» or «month»' })

        if (dateType === 'range' && !from) return res.status(400).json({ error: 'The required «from» parameter is missing!' })
        if (dateType === 'range' && !to) return res.status(400).json({ error: 'The required «to» parameter is missing!' })

        const parseListOrSpecial = (rawValue, specialValues = []) => {
            if (rawValue === undefined || rawValue === null) return []
            const value = String(rawValue).trim()
            const lower = value.toLowerCase()
            const specialsLower = specialValues.map(v => v.toLowerCase())
            const matchIndex = specialsLower.indexOf(lower)
            if (matchIndex !== -1) return specialValues[matchIndex]
            return value.split(',').map(s => s.trim()).filter(Boolean)
        }

        const users = parseListOrSpecial(query?.users, ['all without admin', 'all'])
        const tags = parseListOrSpecial(query?.tags, ['all'])

        const reqReport = { by, dateType, from, to, users, tags}
        // console.log(reqReport)

        const result = await ServiceDeals.getReport(reqReport)
        // console.log(result)

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}