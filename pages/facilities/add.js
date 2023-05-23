// React imports
import React, { useState, useEffect, useRef, createContext } from 'react';
import { useFormik } from 'formik'

// Next imports
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Component imports
import MainLayout from '../../components/MainLayout';

import EditListWithCount from '../../components/EditListWithCount';
import EditListItem from '../../components/EditListItem';

// Controller imports
import { checkToken } from '../../controllers/auth/auth';

// MUI imports / vendor imports
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FacilitySideMenu from '../../components/FacilitySideMenu';
import Alert from '@mui/material/Alert';

// Heroicons imports
import {
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
	PlusIcon,
} from '@heroicons/react/solid';
import { XCircleIcon } from '@heroicons/react/outline'
import FacilityDeptRegulationFactory from '../../components/generateFacilityDeptRegulation'
import {
	FacilityContact,
	OfficerContactDetails
} from '../../components/FacilityContacts';

// Package imports
import Select from 'react-select';

import { 
	handleBasicDetailsSubmit,
    handleGeolocationSubmit,
    handleFacilityContactsSubmit,
    handleRegulationSubmit,
    handleServiceSubmit,
    handleInfrastructureSubmit,
	handleServiceUpdates,
    handleHrSubmit
} from '../../controllers/facility/facilityHandlers';

import { inputValidation } from '../../utils/formValidation';

export const FacilityDeptContext = createContext(null)
export const FacilityContactsContext = createContext(null)

// const turf = require('@turf/turf');
const WardMap = dynamic(
	() => import('../../components/WardGISMap'), // replace '@components/map' with your component's location
	{
		loading: () => <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
		ssr: false // This line is important. It's what prevents server-side render
	} 
)

const Map = React.memo(WardMap)

