
// import router from "next/router";
// import { reject } from "underscore";

// handleBasicDetailsSubmit
async function handleBasicDetailsSubmit(token, values, formId, setFormId, fileRef, alert, setGeoJSON, setWardName, setGeoCenter, setFacilityId) {

    const _payload = {};

    let _ward;

    for (const [k, v] of Object.entries(values)) {

        if (v !== "") {
            _payload[k] = (() => {
                // Accomodates format of facility checklist document
                if (k === "facility_checklist_document") {
                    return { fileName: v.split('\\').reverse()[0] }
                }

                if (typeof v === 'string') {
                    if (v.match(/^true$/) !== null) {
                        return Boolean(v)
                    }

                    if (v.match(/^false$/) !== null) {
                        return Boolean(v)
                    }

                    // check if value is alphanumeral and convert to number
                    return v.match(/^[0-9]$/) !== null ? Number(v) : v
                }
                else {
                    return v

                }



            })()
        }

    }

    // Add officer in charge to payload
    _payload['officer_in_charge'] = {
        name: '',
        reg_no: '',
        contacts: [
            {
                type: '',
                contact: ''
            }
        ]
    }


    // Post Facility Basic Details
    if (token) {
        try {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method: 'POST',
                body: JSON.stringify(_payload)
            })

                // Post Checklist document
                .then(async resp => {

                    const { id, ward } = (await resp.json());

                    _ward = ward;

                    setFacilityId(`${id}`);

                    // Store facility Id to localstorage

                    const formData = new FormData()

                    if (fileRef !== null) {

                        formData.append('name', `${_payload['official_name']} Facility Checklist File`)
                        formData.append('description', 'Facilities checklist file')
                        formData.append('document_type', 'Facility_ChecKList')
                        formData.append('facility_name', _payload['official_name'])
                        formData.append('fyl', fileRef.files[0] ?? undefined)

                    }

                    if (resp.status == 201 && formData.get('fyl')) {

                        alert.success('Basic details saved successful');

                        try {
                            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/`, {

                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Accept': 'application/json, text/plain, */*',
                                },
                                method: 'POST',
                                body: formData
                            })

                            return resp
                        }
                        catch (e) {
                            console.error('Unable to Post document')
                        }
                    }
                    else {
                        alert.error('Unable to save basic details successfully!')
                    }
                })
                //  fetch data for Geolocation form
                .then(async (resp) => {
                    if (resp) {


                        try {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/wards/${_ward}/`,
                                {
                                    headers: {
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


                        } catch (e) {
                            console.error(e.message)
                            return {
                                error: e.message,
                                id: null
                            }
                        }

                    }
                }

                )
        } catch (e) {
            console.error(e.message)
            return {
                error: e.message,
                id: null
            }
        }
    }
    else {
        alert.error('Access Token not supplied !')
    }


    setFormId(`${parseInt(formId) + 1}`);

};

// handleGeolocationSubmit
function handleGeolocationSubmit(token, values, stateSetters) {

    const [formId, setFormId, facilityId] = stateSetters

    const geolocationData = {};


    // formData.forEach(({ name, value }) => {
    for (const [key, value] of Object.entries(values)) {
        geolocationData[key] = (() => {
            switch (key) {
                case 'collection_date':
                    return new Date(value)
                case 'latitude':

                    return value.match(/^\-$/) !== null ? 0.000000 : value
                case 'longitude':

                    return value.match(/^\-$/) !== null ? 0.000000 : value
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
        coordinates: [
            geolocationData.longitude,
            geolocationData.latitude
        ],
        type: 'Point'
    }
    // Post Geolocation Details

    // console.log({geo_payload: JSON.stringify(geolocationData).replace(',"":""','')})
    try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/facility_coordinates/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'POST',
            body: JSON.stringify(geolocationData).replace(',"":""', '')
        })
    }
    catch (e) {
        console.error('Unable to post geolocation details')
    }

    setFormId(`${parseInt(formId) + 1}`);
};

