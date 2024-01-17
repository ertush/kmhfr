
import router from "next/router"

function validateRejectFacility (facility_id, reject, comment, alert, token, setSubmitting, setRejecting, setFormError) {

    

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_approvals/`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`

            },
            method: 'POST',
            body: JSON.stringify({
                comment: comment,
                facility: facility_id,
                is_cancelled: reject,
            })
        })
         .then(resp => {

                if (resp.status == 200 || resp.status == 201) {
                    setSubmitting(false)
                    if (!reject) {
                        alert.success("Facility validated successfully")
                    } else {
                        alert.success("Facility rejected successfully")
                    }
                    router.push('/facilities?qf=new_pending_validation&pending_approval=true&has_edits=false&is_complete=true') // redirect to New Facilties Pending Validation
                } else {
                    setRejecting(false)

                    resp.json()
                    .then(resp => {
                        const formResponse = []
                        setFormError(() => {
                          if(typeof resp == 'object') {
                            const respEntry = Object.entries(resp)
            
                            for (let [_, v] of respEntry) {
                              formResponse.push(v)
                            }
            
                            return `Error: ${formResponse.join(" ")}`
                          }
                        })
                    })
                }

            })
            .catch(e => {
                console.error(e.message)
            })
    

}

function approveRejectFacility (facility_id, comment, alert, reject, token, setSubmitting, setRejecting, setFormError) {

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_approvals/`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`

            },
            method: 'POST',
            body: JSON.stringify({
                approved_national_level: reject,
                comment,
                facility: facility_id,
                is_national_approval: reject,
            })
        })
            .then(resp => {

                if (resp.status == 200 || resp.status == 201) {
                    setSubmitting(false)
                    if (reject) {
                        alert.success(`Facility Approved successfully`)
                    } else {
                        alert.success(`Facility Rejected successfully`)
                    }
                    
                    router.push('/facilities?qf=approved&approved=true&approved_national_level=true&rejected=false') // redirect Facilties Pending Approval
                } else {
                    setRejecting(false)
                    resp.json()
                    .then(resp => {
                        const formResponse = []
                        setFormError(() => {
                          if(typeof resp == 'object') {
                            const respEntry = Object.entries(resp)
            
                            for (let [_, v] of respEntry) {
                              formResponse.push(v)
                            }
            
                            return `Error: ${formResponse.join(" ")}`
                          }
                        })
                    })
                }


            })
            .catch(e => {
                console.error(e.message)
            })
    



}

function approveRejectFacilityUpdates (reject, alert, update_id, token, setSubmitting, setRejecting, setFormError) {

 
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${update_id}/`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`

            },
            method: 'PATCH',
            body: JSON.stringify({
                approved: reject
            })
        })
            .then(resp => {
                if (resp.status == 200 || resp.status == 204) {

                    if (reject) {
                        setSubmitting(false)
                        alert.success("Facility updates approved successfully")
                    } else {
                        alert.success("Facility updates rejected successfully")
                    }

                    router.push('/facilities?qf=updated_pending_validation&has_edits=true&pending_approval=true') // redirect to New Facilties Pending Validation
                } else {
                    setRejecting(false)

                    resp.json()
                    .then(resp => {
                        const formResponse = []
                        setFormError(() => {
                          if(typeof resp == 'object') {
                            const respEntry = Object.entries(resp)
            
                            for (let [_, v] of respEntry) {
                              formResponse.push(v)
                            }
            
                            return `Error: ${formResponse.join(" ")}`
                          }
                        })
                    })
                }

            })
            .catch(e => {
                setSubmitting(false)
                console.error(e.message)
            })
 
}

export {
    approveRejectFacilityUpdates,
    validateRejectFacility,
    approveRejectFacility,
}