function AddFacility(props) {

	// const alert = useAlert();

	const formik = useFormik({

		initialValues: {
		  collection_date: '',
		  latitude: '',
		  longitude: '',
		},
   
		onSubmit: ({collection_date, latitude, longitude}) => {
   
			handleGeolocationSubmit([{
				name:'collection_date',
				value: collection_date
			},
			{
				name:'longitude',
				value: longitude
			},
			{
				name :'latitude',
				value: latitude
			}
			
		], [setFormId, setLongitude, setLatitude, facilityId]) 
		
		},
   
	  });


	// Form drop down options
	const facilityOptions = (() => {
		const f_types = [
			'STAND ALONE',
			'DISPENSARY',
			'MEDICAL CLINIC',
			'NURSING HOME',
			'HOSPITALS',
			'HEALTH CENTRE',
			'MEDICAL CENTRE'
		]

		const all_ftypes = []


		for (let type in f_types) all_ftypes.push(props[0]?.facility_types.find(({ sub_division }) => sub_division === f_types[type]))

		return [{
			label: all_ftypes[0].sub_division,
			value: all_ftypes[0].parent
		},
		{
			label: all_ftypes[1].sub_division,
			value: all_ftypes[1].parent
		},
		{
			label: all_ftypes[2].sub_division,
			value: all_ftypes[2].parent
		},
		{
			label: all_ftypes[3].sub_division,
			value: all_ftypes[3].parent
		},
		{
			label: all_ftypes[4].sub_division,
			value: all_ftypes[4].parent
		},
		{
			label: all_ftypes[5].sub_division,
			value: all_ftypes[5].parent
		}

		]

	})()


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

	 const serviceOptions = ((_services) => {
		
		const _serviceOptions = []
		let _values = []
		let _subCtgs = []

		if(_services.length > 0){
			_services.forEach(({category_name:ctg}) => {
				let allOccurences = _services.filter(({category_name}) => category_name === ctg)
				
				allOccurences.forEach(({id, name}) => {
					_subCtgs.push(name)
					_values.push(id)
				})
				
				if(_serviceOptions.map(({name}) => name).indexOf(ctg) === -1){
					_serviceOptions.push({
						name: ctg,
						subCategories:_subCtgs,
						value:_values
					})
				}
				
				_values = []
				_subCtgs = []
	
			})
		}
		
		return _serviceOptions
	 })(props['15'].service ?? [])

	 const infrastructureOption = ((_infrastructure) => {
		
		const _infrastructureOptions = []
		let _values = []
		let _subCtgs = []

		if(_infrastructure.length > 0){
			_infrastructure.forEach(({category_name:ctg}) => {
				let allOccurences = _infrastructure.filter(({category_name}) => category_name === ctg)
				
				allOccurences.forEach(({id, name}) => { 
					_subCtgs.push(name)
					_values.push(id) 
				})
				
				if(_infrastructureOptions.map(({name}) => name).indexOf(ctg) === -1){
					_infrastructureOptions.push({
						name: ctg,
						subCategories:_subCtgs,
						value:_values
					})
				}
				
				_values = []
				_subCtgs = []
	
			})
		}
		
		return _infrastructureOptions
	 })(props['16'].infrastructure ?? [])

	 const hrOptions = ((_hr) => {
		
		const _hrOptions = []
		let _values = []
		let _subCtgs = []

		if(_hr.length > 0){
			_hr.forEach(({category_name:ctg}) => {
				let allOccurences = _hr.filter(({category_name}) => category_name === ctg)
				
				allOccurences.forEach(({id, name}) => {
					_subCtgs.push(name)
					_values.push(id)
				})
				
				if(_hrOptions.map(({name}) => name).indexOf(ctg) === -1){
					_hrOptions.push({
						name: ctg,
						subCategories:_subCtgs,
						value:_values
					})
				}
				
				_values = []
				_subCtgs = []
	
			})
		}
		
		return _hrOptions
	 })(props['17'].hr ?? [])


	//  Refs
	const basicDetailsRef = useRef(null)
	const kephLvlRef = useRef(null)
	

    const steps = [
        'Basic Details',
        'Geolocation',
        'Facility Contacts',
        'Regulation',
        'Services',
        'Infrastructure',
        'Human resources'
    ];

    const [formId, setFormId] = useState(0) 

    const facilityRegulatoryBodyRef = useRef(null)
	const checklistFileRef = useRef(null)

	// Hours of Day Open Refs
	const open24HrsRef = useRef(null)
	const openLateNightRef = useRef(null)
	const openNormalDayRef = useRef(null)
	const openPublicHolidaysRef = useRef(null)
	const openWeekendsRef = useRef(null)
	const _regBodyRef = useRef(null)

	//Form Refs
	const facilityRegulationFormRef = useRef(null)
	const facilityContactsFormRef = useRef(null)


	const noCotsRef = useRef('')
	const totalBedsRef = useRef('')
	const noEmergencyBedsRef = useRef('')
	const noIsolationBedsRef = useRef('')
	const noGeneralTheatersRef = useRef('')
	const noMartenityBedsRef = useRef('')
	const noHDUBedsRef = useRef('')
	const noICUBedsRef = useRef('')
	const noMartenityTheatersRef = useRef('')
	const noInpatientBedsRef = useRef('')
	const facilityPopulationRef = useRef('')



    // Services State 
	
    const setServices = useState([])[1]
	const [facilityOption, setFacilityOption] = useState('')
	const [facilityOfficialName, setFacilityOfficialName] = useState('')

	const [ownerTypeOption, setOwnerTypeOption] = useState('')
	const [latitude, setLatitude] = useState('')
	const [longitude, setLongitude] = useState('')
	const setCounty = useState('')[1]
	const [facilityId, setFacilityId] = useState('')
	const [facilityCoordinates, setFacilityCoordinates] = useState([])
	

	const [geoJSON, setGeoJSON] = useState(null)
    const [center, setCenter] = useState(null)
    const [wardName, setWardName] = useState('')
	const [facilityTypeDetail, setFacilityTypeDetail] = useState('')
	

	// Drop down select options data
	const [subCountyOpt, setSubCountyOpt] = useState('')
	const [wardOpt, setWardNameOpt] = useState('')
	const [checklistFile, setChecklistFile] = useState(null)
	const [licenseFile, setLicenseFile] = useState(null)
	const [coordinatesError] = useState(false)


	const [khisSynched, setKhisSynched] = useState(false);
    const [facilityFeedBack, setFacilityFeedBack] = useState([])
    const [pathId, setPathId] = useState('') 
    const [allFctsSelected, setAllFctsSelected] = useState(false);
    const [title, setTitle] = useState('');
	const [is24hrsOpen, setIs24hrsOpen] = useState(false)
	const [isRegBodyChange, setIsRegBodyChange] = useState(false)
	const [facilityDepts, setFacilityDepts] = useState([])

	const handleDeleteField = (index) => {
		const values = facilityDepts;
		values.splice(index, 1);
		setFacilityDepts((draft) => ([ ...values]))
	};

	const [_, setEmergencyBeds] = useState(0)
	const [icuBeds, setICUBeds] = useState(0)
	const [hduBeds, setHDUBeds] = useState(0)
	const [isolationBeds, setIsolationBeds] = useState(0)
	const [martenityBeds, setMartenityBeds] = useState(0)
	const [inpatientBeds, setInpatientBeds] = useState(0)

	const [facilityContacts, setFacilityContacts] = useState([
		(() => (
			<FacilityContact
				contactTypeOptions={contactTypeOptions}
				fieldNames={['contact_type', 'contact']}
				setFacilityContacts={() => null}
				contacts={[null, null, null]}
				index={0}
			/>
		))()
	])

	const [officerContactDetails, setOfficerContactDetails] = useState([
		(() => (
			<OfficerContactDetails
				contactTypeOptions={contactTypeOptions}
				fieldNames={['officer_details_contact_type', 'officer_details_contact']}
				contacts={[null, null, null]}
				setFacilityContacts={() => null}
				index={0}
			/>
		))()
	])




	const filters = []
	
	
    useEffect(() => {

		
        const formIdState = window.sessionStorage.getItem('formId');

        if(formIdState == undefined || formIdState == null || formIdState == '') {
            window.sessionStorage.setItem('formId', 0); //0 set form to basic details
        }
        
        setFormId(window.sessionStorage.getItem('formId'));

        // Check if dropdown and input exist. If remove from DOM

        const contactDropDowns = document.getElementsByName('dropdown_contact_types')
        const contactInputs = document.getElementsByName('contact_details_others')

        const infrastructureDropDowns = document.getElementsByName('dropdown_infrastructure_name')
        const infrastructureDropDownsYesNo = document.getElementsByName('dropdown_infrastructure_types')

        if(contactDropDowns.length > 0) contactDropDowns.forEach(dropDown => dropDown.remove())
        if(contactInputs.length > 0) contactInputs.forEach(input => input.remove())
     
        if(infrastructureDropDowns.length > 0) infrastructureDropDowns.forEach(dropDown => dropDown.remove())
        if(infrastructureDropDownsYesNo.length > 0) infrastructureDropDownsYesNo.forEach(input => input.remove())
        

        return () => {
			
            if(window.sessionStorage.getItem('formId') == '7'){
                window.sessionStorage.setItem('formId', 0)
            }

			
        }
    }, [facilityOfficialName, facilityOption, formId, geoJSON])


	// useEffect(() => {
	// 	console.log({longitude, latitude})
	// }, [longitude, latitude])
      

	if(facilityTypeDetail !== '' && kephLvlRef.current){
		switch(facilityTypeDetail){
			case 'Comprehensive Teaching & Tertiary Referral Hospital':
				
				if(kephLvlRef.current) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 6')[0]
				
				break;
			case 'Specialized & Tertiary Referral hospitals':
				
				if(kephLvlRef.current) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 6')[0]
				
				break;
			case 'Secondary care hospitals':
			
				if(kephLvlRef.current) kephLvlRef.current.state.value =   kephOptions.filter(({label}) => label === 'Level 5')[0]
					
				break;
			case 'Primary care hospitals':
				
				if(kephLvlRef.current) kephLvlRef.current.state.value =  kephOptions.filter(({label}) => label === 'Level 4')[0]
				break;
		}
	}

	// useEffect(() => {
	// 	const isLatLngInRegion = () => {
			
	// 		if(longitude.length >= 9 && latitude.length >= 9){ 
	// 			let point = turf.point([longitude, latitude]);
				
	// 			let polygon = turf.polygon(facilityCoordinates);
				
	// 			let found = turf.booleanPointInPolygon(point, polygon);
	// 			if(!found){
	// 				setCoordinatesError(true)
	// 			}else{
	// 				setCoordinatesError(false)
	// 			}
	// 		}
	// 	}

	// 	isLatLngInRegion()

		
		
	// } , [longitude, latitude])

	// Validate Hours/Days of Operation

	useEffect(() => {
		if(open24HrsRef.current && is24hrsOpen){
			open24HrsRef.current.checked = true
		}  
		if(open24HrsRef.current && !is24hrsOpen) {
			open24HrsRef.current.checked = false
		}

		if(openLateNightRef.current && is24hrsOpen){
			openLateNightRef.current.checked = true
		}
		if(openLateNightRef.current && !is24hrsOpen){
			openLateNightRef.current.checked = false
		}


		if(openNormalDayRef.current && is24hrsOpen){
			openNormalDayRef.current.checked = true
		}
		if(openNormalDayRef.current && !is24hrsOpen){
			openNormalDayRef.current.checked = false
		}

		if(openPublicHolidaysRef.current && is24hrsOpen){
			openPublicHolidaysRef.current.checked = true
		}
		if(openPublicHolidaysRef.current && !is24hrsOpen){
			openPublicHolidaysRef.current.checked = false
		}

		if(openWeekendsRef.current && is24hrsOpen){
			openWeekendsRef.current.checked = true
		}
		if(openWeekendsRef.current && !is24hrsOpen){
			openWeekendsRef.current.checked = false
		}
	}, [is24hrsOpen])


	// let totalBeds = 0

	
	useEffect(() => {
		
		totalBedsRef.current?.value = inpatientBeds + icuBeds + hduBeds + isolationBeds + martenityBeds;
	}, [inpatientBeds, icuBeds, hduBeds, isolationBeds, martenityBeds])



  return (
	<>
		 <Head>
                <title>KMHFL - Add Facility</title>
                <link rel="icon" href="/favicon.ico" />
        </Head>

		<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
			<div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
						<div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
							<div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
								<div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
									<Link className="text-green-800" href="/">Home</Link> {'/'}
									<Link className="text-green-800" href="/facilities/">Facilities</Link> {'/'}
									<span className="text-gray-500">Add Facility</span>
								</div>
							</div>

							<div className={"col-span-5 flex justify-between w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
								<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
										{'New Facility'}
								</h2>
							</div>
					
						</div>


						 {/* Facility Side Menu Filters */}
						 <div className="md:col-span-1 md:mt-3">
                            <FacilitySideMenu 
                                filters={filters}
                                states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
                                stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]}/>
                		</div>

						{/* Stepper and Form */}
						<div className='col-span-4 md:col-start-2 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none'>
							{/* Stepper Header */}
							<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
								<Box sx={{ width: '100%' }}>
									<Stepper activeStep={parseInt(formId)} alternativeLabel>
										{steps.map((label) => (
											<Step key={label}>
												<StepLabel>
													
													{
														label === "Basic Details" ?
														<span className='cursor-pointer hover:text-indigo-600' onClick={
															() => {
																setFormId(0)
																window.sessionStorage.setItem('formId', 0)
															}
														} >{label}</span>
														:
														label
													}
													
													</StepLabel>
											</Step>
										))}
									</Stepper>
								</Box>
							</div>

							{/* Stepper Body */}
							<div className='flex flex-col justify-center items-start px-1 md:px-4 w-full '>
								<div
									className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50'
									style={{ minHeight: '250px' }}>
									{(() => {
										switch (parseInt(formId)) {
											case 0:

												
												// Basic Details form
												return (
													<>
														<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
															Facility Basic Details
														</h4>
														<form
															encType="multipart/form-data"
															ref={basicDetailsRef}
															className='flex flex-col w-full items-start justify-start gap-3'
															onSubmit={ev => {
																//  check if form validation works

																if(
																	noCotsRef.current?.textContent == '' &&
																	noEmergencyBedsRef.current?.textContent == '' &&
																	noInpatientBedsRef.current?.textContent == '' &&
																	noICUBedsRef.current?.textContent == '' &&
																	noHDUBedsRef.current?.textContent == '' &&
																	noMartenityBedsRef.current?.textContent == '' &&
																	noIsolationBedsRef.current?.textContent == '' &&
																	noGeneralTheatersRef.current?.textContent == '' &&
																	noMartenityBedsRef.current?.textContent == '' &&
																	facilityPopulationRef.current?.textContent == '' 

																){
																	handleBasicDetailsSubmit(ev, [setFacilityId, setGeoJSON, setCenter, setWardName, setFormId, setFacilityCoordinates, basicDetailsRef], 'POST', checklistFile)
																}
																else
																{
																	ev.preventDefault()
																	return
																}
															}}>

															{/* Facility Official Name */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='official_name'
																	className='text-gray-600 capitalize text-sm'>
																	Facility Official Name
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='text'
																	onChange={e => setFacilityOfficialName(e.target.value) }
																	name='official_name'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>
															{/* Facility Unique Name  */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='name'
																	className='text-gray-600 capitalize text-sm'>
																	Facility Unique Name
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='text'
																	value={facilityOfficialName ?? ''}
																	onChange={() => {}}
																	name='name'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>
															{/* Facility Type */}
															
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_type'
																	className='text-gray-600 capitalize text-sm'>
																	Facility Type{' '}
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																
																<Select
																	options={facilityOptions || []}
																	required
																	placeholder='Select a facility type...'
																	onChange={(e) => setFacilityOption(e.label)}
																	name='facility_type'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>
															
															{/* Facility Type Details */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
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
																	options={
																		(() => {
																			
																			switch(facilityOption){
																				case 'STAND ALONE':
			
																					if(kephLvlRef.current) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]

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
																					if(kephLvlRef.current) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
																					return  facilityTypeOptions.filter(({label}) => label == 'DISPENSARY') || []
																					

																				case 'MEDICAL CLINIC':
																					if(kephLvlRef.current) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
																					return facilityTypeOptions.filter(({label}) => label == 'Medical Clinic') || []																				
																					
																				case 'NURSING HOME':
																					if(kephLvlRef.current) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
																					
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
																					if(kephLvlRef.current) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 3')[0]
																					return [
																						facilityTypeOptions.filter(({label}) => label == 'Basic Health Centre')[0] || {},
																						facilityTypeOptions.filter(({label}) => label == 'Comprehensive Health Centre')[0] || {}
																						]

																				case 'MEDICAL CENTRE':
																					if(kephLvlRef.current) console.log(kephLvlRef.current); kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 3')[0]

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
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='operation_status'
																	className='text-gray-600 capitalize text-sm'>
																	Operation Status{' '}
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
																	options={[
																		{
																			value: '190f470f-9678-47c3-a771-de7ceebfc53c',
																			label: 'Non-Operational',
																		},
																		{
																			value: 'ae75777e-5ce3-4ac9-a17e-63823c34b55e',
																			label: 'Operational',
																		},
																	]}
																	required
																	placeholder='Select an operation status...'
																	name='operation_status'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Date Established */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='date_established'
																	className='text-gray-600 capitalize text-sm'>
																	Date Established
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='date'
																	name='date_established'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* Is Facility accredited */}
															<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<label
																	htmlFor='accredited_lab_iso_15189'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	*Is the facility accredited Lab ISO 15189?{' '}
																</label>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={true}
																		defaultChecked={true}
																		name='accredited_lab_iso_15189'
																		id='open_whole_day_yes'
																		onChange={(ev) => {}}
																	/>
																	<small className='text-gray-700'>Yes</small>
																</span>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={false}
																		defaultChecked={false}
																		name='accredited_lab_iso_15189'
																		id='open_whole_day_no'
																		onChange={(ev) => {}}
																	/>
																	<small className='text-gray-700'>No</small>
																</span>
															</div>

															{/* Owner Category */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='owner_type'
																	className='text-gray-600 capitalize text-sm'>
																	Owner Category
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
																	options={ownerTypeOptions || []}
																	required
																	placeholder='Select owner..'
																	name='owner_type'
																	onChange={(e) => setOwnerTypeOption(e.label)}
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Owner Details */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='owner'
																	className='text-gray-600 capitalize text-sm'>
																	Owner Details
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
																	options={ (() => {
																	
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
																					ownerOptions.filter(({label}) => label == 'Kenya Police Service')[0] || {},
																					ownerOptions.filter(({label}) => label == 'National Youth Service')[0] || {},
																					ownerOptions.filter(({label}) => label == 'Prisons')[0] || {}

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
																	})() ?? ownerTypeOptions }
																	required
																	placeholder='Select an owner..'
																	name='owner'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* KEPH Level */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='keph_level'
																	className='text-gray-600 capitalize text-sm'>
																	KEPH Level
																</label>
																<Select
																	ref={kephLvlRef}
																	options={kephOptions ?? []}
																	isOptionDisabled={(option) => true}
																	placeholder='Select a KEPH Level..'
																	name='keph_level'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Total Functional In-patient Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Total Functional In-patient Beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_beds'
																	ref={totalBedsRef}
																	readOnly
																	
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																
																
															</div>


															{/* No of General In-patient Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_inpatient_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of General In-patient Beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_inpatient_beds'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noInpatientBedsRef?.current?.textContent = 'Number of General In-patient Beds must be at least 0'
																		}
																		else{
																			setInpatientBeds(e.target.value.match(/^[0-9]+$/) !== null ? Number(e.target.value) : 0);
																			noInpatientBedsRef?.current?.textContent = ''
																		}
																	}}
																	
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noInpatientBedsRef} className='text-red-500 mt-1'></label>
																
																
															</div>

															{/* No. Functional cots */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_cots'
																	className='text-gray-600 capitalize text-sm'>
																	Number of Functional Cots
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='no_cots'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noCotsRef?.current?.textContent = 'Number of Functional cots must be at least 0'
																		}
																		else{
																			noCotsRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noCotsRef} className='text-red-500 mt-1'></label>
															</div>

															{/* No. Emergency Casulty Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_emergency_casualty_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of Emergency Casulty Beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_emergency_casualty_beds'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noEmergencyBedsRef?.current?.textContent = 'Number of Emergency Casulty Beds must be at least 0'
																		}
																		else{
																			setEmergencyBeds(e.target.value.match(/^[0-9]+$/) !== null ? Number(e.target.value) : 0);
																			noEmergencyBedsRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noEmergencyBedsRef} className='text-red-500 mt-1'></label>

															</div>


															{/* No. Intensive Care Unit Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_icu_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of Intensive Care Unit (ICU) Beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_icu_beds'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noICUBedsRef?.current?.textContent = 'Number of Intensive Care Unit Beds must be at least 0'
																		}
																		else{
																			setICUBeds(e.target.value.match(/^[0-9]+$/) !== null ? Number(e.target.value) : 0)  
																			noICUBedsRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noICUBedsRef} className='text-red-500 mt-1'></label>

															</div>


															{/* No. High Dependency Unit HDU */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_hdu_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of High Dependency Unit (HDU) Beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_hdu_beds'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noHDUBedsRef?.current?.textContent = 'Number of High Dependency Unit Beds must be at least 0'
																		}
																		else{
																			setHDUBeds(e.target.value.match(/^[0-9]+$/) !== null ? Number(e.target.value) : 0);
																			noHDUBedsRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noHDUBedsRef} className='text-red-500 mt-1'></label>

															</div>

															{/* No. of maternity beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_maternity_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of Maternity Beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_maternity_beds'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noMartenityBedsRef?.current?.textContent = 'Number of Maternity Beds must be at least 0'
																		}
																		else{
																			setMartenityBeds(e.target.value.match(/^[0-9]+$/) !== null ?  Number(e.target.value) : 0)
																			noMartenityBedsRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noMartenityBedsRef} className='text-red-500 mt-1'></label>

															</div>

															{/* No. of Isolation Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_isolation_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of Isolation Beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_isolation_beds'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noIsolationBedsRef?.current?.textContent = 'Number of Isolation Beds must be at least 0'
																		}
																		else{
																			setIsolationBeds(e.target.value.match(/^[0-9]+$/) !== null ? Number(e.target.value) : 0)
																			noIsolationBedsRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noIsolationBedsRef} className='text-red-500 mt-1'></label>

															</div>

															{/* No. of General Theatres */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_general_theatres'
																	className='text-gray-600 capitalize text-sm'>
																	Number of General Theatres
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_general_theatres'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noGeneralTheatersRef?.current?.textContent = 'Number of General Theatres must be at least 0'
																		}
																		else{
																			noGeneralTheatersRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noGeneralTheatersRef} className='text-red-500 mt-1'></label>

															</div>

															{/* No. of Maternity Theatres */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='number_of_maternity_theatres'
																	className='text-gray-600 capitalize text-sm'>
																	Number of Maternity Theatres
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	min={0}
																	name='number_of_maternity_theatres'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			noMartenityTheatersRef?.current?.textContent = 'Number of Maternity Theatres must be at least 0'
																		}
																		else{
																			noMartenityTheatersRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={noMartenityTheatersRef} className='text-red-500 mt-1'></label>

															</div>

															{/* Facility Catchment Population */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_catchment_population'
																	className='text-gray-600 capitalize text-sm'>
																	Facility Catchment Population
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		
																	</span>
																</label>
																<input
																	
																	type='number'
																	min={0}
																	name='facility_catchment_population'
																	onChange={e => {
																		if(inputValidation(e.target.value, /^-\d+$/)){
																			facilityPopulationRef?.current?.textContent = 'Facility Catchment Population must be at least 0'
																		}
																		else{
																			facilityPopulationRef?.current?.textContent = ''
																		}
																	}}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
																<label ref={facilityPopulationRef} className='text-red-500 mt-1'></label>

															</div>

															{/* Is Reporting DHIS2 */}
															<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<label
																	htmlFor='reporting_in_dhis'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	*Should this facility have reporting in DHIS2?{' '}
																</label>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={true}
																		defaultChecked={true}
																		name='reporting_in_dhis'
																		id='reporting_in_dhis_yes'
																		
																	/>
																	<small className='text-gray-700'>Yes</small>
																</span>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={false}
																		defaultChecked={false}
																		name='reporting_in_dhis'
																		id='reporting_in_dhis_no'
																		
																	/>
																	<small className='text-gray-700'>No</small>
																</span>
															</div>

															{/* Facility Admissions */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='admission_status'
																	className='text-gray-600 capitalize text-sm'>
																	Facility admissions
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
																	options={facilityAdmissionOptions || []}
																	required
																	placeholder='Select an admission status..'
																	name='admission_status'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Is NHIF accredited */}
															<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<label
																	htmlFor='nhif_accreditation'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	{' '}
																	*Does this facility have NHIF accreditation?{' '}
																</label>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={true}
																		defaultChecked={true}
																		name='nhif_accreditation'
																		id='nhif_accreditation_yes'
																	
																	/>
																	<small className='text-gray-700'>Yes</small>
																</span>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={false}
																		defaultChecked={false}
																		name='nhif_accreditation'
																		id='nhif_accreditation_no'
																	
																	/>
																	<small className='text-gray-700'>No</small>
																</span>
															</div>

															{/* Armed Forces Facilities */}

															<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
																<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																	Armed Forces Facilities
																</h4>
																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'
																		defaultValue={true}
																		name='is_classified'
																		id='is_armed_forces'

																	/>
																	<label
																		htmlFor='is_classified'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Is this an Armed Force facility?{' '}
																	</label>
																</div>
															</div>

															{/* Hours/Days of Operation */}

															<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
																<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																	Hours/Days of Operation
																</h4>
																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'	
																		ref={open24HrsRef}
																		name='open_whole_day'
																		id='open_24hrs'
																		defaultValue={true}
																		onChange={() => {setIs24hrsOpen(!is24hrsOpen)}}
																		
																		
																	/>
																	<label
																		htmlFor='open_24hrs'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Open 24 hours
																	</label>
																</div>

																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'
																		ref={openLateNightRef}		
																		name='open_late_night'
																		id='open_late_night'
																		defaultValue={true}
																		
																		
																	/>
																	<label
																		htmlFor='open_late_night'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Open Late Night
																	</label>
																</div>

																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'
																		ref={openPublicHolidaysRef}
																		name='open_public_holidays'
																		id='open_public_holidays'
																		defaultValue={true}
																		
																		
																	/>
																	<label
																		htmlFor='open_public_holidays'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Open on public holidays
																	</label>
																</div>

																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'
																		ref={openWeekendsRef}	
																		name='open_weekends'
																		id='open_weekends'
																		defaultValue={true}
																	
																	/>
																	<label
																		htmlFor='open_weekends'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Open during weekends
																	</label>
																</div>

																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'	
																		ref={openNormalDayRef}
																		name='open_normal_day'
																		id='open_8_5'
																		defaultValue={true}
																		
																	/>
																	<label
																		htmlFor='open_normal_day'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Open from 8am to 5pm
																	</label>
																</div>
															</div>

															{/* Location Details */}
															<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
																<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																	Location Details
																</h4>
																<div className='grid grid-cols-4 place-content-start gap-3 w-full'>
																	{/* County  */}
																	<div className='col-start-1 col-span-1'>
																		<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																			<label
																				htmlFor='county_id'
																				className='text-gray-600 capitalize text-sm'>
																				County
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={countyOptions || []}
																				required
																				placeholder='Select County'
																				onChange={async (ev) => {
																					if( ev.value.length > 0){

																						setCounty(String(ev.label).toLocaleUpperCase())

																						try{
																							const resp = await fetch(`/api/filters/subcounty/?county=${ev.value}${"&fields=id,name,county&page_size=30"}`)

																							setSubCountyOpt((await resp.json()).results.map(({id, name}) => ({value:id, label:name})) ?? [])

																							
																						}
																						catch(e){
																							console.error('Unable to fetch sub_county options')
																							setSubCountyOpt(null)
																						}
																					}else{
																						return setSubCountyOpt(null)
																					}
																				}}
																				name='county_id'
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>

																	{/* Sub-county */}
																	<div className='col-start-2 col-span-1'>
																		<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																			<label
																				htmlFor='sub_county_id'
																				className='text-gray-600 capitalize text-sm'>
																				Sub-county
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={subCountyOpt ?? subCountyOptions}
																				required
																				placeholder='Select Sub County'
																				name='sub_county_id'
																				
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>

																	{/* Constituency */}
																	<div className='col-start-3 col-span-1'>
																		<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																			<label
																				htmlFor='constituency_id'
																				className='text-gray-600 capitalize text-sm'>
																				Constituency
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={subCountyOpt ?? constituencyOptions}
																				required
																				placeholder='Select Constituency'
																				onChange={async (ev) => {
																					if( ev.value.length > 0){
																						try{
																							const resp = await fetch(`/api/filters/ward/?sub_county=${ev.value}${"&fields=id,name,sub_county,constituency&page_size=30"}`)

																							setWardNameOpt((await resp.json()).results.map(({id, name}) => ({value:id, label:name})) ?? [])

																						}
																						catch(e){
																							console.error('Unable to fetch sub_county options')
																							setWardNameOpt(null)
																						}
																					}else{
																						return setWardNameOpt(null)
																					}
																				}}
																				name='constituency_id'
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>

																	{/* Ward */}
																	<div className='col-start-4 col-span-1'>
																		<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																			<label
																				htmlFor='ward'
																				className='text-gray-600 capitalize text-sm'>
																				Ward
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={wardOpt ?? wardOptions}
																				required
																				placeholder='Select Ward'
		
																				name='ward'
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>
																</div>

																{/* Nearest Town/Shopping Centre */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='town_name'
																		className='text-gray-600 capitalize text-sm'>
																		Nearest Town/Shopping Centre
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			
																		</span>
																	</label>
																	<input
																		
																		type='text'
																		name='town_name'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/* Plot Number */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='plot_number'
																		className='text-gray-600 capitalize text-sm'>
																		Plot number
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			
																		</span>
																	</label>
																	<input
																		
																		type='text'
																		name='plot_number'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/* Nearest landmark */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='nearest_landmark'
																		className='text-gray-600 capitalize text-sm'>
																		Nearest landmark
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			
																		</span>
																	</label>
																	<input
																		
																		type='text'
																		name='nearest_landmark'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/* Location Description */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='location_desc'
																		className='text-gray-600 capitalize text-sm'>
																		location description
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			
																		</span>
																	</label>
																	<input
																		
																		type='text'
																		name='location_desc'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
															</div>

															{/* check file upload */}
															<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='facility_checklist_document'
																		className='text-gray-600 capitalize text-sm'>
																		checklist file upload
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>
																	</label>
																	
																	<input
																		required
																		ref={checklistFileRef}
																		type='file'
																		onChange={(e)=>{
																			setChecklistFile(e.target.files[0])
																		}}
																		name='facility_checklist_document'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
															</div>

															{/* Cancel & Geolocation */}
															<div className='flex justify-between items-center w-full'>
																<button className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																	<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																	<span className='text-medium font-semibold text-black '>
																		Cancel
																	</span>
																</button>
																<button
																	type='submit'
																	className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																	<span className='text-medium font-semibold text-white'>
																		Geolocation
																	</span>
																	<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
																</button>
															</div>
														</form>
													</>
												);
											case 1:
											// Geolocation Form

											const handleGeolocationPrevious = (event) => {
												event.preventDefault();
												window.sessionStorage.setItem('formId', 0);

												setFormId(window.sessionStorage.getItem('formId'));
											};

											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														Geolocation Details
													</h4>

													{/*ev => handleGeolocationSubmit(ev, [setFormId, facilityId])*/}
													
													{/* handleGeolocationSubmit([{
														name:'collection_date',
														value: collection_date
													},
													{
														name:'longitude',
														value: longitude
													},
													{
														name:'latitude',
														value: latitude
													}
													
												], [setFormId, facilityId]) */}

													{/* {
														 collection_date:'',
														 longitude:'',
														 latitude:''
														} */}

													
													<form
														name='geolocation_form'
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={formik.handleSubmit}
														>
														{/* Collection Date */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='collection_date'
																className='text-gray-600 capitalize text-sm'>
																Collection date:
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='date'
																name='collection_date'
																onChange={formik.handleChange}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Lon/Lat */}
														<div className='grid grid-cols-2 gap-4 place-content-start w-full'>
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-1'>
																<label
																	htmlFor='longitude'
																	className='text-gray-600 capitalize text-sm'>
																	Longitude
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='decimal'
																	name='longitude'
																	onChange={formik.handleChange}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-2'>
																<label
																	htmlFor='latitude'
																	className='text-gray-600 capitalize text-sm'>
																	Latitude
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='decimal'
																	name='latitude'
																	onChange={formik.handleChange}
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>
														<>{coordinatesError && <Alert severity="error" sx={{width:'100%'}}> Please enter the right coordinates</Alert>}</>
														</div>

														{/* Ward Geo Map */}
														<div className='w-full h-auto'>																		
															<div className='w-full bg-gray-200  rounded flex flex-col items-start justify-center text-left relative'>
																{
																	 geoJSON &&

																	<Map markerCoordinates={[latitude.length < 4 ? '0.000000' : latitude, longitude.length < 4 ? '0.000000' : longitude]} geoJSON={geoJSON} ward={wardName} center={center} />
															
																}	
																</div>
														</div>

														{/* Next/Previous Form  */}
														<div className='flex justify-between items-center w-full'>
															<button
																onClick={handleGeolocationPrevious}
																className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	Basic Details
																</span>
															</button>
															<button
																type='submit'
																className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>
																	Facility Contacts
																</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
															</button>
														</div>
													</form>
												
												</>
											);
											case 2:
												// Facility Contacts Form

												const handleFacilityContactsPrevious = (event) => {
													event.preventDefault();
													window.sessionStorage.setItem('formId', 1);

													setFormId(window.sessionStorage.getItem('formId'));
												};

												
												return (
													<>
														<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
															Facility Contact
														</h4>
														<form
															ref={facilityContactsFormRef}
															className='flex flex-col w-full items-start justify-start gap-3'
															name='facility_contacts_form'
															onSubmit={ev => handleFacilityContactsSubmit(ev, [setFormId, facilityId, facilityContactsFormRef])}>
															{/* Contacts */}

															<div
																className='grid grid-cols-2 place-content-start gap-3 w-full border-2 border-gray-200 rounded p-3'
																>
																{/* Contact Headers */}
																<h3 className='text-medium font-semibold text-blue-900'>
																	Contact Type
																</h3>
																<h3 className='text-medium font-semibold text-blue-900'>
																	Contact Details
																</h3>
																<hr className='col-span-2' />

																{/* Contact Type / Contact Details */}

															
																{/* add other fields */}
															    <div className='col-span-2 flex-col w-full items-start justify-start gap-y-3 '>
																	{
																		facilityContacts.map((facilityContact, i) => (
														
																			facilityContact
																		
																		))
																	}
																</div>	

															</div>

															<div className='w-full flex justify-end items-center'>
																<button
																	onClick={(e) => {
																		e.preventDefault();  
																		
																		setFacilityContacts([
																		...facilityContacts, 
																		(() => (
																			<FacilityContactsContext.Provider value={facilityContacts} key={(facilityContacts.length + 1) - 1}>
																				<FacilityContact
																				contactTypeOptions={contactTypeOptions}
																				setFacilityContacts={setFacilityContacts}
																				contacts={[null, null, null]}
																				fieldNames={['contact_type', 'contact']}
																				index={(facilityContacts.length + 1) - 1}
																				
																				/>
																			</FacilityContactsContext.Provider>
																		))()
	
																		
																		])}}
																	className='flex items-center space-x-1 bg-indigo-500 p-1 rounded'>
																	<PlusIcon className='w-4 h-4 text-white' />
																	<p className='text-medium font-semibold text-white'>
																		Add
																	</p>
																</button>
															</div>

															{/* Facility Officer In-charge Details */}

															<h5 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																Facility Officer In-Charge Details
															</h5>
															<div className='flex flex-col items-start justify-start gap-1 w-full rounded h-auto'>
																{/*  Name  */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='name'
																		className='text-gray-600 capitalize text-sm'>
																		Name
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>
																	</label>
																	<input
																		required
																		type='text'
																		name='officer_name'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/*  Registration Number */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='reg_no'
																		className='text-gray-600 capitalize text-sm'>
																		Registration Number/License Number{' '}
																	</label>
																	<input
																		type='text'
																		name='officer_reg_no'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/* Job Title */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='title'
																		className='text-gray-600 capitalize text-sm'>
																		Job Title
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>{' '}
																	</label>
																	<Select options={jobTitleOptions || []} 
																		required
																		placeholder="Select Job Title"																	
																		name="officer_title" 
            															className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
																</div>

																{/* Facility Officer Contact Type / Contact Details */}

																<div
																	className='grid grid-cols-2 place-content-start gap-3 w-full border-2 border-gray-200 rounded p-3'
																	>
																	{/* Contact Headers */}
																	<h3 className='text-medium font-semibold text-blue-900'>
																		Contact Type
																	</h3>
																	<h3 className='text-medium font-semibold text-blue-900'>
																		Contact Details
																	</h3>
																	<hr className='col-span-2' />

																	{/* Contact Type / Contact Details */}

														

																	<div className='col-span-2 flex-col w-full items-start justify-start gap-y-3 '>
																		{
																			officerContactDetails.map((officerDetailContact, i) => (
															
																				officerDetailContact
																			
																			))
																		}
																	</div>	

																</div>

																<div className='w-full flex justify-end items-center mt-2'>
																	<button
																		onClick={
																			(e) => {
																				e.preventDefault();  
																				setOfficerContactDetails([
																				...officerContactDetails, 
																				(() => (
																					<FacilityContactsContext.Provider value={officerContactDetails} key={(officerContactDetails.length + 1) - 1}>
																						<OfficerContactDetails
																						contactTypeOptions={contactTypeOptions}
																						setFacilityContacts={setOfficerContactDetails}
																						contacts={[null, null, null]}
																						fieldNames={['officer_details_contact_type', 'officer_details_contact']}
																						index={(officerContactDetails.length + 1) - 1}
																						
																						/>
																					</FacilityContactsContext.Provider>
																				))()
			
																				/*(facilityDepts[facilityDepts.length - 1] + facilityDepts.length)*/
																				])}}
																		className='flex items-center space-x-1 bg-indigo-500 p-1 rounded'>
																		<PlusIcon className='w-4 h-4 text-white' />
																		<p className='text-medium font-semibold text-white'>
																			Add
																		</p>
																	</button>
																</div>
															</div>

															<div className='flex justify-between items-center w-full'>
																<button
																	onClick={handleFacilityContactsPrevious}
																	className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																	<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																	<span className='text-medium font-semibold text-black '>
																		Geolocation
																	</span>
																</button>
																<button
																	type='submit'
																	className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																	<span className='text-medium font-semibold text-white'>
																		Regulation
																	</span>
																	<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
																</button>
															</div>
														</form>
													</>
												);
											case 3:
												// Regulation Form

												const handleRegulationPrevious = (event) => {
													event.preventDefault();
													window.sessionStorage.setItem('formId', 2);

													setFormId(window.sessionStorage.getItem('formId'));
												};


												return (
													<>  
														<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Regulation</h4>
														<form  ref={facilityRegulationFormRef} name="facility_regulation_form" className='flex flex-col w-full items-start justify-start gap-3' onSubmit={ev => handleRegulationSubmit(ev, [setFormId, facilityId, facilityOfficialName, facilityRegulationFormRef], licenseFile)}>

															{/* Regulatory Body */}
															<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																	<label htmlFor="regulatory_body" className="text-gray-600 capitalize text-sm">Regulatory Body<span className='text-medium leading-12 font-semibold'> *</span> </label>
																	<Select 
																		ref={_regBodyRef}
																		options={((regOptions) => {

																			return regOptions.filter(({label}) => !(label === 'Other'))

																		})(regBodyOptions || [])} 
																		required
																		onChange={() => setIsRegBodyChange(!isRegBodyChange)}
																		placeholder="Select Regulatory Body"
																		name='regulatory_body'
																		className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
        
															</div>

															{/* Regulation Status */} 
															<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																<label htmlFor="regulation_status" className="text-gray-600 capitalize text-sm">Regulation Status</label>
																<Select 
																		options={((regStateOpts) => {
																			
																				let filteredRegState
																				if(_regBodyRef.current){
																				
																					if(_regBodyRef.current?.state?.value?.label == 'Ministry of Health'){
																						filteredRegState = regStateOpts.filter(({label}) => !(label.match(/.*Gazett.*/) !== null))		
																					}
																					else {
																						filteredRegState = regStateOpts
																					}
																				} 
																				else{
																					filteredRegState = regStateOpts
																				}
	
																				return filteredRegState
																				
																		})(regulationStateOptions || [])} 
																		required
																		placeholder="Select Regulation Status"
																		name='regulation_status'
																		className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
															</div>

															{/* License Number */} 
															<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																<label htmlFor="license_number" className="text-gray-600 capitalize text-sm">License Number</label>
																<input type="text" name="license_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
															</div>


															{/* Registration Number */} 
															<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																<label htmlFor="registration_number" className="text-gray-600 capitalize text-sm">Registration Number</label>
																<input type="text" name="registration_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
															</div>

															{/* check file upload */}
															<div className=" w-full flex flex-col items-start justify-start p-3 rounded h-auto">
																<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																	<label htmlFor="license_document" className="text-gray-600 capitalize text-sm">Upload license document</label>
																	<input onChange={e => setLicenseFile(e.target.files[0])} type="file" name="license_document" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
																</div>
															</div>

															{/* Facility Departments Regulation  */}
															<h5 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Departments Regulation</h5>
															<div className='grid grid-cols-4 place-content-start gap-3 w-full border-2 border-gray-200 rounded p-3' ref={facilityRegulatoryBodyRef}>
															
															{/* Contact Headers */}
																<h3 className='text-medium font-semibold text-blue-900'>Name</h3>
																<h3 className='text-medium font-semibold text-blue-900'>Regulatory Body</h3>
																<h3 className='text-medium font-semibold text-blue-900'>License Number</h3>
																<h3 className='text-medium font-semibold text-blue-900'>Reg. Number</h3>
									
																<hr className='col-span-4'/>

																{/* add other fields */}
															    <div className='flex flex-col items-start justify-start gap-y-4'>
																 
																	{
																		facilityDepts.map((facilityDept, i) => (
																			<div className="w-full flex items-center justify-between gap-3 mt-3" key={facilityDept.index}>
																				<FacilityDeptRegulationFactory
																					key={facilityDept.index}
																					index={i}
																					{...facilityDept}
																				/>
																				
																				<button 
																					id={`delete-btn-${i}`}
																					key={facilityDept.index}
																					onClick={(ev)=> {
																						ev.preventDefault();
																						handleDeleteField(i);
																					}}><XCircleIcon className='w-7 h-7 text-red-400'/></button>
																				
																			</div>
																		
																		))
																	}
																</div>	
																
															
																
															</div>

														
															{/* Add btn */}
															<div className='w-full flex justify-end items-center mt-2'>

																<button onClick={(e) => {e.preventDefault();  setFacilityDepts(s=>{return [
																	...s,  {
																		index:facilityDepts.some((o) => o.index === s.length)? s.length + 1 : s.length,
																		isRegBodyChange:isRegBodyChange, 
																		setIsRegBodyChange:setIsRegBodyChange, 
																		setFacilityDepts:setFacilityDepts,
																		facilityDeptRegBody:null,
																		facilityDeptValue:null,
																		regNo: null,
																		licenseNo: null,
																		facilityDeptOptions: facilityDeptOptions
																	 },
																	]})}} className='flex items-center space-x-1 bg-indigo-500 p-1 rounded'>

																	<PlusIcon className='w-4 h-4 text-white'/>
																	<p className='text-medium font-semibold text-white'>Add</p>
																</button>
															</div>
														

															{/* Prev / Next */}
															<div className='flex justify-between items-center w-full'>
																<button onClick={handleRegulationPrevious} className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																	<ChevronDoubleLeftIcon className='w-4 h-4 text-black'/>
																	<span className='text-medium font-semibold text-black '>Facility Contacts</span>
																</button>
																<button type="submit" className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																	<span className='text-medium font-semibold text-white'> Services</span>
																	<ChevronDoubleRightIcon className='w-4 h-4 text-white'/>
																</button>
															</div>
														</form>
													</>
												);
											case 4:
												// Services Form
	
												const handleServicePrevious = () => {
												
													window.sessionStorage.setItem('formId', 3)
													
													setFormId(window.sessionStorage.getItem('formId'))
												}
												
												
												return (
													<>  
														<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Services</h4>
																<div className='flex flex-col w-full items-start justify-staFacilityDeptRegulationFactoryrt gap-3 mt-6'>
                                                            
																	{/* Edit list Container */}
																	<div className='flex items-center w-full h-auto min-h-[300px]'>                                  

																			<EditListItem 
																			initialSelectedItems={[]}
																			itemsCategory={serviceOptions}
																			itemsCategoryName={'Services'}
																			setUpdatedItem={() => null}
																			itemId={facilityId}
																			setItems={setServices}
																			item={null}
																			removeItemHandler={() => null}
																			handleItemsSubmit={handleServiceSubmit}
																			handleItemsUpdate={handleServiceUpdates}
																			setNextItemCategory={setFormId}
																			nextItemCategory={'infrastructure'}
																			previousItemCategory={'regulation'}
																			handleItemPrevious={handleServicePrevious}
																			setIsSaveAndFinish={() => null}

																			
																			/>

																	</div>
																</div>
													</>
												)
											case 5:
												// Infrastructure form
											
												const handleInfrastructurePrevious = (event) => {
													event.preventDefault()
													window.sessionStorage.setItem('formId', 4)
													
													setFormId(window.sessionStorage.getItem('formId'))
												}

											
												
												return (
													<>  
													<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Infrastracture</h4>
													<div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

														{/* Edit List With Count Container*/}
														<div className='flex items-center w-full h-auto min-h-[300px]'>
                                        
															{/* Edit List With Count*/}
																<EditListWithCount 
																initialSelectedItems={[]}
																itemsCategory={infrastructureOption}
																otherItemsCategory={null}
																itemsCategoryName={'infrastructure'}
																itemId={facilityId}
																item={null}
																handleItemsSubmit={handleInfrastructureSubmit}
																handleItemsUpdate={() => null}
																removeItemHandler={() => null}
																setIsSavedChanges={null}
																setItemsUpdateData={null}
																handleItemPrevious={handleInfrastructurePrevious}
																setNextItemCategory={setFormId}
																nextItemCategory={'services'}
																previousItemCategory={'human resources'}
                                              					setIsSaveAndFinish={() => null}
																/>

															</div>
													</div>
												</>
												)
											case 6:
												// Human resources form
		
												const handleHrPrevious = (event) => {
													event.preventDefault()
													window.sessionStorage.setItem('formId', 5)
													
													setFormId(window.sessionStorage.getItem('formId'))
												}

																							
												return (
													<>  
													<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Human resources</h4>
													<div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

														{/* Edit List With Count Container*/}
														<div className='flex items-center w-full h-auto min-h-[300px]'>
                                        
															{/* Edit List With Count*/}
																<EditListWithCount 
																initialSelectedItems={[]}
																itemsCategory={null}
																otherItemsCategory={hrOptions}
																itemsCategoryName={'human resource'}
																itemId={facilityId}
																item={null}
																handleItemsSubmit={handleHrSubmit}
																handleItemsUpdate={() => null}
																removeItemHandler={() => null}
																setIsSavedChanges={null}
																setItemsUpdateData={null}
																handleItemPrevious={handleHrPrevious}
																setNextItemCategory={setFormId}
																nextItemCategory={'finish'}
																previousItemCategory={'infrastructure'}
                                              					setIsSaveAndFinish={() => null}
																/>

															</div>
									
													</div>
													</>
												)
											default:
												// 
												return (
													<>  
														<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Basic Details</h4>
														<form>
														
														</form>
													</>
												)
	
										}
									})()
									}

								
								</div>
							</div>
							

						</div>

						
						{/* Floating Notification Bottom Right*/}
						<div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
							<h5 className="text-sm font-bold">
								<span className="text-gray-600 uppercase">Limited results</span>
							</h5>
							<p className="text-sm text-gray-800">
								For testing reasons, downloads are limited to the first 100 results.
							</p>
						</div>
					
					</div>
		</MainLayout>
	</>
 
  )
}

AddFacility.getInitialProps = async (ctx) => {

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
		'infrastructure',
		'specialities'
	]

	

	return checkToken(ctx.req, ctx.res)
		.then(async (t) => {
			if (t.error) {
				throw new Error('Error checking token');
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

									// let results = (await _data.json()).results.map(({id, sub_division, name }) => sub_division ? {value:id, label:sub_division} : {value:id, label:name})

									
									allOptions.push({facility_types: (await _data.json()).results})
									
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
					
					
			}
		})
		.catch((err) => {
			console.log('Error checking token: ', err);
			if (typeof window !== 'undefined' && window) {
				if (ctx?.asPath) {
					window.location.href = ctx?.asPath;
				} else {
					window.location.href = '/facilities';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
				};
			}, 1000);
		});
};

export default AddFacility;
