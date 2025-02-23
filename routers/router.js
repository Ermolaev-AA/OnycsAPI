import Router from 'express'
import ControllerCompanies from '../controllers/companies.js'
import ControllerCustomers from '../controllers/customers.js'
import ControllerFetch from '../controllers/fetch.js'

const router = new Router

// Компании
router.get('/company')
router.get('/companies', ControllerCompanies.getAll) // DEV
router.post('/company', ControllerCompanies.createOne) // DEV

// Клиенты
router.get('/customer', ControllerCustomers.getOne) // DEV
router.get('/customers', ControllerCustomers.getAll) // DEV
router.post('/customer', ControllerCustomers.createOne) // DEV

// Запросы
router.get('/fetch/phoneinfo', ControllerFetch.getPhoneInfo)
router.get('/fetch/whatsapp', ControllerFetch.getWhatsApp)
router.get('/fetch/telegram', ControllerFetch.getTelegram)
router.get('/fetch/userbox', ControllerFetch.getUserBox)

// Токены
router.get('/bearer')
router.get('/bearers')

// Фиксация
router.get('/fixation')
router.get('/fixations')

// router.get('/leads', ControllerLeads.getAll)
// router.get('/leads/:id')
// router.post('/leads', ControllerLeads.create)
// router.put('/leads')
// router.delete('/leads/:id')

// router.get('/companies', ControllerCompanies.getAll)
// router.get('/companies/:id')
// router.post('/companies', ControllerCompanies.create)
// router.put('/companies')
// router.delete('/companies/:id')

// router.get('/users', ControllerUsers.getAll)
// router.get('/user', ControllerUsers.getOne)
// router.post('/user', ControllerUsers.create)
// router.put('/user/:id', ControllerUsers.update)
// router.delete('/user/:id')

export default router