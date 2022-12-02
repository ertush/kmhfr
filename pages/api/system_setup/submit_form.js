

import { checkToken } from "../../../controllers/auth/auth";

export default async function postSystemSetupData(req, res) {

    
    const postData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL

        const {path,resourceCategory} = req.query
        let method = req.method
        let url = ''
        let contentType=''
        let id = req.query.id || ''
        switch (path){
            case 'hr category':
                url = `${API_URL}/facilities/speciality_categories/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'category':
                if(resourceCategory === 'ServiceCatalogue'){
                    url = `${API_URL}/facilities/service_categories/${id}`
                }else{
                    url = `${API_URL}/facilities/infrastructure_categories/${id}`
                }
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'county':
                url = `${API_URL}/common/counties/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'ward':
                url = `${API_URL}/common/wards/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'constituency':
                url = `${API_URL}/common/constituencies/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'town':
                url = `${API_URL}/common/towns/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'option group':
                url = `${API_URL}/facilities/option_group_with_options/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'service':
                url = `${API_URL}/facilities/services/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'specialty':
                url = `${API_URL}/facilities/specialities/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'infrastructure':
                url = `${API_URL}/facilities/infrastructure/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'contact type': 
                url = `${API_URL}/common/contact_types/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'facility department': 
                url = `${API_URL}/facilities/facility_depts/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'facility type detail': 
                url = `${API_URL}/facilities/facility_types/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'facility type category': 
                url = `${API_URL}/facilities/facility_types/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'facility operation status': 
                url = `${API_URL}/facilities/facility_status/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'facility admission status': 
                url = `${API_URL}/facilities/facility_admission_status/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'facility owner detail': 
                url = `${API_URL}/facilities/owner_types/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'facility owner category': 
                url = `${API_URL}/facilities/owners/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'job title': 
                url = `${API_URL}/facilities/job_titles/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'regulatory status': 
                url = `${API_URL}/facilities/regulation_status/${id}`
                contentType = 'application/json;charset=utf-8';
            break; 
            case 'upgrade reason': 
                url = `${API_URL}/facilities/level_change_reasons/${id}`
                contentType = 'application/json;charset=utf-8';
            break;
            case 'regulatory body': 
                url = `${API_URL}/facilities/regulating_bodies/${id}`
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
                body: method == 'DELETE' ? null:JSON.stringify(req.body)

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
