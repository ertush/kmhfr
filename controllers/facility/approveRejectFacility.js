import router from "next/router";

const approveRejectFacility = (rejected, facilityId) => {
   router.push(`/facilities/approve_reject/${facilityId}}`)

}

const validateFacility = (e, facility_id, reject,comment) => {
    e.preventDefault();

    const payload ={
        comment: comment,
        facility: facility_id,
        is_cancelled: reject,
    }
    
    let url=`/api/common/submit_form_data/?path=validate_facility`

    try{
         fetch(url, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(resp =>resp)
        .then(res =>{ 
            
            console.log(res)
            // if(res.status==200){
            // 	router.push('/users')
            // }
        })
        .catch(e=>{
          setStatus({status:'error', message: e})
        })
    }catch (e){

        setStatus({status:'error', message: e})
        console.error(e)
    }
    // if(state){
    //     ctx.is_approved = false;
    // }else {
    //     ctx.is_approved = true;
    // }

    console.log({comment})
}

const approveFacility = (e, facility_id, comment) => {
    e.preventDefault();

    const payload ={
        approved_national_level: true,
        comment,
        facility: facility_id,
        is_national_approval: true,
    }
    console.log(JSON.stringify(payload))
    let url=`/api/common/submit_form_data/?path=validate_facility`
    try{
         fetch(url, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(resp =>resp)
        .then(res =>{ 
            
            console.log(res)
            // if(res.status==200){
            // 	router.push('/users')
            // }
        })
        .catch(e=>{
          setStatus({status:'error', message: e})
        })
    }catch (e){

        setStatus({status:'error', message: e})
        console.error(e)
    }
    // if(state){
    //     ctx.is_approved = false;
    // }else {
    //     ctx.is_approved = true;
    // }

    console.log({comment})
}

export {
    approveRejectFacility,
    validateFacility,
    approveFacility
}