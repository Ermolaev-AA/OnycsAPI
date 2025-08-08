import mongoose from 'mongoose'

const Customers = new mongoose.Schema(
    {
        // ID и отношения
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        owner_id: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Сompanies', required: true } ],
        // Поля
        name: { type: String, required: true }, // Имя *
        phone: { type: Number, required: true }, // Телефон *
        // Веб данные 
        url: { type: String, required: true  },
        domain: { type: String, required: true },
        params: { type: Map, of: String, default: {} },
        cookies: { type: Map, of: String, default: {} },
        // Дубликаты
        is_double: { type: Boolean, required: true, default: false },
        origin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers' },
        doubles_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: [] }],
        is_global_double: { type: Boolean, required: true, default: false },
        global_origin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers' },
        global_doubles_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: [] }],
        // Резкльтат проверки клиента, проверка на мошеннические действия
        is_fraud: { type: Boolean, required: true }, // Это мошенник/бот? *
        // Проверка персоняльных данных WAPPIPRO
        whatsapp_exists: { type: Boolean, default: false },
        telegram_exists: { type: Boolean, default: false },
        // Проверка сетевых данных IPQS
        ip: { type: String },
        ipqs_report: { type: Map, of: String, default: {} },
        // Жалобы 
        complaints: { type: Number, default: 0 },
        global_complaints: { type: Number, default: 0 },
    },
    {
        timestamps: true // Автоматически добавляет createdAt и updatedAt
    }
)

export default mongoose.model('Customers', Customers);
