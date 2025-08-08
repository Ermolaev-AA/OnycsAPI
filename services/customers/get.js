import ModelCustomers from '../../models/customers.js'

export const getOne = async (id) => {
    const result = {
        data: [],
        errors: []
    }

    try {
        const customer = await ModelCustomers.findById(id)

        if (!customer) {
            throw new Error('Customer not find!')
        }

        result.data.push(customer)
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
        const customers = await ModelCustomers.find()

        result.data = customers
    } catch (error) {
        result.errors.push({
            message: error.message
        })
    }

    return result
}