// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserDetails, logUserIn, checkToken } from "../../controllers/auth/auth";

const API_URL = process.env.API_URL

const fetchData = (token, url_fragment) => {
    let url = API_URL + url_fragment
    console.log(' == fetching(' + url + ')')
    return fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    }).catch(err => {
        console.log('fetchData err ===== ', err)
        return {
            error: true,
            err: err
        }
    })
}

export default async function getData(req, res) {
    if (req.method === "GET" && req.query.url) {
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
                    let url_fragment = Buffer.from(decodeURI(req.query.url), 'base64').toString('ascii').replace('endpoint','')
                    return fetchData(token, url_fragment).then(dt =>dt.json()).then(data => {
                        // console.log('data ===== ', data)
                        res.status(200).json(data)
                        return
                    })
                }
                return
            })
            return
        } catch (err) {
            console.log("getData API error: ", err)
            res.status(500).json({
                "error": true,
                "err": err,
                "message": err.message
            });
        }
    } else {
        res.status(400).json({
            "error": true,
            "message": "Invalid request"
        });
    }
}
