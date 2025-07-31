import ModelCompanies from '../../models/companies.js'

export const updateOne = async (updateData) => {
    const result = {
        data: null,
        errors: []
    }

    try {
        const { _id, ...updates } = updateData
        const updated = await ModelCompanies.findByIdAndUpdate(_id, updates, {
            new: true,
            runValidators: true
        })

        if (!updated) {
            result.errors.push({ _id, message: 'Компания не найдена' })
        } else {
            result.data = updated
        }

        return result
    } catch (error) {
        result.errors.push({ _id: updateData._id, message: error.message })
        return result
    }
}

export const updateMany = async (companies) => {
    const result = {
        data: [],
        errors: []
    }

    for (const company of companies) {
        try {
            const { _id, ...updates } = company
            const updated = await ModelCompanies.findByIdAndUpdate(_id, updates, {
                new: true,
                runValidators: true
            })

            if (!updated) {
                result.errors.push({ _id, message: 'Компания не найдена' })
            } else {
                result.data.push(updated)
            }
        } catch (error) {
            result.errors.push({ _id: company._id, message: error.message })
        }
    }

    return result
}