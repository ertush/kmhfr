
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

                if (resp.ok) {
                    setSubmitting(false)

                    if (!reject) {
                        alert.success("Facility validated successfully")
                    } else {
                        alert.success("Facility rejected successfully")
                    }



                    router.push({
                        pathname: '/facilities',
                        query: {
                            filter:'pending_validation_facilities',
                            pending_approval: true,
                            has_edits: false
                        }
                    }) // redirect to New   Facilties Pending Validation

                } else {
                    setSubmitting(false)
                    setRejecting(false)

                    resp.json()
                    .then(resp => {
                        const formResponse = []
                        setFormError(() => {
                          if(typeof resp == 'object') {
                            const respEntry = Object.entries(resp)
            
                            for (let [k, v] of respEntry) {
                              formResponse.push(`${k}:${v}`)
                            }
            
                            return `Error: ${formResponse.join("; ")}`
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

                if (resp.ok) {

                    setSubmitting(false)

                    if (reject) {
                        alert.success(`Facility Approved successfully`)
                    } else {
                        alert.success(`Facility Rejected successfully`)
                    }
                    
                    router.push({
                        pathname: '/facilities',
                        query: {
                            filter: 'pending_approval_facilities',
                            to_publish: false,
                            closed: false
                        }
                    }) 

                } else {
                    setSubmitting(false)
                    setRejecting(false)
                    resp.json()
                    .then(resp => {
                        setSubmitting(false)

                        const formResponse = []
                        setFormError(() => {
                          if(typeof resp == 'object') {
                            const respEntry = Object.entries(resp)
            
                            for (let [k, v] of respEntry) {
                              formResponse.push(`${k}:${v}`)
                            }
            
                            return `Error: ${formResponse.join("; ")}`
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

    if(update_id){
 
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
                if (resp.ok) {

                    if (reject) {
                        setSubmitting(false)
                        alert.success("Facility updates approved successfully")
                    } else {
                        alert.success("Facility updates rejected successfully")
                    }

                    router.push({
                        pathname: '/facilities',
                        query: {
                            filter: 'updated_pending_validation_facilities',
                            have_updates: true,
                            closed: false
                        }
                    }) // redirect to Updated Facilties Pending Validation
                        
                } else {
                    setSubmitting(false)
                    setRejecting(false)

                    resp.json()
                    .then(resp => {
                        const formResponse = []
                        setFormError(() => {
                          if(typeof resp == 'object') {
                            const respEntry = Object.entries(resp)
            
                            for (let [k, v] of respEntry) {
                              formResponse.push(`${k}:${v}`)
                            }
            
                            return `Error: ${formResponse.join("; ")}`
                          }
                        })
                    })
                }

            })
            .catch(e => {
                setSubmitting(false)
                console.error(e.message)
            })
    } else {
        setSubmitting(false)
        setFormError('Facility latest_update id is missing.')
    }
 
}

export {
    approveRejectFacilityUpdates,
    validateRejectFacility,
    approveRejectFacility,
}