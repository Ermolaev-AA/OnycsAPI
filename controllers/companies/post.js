import ServiceCompanies from '../../services/companies/index.js'

export const create = async (req, res) => {
    try {
        const body = req.body
        let result

        if (Array.isArray(body)) {
            result = await ServiceCompanies.createMany(body)
        } else if (typeof body === 'object' && body !== null) {
            result = await ServiceCompanies.createOne(body)
        } else {
            return res.status(400).json({ error: 'Invalid body format' })
        }

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}