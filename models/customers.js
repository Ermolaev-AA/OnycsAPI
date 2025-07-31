import mongoose from 'mongoose';

const Customers = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        owners_id: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'companies',
                required: true
            }
        ],
        
        name: { type: String, required: true }, // Имя *
        phone: { type: Number, required: true, unique: true }, // Телефон *
        // Веб данные 
        domain: { type: String, required: true },
        url: { type: String, required: true  },
        utms: {

        },
        cookies: {

        },
        // Дубликаты
        is_double: { type: Boolean, required: true, default: false }, // Это дубль? *
        origin_id: { type: Boolean, default: false }, // Оригинальный Клиент ID
        doubles_id: { type: Boolean, default: false }, // ID Дублей
        is_global_double: { type: Boolean, required: true, default: false }, // Это глобальный дубль? *
        global_origin_id: { type: Boolean, default: false },
        global_doubles_id: { type: Boolean, default: false },
        // Резкльтат проверки всех данных
        is_fraud: { type: Boolean, required: true, default: true }, // Это мошенник/бот? *
        // Проверка персоняльных данных
        whatsapp_exists: { type: Boolean, default: false },
        telegram_exists: { type: Boolean, default: false },
        // Проверка сетевых данных
        ip: { type: String },
        is_proxy: { type: Boolean, default: false },
        is_vpn: { type: Boolean, default: false },
        is_tor: { type: Boolean, default: false },
        network_fraud_score: { type: String },
        network_fraud_risk: { type: String },
        // Жалобы 
        complaints: { type: Number, default: 0 },
        global_complaints: { type: Number, default: 0 },
    },
    {
        timestamps: true // Автоматически добавляет createdAt и updatedAt
    }
)

export default mongoose.model('Customers', Customers);
