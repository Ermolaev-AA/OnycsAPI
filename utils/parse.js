export const parseCookies = (strCookies = '') => {
    return Object.fromEntries(
        strCookies
            .split('; ')
            .map(c => c.split('='))
            .filter(([k, v]) => k && v)
            .map(([k, v]) => [k, decodeURIComponent(v)])
    )
}

export const parseDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
        throw new Error('Invalid date string provided')
    }
    
    const trimmed = dateString.trim()
    const [datePart, timePart] = trimmed.split(' ')
    
    // Получаем текущую дату для значений по умолчанию
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // getMonth() возвращает 0-11, нам нужно 1-12
    
    // Разбираем дату
    const dateParts = datePart.split('.')
    let day, month, year
    
    if (dateParts.length === 1) {
        // Формат: "19" - только день
        day = parseInt(dateParts[0], 10)
        month = currentMonth
        year = currentYear
    } else if (dateParts.length === 2) {
        // Формат: "19.08" - день и месяц
        day = parseInt(dateParts[0], 10)
        month = parseInt(dateParts[1], 10)
        year = currentYear
    } else if (dateParts.length === 3) {
        // Формат: "19.08.2025" - полная дата
        day = parseInt(dateParts[0], 10)
        month = parseInt(dateParts[1], 10)
        year = parseInt(dateParts[2], 10)
    } else {
        throw new Error('Invalid date format. Expected formats: "DD", "DD.MM", "DD.MM.YYYY"')
    }
    
    // Разбираем время
    let hours = 0, minutes = 0, seconds = 0
    
    if (timePart) {
        const timeParts = timePart.split(':')
        
        if (timeParts.length === 1) {
            // Формат: "21" - только часы
            hours = parseInt(timeParts[0], 10)
        } else if (timeParts.length === 2) {
            // Формат: "21:02" - часы и минуты
            hours = parseInt(timeParts[0], 10)
            minutes = parseInt(timeParts[1], 10)
        } else if (timeParts.length === 3) {
            // Формат: "21:02:22" - полное время
            hours = parseInt(timeParts[0], 10)
            minutes = parseInt(timeParts[1], 10)
            seconds = parseInt(timeParts[2], 10)
        } else {
            throw new Error('Invalid time format. Expected formats: "HH", "HH:mm", "HH:mm:ss"')
        }
    }
    
    // Проверяем валидность значений
    if (isNaN(day) || day < 1 || day > 31) {
        throw new Error('Invalid day value')
    }
    if (isNaN(month) || month < 1 || month > 12) {
        throw new Error('Invalid month value')
    }
    if (isNaN(year) || year < 1900 || year > 3000) {
        throw new Error('Invalid year value')
    }
    if (isNaN(hours) || hours < 0 || hours > 23) {
        throw new Error('Invalid hours value')
    }
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
        throw new Error('Invalid minutes value')
    }
    if (isNaN(seconds) || seconds < 0 || seconds > 59) {
        throw new Error('Invalid seconds value')
    }
    
    // Создаем объект Date в UTC (месяцы в Date начинаются с 0)
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
    
    // Проверяем, что дата валидна (например, 31.02 будет невалидна)
    if (isNaN(date.getTime()) || 
        date.getUTCDate() !== day || 
        date.getUTCMonth() !== month - 1 || 
        date.getUTCFullYear() !== year) {
        throw new Error('Invalid date values provided')
    }
    
    return date
}