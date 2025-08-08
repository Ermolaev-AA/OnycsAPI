import ServiceCustomers from '../../services/customers/index.js'

export const create = async (req, res) => {
    try {
        const result = await ServiceCustomers.create(req)

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}