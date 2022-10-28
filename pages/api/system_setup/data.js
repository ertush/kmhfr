

import { checkToken } from "../../../controllers/auth/auth";

export default async function fetchSystemSetupData(req, res) {

    
    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL

        const {resource, resourceCategory, fields, id} = req.query
    
        let url = ''
        let _id = id
        // console.log({resource, resourceCategory, fields});

        switch (resourceCategory){
            case 'AdminUnits':
                url = `${API_URL}/common/${resource}/?fields=${fields}`
            break;
            case 'ServiceCatalogue':
                url = `${API_URL}/facilities/${resource}/?fields=${fields}` 
            break;
            case 'HealthInfrastructure':
                if(id== undefined){
                    url = `${API_URL}/facilities/${resource}/?fields=${fields}`
                }else{
                    url = `${API_URL}/facilities/${resource}/${_id}/`
                }
            break;
            case 'HR':
                url = `${API_URL}/facilities/${resource}/?fields=${fields}`
            break;
            case 'Contacts':
                url = `${API_URL}/common/${resource}/?fields=${fields}`
            break;
            case 'Facilities':
                url = `${API_URL}/facilities/${resource}/?fields=${fields}`
            break;
            case 'CHU':
                url = `${API_URL}/chul/${resource}/?fields=${fields}`
            break;
            case 'Documents':
                url = `${API_URL}/common/${resource}/?fields=${fields}`
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
        catch(err) {
            console.error('Error fetching system setup data: ', err)
            return {
                error: true,
                err: err,
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
