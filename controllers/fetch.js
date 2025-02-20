import ServiceFetch from '../services/fetch.js'

class ControllerFetch {
    async getWhatsApp(req, res) {
        try {
            const params = req.query
            const body = req.body
            
            const user = await ServiceFetch.getWhatsApp(body)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getTelegram(req, res) {
        try {
            const params = req.query
            const body = req.body

            const user = await ServiceFetch.getTelegram(body)
            return res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getUserBox(req, res) {
        try {
            const params = req.query
            const body = req.body

            const user = await ServiceFetch.getUserBox(body)
            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }

}

export default new ControllerFetch()
