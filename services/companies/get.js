import ModelCompanies from '../../models/companies.js'

export const getOne = async (id) => {
    const result = {
        data: [],
        errors: []
    }

    try {
        const company = await ModelCompanies.findById(id)

        if (!company) {
            throw new Error('Компания не найдена')
        }

        result.data.push(company)
    } catch (error) {
        result.errors.push({
            input: id,
            message: error.message
        })
    }

    return result
}

export const getAll = async () => {
    const result = {
        data: [],
        errors: []
    }

    try {
        const companies = await ModelCompanies.find()

        result.data = companies // даже если пустой массив — это корректно
    } catch (error) {
        result.errors.push({
            message: error.message
        })
    }

    return result
}