

const getToken = (refreshToken) => {
    let a_t = fetch(process.env.TOKEN_URL, {
        'method': 'POST',
        'headers': {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
            "Authorization": "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
        },
        'body': JSON.stringify({
            'grant_type': 'password',
            'username': process.env.USERNAME,
            'password': process.env.PASSWORD,
        })
    }).then(response => {
        return response.json();
    }).then(json => {
        return json.access_token;
    });
    return a_t;
}

const fetchWrapper = (url, method, body, headers, token) => {
    if (!token) {
        token = getToken();
    }
    let payload = {
        'method': method || "GET",
        'mode': 'cors',
        'credentials': 'include',
        'headers': {
            ...headers,
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
        }
    }
    if (body) {
        payload.body = body;
    }
    return fetch(url, payload);
}