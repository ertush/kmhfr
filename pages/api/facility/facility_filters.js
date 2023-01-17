

import { checkToken } from "../../../controllers/auth/auth";

export default async function fetchFacilityFilters(req, res) {


    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL

        const { path, filters, fields, id } = req.query

        let url = ''


        switch (id) {
            case 'khis_synched':
                url = `${API_URL}/facilities/${path}/?${filters}&fields=${fields}`
                break;
            case 'feedback':
                url = `${API_URL}/facilities/${path}/?fields=${fields}`
                break;

            default:
                break;
        }



        try {


            const resp = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',

                }
            })

            return resp.json()
        }
        catch (err) {
            console.error('Error fetching facility_filters: ', err)
            return {
                error: true,
                err: err,
                api_url: API_URL
            }
        }

    }

    if (req.method === "GET") {

        try {
            return checkToken(req, res).then(t => {
                if (t?.error || t?.data?.error) {
                    let err = new Error('Error checking token')
                    err.status = 401
                    res.status(401).json({
                        error: true,
                        err: err,
                        message: 'Error checking token'
                    })
                } else {
                    let token = t.token

                    return fetchData(token).then(dt => dt).then(data => {

                        res.status(200).json(data)
                        return
                    })
                }
                return
            })

        } catch (err) {
            console.log("getData API error: ", err)
            res.status(500).json({
                "error": true,
                "err": err,
                "message": err.message
            });
        }
    }
}
