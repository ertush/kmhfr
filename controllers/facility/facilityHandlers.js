
import router from "next/router";

// handleBasicDetailsSubmit
const handleBasicDetailsSubmit = async (token, values, formId, setFormId, fileRef, alert, setGeoJSON, setWardName, setGeoCenter, setFacilityId) => {

    const _payload = {};

    let _ward ;

    for (const [k, v] of Object.entries(values)) {
        
        if(v !== "") {
        _payload [k] = (() => {
            // Accomodates format of facility checklist document
            if (k === "facility_checklist_document") {
                return {fileName: v.split('\\').reverse()[0]}
            }

            if (typeof v === 'string'){
            if(v.match(/^true$/) !== null) {
                return Boolean(v)
            }

            if(v.match(/^false$/) !== null) {
                return Boolean(v)
            }

            // check if value is alphanumeral and convert to number
            return v.match(/^[0-9]$/) !== null ? Number(v) : v
            }
            else{
            return v

            }



        })()
      }
      
    }

    // Add officer in charge to payload
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


    // Post Facility Basic Details
    if(token){
        try{
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/`, {
                headers:{
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'
                    
                },
                method: 'POST',
                body: JSON.stringify(_payload)
            })

            // Post Checklist document
            .then(async resp => {

                const {id, ward} = (await resp.json());

                _ward = ward;

                setFacilityId(`${id}`);

                // Store facility Id to localstorage

                const formData = new FormData()

                if(fileRef !== null){

                    formData.append('name', `${_payload['official_name']} Facility Checklist File`)
                    formData.append('description', 'Facilities checklist file')
                    formData.append('document_type', 'Facility_ChecKList')
                    formData.append('facility_name', _payload['official_name'])
                    formData.append('fyl', fileRef.files[0] ?? undefined)
        
                }
                
                if(resp.status == 201 && formData.get('fyl')){

                    alert.success('Basic details saved successful');

                    try {
                        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/`, {

                            headers:{
                                'Authorization': 'Bearer ' + token,
                                'Accept': 'application/json, text/plain, */*',
                            },
                            method:'POST',
                            body: formData
                        })

                        return resp
                    }
                    catch(e){
                        console.error('Unable to Post document')
                    }
                }
                else {
                    alert.error('Unable to save basic details successfully!')
                }
            })
            //  fetch data for Geolocation form
            .then(async (resp) => {
                if(resp){
        
                                                                    
                        try{
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/wards/${_ward}/`,
                            {
                                headers:{
                                    'Authorization': 'Bearer ' + token,
                                    'Accept': 'application/json, text/plain, */*',
                                },
                            }
                            )

                            const _data = await response.json();
                            const ward_boundary = _data?.ward_boundary;
                            setGeoJSON(ward_boundary)
                            const [lng, lat] = ward_boundary.properties.center.coordinates 
                            setGeoCenter([lat, lng])
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
    }
    else{
        alert.error('Access Token not supplied !')
    }

    
 setFormId(`${parseInt(formId) + 1}`);
    
};

// handleGeolocationSubmit
const handleGeolocationSubmit = (token, values, stateSetters) => {

    const [formId, setFormId, facilityId] = stateSetters
   
    const geolocationData = {};


    // formData.forEach(({ name, value }) => {
        for (const [key, value] of Object.entries(values)){
        geolocationData[key] = (() => {
            switch (key) {
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
    }



    geolocationData['facility'] = facilityId ?? ''

    // Convert the latitude/longitude from string to number

    geolocationData['latitude'] = Number(geolocationData.latitude)
    geolocationData['longitude'] = Number(geolocationData.longitude)


    geolocationData['coordinates'] = {
        coordinates : [														
            geolocationData.longitude,
            geolocationData.latitude
        ],
        type: 'Point'
    }

    
    // Post Geolocation Details

    // console.log({geo_payload: JSON.stringify(geolocationData).replace(',"":""','')})


    try{
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/facility_coordinates/`, {
            headers:{
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            
            },
            method: 'POST',
            body: JSON.stringify(geolocationData).replace(',"":""','')
        })
    }
    catch(e){
        console.error('Unable to post geolocation details')
    }

    setFormId(`${parseInt(formId) + 1}`);
};

// handleFacilityContactsSubmit
const handleFacilityContactsSubmit = (token, values, stateSetters) => {

    
    const [formId, setFormId, facilityId] = stateSetters;

    // console.log({values})

    const facilityContacts = []
    const contactEntries = Object.entries(values).filter(arr => ((/^contact_[0-9]{1}/.test(arr[0])) || (/^contact_type_[0-9]{1}/.test(arr[0]))));
    const contact_temp = contactEntries.filter(contact => /^contact_\d/.test(contact[0])).map(() => ({}))

    contactEntries.forEach((contact, i) => {
        
        if(/^contact_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if(/^contact_type_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if(Object.keys(contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) facilityContacts.push(contact_temp[parseInt(contact[0].split('_').reverse()[0])]);
        
    })


    const officerContacts = []
    const officerContactEntries = Object.entries(values).filter(arr => ((/^officer_details_contact_[0-9]{1}/.test(arr[0])) || (/^officer_details_contact_type_[0-9]{1}/.test(arr[0]))));
    const officer_contact_temp = officerContactEntries.filter(contact => /^officer_details_contact_\d/.test(contact[0])).map(() => ({}))

    officerContactEntries.forEach((contact, i) => {
        
        if(/^officer_details_contact_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if(/^officer_details_contact_type_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if(Object.keys(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) officerContacts.push(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]);
        
    })


    const officerDetails = {contacts: officerContacts}

    officerDetails['name'] = values.officer_name;   
    officerDetails['reg_no'] = values.officer_reg_no;
    officerDetails['title'] = values.officer_title;


    
    const payload = {contacts: facilityContacts, officer_in_charge:officerDetails};


//    console.log({payload})
    
   
    try{     

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

            headers:{
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })
    }
    catch(e){
        console.error('Unable to patch facility contacts details', e.message)
    }

    setFormId(`${parseInt(formId) + 1}`);
};

// handleRegulationSubmit
const handleRegulationSubmit = async  (token, values, stateSetters, licenseFileRef, alert) => {

    let facility_name = ''

    if(window){
        facility_name = JSON.parse(JSON.parse(window.localStorage.getItem('basic_details_form')))?.official_name
    }

    const [formId, setFormId, facilityId] = stateSetters


    const {license_number, registration_number, regulation_status, regulatory_body} = values
   
    const facilityDeptEntries = Object.entries(values)
    const facilityDetpUnits = []
    const deptUnitsEntries = facilityDeptEntries.filter(field =>  /^facility_.+$/.test(field[0]))
    const dept_units_temp = deptUnitsEntries.filter(unit => /^facility_unit_\d/.test(unit[0])).map(() => ({}))

    deptUnitsEntries.forEach((unit, i) => {
        
        if(/^facility_unit_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['unit'] = unit[1];
        if(/^facility_regulating_body_name_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['regulating_body_name'] = unit[1];
        if(/^facility_license_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['license_number'] = unit[1];
        if(/^facility_registration_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['registration_number'] = unit[1];

        if(Object.keys(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]).length == 4) facilityDetpUnits.push(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]);
        
    })

    const payload = [
        {
            license_number ,
            registration_number,
            regulation_status,
            regulatory_body, 
        },

        {
            units:facilityDetpUnits
        }
    ]


    // console.log({payload, facility_name}) // debug


    payload.forEach(async (data) => {
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

                headers:{
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'
                    
                },
                method: 'PATCH',
                body: JSON.stringify(data)
            })

            if(resp.ok) {
                alert.success('Facilty Regulation details saved successfully')
            } else {
                alert.error('unable to save Regulation details ')
            }
        }   catch (e) {
            console.error('Unable to patch facility contacts details', e.message)
        }
    })

    
     // Post the license document
            
     if (licenseFileRef.files[0]) {
        alert.success('Facility regulation details saved successfully')

        const formData = new FormData()

        if(licenseFileRef !== null) {
            formData.append('name', `${facility_name} Facility license File`)
            formData.append('description', 'Facilities license file')
            formData.append('document_type', 'FACILITY_LICENSE')
            formData.append('facility_name', facility_name)
            formData.append('fyl', licenseFileRef.files[0] ?? undefined)
        }


        try {

            const resp = await fetch(`${API_URL}/common/documents/`, {

                headers: {
                    'Authorization': 'Bearer '+ token,
                    'Accept': 'application/json, text/plain, */*',
                },
                method: 'POST',
                body: formData
            })

            if(resp.ok){
            alert.success('License Document saved successfully')

            }

            return resp
        }
        catch (e) {
            console.error('Unable to Post License Document')
        }
    } else {
        alert.error('Unable to save facility regulation ')

    }

               
            

    setFormId(`${parseInt(formId) + 1}`);


};


// handleServiceSubmit
const handleServiceSubmit = async (token, stateSetters, facilityId) => {

    const [services, formId, setFormId] = stateSetters
    const _payload = JSON.parse(services).map(({ id }) => ({ service: id }))

   
    try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

            headers:{
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'PATCH',
            body: JSON.stringify({services: _payload})
        })

    }
    catch (e) {
        console.error('Unable to submit facility services due to the following error: ', e.message)
    }

    setFormId(`${parseInt(formId) + 1}`);
    
    // setServices([])
}

// handleInfrastructureSubmit
const handleInfrastructureSubmit = (token, stateSetters, facilityId) => {

    const [formData, vals, formId, setFormId] = stateSetters


    const _payload = JSON.parse(formData).map(({name, id}) => {
        if(
            name.includes("Main Grid") ||
            name.includes("Gas") ||
            name.includes("Bio-Gas") ||
            // WATER SOURCE
            name.includes("Roof Harvested Water") ||
            name.includes("River / Dam / Lake") ||
            name.includes("Donkey Cart / Vendor") ||
            name.includes("Piped Water") ||
            // MEDICAL WASTE MANAGEMENT
            name.includes("Sewer systems") ||
            name.includes("Dump without burning") ||
            name.includes("Open burning") ||
            name.includes("Remove offsite") ||
            // ACCESS ROADS
            name.includes("Tarmac") ||
            name.includes("Earthen Road") ||
            name.includes("Graded ( Murrum )") ||
            name.includes("Gravel")
        ){
            return {infrastructure:id}

        } else {
            return {infrastructure:id, count: vals[id]}

        }
    })


    if (_payload) {

        try {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

                headers:{
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'
                    
                },
                method: 'PATCH',
                body: JSON.stringify({infrastructure: _payload})
            })

        }
        catch (e) {
            console.error('Unable to patch facility contacts details', e.message)
        }

        setFormId(`${parseInt(formId) + 1}`)
       
    }

}


