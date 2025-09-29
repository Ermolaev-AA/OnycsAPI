export const fields = async (subdomain, token) => {
    try {
        let allEmbedded = []
        let nextUrl = `https://${subdomain}.amocrm.ru/api/v4/leads/custom_fields`
        
        while (nextUrl) {
            const response = await fetch(nextUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.json()
            
            if (data._embedded && data._embedded.custom_fields) allEmbedded = allEmbedded.concat(data._embedded.custom_fields)
            
            nextUrl = data._links?.next?.href || null
        }

        return allEmbedded
    } catch (error) {
        throw error
    }
}