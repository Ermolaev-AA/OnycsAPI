import * as dotenv from 'dotenv'
import ModelCustomers from '../models/customers.js'

dotenv.config()
const WAPPIPRO_TOKEN = process.env.WAPPIPRO_TOKEN
const WAPPIPRO_WHATSAPP_ID = process.env.WAPPIPRO_WHATSAPP_ID
const WAPPIPRO_TELEGRAM_ID = process.env.WAPPIPRO_TELEGRAM_ID

class ServiceCustomers {
    async createOne(body) {
        const { company, phone } = body
      
        // Проверка существования клиента с указанным номером телефона
        const existingCustomer = await this.getOne({ phone })
      
        if (existingCustomer) {
            const ownersArr = existingCustomer.owners_id
            const findOwner = ownersArr.find((owner) => owner.toString() === body.company.toString())
        
            if (!findOwner) {
                const customerId = existingCustomer._id
                const newOwnersArr = [...ownersArr, body.company]
                const updatedExistingCustomer = await this.update(customerId, { owners_id: newOwnersArr })
        
                return updatedExistingCustomer
            }
        
            return existingCustomer
        }
        /// // // // /// // // // /// /// //// // // //// //// /// //
      
        const getWhatsappUrl = `https://wappi.pro/api/sync/contact/check?profile_id=${WAPPIPRO_WHATSAPP_ID}&phone=${phone}`
        const getTelegramUrl = `https://wappi.pro/tapi/sync/contact/get?profile_id=${WAPPIPRO_TELEGRAM_ID}&recipient=${phone}`
        const headers = { 'Authorization': WAPPIPRO_TOKEN }
      
        const resWhatsapp = await fetch(getWhatsappUrl, { headers })
            .then((res) => {
                return res.json()
            })
        const resTelegram = await fetch(getTelegramUrl, { headers })
            .then((res) => {
                return res.json()
            })
      
        const onWhatsapp = resWhatsapp?.on_whatsapp || false;
        const onTelegram = resTelegram.status === 'done' ? true : false;
        const isSpam = (onWhatsapp === true || resTelegram === true) ? false : true;
      
        // Создание нового клиента с компанией
        const customers = await ModelCustomers.create({
            owners_id: company,
            phone,
            is_spam: isSpam,
            exist_whtasapp: onWhatsapp,
            exist_telegram: onTelegram,
        })
      
        return customers
      }      

    async getAll(body) {
        const customers = await ModelCustomers.find({...body})
        if (!customers) throw new Error('Customers not find!')

        return customers
    }

    async getOne(body) {
        const customer = await ModelCustomers.findOne({...body})

        return customer
    }

    async update(id, body) {    
        // Обновляем пользователя
        const updatedCustomer = await ModelCustomers.findByIdAndUpdate(
            id,                  // ID пользователя
            { $set: body },    // Обновляем только переданные поля
            { new: true, runValidators: true } // Возвращаем обновлённого пользователя, проверяем валидацию
        )
    
        return updatedCustomer
    }
}

export default new ServiceCustomers