// handleHrSubmit
const handleHrSubmit = (token, stateSetters, facilityId, alert) => {

    const [savedVals, formVals] = stateSetters // removed setFormId

    const _payload = JSON.parse(savedVals).map(({id}) => 
        ({speciality:id, count: formVals[id]})
    )

    // console.log({_payload})


    try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

            headers:{
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'PATCH',
            body: JSON.stringify({specialities: _payload})
        })
        .then(res => {

            if (res.ok && alert) {
                alert.success("Facility Created successfully")
        
                // Update local storage if successful
        
            } else {
                alert.error("Unable to create facility")
                
            }
           
            if(res.ok && facilityId) {
                localStorage.clear()
                router.push(`/facilities/${facilityId}`)
            }

           
        })

    }
    catch (e) {
        console.error('Unable to submit facility human ReportsSideMenu  details', e.message)
    }

     // reset form
    

}


// handleBasicDetailsUpdate
const handleBasicDetailsUpdates = async (token, formData, facility_id, updatedSavedChanges) => {

    updatedSavedChanges(false);

    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facility_id}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PATCH',
            body: JSON.stringify(formData)
        })

     
        if(resp.ok){
            localStorage.clear()
        }
        


        return resp

        

    }
    catch (e) {
        console.error('Error msg:', e.message)
    }
}

