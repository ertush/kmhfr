
// Describing url paths that fetch data based on the specificied url path

import { checkToken } from "../../../controllers/auth/auth";

export default async function fetchFacilityData(req, res) {


    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL


        const { path, id } = req.query

        const url = `${API_URL}/facilities/facilities/?page=1&page_size=`
        let params = ''
        const access_token = token

    

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
            console.error('Error fetching facility data: ', err)
            return {
                error: true,
                err: err.message,
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
                     
                    if(typeof(req.query.path) == 'string'){
                        if(
                            req.query.path.match(/facility_cover_report/) || 
                            req.query.path.match(/facility_correction_template/) ||
                            req.query.path.match(/facility_detail_report/) 
                         ){
                            console.log({data}, typeof(data))
                            console.log("errrrror")
                            const file = new FileReader()
                            file.readAsBinaryString(data)
                            file;
                        }
                        else{
                             res.status(200).json(data)
                        }
                    }
                    }) .catch(console.error)
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
