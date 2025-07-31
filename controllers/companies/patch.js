import ServiceCompanies from '../../services/companies/index.js'

export const update = async (req, res) => {
    try {
        const body = req.body
        let result

        if (Array.isArray(body)) {
            const invalidItems = body.filter(item => !item._id)
            if (invalidItems.length > 0) {
                return res.status(400).json({
                    error: 'Каждый объект в массиве должен содержать _id',
                    invalidItems
                })
            }

            result = await ServiceCompanies.updateMany(body)
        } else if (typeof body === 'object' && body !== null) {
            if (!body._id) {
                return res.status(400).json({ error: 'Поле _id обязательно для обновления' })
            }

            result = await ServiceCompanies.updateOne(body)
        } else {
            return res.status(400).json({ error: 'Неверный формат тела запроса' })
        }

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}