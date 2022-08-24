import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { checkToken } from '../../../controllers/auth/auth'
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select'
import MainLayout from '../../../components/MainLayout'
import { CheckCircleIcon, InformationCircleIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid'
// import facilityResponse from '../../../components/facilityDummyResponse.json'

// import dynamic from 'next/dynamic'

const EditFacility = (props) => {

    console.log({props})

    // Form drop down options

    const facilityOptions = [
		props['0']?.facility_types[0],  // STAND ALONE
		props['0']?.facility_types[1],  // DISPENSARY 
		props['0']?.facility_types[2],  // MEDICAL CLINIC
		props['0']?.facility_types[8],  // NURSING HOME
		props['0']?.facility_types[10], // HOSPITALS
		props['0']?.facility_types[16], // HEALTH CENTRE
		props['0']?.facility_types[25]  // MEDICAL CENTRE
	]

    const facilityTypeOptions = props['1']?.facility_type_details
    const ownerOptions =  props['2']?.owners
    const ownerTypeOptions =  props['3']?.owner_types
    const kephOptions =  props['4']?.keph
    const facilityAdmissionOptions =  props['5']?.facility_admission_status
    const countyOptions =  props['6']?.counties
    const subCountyOptions =  props['7']?.sub_counties
    const constituencyOptions =  props['8']?.constituencies
    const wardOptions =  props['9']?.wards
    const jobTitleOptions = props['10']?.job_titles
    const contactTypeOptions = props['11']?.contact_types

    const facilityDeptOptions = props['12']?.facility_depts
    const regBodyOptions = props['13']?.regulating_bodies
    const regulationStateOptions = props['14']?.regulation_status
    const operationStatusOptions = [
        {
            value: '190f470f-9678-47c3-a771-de7ceebfc53c',
            label: 'Non-Operational',
        },
        {
            value: 'ae75777e-5ce3-4ac9-a17e-63823c34b55e',
            label: 'Operational',
        },
    ]

    // Facility data
    const {
        name,
        official_name,
        code,
        owner,
        owner_type,
        is_approved,
        keph_level,
        keph_level_name,
        operation_status, 
        date_established,
        facility_units,
        facility_type,
        facility_type_name,
        facility_specialists,
        facility_infrastructure,
        facility_services,
        accredited_lab_iso_15189,
        number_of_beds,
        number_of_cots,
        number_of_emergency_casualty_beds,
        number_of_icu_beds,
        number_of_hdu_beds,
        number_of_maternity_beds,
        number_of_isolation_beds,
        number_of_general_theatres,
        number_of_maternity_theatres,
        facility_catchment_population,
        reporting_in_dhis,  
        nhif_accreditation,
        is_classified,
        open_whole_day,
        open_weekends,
        open_public_holidays,
        open_normal_day,
        open_late_night,
        admission_status

    } = props['19']?.data 
   
    

    const [user, setUser] = useState(null)

    // Form field states
    const [_name, setName] = useState(name)
    const [_officialName, setOfficialName] = useState(official_name)
    const [_dateEstablished, setDateEstablished] = useState(date_established)
    const [_ISOAccredited, setISOAccredited] = useState(accredited_lab_iso_15189)
    const [_noOfBeds, setNoOfBeds] = useState(number_of_beds)
    const [_noOfCots, setNoOfCots] = useState(number_of_cots)
    const [_noOfCasualtyBeds, setNoOfCasualtyBeds] = useState(number_of_emergency_casualty_beds)
    const [_noOfICUBeds, setNoOfICUBeds] = useState(number_of_icu_beds)
    const [_noOfHDUBeds, setNoOfHDUBeds] = useState(number_of_hdu_beds)
    const [_noOfMaternityBeds, setNoOfMaternityBeds] = useState(number_of_maternity_beds)
    const [_noOfIsolationBeds, setNoOfIsolationBeds] = useState(number_of_isolation_beds)
    const [_noOfMaternityTheaters, setNoOfMaternityTheaters] = useState(number_of_maternity_theatres)
    const [_noOfGeneralTheaters, setNoOfGeneralTheaters] = useState(number_of_general_theatres)
    const [_catchmentPopulation, setCatchmentPopulation] = useState(facility_catchment_population)
    const [_isDHISReporting, setIsDHISReporting] = useState(reporting_in_dhis)
    const [_isNHIFAccredited, setIsNHIFAccredited] = useState(nhif_accreditation)   
    const [_isArmedForcesFct, setIsArmedForcesFct] = useState(is_classified)
    const [_is24Hrs, setIs24Hrs] = useState(open_whole_day)
    const [_isWeekends, setIsWeekends] = useState(open_weekends)
    const [_isPublicHolidays, setIsPublciHolidays] = useState(open_public_holidays)
    const [_isNormalDay, setIsNormalDay] = useState(open_normal_day)
    const [_isLateNight, setIsLateNight] = useState(open_late_night)
    const [_admissionStatus, setAdmissionStatus] = useRef(null)

   
    
    const [facilityOption, setFacilityOption] = useState('')
    const [ownerTypeOption, setOwnerTypeOption] = useState('')
    const [facilityTypeDetail, setFacilityTypeDetail] = useState('')
    const [subCountyOpt, setSubCountyOpt] = useState('')
	const [wardOpt, setWardNameOpt] = useState('')

    // Form Field Refs
    const kephLvlRef = useRef(null)  
    const facilityTypeRef = useRef(null)
    const facilityTypeDetailsRef = useRef(null)
    const operationStatusRef = useRef(null)  
    const dateEstablishedRef = useRef(null)
    const accreditationISOYesRef = useRef(null)
    const accreditationISONoRef = useRef(null)
    const ownerTypeOptionsRef = useRef(null)
    const ownerDetailsRef = useRef(null)
    const noOfBedsRef = useRef(null)
    const noOfCotsRef = useRef(null)
    const noOfCasualtyBedsRef = useRef(null)
    const noOfICUBedsRef = useRef(null)
    const noOfHDUBedsRef = useRef(null)
    const noOfMaternityBedsRef = useRef(null)
    const noOfIsolationBedsRef = useRef(null)
    const noOfGeneralTheatersRef = useRef(null)
    const noOfMaternityTheatersRef = useRef(null)
    const catchmentPopulationRef = useRef(null)
    const isDHISReportingYesRef = useRef(null)
    const isDHISReportingNoRef = useRef(null)
    const isNHIFAccreditedYesRef = useRef(null)
    const isNHIFAccreditedNoRef = useRef(null)
    const isArmedForcesFctRef = useRef(null)
    const is24HrsRef = useRef(null)
    const isLateNightRef = useRef(null)
    const isPublicHolidaysRef = useRef(null)
    const isWeekendsRef = useRef(null)
    const isNormalDayRef = useRef(null)
    const countyRef = useRef(null)
    const subCountyRef = useRef(null)
    const constituencyRef = useRef(null)
    const wardRef = useRef(null)
    const facilityAdmissionRef = useRef(null)

    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let usr = window.sessionStorage.getItem('user')
            if (usr && usr.length > 0) {
                setUser(JSON.parse(usr))
            }
        }
        
        // Pre-fetch values for drop down
        if(facilityTypeRef.current !== null){
            // console.log({facility_type})
            facilityTypeRef.current.state.value = facilityOptions.filter(({value}) => value === facility_type)[0] || {label:facility_type_name, value:facility_type}
        }
        if(facilityTypeDetailsRef.current !== null){
            facilityTypeDetailsRef.current.state.value = facilityTypeOptions.filter(({value}) => value === facility_type)[0] || ''
        }
        if(operationStatusRef.current !== null){
            
            operationStatusRef.current.state.value = operationStatusOptions.filter(({value}) => value === operation_status)[0] || ''
        }
        if(ownerTypeOptionsRef.current !== null){
            
            ownerTypeOptionsRef.current.state.value = ownerTypeOptions.filter(({value}) => value === owner_type)[0] || ''
        }
        if(ownerDetailsRef.current !== null){
            
            ownerDetailsRef.current.state.value = ownerOptions.filter(({value}) => value === owner)[0] || ''
        }
        if(kephLvlRef.current !== null){
            
            kephLvlRef.current.state.value = kephOptions.filter(({value}) => value === keph_level)[0] || ''
        }
        if(facilityAdmissionRef.current !== null){
            
            facilityAdmissionRef.current.state.value = facilityAdmissionOptions.filter(({value}) => value === admission_status)[0] || ''
        }
        
    }, [])

    return (
        <>
        
            <Head>
                <title>KMHFL - {official_name}</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout>
                <div className="w-full grid grid-cols-1 place-content-center md:grid-cols-4 gap-4 md:p-2 my-6">
                    <div className="col-span-4 flex flex-col items-start px-4 justify-start gap-3">
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <a className="text-green-700" href="/facilities">Facilities</a> {'>'}
                            <span className="text-gray-500">{official_name} ( #<i className="text-black">{code || "NO_CODE"}</i> )</span>
                        </div>
                        <div className={"col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (is_approved ? "border-green-600" : "border-green-600")}>
                            <div className="col-span-6 md:col-span-3">
                                <h1 className="text-4xl tracking-tight font-bold leading-tight">{official_name}</h1>
                                <div className="flex gap-2 items-center w-full justify-between">
                                    <span className={"font-bold text-2xl " + (code ? "text-green-900" : "text-gray-400")}>#{code || "NO_CODE"}</span>
                                    <p className="text-gray-600 leading-tight">{keph_level_name && "KEPH " + keph_level_name}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                                
                            </div>
                            <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">
                               
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-4 flex flex-col items-center md:gap-3 gap-y-3 mt-4">
                        <Tabs.Root orientation="horizontal" className="w-full flex flex-col tab-root" defaultValue="overview">
                            <Tabs.List className="list-none md:grid md:grid-cols-7 grid grid-cols-2 gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                <Tabs.Tab value="overview" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Basic Details
                                </Tabs.Tab>
                                <Tabs.Tab value="services" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Geolocation
                                </Tabs.Tab>
                                <Tabs.Tab value="infrastructure" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Family contacts
                                </Tabs.Tab>
                                <Tabs.Tab value="hr_staffing" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Regulation
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Services
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Infrastructure
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Human Resources
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="overview" className="grow-1 py-1 px-4 tab-panel">
                                                <>
                                                    <form className='flex flex-col w-full items-start justify-start gap-3 md:mt-6'>
                                                        {/* Facility Official Name */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Official Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required type="text" name="facility_official_name" value={_name} onChange={e => { setName(e.target.value) }} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>
                                                        {/* Facility Unique Name  */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Unique Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required type="text" name="facility_unique_name" value={_officialName} onChange={e => { setOfficialName(e.target.value) }} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>
                                                        {/* Facility Type */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Facility Type <span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <Select
                                                            ref={facilityTypeRef} 
                                                            options={facilityOptions || []}
                                                            required
                                                            placeholder="Select a facility type..."
                                                        
                                                            onChange={
                                                                (e) => setFacilityOption(e.label)
                                                            }
                                                            name="facility_official_name" 
                                                            
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                        </div>

                                                        {/* Facility Type Details */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label
																	htmlFor='facility_type_details'
																	className='text-gray-600 capitalize text-sm'>
																	Facility Type Details
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
                                                                    ref={facilityTypeDetailsRef}
																	options={
																		(() => {
																			
																			switch(facilityOption){
																				case 'STAND ALONE':
			
																					if(kephLvlRef.current !== null) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]

																					return [
																						facilityTypeOptions.filter(({label}) => label == 'Dermatology')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == "Rehab. Center - Drug and Substance abuse")[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Nutrition and Dietetics')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Dialysis Center')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == "Rehab. Center - Physiotherapy, Orthopaedic & Occupational Therapy")[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'VCT')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Farewell Home')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Laboratory')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Radiology Clinic')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Pharmacy')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Regional Blood Transfusion Centre')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Ophthalmology')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Dental Clinic')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Blood Bank')[0] || {},

																						 ] 
																					
																				case 'DISPENSARY':
																					if(kephLvlRef.current !== null) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
																					return  facilityTypeOptions.filter(({label}) => label == 'DISPENSARY') || []
																					

																				case 'MEDICAL CLINIC':
																					if(kephLvlRef.current !== null) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
																					return facilityTypeOptions.filter(({label}) => label == 'Medical Clinic') || []																				
																					
																				case 'NURSING HOME':
																					if(kephLvlRef.current !== null) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
																					
																					return [
																							facilityTypeOptions.filter(({label}) => label == 'Nursing and Maternity Home')[0] || {},
																							facilityTypeOptions.filter(({label}) => label == 'Nursing Homes')[0] || {}
																							]

																				case 'HOSPITALS':
															
																					return [
																					   facilityTypeOptions.filter(({label}) => label == 'Specialized & Tertiary Referral hospitals')[0] || {},
																					   facilityTypeOptions.filter(({label}) => label == 'Secondary care hospitals')[0] || {},
																					   facilityTypeOptions.filter(({label}) => label == 'Comprehensive Teaching & Tertiary Referral Hospital')[0] || {},
																					   facilityTypeOptions.filter(({label}) => label == 'Primary care hospitals')[0] || {}
																						] 
																			
																				case 'HEALTH CENTRE':
																					if(kephLvlRef.current !== null) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 3')[0]
																					return [
																						facilityTypeOptions.filter(({label}) => label == 'Basic Health Centre')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Comprehensive health Centre')[0] || {}
																						]

																				case 'MEDICAL CENTRE':
																					if(kephLvlRef.current !== null) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 3')[0]

																					return facilityTypeOptions.filter(({label}) => label == 'Medical Center') || []
																				
																			}
																		})()
																	}
																	required
																	placeholder='Select a facility type details...'
																	onChange={ev => {
																		switch(ev.label){
																			case 'Comprehensive Teaching & Tertiary Referral Hospital':
																				setFacilityTypeDetail('Comprehensive Teaching & Tertiary Referral Hospital')
																				
																				
																				break;
																			case 'Specialized & Tertiary Referral hospitals':
																				setFacilityTypeDetail('Specialized & Tertiary Referral hospitals')
																				
																				break;
																			case 'Secondary care hospitals':
																				setFacilityTypeDetail('Secondary care hospitals')
																			
																					
																				break;
																			case 'Primary care hospitals':
																				setFacilityTypeDetail('Primary care hospitals')
																				
																				break;
																			
																		}
																	}}
																	name='facility_type_details'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
                                                        </div>

                                                        {/* Operation Status */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Operation Status <span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <Select 
                                                            ref={operationStatusRef}
                                                            options={operationStatusOptions || []} 
                                                            required
                                                            placeholder="Select an operation status..."
                                                            onChange={
                                                                ev => ev.preventDefault()
                                                            }
                                                            name="facility_official_name" 
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                        </div>

                                                        {/* Date Established */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="facility_unique_name" className="text-gray-600 capitalize text-sm">Date Established<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input ref={dateEstablishedRef} value={_dateEstablished} onChange={ev => setDateEstablished(ev.target.value)} required type="date" name="facility_unique_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* Is Facility accredited */}
                                                        <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                            <label htmlFor="facility_accredited" className="text-gray-700 capitalize text-sm flex-grow">*Is the facility accredited Lab ISO 15189? </label>
                                                            <span className="flex items-center gap-x-1">
                                                                <input type="radio" ref={accreditationISOYesRef}  checked={_ISOAccredited} name="facility_accredited" id="facility_accredited_yes" onChange={ev => {
                                                                     setISOAccredited(Boolean(ev.target.value))
                                                                }} />
                                                                <small className="text-gray-700">Yes</small>
                                                            </span>
                                                            <span className="flex items-center gap-x-1">
                                                                <input type="radio" ref={accreditationISONoRef} checked={!_ISOAccredited}  name="facility_accredited" id="facility_accredited_no" onChange={ev => {
                                                                    setISOAccredited(Boolean(ev.target.value))
                                                                }} />

                                                                <small className="text-gray-700">No</small>
                                                            </span>
                                                        </div>

                                                        {/* Owner Category */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="owner_category" className="text-gray-600 capitalize text-sm">Owner Category<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <Select 
                                                                ref={ownerTypeOptionsRef}
                                                                options={ownerTypeOptions || []} 
                                                                required
                                                                placeholder="Select owner.."
                                                                onChange={
                                                                    (e) => setOwnerTypeOption(e.label) 
                                                                }
                                                                name="owner_category" 
                                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                        </div>

                                                        {/* Owner Details */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="owner_details" className="text-gray-600 capitalize text-sm">Owner Details<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <Select 
                                                            ref={ownerDetailsRef}
                                                            options={
                                                                (() => {
																	
                                                                    switch(ownerTypeOption){
                                                                        case "Private Practice":

                    
                                                                            return [
                                                                                ownerOptions.filter(({label}) => label == "Private Practice- Pharmacist")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == "Private Practice - Private Company")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == "Private Practice Lab Technician/Technologist")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == "Private Practice - Nurse / Midwifery")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == "Private Practice - Medical Specialist")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == "Private Practice - General Practitioner")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == "Private Practice - Clinical Officer")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == "Private Practice - Private Institution Academic")[0] || {}
                                                                            
                                                                                 ] 
                                                                            
                                                                        case 'Non-Governmental Organizations':
                                                                            return  ownerOptions.filter(({label}) => label == 'Non-Governmental Organizations') || []
                                                                            

                                                                        case 'Ministry of Health':
                                                            
                                                                            return [
                                                                                ownerOptions.filter(({label}) => label == "Public Institution - Parastatal")[0] || {},
                                                                                ownerOptions.filter(({label}) => label == 'Ministry of Health')[0] || {},
                                                                                ownerOptions.filter(({label}) => label == 'Armed Forces')[0] || {},
                                                                                ownerOptions.filter(({label}) => label == 'Public Institution - Academic')[0] || {},
                                                                            ]																				
                                                                            
                                                                        case 'Faith Based Organization':																		

                                                                            return [
                                                                                        ownerOptions.filter(({label}) => label == 'Seventh Day Adventist')[0] || {},
                                                                                        ownerOptions.filter(({label}) => label == 'Supreme Council for Kenya Muslims')[0] || {},
                                                                                        ownerOptions.filter(({label}) => label == 'Other Faith Based')[0] || {},
                                                                                        ownerOptions.filter(({label}) => label == 'Seventh Day Adventist')[0] || {},
                                                                                        ownerOptions.filter(({label}) => label == 'Kenya Episcopal Conference-Catholic Secretariat')[0] || {},
                                                                                        ownerOptions.filter(({label}) => label == 'Christian Health Association of Kenya')[0] || {},
                                                                                    ]

                                                                        
                                                                    }
                                                                })() ?? ownerTypeOptions 
                                                            } 
                                                            required
                                                            placeholder="Select an owner.."
                                                            onChange={
                                                                () => console.log('changed')
                                                            }
                                                            name="owner_details" 
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                        </div>

                                                        {/* KEPH Level */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">KEPH Level</label>
                                                            <Select 
                                                            ref={kephLvlRef}
															options={kephOptions ?? []}
  
                                                            placeholder="Select a KEPH Level.."
                                                            onChange={
                                                                ev => ev.preventDefault()
                                                            }
                                                            name="keph_level" 
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                        </div>

                                                        {/* No. Functional general Beds */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="no_general_beds" className="text-gray-600 capitalize text-sm">Number of functional general beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfBeds} ref={noOfBedsRef} onChange={ev => setNoOfBeds(ev.target.value)} type="number" name="no_general_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. Functional cots */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="no_cots" className="text-gray-600 capitalize text-sm">Number of functional cots<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfCots} ref={noOfCotsRef} onChange={ev => setNoOfCots(ev.target.value)} type="number" name="no_cots" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. Emergency Casulty Beds */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="no_emergency_beds" className="text-gray-600 capitalize text-sm">Number of Emergency Casulty Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfCasualtyBeds} ref={noOfCasualtyBedsRef} onChange={ev => setNoOfCasualtyBeds(ev.target.value)}  type="number" name="no_emergency_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. Intensive Care Unit Beds */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="no_icu_beds" className="text-gray-600 capitalize text-sm">Number of Intensive Care Unit (ICU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfICUBeds} ref={noOfICUBedsRef} onChange={ev => setNoOfICUBeds(ev.target.value)} type="number" name="no_icu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. High Dependency Unit HDU */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="number_of_hdu_beds" className="text-gray-600 capitalize text-sm">Number of High Dependency Unit (HDU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfHDUBeds} ref={noOfHDUBedsRef} onChange={ev => setNoOfHDUBeds(ev.target.value)} type="number" name="number_of_hdu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. of maternity beds */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="number_of_maternity_beds" className="text-gray-600 capitalize text-sm">Number of maternity beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfMaternityBeds} ref={noOfMaternityBedsRef} onChange={ev => setNoOfMaternityBeds(ev.target.value)} type="number" name="number_of_maternity_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. of isolation beds */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="number_of_isolation_beds" className="text-gray-600 capitalize text-sm">Number of isolation beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfIsolationBeds} ref={noOfIsolationBedsRef} onChange={ev => setNoOfIsolationBeds(ev.target.value)} type="number" name="number_of_isolation_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. of General Theatres */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="number_of_general_theatres" className="text-gray-600 capitalize text-sm">Number of General Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfGeneralTheaters} ref={noOfGeneralTheatersRef} onChange={ev => setNoOfGeneralTheaters(ev.target.value)} type="number" name="number_of_general_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* No. of Maternity Theatres */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="number_of_maternity_theatres" className="text-gray-600 capitalize text-sm">Number of Maternity Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_noOfMaternityTheaters} ref={noOfMaternityTheatersRef} onChange={ev => setNoOfMaternityTheaters(ev.target.value)} type="number" name="number_of_maternity_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* Facility Catchment Population */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="facility_catchment_population" className="text-gray-600 capitalize text-sm">Facility Catchment Population<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required value={_catchmentPopulation} ref={catchmentPopulationRef} onChange={ev => setCatchmentPopulation(ev.target.value)} type="number" name="facility_catchment_population" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* Is Reporting DHIS2 */}
                                                        <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                            <label htmlFor="reporting_in_dhis" className="text-gray-700 capitalize text-sm flex-grow">*Should this facility have reporting in DHIS2?  </label>
                                                            <span className="flex items-center gap-x-1">
                                                                <input type="radio" checked={_isDHISReporting} ref={isDHISReportingYesRef} onChange={ev => setIsDHISReporting(ev.target.value)} name="reporting_in_dhis" id="facility_reporting_yes"/>
                                                                <small className="text-gray-700">Yes</small>
                                                            </span>
                                                            <span className="flex items-center gap-x-1">
                                                                <input type="radio" checked={!_isDHISReporting}  ref={isDHISReportingNoRef} onChange={ev => setIsDHISReporting(ev.target.value)} name="reporting_in_dhis" id="facility_reporting_no"/>
                                                                <small className="text-gray-700">No</small>
                                                            </span>
                                                        </div>

                                                        {/* Facility Admissions */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="admission_status" className="text-gray-600 capitalize text-sm">Facility admissions<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <Select 
                                                                ref={facilityAdmissionRef}
                                                                options={facilityAdmissionOptions || []} 
                                                                required
                                                                placeholder="Select an admission status.."
                                                                onChange={
                                                                    () => console.log('changed')
                                                                }
                                                                name="admission_status" 
                                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                        </div>

                                                        {/* Is NHIF accredited */}
                                                        <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                            <label htmlFor="nhif_accreditation" className="text-gray-700 capitalize text-sm flex-grow"> *Does this facility have NHIF accreditation?   </label>
                                                            <span className="flex items-center gap-x-1">
                                                                <input type="radio" checked={_isNHIFAccredited} ref={isNHIFAccreditedYesRef} onChange={ev => setIsNHIFAccredited(ev.target.value)} name="nhif_accreditation" id="nhif_accredited_yes" />
                                                                <small className="text-gray-700">Yes</small>
                                                            </span>
                                                            <span className="flex items-center gap-x-1">
                                                                <input type="radio" checked={!_isNHIFAccredited} ref={isNHIFAccreditedNoRef} onChange={ev => setIsNHIFAccredited(ev.target.value)} name="nhif_accreditation" id="nhif_accredited_no" />
                                                                <small className="text-gray-700">No</small>
                                                            </span>
                                                        </div>

                                                        {/* Armed Forces Facilities */}

                                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                                            <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Armed Forces Facilities</h4>
                                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                                <input type="checkbox" checked={_isArmedForcesFct} ref={isArmedForcesFctRef} onChange={ev => setIsArmedForcesFct(ev.target.value)} name="is_classified" id="is_armed_forces" />
                                                                <label htmlFor="is_classified" className="text-gray-700 capitalize text-sm flex-grow"> Is this an Armed Force facility? </label>    
                                                            </div>
                                                        </div>

                                                        {/* Hours/Days of Operation */}

                                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                                            <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Hours/Days of Operation</h4>
                                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                                <input type="checkbox" checked={_is24Hrs} ref={is24HrsRef} onChange={ev => setIs24Hrs(ev.target.value)} name="open_whole_day" id="open_24hrs" />
                                                                <label htmlFor="open_whole_day" className="text-gray-700 capitalize text-sm flex-grow"> Open 24 hours</label>    
                                                            </div>

                                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                                <input type="checkbox" checked={_isLateNight} ref={isLateNightRef} onChange={ev => setIsLateNight(ev.target.value)} name="open_late_night" id="open_late_night" />
                                                                <label htmlFor="open_late_night" className="text-gray-700 capitalize text-sm flex-grow"> Open Late Night</label>    
                                                            </div>

                                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                                <input type="checkbox" checked={_isPublicHolidays} ref={isPublicHolidaysRef} onChange={ev => setIsPublciHolidays(ev.target.value)} name="open_public_holidays" id="open_public_holidays" />
                                                                <label htmlFor="open_public_holidays" className="text-gray-700 capitalize text-sm flex-grow"> Open on public holidays</label>    
                                                            </div>

                                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                                <input type="checkbox" checked={_isWeekends} ref={isWeekendsRef} onChange={ev => setIsWeekends(ev.target.value)} name="open_weekends" id="open_weekends" />
                                                                <label htmlFor="open_weekends" className="text-gray-700ds capitalize text-sm flex-grow"> Open during weekends</label>    
                                                            </div>

                                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                                <input type="checkbox" checked={_isNormalDay} ref={isNormalDayRef} onChange={ev => setIsNormal(ev.target.value)} name="open_normal_day" id="open_8_5" />
                                                                <label htmlFor="open_normal_day" className="text-gray-700 capitalize text-sm flex-grow"> Open from 8am to 5pm</label>    
                                                            </div>
                                                        </div>


                                                        {/* Location Details */}
                                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                                            <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Location Details</h4>
                                                            <div className="grid grid-cols-4 place-content-start gap-3 w-full">
                                                                    {/* County  */}
                                                                    <div className="col-start-1 col-span-1">
                                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                            <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">County<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                            <Select 
                                                                            options={countyOptions || []} 
                                                                            ref={countyRef}
                                                                            required
                                                                            placeholder="Select County"
                                                                            onChange={
                                                                                () => console.log('changed')
                                                                            }
                                                                            name="keph_level" 
                                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                                        </div>
                                                                    </div>

                                                                    {/* Sub-county */}
                                                                    <div className="col-start-2 col-span-1">
                                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                            <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">Sub-county<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                            <Select 
                                                                            options={subCountyOpt ?? subCountyOptions} 
                                                                            ref={subCountyRef}
                                                                            required
                                                                            placeholder="Select Sub County"
                                                                            onChange={
                                                                                () => console.log('changed')
                                                                            }
                                                                            name="keph_level" 
                                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                                        </div>
                                                                    </div>

                                                                    {/* Constituency */}
                                                                    <div className="col-start-3 col-span-1">
                                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                            <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">Constituency<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                            <Select 
                                                                            ref={constituencyRef}
                                                                            options={subCountyOpt ?? constituencyOptions} 
                                                                            required
                                                                            placeholder="Select Constituency"
                                                                            onChange={
                                                                                () => console.log('changed')
                                                                            }
                                                                            name="keph_level" 
                                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                                        </div>
                                                                    </div>

                                                                    {/* Ward */}
                                                                    <div className="col-start-4 col-span-1">
                                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                            <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">Ward<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                            <Select 
                                                                            ref={wardRef}
                                                                            options={wardOpt ?? wardOptions} 
                                                                            required
                                                                            placeholder="Select Ward"
                                                                            onChange={
                                                                                () => console.log('changed')
                                                                            }
                                                                            name="keph_level" 
                                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                                        </div>
                                                                    </div>

                                                                
                                                            </div>

                                                            {/* Nearest Town/Shopping Center */}
                                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                        <label htmlFor="nearest_town" className="text-gray-600 capitalize text-sm">Nearest Town/Shopping Center<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                        <input required type="text" name="nearest_town" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                                    </div>

                                                                    {/* Plot Number */}
                                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                        <label htmlFor="plot_number" className="text-gray-600 capitalize text-sm">Plot number<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                        <input required type="text" name="plot_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                                    </div>

                                                                    {/* Nearest landmark */}
                                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                        <label htmlFor="nearest_landmark" className="text-gray-600 capitalize text-sm">Nearest landmark<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                        <input required type="text" name="nearest_landmark" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                                    </div>

                                                                    {/* Location Description */}
                                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                        <label htmlFor="location_description" className="text-gray-600 capitalize text-sm">location description<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                        <input required type="text" name="location_description" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                                    </div>
                                                            </div>

                                                        {/* check file upload */}
                                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto">
                                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                <label htmlFor="checklist_file" className="text-gray-600 capitalize text-sm">checklist file upload<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                <input required type="file" name="checklist_file" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </>
                            </Tabs.Panel>
                            <Tabs.Panel value="services" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Services</span>
                                            
                                        </h3>
                                        <ul>
                                            {(facility_services && facility_services.length > 0) ? facility_services.map(service => (
                                                <li key={service.service_id} className="w-full grid grid-cols-3 gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div >
                                                        <p className="text-gray-800 text-base">{service.service_name}</p>
                                                        <small className="text-xs text-gray-500">{service.category_name || ''}</small>
                                                    </div>
                                                    <div className='justify-self-center'>
                                                        <p className="text-gray-800 text-base">
                                                            {service.average_rating || 0}/{service.number_of_ratings || 0}
                                                        </p>
                                                        <small className="text-xs text-gray-500">Rating</small>
                                                    </div>
                                                    <label className=" justify-self-end text-sm text-gray-600 flex gap-1 items-center">
                                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                        <span>Active</span>
                                                    </label>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                    <p>No services listed for this </p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="infrastructure" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left px-1 py-4">
                                    <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                        <span className="font-semibold">Infrastructure</span>
                                        {/* {user && user?.id ? <a href={"/facility/edit/"+id+"#infrastructure"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit infrastructure</a> : ""} */}
                                    </h3>
                                    <div className="bg-white w-full p-4 rounded flex flex-col">
                                        <ul>
                                            {(facility_infrastructure && facility_infrastructure.length > 0) ? facility_infrastructure.map(infra => (
                                                <li key={infra.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{infra.infrastructure_name}</p>
                                                        {/* <small className="text-xs text-gray-500">{infra.id || ''}</small> */}
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        {/* <CheckCircleIcon className="h-4 w-4 text-green-500" /> */}
                                                        <label className="text-lg text-gray-800 font-semibold">{infra.count || 0}</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                                                    <p>No other infrastructure data listed for this </p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="hr_staffing" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Human Resources</span>
                                            {/* {user && user?.id ? <a href={"/facility/edit/"+id+"#hr"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit HR</a> : ""} */}
                                        </h3>
                                        <ul>
                                            {(facility_specialists && facility_specialists.length > 0) ? facility_specialists.map(hr => (
                                                <li key={hr.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{hr.speciality_name}</p>
                                                        {/* <small className="text-xs text-gray-500">{hr.id || ''}</small> */}
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        {/* <CheckCircleIcon className="h-4 w-4 text-green-500" /> */}
                                                        <label className="text-lg text-gray-800">{hr.count || 0}</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                                                    <p>No HR data listed for this </p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="community_units" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Facility units</span>
                                            {/* {user && user?.id ? <a href={"/facility/edit/"+id+"#units"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit facility units</a> : ""} */}
                                        </h3>
                                        <ul>
                                            {(facility_units && facility_units.length > 0) ? facility_units.map(unit => (
                                                <li key={unit.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{unit.unit_name}</p>
                                                        <small className="text-xs text-gray-500">{unit.regulating_body_name || ''}</small>
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                        <label className="text-sm text-gray-600">Active</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                                                    <p>No units in this </p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                        </Tabs.Root>
                    </div>                   
                </div>
            </MainLayout>
            

            
        
        </>
    )
}

EditFacility.getInitialProps = async (ctx) => {

    const allOptions = []
	const options = [
		'facility_types',
		'facility_type_details',
		'owners',
		'owner_types',
		'keph',
		'facility_admission_status',
		'counties',
		'sub_counties',
		'constituencies',
		'wards',
		'job_titles',
		'contact_types',
		'facility_depts',
		'regulating_bodies',
		'regulation_status',
		'services',
		'contact_types',
		'infrastructure',
		'specialities',
        'facility_data'

	
	]


    if (ctx.query.q) {
        const query = ctx.query.q
        if (typeof window !== 'undefined' && query.length > 2) {
            window.location.href = `/facilities?q=${query}`
        } else {
            if (ctx.res) {
                ctx.res.writeHead(301, {
                    Location: '/facilities?q=' + query
                });
                ctx.res.end();
                return {};
            }
        }
    }
    return checkToken(ctx.req, ctx.res).then(async (t) => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {

            let token = t.token;
				let url = '';
				
				

				for(let i = 0; i < options.length; i++) {
					const option = options[i]
					switch(option) {
						case 'facility_types':
						url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;

								try{
								
									const _data = await fetch(url, {
										headers: {
											Authorization: 'Bearer ' + token,
											Accept: 'application/json',
										},
									})

									let results = (await _data.json()).results.map(({id, sub_division, name }) => sub_division !== null ? {value:id, label:sub_division} : {value:id, label:name}) ?? [{value: '', label: ''}]

									// console.log({results})
									allOptions.push({facility_types: results })
									
								}
								catch(err) {
									console.log(`Error fetching ${option}: `, err);
									allOptions.push({
										error: true,
										err: err,
										facility_types: [],
									});
								}
								break;
							case 'facility_type_details':
								url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types/?is_active=true&page_size=10000`;
										
								try{
								
									const _data = await fetch(url, {
										headers: {
											Authorization: 'Bearer ' + token,
											Accept: 'application/json',
										},
									})
		
									let _results  = (await _data.json()).results.map(({id, name}) => ({value:id, label:name}))

									allOptions.push({facility_type_details: _results })
									
									
								}
								catch(err) {
									console.log(`Error fetching ${option}: `, err);
									allOptions.push({
										error: true,
										err: err,
										facility_types: [],
									});
								}
								break;				
						case 'owners':
								url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;
		
							
								try{
		
									const _data = await fetch(url, {
										headers: {
											Authorization: 'Bearer ' + token,
											Accept: 'application/json',
										},
									})
		
								allOptions.push({owners: (await _data.json()).results.map(({id, name }) => ({value:id, label:name}))})
									
								}
								catch(err) {
									console.log(`Error fetching ${option}: `, err);
									allOptions.push({
										error: true,
										err: err,
										owners: [],
									});
								}
						
								break;
						case 'owner_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({owner_types: (await _data.json()).results.map(({id, name }) => ({value:id, label:name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									owner_types: [],
								})
							}

							break;
						case 'keph':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({keph: (await _data.json()).results.map(({id, name }) => ({value:id, label:name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									keph: [],
								})
							}

							break;
						case 'facility_admission_status':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({facility_admission_status: (await _data.json()).results.map(({id, name }) => ({value:id, label:name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_admission_status: [],
								})
							}
							break;

						case 'job_titles':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({job_titles: (await _data.json()).results.map(({id, name }) => ({value:id, label:name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_admission_status: [],
								})
							}
							break;

						case 'contact_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=id,name`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({contact_types: (await _data.json()).results.map(({id, name }) => ({value:id, label:name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_admission_status: [],
								})
							}
							break;


						case 'facility_depts':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name,regulatory_body,regulatory_body_name`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({facility_depts: (await _data.json()).results.map(({id, name, regulatory_body_name}) => ({value:id, label:name, reg_body_name: regulatory_body_name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_depts: [],
								})
							}
							break;

						case 'regulating_bodies':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({regulating_bodies: (await _data.json()).results.map(({id, name}) => ({value:id, label:name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									regulating_bodies: [],
								})
							}
							break;

						case 'regulation_status':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&page=1`;
	
						
							try{
	
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
	
								allOptions.push({regulation_status: (await _data.json()).results.map(({id, name}) => ({value:id, label:name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									regulation_status: [],
								})
							}
							break;

						case 'services':

							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&ordering=name`;

							try{
		
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})
	
								allOptions.push({service: (await _data.json()).results.map(({id, name, category, category_name}) => ({id, name, category, category_name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									service: [],
								})
							}
	
							break;

						case 'infrastructure':

							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&page=1`;

							try{
		
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								allOptions.push({infrastructure: (await _data.json()).results.map(({id, name, category_name}) => ({id, name, category_name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,	
									err: err,
									service: [],
								})
							}

							break;
						
						case 'specialities':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=2000&ordering=name`;

							try{
		
								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								allOptions.push({hr: (await _data.json()).results.map(({id, name, category_name}) => ({id, name, category_name}))})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,	
									err: err,
									service: [],
								})
							}


						break;
                    
                        case 'facility_data':
                            url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${ctx.query.id}`;

							try{
		
								const _data = await fetch(`/api/facility/get_facility/?path=facilities&id=${ctx.query.id}`) 
                           
                                // console.log({_data})

								allOptions.push({data: (await _data.json())})
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,	
									err: err,
									data: [],
								})
							}


                        break;

						default:
								let fields = ''
								let _obj = {}

								if(option === 'counties') fields = 'id,name&page_size=47'
								if(option === 'sub_counties') fields = 'id,name,county'
								if(option === 'wards') fields = 'id,name,sub_county,constituency'
								if(option === 'constituencies') fields = 'id,name,county'

								
								url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=${fields}`;
							
								
								try{
			
									const _data = await fetch(url, {
										headers: {
											Authorization: 'Bearer ' + token,
											Accept: 'application/json',
										},
									})

									_obj[option] = (await _data.json()).results.map(({id, name }) => ({value:id, label:name}))
			

								allOptions.push(_obj)
								// console.log({allOptions})
									
								}
								catch(err) {
									console.log(`Error fetching ${option}: `, err);
									allOptions.push({
										error: true,
										err: err,
										data: []
									});
								}
								break;

					}
				}



				return allOptions

            // let token = t.token
            // let url = process.env.NEXT_PUBLIC_API_URL + '/facilities/facilities/' + ctx.query.id + '/'
            // return fetch(url, {
            //     headers: {
            //         'Authorization': 'Bearer ' + token,
            //         'Accept': 'application/json'
            //     }
            // }).then(r => r.json())
            //     .then(json => {
            //         return {
            //             data: json
            //         }
            //     }).catch(err => {
            //         console.log('Error fetching facilities: ', err)
            //         return {
            //             error: true,
            //             err: err,
            //             data: [],
            //         }
            //     })
        }
    }).catch(err => {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/facilities'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
            }
        }, 1000);
    })
}

export default EditFacility