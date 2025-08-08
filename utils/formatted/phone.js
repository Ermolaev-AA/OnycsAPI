import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const phone = (num) => {
    if (!num) throw new Error('Param «num» is required')

    const formatted = num.startsWith('+') ? num : `+${num}`
    const phoneInfo = parsePhoneNumberFromString(formatted)

    if (!phoneInfo || !phoneInfo.isValid()) {
        throw new Error('Phone number is not valid')
    }

    const phone = phoneInfo.countryCallingCode + phoneInfo.nationalNumber
    return phone
}