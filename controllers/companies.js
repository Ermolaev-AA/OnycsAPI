import ServiceCompanies from '../services/companies.js'

class ControllerCompanies {
    async createOne(req, res) {
        try {
            const params = req.query
            const body = req.body

            const company = await ServiceCompanies.createOne(body)
            res.status(200).json(company)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getAll(req, res) {
        try {
            const params = req.query
            const body = req.body

            const companies = await ServiceCompanies.getAll(body)
            return res.status(200).json(companies)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

}

export default new ControllerCompanies()
