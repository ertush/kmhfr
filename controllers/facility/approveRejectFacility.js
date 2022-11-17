
import router from "next/router"

const validateFacility = (facility_id, reject, comment, alert) => {


    if(comment && !reject){
        alert.success("Facility validated successfully")
    }else {
        alert.error("Unable to validate facility")
    }

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
            
            if(res){
                router.push('/facilities?qf=new_pending_validation&pending_approval=true&has_edits=false&is_complete=true') // redirect to New Facilties Pending Validation
            }
         
        })
        .catch(e=>{
         console.error(e.message)
        })
    }catch (e){

        console.error(e.message)
    
    }

}

const approveRejectFacility = (facility_id, comment, alert, reject) => {

    if(comment){
        alert.success(`Facility ${reject ? 'Approved' : 'Rejected'} successfully`)
    }else {
        alert.error(`Unable to ${reject ? 'Approve' : 'Reject'} facility`)
    }
    
    const payload = {
        approved_national_level: reject,
        comment,
        facility: facility_id,
        is_national_approval: reject,
    }

    // console.log(JSON.stringify(payload))
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

            if(res){
                router.push('/facilities?qf=to_publish&to_publish=true') // redirect Facilties Pending Approval
            }
         
         
        })
        .catch(e=>{
            console.error(e.message)
        })
    }catch (e){

        console.error(e)
    }
  

    // console.log({comment})
}

export {
    approveRejectFacility,
    validateFacility
}