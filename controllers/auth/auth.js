// import cookieCutter from 'cookie-cutter'
// import Cookies from 'cookies'
const FormData = require('form-data');
const Cookies = require('cookies')
const cookieCutter = require('cookie-cutter')

const getToken = (req, res, refresh_token, creds) => {
    const isServer = !!req
    const isBrowser = !req
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    const bod = {} //new FormData();
    if (refresh_token && refresh_token.length > 0) {
        console.log('Refreshing token...')
        bod.grant_type = "refresh_token"
        bod.refresh_token = refresh_token
    } else {
        console.log('Getting new token...')
        bod.grant_type = "password"
        bod.username = creds.username || process.env.USERNAME
        bod.password = creds.password || process.env.PASSWORD
    }
    bod.client_id = process.env.CLIENT_ID
    bod.client_secret = process.env.CLIENT_SECRET
    return fetch(process.env.TOKEN_URL, {
        'method': 'POST',
        'headers': {
            "Accept": "application/json",
            'cache-control': "no-cache",
            "Content-Type": "application/x-www-form-urlencoded", //"multipart/form-data; boundary=---011000010111000001101001",
            "Authorization": "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
        },
        'body': new URLSearchParams(bod).toString() //bod
    })
        // return await rs.json()
        .then(response => {
            // console.log('response: ', response)
            let tk = response.json();
            ////
            if (tk && tk.access_token && tk.expires_in && tk.access_token > 0) {
                console.log('Token refreshed.')
                let expiry = new Date(new Date().getTime() + (parseInt(tk.expires_in) * 1000))
                let tkn = {
                    'expires': expiry,
                    'token': tk.access_token,
                    'refresh_token': tk.refresh_token
                }
                ct = tkn
                if (isBrowser) {
                    console.log('Setting new BROWSER token')
                    cookieCutter.set('access_token', '', JSON.stringify(tkn), { expires: expiry })
                } else if (isServer) {
                    console.log('Setting new SERVER token')
                    const cookies = new Cookies(req, res)
                    cookies.set('access_token', JSON.stringify(tkn), { expires: expiry, maxAge: parseInt(tk.expires_in) * 1000, overwrite: true })
                }
                return tkn;
            } else {
                console.log('Error refreshing token: ', tk)
                res.redirect('/auth/login?was='+req.url)
                return { error: true, ...tk };
            }
            ////
            return tk
        }).then(json => {
            console.log('New token: ', json)
            return json;
        }).catch(err => {
            console.log('Error in getToken: ' + err)
            return { error: true, ...err };
        })
}

const checkToken = async (req, res, isProtected, creds) => {
    const isServer = !!req
    const isBrowser = !req
    let ct
    if (isBrowser) {
        console.log('running checkToken in the BROWSER')
        ct = cookieCutter.get('access_token')
    } else if (isServer) {
        console.log('running checkToken in the SERVER')
        const cookies = new Cookies(req, res)
        ct = cookies.get('access_token')
    }
    if(ct && ct != null && ct != undefined && JSON.parse(ct).exp > Date.now()) {
        console.log('Token is valid')
        return JSON.parse(ct)
    }
    //check of cookie has expired
    if (!ct || ct == null || ct == undefined || (ct && JSON.parse(ct).expires > Date.now())) {
        console.log('Token expired. Refreshing...')
        if(res){//check if protected page too
            res.writeHead(301, { Location: '/auth/login?was='+encodeURIComponent(req.url) })
            // res.writeHead(301, { Location: '/auth/login' })
            res.end()
        }
        let refresh_token
        if(ct && JSON.parse(ct).refresh_token){
            refresh_token = JSON.parse(ct).refresh_token
        }
        return getToken(req, res, refresh_token, creds).then(tk => {
            if (!tk.error) {
                console.log('Token refreshed.')
                return tkn;
            } else {
                console.log('Error refreshing token: ', tk)
                res.redirect('/auth/login?was='+encodeURIComponent(req.url))
                return { error: true, ...tk };
            }
        })
    } else {
        ct = JSON.parse(ct)
        console.log('Token is valid.')
        return ct
    }
}

const logIn = (req, res, creds, was) => {
    const isServer = !!req
    const isBrowser = !req
    console.log('LogIn: ', creds)
    return checkToken(req, res, false, creds).then(tk => {
        console.log('Token: ', tk)
        if (tk.error) {
            console.log('Error in LogIn: ', tk)
            res.redirect('/auth/login?was='+encodeURIComponent(req.url)+'&err='+JSON.stringify(tk))
            return { error: true, ...tk };
        } else {
            console.log('LogIn ok: ', tk)
            res.writeHead(301, { Location: decodeURIComponent(was) })
            // return tk;
        }
    }).then(tk => {
        console.log('New token: ', tk)
        return tk;
    }).catch(err => {
        console.log('Error in LogIn: ' + err)
        return { error: true, ...err };
    })
}

module.exports = { checkToken, getToken, logIn }