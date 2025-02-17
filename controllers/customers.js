import ServiceCustomers from '../services/customers.js'

class ControllerCustomers {
    async createOne(req, res) {
        try {
            const params = req.query
            const body = req.body
            
            const customer = await ServiceCustomers.createOne(body)
            res.status(200).json(customer)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const params = req.query
            const body = req.body

            const customers = await ServiceCustomers.getAll(body)
            return res.status(200).json(customers)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const params = req.query
            const body = req.body

            const customer = await ServiceCustomers.getOne(body)
            return res.status(200).json(customer)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id // Получаем ID из параметров маршрута
            const body = req.body // Получаем данные для обновления из тела запроса

            const updatedCustomer = await ServiceCustomers.update(id, body)
            return res.status(200).json(updatedCustomer)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new ControllerCustomers()
