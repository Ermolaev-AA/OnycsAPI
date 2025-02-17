// import * as dotenv from 'dotenv'
import ModelCompanies from '../models/companies.js'

// dotenv.config()
// const WAPPIPRO_TOKEN = process.env.WAPPIPRO_TOKEN
// const WAPPIPRO_WHATSAPP_ID = process.env.WAPPIPRO_WHATSAPP_ID
// const WAPPIPRO_TELEGRAM_ID = process.env.WAPPIPRO_TELEGRAM_ID

// class ServiceUsers {
//     async create (user) {
//         const createdUser = await ModelUsers.create({...user})
//         return createdUser
//     }

//     async getAll (params) {
//         const users = await ModelUsers.find(params)

//         if (!users) {
//             throw new Error('Пользователи не найдены не найден!')
//         }

//         return users
//     }

//     async getOne(params) {
//         // Проверяем, что хотя бы один параметр передан
//         if (!params || Object.keys(params).length === 0) {
//             throw new Error('Не указаны параметры для поиска!')
//         }

//         // Выполняем поиск пользователя
//         const user = await ModelUsers.findOne(params)

//         if (!user) {
//             throw new Error('Пользователь не найден!')
//         }

//         return user
//     }

//     async update(id, params) {
//         // Проверяем, что ID и параметры переданы
//         if (!id || !params || Object.keys(params).length === 0) {
//             throw new Error('Не указан ID или параметры для обновления!');
//         }
    
//         // Обновляем пользователя
//         const updatedUser = await ModelUsers.findByIdAndUpdate(
//             id,                  // ID пользователя
//             { $set: params },    // Обновляем только переданные поля
//             { new: true, runValidators: true } // Возвращаем обновлённого пользователя, проверяем валидацию
//         );
    
//         // Проверяем, был ли найден и обновлён пользователь
//         if (!updatedUser) {
//             throw new Error('Пользователь с указанным ID не найден!');
//         }
    
//         return updatedUser;
//     }
// }

class ServiceCompanies {
    async createOne(body) {
        const createdCompany = await ModelCompanies.create({...body})
        return createdCompany
    }

    async getAll(body) {
        const companies = await ModelCompanies.find(body)
        if (!companies) throw new Error('Пользователи не найдены не найден!')

        return companies
    }

}

export default new ServiceCompanies