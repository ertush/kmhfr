

import { checkToken } from "../../../controllers/auth/auth";

export default async function fetchSystemSetupData(req, res) {

    
    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    

    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL

        const {resource, resourceCategory,id, ...qux} = req.query
        
        let res = req.query.resource
        let resCat = req.query.resourceCategory
        let url = ''
        let _id = req.query.id

        let qry = Object.keys(qux).map(function (key) {
            let er = (key) + '=' + (qux[key]);
            return er
         }).join('&')

        switch (resCat){
            case 'AdminUnits':
                if(_id== undefined){
                    url = `${API_URL}/common/${res}/?${qry}&page_size=1500`
                }else{
                    url = `${API_URL}/common/${res}/${_id}/`
                }
            break;
            case 'ServiceCatalogue':
                if(_id == undefined){
                    url = `${API_URL}/facilities/${res}/?${qry}&page_size=1000`
                }else{
                    url = `${API_URL}/facilities/${res}/${_id}/`
                }
            break;
            case 'HealthInfrastructure':
                if(_id== undefined){
                    url = `${API_URL}/facilities/${res}/?${qry}&page_size=1000`
                }else{
                    url = `${API_URL}/facilities/${res}/${_id}/`
                }
            break;
            case 'HR':
                if(_id== undefined){
                    url = `${API_URL}/facilities/${res}/?${qry}&page_size=1000`
                }else{
                    url = `${API_URL}/facilities/${res}/${_id}/`
                }
            break;
            case 'Contacts':
                if(_id== undefined){
                    url = `${API_URL}/common/${res}/?${qry}&page_size=1000`
                }else{
                    url = `${API_URL}/common/${res}/${_id}/}`
                }
            break;
            case 'Counties':
                url = `${API_URL}/common/${res}/?page_size=1000`
            break;
            case 'Facilities':
                if(_id== undefined){ 
                    url = `${API_URL}/facilities/${res}/?${qry}&page_size=1000`
                }else{
                    url = `${API_URL}/facilities/${res}/${_id}/`
                }
            break;
            case 'CHU':
                url = `${API_URL}/chul/${res}/?${qry}&page_size=1000`
            break;
            case 'Documents':
                url = `${API_URL}/common/${res}/?${qry}&page_size=1000`
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

            
            return await resp.json()
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
