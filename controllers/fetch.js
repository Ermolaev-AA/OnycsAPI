import ServiceFetch from '../services/fetch.js'

class ControllerFetch {
    async getPhoneInfo(req, res) {
        try {
            const params = req.query
            const body = req.body
            
            const user = await ServiceFetch.getPhoneInfo(params)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getWhatsApp(req, res) {
        try {
            const params = req.query
            const body = req.body
            
            const user = await ServiceFetch.getWhatsApp(params)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getTelegram(req, res) {
        try {
            const params = req.query
            const body = req.body

            const user = await ServiceFetch.getTelegram(params)
            return res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getUserBox(req, res) {
        try {
            const params = req.query
            const body = req.body

            const user = await ServiceFetch.getUserBox(params)
            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }

}

export default new ControllerFetch()
