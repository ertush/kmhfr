import router from "next/router";



const updateChulRequest = async (payload,facilityId,token)=>{
    console.log("gfjkkll")
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${facilityId}/`, {

        headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8'
            
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}


export const handleChulSubmit = async (token, stateSetters, facilityId) => {

    console.log(stateSetters)
    const [formData,formSection] = stateSetters
   
   
   
    try {
        if (formSection === 'basicDetails'){

            console.log(".......")             
            console.log(typeof(formData))
          
            console.log(formData)
            updateChulRequest(formData,facilityId,token)
            console.log("rtyyiio")
        }
        else if (formSection === 'chps'){

            const _payload = JSON.parse(formData).map(({ id }) => ({ service: id }))
            updateChulRequest(formData,facilityId,token)
        }
        else if (formSection == 'chulServices'){

        const _payload = JSON.parse(formData).map(({ id }) => ({ service: id }))
        updateChulRequest({service:_payload},facilityId,token)

        }
    }
    catch (e) {
        console.error('Unable to submit facility services due to the following error: ', e.message)
    }

    
    // setServices([])
}



// {"households_monitored":1000,"number_of_chvs":5,"basic":{"households_monitored":1000,"number_of_chvs":5}}

// "health_unit_workers":[{"id":"b80f5f56-2111-4e00-ad99-da5ff10216c7","name":"Collins OLUOCH","created":"2023-12-08T07:46:58.485155Z","updated":"2023-12-08T07:46:58.485164Z","deleted":false,"active":true,"search":null,"first_name":"Justus","last_name":"OTieno","is_incharge":true,"created_by":4160,"updated_by":4160}]}

// {"services":[{"service":"a35e7734-b53f-4198-8737-e7d0f0e3c8d1","health_unit":"7cea0444-da05-4d24-afbd-456157a85b53"}]}