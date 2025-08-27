import Utils from '../../utils/index.js'
import ServiceDeals from '../../services/deals/index.js'

const Build = Utils.Build

export const sendStage = async (req, res) => {
    try {
        const { body, query } = req

        if (!body || !query) return res.status(400).json({ error: 'The required «body» or «query» parameter is missing!' })

        const reqDeal = Build.Deal.request(req)
        const result = await ServiceDeals.create(reqDeal)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}