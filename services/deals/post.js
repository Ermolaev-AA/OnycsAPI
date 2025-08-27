import ModelDeals from '../../models/deals.js'

export const create = async (data) => {
    try {
        const deal = await ModelDeals.findOne({ external_deal_id: data.dealId })

        const ownerId = deal?.owner_id || data.ownerId
        const externalDealId = deal?.external_deal_id || data.dealId
        const externalContactId = deal?.external_contact_id || data.contactId
        const responsibleId = data.responsibleId
        const responsibleName = data.responsibleName
    
        const { stage, rulesWorking, rulesQualified, rulesMeetingAgencyScheduled, rulesMeeting, rulesMeetingDeveloperScheduled, rulesMeetingDeveloper, rulesReserved, rulesWon, rulesRegistrationСompleted, rulesCommissionReceived } = data
        const currDate = new Date
    
        const WorkingAt = deal?.working_at || (rulesWorking?.includes(stage) ? currDate : null)
        const qualifiedAt = deal?.qualified_at || (rulesQualified?.includes(stage) ? currDate : null)
        const meetingAgencyScheduledAt = deal?.meeting_agency_scheduled_at || (rulesMeetingAgencyScheduled?.includes(stage) ? currDate : null)
        const meetingAt = deal?.meeting_at || (rulesMeeting?.includes(stage) ? currDate : null)
        const meetingDeveloperScheduledAt = deal?.meeting_developer_scheduled_at || (rulesMeetingDeveloperScheduled?.includes(stage) ? currDate : null)
        const meetingDeveloperAt = deal?.meeting_developer_at || (rulesMeetingDeveloper?.includes(stage) ? currDate : null)
        const reservedAt = deal?.reserved_at || (rulesReserved?.includes(stage) ? currDate : null)
        const wonAt = deal?.won_at || (rulesWon?.includes(stage) ? currDate : null)
        const registrationСompletedAt = deal?.registration_completed_at || (rulesRegistrationСompleted?.includes(stage) ? currDate : null)
        const commissionReceivedAt = deal?.commission_received_at || (rulesCommissionReceived?.includes(stage) ? currDate : null)
    
        const amountWon = data?.amountWon
        const tagName = data?.tagName
    
        const externalDealCreatedAt = deal?.external_deal_created_at || data.dealCreatedAt
        const externalContactCreatedAt = deal?.external_contact_created_at || data.contactCreatedAt
    
        if (deal) {
            deal.responsible_id = responsibleId
            deal.responsible_name = responsibleName
            deal.working_at = WorkingAt
            deal.qualified_at = qualifiedAt
            deal.meeting_agency_scheduled_at = meetingAgencyScheduledAt
            deal.meeting_at = meetingAt
            deal.meeting_developer_scheduled_at = meetingDeveloperScheduledAt
            deal.meeting_developer_at = meetingDeveloperAt
            deal.reserved_at = reservedAt
            deal.won_at = wonAt
            deal.registration_completed_at = registrationСompletedAt
            deal.commission_received_at = commissionReceivedAt
            deal.amount_won = amountWon
            deal.tag_name = tagName
            await deal.save()
    
            return deal
        }
    
        const newDeal = {
            owner_id: ownerId, 
            external_deal_id: externalDealId, 
            external_contact_id: externalContactId, 
            responsible_id: responsibleId, 
            responsible_name: responsibleName,
            tag_name: tagName,
            working_at: WorkingAt,
            qualified_at: qualifiedAt, 
            meeting_agency_scheduled_at: meetingAgencyScheduledAt,
            meeting_at: meetingAt, 
            meeting_developer_scheduled_at: meetingDeveloperScheduledAt,
            meeting_developer_at: meetingDeveloperAt,
            reserved_at: reservedAt, 
            won_at: wonAt, 
            amount_won: amountWon,
            registration_completed_at: registrationСompletedAt,
            commission_received_at: commissionReceivedAt,
            external_deal_created_at: externalDealCreatedAt, 
            external_contact_created_at: externalContactCreatedAt
        }
    
        const created = await ModelDeals.create(newDeal)
        // console.log(created) // DEV
        return created
    } catch (error) {
        return { error: error.message }
    }
}