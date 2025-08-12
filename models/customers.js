import mongoose from 'mongoose'

const Customers = new mongoose.Schema(
    {
        // ID и отношения
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies', required: true },
        crm_deal_id: { type: String }, // id сделки в CRM системе
        crm_contact_id: { type: String }, // id контакта в CRM системе
        // Field
        name: { type: String, required: true }, // Имя клиента *
        phone: { type: String, required: true }, // Телефон клиента *
        // Web Data
        url: { type: String, required: true },
        domain: { type: String, required: true },
        params: { type: mongoose.Schema.Types.Mixed, default: {} },
        cookies: { type: mongoose.Schema.Types.Mixed, default: {} },
        // Резкльтат проверки клиента, проверка на мошеннические действия
        is_fraud: { type: Boolean, required: true, default: false }, // Это мошенник/бот? *
        // Duplicate
        is_local_duplicate: { type: Boolean, required: true, default: false },
        is_global_duplicate: { type: Boolean, required: true, default: false },
        // Reports
        connect_report: { type: mongoose.Schema.Types.Mixed, default: {} },
        contact_report: { type: mongoose.Schema.Types.Mixed, default: {} },
        // Жалобы 
        complaints: { type: Number, default: 0 }
    },
    {
        timestamps: true // Автоматически добавляет createdAt и updatedAt
    }
)

Customers.index({ phone: 1 }, { unique: true, partialFilterExpression: { is_global_duplicate: false } })
Customers.index({ owner_id: 1, phone: 1 }, { unique: true, partialFilterExpression: { is_local_duplicate: false } })

Customers.post('save', async function (doc) {
    try {
        if (doc?.is_fraud === true) {
            const session = doc.$session?.() || null
            
            await doc.constructor.updateMany(
                { phone: doc.phone, is_fraud: { $ne: true } },
                { $set: { is_fraud: true } },
                session ? { session } : {}
            )
        }
    } catch (e) {
        console.error('[HOOK save] sync is_fraud error:', e.message)
    }
})

Customers.post('findOneAndUpdate', async function (resDoc) {
    try {
        const update = this.getUpdate() || {}
        const nextVal = (update.$set && update.$set.is_fraud) ?? update.is_fraud

        // Триггерим только если явно ставят true
        if (nextVal === true) {
            const session = this.getOptions()?.session

            // Нам нужен phone. Если вернули документ — отлично, иначе достанем по фильтру.
            let phone = resDoc?.phone
            if (!phone) {
                const found = await this.model.findOne(this.getQuery()).select('phone').lean()
                phone = found?.phone
            }

            if (!phone) return

            await this.model.updateMany(
                { phone, is_fraud: { $ne: true } },
                { $set: { is_fraud: true } },
                session ? { session } : {}
            )
        }
    } catch (e) {
        console.error('[HOOK findOneAndUpdate] sync is_fraud error:', e.message)
    }
})

Customers.post(['save', 'findOneAndUpdate'], async function (doc) {
    // Если был вызван findOneAndUpdate, то doc может быть null
    if (!doc) return

    const phone = doc.phone
    const complaints = doc.complaints

    // Обновляем complaints во всех записях с этим номером
    await mongoose.model('Customers').updateMany(
        { phone, _id: { $ne: doc._id } }, // исключаем сам документ
        { $set: { complaints } }
    )
})

export default mongoose.model('Customers', Customers);
