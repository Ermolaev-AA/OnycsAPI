import Router from 'express'
import Controller from '../controllers/index.js'

const router = new Router
// console.log(Controller)

// Сompanies
router.get('/companies/:id', Controller.Companies.getOne)
// router.get('/companies', Controller.Companies.getAll)
router.post('/companies', Controller.Companies.create)
// router.patch('/companies', Controller.Companies.update)
// router.delete('/companies/:id', Controller.Companies.deleteOne)

// Customers (OLD)
router.get('/customers/:id', Controller.Customers.getOne) // (OLD)
// router.get('/customers', Controller.Customers.getAll) // (OLD)
router.post('/customers', Controller.Customers.create) // (OLD)

router.post('/customers/send/complaint', Controller.Customers.sendСomplaint) // (OLD)
router.post('/customers/send/deal') // (OLD)
router.post('/customers/send/newlead', Controller.Customers.sendNewlead) // (OLD)

// DEL
router.get('/customers/send/complaint', Controller.Customers.sendСomplaint) // (OLD)

// Leads (Instead of Customers)
router.post('/leads', Controller.Leads.create)
router.post('/leads/verify-captcha', Controller.Leads.verifyCaptcha)

// Deals
router.get('/deals/get/report', Controller.Deals.getReport)
router.post('/deals/send/stage', Controller.Deals.sendStage)

// CRM
router.post('/crm', Controller.CRM.create)

// GET
router.get('/get/phone/report', Controller.getPhoneReport)
router.get('/get/whatsapp/report', Controller.getWhatsappReport)
router.get('/get/telegram/report', Controller.getTelegramReport)

export default router