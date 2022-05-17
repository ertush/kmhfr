const FormData = require('form-data');
const Cookies = require('cookies')
const cookieCutter = require('cookie-cutter')
// require('dotenv').config({ path: `${__dirname}/../../.env.local` })

const getToken = (req, res, refresh_token, creds) => {
    const cookies = new Cookies(req, res)
    console.log('running getToken')
    // console.log('------------getToken: ', creds)
    const isServer = !!req
    const isBrowser = !req
    const bod = {} //new FormData();
    let ct
    if (isBrowser) {
        console.log('running getToken in the BROWSER')
        ct = cookieCutter.get('access_token')
        console.log("B getToken ct == ", ct)
        if (typeof ct == "string") {
            ct = JSON.parse(ct)
        }
        if (ct && ct.expires && ct.expires > Date.now()) {
            return ct
        } else {
            console.log('Refreshing the page...')
            // window.location.reload()
        }
    } else if (isServer) {
        console.log('running getToken in the SERVER')
        ct = cookies.get('access_token')
        console.log("S getToken ct == ", ct)
        if (typeof ct == "string") {
            ct = JSON.parse(ct)
        }
        if (ct && ct.expires && ct.expires > Date.now()) {
            return ct
        }
    }
    if (refresh_token && refresh_token.length > 0 && refresh_token != null) {
        console.log('Refreshing token...')
        bod.grant_type = "refresh_token"
        bod.refresh_token = refresh_token
    } else {
        console.log('Getting new token...')
        bod.grant_type = "password"
        bod.username = creds?.username || process.env.USERNAME
        bod.password = creds?.password || process.env.PASSWORD
    }
    bod.client_id = process.env.CLIENT_ID
    bod.client_secret = process.env.CLIENT_SECRET

    console.log({token_url: process.env.TOKEN_URL})
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
        .then(rs => rs.json())
        .then(response => {
            // console.log('response: ', response)
            let tk = response;
            ////
            if (tk && tk.access_token && tk.expires_in && tk.access_token.length > 0) {
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
                    cookieCutter.set('access_token', JSON.stringify(tkn), { expires: expiry, httpOnly: false })
                } else if (isServer) {
                    console.log('Setting new SERVER token')
                    cookies.set('access_token', JSON.stringify(tkn), { expires: expiry, maxAge: parseInt(tk.expires_in) * 1000, overwrite: true, httpOnly: false })
                }
                return tkn;
            } else {
                console.log('Error refreshing token: ', tk)
                if (isBrowser) {
                    cookieCutter.set('access_token', '', "{}", { expires: new Date(0), httpOnly: false })
                } else if (isServer) {
                    cookies.set('access_token', "{}", { expires: new Date(0), maxAge: 0, overwrite: true, httpOnly: false })
                }
                // res.redirect('/auth/login?was='+req.url+'&h=0')
                return { error: true, ...tk };
            }
        }).then(json => {
            // console.log('New token: ', json)
            return json;
        }).catch(err => {
            console.log('Error in getToken: ', err)
            return { error: true, ...err };
        })
}

const checkToken = async (req, res, isProtected, creds) => {
    const cookies = new Cookies(req, res)
    let crds = creds || null
    // console.log('------------checkToken: ', creds)
    const isServer = !!req
    const isBrowser = !req
    let ct
    if (isBrowser && typeof window != "undefined") {
        console.log('running checkToken in the BROWSER')
        ct = cookieCutter.get('access_token')
        // console.log("B checkToken ct == ", ct)
        if (ct && ct != null && ct != undefined && new Date(ct.expires) > Date.now()) {
            console.log('B Token is valid')//: ', ct)
            return ct
        } else {
            console.log('Refreshing entire page...')
            // window.location.reload()
        }
    } else if (isServer) {
        console.log('running checkToken in the SERVER')
        ct = cookies.get('access_token')
        if (typeof ct == "string") {
            ct = JSON.parse(ct)
        }
        // console.log("S checkToken ct == ", ct)
        if (ct && ct != null && ct != undefined && new Date(ct.expires) > Date.now()) {
            console.log('S Token is valid')//: ', ct)
            return ct
        }
    }
    //check of cookie has expired
    if (!ct || ct == null || ct == undefined || (ct && JSON.parse(ct).expires > Date.now())) {
        console.log('Token expired. Refreshing...')
        if (req && req.asPath != '/api/login' && req.asPath != '/auth/login') {//check if protected page too
            // res.writeHead(301, { Location: '/auth/login?was=' + req.asPath + '&h=1' })
            res.writeHead(301, { Location: '/auth/login?was=' + encodeURIComponent(req.url) + '&h=1' })
            res.end()
            return { error: true, message: 'Token expired. Refreshing...' }
        }else if(!req || typeof window != "undefined"){
            window.location.href = '/auth/login?h=1'
        }
        let refresh_token
        if (ct && ct != undefined && JSON.parse(ct).refresh_token != undefined) {
            refresh_token = JSON.parse(ct).refresh_token
        }
        return getToken(req, res, refresh_token, crds).then(tk => {
            if (!tk.error) {
                console.log('Token refreshed.')
                return tkn;
            } else {
                console.log('Error refreshing token: ', tk)
                // res.redirect('/auth/login?was='+encodeURIComponent(req.url))
                return { error: true, ...tk };
            }
        })
    } else {
        ct = JSON.parse(ct)
        console.log('Token is valid.')
        return ct
    }
}

