
// handleBasicDetailsSubmit
const handleBasicDetailsSubmit = async (event, stateSetters, method) => {

    const [setFacilityId, setGeoJSON, setCenter, setWardName, setFormId, setFacilityCoordinates, basicDetailsRef] = stateSetters

    event.preventDefault();

    let _id, _ward

    const formData = new FormData(basicDetailsRef.current)

    const _payload = {};


    formData.forEach((v, k) => {
        
        _payload [k] = (() => {
            // Accomodates format of facility checklist document
            if (k === "facility_checklist_document") {
                return {fileName: v.name}
            }

            if(v.match(/^true$/) !== null) {
                return Boolean(v)
            }

            if(v.match(/^false$/) !== null) {
                return Boolean(false)
            }

            // check if value is alphanumeral and convert to number
            return v.match(/^[0-9]$/) !== null ? Number(v) : v
        })()
    })

    // Add officer in charge to payload8
    _payload['officer_in_charge'] = {
        name:'',
        reg_no:'',
        contacts:[
            {
                type:'',
                contact:''
            }
        ]
    }



    if(method === 'PATCH'){
        _payload['sub_county'] = formData.get('sub_county_id');
    }



    


    // Post Facility Basic Details
    try{
        fetch('/api/common/submit_form_data/?path=facilities', {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method,
            body: JSON.stringify(_payload)
        })
        // Post Checklist document
        .then(async resp => {

            const {id, ward} = (await resp.json())

            _id = id
            _ward = ward

            const payload = {
                name: `${_payload['official_name']} Facility Checklist File`,
                description: 'Facilities checklist file',
                document_type: 'Facility_ChecKList',
                facility_name:_payload['official_name'],
                fyl: {
                    filename:_payload['facility_checklist_document']
                }


            }

            if(resp){

                
                try {
                    const resp = await fetch('/api/common/submit_form_data/?path=documents', {
                        headers:{
                            'Accept': 'application/json, text/plain, */*',
                            
                        },
                        method:'POST',
                        body: JSON.stringify(payload)
                    })

                    return (await resp.json())
                }
                catch(e){
                    console.error('Unable to Post document')
                }
            }
        })
        //  fetch data for Geolocation form
        .then(async (resp) => {
            if(resp){

                                                                            
                    setFacilityId(_id) //set facility Id
                    
                    let _data
                                                                    
                    try{
                        const response = await fetch(`/api/facility/get_facility/?path=wards&id=${_ward}`)

                        _data = await response.json()

                        setFacilityCoordinates(_data.ward_boundary.geometry.coordinates)
                        setGeoJSON(JSON.parse(JSON.stringify(_data?.ward_boundary)))

                        const [lng, lat] = _data?.ward_boundary.properties.center.coordinates 

                        setCenter(JSON.parse(JSON.stringify([lat, lng])))
                        setWardName(_data?.name)

                    
                    }catch(e){
                        console.error(e.message)
                        return {
                            error:e.message,
                            id:null
                        }
                    }
                
            }
        }
            
        )


    }catch(e){
        console.error(e.message)
        return {
            error:e.message,
            id:null
        }
    }

    

    // Change form Id
    window.sessionStorage.setItem('formId', 1); 

    setFormId(window.sessionStorage.getItem('formId'));
};

// handleGeolocationSubmit
const handleGeolocationSubmit = (event, stateSetters, method) => {

    const [setFormId, facilityId] = stateSetters
    
    event.preventDefault();

    const geolocationData = {};

    const elements = [...event.target];

    elements.forEach(({ name, value }) => {
        
        geolocationData[name] = (() => {
            switch (name) {
                case 'collection_date':
                    return  new Date(value)
                case 'latitude':
                    return  value.match(/^\-$/) !== null ? 0.000000 : value
                case 'longitude':
                    return  value.match(/^\-$/) !== null ? 0.000000 : value
                default:

                    return value
            }
        })() 
    });

    

    geolocationData['facility'] = facilityId ?? ''

    // Convert the latitude/longitude from string to number

    geolocationData['latitude'] = Number(geolocationData.latitude)
    geolocationData['longitude'] = Number(geolocationData.longitude)

    // Set missing geolocationData i.e coordinates & facility

    geolocationData['coordinates'] = {
        coordinates : [														
            geolocationData.longitude,
            geolocationData.latitude
        ],
        type: 'Point'
    }

    
    // Post Geolocation Details

    try{
        fetch('/api/common/submit_form_data/?path=gis', {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method,
            body: JSON.stringify(geolocationData).replace(',"":""','')
        })
    }
    catch(e){
        console.error('Unable to post geolocation details')
    }

    window.sessionStorage.setItem('formId', 2);

    setFormId(window.sessionStorage.getItem('formId'));
};

