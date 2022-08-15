

import { sendStatusCode } from "next/dist/server/api-utils";
import { checkToken } from "../../../controllers/auth/auth";

export default async function submitFormData(req, res) {

    
    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL
        
        const { path } = req.query
    
        let url = ''
        let contentType = ''
        let method = ''
     
            switch (path) {
                case 'facilities':
                    url = `${API_URL}/facilities/facilities/`;
                    method = 'POST';
                    contentType = 'application/json;charset=utf-8';
                    break;
                case 'gis':
                    url = `${API_URL}/gis/facility_coordinates/`
                    method = 'POST';
                    contentType = 'application/json;charset=utf-8';
                    break
                case 'documents':
                    url = `${API_URL}/common/documents/`;
                    method = 'POST';
                    contentType = 'multipart/form-data; boundary=---------------------------22584204591762068164170278481';
                    break;
                case 'facility_data':
                    const {id} = req.query;
                    console.log({facility_id: id});
                    url = `${API_URL}/facilities/facilities/${id}/`;
                    method = 'PATCH';
                    contentType = 'application/json;charset=utf-8';
                    break;
                case 'services':
                    const {_id} = req.query;
                    url = `${API_URL}/facilities/facilities/${_id}/`;
                    method = 'PATCH';
                    contentType = 'application/json;charset=utf-8';
                    break;
                case 'users':
                    url = `${API_URL}/users/`
                    contentType = 'application/json;charset=utf-8';
                    method = 'POST';
                    break
                case 'groups':
                    url = `${API_URL}/users/groups/`
                    contentType = 'application/json;charset=utf-8';
                    method = 'POST';
                    break
                case `edit`:
                    url = `${API_URL}/users/groups/${req.query.id}`
                    contentType = 'application/json;charset=utf-8';
                    method = 'POST';
                    break  
                case `edit_user`:
                    url = `${API_URL}/users/${req.query.id}`
                    contentType = 'application/json;charset=utf-8';
                    method = 'POST';
                    break
                case `delete`:
                    url = `${API_URL}/users/groups/${req.query.id}`
                    contentType = 'application/json;charset=utf-8';
                    method = 'POST';
                    break 
                case `delete_user`:
                    url = `${API_URL}/users/${req.query.id}`
                    contentType = 'application/json;charset=utf-8';
                    method = 'POST';
                    break             
                default:
                    
                    break;
            }
             
 
            try {
                console.log({url});
                const resp = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': contentType
                    },
                    method,
                    body: JSON.stringify(req.body)
                })
                
                return resp.status === 204 ?  sendStatusCode(resp, 204) : resp.json()
            }
            catch(err) {
                console.error('Error posting facility basic details: ', err)
                return {
                    error: true,
                    err: err.message,
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
