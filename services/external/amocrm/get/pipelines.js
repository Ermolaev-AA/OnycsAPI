export const pipelines = async (subdomain, token) => {
    try {
        const url = `https://${subdomain}.amocrm.ru/api/v4/leads/pipelines`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        return data
    } catch (error) {
        throw error
    }
}