import Build from '../../utils/build/index.js'
import ModelCustomers from '../../models/customers.js'

export const create = async (body) => {
    try {
        const resLead = await Build.Lead.response(body)
        const lead = await ModelCustomers.create(resLead.lead)

        const response = {
            data: lead,
            evaluation: resLead.evaluate_fraud,
            duplicates: resLead.global_duplicates.length
        }

        return response
    } catch (error) {
        // console.error(`[CREATE] ❌ Error creating customer: ${error.message}`)
        return { error: error.message }
    }
}