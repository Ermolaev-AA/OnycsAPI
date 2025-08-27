import mongoose from 'mongoose'

const Deals = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies', required: true }, // внутрений id компании которой принаджит сделка
        external_deal_id: { type: String, required: true, unique: true }, // id сделки в CRM системе
        external_contact_id: { type: String, required: true }, // id контакта в CRM системе
        responsible_id: { type: String, required: true }, // id ответственного по сделке в CRM системе
        responsible_name: { type: String, required: true }, // имя ответственного по сделке в CRM системе
        tag_name: { type: String }, // Название тега в сделки (NEW)
        working_at: { type: Date }, // Дата началы работы по сделке (NEW)
        qualified_at: { type: Date }, // Дата квалификации
        meeting_agency_scheduled_at: { type: Date }, // Дата назначения встречи в агенстве недвижимости (NEW)
        meeting_at: { type: Date }, // Дата проведения встречи в агенстве недвижимости (первая встреча) 
        meeting_developer_scheduled_at: { type: Date }, // Дата назначения встречи в оттделе продаж девеловера (NEW)
        meeting_developer_at: { type: Date }, // Дата проведения встречи в оттделе продаж девеловера (NEW)
        reserved_at: { type: Date }, // Дата Брони
        won_at: { type: Date }, // Дата подписания ухода ДДУ на регистрацию (дата сделки, когда брокер по сути закончил работу)
        registration_completed_at: { type: Date }, // Дата завершения регистрации сделки (NEW)
        commission_received_at: { type: Date }, // Дата получения комиссионого вознагрождения по сделке (NEW)
        calls: { type: Number, default: 0 }, // Кол-во звонков? DEV
        amount_won: { type: Number, default: 0 }, // Сумма успешной сделки?
        external_deal_created_at: { type: Date, required: true }, // Дата создания сделки в crm
        external_contact_created_at: { type: Date, required: true }, // Дата создания контакта в crm
    },
    {
        timestamps: true // Автоматически добавляет createdAt и updatedAt
    }
)

export default mongoose.model('Deals', Deals);
