

import { checkToken } from "../../../controllers/auth/auth";

export default async function fetchFormData(req, res) {

    
    const fetchData = async (token) => {

            const API_URL = process.env.NEXT_PUBLIC_API_URL
            const { path, id } = req.query
    
            let url = ''


             // Set url based on request
             switch (path){
                case 'admin_offices':
                    url = `${API_URL}/${path}/${id}/` 
                break;
                case 'counties':
                    url = id ? `${API_URL}/common/${path}/${id}/?fields=id,name'` : `${API_URL}/common/${path}/?fields=id,name&page_size=47` 
                break;
                case 'sub_counties':
                    url = id ? `${API_URL}/common/${path}/?county=${id}&fields=id,name,county` : `${API_URL}/common/${path}/?fields=id,name,county&page_size=307` 
                break;
                case 'wards':
                    url = `${API_URL}/common/${path}/?sub_county=${id}&fields=id,name`
                break;
                default:
                break;
            }

            try {
                // console.log({url})
                const resp = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        
                    }
                })
                
                return resp.json()
                }
                catch(err) {
                    console.error('Error fetching facility data: ', err)
                    return {
                        error: true,
                        err: err.message,
                        api_url:API_URL
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
