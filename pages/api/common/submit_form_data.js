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
            case 'CHUs':
                url = `${API_URL}/chul/units/`
                method = 'POST';
                contentType = 'application/json;charset=utf-8';
                break;
            case 'gis':
                url = `${API_URL}/gis/facility_coordinates/`
                method = 'POST';
                contentType = 'application/json;charset=utf-8';
                break;
            case 'documents':
                url = `${API_URL}/common/documents/`;
                method = 'POST';
                contentType = 'multipart/form-data; boundary=---------------------------22584204591762068164170278481';
                break;
            case 'chul_data':
                url = `${API_URL}/chul/units/${req.query.id}/`;
                method = 'PATCH';
                contentType = 'application/json;charset=utf-8';
                break;
            case 'edit_chul':
                url = `${API_URL}/chul/units/${req.query.id}/`;
                method = 'PATCH';
                contentType = 'application/json;charset=utf-8';
                break;
            case 'chul_services':
                url = `${API_URL}/chul/units/${req.query.id}/`;
                method = 'PATCH';
                contentType = 'application/json;charset=utf-8';
                break;
            case 'delete_facility_service':
                url = `${API_URL}/facilities/facility_services/${req.query.id}/`;
                method = 'DELETE';
                contentType = 'application/json;charset=utf-8';
                break;

            case 'delete_facility_infrastructure':
                url = `${API_URL}/facilities/facility_infrastructure/${req.query.id}/`;
                method = 'DELETE';
                contentType = 'application/json;charset=utf-8';
                break;

            case 'delete_facility_hr':
                url = `${API_URL}/facilities/facility_specialists/${req.query.id}/`;
                method = 'DELETE';
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
            case `approve_reject_facility_updates`:
                url = `${API_URL}/facilities/facility_updates/${req.query.id}/`
                contentType = 'application/json;charset=utf-8';
                method = 'PATCH';
                break
            case `approve_chul`:
                url = `${API_URL}/chul/units/${req.query.id}/`
                contentType = 'application/json;charset=utf-8';
                method = 'PATCH';
                break
            case `approve_chul_updates`:
                url = `${API_URL}/chul/updates/${req.query.latest_updates}/`
                contentType = 'application/json;charset=utf-8';
                method = 'PATCH';
                break
            case `reject_chul`:
                url = `${API_URL}/chul/units/${req.query.id}/`
                contentType = 'application/json;charset=utf-8';
                method = 'PATCH';
                break
            case 'basic_details_update':
                url = `${API_URL}/facilities/facilities/${req.query.id}/`;
                method = 'PATCH';
                contentType = 'application/json;charset=utf-8';
                break;
            case 'update_geolocation':

                url = `${API_URL}/gis/facility_coordinates/${req.query.id}/`;
                method = 'PATCH';
                contentType = 'application/json;charset=utf-8';
                break;
            case `admin_offices`:
                url = `${API_URL}/admin_offices/`
                contentType = 'application/json;charset=utf-8';
                method = 'POST'
                break
            case `delete_admin_office`:
                url = `${API_URL}/admin_offices/${req.query.id}`
                contentType = 'application/json;charset=utf-8';
                method = 'DELETE';
                break
            case `regulation_status`:
                url = `${API_URL}/facilities/facility_regulation_status/`
                contentType = 'application/json;charset=utf-8';
                method = 'PATCH';
                break
            case `facility_upgrade`:
                url = `${API_URL}/facilities/facility_upgrade/`
                contentType = 'application/json;charset=utf-8';
                method = 'POST';
                break
            case `close_facility`:
                url = `${API_URL}/facilities/facilities/${req.query.id}`
                contentType = 'application/json;charset=utf-8';
                method = 'PATCH';
                break
            case `delete_contact`:
                url = `${API_URL}/facilities/contacts/${req.query.id}`
                method = 'DELETE';
                break;
            default:


                break;
        }

        try {

            const resp = await fetch(url,
                url.includes('common/documents') ?
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Accept': 'application/json, text/plain, */*',
                        },
                        method,
                        body: req.body
                    }
                    :
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': contentType
                        },
                        method,
                        body: method == 'DELETE' ? null : JSON.stringify(req.body)
                    }
            )

            return url.includes('common/documents') ? resp : await resp.json()
        }
        catch (err) {
            console.error('Error posting facility basic details: ', err)
            return {
                error: true,
                err: err.message,
                api_url: API_URL
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