// handleFacilityContactsSubmit
function handleFacilityContactsSubmit(token, values, facilityId) {

    // console.log({values})
    const facilityContacts = []
    const contactEntries = Object.entries(values).filter(arr => ((/^contact_[0-9]{1}/.test(arr[0])) || (/^contact_type_[0-9]{1}/.test(arr[0]))));
    const contact_temp = contactEntries.filter(contact => /^contact_\d/.test(contact[0])).map(() => ({}))

    contactEntries.forEach((contact, i) => {

        if (/^contact_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if (/^contact_type_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if (Object.keys(contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) facilityContacts.push(contact_temp[parseInt(contact[0].split('_').reverse()[0])]);

    })


    const officerContacts = []
    const officerContactEntries = Object.entries(values).filter(arr => ((/^officer_details_contact_[0-9]{1}/.test(arr[0])) || (/^officer_details_contact_type_[0-9]{1}/.test(arr[0]))));
    const officer_contact_temp = officerContactEntries.filter(contact => /^officer_details_contact_\d/.test(contact[0])).map(() => ({}))

    officerContactEntries.forEach((contact, i) => {

        if (/^officer_details_contact_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if (/^officer_details_contact_type_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if (Object.keys(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) officerContacts.push(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]);

    })


    const officerDetails = { contacts: officerContacts }

    officerDetails['name'] = values.officer_name;
    officerDetails['reg_no'] = values.officer_reg_no;
    officerDetails['title'] = values.officer_title;



    const payload = { contacts: facilityContacts, officer_in_charge: officerDetails };


       console.log(JSON.stringify(payload, null, 2))

    if (facilityId && token) {
        try {

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method: 'PATCH',
                body: JSON.stringify(payload)
            })
        }
        catch (e) {
            throw Error('Unable to update facility contacts details', e.message)
        }
    } else {
        return new Promise(reject => {
            reject(Error('unable to save facility contacts: facilityId or token is missing'))
        })
    }

    // setFormId(`${parseInt(formId) + 1}`);
};

// handleRegulationSubmit
async function handleRegulationSubmit(token, values, facilityId, setSubmitting, licenseFile, alert, setFormError) {

    // console.log({license: licenseFileRef.current})

    const { license_number, registration_number, regulation_status, regulatory_body } = values

    const facilityDeptEntries = Object.entries(values)
    const facilityDetpUnits = []
    const deptUnitsEntries = facilityDeptEntries.filter(field => /^facility_.+$/.test(field[0]))
    const dept_units_temp = deptUnitsEntries.filter(unit => /^facility_unit_\d/.test(unit[0])).map(() => ({}))

    deptUnitsEntries.forEach((unit, i) => {

        if (/^facility_unit_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['unit'] = unit[1];
        if (/^facility_regulating_body_name_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['regulating_body_name'] = unit[1];
        if (/^facility_license_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['license_number'] = unit[1];
        if (/^facility_registration_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['registration_number'] = unit[1];

        if (Object.keys(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]).length == 4) facilityDetpUnits.push(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]);

    })

    const payload = [
        {
            license_number,
            registration_number,
            regulation_status,
            regulatory_body,
        },

        {
            units: facilityDetpUnits
        }
    ]



    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8'

        },
        method: 'PATCH',
        body: JSON.stringify(payload[0])
    })
    .then(resp => {
        if (resp.ok) {
            alert.success('Facility Regulation Details Created Successfully', {
                timeout: 10000
            })
            

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method: 'PATCH',
                body: JSON.stringify(payload[1])
            })
            .then(resp => {
                if(resp.ok) {
                    setSubmitting(false)
                    alert.success('Facility Department units Created Successfully', {
                        timeout: 10000
                    })

                    // Posting  license  file


                    const formDataBase64Enc = Buffer.from(JSON.stringify(payload)).toString('base64')

                    if(window) {
                        window.localStorage.setItem('regulation', formDataBase64Enc)
                    }

                    // router.push({
                    //     pathname: `${window.location.origin}/facilities/add`,
                    //     query: { 
                    //       formData: formDataBase64Enc,
                    //       formId: 4,
                    //       facility_id: facilityId,
                    //       from: 'submission'
    
                    //     }
                    // })
                    const url = new URL(`${window.location.origin}/facilities/add?formData=${formDataBase64Enc}`)

                    url.searchParams.set('formId', '4')

                    url.searchParams.set('facilityId', facilityId)

                    url.searchParams.set('from', 'submission')

                    window.location.href = url

                } else {
                    setSubmitting(false)
                    alert.error('Unable to create Facility Department units', {
                        timeout: 10000
                    })
                }
            })
            .catch(console.error)
        } else {
            setSubmitting(false)
            alert.error('Unable to create Facility Reguation Details', {
                timeout: 10000
            })

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
        setFormError(`Error :${e.message}`)
        console.error(e.message)
    })

    // payload.forEach(async (data, i) => {
    //     try {
    //         const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

    //             headers: {
    //                 'Authorization': 'Bearer ' + token,
    //                 'Accept': 'application/json, text/plain, */*',
    //                 'Content-Type': 'application/json;charset=utf-8'

    //             },
    //             method: 'PATCH',
    //             body: JSON.stringify(data)
    //         })

    //         if (resp.status == 204 || resp.status == 200) {
    //             setSubmitting(false)
    //             alert.success('Facilty Regulation details saved successfully')

    //             const formDataBase64Enc = Buffer.from(JSON.stringify(values)).toString('base64')


    //             router.push({
    //                 pathname: `${window.location.origin}/facilities/add?formData=[formData]&formId=[formId]&facilityId=[facilityId]`,
    //                 query: { 
    //                   formData: formDataBase64Enc,
    //                   formId: 3,
    //                   facility_id: facilityId,
    //                   from: 'submission'

    //                 }
    //               })
    //         } else {
    //             setSubmitting(false)
    //             alert.error('unable to save Regulation details ')
    //         }
    //     } catch (e) {
    //         console.error('Unable to patch facility contacts details', e.message)
    //     }
    // })

    if (facilityId && licenseFile) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
        })
            .then(resp => resp.json())
            .then(async ({ name: facility_name }) => {

                // console.log({facility_name})
                if (licenseFile) {

                    const formData = new FormData()

                    if (licenseFile !== null) {
                        formData.append('name', `${facility_name} Facility license File`)
                        formData.append('description', 'Facilities license file')
                        formData.append('document_type', 'FACILITY_LICENSE')
                        formData.append('facility_name', facility_name)
                        formData.append('fyl', licenseFile?.files[0] ?? undefined)
                    }


                    try {

                        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/`, {

                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Accept': 'application/json, text/plain, */*',
                            },
                            method: 'POST',
                            body: formData
                        })

                        if (resp.status == 201) {

                            setSubmitting(false)

                            alert.success('License Document saved successfully')

                        }

                    
                    }
                    catch (e) {
                        console.error('Unable to Post License Document', e.message)
                    }
                } else {
                    console.error('No license file ')

                }

            })
    }


    // Post the license document


   


    // setFormId(`${parseInt(formId) + 1}`);
};


// handleServiceSubmit
function handleServiceSubmit(token, services, facilityId) {

    const _payload = typeof services == 'string' ? JSON.parse(services).map(({ rowid }) => ({ service: rowid })) : services.map(({ rowid }) => ({ service: rowid }))

    // console.log({facilityId})

    if (facilityId) {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'PATCH',
            body: JSON.stringify({ services: _payload })
        })
        .then(resp => {
            if(resp.ok) {
                if(window){
                    const servicesEnc = Buffer.from(_payload).toString('base64')
                    window.localStorage.setItem('services', servicesEnc)
                }
            }
        })


    }
    else {
        throw new Error('Unable to save facility services: facilityId not defined')
    }

    // setFormId(`${parseInt(formId) + 1}`);

    // setServices([])
}

// handleInfrastructureSubmit
function handleInfrastructureSubmit(token, formData, facilityId) {

    const _payload = formData.map(({ sname: name, rowid: id, count }) => {
        if (
            name?.includes("Main Grid") ||
            name?.includes("Gas") ||
            name?.includes("Bio-Gas") ||
            // WATER SOURCE
            name?.includes("Roof Harvested Water") ||
            name?.includes("River / Dam / Lake") ||
            name?.includes("Donkey Cart / Vendor") ||
            name?.includes("Piped Water") ||
            // MEDICAL WASTE MANAGEMENT
            name?.includes("Sewer systems") ||
            name?.includes("Dump without burning") ||
            name?.includes("Open burning") ||
            name?.includes("Remove offsite") ||
            // ACCESS ROADS
            name?.includes("Tarmac") ||
            name?.includes("Earthen Road") ||
            name?.includes("Graded ( Murrum )") ||
            name?.includes("Gravel")
        ) {
            return { infrastructure: id }

        } else {
            return { infrastructure: id, count: Number(count) }

        }
    })

    // console.log({_payload})

    if (_payload) {

        try {
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method: 'PATCH',
                body: JSON.stringify({ infrastructure: _payload })
            })

        }
        catch (e) {
            console.error('Unable to patch facility contacts details', e.message)
        }

        // setFormId(`${parseInt(formId) + 1}`)
    }

}

// handleHrSubmit
function handleHrSubmit(token, formData, facilityId) {

    // const [savedVals, formVals] = stateSetters // removed setFormId

    const _payload = formData.map(({ rowid: id, count }) =>
        ({ speciality: id, count: Number(count) })
    )


    try {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {

            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'

            },
            method: 'PATCH',
            body: JSON.stringify({ specialities: _payload })
        })

    }
    catch (e) {
        console.error('Unable to submit facility human ReportsSideMenu  details', e.message)
    }

    // reset form


}


// handleBasicDetailsUpdate
async function handleBasicDetailsUpdates(token, formData, facility_id, updatedSavedChanges) {

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


        if (resp.ok) {
            localStorage.clear()
        }



        return resp



    }
    catch (e) {
        console.error('Error msg:', e.message)
    }
}


// handleFacilityContactUpdates
async function handleFacilityContactsUpdates(token, values, facility_id, currentFacilityContacts, currentOfficerContacts) {


    const facilityContacts = [];
    const contactEntries = Object.entries(values).filter(arr => ((/^contact_[0-9]{1}/.test(arr[0])) || (/^contact_type_[0-9]{1}/.test(arr[0]))));
    const contact_temp = contactEntries.filter(contact => /^contact_\d/.test(contact[0])).map(() => ({}));

    contactEntries.forEach((contact, i) => {

        if (/^contact_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if (/^contact_type_[0-9]{1}/.test(contact[0])) contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if (Object.keys(contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) facilityContacts.push(contact_temp[parseInt(contact[0].split('_').reverse()[0])]);

    })


    const officerContacts = []
    const officerContactEntries = Object.entries(values).filter(arr => ((/^officer_details_contact_[0-9]{1}/.test(arr[0])) || (/^officer_details_contact_type_[0-9]{1}/.test(arr[0]))));
    const officer_contact_temp = officerContactEntries.filter(contact => /^officer_details_contact_\d/.test(contact[0])).map(() => ({}))

    officerContactEntries.forEach((contact, i) => {

        if (/^officer_details_contact_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact'] = contact[1];
        if (/^officer_details_contact_type_[0-9]{1}/.test(contact[0])) officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]['contact_type'] = contact[1];

        if (Object.keys(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]).length == 2) officerContacts.push(officer_contact_temp[parseInt(contact[0].split('_').reverse()[0])]);

    })


    const officerDetails = { contacts: officerContacts }

    officerDetails['name'] = values.officer_name;
    officerDetails['reg_no'] = values.officer_reg_no;
    officerDetails['title'] = values.officer_title;

    const filteredFacilityContacts = facilityContacts?.filter(({contact}, i) => {
        return contact !== currentFacilityContacts[i]?.contact
    })

    const filteredOfficerDetails = {}

    filteredOfficerDetails['contacts'] = officerDetails.contacts?.filter(({contact}, i) => {
        return contact !== currentOfficerContacts?.contacts[i]?.contact
    })

    //Omit old values and only include new fields or fields that have changed

    // filteredOfficerDetails['name'] = (officerDetails.name !== currentOfficerContacts.name && officerDetails.name) ?? null
    // filteredOfficerDetails['reg_no'] = (officerDetails.reg_no !== currentOfficerContacts.reg_no && officerDetails.reg_no) ?? null
    // filteredOfficerDetails['title'] = (officerDetails.title !== currentOfficerContacts.title && officerDetails.title) ?? null

    // !filteredOfficerDetails['name'] && delete filteredOfficerDetails['name'] 
    // !filteredOfficerDetails['reg_no'] && delete filteredOfficerDetails['reg_no'] 
    // !filteredOfficerDetails['title'] && delete filteredOfficerDetails['title']
    
    
    filteredOfficerDetails['name'] = officerDetails['name'] 
    filteredOfficerDetails['reg_no'] = officerDetails['reg_no'] 
    filteredOfficerDetails['title'] = officerDetails['title'] 

    const payload = { contacts: filteredFacilityContacts, officer_in_charge: filteredOfficerDetails };
    

    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facility_id}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json;charset=utf-8;*/*'
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })

        if (resp.ok) {
            localStorage.clear()
        }

        return resp

    }
    catch (e) {
        console.error(e.message)
    }
}

// handleRegulationUpdate
async function handleRegulationUpdates(token, values, facilityId, licenseFileRef, setSubmitting, router, alert, setFormError) {

    let facility_name = ''

    if (window) {
        facility_name = JSON.parse(JSON.parse(window.localStorage.getItem('basic_details_form')))?.official_name
    }


    const { license_number, registration_number, regulation_status, regulatory_body } = values

    const facilityDeptEntries = Object.entries(values)
    const facilityDetpUnits = []
    const deptUnitsEntries = facilityDeptEntries.filter(field => /^facility_.+$/.test(field[0]))
    const dept_units_temp = deptUnitsEntries.filter(unit => /^facility_unit_\d/.test(unit[0])).map(() => ({}))

    deptUnitsEntries.forEach((unit, i) => {

        if (/^facility_unit_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['unit'] = unit[1];
        if (/^facility_regulating_body_name_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['regulating_body_name'] = unit[1];
        if (/^facility_license_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['license_number'] = unit[1];
        if (/^facility_registration_number_[0-9]{1}/.test(unit[0])) dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]['registration_number'] = unit[1];

        if (Object.keys(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]).length == 4) facilityDetpUnits.push(dept_units_temp[parseInt(unit[0].split('_').reverse()[0])]);

    })

    const payload = [
        {
            license_number,
            registration_number,
            regulation_status,
            regulatory_body,
        },

        {
            units: facilityDetpUnits
        }
    ]

    // console.log({values, facilityId, payload})


    payload.forEach((data, i) => {
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
            .then(resp => {

                const formData = new FormData()

                if (licenseFileRef) {
                    if (Array.isArray(licenseFileRef.files)) {
                        formData.append('name', `${facility_name} Facility license File`)
                        formData.append('description', 'Facilities license file')
                        formData.append('document_type', 'FACILITY_LICENSE')
                        formData.append('facility_name', facility_name)
                        formData.append('fyl', licenseFileRef.files[0] ?? undefined)

                        // console.log({licenseFileRef})

                        if (Object.fromEntries(formData)?.fyl) {

                            try {
                                fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/`, {

                                    headers: {
                                        'Accept': 'application/json, text/plain, */*',
                                        'ContentType': 'multipart/form-data; boundary=---------------------------22584204591762068164170278481'
                                    },
                                    method: 'POST',
                                    body: formData
                                })


                            }
                            catch (e) {
                                console.error('Unable to Post License Document')
                            }
                        }

                    }
                }

                if (i == 1) {
                    // console.log({resp})
                    if (resp.status == 200 || resp.status == 204) {

                        alert.success('Facility Regulation Details updated successfully')
                        setSubmitting(false)

                        router.push({
                            pathname: '/facilities/facility_changes/[facility_id]',
                            query: {
                                facility_id: facilityId
                            }
                        })
                    }
                    else {
                        setSubmitting(false)
                        alert.error('Unable to update regulation form')
                    //     const response = resp.json()
                    //     if(response) {
                    //     response    
                    //     .then(resp => {
                    //         const formResponse = []
                    //         setFormError(() => {
                    //         if(typeof resp == 'object') {
                    //             const respEntry = Object.entries(resp)

                    //             for (let [_, v] of respEntry) {
                    //             formResponse.push(v)
                    //             }

                    //             return `Error: ${formResponse.join(" ")}`
                    //         }
                    //         })
                    //     })
                    // }
                    }
                }
            })


        }
        catch (e) {
            setSubmitting(false)
            setFormError(`Error: ${e.message}`)
            console.error(e.message)
        }
    })
}

