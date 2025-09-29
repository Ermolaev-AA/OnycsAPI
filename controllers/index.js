import ContrillerCompanies from './companies/index.js'
import ControllerCRM from './crm/index.js'
import ContrillerCustomers from './customers/index.js'
import ControllerDeals from './deals/index.js'
import ControllerLeads from './leads/index.js'

import * as Get from './get.js'

export default {
    Companies: ContrillerCompanies,
    CRM: ControllerCRM,
    Customers: ContrillerCustomers,
    Deals: ControllerDeals,
    Leads: ControllerLeads,

    ...Get
}