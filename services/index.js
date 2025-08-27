import ServiceCompanies from './companies/index.js'
import ServiceCustomers from './customers/index.js'
import ServiceDeals from './deals/index.js'
import ServiceExternal from './external/index.js'

import * as Get from './get.js'

export default {
    Companies: ServiceCompanies,
    Customers: ServiceCustomers,
    Deals: ServiceDeals,
    External: ServiceExternal,

    ...Get
}