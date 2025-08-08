import Router from 'express'
import Controller from '../controllers/index.js'

// console.log(Controller)

const router = new Router

// Сompanies
router.get('/companies/:id', Controller.Companies.getOne)
router.get('/companies', Controller.Companies.getAll)
router.post('/companies', Controller.Companies.create)
router.patch('/companies', Controller.Companies.update)
router.delete('/companies/:id', Controller.Companies.deleteOne)

// Customers
router.get('/customers/:id', Controller.Customers.getOne) // DEV
router.get('/customers', Controller.Customers.getAll) // DEV
router.post('/customers', Controller.Customers.create ) // DEV
router.patch('/customers' )
router.delete('/customers/:id' )

// GET
router.get('/get/phone/report', Controller.getPhoneReport)
router.get('/get/whatsapp/report', Controller.getWhatsappReport)
router.get('/get/telegram/report', Controller.getTelegramReport)

export default router