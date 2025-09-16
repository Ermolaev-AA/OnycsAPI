import Utils from '../../utils/index.js'
import ServiceLeads from '../../services/leads/index.js'

const Build = Utils.Build

export const create = async (req, res) => {
    try {
        const { body } = req
        if (!body) return res.status(400).json({ error: 'The required «body» parameter is missing!' })

        const reqLead = Build.Lead.request(req)
        const result = await ServiceLeads.create(reqLead)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}