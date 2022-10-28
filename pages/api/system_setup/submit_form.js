

import { checkToken } from "../../../controllers/auth/auth";

export default async function postSystemSetupData(req, res) {

    
    const postData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL

        const {path} = req.query
    
        let url = ''
        let contentType=''

        switch (path){
            case 'add_infrastructure':
                url = `${API_URL}/facilities/infrastructure/`
                contentType = 'application/json;charset=utf-8';
            break;

            case 'add_contact_type': 
                url = `${API_URL}/common/contact_types/`
                contentType = 'application/json;charset=utf-8';
            break;

            default:
            break;
        }
        

        try {
          
            const resp = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': contentType
  
                },
                method: 'POST',
                body: JSON.stringify(req.body)

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
                   
                    return postData(token).then(dt => dt).then(data => {
                    
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
