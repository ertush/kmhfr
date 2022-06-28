import { checkToken, getToken } from "./auth/auth"

const  approveRejectCHU = async(isApproved, setState,id) => {

    let url = `http://api.kmhfltest.health.go.ke/api/chul/units/${id}/`;
    window.alert(url)
    const token = await checkToken();

    if (isApproved){
        setState(true)
        fetch(url, {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                'cache-control': "no-cache",
                "Content-Type": "application/json;charset=UTF-8", //"multipart/form-data; boundary=---011000010111000001101001",
                "Authorization": "Basic " + token
            },
            body: JSON.stringify({
                is_approved: true,
                is_rejected: false,
            })
        })
            .then(res => res.json())

    } else {
        
        setState(false)

    }

}

const rejectCHU = (e, ctx, state, comment) => {
    e.preventDefault();

    if(state){
        ctx.is_approved = false;
    }else {
        ctx.is_approved = true;
    }

    console.log({comment})
}

export {
    approveRejectCHU,
    rejectCHU
}