import ServiceCompanies from '../../services/companies/index.js'

export const getOne = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ServiceCompanies.getOne(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAll = async (req, res) => {
    try {
        const result = await ServiceCompanies.getAll()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}