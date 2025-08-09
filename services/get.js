import { parsePhoneNumberFromString } from 'libphonenumber-js'
import ServiceWAPPI from './external/wappi/index.js'
import ServiceIPQS from './external/ipqs/index.js'

export const getPhoneReport = async (num) => {
    const phoneInfo = parsePhoneNumberFromString(`+${num}`)
    delete phoneInfo.__countryCallingCodeSource

    const [waInfo, tgInfo] = await Promise.all([
        ServiceWAPPI.getWhatsappReport(num),
        ServiceWAPPI.getTelegramReport(num)
    ])

    const report = {
        ...phoneInfo,
        whatsapp_exists: waInfo.on_whatsapp === true,
        telegram_exists: tgInfo.status === 'done',
        whatsapp_report: waInfo,
        telegram_report: tgInfo
    }

    return report
}

// DEV
export const getIpReport = async (ip) => {
    const ipqsReport = await ServiceIPQS.getReport(ip)

    const report = {
        ip,
        ipqs_report: ipqsReport
    }

    return report
}