// handleServiceUpdates
async function handleServiceUpdates(token, stateSetters) {


    const [services, facilityId] = stateSetters

    const _payload = typeof services == 'string' ? JSON.parse(services).map(({ rowid }) => ({ service: rowid })) : services.map(({ rowid }) => ({ service: rowid }))


    console.log({
        _payload
    })

    try {

        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PATCH',
            body: JSON.stringify({ services: _payload })
        })

     

    }
    catch (e) {
        console.error('Unable to patch facility services details', e.message)
    }

}

// handleServiceDelete
async function handleServiceDelete(token, event, facility_service_id) {

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
async function handleInfrastructureUpdates(token, stateSetters) {

    const [formData, facilityId] = stateSetters

    const _payload = formData.map(({rowid: infrastructure, count}) => {
        if(infrastructure && count) {
            return {
                infrastructure,
                count: count && typeof count == 'string' ? Number(count) : count
            }
      
        } else if(infrastructure) {
            return {
                infrastructure
            }
        }
    })


    const payload = {infrastructure: _payload.filter(obj => obj !== undefined)}


    try {

        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })

    
    }
    catch (e) {
        console.error('Unable to patch facility Infrastructure details', e.message)
    }
}

// handleInfrastructureDelete
async function handleInfrastructureDelete(token, event, facility_infrastructure_id, alert) {

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

        if (resp.ok) {
            localStorage.clear()
        }

        return resp

    }
    catch (e) {
        console.error('Unable to delete facility infrastructure', e.message)
    }

}

