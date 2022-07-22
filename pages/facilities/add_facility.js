// React imports
import React, { useState, useEffect, useRef } from 'react';

// Next imports
import Head from 'next/head';

// Component imports
import MainLayout from '../../components/MainLayout';
import FacilityContact from '../../components/FacilityContact';
import TrasnferListServices from '../../components/TrasnferListServices';
import TransferListHr from '../../components/TransferListHr';
import TransferListInfrastructure from '../../components/TransferListInfrastructure';

// Controller imports
import { checkToken } from '../../controllers/auth/auth';

// MUI imports / vendor imports
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


// Heroicons imports
import {
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
	PlusIcon,
} from '@heroicons/react/solid';
import { XCircleIcon } from '@heroicons/react/outline';

// Package imports
import Select from 'react-select';
import router from 'next/router';



function AddFacility(props) {

    let facility = props.data

    const nameOptionRef = useRef(null)
    const serviceOptionRef = useRef(null)
    const optionRefBody = useRef(null)
    const infrastructureBodyRef = useRef(null)
 

    const steps = [
        'Basic Details',
        'Geolocation',
        'Facility Contacts',
        'Regulation',
        'Services',
        'Infrastructure',
        'Human resources'
      ];

    const infrastractureCategories = [
        {
            name:'COLD CHAIN',
            subCategories:[
                'Cold room',
                'Cool boxes',
                'Freezers',
                'Fridges'
            ]        
        },
        {
            name:'COMMUNICATIONS',
            subCategories:[
                'Land Line',
                'Radio Call',
                'Teleconfererncing Facility',
                'TV Screen',
                'Video Conferencing Facility',
                'Video Conferencing Sapce',
                'wireless Mobile'
            ]
        },
        {
            name:'ICT INFRASTRUCTURE',
            subCategories:[
                'LAN',
                'Laptops',
                'Printers',
                'Routers',
                'Scanners',
                'Servers',
                'WAN (Internet connectivity)',
                'Wi-Fi'
            ]
        },
        {
            name:'MEDICAL EQUIPMENT',
            subCategories:[
                'Boiler',
                'Cold chain vaccine carriers',
                'CT Scan Machines',
                'Dialysis machines',
                'MRI Machines',
                'Oxygen Plant',
                'Ventilators',
                'X-Ray Machines',

            ]
        },
        {
            name:'MEDICAL WASTE MANAGEMENT',
            subCategories:[
                'Dump without burning',
                'Incinerator',
                'Open burning',
                'Remove offsite',
                'Sewer system',
            ]
        },
        {
            name:'POWER SOURCE',
            subCategories:[
                'Battery  Backups',
                'Bio-Gas',
                'Gas',
                 'Generator',
                 'Main Grid',
                 'Solar'
            ]
        },
        {
            name:'ROADS',
            subCategories:[
                'Earthen Road',
                'Graded (Murrum)',
                'Gravel',
                'Tarmac'
            ]
        },
        {
            name:'WATER SOURCE',
            subCategories:[
                'Bore Hole',
                'Donkey Cart / Vendor',
                'Piped Water',
                'Protected Wells / Springs',
                ' River /Dam /Lake',
                'Roof Harvested Water'                
            ]
        },
        
        
    ]

    const serviceCategories = [
        {
            name:'ACCIDENT AND EMERGENCY CASUALTY SERVICES',
            subCategories:[
                'Accident and Emergency casualty Services',
                'General Emergency Services'
            ]
        },
        {
            name:'AMBULATORY SERVICES',
            subCategories:[
                'Ambulatory Services'
            ]
        },
        {
            name:'ANTENATAL CARE',
            subCategories:[
                'Focused Antenatal Care'
            ]
        },
        {
            name:'BLOOD TRANSFUSION SERVICES',
            subCategories:[
                'Blood Bank',
                'Facility offering Blood Transfusion Service',
                'Satellite Blood Transfusion service'
            ]
        },
        {
            name:'CANCER SCREENING',
            subCategories:[
                'Breast',
                'Coloreactal',
                'Pap smear',
                'Prostrate',
                'Screening using VIA/VILI'
            ]
        },
        {
            name:'CURATIVE SERVICES',
            subCategories:[
                'Inpatient',
                'Outpatient'
                
            ]
        },
        {
            name:'DELTED HDU',
            subCategories:[
                'High dependency Services',
                
            ]
        },
        {
            name:'EMERGENCY PREPAREDNESS',
            subCategories:[
                'Basic Emergency Preparedness',
                'Comprehensive Emergency Preparedness'
            ]
        },
        {
            name:'FAMILY PLANNING',
            subCategories:[
                'Long Term',
                'Natural',
                'Permanent'
            ]

        },
        {
            name:'FORENSIC SERVICES',
            subCategories:[
                'Long Term',
                'Natural',
                'Permanent'
            ]

        },
        {
            name: 'HIV TREATMENT',
            subCategories:[
                'HIV treatment and care'
            ]

        },
        {
            name: 'HIV/AIDS Prevention,Care and Treatment Services',
            subCategories:[
                'Condom Distribution & STI Prevention',
                'Elimination of Mother to Child transmission of HIV',
                'HEI - HIV exposed infants',
                'HIV preventive Package',
                'HIV risk reduction for Key populations',
                'HIV risk reduction services for prioity populations and geographies',
                'HIV Testing Services',
                'Infection Prevention and control to mitigate HIV infection in the work place',
                'Management of Sexually Transmitted Illness (STI)',
                'Nutrition assessment ,counselling and support ( The NACS process) for PLHIVs',
                'Post-Exposure Prophylaxis (PEP)'
            ]
        },
        {
            name: 'HOSPICE SERVICE',
            subCategories:[
            ]
        },
        {
            
            name: 'IMMUNISATION',
            subCategories:[
            ]   
        },
        {
            name: 'INTEGRATED MANAGEMENT OF CHILDHOOD ILLNESS',
            subCategories:[
            ]
        },
        {
            name: 'LABORATORY SERVICES',
            subCategories:[
            ]
        },
        {
            name: 'LEPROSY DIAGNOSIS',
            subCategories:[
            ]
        },
        {
            name: 'LEPROSY TREATMENT',
            subCategories:[
            ]
        },
        {
            name: 'MATERNITY SERVICES',
            subCategories:[
            ]
        }
           
    ]

	const hrCategories = [

		{
			name:'Clinical Officers',
			subCategories:[
				"Clinical Officer ENT/Audiology",
				"Clinical Officer Lung & Skin",
				"CO Dermatology/ Venereology",
				"CO Oncology/Palli--ative Care",
				"CO Ophthalmology/Cataract Surgery",
				"CO Orthopaedics",
				"CO Paediatrics",
				"CO Psychiatry/Mental Health",
				"CO Reproductive Health",
				"General Clinical Officers(Diploma)"
			]
		},
		{
			name:'Clinical Psychology',
			subCategories:[
				"Clinical psychologists"
			]
		},
		{
			name:'Community Health Services ',
			subCategories:[		
				"Community Health Extension/Assistants",
				"Community Health Volunteers(CHV)"
			]
		},
		{
			name:'Dental staff',
			subCategories:[
				"Community Oral Health Officers",
				"Dental Officers",
				"Dental Technologists",
				"Oromaxillofacial Surgeon",
				"Orthodontist",
				"Paediatric Dentist"
			]
		},
		{
			name:'Diagnostics & Imaging',
			subCategories:[
				
				"CT Scan /MRI Radiographer",
				"Dental Radiographer",
				"General Radiographer",
				"Mammographer",
				"Nuclear Medicine Technologist",
				"Radiation Monitoring & Safety Officer",
				"Therapy Radiographer",
				"Ultrasonographer"
			]
		},
		{
			name:'Environmental Health ',
			subCategories:[
	
			]
		},
		{
			name:'General Support Staffs ',
			subCategories:[
	
			]
		},
		{
			name:'Health Administrative Staffs ',
			subCategories:[
	
			]
		}
	
	]

	
    const [formId, setFormId] = useState(0)
    const facilityContactRef = useRef(null)
    const facilityContact2Ref = useRef(null)
    // const facilityServiceRef = useRef(null)
    const facilityRegulatoryBodyRef = useRef(null)
    const facilityInfrastructureRef = useRef(null)


    // Services State
    const [services, setServices] = useState([])
    const [infrastructure, setInfrastructure] = useState([])
	const [infrastructureCount, setInfrastructureCount] = useState([])
	const [hr, setHr] = useState([])
	const [hrCount, setHrCount] = useState([])
    

    useEffect(() => {

        const formIdState = window.sessionStorage.getItem('formId');

        // console.log({formIdState})

        if(formIdState == undefined || formIdState == null || formIdState == '') {
            window.sessionStorage.setItem('formId', 7); //0
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
    }, [formId, services])
      

	const handleQuickFiltersClick = (link) => {
		switch(link){
			case 'all':
				router.push({pathname:'/facilities', query:{qf:'all'}})
				break;
				
			case 'approved_facilities':
				
				router.push({pathname:'/facilities', query:{qf:'approved', approved_national_level: true, rejected:false }})
				break;
			case 'new_pending_validation':

				router.push({pathname:'/facilities', query:{qf:'new_pending_validation', pending_approval:true, has_edits:false}})
				break;
			case 'updated_pending_validation':
				
				router.push({pathname:'/facilities', query:{qf:'updated_pending_validation', has_edits:true, pending_approval:true} })
				break;
			case 'failed_validation_facilities':
				
				router.push({pathname:'/facilities', query:{qf:'failed_validation', rejected:true}})
				break;
			case 'rejected_facilities':
				
				router.push({pathname:'/facilities', query:{qf:'rejected', rejected_national:true}})
				break;
			case 'closed_facilities':
				
				router.push({pathname:'/facilities', query:{qf:'closed', closed:true}})
				break;
			case 'incomplete_facilities':
				
				router.push({pathname:'/facilities', query:{qf:'incomplete', incomplete:true}})
				break;
			case 'synchronize_regulated_facilities':
				router.push({pathname:'/facilities', query:{qf:'all'}})
				break;
			case 'feedback_facilities':
				router.push({pathname:'/facilities', query:{qf:'all'}})
				break;
			default:
				break;
	}
	}

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
									<a className="text-green-800" href="/">Home</a> {'>'}
									<a className="text-green-800" href="/facilities/">Facilities</a> {'>'}
									<span className="text-gray-500">Add Facility</span>
								</div>
							</div>

							<div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
								<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
										{'New Facility'}
								</h2>
							</div>
					
						</div>

						{/* Side Menu Filters */}

						<div className='col-span-1 w-full md:col-start-1 h-auto border-r-2 border-gray-300'>
                        <List
                        sx={{ width: '100%', bgcolor: 'background.paper', flexGrow:1 }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    
                        >	
                            <ListItemButton name="rt"
                                onClick={() => handleQuickFiltersClick('all') }
                            >
                                <ListItemText primary="All Facilities" />
                            </ListItemButton>
                            <ListItemButton 
                                 onClick={() => handleQuickFiltersClick('approved_facilities') }
                            >
                                <ListItemText primary="Approved Facilities" />
                            </ListItemButton>
                            <ListItemButton 
                            	 onClick={() => handleQuickFiltersClick('new_pending_validation') }
                            >
                                <ListItemText primary="New Facilities Pending Validation"/>
                            </ListItemButton>

                            <ListItemButton 
                            	 onClick={() => handleQuickFiltersClick('updated_pending_validation') }
                            >
                                <ListItemText primary="Updated Facilities Pending Validation"/>
                            </ListItemButton>

                            <ListItemButton 
                              	onClick={() => handleQuickFiltersClick('failed_validation_facilities') }
                            >
                                <ListItemText primary="Failed Validation Facilities"/>
                            </ListItemButton>

                            <ListItemButton 
                             	onClick={() => handleQuickFiltersClick('rejected_facilities') }
                            >
                                <ListItemText primary="Rejected Facilities"/>
                            </ListItemButton>

                            <ListItemButton 
                              	onClick={() => handleQuickFiltersClick('closed_facilities') }
                            >
                                <ListItemText primary="Closed Facilities "/>
                            </ListItemButton>

                            <ListItemButton 
                              	onClick={() => handleQuickFiltersClick('incomplete_facilities') }
                            >
                                <ListItemText primary="Incomplete Facilities"/>
                            </ListItemButton>

                            <ListItemButton 
                             	 onClick={() => handleQuickFiltersClick('synchronize_regulated_facilities') }
                            >
                                <ListItemText primary="Synchronize Regulated Facilities"/>
                            </ListItemButton>

                            
                            <ListItemButton 
                              	onClick={() => handleQuickFiltersClick('feedback_facilities') }
                            >
                                
                                <ListItemText primary="Feedback on Facilities"/>
                            </ListItemButton>
                                
                        </List>
                    	</div>

						{/* Stepper and Form */}
						<div className='col-span-4 md:col-start-2 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none'>
							{/* Stepper Header */}
							<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
								<Box sx={{ width: '100%' }}>
									<Stepper activeStep={parseInt(formId)} alternativeLabel>
										{steps.map((label) => (
											<Step key={label}>
												<StepLabel>{label}</StepLabel>
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
												const handleBasicDetailsSubmit = (event) => {
													event.preventDefault();
													const formData = {};

													const elements = [...event.target];

													elements.forEach(({ name, value }) => {
														formData[name] = value;
													});

													window.sessionStorage.setItem('formId', 1);

													setFormId(window.sessionStorage.getItem('formId'));
												};
												// Basic Details form
												return (
													<>
														<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
															Facility Basic Details
														</h4>
														<form
															className='flex flex-col w-full items-start justify-start gap-3'
															onSubmit={handleBasicDetailsSubmit}>
															{/* Facility Official Name */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_official_name'
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
																	name='facility_official_name'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>
															{/* Facility Unique Name  */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_official_name'
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
																	name='facility_unique_name'
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
																	options={[
																		{
																			value: 'type-1',
																			label: 'type-1',
																		},
																		{
																			value: 'type-2',
																			label: 'type-2',
																		},
																	]}
																	required
																	placeholder='Select a facility type...'
																	onChange={() => console.log('changed type')}
																	name='facility_official_name'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Facility Type Details */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_official_name'
																	className='text-gray-600 capitalize text-sm'>
																	Facility Type Details
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='text'
																	placeholder='Select a facility type details...'
																	name='facility_unique_name'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* Operation Status */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_type'
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
																			value: 'op-status-1',
																			label: 'op-status-1',
																		},
																		{
																			value: 'op-status-2',
																			label: 'op-status-2',
																		},
																	]}
																	required
																	placeholder='Select an operation status...'
																	onChange={() => console.log('changed')}
																	name='facility_official_name'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Date Established */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_unique_name'
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
																	name='facility_unique_name'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* Is Facility accredited */}
															<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<label
																	htmlFor='facility_accredited'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	*Is the facility accredited Lab ISO 15189?{' '}
																</label>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={true}
																		defaultChecked={true}
																		name='facility_accredited'
																		id='facility_accredited_yes'
																		onChange={(ev) => {}}
																	/>
																	<small className='text-gray-700'>Yes</small>
																</span>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={false}
																		defaultChecked={false}
																		name='facility_accredited'
																		id='facility_accredited_no'
																		onChange={(ev) => {}}
																	/>
																	<small className='text-gray-700'>No</small>
																</span>
															</div>

															{/* Owner Category */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='owner_category'
																	className='text-gray-600 capitalize text-sm'>
																	Owner Category
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
																	options={[
																		{
																			value: 'Private Practice',
																			label: 'Private Practice',
																		},
																		{
																			value: 'Non-Governmental Organizations',
																			label: 'Non-Governmental Organizations',
																		},
																		{
																			value: 'Ministry of Health',
																			label: 'Ministry of Health',
																		},
																		{
																			value: 'Faith Based Organization',
																			label: 'Faith Based Organization',
																		},
																	]}
																	required
																	placeholder='Select owner..'
																	onChange={() => console.log('changed')}
																	name='owner_category'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Owner Details */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='owner_details'
																	className='text-gray-600 capitalize text-sm'>
																	Owner Details
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
																	options={[
																		{
																			value: 'Private Practice',
																			label: 'Private Practice',
																		},
																		{
																			value: 'Non-Governmental Organizations',
																			label: 'Non-Governmental Organizations',
																		},
																		{
																			value: 'Ministry of Health',
																			label: 'Ministry of Health',
																		},
																		{
																			value: 'Faith Based Organization',
																			label: 'Faith Based Organization',
																		},
																	]}
																	required
																	placeholder='Select an owner..'
																	onChange={() => console.log('changed')}
																	name='owner_details'
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
																	options={[
																		{
																			value: 'Private Practice',
																			label: 'Private Practice',
																		},
																		{
																			value: 'Non-Governmental Organizations',
																			label: 'Non-Governmental Organizations',
																		},
																		{
																			value: 'Ministry of Health',
																			label: 'Ministry of Health',
																		},
																		{
																			value: 'Faith Based Organization',
																			label: 'Faith Based Organization',
																		},
																	]}
																	placeholder='Select a KEPH Level..'
																	onChange={() => console.log('changed')}
																	name='keph_level'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* No. Functional general Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_general_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of functional general beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	name='no_general_beds'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. Functional cots */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_cots'
																	className='text-gray-600 capitalize text-sm'>
																	Number of functional cots
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	name='no_cots'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. Emergency Casulty Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_emergency_beds'
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
																	name='no_emergency_beds'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. Intensive Care Unit Beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_icu_beds'
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
																	name='no_icu_beds'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. High Dependency Unit HDU */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_hdu_beds'
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
																	name='no_hdu_beds'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. of maternity beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_maternity_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of maternity beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	name='no_maternity_beds'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. of isolation beds */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_isolation_beds'
																	className='text-gray-600 capitalize text-sm'>
																	Number of isolation beds
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	name='no_isolation_beds'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. of General Theatres */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_general_theatres'
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
																	name='no_general_theatres'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* No. of Maternity Theatres */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='no_maternity_theatres'
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
																	name='no_maternity_theatres'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* Facility Catchment Population */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_catchment_population'
																	className='text-gray-600 capitalize text-sm'>
																	Facility Catchment Population
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<input
																	required
																	type='number'
																	name='facility_catchment_population'
																	className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																/>
															</div>

															{/* Is Reporting DHIS2 */}
															<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<label
																	htmlFor='facility_reporting'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	*Should this facility have reporting in DHIS2?{' '}
																</label>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={true}
																		defaultChecked={true}
																		name='facility_reporting'
																		id='facility_reporting_yes'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
																	/>
																	<small className='text-gray-700'>Yes</small>
																</span>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={false}
																		defaultChecked={false}
																		name='facility_reporting'
																		id='facility_reporting_no'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
																	/>
																	<small className='text-gray-700'>No</small>
																</span>
															</div>

															{/* Facility Admissions */}
															<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																<label
																	htmlFor='facility_admission'
																	className='text-gray-600 capitalize text-sm'>
																	Facility admissions
																	<span className='text-medium leading-12 font-semibold'>
																		{' '}
																		*
																	</span>
																</label>
																<Select
																	options={[
																		{
																			value: 'Private Practice',
																			label: 'Private Practice',
																		},
																		{
																			value: 'Non-Governmental Organizations',
																			label: 'Non-Governmental Organizations',
																		},
																		{
																			value: 'Ministry of Health',
																			label: 'Ministry of Health',
																		},
																		{
																			value: 'Faith Based Organization',
																			label: 'Faith Based Organization',
																		},
																	]}
																	required
																	placeholder='Select an admission status..'
																	onChange={() => console.log('changed')}
																	name='facility_admission'
																	className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																/>
															</div>

															{/* Is NHIF accredited */}
															<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<label
																	htmlFor='nhif_accredited'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	{' '}
																	*Does this facility have NHIF accreditation?{' '}
																</label>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={true}
																		defaultChecked={true}
																		name='nhif_accredited'
																		id='nhif_accredited_yes'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
																	/>
																	<small className='text-gray-700'>Yes</small>
																</span>
																<span className='flex items-center gap-x-1'>
																	<input
																		type='radio'
																		value={false}
																		defaultChecked={false}
																		name='nhif_accredited'
																		id='nhif_accredited_no'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
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
																		value={false}
																		defaultChecked={false}
																		name='facility_accredited'
																		id='is_armed_forces'
																		onChange={(ev) => {
																			console.log({ ev });
																		}}
																	/>
																	<label
																		htmlFor='is_armed_forces'
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
																		value={false}
																		defaultChecked={false}
																		name='facility_accredited'
																		id='open_24hrs'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
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
																		value={false}
																		defaultChecked={false}
																		name='facility_accredited'
																		id='open_latenight'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
																	/>
																	<label
																		htmlFor='open_latenight'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Open Late Night
																	</label>
																</div>

																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'
																		value={false}
																		defaultChecked={false}
																		name='facility_accredited'
																		id='open_pubholidays'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
																	/>
																	<label
																		htmlFor='open_pubholidays'
																		className='text-gray-700 capitalize text-sm flex-grow'>
																		{' '}
																		Open on public holidays
																	</label>
																</div>

																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<input
																		type='checkbox'
																		value={false}
																		defaultChecked={false}
																		name='facility_accredited'
																		id='open_weekends'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
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
																		value={false}
																		defaultChecked={false}
																		name='facility_accredited'
																		id='open_8_5'
																		onChange={(ev) => {
																			// console.log({ev})
																		}}
																	/>
																	<label
																		htmlFor='open_8_5'
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
																				htmlFor='keph_level'
																				className='text-gray-600 capitalize text-sm'>
																				County
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={[
																					{
																						value: 'Private Practice',
																						label: 'Private Practice',
																					},
																					{
																						value:
																							'Non-Governmental Organizations',
																						label:
																							'Non-Governmental Organizations',
																					},
																					{
																						value: 'Ministry of Health',
																						label: 'Ministry of Health',
																					},
																					{
																						value: 'Faith Based Organization',
																						label: 'Faith Based Organization',
																					},
																				]}
																				required
																				placeholder='Select County'
																				onChange={() => console.log('changed')}
																				name='keph_level'
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>

																	{/* Sub-county */}
																	<div className='col-start-2 col-span-1'>
																		<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																			<label
																				htmlFor='keph_level'
																				className='text-gray-600 capitalize text-sm'>
																				Sub-county
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={[
																					{
																						value: 'Private Practice',
																						label: 'Private Practice',
																					},
																					{
																						value:
																							'Non-Governmental Organizations',
																						label:
																							'Non-Governmental Organizations',
																					},
																					{
																						value: 'Ministry of Health',
																						label: 'Ministry of Health',
																					},
																					{
																						value: 'Faith Based Organization',
																						label: 'Faith Based Organization',
																					},
																				]}
																				required
																				placeholder='Select Sub County'
																				onChange={() => console.log('changed')}
																				name='keph_level'
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>

																	{/* Constituency */}
																	<div className='col-start-3 col-span-1'>
																		<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																			<label
																				htmlFor='keph_level'
																				className='text-gray-600 capitalize text-sm'>
																				Constituency
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={[
																					{
																						value: 'Private Practice',
																						label: 'Private Practice',
																					},
																					{
																						value:
																							'Non-Governmental Organizations',
																						label:
																							'Non-Governmental Organizations',
																					},
																					{
																						value: 'Ministry of Health',
																						label: 'Ministry of Health',
																					},
																					{
																						value: 'Faith Based Organization',
																						label: 'Faith Based Organization',
																					},
																				]}
																				required
																				placeholder='Select Constituency'
																				onChange={() => console.log('changed')}
																				name='keph_level'
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>

																	{/* Ward */}
																	<div className='col-start-4 col-span-1'>
																		<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																			<label
																				htmlFor='keph_level'
																				className='text-gray-600 capitalize text-sm'>
																				Ward
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<Select
																				options={[
																					{
																						value: 'Private Practice',
																						label: 'Private Practice',
																					},
																					{
																						value:
																							'Non-Governmental Organizations',
																						label:
																							'Non-Governmental Organizations',
																					},
																					{
																						value: 'Ministry of Health',
																						label: 'Ministry of Health',
																					},
																					{
																						value: 'Faith Based Organization',
																						label: 'Faith Based Organization',
																					},
																				]}
																				required
																				placeholder='Select Ward'
																				onChange={() => console.log('changed')}
																				name='keph_level'
																				className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																			/>
																		</div>
																	</div>
																</div>

																{/* Nearest Town/Shopping Center */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='nearest_town'
																		className='text-gray-600 capitalize text-sm'>
																		Nearest Town/Shopping Center
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>
																	</label>
																	<input
																		required
																		type='text'
																		name='nearest_town'
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
																			*
																		</span>
																	</label>
																	<input
																		required
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
																			*
																		</span>
																	</label>
																	<input
																		required
																		type='text'
																		name='nearest_landmark'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/* Location Description */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='location_description'
																		className='text-gray-600 capitalize text-sm'>
																		location description
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>
																	</label>
																	<input
																		required
																		type='text'
																		name='location_description'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
															</div>

															{/* check file upload */}
															<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='checklist_file'
																		className='text-gray-600 capitalize text-sm'>
																		checklist file upload
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>
																	</label>
																	<input
																		required
																		type='file'
																		name='checklist_file'
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
												// Geolocation form
												const handleGeolocationSubmit = (event) => {
													event.preventDefault();

													window.sessionStorage.setItem('formId', 2);

													setFormId(window.sessionStorage.getItem('formId'));
												};

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
														<form
															name='geolocation_form'
															className='flex flex-col w-full items-start justify-start gap-3'
															onSubmit={handleGeolocationSubmit}>
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
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
															</div>

															{/* Map View */}
															<div className='w-full h-min-48'>
																{facility?.lat_long &&
																facility?.lat_long.length > 0 ? (
																	<div className='w-full bg-gray-200  rounded flex flex-col items-center justify-center relative'>
																		<Map
																			operational={
																				facility.operational ||
																				facility.operation_status_name
																			}
																			code={facility?.code || 'NO_CODE'}
																			lat={facility?.lat_long[0]}
																			long={facility?.lat_long[1]}
																			name={
																				facility.official_name ||
																				facility.name ||
																				''
																			}
																		/>
																	</div>
																) : (
																	<div className='w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none'>
																		<p>
																			No location data found for this facility.
																		</p>
																	</div>
																)}
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
												// Facility Contacts

												const handleFacilityContactsSubmit = (event) => {
													event.preventDefault();

													window.sessionStorage.setItem('formId', 3);

													const dropDowns = document.getElementsByName(
														'dropdown_contact_types'
													);
													const inputs = document.getElementsByName(
														'contact_details_others'
													);

													console.log(event.target);

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

												const handleFacilityContactsPrevious = (event) => {
													event.preventDefault();
													window.sessionStorage.setItem('formId', 1);

													setFormId(window.sessionStorage.getItem('formId'));
												};

												const handleAddContact = (event) => {
													event.preventDefault();

													const divContainer = facilityContactRef.current;

													const dropDown = document.createElement('select');

													dropDown.setAttribute(
														'style',
														`
													width:100%; 
													border: 1px solid hsl(0, 0%, 80%); 
													border-radius: 4px; 
													padding: 2px; 
													background-color: hsl(0, 0%, 100%); 
													display: grid; 
													min-height: 38px;
													`
													);

													dropDown.setAttribute(
														'placeholder',
														'Select Contact Type'
													);

													dropDown.setAttribute('name', 'dropdown_contact_types');

													const option1 = document.createElement('option');
													option1.innerText = 'Select Contact Type';
													option1.value = 'Select Contact Type';

													const option2 = document.createElement('option');
													option2.innerText = 'POSTAL';
													option2.value = 'POSTAL';

													const option3 = document.createElement('option');
													option3.innerText = 'FAX';
													option3.value = 'FAX';

													const option4 = document.createElement('option');
													option4.innerText = 'LANDLINE';
													option4.value = 'LANDLINE';

													const option5 = document.createElement('option');
													option5.innerText = 'MOBILE';
													option5.value = 'MOBILE';

													const option6 = document.createElement('option');
													option6.innerText = 'EMAIL';
													option6.value = 'EMAIL';

													dropDown.appendChild(option1.getRootNode());
													dropDown.appendChild(option2.getRootNode());
													dropDown.appendChild(option3.getRootNode());
													dropDown.appendChild(option4.getRootNode());
													dropDown.appendChild(option5.getRootNode());
													dropDown.appendChild(option6.getRootNode());

													divContainer.appendChild(dropDown.getRootNode());
													const input =
														divContainer.childNodes[4].cloneNode(true);
													input.setAttribute('name', 'contact_details_others');

													divContainer.appendChild(input);
												};

												const handleAddContact2 = (event) => {
													event.preventDefault();

													const divContainer = facilityContact2Ref.current;

													const dropDown = document.createElement('select');

													dropDown.setAttribute(
														'style',
														`
													width:100%; 
													border: 1px solid hsl(0, 0%, 80%); 
													border-radius: 4px; 
													padding: 2px; 
													background-color: hsl(0, 0%, 100%); 
													display: grid; 
													min-height: 38px;
													`
													);

													dropDown.setAttribute(
														'placeholder',
														'Select Contact Type'
													);

													dropDown.setAttribute('name', 'dropdown_contact_types');

													const option1 = document.createElement('option');
													option1.innerText = 'Select Contact Type';
													option1.value = 'Select Contact Type';

													const option2 = document.createElement('option');
													option2.innerText = 'POSTAL';
													option2.value = 'POSTAL';

													const option3 = document.createElement('option');
													option3.innerText = 'FAX';
													option3.value = 'FAX';

													const option4 = document.createElement('option');
													option4.innerText = 'LANDLINE';
													option4.value = 'LANDLINE';

													const option5 = document.createElement('option');
													option5.innerText = 'MOBILE';
													option5.value = 'MOBILE';

													const option6 = document.createElement('option');
													option6.innerText = 'EMAIL';
													option6.value = 'EMAIL';

													dropDown.appendChild(option1.getRootNode());
													dropDown.appendChild(option2.getRootNode());
													dropDown.appendChild(option3.getRootNode());
													dropDown.appendChild(option4.getRootNode());
													dropDown.appendChild(option5.getRootNode());
													dropDown.appendChild(option6.getRootNode());

													divContainer.appendChild(dropDown.getRootNode());
													const input =
														divContainer.childNodes[4].cloneNode(true);
													input.setAttribute('name', 'contact_details_others');

													divContainer.appendChild(input);
												};

												return (
													<>
														<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
															Facility Contact
														</h4>
														<form
															className='flex flex-col w-full items-start justify-start gap-3'
															name='facility_contacts_form'
															onSubmit={handleFacilityContactsSubmit}>
															{/* Contacts */}

															<div
																className='grid grid-cols-2 place-content-start gap-3 w-full border-2 border-gray-200 rounded p-3'
																ref={facilityContactRef}>
																{/* Contact Headers */}
																<h3 className='text-medium font-semibold text-blue-900'>
																	Contact Type
																</h3>
																<h3 className='text-medium font-semibold text-blue-900'>
																	Contact Details
																</h3>
																<hr className='col-span-2' />

																{/* Contact Type / Contact Details */}
																<FacilityContact />
															</div>

															<div className='w-full flex justify-end items-center'>
																<button
																	onClick={handleAddContact}
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
																		htmlFor='facility_official_name'
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
																		name='name'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/*  Registration Number */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='facility_official_name'
																		className='text-gray-600 capitalize text-sm'>
																		Registration Number/License Number{' '}
																	</label>
																	<input
																		type='text'
																		name='reg_num'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/* Job Title */}
																<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																	<label
																		htmlFor='facility_official_name'
																		className='text-gray-600 capitalize text-sm'>
																		Job Title
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>{' '}
																	</label>
																	<input
																		required
																		type='text'
																		name='job_title'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

																{/* Facility Officer Contact Type / Contact Details */}

																<div
																	className='grid grid-cols-2 place-content-start gap-3 w-full border-2 border-gray-200 rounded p-3'
																	ref={facilityContact2Ref}>
																	{/* Contact Headers */}
																	<h3 className='text-medium font-semibold text-blue-900'>
																		Contact Type
																	</h3>
																	<h3 className='text-medium font-semibold text-blue-900'>
																		Contact Details
																	</h3>
																	<hr className='col-span-2' />

																	{/* Contact Type / Contact Details */}
																	<FacilityContact />
																</div>

																<div className='w-full flex justify-end items-center mt-2'>
																	<button
																		onClick={handleAddContact2}
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
												// Regulation form
												const handleRegulationSubmit = (event) => {
													event.preventDefault();

													window.sessionStorage.setItem('formId', 4);

													setFormId(window.sessionStorage.getItem('formId'));
												};

												const handleRegulationPrevious = (event) => {
													event.preventDefault();
													window.sessionStorage.setItem('formId', 2);

													setFormId(window.sessionStorage.getItem('formId'));
												};

												const handleAddRegulatoryBody = (event) => {
													event.preventDefault();

													const divContainer = facilityRegulatoryBodyRef.current;

													const dropDownRgBody = document.createElement('select');

													dropDownRgBody.setAttribute(
														'style',
														`
													width:100%; 
													border: 1px solid hsl(0, 0%, 80%); 
													border-radius: 4px; 
													padding: 2px; 
													background-color: hsl(0, 0%, 100%); 
													display: grid; 
													min-height: 38px;
													`
													);

													dropDownRgBody.setAttribute(
														'placeholder',
														'Select Service'
													);

													dropDownRgBody.setAttribute(
														'name',
														'dropdown_rgbody_name'
													);

													const option0 = document.createElement('option');
													option0.innerText = 'Select Fcaility Department';
													option0.value = 'Select Fcaility Department';

													const option1 = document.createElement('option');
													option1.innerText = 'Clinical Officers';
													option1.value = 'Clinical Officers';

													const option2 = document.createElement('option');
													option2.innerText = 'Nurses and specialist';
													option2.value = 'Nurses and specialist';

													const option3 = document.createElement('option');
													option3.innerText = 'Medical Officers';
													option3.value = 'Medical Officers';

													const option4 = document.createElement('option');
													option4.innerText = 'Dental';
													option4.value = 'Dental';

													const option5 = document.createElement('option');
													option5.innerText = 'Nutrition';
													option5.value = 'Nutrition';

													const option6 = document.createElement('option');
													option6.innerText = 'Occupational Health';
													option6.value = 'Occupational Health';

													const option7 = document.createElement('option');
													option7.innerText = 'Physiotherapy';
													option7.value = 'Physiotherapy';

													const option8 = document.createElement('option');
													option8.innerText = 'X-Ray';
													option8.value = 'X-Ray';

													const option9 = document.createElement('option');
													option9.innerText = 'Pharmacy';
													option9.value = 'Pharmacy';

													const option10 = document.createElement('option');
													option10.innerText = 'Laboratory';
													option10.value = 'Laboratory';

													const option11 = document.createElement('option');
													option11.innerText = 'Optical';
													option11.value = 'Optical';

													const inputRgBody =
														divContainer.childNodes[6].cloneNode(true);
													inputRgBody.setAttribute('name', 'regulatory_body');

													const inputLicenseNo =
														divContainer.childNodes[6].cloneNode(true);
													inputLicenseNo.setAttribute('name', 'license_no');

													const inputRegNo =
														divContainer.childNodes[6].cloneNode(true);
													inputRegNo.setAttribute('name', 'regulatory_no');

													const delBtn = document.createElement('button');
													delBtn.addEventListener('click', (ev) => {
														ev.preventDefault();
													});
													delBtn.innerText = '';
													delBtn.setAttribute(
														'style',
														`
													padding: 1px;
													border-radius: 2px;
													background-color: rosered;
													font-weight:400;
													width:auto;
													height:auto;

													`)

													
													divContainer.appendChild(dropDownRgBody.getRootNode())
													divContainer.appendChild(inputRgBody)
													divContainer.appendChild(inputLicenseNo)
													divContainer.appendChild(inputRegNo)
													divContainer.appendChild(delBtn.getRootNode())



												}


												return (
													<>  
														<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Regulation</h4>
														<form name="facility_regulation_form" className='flex flex-col w-full items-start justify-start gap-3' onSubmit={handleRegulationSubmit}>

															{/* Regulatory Body */}

															{/* Job Title */}
															<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																	<label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Regulatory Body<span className='text-medium leading-12 font-semibold'> *</span> </label>
																	<input required type="text" name="regulatory_body" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
															</div>

															{/* Regulation Status */} 
															<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																<label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">License Number</label>
																<input type="text" name="license_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
															</div>

															{/* Registration Number */} 
															<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																<label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Registration Number</label>
																<input type="text" name="reg_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
															</div>

															{/* check file upload */}
															<div className=" w-full flex flex-col items-start justify-start p-3 rounded h-auto">
																<div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
																	<label htmlFor="checklist_file" className="text-gray-600 capitalize text-sm">Upload license document</label>
																	<input required type="file" name="license_document" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
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

																
																{/* Name */}
																<Select options={
																					[
																						{
																							value:'Private Practice',
																							label: 'Private Practice'
																						},
																						{
																							value:'Non-Governmental Organizations',
																							label: 'Non-Governmental Organizations'
																						},
																						{
																							value:'Ministry of Health',
																							label: 'Ministry of Health'
																						},
																						{
																							value:'Faith Based Organization',
																							label: 'Faith Based Organization'
																						}
																					]
																				} 
																				required
																				placeholder="Select Ward"
																				onChange={
																					() => console.log('changed')
																				}
																				name="facility_dept_name" 
																				className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
																
																{/* Regulatory Body */}
																<input type="text" name="regulatory_body" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

																{/* License No. */}
																<input type="number" name="license_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
										
																<div className='col-start-4 flex items-center space-x-2 w-full'>
																	{/* Reg No. */}
																	<input type="number" name="reg_number" className="flex-none  bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
																
																	{/* Delete Btn */}

																	<button onClick={event => {event.preventDefault()}}><XCircleIcon className='w-7 h-7 text-red-400'/></button>
																</div>

																{/* add other fields */}
															
																
															</div>

														
															{/* Add btn */}
															<div className='w-full flex justify-end items-center mt-2'>
																<button onClick={handleAddRegulatoryBody} className='flex items-center space-x-1 bg-indigo-500 p-1 rounded'>
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

												// Services form
												const handleServiceSubmit = (event) => {
													event.preventDefault()

													window.sessionStorage.setItem('formId', 5)
													
													setFormId(window.sessionStorage.getItem('formId'))
													setServices([])

												}

												const handleServicePrevious = (event) => {
													event.preventDefault()
													window.sessionStorage.setItem('formId', 3)
													
													setFormId(window.sessionStorage.getItem('formId'))
												}
												
												
												return (
													<>  
														<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Services</h4>
														<form name="facility_services_form" className='flex flex-col w-full items-start justify-start gap-3' onSubmit={handleServiceSubmit}>
															
															{/* Transfer list Container */}
															<div className='flex items-center w-full h-auto min-h-[300px]'>
															
														
															<TrasnferListServices 
															categories={
																serviceCategories.map((data) => data)
															} 
															setServices={setServices}
															/>

															</div>
															{/* Service Category Table */}
															<table className='w-full  h-auto my-4'>
																<thead className='w-full'>
																	<tr className='grid grid-cols-2 place-content-end border-b-4 border-gray-300'>
																		<td className='text-lg font-semibold text-indigo-900 '>Name</td>
																		<td className='text-lg font-semibold text-indigo-900 ml-12'>Service Option</td>
																	</tr>
																</thead>
																<tbody ref={optionRefBody}>
																	{
																		services.map((service, i) => (
																			<tr key={`${service}_${i}`} className='grid grid-cols-2 place-content-end border-b-2 border-gray-300'>
																				<td ref={nameOptionRef}>{service}</td>
																				<td ref={serviceOptionRef} className='ml-12 text-base'>Yes</td>
																			</tr>
																		))
																	}
																
																
																</tbody>
															</table>
															
															<div className='flex justify-between items-center w-full'>
																<button onClick={handleServicePrevious} className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																	<ChevronDoubleLeftIcon className='w-4 h-4 text-black'/>
																	<span className='text-medium font-semibold text-black '>Regulation</span>
																</button>
																<button type="submit" className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																	<span className='text-medium font-semibold text-white'>Infrastructure</span>
																	<ChevronDoubleRightIcon className='w-4 h-4 text-white'/>
																</button>
															</div>
														</form>
													</>
												)
											case 5:
												// Infrastructure form
												const handleInfrastructureSubmit = (event) => {
													event.preventDefault()

													window.sessionStorage.setItem('formId', 6)
													
													console.log({formId});
													setFormId(window.sessionStorage.getItem('formId'))

												}

												const handleInfrastructurePrevious = (event) => {
													event.preventDefault()
													window.sessionStorage.setItem('formId', 4)
													
													setFormId(window.sessionStorage.getItem('formId'))
												}

											
												
												return (
													<>  
													<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Infrastracture</h4>
													<form name="facility_infrastructure_form" className='flex flex-col w-full items-start justify-start gap-3'>
														
														{/* Transfer list Container */}
														<div className='flex items-center w-full h-auto min-h-[300px]'>
														
														{/* Transfer List*/}
														<TransferListInfrastructure 
															categories={
																infrastractureCategories.map((data) => data)
															} 
															setState={setInfrastructure}
															setCount={setInfrastructureCount}
															selectTitle='Infrastructure'
															/>

														</div>
														{/* Service Category Table */}
														<table className='w-full  h-auto my-4'>
															<thead className='w-full'>
																<tr className='grid grid-cols-4 place-content-end border-b-4 border-gray-300'>
																	<td className='text-lg font-semibold text-indigo-900'>Name</td>
																	<td className='text-lg font-semibold text-indigo-900'>Category</td>
																	<td className='text-lg font-semibold text-indigo-900'>Present</td>
																	<td className='text-lg font-semibold text-indigo-900'>Number</td>
																</tr>
															</thead>
															<tbody ref={infrastructureBodyRef}>
																{
																	infrastructure.map((_infrastructure, i) => (
																		<tr key={`${_infrastructure}_${i}`} className='grid grid-cols-4 place-content-end border-b-2 border-gray-300'>
																			<td className='text-lg text-black'>{_infrastructure}</td>
																			<td className='text-lg text-black'>{infrastractureCategories.filter(({subCategories}) => subCategories.includes(_infrastructure))[0].name}</td>
																			<td className='text-lg text-black'>Yes</td>
																			<td className='text-lg  text-black'>{infrastructureCount.filter(({name}) => name == _infrastructure)[0].val}</td>
																		</tr>
																	))
																}
															
															
															</tbody>
														</table>
														
														<div className='flex justify-between items-center w-full'>
															<button onClick={handleInfrastructurePrevious} className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black'/>
																<span className='text-medium font-semibold text-black '>Services</span>
															</button>
															<button onClick={handleInfrastructureSubmit} className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>Human resources</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white'/>
															</button>
														</div>
													</form>
												</>
												)
											case 6:
												// Human resources form
												const handleHrSubmit = (event) => {
													
													event.preventDefault()

													window.sessionStorage.setItem('formId', 0)
													
													setFormId(window.sessionStorage.getItem('formId'))

												}

												const handleHrPrevious = (event) => {
													event.preventDefault()
													window.sessionStorage.setItem('formId', 5)
													
													setFormId(window.sessionStorage.getItem('formId'))
												}

											
												
												return (
													<>  
													<h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Human resources</h4>
													<form name="facility_services_form" className='flex flex-col w-full items-start justify-start gap-3'>
														
														{/* Transfer list Container */}
														<div className='flex items-center w-full h-auto min-h-[300px]'>
														
														{/* Transfer List*/}
														
														<TransferListHr 
															categories={
																hrCategories.map((data) => data)
															} 
															setState={setHr}
															setCount={setHrCount}
															selectTitle='HR Specialities'
														/>

														</div>
														{/* Service Category Table */}
														<table className='w-full  h-auto my-4'>
															<thead className='w-full'>
																<tr className='grid grid-cols-3 place-content-end border-b-4 border-gray-300'>
																	<td className='text-lg font-semibold text-indigo-900'>Name</td>
																	<td className='text-lg font-semibold text-indigo-900'>Present</td>
																	<td className='text-lg font-semibold text-indigo-900'>Number</td>
																</tr>
															</thead>

															<tbody>
																{
																	hr.map((_hr, i) => (
																		<tr key={`${_hr}_${i}`} className='grid grid-cols-3 place-content-end border-b-2 border-gray-300'>
																			<td className='text-lg text-black'>{_hr}</td>
																			<td className='text-lg text-black'>Yes</td>
																			<td className='text-lg  text-black'>{hrCount.filter(({name}) => name == _hr)[0].val}</td>
																		</tr>
																	))
																}
															
															
															</tbody>
														</table>
														
														<div className='flex justify-between items-center w-full'>
															<button onClick={handleHrPrevious} className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black'/>
																<span className='text-medium font-semibold text-black '>Infrastracture</span>
															</button>
															<button onClick={handleHrSubmit} className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>Finish</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white'/>
															</button>
														</div>
													</form>
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
	return checkToken(ctx.req, ctx.res)
		.then((t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
				let url =
					process.env.NEXT_PUBLIC_API_URL +
					'/facilities/facilities/' +
					ctx.query.id +
					'/';
				return fetch(url, {
					headers: {
						Authorization: 'Bearer ' + token,
						Accept: 'application/json',
					},
				})
					.then((r) => r.json())
					.then((json) => {
						return {
							data: json,
						};
					})
					.catch((err) => {
						console.log('Error fetching facilities: ', err);
						return {
							error: true,
							err: err,
							data: [],
						};
					});
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