// handleGeolocationDataUpdate
const handleGeolocationUpdates = async (token, formData, coordinates_id) => {


    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/facility_coordinates/${coordinates_id}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PATCH',
            body: JSON.stringify(formData)
        })


        return resp
        // console.log({formData, coordinates_id})
    }
    catch (e) {
        console.error('Error msg:', e.message)
    }

  
}

// handleFacilityContactUpdates
const handleFacilityContactsUpdates = async (token, values, facility_id) => {

    const facilityContacts = [];
    const contactEntries = Object.entries(values).filter(arr => ((/^contact_[0-9]{1}/.test(arr[0])) || (/^contact_type_[0-9]{1}/.test(arr[0]))));
    const contact_temp = contactEntries.filter(contact => /^contact_\d/.test(contact[0])).map(() => ({}));

    contactEntries.forEach((contact, i) => {
        
        if(/^contact_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if(/^contact_type_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if(Object.keys(contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) facilityContacts.push(contact_temp[parseInt(contact[0].split('_').reverse()[0])]);
        
    })


    const officerContacts = []
    const officerContactEntries = Object.entries(values).filter(arr => ((/^officer_details_contact_[0-9]{1}/.test(arr[0])) || (/^officer_details_contact_type_[0-9]{1}/.test(arr[0]))));
    const officer_contact_temp = officerContactEntries.filter(contact => /^officer_details_contact_\d/.test(contact[0])).map(() => ({}))

    officerContactEntries.forEach((contact, i) => {
        
        if(/^officer_details_contact_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if(/^officer_details_contact_type_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if(Object.keys(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) officerContacts.push(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]);
        
    })


    const officerDetails = {contacts: officerContacts}

    officerDetails['name'] = values.officer_name;   
    officerDetails['reg_no'] = values.officer_reg_no;
    officerDetails['title'] = values.officer_title;


    
    const payload = {contacts: facilityContacts, officer_in_charge:officerDetails};

 
    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facility_id}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json;charset=utf-8;*/*'
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })

        if(resp.ok){
            localStorage.clear()
        }


        return resp

    }
    catch (e) {
        console.error('Error msg:', e.message)
    }
}

// handleRegulationUpdate
const handleRegulationUpdates = async (token, values, facilityId, licenseFileRef) => {

    let facility_name = ''

    if(window){
        facility_name = JSON.parse(JSON.parse(window.localStorage.getItem('basic_details_form')))?.official_name
    }


    const {license_number, registration_number, regulation_status, regulatory_body} = values
   
    const facilityDeptEntries = Object.entries(values)
    const facilityDetpUnits = []
    const deptUnitsEntries = facilityDeptEntries.filter(field =>  /^facility_.+$/.test(field[0]))
    const dept_units_temp = deptUnitsEntries.filter(unit => /^facility_unit_\d/.test(unit[0])).map(() => ({}))

    deptUnitsEntries.forEach((unit, i) => {
        
        if(/^facility_unit_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['unit'] = unit[1];
        if(/^facility_regulating_body_name_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['regulating_body_name'] = unit[1];
        if(/^facility_license_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['license_number'] = unit[1];
        if(/^facility_registration_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['registration_number'] = unit[1];

        if(Object.keys(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]).length == 4) facilityDetpUnits.push(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]);
        
    })

    const payload = [
        {
            license_number ,
            registration_number,
            regulation_status,
            regulatory_body, 
        },

        {
            units:facilityDetpUnits
        }
    ]

    // console.log({values, facilityId, payload})
  

    payload.forEach(data => {
        try {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json;charset=utf-8;*/*'
                        },
                        method: 'PATCH',
                        body: JSON.stringify(data)
                    })

                // Post the license document
                .then(async resp => {

                    

                    const formData = new FormData()

                    if(licenseFileRef){
                    if(licenseFileRef.files.length > 0) {
                        formData.append('name', `${facility_name} Facility license File`)
                        formData.append('description', 'Facilities license file')
                        formData.append('document_type', 'FACILITY_LICENSE')
                        formData.append('facility_name', facility_name)
                        formData.append('fyl', licenseFileRef.files[0] ?? undefined)
                    

                    if (resp) {

                        try {
                            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/`, {

                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'ContentType': 'multipart/form-data; boundary=---------------------------22584204591762068164170278481'
                                },
                                method: 'POST',
                                body: formData
                            })

                            if(resp.ok){
                                localStorage.clear()
                            }

                            return resp
                        }
                        catch (e) {
                            console.error('Unable to Post License Document')
                        }
                    }
                    }
                }
                })



        }
        catch (e) {
            console.error('Unable to patch facility contacts details', e.message)
        }
    })
}

// handleServiceUpdates
const handleServiceUpdates = async (token, stateSetters) => {


    const [services, facilityId] = stateSetters


    const _payload = JSON.parse(services).length > 0 ? JSON.parse(services).map(({ id }) => ({ service: id })) : { services: [{ service: null }] }


    try {

        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PATCH',
            body: JSON.stringify({ services: _payload })
        })

        if(resp.ok){
            localStorage.clear()
        }

        return resp

    }
    catch (e) {
        console.error('Unable to patch facility services details', e.message)
    }

}

// handleServiceDelete

const handleServiceDelete = async (token, event, facility_service_id) => {

    event.preventDefault();

    try {
        
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_services/${facility_service_id}/`, {
            headers: {
                'Authorization': 'Bearer ' + token, 
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'DELETE'

        })

        return resp

    }
    catch (e) {
        console.error('Unable to delete facility service', e.message)
    }

}

// handleInfrastructureUpdates
const handleInfrastructureUpdates = async (token, stateSetters, alert) => {


    const [values, savedItems, facilityId] = stateSetters
    const payload = {}

    const saved = JSON.parse(savedItems)
  
     payload['infrastructure'] = saved.map(({id, count}) => {
        if(count){
            return {infrastructure: id, count: values[id]}
        }
            return {infrastructure: id}
    })
    


    // console.log({payload})

    try {


        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })

        if (resp.ok) {
            localStorage.clear()
            alert.success('Facility Infrastructure updated successfully')
        } else {
            alert.error("Unable to update facility infrastructure")
        }


        return resp



    }
    catch (e) {
        console.error('Unable to patch facility Infrastructure details', e.message)
    }
}

// handleInfrastructureDelete

const handleInfrastructureDelete = async (token, event, facility_infrastructure_id, alert) => {

    event.preventDefault()

    try {

        if (facility_infrastructure_id) {
            alert.success('Facility Infrastructure Deleted Successfully')
        } else {
            alert.error("Unable to delete facility infrastructure")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=delete_facility_infrastructure&id=${facility_infrastructure_id}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            }

        })

        if(resp.ok){
            localStorage.clear()
        }

        return resp

    }
    catch (e) {
        console.error('Unable to delete facility infrastructure', e.message)
    }

}

// handleHrUpdates
const handleHrUpdates = async (token, stateSetters, alert) => {

    const [values, savedItems, facilityId] = stateSetters
    const payload = {}

    const saved = JSON.parse(savedItems)
  
     payload['specialities'] = saved.map(({id, count}) => {
        if(count){
            return {speciality: id, count: values[id]}
        }
            return {speciality: id}
    })


    try {

     
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })

        if (resp.ok) {
            localStorage.clear()
            alert.success('Facility Human Resource successfully updated')
        } else {
            alert.error("Unable to update facility Human Resource")
        }


        return resp

    }
    catch (e) {
        console.error('Unable to patch facility Human ReportsSideMenu  details', e.message)
    }
}

