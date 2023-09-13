
import router from "next/router";

// handleBasicDetailsSubmit
const handleBasicDetailsSubmit = async (values, method, formId, setFormId, fileRef, setGeoJSON, setWardName, setGeoCenter, setFacilityId) => {

  

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



    if(method === 'PATCH'){
        _payload['sub_county'] = values.sub_county_id
    }




    // console.log({_payload})

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
            
            if(resp){

                try {
                    const resp = await fetch('/api/common/submit_form_data/?path=documents', {

                        headers:{
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
        })
        //  fetch data for Geolocation form
        .then(async (resp) => {
            if(resp){
    
                                                                  
                    try{
                        const response = await fetch(`/api/facility/get_facility/?path=wards&id=${_ward}`)

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

    
 setFormId(`${parseInt(formId) + 1}`);
    
};

// handleGeolocationSubmit
const handleGeolocationSubmit = (values, stateSetters) => {

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

    console.log({geo_payload: JSON.stringify(geolocationData).replace(',"":""','')})


    try{
        fetch('/api/common/submit_form_data/?path=gis', {
            headers:{
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
const handleFacilityContactsSubmit = (values, stateSetters) => {

    
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

        fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {

            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })
    }
    catch(e){
        console.error('Unable to patch facility contacts details', e.message)
    }

    setFormId(`${parseInt(formId) + 1}`);
};

// handleRegulationSubmit
const handleRegulationSubmit = (values, stateSetters, licenseFileRef) => {

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

                    if(licenseFileRef !== null) {
                        formData.append('name', `${facility_name} Facility license File`)
                        formData.append('description', 'Facilities license file')
                        formData.append('document_type', 'FACILITY_LICENSE')
                        formData.append('facility_name', facility_name)
                        formData.append('fyl', licenseFileRef.files[0] ?? undefined)
                    }



                    if (resp) {

                        try {
                            const resp = await fetch('/api/common/submit_form_data/?path=documents', {

                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                },
                                method: 'POST',
                                body: formData
                            })

                            return resp
                        }
                        catch (e) {
                            console.error('Unable to Post License Document')
                        }
                    }
                })

        }
        catch (e) {
            console.error('Unable to patch facility contacts details', e.message)
        }
    })


    setFormId(`${parseInt(formId) + 1}`);


};


// handleServiceSubmit
const handleServiceSubmit = async (stateSetters, facilityId) => {

    const [services, formId, setFormId] = stateSetters
    const _payload = JSON.parse(services).map(({ id }) => ({ service: id }))

   
    try {
        fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'POST',
            body: JSON.stringify({ services: _payload })
        })

    }
    catch (e) {
        console.error('Unable to submit facility services due to the following error: ', e.message)
    }

    setFormId(`${parseInt(formId) + 1}`);
    
    // setServices([])

}

// handleInfrastructureSubmit
const handleInfrastructureSubmit = (stateSetters, facilityId) => {

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
            fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method: 'POST',
                body: JSON.stringify({ infrastructure: _payload })
            })

        }
        catch (e) {
            console.error('Unable to patch facility contacts details', e.message)
        }

        setFormId(`${parseInt(formId) + 1}`)
       


    }

}


// handleHrSubmit
const handleHrSubmit = (stateSetters, facilityId, alert) => {

    const [savedVals, formVals] = stateSetters // removed setFormId

    const _payload = JSON.parse(savedVals).map(({id}) => 
        ({speciality:id, count: formVals[id]})
    )

    console.log({_payload})


    try {
        fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'POST',
            body: JSON.stringify({ specialities: _payload })
        })
        .then(res => {
           
            if(res && facilityId) router.push(`/facilities/${facilityId}`)
        })

    }
    catch (e) {
        console.error('Unable to submit facility human ReportsSideMenu  details', e.message)
    }

     // reset form
     if (res.ok && alert) {
        alert.success("Facility Created successfully")

        // Update local storage if successful

    } else {
        alert.error("Unable to create facility")
        
    }

}


// handleBasicDetailsUpdate
const handleBasicDetailsUpdates = async (formData, facility_id, updatedSavedChanges, alert) => {

    updatedSavedChanges(false);

    try {
        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facility_id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        })



        return resp

    }
    catch (e) {
        console.error('Error msg:', e.message)
    }
}

