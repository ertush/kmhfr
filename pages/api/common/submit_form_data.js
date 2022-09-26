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
                    url = `${API_URL}/facilities/facilities/${req.query.id}/`;
                    method = 'PATCH';
                    contentType = 'application/json;charset=utf-8';
                    break;
                case 'services':                 
                    url = `${API_URL}/facilities/facilities/${req.query.id}/`;
                    method = 'PATCH';
                    contentType = 'application/json;charset=utf-8';
                    break;
                case 'infrastructure':           
                    url = `${API_URL}/facilities/facilities/${req.query.id}/`;
                    method = 'PATCH';
                    contentType = 'application/json;charset=utf-8';
                    break;
                case 'hr':               
                    url = `${API_URL}/facilities/facilities/${req.query.id}/`;
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
                    method = 'PATCH';
                    break  
                case `edit_user`:
                    url = `${API_URL}/users/${req.query.id}`
                    contentType = 'application/json;charset=utf-8';
                    method = 'PUT';
                    break
                case `delete`:
                    url = `${API_URL}/users/groups/${req.query.id}`
                    contentType = 'application/json;charset=utf-8';
                    method = 'DELETE';
                    break 
                case `delete_user`:
                    url = `${API_URL}/users/${req.query.id}`
                    contentType = 'application/json;charset=utf-8';
                    method = 'DELETE';
                    break
                case `validate_facility`:
                    url = `${API_URL}/facilities/facility_approvals/`
                    contentType = 'application/json;charset=utf-8';
                    method = 'POST';
                    break  
                case `beds_cots`:
                    url = `${API_URL}/reporting/?report_type=facility_count_by_county`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break  
                case `facility_owners`:
                    url = `${API_URL}/reporting/?report_type=facility_count_by_owner_category`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break 
                case `owner_categories`:
                    url = `${API_URL}/reporting/?report_type=facility_count_by_owner`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break   
                case `facility_type`:
                    url = `${API_URL}/reporting/?report_type=facility_count_by_facility_type`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break
                case `keph_level`:
                    url = `${API_URL}/reporting/?report_type=facility_keph_level_report`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break
                case `facility_coordinates`:
                    url = `${API_URL}/facilities/facilities/`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break
                case `officers_in_charge`:
                    url = `${API_URL}/facilities/facility_officers/`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break
                case `admin_offices`:
                    url = `${API_URL}/admin_offices/?report_type=county`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break  
                case `chu_count`:
                    url = `${API_URL}/reporting/chul/?report_type=county`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break            
                case `facilities_count`:
                    url =API_URL + `/reporting/?county=${req.query.id}&report_type=facility_count_by_county&report_level=county`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
                    break 
                case `chu_status`:
                    url = `${API_URL}/reporting/chul/?report_type=status`
                    contentType = 'application/json;charset=utf-8';
                    method = 'GET';
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
                    body: method == 'GET' ? null:JSON.stringify(req.body)
                })
                
                return resp.json()
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

       
        

    if (req.method !== '' && req.method !== null) {
                                                                                    
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