// handleFacilityContactsSubmit
const handleFacilityContactsSubmit = (event, stateSetters, method) => {

    const [setFormId, facilityId] = stateSetters
    event.preventDefault();

    const contactFormData = {};

    const elements = [...event.target];

    elements.forEach(({ name, value }) => {
        
        contactFormData[name] = value 
    });


    const payload  = {
        contacts: [
            {
                contact: contactFormData['contact'],
                contact_type: contactFormData['contact_type']
            }
        ],
        officer_in_charge: {
            name: contactFormData['name'],
            reg_no: contactFormData['reg_no'],
            title: contactFormData['title']

        }
    }


    try{

        fetch(`/api/common/submit_form_data/?path=facility_data&id=${facilityId}`, {

            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method,
            body: JSON.stringify(payload).replace(',"":""','')
        })
    }
    catch(e){
        console.error('Unable to patch facility contacts details', e.message)
    }

    window.sessionStorage.setItem('formId', 3);

    const dropDowns = document.getElementsByName(
        'dropdown_contact_types'
    );
    const inputs = document.getElementsByName(
        'contact_details_others'
    );

    

    if (dropDowns.length > 0) {
        dropDowns.forEach((dropDown) => {
            dropDown.remove();
        });
    }

    if (inputs.length > 0) {
        inputs.forEach((input) => {
            input.remove();
        });
    }

    setFormId(window.sessionStorage.getItem('formId'));
};

// handleRegulationSubmit
const handleRegulationSubmit = (event, stateSetters, method) => {

    const [setFormId, facilityId] = stateSetters


    event.preventDefault();
    

    // Post Facility Regulation Data

    const facilityRegDataA = {};
    const facilityRegDataB = {};


    const elements = [...event.target];

    const payload = []

   
    elements.forEach(({ name, value }) => {
        switch(name){
            case 'license_number':
                facilityRegDataA[name] = value
                break;
            case 'registration_number':
                facilityRegDataA[name] = value
                break;
            case 'regulation_status':
                facilityRegDataA[name] = value
                break;
            case 'regulatory_body':
                facilityRegDataA[name] = value
                break;
            case 'facility_dept_name':
                facilityRegDataB['0'] = {
                    unit: value,
                }
                break;
            case 'facility_regulatory_body':
                facilityRegDataB['1'] = {
                    regulation_body_name: value,
                }
                break;
            case 'facility_registration_number':
            facilityRegDataB['2'] = {
                registration_number: value,
            }
            break;
            case 'facility_license_number':
            facilityRegDataB['3'] = {
                license_number: value,
            }
            break;	


        }
        
    });



    payload.push(facilityRegDataA)
    payload.push({units:[{
        unit: facilityRegDataB['0'].unit, 
        regulation_body_name:facilityRegDataB['1'].regulation_body_name,
        registration_number:facilityRegDataB['2'].registration_number,
        license_number:facilityRegDataB['3'].license_number
    }]})
    

    payload.forEach(data => {
        try{
            fetch(`/api/common/submit_form_data/?path=facility_data&id=${facilityId}`, {
                headers:{
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'
                    
                },
                method,
                body: JSON.stringify(data)
            })

        }
        catch(e){
            console.error('Unable to patch facility contacts details', e.message)
        }
    })

    


    window.sessionStorage.setItem('formId', 4);

    setFormId(window.sessionStorage.getItem('formId'));
};