// handleGeolocationDataUpdate
const handleGeolocationUpdates = async (formData, coordinates_id) => {


    try {
        const resp = await fetch(`/api/common/submit_form_data/?path=update_geolocation&id=${coordinates_id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        })

        return resp
        // console.log({formData, coordinates_id})
    }
    catch (e) {
        console.error('Error msg:', e.message)
    }

     if (formData) {
        alert.success("Facility Geolocation successfully updated")
    } else {
        alert.error("Unable to update facility geolocation data")
    }
}

// handleFacilityContactUpdates
const handleFacilityContactsUpdates = async (values, facility_id) => {

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

    // const user = JSON.parse(window.sessionStorage.getItem('user'))

    // payload['user'] = user;

    
    
    // const services_edit_payload = JSON.parse(JSON.parse(window.localStorage.getItem('services_edit_form')));

    // console.log({services_edit_payload})

    // payload['facility_service'] = services_edit_payload;
    // basic_details_payload['officer_in_charge'] = payload.officer_in_charge;

    // console.log({services_edit_payload});

    try {
        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facility_id}`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;*/*'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })


        return resp

    }
    catch (e) {
        console.error('Error msg:', e.message)
    }
}

// handleRegulationUpdate
const handleRegulationUpdates = async (values, facilityId, licenseFileRef) => {

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
    // if (formData) {
    //     alert.success(alert_message)
    // } else {
    //     alert.error("Unable to update facility regulation")
    // }

    // try {
    //     const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facility_id}`, {
    //         headers: {
    //             'Content-Type': 'application/json;charset=utf-8;*/*'
    //         },
    //         method: 'POST',
    //         body: JSON.stringify(payload)
    //     })



    //     return resp

    // }
    // catch (e) {
    //     console.error('Error msg:', e.message)
    // }
    payload.forEach(data => {
        try {
            fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
               
                method: 'POST',
                body: JSON.stringify(data)
            })

                // Post the license document
                .then(async resp => {

                    const formData = new FormData()

                    if(licenseFileRef.files.length > 0) {
                        formData.append('name', `${facility_name} Facility license File`)
                        formData.append('description', 'Facilities license file')
                        formData.append('document_type', 'FACILITY_LICENSE')
                        formData.append('facility_name', facility_name)
                        formData.append('fyl', licenseFileRef.files[0] ?? undefined)
                    

                    if (resp) {

                        try {
                            const resp = await fetch('/api/common/submit_form_data/?path=documents', {

                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                },
                                method: 'POST',
                                body: formData
                            })

                            return resp
                        }
                        catch (e) {
                            console.error('Unable to Post License Document')
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
const handleServiceUpdates = async (stateSetters, alert) => {


    const [services, facilityId] = stateSetters

    console.log({services})

    const _payload = services.length > 0 ? services.map(({ id }) => ({ service: id })) : { services: [{ service: null }] }

    try {

        // if (_payload) {
        //     alert.success('Successfully updated facility services')
        // } else {
        //     alert.error("Unable to update facility services")
        // }

        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify({ services: JSON.parse(_payload) })
        })

        return resp

    }
    catch (e) {
        console.error('Unable to patch facility services details', e.message)
    }

}

// handleServiceDelete

const handleServiceDelete = async (event, facility_service_id, alert) => {

    event.preventDefault();

    try {

        if (facility_service_id) {
            alert.success('Facility Service Deleted Successfully')
        } else {
            alert.error("Unable to delete facility service")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=delete_facility_service&id=${facility_service_id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            }

        })

        return resp

    }
    catch (e) {
        console.error('Unable to delete facility service', e.message)
    }

}

// handleInfrastructureUpdates
const handleInfrastructureUpdates = async (stateSetters, alert) => {


    const [infraUpdateData, facilityId] = stateSetters

    const payload = {
        infrastructure: Object.keys(infraUpdateData).map((id, i) => ({ infrastructure: id, count: Object.values(infraUpdateData)[i] }))
    }



    try {

        if (infraUpdateData && facilityId) {
            alert.success('Facility Infrastructure updated successfully')
        } else {
            alert.error("Unable to update facility infrastructure")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })

        return resp

    }
    catch (e) {
        console.error('Unable to patch facility Infrastructure details', e.message)
    }
}

// handleInfrastructureDelete

const handleInfrastructureDelete = async (event, facility_infrastructure_id, alert) => {

    event.preventDefault()

    try {

        if (facility_infrastructure_id) {
            alert.success('Facility Infrastructure Deleted Successfully')
        } else {
            alert.error("Unable to delete facility infrastructure")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=delete_facility_infrastructure&id=${facility_infrastructure_id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            }

        })

        return resp

    }
    catch (e) {
        console.error('Unable to delete facility infrastructure', e.message)
    }

}

// handleHrUpdates
const handleHrUpdates = async (stateSetters, alert) => {

    const [hrUpdateData, facilityId] = stateSetters

    const payload = {
        specialities: Object.keys(hrUpdateData).map((id, i) => ({ speciality: id, count: Object.values(hrUpdateData)[i] }))
    }

    


    try {

        if (hrUpdateData && facilityId) {
            alert.success('Facility Human Resource successfully updated')
        } else {
            alert.error("Unable to update facility Human Resource")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })

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

        if (facility_hr_id) {
            alert.success('Facility Human resource Deleted Successfully')
        } else {
            alert.error("Unable to delete facility Human resource")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=delete_facility_hr&id=${facility_hr_id}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            }

        })

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

        if (Object.values(payload).indexOf(null) === -1) {
            alert.success('Facility Upgraded Successfully')
        } else {
            alert.error("Unable to upgrade facility")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=facility_upgrade`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })

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



    console.log({payload})

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


const handleInfra = () => {
    console.log("handle infra...")
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
    handleFacilityUpgrades,
    handleServiceDelete,
    handleHrDelete,
    handleInfrastructureDelete,
    handleRegulationSubmitUpdates,
    handleInfra

}