import * as dotenv from 'dotenv'

dotenv.config()
const WAPPIPRO_TOKEN = process.env.WAPPIPRO_TOKEN
const WAPPIPRO_WHATSAPP_ID = process.env.WAPPIPRO_WHATSAPP_ID
const WAPPIPRO_TELEGRAM_ID = process.env.WAPPIPRO_TELEGRAM_ID
const USERBOX_TOKEN = process.env.USERBOX_TOKEN
// console.log(USERBOX_TOKEN)

class ServiceFetch {
    async getWhatsApp(body) {
        const { phone } = body
        const url = `https://wappi.pro/api/sync/contact/check?profile_id=${WAPPIPRO_WHATSAPP_ID}&phone=${phone}`
        const headers = { 'Authorization': WAPPIPRO_TOKEN }

        const response = await fetch(url, { headers })
            .then((res) => res.json())

        return response
    }

    async getTelegram(body) {
        const { phone } = body
        const url = `https://wappi.pro/tapi/sync/contact/get?profile_id=${WAPPIPRO_TELEGRAM_ID}&recipient=${phone}`
        const headers = { 'Authorization': WAPPIPRO_TOKEN }

        const response = await fetch(url, { headers })
            .then((res) => res.json())

        return response
    }

    async getUserBox(body) {
        const { phone } = body
        const apiUrl = `https://api.usersbox.ru/v1/search?q=${encodeURIComponent(phone)}`
        const proxy = 'https://thingproxy.freeboard.io/fetch/'
        const url = proxy + encodeURIComponent(apiUrl)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': USERBOX_TOKEN,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())

        return response
    }  

}

export default new ServiceFetch