// handleServiceSubmit
const handleServiceSubmit = async (event, stateSetters, method) => {
    event.preventDefault()

    const [services,facilityId, setFormId, setServices]  = stateSetters
    const _payload = services.map(({value}) => ({service: value}))

    try{
        fetch(`/api/common/submit_form_data/?path=services&id=${facilityId}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method,
            body: JSON.stringify({services:_payload})
        })

    }
    catch(e){
        console.error('Unable to patch facility contacts details', e.message)
    }

    window.sessionStorage.setItem('formId', 5)
    
    setFormId(window.sessionStorage.getItem('formId'))
    setServices([])

}

// handleInfrastructureSubmit
const handleInfrastructureSubmit = (event, stateSetters, method) => {
    event.preventDefault()

    const [infrastructure, infrastructureCount, setFormId, facilityId] = stateSetters

    const _payload = infrastructure.map(({value}, i) => ({count: i < infrastructureCount.length ? Number(infrastructureCount[i]['val'] ?? 0) : 0 , infrastructure: value}))

    try{
        fetch(`/api/common/submit_form_data/?path=infrastructure&id=${facilityId}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method,
            body: JSON.stringify({infrastructure:_payload})
        })

    }
    catch(e){
        console.error('Unable to patch facility contacts details', e.message)
    }

    window.sessionStorage.setItem('formId', 6)
    
    
    setFormId(window.sessionStorage.getItem('formId'))

}


// handleHrSubmit
const handleHrSubmit = (event, stateSetters, method) => {

    const [hr, hrCount, facilityId, setFormId, alert] = stateSetters
    event.preventDefault()

    const _payload = hr.map(({value}, i) => ({count: i < hrCount.length ? Number(hrCount[i]['val'] ?? 0) : 0 , speciality: value}))

    if(_payload){
        alert.success("Facility Created successfully")
    }else {
        alert.danger("Unable to create facility")
    }
    

    try{
        fetch(`/api/common/submit_form_data/?path=hr&id=${facilityId}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method,
            body: JSON.stringify({specialities:_payload})
        })

    }
    catch(e){
        console.error('Unable to patch facility contacts details', e.message)
    }


    window.sessionStorage.setItem('formId', 0)
    
    setFormId(window.sessionStorage.getItem('formId'))

}


// handleBasicDetailsUpdate
const handleBasicDetailsUpdates = async (formData, facility_id, alert) => {

    if(formData){
        alert.success("Facility Geolocation successfully updated")
    } else {
        alert.danger("Unable to update facility geolocation data")
    }

    try{
       const resp =  await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facility_id}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method:'POST',
            body: JSON.stringify(formData)
        })

   

    return resp

    }
    catch(e){
        console.error('Error msg:', e.message)
    }
}

// handleGeolocationDataUpdate
const handleGeolocationUpdates = async (formData, coordinates_id, alert) => {
   
    if(formData){
        alert.success("Facility Geolocation successfully updated")
    } else {
        alert.danger("Unable to update facility geolocation data")
    }


    try{
       const resp =  await fetch(`/api/common/submit_form_data/?path=geolocation_update&id=${coordinates_id}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method:'POST',
            body: JSON.stringify(formData)
        })

     

    return resp

    }
    catch(e){
        console.error('Error msg:', e.message)
    }
}

// handleFacilityContactUpdates
const handleFacilityContactsUpdates = async (formData, facility_id, alert) => {
    if(formData){
        alert.success("Facility Contacts successfully updated")
    } else {
        alert.danger("Unable to update facility contacts data")
    }
 
    try{
       const resp =  await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facility_id}`, {
            headers:{
                'Content-Type': 'application/json;charset=utf-8;*/*'
            },
            method:'POST',
            body: JSON.stringify(formData)
        })

    

    return resp

    }
    catch(e){
        console.error('Error msg:', e.message)
    }
}

// handleRegulationUpdate
const handleRegulationUpdates = async () => {

}

// handleServiceUpdates
const handleServiceUpdates = async () => {

}

// handleInfrastructureUpdates
const handleInfrastructureUpdates = async () => {

}


// handleHrUpdates
const handleHrUpdates = async () => {

}


export {
    handleBasicDetailsSubmit,
    handleGeolocationSubmit,
    handleFacilityContactsSubmit,
    handleRegulationSubmit,
    handleServiceSubmit,
    handleInfrastructureSubmit,
    handleHrSubmit,
    handleBasicDetailsUpdates,
    handleGeolocationUpdates,
    handleFacilityContactsUpdates,
    handleRegulationUpdates,
    handleServiceUpdates,
    handleInfrastructureUpdates,
    handleHrUpdates,
}