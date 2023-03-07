

import { checkToken } from "../../../controllers/auth/auth";

export default async function fetchFacilityData(req, res) {


    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL


        const { path, id } = req.query

        let url = ''
        let params = ''


        // Set url based on request
        switch (path) {
            case 'wards':
                url = `${API_URL}/common/${path}/${id}/`
                break;

            case `facility_services`:
                url = `${API_URL}/facilities/facility_services/?facility=${id}`
                break;

            case 'facilities':
                url = `${API_URL}/facilities/${path}/${id}/`
                break;

            case 'facility_coordinates':
                url = `${API_URL}/gis/${path}/?facility=${id}`
                break;

            case 'facility_regulation_status':
                url = `${API_URL}/facilities/${path}/?facility=${id}`
                break;

            case 'facility_updates':
                url = `${API_URL}/facilities/${path}/${id}/`
                break;

            case `facilities_count`:
                url = API_URL + `/reporting/?county=${req.query.id}&report_type=facility_count_by_county&report_level=county`
                break;

            case `filter_facilities_by_owners`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/reporting/?report_type=facility_count_by_owner_category&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `filter_facilities_by_owners_category`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/reporting/?report_type=facility_count_by_owner&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `filter_facilities_by_type`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/reporting/?report_type=facility_count_by_facility_type&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `facility_type_details`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/reporting/?report_type=facility_count_by_facility_type_details&parent=&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `keph_level`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/reporting/?report_type=facility_keph_level_report&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `facility_coordinates`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/facilities/facilities/?county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `admin_offices`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/admin_offices/?report_type=county&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `chu_status`:
                params = JSON.parse(req.query.drilldown)
                url = `${API_URL}/reporting/chul/?report_type=status&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

            case `change_log`:
                url = `${API_URL}/facilities/facilities/${id}/?fields=__rev__&include_audit=true`
                break;

            case `searchTerm`:
                
                const { search, menu } = req.query;
                const fields = 'fields=id,code,official_name,name,facility_type_name,owner_name,county,sub_county,constituency,ward_name,updated,approved,rejected,operation_status_name,date_requested,date_approved,sub_county_name,is_complete,approved_national_level' 
                
                switch(menu){
                    case 'all':
                        url = `${API_URL}/facilities/facilities/?${fields}&search=${search}`
                    case 'approved_facilities':
                        url = `${API_URL}/facilities/facilities/?approved=true&approved_national_level=true&rejected=false&${fields}&search=${search}`
                    break;
                    case 'facilities_pending_validation':
                        url = `${API_URL}/facilities/facilities/?pending_approval=true&has_edits=true&${fields}&search=${search}`
                    break;
                    case 'updated_facilities_pending_validation':
                        url = `${API_URL}/facilities/facilities/?rejected=true&${fields}&search=${search}`
                    break;
                    case 'facilities_pending_approval':
                        url = `${API_URL}/facilities/facilities/?rejected=true&${fields}&search=${search}`
                    break;
                    case 'failed_validation_facililties':
                        url = `${API_URL}/facilities/facilities/?rejected_national=true&${fields}&search=${search}`
                    break;
                    case 'close_facilities':
                        url = `${API_URL}/facilities/facilities/?closed=true&${fields}&search=id,code,official_name,closing_reason,closed_date,name&search=${search}`
                    break;
                    case 'incomplete_facilities':
                        url = `${API_URL}/facilities/facilities/?incomplete=true&${fields}&search=${search}`
                    break;
                    case 'rejetcted_facilities':
                        url = `${API_URL}/facilities/facilities/?rejected_national=true&${fields}&search=${search}`
                    break;
                    default:
                        url = `${API_URL}/facilities/facilities/?${fields}`
                        break;

                }
             

           
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
        catch (err) {
            console.error('Error fetching facility data: ', err)
            return {
                error: true,
                err: err.message,
                api_url: API_URL
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
