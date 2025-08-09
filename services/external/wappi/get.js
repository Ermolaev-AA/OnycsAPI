import * as dotenv from 'dotenv'

const env = dotenv.config()
const token = env.parsed.WAPPI_TOKEN
const waProfile = env.parsed.WAPPI_WHATSAPP_ID
const tgProfile = env.parsed.WAPPI_TELEGRAM_ID

// DEBUG // WhatsApp exists!
const debugResWa1 = {
    "status": "done",
    "timestamp": 1754596969,
    "time": "2025-08-07T23:02:49+03:00",
    "on_whatsapp": true,
    "phone": "79533296539@c.us",
    "uuid": "6818ea1a-bff1"
}

// DEBUG // WhatsApp not exists!
const debugResWa2 = {
    "status": "done",
    "timestamp": 1754597587,
    "time": "2025-08-07T23:13:07+03:00",
    "on_whatsapp": false,
    "phone": "79999999966@c.us",
    "uuid": "6818ea1a-bff1"
}

// DEBUG // WhatsApp not authorized!
const debugResWa3 = {
    "detail": "Not authorized in whatsapp",
    "status": "error"
}

export const getWhatsappReport = async (num) => {
    const url = `https://wappi.pro/api/sync/contact/check?profile_id=${waProfile}&phone=${num}`
    const options = { headers: { 'Authorization': token } }

    // const response = debugResWa1 // DEBUG
    const response = await fetch(url, options).then(res => res.json())
    return response
}

// DEBUG // Telegram exists!
const debugResTg1 = {
    "status": "done",
    "timestamp": 1754596969,
    "time": "2025-08-07T23:02:49+03:00",
    "contact": {
        "id": "543520697",
        "type": "user",
        "number": "79533296539",
        "pushname": "Anton Ermolaev",
        "firstName": "Anton",
        "lastName": "Ermolaev",
        "picture": null,
        "thumbnail": "https://fs.wappi.pro/fs/downloadFile/eac62a5e-5375/avatars/tumb_543520697.jpg",
        "username": "ermolaev_anton",
        "isMe": false
    },
    "task_id": "89820db9-9000-4496-9442-ee2cb257f4cc",
    "uuid": "eac62a5e-5375"
}

// DEBUG // Telegram not exists!
const debugResTg2 = {
    "status": "error",
    "timestamp": 1754597587,
    "time": "2025-08-07T23:13:07+03:00",
    "detail": "error: not found contact",
    "task_id": "ff7a73aa-d0d5-4b95-bfe9-466af88f35ac",
    "uuid": "eac62a5e-5375"
}

// DEBUG // Telegram not authorized!
const debugResTg3 = {
    "detail": "Not authorized",
    "status": "error"
}

export const getTelegramReport = async (num) => {
    const url = `https://wappi.pro/tapi/sync/contact/get?profile_id=${tgProfile}&recipient=${num}`
    const options = { headers: { 'Authorization': token } }

    // const response = debugResTg1 // DEBUG
    const response = await fetch(url, options).then(res => res.json())
    return response
}