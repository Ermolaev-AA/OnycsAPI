import ModelCompanies from '../../models/companies.js'

export const createOne = async (body) => {
    const result = {
        created: [],
        errors: []
    }

    try {
        const createdCompany = await ModelCompanies.create({ ...body })
        result.created.push(createdCompany)
    } catch (error) {
        result.errors.push({
            input: body,
            message: error.message
        })
    }

    return result
}

export const createMany = async (companies) => {
    const results = {
        created: [],
        errors: []
    }

    for (const company of companies) {
        try {
            const created = await ModelCompanies.create(company)
            results.created.push(created)
        } catch (error) {
            results.errors.push({
                input: company,
                message: error.message
            })
        }
    }

    return results
}