import ServiceAmoCRM from '../../services/external/amocrm/index.js'

export const request = async (req) => {
    try {
        const { body } = req

        const ownerID = body?.owner_id
        const name = body?.name
        const subdomain = body?.subdomain
        const type = body?.type
        const token = body?.token

        if (!ownerID) throw new Error('The required «owner_id» parameter is missing!')
        if (!name) throw new Error('The required «name» parameter is missing!')
        if (!subdomain) throw new Error('The required «subdomain» parameter is missing!')
        if (!type) throw new Error('The required «type» parameter is missing!')
        if (!token) throw new Error('The required «token» parameter is missing!')

        if (type !== 'amocrm' && type !== 'bitrix24') throw new Error('The «type» value can be «amocrm» or «bitrix24»!')

        const account = await ServiceAmoCRM.GET.account(subdomain, token)
        const pipelines = await ServiceAmoCRM.GET.pipelines(subdomain, token)
        const users = await ServiceAmoCRM.GET.users(subdomain, token)
        const fields = await ServiceAmoCRM.GET.fields(subdomain, token)

        if (!account?.id) throw new Error('Account details could not be retrieved!')

        return { ownerID, name, subdomain, type, token, fields }
    } catch (error) {
        throw error
    }
}