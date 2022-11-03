

import { checkToken } from "../../../controllers/auth/auth";

export default async function postSystemSetupData(req, res) {

    
    const postData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL

        const {path} = req.query
        let method = req.method
        let url = ''
        let contentType=''
        let id = req.query.id || ''
        switch (path){
            case 'add_infrastructure':
                url = `${API_URL}/facilities/infrastructure/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'add_contact_type': 
                url = `${API_URL}/common/contact_types/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'add_facility_dept': 
                url = `${API_URL}/facilities/facility_depts/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'add_facility_type': 
                url = `${API_URL}/facilities/facility_types/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'add_facility_status': 
                url = `${API_URL}/facilities/facility_status/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'add_facility_admission': 
                url = `${API_URL}/facilities/facility_admission_status/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'add_facility_owner': 
                url = `${API_URL}/facilities/owner_types/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'add_facility_owner_category': 
                url = `${API_URL}/facilities/owners/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'add_facility_job_title': 
                url = `${API_URL}/facilities/job_titles/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'add_facility_regulatory_status': 
                url = `${API_URL}/facilities/regulation_status/${id}`
                contentType = 'application/json;charset=utf-8';
            break; //add_facility_change_reason
            case 'add_facility_change_reason': 
                url = `${API_URL}/facilities/level_change_reasons/${id}`
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
                method: method,
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

    if (req.method !== null) {
                                                                                    
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
