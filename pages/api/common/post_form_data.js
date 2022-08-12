

import { checkToken } from "../../../controllers/auth/auth";

export default async function postFormData(req, res) {

    
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
                    break
                case 'documents':
                    url = `${API_URL}/common/documents/`
                    break
                case 'users':
                    url = `${API_URL}/users/`
                    break
                case 'groups':
                    url = `${API_URL}/users/groups/`
                    break
                case `edit`:
                    url = `${API_URL}/users/groups/${req.query.id}`
                    break  
                case `edit_user`:
                    url = `${API_URL}/users/${req.query.id}`
                    break
                case `delete`:
                    url = `${API_URL}/users/groups/${req.query.id}`
                    break 
                case `delete_user`:
                    url = `${API_URL}/users/${req.query.id}`
                    break             
                default:
                    
                    break;
            }
             
 
            try {

                const resp = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': `${path === 'documents' ? 'multipart/form-data; boundary=---------------------------225842045917620681641702784814' : 'application/json;charset=utf-8'}`
                    },
                    method:req.method,
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

       
        

    if (req.method !== null && req.method !== '') {
                                                                                    
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
