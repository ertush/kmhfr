

import { checkToken } from "../../../controllers/auth/auth";

export default async function postFacilityData(req, res) {

    
    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL
        
        const { path } = req.query
    
        let url = ''
     
            switch (path) {
                case 'facilities':
                    url = `${API_URL}/facilities/facilities/`
                    break;
                case 'gis':
                    url = `${API_URL}/gis/facility_coordinates/`
                default:
                    break;
            }
             
 
            try {
                console.log({url});
                const resp = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    method:'POST',
                    body: JSON.stringify(req.body)
                })
                
                return resp.json()
            }
            catch(err) {
                console.error('Error posting facility basic details: ', err)
                return {
                    error: true,
                    err: err,
                    api_url:API_URL
                }
            }
        }

       
        

    if (req.method === "POST") {
                                                                                    
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
