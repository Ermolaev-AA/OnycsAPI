import * as dotenv from 'dotenv'

const env = dotenv.config()
const token = env.parsed.IPQS_TOKEN

export const getReport = async (ip) => {
    const url = `https://ipqualityscore.com/api/json/ip/${token}/${ip}`

    const response = await fetch(url).then(res => res.json())
    return response
}