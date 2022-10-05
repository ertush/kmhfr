import {checkToken } from "../../../controllers/auth/auth";


export default async function filterReport(req, res) {


        

        const fetchData = (token) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            const filterQuery = JSON.parse(req.query.query)
                 
            let qry = Object.keys(filterQuery).map(function (key) {
               let er = (key) + '=' + (filterQuery[key]);
               return er
            }).join('&')

            let url = `${API_URL}/facilities/facilities/?${qry}&fields=${req.query.fields}`
            return fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    
                }
            }).then(r => r.json())
            .then(jzon => {
                return jzon
            }).catch(err => {
                console.log('Error fetching filters: ', err)
                return {
                    error: true,
                    err: err,
                    filters: [],
                    api_url:API_URL
                }
            })
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