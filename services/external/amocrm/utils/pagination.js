/**
 * Универсальная функция для пагинации AmoCRM API v4
 * @param {string} subdomain - Поддомен AmoCRM
 * @param {string} token - Токен доступа
 * @param {string} endpoint - Эндпоинт API (например, 'leads/custom_fields')
 * @param {string} embeddedKey - Ключ в _embedded объекте (например, 'custom_fields')
 * @param {number} limit - Количество записей на странице (по умолчанию 250)
 * @returns {Promise<Object>} - Объединенные данные со всех страниц
 */
export const fetchAllPages = async (subdomain, token, endpoint, embeddedKey, limit = 250) => {
    try {
        let allData = []
        let page = 1
        let hasMore = true

        while (hasMore) {
            const url = `https://${subdomain}.amocrm.ru/api/v4/${endpoint}?limit=${limit}&page=${page}`
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            
            // Добавляем данные с текущей страницы к общему массиву
            if (data._embedded && data._embedded[embeddedKey]) {
                allData = allData.concat(data._embedded[embeddedKey])
            }

            // Проверяем, есть ли еще страницы
            const currentPageDataCount = data._embedded?.[embeddedKey]?.length || 0
            hasMore = currentPageDataCount === limit

            page++
        }

        // Возвращаем данные в том же формате, что и оригинальный API
        return {
            _embedded: {
                [embeddedKey]: allData
            },
            _links: {
                self: {
                    href: `https://${subdomain}.amocrm.ru/api/v4/${endpoint}`
                }
            }
        }
    } catch (error) {
        throw error
    }
}




