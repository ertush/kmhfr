
import router from "next/router";

// handleBasicDetailsSubmit
const handleBasicDetailsSubmit = async (event, stateSetters, method, file) => {

    const [setFacilityId, setGeoJSON, setCenter, setWardName, setFormId, setFacilityCoordinates, basicDetailsRef] = stateSetters

    event.preventDefault();

    let _id, _ward

    const _formData = new FormData(basicDetailsRef.current)

    const _payload = {};


    _formData.forEach((v, k) => {
        
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
        _payload['sub_county'] = _formData.get('sub_county_id');
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

            const formData = new FormData()
            formData.append('name', `${_payload['official_name']} Facility Checklist File`)
            formData.append('description', 'Facilities checklist file')
            formData.append('document_type', 'Facility_ChecKList')
            formData.append('facility_name', _payload['official_name'])
            formData.append('fyl', file ?? undefined)
            
    
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
const handleGeolocationSubmit = (formData, stateSetters) => {

    const [setFormId, setLongitude, setLatitude, facilityId] = stateSetters
   

    const geolocationData = {};


    formData.forEach(({ name, value }) => {
        
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

    setLongitude(geolocationData.longitude);
    setLatitude(geolocationData.latitude);


    // Set missing geolocationData i.e coordinates & facility

    geolocationData['coordinates'] = {
        coordinates : [														
            geolocationData.longitude,
            geolocationData.latitude
        ],
        type: 'Point'
    }

    
    // Post Geolocation Details

    // console.log({formData, setFormId, stateSetters, geolocationData})

    // return

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

    window.sessionStorage.setItem('formId', 2);

    setFormId(window.sessionStorage.getItem('formId'));
};

// handleFacilityContactsSubmit
const handleFacilityContactsSubmit = (event, stateSetters) => {

    event.preventDefault();
    
    const [setFormId, facilityId, facilityContactsFormRef] = stateSetters
    
    const contactFormData = {};

    const formData = new FormData(facilityContactsFormRef.current)

    const contactEntries = [...formData.entries()]

    for (let i in contactEntries) contactFormData[contactEntries[i][0]] = contactEntries[i][1];

    const facilityContacts = contactEntries.filter(field =>  !(field[0].match(/^officer_.+$/) !== null))

    const facilityOfficerContacts = contactEntries.filter(field =>  field[0].match(/^officer_.+$/) !== null)

    const payload = ((fContacts, oContacts) => {
        

        // Facility Regulation form data
        const _payload = {}
    
        const fContactArrObjs = fContacts.filter(ar => ar[0] === 'contact').map(() => Object())

        const oContactArrObjs = oContacts.filter(ar => ar[0] === 'officer_details_contact').map(() => Object())
        
        let p = 0; 

        for( let i in fContacts){ 
            fContactArrObjs[p][
                fContacts[i][0]
            ] = fContacts[i][1]; 

            if(fContacts[i][0] == 'contact') { 
                p+=1 
            } 
        }

        
        _payload['contacts'] = fContactArrObjs
        

        const officerIncharge = {}

        let x = 0;

        for(let i in oContacts){
            
            if(oContacts[i][0].match(/.*_details_.*/) !== null){
                oContactArrObjs[x][
                    oContacts[i][0].replace('officer_details_', '')
                ] = oContacts[i][1];  
            } else{
                officerIncharge[oContacts[i][0].replace('officer_', '')] = oContacts[i][1]; 
            }

        if(oContacts[i][0] == 'officer_details_contact') { 
            x+=1 
        } 
    }



    officerIncharge['contacts'] = oContactArrObjs;

    _payload['officer_in_charge'] = officerIncharge
    

        return _payload


    })(facilityContacts, facilityOfficerContacts)

    try{

        fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {

            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'POST',
            body: JSON.stringify(payload).replace(',"":""','')
        })
    }
    catch(e){
        console.error('Unable to patch facility contacts details', e.message)
    }

    window.sessionStorage.setItem('formId', 3);

    setFormId(window.sessionStorage.getItem('formId'));
};

// handleRegulationSubmit
const handleRegulationSubmit = (event, stateSetters, file) => {

    event.preventDefault()

    const [setFormId, facilityId, facility_name, facilityRegulationFormRef] = stateSetters

    const formData = new FormData(facilityRegulationFormRef.current)
   
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

    // console.log({payload}) // debug


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
                    formData.append('fyl', file ?? undefined)


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




    window.sessionStorage.setItem('formId', 4);

    setFormId(window.sessionStorage.getItem('formId'));

};


// handleServiceSubmit
const handleServiceSubmit = async (stateSetters, facilityId) => {

    const [services, setFormId, formId, setServices] = stateSetters
    const _payload = services.map(({ id }) => ({ service: id }))

    console.log({_payload})

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

    setFormId(`${parseInt(formId) + 1}`)
    setServices([])

}

// handleInfrastructureSubmit
const handleInfrastructureSubmit = (stateSetters, facilityId) => {


    const [formData, setFormId, setSelectedItems, setIsFormSubmit, resetForm] = stateSetters


    const _payload = Object.values(formData).map((count, i) =>
    ({
        infrastructure: Object.keys(formData)[i],
        count
    })
    )

   

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

        window.sessionStorage.setItem('formId', 6)
        setFormId(window.sessionStorage.getItem('formId'))
        setSelectedItems([])
        resetForm()
        setIsFormSubmit(true)


    }

}


// handleHrSubmit
const handleHrSubmit = (stateSetters, facilityId, alert) => {

    const [formData, _] = stateSetters // removed setFormId



    const _payload = Object.values(formData).map((count, i) =>
    ({
        speciality: Object.keys(formData)[i],
        count
    })
    )


    if (facilityId && _payload) {
        alert.success("Facility Created successfully")
    } else {
        alert.error("Unable to create facility")
        
    }


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


    // Instead of resetting form to basic detils form redirect to facility details view

    // window.sessionStorage.setItem('formId', 0)

    // setFormId(window.sessionStorage.getItem('formId'))
   

}


// handleBasicDetailsUpdate
const handleBasicDetailsUpdates = async (formData, facility_id, alert) => {

    if (formData) {
        alert.success("Facility Basic Details successfully updated")
    } else {
        alert.error("Unable to update facility geolocation data")
    }

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
const handleGeolocationUpdates = async (formData, coordinates_id, alert) => {

    if (formData) {
        alert.success("Facility Geolocation successfully updated")
    } else {
        alert.error("Unable to update facility geolocation data")
    }


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

    }
    catch (e) {
        console.error('Error msg:', e.message)
    }
}

// handleFacilityContactUpdates
const handleFacilityContactsUpdates = async (formData, facility_id, alert) => {
    if (formData) {
        alert.success("Facility Contacts successfully updated")
    } else {
        alert.error("Unable to update facility contacts data")
    }

    try {
        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facility_id}`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;*/*'
            },
            method: 'PATCH',
            body: JSON.stringify(formData)
        })



        return resp

    }
    catch (e) {
        console.error('Error msg:', e.message)
    }
}

// handleRegulationUpdate
const handleRegulationUpdates = async (formData, facility_id, alert, alert_message) => {
    if (formData) {
        alert.success(alert_message)
    } else {
        alert.error("Unable to update facility regulation")
    }

    try {
        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facility_id}`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;*/*'
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

// handleServiceUpdates
const handleServiceUpdates = async (stateSetters, alert) => {


    const [services, facilityId] = stateSetters

    const _payload = services.length > 0 ? services.map(({ id }) => ({ service: id })) : { services: [{ service: null }] }

    try {

        if (_payload) {
            alert.success('Successfully updated facility services')
        } else {
            alert.error("Unable to update facility services")
        }

        const resp = await fetch(`/api/common/submit_form_data/?path=basic_details_update&id=${facilityId}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify({ services: _payload })
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

const handleRegulationSubmitUpdates = (event, stateSetters, file) => {

    event.preventDefault()

    const [setFormId, facilityId, facility_name, facilityRegulationFormRef] = stateSetters

    const formData = new FormData(facilityRegulationFormRef.current)
   
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
                    formData.append('fyl', file ?? undefined)


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
            console.error('Unable to patch facility contacts details', e.message)
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