export const getClientMetadata = (req, res, next) => {
    // Получаем IP с правильным приоритетом для nginx
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               req.headers['x-real-ip'] ||
               req.headers['x-client-ip'] ||
               req.headers['cf-connecting-ip'] || // Cloudflare
               req.headers['x-cluster-client-ip'] ||
               req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               '127.0.0.1'

    console.log(req.headers['x-client-ip'])
    // console.log('Raw IP:', ip)
    // console.log('All headers:', {
    //     'x-forwarded-for': req.headers['x-forwarded-for'],
    //     'x-real-ip': req.headers['x-real-ip'],
    //     'x-client-ip': req.headers['x-client-ip'],
    //     'cf-connecting-ip': req.headers['cf-connecting-ip']
    // })

    // Очищаем IP
    let cleanIP = ip
    
    if (cleanIP === '::1' || cleanIP === '::ffff:127.0.0.1') {
        cleanIP = '127.0.0.1'
    }
    
    cleanIP = cleanIP.replace(/^::ffff:/, '')
    cleanIP = cleanIP.replace(/^\[|\]$/g, '')
    
    // Получаем User Agent
    const userAgent = req.headers['user-agent'] || 'Unknown'
    
    // Получаем язык браузера
    const acceptLanguage = req.headers['accept-language'] || 'Unknown'
    
    // Получаем полный URL из кастомного заголовка или из стандартного Referer
    let referer = req.headers['x-full-url'] || req.headers.referer || req.headers.origin || 'Direct Access'
    let urlParams = {}
    
    if (referer && referer !== 'Direct Access') {
        try {
            const url = new URL(referer)
            urlParams = Object.fromEntries(url.searchParams.entries())
        } catch (e) {
            console.log('Error parsing referer URL:', e.message)
        }
    }
    
    // Извлекаем куки из заголовков и кастомного заголовка
    const cookieString = req.headers.cookie || req.headers['x-cookies'] || ''
    const cookies = {}
    
    if (cookieString) {
        cookieString.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=')
            if (name && value) {
                cookies[name] = decodeURIComponent(value)
            }
        })
    }
    
    // Получаем время запроса
    const requestTime = new Date().toISOString()
    
    // Получаем метод запроса
    const method = req.method
    
    // Добавляем все данные в объект запроса
    req.clientIP = cleanIP
    req.clientUserAgent = userAgent
    req.clientLanguage = acceptLanguage
    req.clientReferer = referer
    req.objURLParams = urlParams
    req.strCookies = cookieString
    req.objCookies = cookies
    req.requestTime = requestTime
    req.requestMethod = method
    
    // Логирование для отладки
    // console.log('Client Info:', {
    //     IP: cleanIP,
    //     UserAgent: userAgent,
    //     Language: acceptLanguage,
    //     Referer: referer,
    //     URLParams: urlParams,
    //     CookieString: cookieString,
    //     Cookies: cookies,
    //     Method: method,
    //     Time: requestTime
    // })
    
    next()
}