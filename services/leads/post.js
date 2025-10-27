import Build from '../../utils/build/index.js'
import ModelCustomers from '../../models/customers.js'

export const create = async (body) => {
    try {
        const resLead = await Build.Lead.response(body)
        const lead = await ModelCustomers.create(resLead)

        return lead
    } catch (error) {
        // console.error(`[CREATE] ❌ Error creating customer: ${error.message}`)
        return { error: error.message }
    }
}