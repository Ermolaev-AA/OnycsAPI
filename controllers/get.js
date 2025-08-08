import Formatted from '../utils/formatted/index.js'
import Service from '../services/index.js'

export const getPhoneReport = async (req, res) => {
    try {
        const { num } = req.query
        const phone = Formatted.phone(num)

        const result = await Service.getPhoneReport(phone)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getWhatsappReport = async (req, res) => {
    try {
        const { num } = req.query
        const phone = Formatted.phone(num)

        const result = await Service.External.WAPPI.getWhatsappReport(phone)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getTelegramReport = async (req, res) => {
    try {
        const { num } = req.query
        const phone = Formatted.phone(num)

        const result = await Service.External.WAPPI.getTelegramReport(phone)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}