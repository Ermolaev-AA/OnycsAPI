import Build from '../../utils/build/index.js'

export const create = async (req, res) => {
    try {
        const { body } = req
        if (!body) return res.status(400).json({ error: 'The required «body» parameter is missing!' })

        // // req params:
        // // amocrm (alfa)
        // const subdomain = 'alfare'
        // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImUwMGE5N2U0YmY4MzM5YmFlMDc5N2NkZWM0ZGYzZWYwZDg3YTIzMjEyZDQ4MTY0MmQ3N2E1NTJmZTIzMmJjNjBmYzk5OTkxOTJjMGYzN2U5In0.eyJhdWQiOiJiM2NiOTdkMi02MTQxLTQ1YjEtOGFlNS03NDJmMDJjZGY1ODgiLCJqdGkiOiJlMDBhOTdlNGJmODMzOWJhZTA3OTdjZGVjNGRmM2VmMGQ4N2EyMzIxMmQ0ODE2NDJkNzdhNTUyZmUyMzJiYzYwZmM5OTk5MTkyYzBmMzdlOSIsImlhdCI6MTc1ODIxNDM2MCwibmJmIjoxNzU4MjE0MzYwLCJleHAiOjE5MTU5MjAwMDAsInN1YiI6IjczODM3MDMiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MTU2MzYxNTcsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbImNybSIsImZpbGVzIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyIsInB1c2hfbm90aWZpY2F0aW9ucyJdLCJ1c2VyX2ZsYWdzIjowLCJoYXNoX3V1aWQiOiIyZWVhYzI5MS01M2QwLTRkMzMtYmIwNi02Nzk2ZGQ1ZGFkM2MiLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.PMbRvfmSlwNPmO2TzeHcY_CUoXVGECwMen-hxCn1FRfRmrwJ6GLDvo0uDnSNdCUKYbP7IANGROLgY29gGMjUfFAPfx5DsV1aFIRPOrZwNnEli_FmJeuYqsG5_-1AJD7Zq36aOPRXUnVCfFDHl50E4v7Xx7yVMsBmvHaFoBeE-FwEugC7FSIt-ublrJZfMk-OiHiZUaGoILEvbplGycDX-x-FtilDhVjLM9OjhdPxPQOu3DMgW3NwNZE77cUIBO4L6P9fWp3M957KYcuQY9A5RQERQgyHmTEW1LvCaMyQLD2vdNv00u-lkU5MCeCPklxzm164paYcvEXQ5uDPopoY8g'

        // // amocrm (alfa)
        // const url = `https://${subdomain}.amocrm.ru/api/v4/account`
        // const response = await fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json'
        //     }
        // })

        // const data = await response.json()

        const request = await Build.CRM.request(req)
        res.status(200).json(request)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}