// handleHrUpdates
async function handleHrUpdates(token, stateSetters) {

  
    const [formData, facilityId] = stateSetters

    const _payload = formData.map(({rowid: speciality, count}) => {
        if(speciality && count) {
            return {
                speciality,
                count: count && typeof count == 'string' ? Number(count) : count
            }
      
        } else if(speciality) {
            return {
                speciality
            }
        }
    })


    const payload = {specialities: _payload.filter(obj => obj !== undefined)}


    try {

        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'PATCH',
                body: JSON.stringify(payload)
        })


    }
    catch (e) {
        console.error('Unable to patch facility Human ReportsSideMenu  details', e.message)
    }
}

// handleHrDelete
async function handleHrDelete(event, facility_hr_id, alert) {
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
async function handleFacilityUpgrades(payload, token) {

    try {

        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_upgrade/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`,

            },
            method: 'POST',
            body: JSON.stringify(payload)
        })

      
        return resp

    }
    catch (e) {
        throw Error('Unable to upgrade facility: ', e.message)
    }
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
    handleFacilityContactsUpdates,
    handleRegulationUpdates,
    handleServiceUpdates,
    handleInfrastructureUpdates,
    handleHrUpdates,
    handleFacilityUpgrades,
    handleServiceDelete,
    handleHrDelete,
    handleInfrastructureDelete,
}