import * as dotenv from 'dotenv'

const env = dotenv.config()
const token = env.parsed.IPQS_TOKEN

// DEBUG // Successful response!
const debugRes1 = {
    "success": true,
    "message": "Success",
    "fraud_score": 0,
    "country_code": "RU",
    "region": "Ryazan Oblast",
    "city": "Ryazan",
    "ISP": "TransTeleCom",
    "ASN": 15774,
    "organization": "TransTeleCom",
    "is_crawler": false,
    "timezone": "Europe/Moscow",
    "mobile": false,
    "host": "95.83.139.82.spark-ryazan.ru",
    "proxy": false,
    "vpn": false,
    "tor": false,
    "active_vpn": false,
    "active_tor": false,
    "recent_abuse": false,
    "bot_status": false,
    "connection_type": "Premium required.",
    "abuse_velocity": "Premium required.",
    "zip_code": "N/A",
    "latitude": 54.63000107,
    "longitude": 39.68999863,
    "abuse_events": [
        "Enterprise plan required to view abuse events and active proxy networks"
    ],
    "request_id": "ZWSPmm1Cyu"
}

export const getReport = async (ip) => {
    const url = `https://ipqualityscore.com/api/json/ip/${token}/${ip}`

    // const response = debugRes1 // DEBUG
    const response = await fetch(url).then(res => res.json())
    return response
}