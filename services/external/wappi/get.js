import * as dotenv from 'dotenv'

const env = dotenv.config()
const token = env.parsed.WAPPI_TOKEN
const waProfile = env.parsed.WAPPI_WHATSAPP_ID
const tgProfile = env.parsed.WAPPI_TELEGRAM_ID

export const getWhatsappReport = async (num) => {
    const url = `https://wappi.pro/api/sync/contact/check?profile_id=${waProfile}&phone=${num}`
    const options = { headers: { 'Authorization': token } }

    const response = await fetch(url, options).then(res => res.json())
    return response
}

export const getTelegramReport = async (num) => {
    const url = `https://wappi.pro/tapi/sync/contact/get?profile_id=${tgProfile}&recipient=${num}`
    const options = { headers: { 'Authorization': token } }

    const response = await fetch(url, options).then(res => res.json())
    return response
}