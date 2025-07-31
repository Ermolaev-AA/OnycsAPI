import mongoose from 'mongoose'

const Companies = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Генерация ID автоматически
        name: { type: String, required: true, unique: true },
        short_name: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                    return /^[a-z]+$/.test(value)
                },
                message: 'short_name must contain only lowercase Latin letters with no spaces'
            }
        },
        domains: {
            type: [String],
            validate: {
                validator: async function (value) {
                    // Проверка на уникальность внутри самого массива
                    if (new Set(value).size !== value.length) {
                        return false
                    }

                    // Проверка, нет ли этих доменов у других компаний
                    const CompanyModel = mongoose.model('Companies')

                    const conflicts = await CompanyModel.findOne({
                        _id: { $ne: this._id }, // исключаем текущий документ
                        domains: { $in: value } // ищем пересечение
                    })

                    return !conflicts
                },
                message: 'One or more domains already exist in other companies'
            }
        }
    },
    {
        timestamps: true, // Автоматически добавляет createdAt и updatedAt
    }
)

export default mongoose.model('Companies', Companies)