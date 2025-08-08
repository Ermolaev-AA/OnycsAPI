import * as dotenv from 'dotenv'

const env = dotenv.config()
const token = env.parsed.USERBOX_TOKEN

export const getSearch = async (query) => {
    const proxy = 'https://thingproxy.freeboard.io/fetch/'
    const url = proxy + encodeURIComponent(`https://api.usersbox.ru/v1/search?q=${query}`)
    const options = {
        method: 'GET',
        headers: {
            'Authorization': USERBOX_TOKEN,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Content-Type': 'application/json'
        }
    }
    
    const response = await fatch(url, options).then(res => res.json())
    return response
}