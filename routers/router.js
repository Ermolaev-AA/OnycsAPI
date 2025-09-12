import Router from 'express'
import Controller from '../controllers/index.js'

const router = new Router

// Сompanies
router.get('/companies/:id', Controller.Companies.getOne)
// router.get('/companies', Controller.Companies.getAll)
router.post('/companies', Controller.Companies.create)
// router.patch('/companies', Controller.Companies.update)
// router.delete('/companies/:id', Controller.Companies.deleteOne)

// Customers
router.get('/customers/:id', Controller.Customers.getOne)
// router.get('/customers', Controller.Customers.getAll)
router.post('/customers', Controller.Customers.create)
// router.patch('/customers' ) // DEV
// router.delete('/customers/:id' ) // DEV

router.post('/customers/send/complaint', Controller.Customers.sendСomplaint)
router.post('/customers/send/deal')
router.post('/customers/send/newlead', Controller.Customers.sendNewlead)

// DEL
router.get('/customers/send/complaint', Controller.Customers.sendСomplaint)

// Deals
router.get('/deals/get/report', Controller.Deals.getReport)
router.post('/deals/send/stage', Controller.Deals.sendStage)

// GET
router.get('/get/phone/report', Controller.getPhoneReport)
router.get('/get/whatsapp/report', Controller.getWhatsappReport)
router.get('/get/telegram/report', Controller.getTelegramReport)

export default router