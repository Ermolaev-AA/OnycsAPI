import ServiceCustomers from '../../services/customers/index.js'

export const getOne = async (req, res) => {
    try {
        const { id } = req.params
        const result = await ServiceCustomers.getOne(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAll = async (req, res) => {
    try {
        const result = await ServiceCustomers.getAll()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}