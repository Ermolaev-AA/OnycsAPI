import ServiceCompanies from '../../services/companies/index.js'

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ServiceCompanies.deleteOne(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}