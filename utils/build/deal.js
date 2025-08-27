import { parseDate } from '../parse.js'

export const request = (req, settings = {}) => {
    try {
        const { body, query } = req
        const { source = 'create' } = settings // if more var...

        const ownerId = body?.owner_id || query?.owner_id
        const dealId = body?.deal_id || query?.deal_id
        const contactId = body?.contact_id || query?.contact_id
        const responsibleId = body?.responsible_id || query?.responsible_id
        const responsibleName = body?.responsible_name || query?.responsible_name
        const stage = body?.stage || query?.stage
        const dealCreatedAt = parseDate(body?.deal_created_at || query?.deal_created_at)
        const contactCreatedAt = parseDate(body?.contact_created_at || query?.contact_created_at)

        if (!ownerId) throw new Error('The required «owner_id» parameter is missing!')
        if (!dealId) throw new Error('The required «deal_id» parameter is missing!')
        if (!contactId) throw new Error('The required «contact_id» parameter is missing!')
        if (!responsibleId) throw new Error('The required «responsible_id» parameter is missing!')
        if (!responsibleName) throw new Error('The required «responsible_name» parameter is missing!')
        if (!stage) throw new Error('The required «stage» parameter is missing!')
        if (!dealCreatedAt) throw new Error('The required «deal_created_at» parameter is missing!')
        if (!contactCreatedAt) throw new Error('The required «contact_created_at» parameter is missing!')

        let rulesQualified = body?.rules_qualified
        let rulesMeeting = body?.rules_meeting
        let rulesReserved = body?.rules_reserved
        let rulesWon = body?.rules_won

        let rulesWorking = body?.rules_working
        let rulesMeetingAgencyScheduled = body?.rules_meeting_agency_scheduled // (NEW)
        let rulesMeetingDeveloperScheduled = body?.rules_meeting_developer_scheduled // (NEW)
        let rulesMeetingDeveloper = body?.rules_meeting_developer // (NEW)
        let rulesRegistrationСompleted = body?.rules_registration_completed // (NEW)
        let rulesCommissionReceived = body?.rules_commission_received // (NEW)

        if (!rulesQualified && ownerId === '688b652770d49260494b5930') rulesQualified = ['Новостройки / 3. Квалифицирован', 'Новостройки / 4. Встреча назначена АН / Zoom', 'Новостройки / 5. Встреча проведена АН / Zoom', 'Новостройки / 6. Встреча назначена ОП', 'Новостройки / 7. Встреча проведена ОП', 'Новостройки / 8. Бронь установлена', 'Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesMeeting && ownerId === '688b652770d49260494b5930') rulesMeeting = ['Новостройки / 5. Встреча проведена АН / Zoom', 'Новостройки / 6. Встреча назначена ОП', 'Новостройки / 7. Встреча проведена ОП', 'Новостройки / 8. Бронь установлена', 'Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesReserved && ownerId === '688b652770d49260494b5930') rulesReserved = ['Новостройки / 8. Бронь установлена', 'Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesWon && ownerId === '688b652770d49260494b5930') rulesWon = ['Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']

        if (!rulesWorking && ownerId === '688b652770d49260494b5930') rulesWorking = ['Новостройки / 2. Взят в работу', 'Новостройки / ~ Отложил покупку', 'Новостройки / 3. Квалифицирован', 'Новостройки / 4. Встреча назначена АН / Zoom', 'Новостройки / 5. Встреча проведена АН / Zoom', 'Новостройки / 6. Встреча назначена ОП', 'Новостройки / 7. Встреча проведена ОП', 'Новостройки / 8. Бронь установлена', 'Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesMeetingAgencyScheduled && ownerId === '688b652770d49260494b5930') rulesMeetingAgencyScheduled = ['Новостройки / 4. Встреча назначена АН / Zoom', 'Новостройки / 5. Встреча проведена АН / Zoom', 'Новостройки / 6. Встреча назначена ОП', 'Новостройки / 7. Встреча проведена ОП', 'Новостройки / 8. Бронь установлена', 'Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesMeetingDeveloperScheduled && ownerId === '688b652770d49260494b5930') rulesMeetingDeveloperScheduled = ['Новостройки / 6. Встреча назначена ОП', 'Новостройки / 7. Встреча проведена ОП', 'Новостройки / 8. Бронь установлена', 'Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesMeetingDeveloper && ownerId === '688b652770d49260494b5930') rulesMeetingDeveloper = ['Новостройки / 7. Встреча проведена ОП', 'Новостройки / 8. Бронь установлена', 'Новостройки / 9. ДДУ ушел на регистрацию', 'Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesRegistrationСompleted && ownerId === '688b652770d49260494b5930') rulesRegistrationСompleted = ['Новостройки / 10. Регистрация завершена', 'Новостройки / 11. Комиссия получена']
        if (!rulesCommissionReceived && ownerId === '688b652770d49260494b5930') rulesCommissionReceived = ['Новостройки / 11. Комиссия получена']


        // 'Новостройки / 1. Новая заявка'
        // 'Новостройки / ~ Не дозвонился'
        // 'Новостройки / 2. Взят в работу'
        // 'Новостройки / ~ Отложил покупку'
        // 'Новостройки / 3. Квалифицирован'
        // 'Новостройки / 4. Встреча назначена АН / Zoom'
        // 'Новостройки / 5. Встреча проведена АН / Zoom'
        // 'Новостройки / 6. Встреча назначена ОП'
        // 'Новостройки / 7. Встреча проведена ОП'
        // 'Новостройки / 8. Бронь установлена'
        // 'Новостройки / 9. ДДУ ушел на регистрацию'
        // 'Новостройки / 10. Регистрация завершена'
        // 'Новостройки / 11. Комиссия получена'
        // 'Новостройки / ~ Перенос в Архив'
        // 'Новостройки / ~ Архив'

        if (!rulesQualified) throw new Error('The required «rules_qualified» parameter is missing!')
        if (!rulesMeeting) throw new Error('The required «rules_meeting» parameter is missing!')
        if (!rulesReserved) throw new Error('The required «rules_reserved» parameter is missing!')
        if (!rulesWon) throw new Error('The required «rules_won» parameter is missing!')

        const amountWonRaw = body?.amount_won || query?.amount_won

        const amountWon = typeof amountWonRaw === 'string' ? Number(amountWonRaw.replace(/\s+/g, '').replace(',', '.')) : amountWonRaw
        const tagName = body?.tag_name || query?.tag_name // (NEW)

        return { ownerId, 
            dealId, 
            contactId, 
            responsibleId, 
            responsibleName, 
            stage, 
            dealCreatedAt, 
            contactCreatedAt, 
            rulesWorking,
            rulesQualified, 
            rulesMeetingAgencyScheduled,
            rulesMeeting, 
            rulesMeetingDeveloperScheduled,
            rulesMeetingDeveloper,
            rulesReserved, 
            rulesWon,
            rulesRegistrationСompleted,
            rulesCommissionReceived, 
            amountWon,
            tagName
        }
    } catch (error) {
        if (!error.message) throw new Error('Unknown error occurred!')
        throw error
    }
}