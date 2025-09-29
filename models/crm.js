import mongoose from 'mongoose'

const CRM = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Генерация ID автоматически
        owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies', required: true },
        name: { type: String, required: true },
        subdomain: { type: String, required: true, unique: true },
        type: { 
            type: String, 
            required: true,
            enum: {
                values: ['amocrm', 'bitrix24'],
                message: 'The CRM type must be either «amocrm» or «bitrix24»'
            }
        },
        token: { type: String, required: true, unique: true }
    },
    {
        timestamps: true, // Автоматически добавляет createdAt и updatedAt
    }
)

export default mongoose.model('CRM', CRM)