const logUserIn = (req, res, creds, was) => {
    console.log({creds})
    // console.log('------------logUserIn: ', creds)
    return getToken(req, res, null, creds).then(tk => {
        if (tk.error) {
            console.log('Error in LogIn: ', tk)
            return { error: true, ...tk };
        } else {
            console.log('LogIn ok: ', tk)
            return tk;
        }
    })
        .catch(err => {
            console.log('Error in LogIn: ', err)
            return { error: true, ...err };
        })
}

const getUserDetails = async (token, url) => {
    console.log({url})
    // console.log('getUserDetails TOKEN: ',token)
    // console.log('getUserDetails URL: ',url)
    // let url = process.env.API_URL + '/rest-auth/user/'
    // let url = 'https://api.kmhfltest.health.go.ke/api' + '/rest-auth/user/'
    if (typeof window != "undefined") {
        let savedSession = window.sessionStorage.getItem('user')
        if (savedSession && savedSession.length > 0) {
            savedSession = JSON.parse(window.sessionStorage.getItem('user'))
        }
        if (savedSession && savedSession?.id && savedSession?.id.length > 0) {
            console.log('Saved session: ', savedSession)
            return savedSession
        }
        // console.log('W getUserDetails URL: ',url)
    }

    return fetch(url, {
        'method': 'GET',
        'headers': {
            "Accept": "application/json",
            'cache-control': "no-cache",
            "Authorization": "Bearer " + token
        }
    })
        .then(j => j.json())
        .then(response => {
            // console.log('=================== getUserDetails returned: ', response)
            if (response.detail || response.error) {
                console.log('Error in getUserDetails: ', response)
                return {
                    error: true, message: response.detail || response.error
                }
            }
            if (typeof window !== "undefined") {
                // console.log('getUserDetails returning ', response)
                window.sessionStorage.setItem('user', JSON.stringify(response))
            }
            return response
        }).catch(err => {
            console.log('Error in getUserDetails: ', err)
            return {
                error: true, message: err.message || err
            }
        })

}

const getUserContacts = async (token, url) => {
    return fetch(url, {
        'method': 'GET',
        'headers': {
            "Accept": "application/json",
            'cache-control': "no-cache",
            "Authorization": "Bearer " + token
        }
    })
        .then(j => j.json())
        .then(response => {
            // console.log('=================== getUserContacts returned: ', response)
            if (response.detail || response.error) {
                console.log('Error in getUserContacts: ', response)
                return {
                    error: true, message: response.detail || response.error
                }
            }
            return response
        }).catch(err => {
            console.log('Error in getUserContacts: ', err)
            return {
                error: true, message: err.message || err
            }
        })

}

const saveUser = async (token, url, payload) => {
    if (token && token.length > 0) {
        fetch(url, {
            'method': 'PATCH',
            'headers': {
                "Accept": "application/json",
                'cache-control': "no-cache",
                "Content-Type": "application/x-www-form-urlencoded", //"multipart/form-data; boundary=---011000010111000001101001",
                "Authorization": "Bearer " + token
            },
            'body': payload
        }).then(j => j.json())
            .then(response => {
                // console.log('=================== saveUser returned: ', response)
                if (response.detail || response.error) {
                    console.log('Error in saveUser: ', response)
                    return {
                        error: true, message: response.detail || response.error
                    }
                }
                return response
            }).catch(err => {
                console.log('Error in saveUser: ', err)
                return {
                    error: true, message: err.message || err
                }
            })
    }

}

module.exports = { checkToken, getToken, logUserIn, getUserDetails, getUserContacts }