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
        phone: { type: Number, required: true, unique: true },
        is_spam: { type: Boolean, default: true },
        exist_whtasapp: { type: Boolean, default: false },
        exist_telegram: { type: Boolean, default: false },
        complaint: { type: Number, default: 0 },
    },
    {
        timestamps: true // Автоматически добавляет createdAt и updatedAt
    }
)

export default mongoose.model('Customers', Customers);
