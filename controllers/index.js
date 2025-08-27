import ContrillerCompanies from './companies/index.js'
import ContrillerCustomers from './customers/index.js'
import ControllerDeals from './deals/index.js'

import * as Get from './get.js'

export default {
    Companies: ContrillerCompanies,
    Customers: ContrillerCustomers,
    Deals: ControllerDeals,

    ...Get
}