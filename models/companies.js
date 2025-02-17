import mongoose from 'mongoose'

const Companies = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Генерация ID автоматически
        name: { type: String, required: true, unique: true }
    },
    {
        timestamps: true, // Автоматически добавляет createdAt и updatedAt
    }
)

export default mongoose.model('Companies', Companies)