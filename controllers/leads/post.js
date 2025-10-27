import Utils from '../../utils/index.js'
import ServiceLeads from '../../services/leads/index.js'

const Build = Utils.Build

export const create = async (req, res) => {
    try {
        const { body } = req
        if (!body) return res.status(400).json({ error: 'The required «body» parameter is missing!' })

        const reqLead = Build.Lead.request(req)
        const result = await ServiceLeads.create(reqLead)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const verifyCaptcha = async (req, res) => {
    try {
        const { body } = req 
        const { type, token, company, kay } = body

        if (!token) return res.status(400).json({ error: 'Token is required' })

        const secretKey = kay || '0x4AAAAAAB3Q4DfRMYTnF9HIn2NzPeefcuo'
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: secretKey,
                response: token
            })
        })

        const result = await response.json()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}