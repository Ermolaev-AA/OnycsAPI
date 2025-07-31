import ModelCompanies from '../../models/companies.js'

export const deleteOne = async (id) => {
    const result = {
        data: [],
        errors: []
    }

    try {
        const deletedCompany = await ModelCompanies.findByIdAndDelete(id)

        if (!deletedCompany) {
            throw new Error('Компания не найдена или уже удалена')
        }

        result.data.push(deletedCompany)
    } catch (error) {
        result.errors.push({
            input: id,
            message: error.message
        })
    }

    return result
}