// handleHrDelete
const handleHrDelete = async (event, facility_hr_id, alert) => {
    event.preventDefault()

    try {

       

        const resp = await fetch(`/api/common/submit_form_data/?path=delete_facility_hr&id=${facility_hr_id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            }

        })

        if (resp.ok) {
            alert.success('Facility Human resource Deleted Successfully')
        } else {
            alert.error("Unable to delete facility Human resource")
        }

        return resp

    }
    catch (e) {
        console.error('Unable to delete facility hr', e.message)
    }   
}

// handleFacilityUpgrades
const handleFacilityUpgrades = async (payload, alert) => {

  
    console.log({payload});
    
    try {

      

        const resp = await fetch(`/api/common/submit_form_data/?path=facility_upgrade`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })

        if (resp.ok) {
            localStorage.clear()
            alert.success('Facility Upgraded Successfully')
        } else {
            alert.error("Unable to upgrade facility")
        }

       
        return resp

    }
    catch (e) {
        console.error('Unable to upgrade facility: ', e.message)
    }
}

const handleRegulationSubmitUpdates = (values, facilityId, file, formRef) => {

    

    let facility_name = ''

    if(window){
        facility_name = JSON.parse(JSON.parse(window.localStorage.getItem('basic_details_form')))?.official_name
    }

    const formData = new FormData(formRef.current)
   
    const facilityDeptEntries = [...formData.entries()]

    const filteredDeptUnitEntries = facilityDeptEntries.filter(field =>  field[0].match(/^facility_.+$/) !== null)

    const filteredDeptOtherEntries = facilityDeptEntries.filter(field =>  !(field[0].match(/^facility_.+$/) !== null))

    const payload = ((unitEntries, otherEntries) => {
     

            // Facility Regulation form data
            const _payload = []
            const _otherEntObj = {}
            
            for (let e in otherEntries) _otherEntObj[otherEntries[e][0]] = otherEntries[e][1]

            delete _otherEntObj.license_document;

            _payload.push(_otherEntObj)

             // Facility Dept Regulation

             const _unitEntArrObjs = unitEntries.filter(ar => ar[0] === 'facility_unit').map(() => Object())

             let p = 0; 

             for( let i in unitEntries){ 
                 // clean up the key by removing prefix facility_
                _unitEntArrObjs[p][
                    unitEntries[i][0].replace('facility_', '')
                ] = unitEntries[i][1]; 

                if(unitEntries[i][0] == 'facility_registration_number') { 
                    p+=1 
                } 
            }

            _payload.push({
                units:_unitEntArrObjs
            })
            
            return _payload


    })(filteredDeptUnitEntries, filteredDeptOtherEntries)



    // console.log({payload})

    payload.forEach(data => {
        try {
            fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
                
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method: 'POST',
                body: JSON.stringify(data)
                
            })


                // Post the license document
                .then(async resp => {

                    const formData = new FormData()
                    formData.append('name', `${facility_name} Facility license File`)
                    formData.append('description', 'Facilities license file')
                    formData.append('document_type', 'FACILITY_LICENSE')
                    formData.append('facility_name', facility_name)
                    formData.append('fyl', file?.files[0] ?? undefined)


                    if (resp) {

                        try {
                            const resp = await fetch('/api/common/submit_form_data/?path=documents', {

                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                },
                                method: 'POST',
                                body: formData
                            })
                            console.log("Here is the response",{resp}) // debug

                            alert('Facility Regulation Details Updated Successfully')

                            if(resp.ok){
                                localStorage.clear()
                            }

                            return resp
                        }
                        catch (e) {
                            console.error('Unable to Post License Document')
                        }
                    }
                })

        }
        catch (e) {
            console.error('Unable to patch facility regulation updates', e.message)
        }
    })

};



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
    handleFacilityUpgrades,
    handleServiceDelete,
    handleHrDelete,
    handleInfrastructureDelete,
    handleRegulationSubmitUpdates

}