
import router from "next/router"

const validateRejectFacility = (facility_id, reject, comment, alert) => {

    
    let url = `/api/common/submit_form_data/?path=validate_facility`


    try {
        fetch(url, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'POST',
            body: JSON.stringify({
                comment: comment,
                facility: facility_id,
                is_cancelled: reject,
            })
        })
            .then(resp => resp)
            .then(res => {

                if (res) {
                    if (!reject) {
                        alert.success("Facility validated successfully")
                    } else {
                        alert.success("Facility rejected successfully")
                    }
                    router.push('/facilities?qf=new_pending_validation&pending_approval=true&has_edits=false&is_complete=true') // redirect to New Facilties Pending Validation
                }

            })
            .catch(e => {
                console.error(e.message)
            })
    } catch (e) {

        console.error(e.message)

    }

}

const approveRejectFacility = (facility_id, comment, alert, reject) => {


   


    let url = `/api/common/submit_form_data/?path=validate_facility`
    try {
        fetch(url, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'POST',
            body: JSON.stringify({
                approved_national_level: reject,
                comment,
                facility: facility_id,
                is_national_approval: reject,
            })
        })
            .then(resp => resp)
            .then(res => {

                if (res) {
                    if (reject) {
                        alert.success(`Facility Approved successfully`)
                    } else {
                        alert.success(`Facility Rejected successfully`)
                    }
                    router.push('/facilities?qf=approved&approved=true&approved_national_level=true&rejected=false') // redirect Facilties Pending Approval
                }


            })
            .catch(e => {
                console.error(e.message)
            })
    } catch (e) {

        console.error(e)
    }



}

const approveRejectFacilityUpdates = (reject, alert, update_id) => {

  

    let url = `/api/common/submit_form_data/?path=approve_reject_facility_updates&id=${update_id}`


    try {
        fetch(url, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'POST',
            body: JSON.stringify({
                approved: reject
            })
        })
            .then(resp => resp)
            .then(res => {

                if (res) {

                    if (reject) {
                        alert.success("Facility updates approved successfully")
                    } else {
                        alert.success("Facility updates rejected successfully")
                    }

                    router.push('/facilities?qf=updated_pending_validation&has_edits=true&pending_approval=true') // redirect to New Facilties Pending Validation
                }

            })
            .catch(e => {
                console.error(e.message)
            })
    } catch (e) {

        console.error(e.message)

    }

}

export {
    approveRejectFacilityUpdates,
    validateRejectFacility,
    approveRejectFacility,
}