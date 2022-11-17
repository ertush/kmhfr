import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { checkToken } from '../../../controllers/auth/auth'
import React, { useState, useEffect, useRef, useContext } from 'react';
import Select from 'react-select'
import MainLayout from '../../../components/MainLayout'
import { Formik, Field, Form } from "formik"; 
import dynamic from 'next/dynamic'
import router from 'next/router'
import { useAlert } from "react-alert";
import Link from 'next/link';


import { 
    handleBasicDetailsUpdates,
    handleGeolocationUpdates,
    handleFacilityContactsUpdates,
    handleRegulationUpdates,
    handleServiceUpdates,
    handleInfrastructureUpdates,
    handleHrUpdates
} from '../../../controllers/facility/facilityHandlers';



import FacilityContact from '../../../components/FacilityContact';
import { PlusIcon, XCircleIcon } from '@heroicons/react/solid'
import TrasnferListServices from '../../../components/TrasnferListServices';
import TransferListHr from '../../../components/TransferListHr';
import TransferListInfrastructure from '../../../components/TransferListInfrastructure';
import FacilityUpdatesTable from '../../../components/FacilityUpdatesTable';
import FacilitySideMenu from '../../../components/FacilitySideMenu';


import { UserContext } from '../../../providers/user';
import { defer } from 'underscore';
import { set } from 'nprogress';



const _ = require('underscore') 

const isArray = (_arr) => {
    let isArray
    if(_arr){
        isArray = _arr.hasOwnProperty('length')
    }

    return isArray
}

const WardMap = dynamic(
	() => import('../../../components/WardGISMap'), // replace '@components/map' with your component's location
	{
		loading: () => <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
		ssr: false // This line is important. It's what prevents server-side render
	} 
)

const Map = React.memo(WardMap)

const EditFacility = (props) => {

    // Alert 
    const alert = useAlert();

   
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



    const [khisSynched, setKhisSynched] = useState(false);
    const [facilityFeedBack, setFacilityFeedBack] = useState([])
    const [pathId, setPathId] = useState('') 
    const [allFctsSelected, setAllFctsSelected] = useState(false);
    const [title, setTitle] = useState('') 
    const filters = []


    const facilityTypeOptions = props['1']?.facility_type_details?? []
    const ownerOptions =  props['2']?.owners ?? []
    const ownerTypeOptions =  props['3']?.owner_types ?? []
    const kephOptions =  props['4']?.keph ?? []
    const facilityAdmissionOptions =  props['5']?.facility_admission_status
    const countyOptions =  props['6']?.counties ?? []
    const subCountyOptions =  props['7']?.sub_counties ?? []
    const constituencyOptions =  props['8']?.constituencies ?? []
    const wardOptions =  props['9']?.wards ?? []
    const jobTitleOptions = props['10']?.job_titles ?? []
    const contactTypeOptions = props['11']?.contact_types ?? []
    const facilityDeptOptions = props['12']?.facility_depts ?? []
    const regBodyOptions = props['13']?.regulating_bodies ?? []
    let regulationStateOptions = props['14']?.regulation_status ?? []
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

    // Facility data
    const {
        id,
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
        facility_license_document,
        reporting_in_dhis,  
        nhif_accreditation,
        is_classified,
        open_whole_day,
        open_weekends,
        open_public_holidays,
        open_normal_day,
        open_late_night,
        admission_status,
        county_id,
        sub_county_id,
        constituency_id,
        town_name,
        ward,
        location_desc,
        plot_number,
        nearest_landmark,
        coordinates,
        facility_checklist_document,
        lat_long,
        officer_in_charge,
        facility_contacts,
        ward_name,
        regulatory_body,
        regulatory_status_name,
        license_number,
        registration_number,
        regulatory_body_name
 
    } = props['18']?.data ?? {}

    const basicDetailsData =   {
        official_name,
        name,
        facility_type,
        date_established,
        accredited_lab_iso_15189,
        number_of_beds,
        number_of_cots,
        number_of_emergency_casualty_beds,
        number_of_general_theatres,
        number_of_hdu_beds,
        number_of_icu_beds,
        number_of_isolation_beds,
        number_of_maternity_beds,
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
        town_name,
        location_desc,
        plot_number,
        nearest_landmark,
        constituency_id,
        county_id,
        sub_county_id,
        facility_catchment_population,
        keph_level,
        nearest_landmark,
        official_name,
        operation_status,
        owner,
        owner_type,
        plot_number,
        reporting_in_dhis,
        town_name,
        ward
    }

    const collection_date = props['20']?.collection_date ?  (props['20']?.collection_date.replace(/T.*$/, '') ?? '') : ''

    const facilityContactsData = {

        contact:  ((facility_contacts) => {
  
            let _contactDetail 
            if(facility_contacts){
                if(isArray(facility_contacts)){
                    if(facility_contacts.length > 0){
                        _contactDetail = facility_contacts[0].contact
                    }else{
                        _contactDetail = ''
                    }
                }else{
                    _contactDetail = ''
                }
            }else{
                _contactDetail = ''
            }
    
            return _contactDetail
    
        })(facility_contacts),
        contact_type : ((facility_contacts) => {
  
            let _contactDetail 
            if(facility_contacts){
                if(isArray(facility_contacts)){
                    if(facility_contacts.length > 0){
                        _contactDetail = facility_contacts[0].contact_type
                    }else{
                        _contactDetail = ''
                    }
                }else{
                    _contactDetail = ''
                }
            }else{
                _contactDetail = ''
            }
    
            return _contactDetail
    
        })(facility_contacts),
        name : ((facility_contacts) => {
  
            let _contactDetail 
            if(facility_contacts){
                if(isArray(facility_contacts)){
                    if(facility_contacts.length > 0){
                        _contactDetail = facility_contacts[0].name
                    }else{
                        _contactDetail = ''
                    }
                }else{
                    _contactDetail = ''
                }
            }else{
                _contactDetail = ''
            }
    
            return _contactDetail
    
        })(facility_contacts),

        reg_no : registration_number,
    }
    
    const geolocationData = {
        collection_date: collection_date ?? '',
        longitude : ((coordinates) => {
   
        let _lng 
        if(lat_long){
            if(lat_long.length > 0){
                _lng = coordinates[1]
            }else{
                _lng = ''
            }
        }else{
            _lng = ''
        }

        return _lng

    })(lat_long),
        latitude : ((coordinates) => {
   
            let _lng 
            if(lat_long){
                if(lat_long.length > 0){
                    _lng = coordinates[0]
                }else{
                    _lng = ''
                }
            }else{
                _lng = ''
            }
    
            return _lng
    
        })(lat_long)
    } 

    const {
        gJSON,
        centerCoordinates
    } = props['19']?.geolocation ?? {}

  
    const serviceSelected = ((_services) => {
        return _services.map(({category_name, service_name, service_id}) => ({
                    name: category_name,
                    subCategories: [
                        service_name
                    ],
                    value:[
                        service_id
                    ]
                    
                })
        )
    })(facility_services || [])  

    const infrastructureSelected = ((_infrastructure) => {
        return _infrastructure.map(({infrastructure_name, infrastructure}) => ({

                    name: props['16']?.infrastructure.length > 0 ? props['16']?.infrastructure.filter(({id}) => id === infrastructure)[0].category_name : '',
                  
                    subCategories: [
                        infrastructure_name
                    ],
                    value:[
                        infrastructure
                    ]
                    
                })
        )   
    })(facility_infrastructure || [])  

    const hrSelected = ((_hr) => {
      
        return _hr.map(({speciality_name, speciality}) => { 

            const hrFilter = props['17']?.hr.filter(({id}) => id === speciality)

            const resultHr = {

                name: props['17']?.hr.length > 0 ? (hrFilter.length > 0 ? hrFilter[0].category_name : '') : '',
              
                subCategories: [
                    speciality_name
                ],
                value:[
                    speciality
                ]
                
            }
            return resultHr.name !== '' ? resultHr : []
            }
        )
    })(facility_specialists || [])

    const [user, setUser] = useState(null)

    // Form field states
    const [_checklistFile, setCheckListFile] = useState(facility_checklist_document ?? '')
    const [_lat, setLat] = useState(((coordinates) => {
   
        let _lat 
        if(lat_long){
            if(lat_long.length > 0){
                _lat = coordinates[0]
            }else{
                _lat = ''
            }
        }else{
            _lat = ''
        }

        return _lat

    })(lat_long))

    const [_long, setLong] = useState(((coordinates) => {
   
        let _lng 
        if(lat_long){
            if(lat_long.length > 0){
                _lng = coordinates[1]
            }else{
                _lng = ''
            }
        }else{
            _lng = ''
        }

        return _lng

    })(lat_long))


    const [_officerName, setOfficerName] = useState(officer_in_charge || '')
    const [_regNo, setRegNo] = useState(registration_number ?? '')
    const [_regBody, setRegBody] = useState(regulatory_body_name ?? '')
    const [_file, setFile] = useState(facility_license_document ?? '')
    const [_licenseNo, setLicenseNo] = useState(license_number ?? '')


    // Different form states
    const [services, setServices] = useState([])
    const [infrastructure, setInfrastructure] = useState([])
	const [infrastructureCount, setInfrastructureCount] = useState([])    
	const [hr, setHr] = useState([])
	const [hrCount, setHrCount] = useState([])
    const [wardName, setWardName] = useState(ward_name)
    const [contact, setContact] = useState('')
    const [refreshForm4, setRefreshForm4] = useState()
    const [selectedServiceRight, setSelectedServiceRight] = useState()
    const [selectedInfraRight, setSelectedInfraRight] = useState()
    const [selectedHrRight, setSelectedHrRight] = useState()
    const [operationStatus, setOperationStatus] = useState('')
	const [refreshForm5, setRefreshForm5] = useState(false)
    const [refreshForm6, setRefreshForm6] = useState(false)
    const [facilityUpdateData, setFacilityUpdateData] = useState(null)
    const [isSavedChanges, setIsSavedChanges] = useState(false)
    
  
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

    
    const [facilityOption, setFacilityOption] = useState('')
    const [ownerTypeOption, setOwnerTypeOption] = useState('')
    const [facilityTypeDetail, setFacilityTypeDetail] = useState('')
    const [subCountyOpt, setSubCountyOpt] = useState('')
	const [wardOpt, setWardNameOpt] = useState('')
    const [btnDir, setBtnDir] = useState(null)
    const [isPendingLicense, setIsPendingLicense] = useState(false)
    const [isPendingRegistration, setIsPendingRegistration] = useState(false)



    // Basic Details Refs
    const facilityTypeRef = useRef(null)
    const facilityTypeDetailsRef = useRef(null)
    const operationStatusRef = useRef(null)    
    const ownerTypeOptionsRef = useRef(null)
    const ownerDetailsRef = useRef(null)
    const kephLvlRef = useRef(null)    
    const facilityAdmissionRef = useRef(null)
    const countyRef = useRef(null)
    const subCountyRef = useRef(null)
    const constituencyRef = useRef(null)
    const wardRef = useRef(null)
    const checklistFileRef = useRef(null)


    // Facility Contacts Refs
    const contactRef = useRef(null)
    const jobTitleRef = useRef(null)
    const otherContactRef = useRef(null)
    const facilityContactDetailRef = useRef(null)
    const officerInchargeContactDetailRef = useRef(null)
 

    // Regulation Refs
    const regulatoryBodyRef = useRef(null)
    const regulatoryStateRef = useRef(null)
    const facilityContactRef = useRef(null)
    const facilityContact2Ref = useRef(null)
    const facilityRegulatoryBodyRef = useRef(null)
    const regBodyRef = useRef(null)
    const facilityDeptNameRef = useRef(null)
    const optionRefBody = useRef(null)
    const serviceOptionRef = useRef(null)
    const nameOptionRef = useRef(null)
    const infrastructureBodyRef = useRef(null)

    // Facility update data
    const {
        updated,
        updated_by,
        facility_updated_json,
        created_by_name,
    } = facilityUpdateData ?? {updated: new Date(), updated_by: '', facility_updated_json: [], created_by_name: ''}



    const ownerTypeName = ownerTypeOptions.find(({value}) => value === owner_type).label

    // Filter regulationStatusOptions based on owner type
    const filteredRegulationStateOptions = (() => {
        let stateOptions = []

        const regulationStatuses = [
            "Pending Gazettement",
            "Gazetted",
            "License Suspended"
        ]

         regulationStatuses.forEach(option => {
            stateOptions.push(
                regulationStateOptions.find(({label}) => label === option)
            )
        })

        return stateOptions
    })()

    const filteredRegBodyOptions = regBodyOptions.filter(({label}) => label === ownerTypeName)

    // User Context 
    const userCtx = useContext(UserContext)
    
    useEffect(() => {
        if (userCtx) setUser(userCtx)

        // Pre-fetch values for drop down
        if(facility_type){
        if(facilityTypeRef.current ){
          
            facilityTypeRef.current.state.value = facilityOptions.filter(({value}) => value === facility_type)[0] || {label:facility_type_name, value:facility_type}
        }
        if(facilityTypeDetailsRef.current ){
            facilityTypeDetailsRef.current.state.value = facilityTypeOptions.filter(({value}) => value === facility_type)[0] || ''
        }
        if(operationStatusRef.current ){
            
            operationStatusRef.current.state.value = operationStatusOptions.filter(({value}) => value === operation_status)[0] || ''
        }
        if(ownerTypeOptionsRef.current ){
            
            ownerTypeOptionsRef.current.state.value = ownerTypeOptions.filter(({value}) => value === owner_type)[0] || ''
        }
        if(ownerDetailsRef.current ){
            
            ownerDetailsRef.current.state.value = ownerOptions.filter(({value}) => value === owner)[0] || ''
        }
        if(kephLvlRef.current ){
            
            kephLvlRef.current.state.value = kephOptions.filter(({value}) => value === keph_level)[0] || ''
        }
        if(facilityAdmissionRef.current ){
            
            facilityAdmissionRef.current.state.value = facilityAdmissionOptions.filter(({value}) => value === admission_status)[0] || ''
        }
        if(countyRef.current ){
            
            countyRef.current.state.value = countyOptions.filter(({value}) => value === county_id)[0] || ''
        }
        if(subCountyRef.current ){
            subCountyRef.current.state.value = subCountyOptions.filter(({value}) => value === sub_county_id)[0] || ''
        }
        if(constituencyRef.current ){
            
            constituencyRef.current.state.value = constituencyOptions.filter(({value}) => value === constituency_id)[0] || ''
        }
        if(wardRef.current ){
            wardRef.current.state.value = wardOptions.filter(({value}) => value === ward)[0] || ''
        }
        if(contactRef.current ){
            contactRef.current.state.value = contactTypeOptions.filter(({label}) => label === (facility_contacts.length > 0 && facility_contacts  ? facility_contacts[0].contact_type_name : ''))[0] || ''
        }
        if(jobTitleRef.current ){
            jobTitleRef.current.state.value = jobTitleOptions.filter(({value}) => value === (officer_in_charge  ? officer_in_charge.title : ''))[0] || ''
        }

        if(regulatoryBodyRef.current ){
            regulatoryBodyRef.current.state.value = regBodyOptions.filter(({value}) => value === regulatory_body)[0] || ''
        }

        if(regulatoryStateRef.current ){
            regulatoryStateRef.current.state.value = regulationStateOptions.filter(({label}) => label === regulatory_status_name)[0] || ''
        }
        
        if(facilityDeptNameRef.current ){
            facilityDeptNameRef.current.state.value = facilityDeptOptions.filter(({reg_body_name}) => reg_body_name === regulatory_body_name)[0] || ''
        }

        if(otherContactRef.current ){
            otherContactRef.current.state.value = _officerName.contacts && _officerName.contacts.length > 0 ? _officerName?.contacts[0].type : ''
        }

        if(regBodyRef.current ){
            regBodyRef.current.value = facility_units[0]?.regulating_body_name ?? ''
        } 


    }

   
    return () => {

    }
       
        
    }, [isSavedChanges, refreshForm4])


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
        
            <Head>
                <title>KMHFL - {official_name}</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout>
                <div className="w-full grid md:grid-cols-7 place-content-center md:grid-cols-4 gap-4 md:p-2 my-6">
                    {/* Heading */}
                    <div className="md:col-span-7 flex flex-col items-start px-4 justify-start gap-3">
                        {/* Bread crumbs */}
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                            <Link className="text-green-700" href="/">Home</Link> {'>'}
                            <Link className="text-green-700" href="/facilities">Facilities</Link> {'>'}
                            <span className="text-gray-500">{official_name} ( #<i className="text-black">{code || "NO_CODE"}</i> )</span>
                        </div>

                        {/* Header */}
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

                    {/* Facility Side Menu Filters */}
                    <div className="md:col-span-1 md:mt-8">
                            <FacilitySideMenu 
                                filters={filters}
                                states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
                                stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]}/>
                    </div>
                    

                    <div className="md:col-span-6 md:col-span-4 flex flex-col items-center md:gap-3 gap-y-3 mt-4">
                        {
                            isSavedChanges && facilityUpdateData ?
                            // Display Changes to be updated
                            <div className='flex flex-col justify-start w-full space-y-3 md:px-4'>
                                <h2 className='text-2xl font-bold justify-center items-center md:ml-0 ml-4'>Updated details</h2>
                                {/* Update Metadata */}
                                <div className='grid grid-cols-1 gap-y-2 grid-rows-1 md:flex justify-between md:space-x-4 w-full md:mx-0 mx-4'>
                                    <p className='text-base font-normal flex -leading-3'>Updates were made on
                                    <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center mx-2 gap-x-1">
                                      {new Date(facilityUpdateData?.updated).toLocaleString().split(',')[0]}
                                     </span>
                                      by 
                                    <span className='bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center mx-2 gap-x-1'>
                                        {facilityUpdateData?.created_by_name}
                                    </span>
                                    </p>
                                   
                                    <p className='text-base font-normal flex -leading-3'>Facility Code: 
                                        <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center mx-2 gap-x-1">{code}</span>
                                    </p>
                                    
                                    <span className="flex space-x-2">
                                        <button className='flex justify-center text-base font-semibold text-white bg-green-500 rounded py-1 px-2' onClick={() => router.push(`/facilities/${id}`)}>Edit</button>
                                        <button className='flex justify-center text-base font-semibold text-white bg-green-500 rounded py-1 px-2' onClick={() => router.push('/facilities')}>Confirm Updates</button>
                                    </span>
                                </div>

                                {/* Update Details */}

                                <FacilityUpdatesTable facilityUpdatedJson={facility_updated_json} originalData={props['18']}/> 

                            </div>
                            :
                            // Display Tabs with Edit Forms
                            <Tabs.Root orientation="horizontal" className="w-full flex flex-col tab-root" defaultValue="geolocation">
                                <Tabs.List className="list-none md:grid md:grid-cols-7 grid grid-cols-2 gap-2  md:mx-3 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                    <Tabs.Tab value="basic_details" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                        Basic Details
                                    </Tabs.Tab>
                                    <Tabs.Tab value="geolocation" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                        Geolocation
                                    </Tabs.Tab>
                                    <Tabs.Tab value="facility_contacts" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                        Facility contacts
                                    </Tabs.Tab>
                                    <Tabs.Tab value="regulation" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                        Regulation
                                    </Tabs.Tab>
                                    <Tabs.Tab value="services" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                        Services
                                    </Tabs.Tab>
                                    <Tabs.Tab value="infrastructure" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                        Infrastructure
                                    </Tabs.Tab>
                                    <Tabs.Tab value="human_resource" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                        Human Resources
                                    </Tabs.Tab>
                                </Tabs.List>
                                {/* Basic Details */}
                                <Tabs.Panel value="basic_details" className="grow-1 py-1 px-4 tab-panel">   
                                    <Formik
                                            initialValues={{ 
                                                official_name: official_name ?? '',  
                                                name: official_name ?? '', 
                                                facility_type: '',
                                                date_established: date_established ?? '',
                                                accredited_lab_iso_15189: accredited_lab_iso_15189 ?? false,
                                                number_of_beds: number_of_beds ?? '',
                                                number_of_cots: number_of_cots ?? '',
                                                number_of_emergency_casualty_beds: number_of_emergency_casualty_beds ?? '',
                                                number_of_general_theatres: number_of_general_theatres ?? '',
                                                number_of_hdu_beds: number_of_hdu_beds ?? '',
                                                number_of_icu_beds: number_of_icu_beds ?? '',
                                                number_of_isolation_beds: number_of_isolation_beds ?? '',
                                                number_of_maternity_beds: number_of_maternity_beds ?? '',
                                                number_of_maternity_theatres: number_of_maternity_theatres ?? '',
                                                facility_catchment_population: facility_catchment_population ?? '',
                                                reporting_in_dhis: reporting_in_dhis ?? '',
                                                nhif_accreditation: nhif_accreditation ?? '',
                                                is_classified: is_classified ?? '',
                                                open_whole_day: open_whole_day ?? '',
                                                open_weekends: open_weekends ?? '',
                                                open_public_holidays: open_public_holidays ?? '',
                                                open_normal_day: open_normal_day ?? '',
                                                open_late_night: open_late_night ?? '',
                                                town_name: town_name ?? '',
                                                location_desc: location_desc ?? '',
                                                plot_number: plot_number ?? '',
                                                nearest_landmark: nearest_landmark ?? '',
                                            }}


                                            onSubmit={(values) => {
                                                // Ensure isSaveChnages is false
                                                setIsSavedChanges(false)
                                                let formData = values
                                                formData['facility_type'] = facilityTypeRef.current.state.value.value
                                                formData['operation_status'] = operationStatusRef.current.state.value.value
                                                formData['owner_type'] = ownerTypeOptionsRef.current.state.value.value
                                                formData['owner'] = ownerDetailsRef.current.state.value.value
                                                formData['keph_level'] = kephLvlRef.current.state.value.value
                                                formData['county_id'] = countyRef.current.state.value.value
                                                formData['sub_county_id'] = subCountyRef.current.state.value.value
                                                formData['constituency_id'] = constituencyRef.current.state.value.value
                                                formData['ward'] = wardRef.current.state.value.value

                                                let payload = {}

                                                const _payload = _.omit(formData, function (v, k) { return basicDetailsData[k] === v})
                                                if(officer_in_charge) {
                                                    payload = {..._payload, officer_in_charge}
                                                }
                                                else{
                                                    payload = {..._payload, 
                                                        officer_in_charge: {
                                                            contacts: [],
                                                            id_number: null,
                                                            name: "",
                                                            reg_no: "",
                                                            title: "",
                                                            title_name: ""
                                                        }
                                                    }
                                                
                                                }

                                            
                                              handleBasicDetailsUpdates(payload, id, alert)
                                              .then(({statusText}) => {
                                               defer(() => setIsSavedChanges(true))
                                                let update_id
                                                if(statusText == 'OK'){

                                                
                                                        fetch(`/api/facility/get_facility/?path=facilities&id=${id}`).then(async resp => {

                                                            const results = await resp.json()
                                                            
                                                            update_id = results?.latest_update
                                                            code = results?.code

                                                      
                                                            if(update_id){
                                                               
                                                                try{
                                                                    facilityUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                                                                    setFacilityUpdateData(facilityUpdateData)                                                     
                                                                }
                                                                catch(e){
                                                                    console.error('Encountered error while fetching facility update data', e.message)
                                                                }
                                                            }
                                                        })
                                                        .catch(e => console.error('unable to fetch facility update data. Error:', e.message))                                
                                                    }
                                                  
                                                })
                                                .catch(e => console.error('unable to fetch facility data. Error:', e.message))
                                        
                                                        
                                            }}
                                            >							


                                        <Form className='flex flex-col w-full items-start justify-start gap-3 md:mt-6'>
                                            {/* Facility Official Name */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="official_name" className="text-gray-600 capitalize text-sm">Facility Official Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required type="text" name="official_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* Facility Unique Name  */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="name" className="text-gray-600 capitalize text-sm">Facility Unique Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required type="text" name="name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
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
                                                name="facility_type" 
                                                
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

                                                                        if(kephLvlRef.current ) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]

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
                                                                        if(kephLvlRef.current ) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
                                                                        return  facilityTypeOptions.filter(({label}) => label == 'DISPENSARY') || []
                                                                        

                                                                    case 'MEDICAL CLINIC':
                                                                        if(kephLvlRef.current ) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
                                                                        return facilityTypeOptions.filter(({label}) => label == 'Medical Clinic') || []																				
                                                                        
                                                                    case 'NURSING HOME':
                                                                        if(kephLvlRef.current ) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 2')[0]
                                                                        
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
                                                                        if(kephLvlRef.current ) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 3')[0]
                                                                        return [
                                                                            facilityTypeOptions.filter(({label}) => label == 'Basic Health Centre')[0] || {},
                                                                            facilityTypeOptions.filter(({label}) => label == 'Comprehensive health Centre')[0] || {}
                                                                            ]

                                                                    case 'MEDICAL CENTRE':
                                                                        if(kephLvlRef.current ) kephLvlRef.current.state.value = kephOptions.filter(({label}) => label === 'Level 3')[0]

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
                                                <label htmlFor="operation_status" className="text-gray-600 capitalize text-sm">Operation Status <span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Select 
                                                ref={operationStatusRef}
                                                options={operationStatusOptions || []} 
                                                required
                                                placeholder="Select an operation status..."
                                                onChange={
                                                ev => {
                                                    setOperationStatus(ev.value) 
                                                }
                                                }
                                                name="operation_status" 
                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                            </div>

                                            {/* Date Established */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="date_established" className="text-gray-600 capitalize text-sm">Date Established<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required type="date" name="date_established" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* Is Facility accredited */}
                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                <div className="w-full flex flex-row items-center px-2 gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="accredited_lab_iso_15189" id="accredited_lab_iso_15189" />
                                                    <label htmlFor="accredited_lab_iso_15189" className="text-gray-700 capitalize text-sm flex-grow"> *Is the facility accredited Lab ISO 15189?</label>    
                                                </div>
                                            </div>

                                            {/* Owner Category */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="owner_type" className="text-gray-600 capitalize text-sm">Owner Category<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Select 
                                                    ref={ownerTypeOptionsRef}
                                                    options={ownerTypeOptions || []} 
                                                    required
                                                    placeholder="Select owner.."
                                                    onChange={
                                                        (e) => setOwnerTypeOption(e.label) 
                                                    }
                                                    name="owner_type" 
                                                    className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                            </div>

                                            {/* Owner Details */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="owner" className="text-gray-600 capitalize text-sm">Owner Details<span className='text-medium leading-12 font-semibold'> *</span></label>
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
                                                name="owner" 
                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                            </div>

                                            {/* KEPH Level */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">KEPH Level</label>
                                                <Select 
                                                ref={kephLvlRef}
                                                isDisabled={true}
                                                options={kephOptions ?? []}   
                                                placeholder="Select a KEPH Level.."
                                                onChange={
                                                    ev => ev.preventDefault()
                                                }
                                                
                                                name="keph_level" 
                                                className="flex-none  w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                            </div>

                                            {/* No. Functional general Beds */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_beds" className="text-gray-600 capitalize text-sm">Number of functional general beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. Functional cots */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_cots" className="text-gray-600 capitalize text-sm">Number of functional cots<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_cots" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. Emergency Casulty Beds */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_emergency_casualty_beds" className="text-gray-600 capitalize text-sm">Number of Emergency Casulty Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_emergency_casualty_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. Intensive Care Unit Beds */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_icu_beds" className="text-gray-600 capitalize text-sm">Number of Intensive Care Unit (ICU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_icu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. High Dependency Unit HDU */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_hdu_beds" className="text-gray-600 capitalize text-sm">Number of High Dependency Unit (HDU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_hdu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. of maternity beds */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_maternity_beds" className="text-gray-600 capitalize text-sm">Number of maternity beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_maternity_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. of isolation beds */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_isolation_beds" className="text-gray-600 capitalize text-sm">Number of isolation beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_isolation_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. of General Theatres */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_general_theatres" className="text-gray-600 capitalize text-sm">Number of General Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_general_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* No. of Maternity Theatres */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="number_of_maternity_theatres" className="text-gray-600 capitalize text-sm">Number of Maternity Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="number_of_maternity_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* Facility Catchment Population */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="facility_catchment_population" className="text-gray-600 capitalize text-sm">Facility Catchment Population<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Field required  type="number" name="facility_catchment_population" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* Is Reporting DHIS2 */}
                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                            
                                                <div className="w-full flex flex-row items-center px-2 gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="reporting_in_dhis" id="reporting_in_dhis" />
                                                    <label htmlFor="reporting_in_dhis" className="text-gray-700 capitalize text-sm flex-grow">  *Should this facility have reporting in DHIS2?</label>    
                                                </div>
                                            </div>

                                            {/* Facility Admissions */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="admission_status" className="text-gray-600 capitalize text-sm">Facility admissions<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <Select 
                                                    ref={facilityAdmissionRef}
                                                    options={facilityAdmissionOptions || []} 
                                                    required
                                                    placeholder="Select an admission status.."
                                                
                                                    name="admission_status" 
                                                    className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                            </div>

                                            {/* Is NHIF accredited */}
                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                            
                                                <div className="w-full flex flex-row items-center px-2 gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="nhif_accreditation" id="is_armed_forces" />
                                                    <label htmlFor="nhif_accreditation" className="text-gray-700 capitalize text-sm flex-grow">  *Does this facility have NHIF accreditation?</label>    
                                                </div>
                                            </div>

                                            {/* Armed Forces Facilities */}

                                            <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                                <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Armed Forces Facilities</h4>
                                                <div className="w-full flex flex-row items-center px-2 gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="is_classified" id="is_armed_forces" />
                                                    <label htmlFor="is_classified" className="text-gray-700 capitalize text-sm flex-grow"> Is this an Armed Force facility? </label>    
                                                </div>
                                            </div>

                                            {/* Hours/Days of Operation */}

                                            <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                                <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Hours/Days of Operation</h4>
                                                <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="open_whole_day" id="open_24hrs" />
                                                    <label htmlFor="open_whole_day" className="text-gray-700 capitalize text-sm flex-grow"> Open 24 hours</label>    
                                                </div>

                                                <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="open_late_night" id="open_late_night" />
                                                    <label htmlFor="open_late_night" className="text-gray-700 capitalize text-sm flex-grow"> Open Late Night</label>    
                                                </div>

                                                <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="open_public_holidays" id="open_public_holidays" />
                                                    <label htmlFor="open_public_holidays" className="text-gray-700 capitalize text-sm flex-grow"> Open on public holidays</label>    
                                                </div>

                                                <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="open_weekends" id="open_weekends" />
                                                    <label htmlFor="open_weekends" className="text-gray-700ds capitalize text-sm flex-grow"> Open during weekends</label>    
                                                </div>

                                                <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                    <Field type="checkbox" name="open_normal_day" id="open_8_5" />
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
                                                                <label htmlFor="county_id" className="text-gray-600 capitalize text-sm">County<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                <Select 
                                                                options={countyOptions || []} 
                                                                ref={countyRef}
                                                                required
                                                                placeholder="Select County"
                                                                name="county_id" 
                                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                            </div>
                                                        </div>

                                                        {/* Sub-county */}
                                                        <div className="col-start-2 col-span-1">
                                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                <label htmlFor="sub_county_id" className="text-gray-600 capitalize text-sm">Sub-county<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                <Select 
                                                                options={subCountyOpt ?? subCountyOptions} 
                                                                ref={subCountyRef}
                                                                required
                                                                placeholder="Select Sub County"
                                                                name="sub_county_id" 
                                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                            </div>
                                                        </div>

                                                        {/* Constituency */}
                                                        <div className="col-start-3 col-span-1">
                                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                <label htmlFor="constituency_id" className="text-gray-600 capitalize text-sm">Constituency<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                <Select 
                                                                ref={constituencyRef}
                                                                options={subCountyOpt ?? constituencyOptions} 
                                                                required
                                                                placeholder="Select Constituency"
                                                                name="constituency_id" 
                                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                            </div>
                                                        </div>

                                                        {/* Ward */}
                                                        <div className="col-start-4 col-span-1">
                                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                <label htmlFor="ward" className="text-gray-600 capitalize text-sm">Ward<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                <Select 
                                                                ref={wardRef}
                                                                options={wardOpt ?? wardOptions} 
                                                                required
                                                                placeholder="Select Ward"
                                                                name="ward" 
                                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                            </div>
                                                        </div>

                                                    
                                                </div>

                                                {/* Nearest Town/Shopping Center */}
                                                <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="town_name" className="text-gray-600 capitalize text-sm">Nearest Town/Shopping Center<span className='text-medium leading-12 font-semibold'></span></label>
                                                            <Field  type="text" name="town_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* Plot Number */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="plot_number" className="text-gray-600 capitalize text-sm">Plot number<span className='text-medium leading-12 font-semibold'></span></label>
                                                            <Field type="text" name="plot_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* Nearest landmark */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="nearest_landmark" className="text-gray-600 capitalize text-sm">Nearest landmark<span className='text-medium leading-12 font-semibold'></span></label>
                                                            <Field  type="text" name="nearest_landmark" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>

                                                        {/* Location Description */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="location_desc" className="text-gray-600 capitalize text-sm">location description<span className='text-medium leading-12 font-semibold'></span></label>
                                                            <Field  type="text"  name="location_desc" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>
                                            </div>

                                            {/* check file upload */}
                                            <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto">
                                                <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                    <label htmlFor="facility_checklist_document" className="text-gray-600 capitalize text-sm">checklist file upload<span className='text-medium leading-12 font-semibold'></span></label>
                                                    <Field type="file" ref={checklistFileRef} value={_checklistFile} onChange={setCheckListFile} name="facility_checklist_document" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                </div>
                                            </div>

                                            <div className=" w-full flex justify-end h-auto mr-3">
                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                                            </div>
                                        </Form>      
                                    </Formik>                        
                                </Tabs.Panel>
                                {/* Geolocation */}
                                <Tabs.Panel value="geolocation"
                                className="grow-1 py-1 px-4 tab-panel">
                                    <Formik
                                        initialValues={{
                                            collection_date: collection_date ?? '',
                                            latitude: lat_long ? lat_long[0] ?? '' : '',
                                            longitude: lat_long ? lat_long[1] ?? '' : ''
                                        }}

                                        onSubmit={formData => {
                                            // Ensure isSaveChnages is false
                                            setIsSavedChanges(false)
                                            let payload = {}
                                            const _payload = _.omit(formData, function (v, k) { return geolocationData[k] === v})
                                            
                                            payload = {..._payload, facility: id, coordinates:{coordinates:[lat_long[1], lat_long[0]], type:'point'}}

                                            payload['collection_date'] = new Date(payload.collection_date)
                                        
                                            handleGeolocationUpdates(payload, coordinates, alert)
                                            .then(({statusText}) => {
                                                defer(() => setIsSavedChanges(true))
                                                 let update_id
                                                 if(statusText == 'OK'){
 
                                                 
                                                         fetch(`/api/facility/get_facility/?path=facilities&id=${id}`).then(async resp => {
 
                                                             const results = await resp.json()
                                                             
                                                             update_id = results?.latest_update
                                                            
                                                             if(update_id){
                                                                
                                                                 try{
                                                                     facilityUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                                                                     setFacilityUpdateData(facilityUpdateData)                                                     
                                                                 }
                                                                 catch(e){
                                                                     console.error('Encountered error while fetching facility update data', e.message)
                                                                 }
                                                             }
                                                         })
                                                         .catch(e => console.error('unable to fetch facility update data. Error:', e.message))                                
                                                     }
                                                   
                                                 })
                                                 .catch(e => console.error('unable to fetch facility data. Error:', e.message))
                                        }}
                                        >
                                        <Form
                                            name='geolocation_form'
                                            className='flex flex-col w-full items-start justify-start gap-3 md:mt-6'
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
                                                <Field
                                                    type='date'
                                                    name='collection_date'
                                                    className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                />
                                        </div>

                                            {/* Lon/Lat */}
                                            <div className='grid grid-cols-3 gap-4 place-content-start w-full'>

                                                {/* Longitude */}
                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 '>
                                                    <label
                                                        htmlFor='longitude'
                                                        className='text-gray-600 capitalize text-sm'>
                                                        Longitude
                                                        <span className='text-medium leading-12 font-semibold'>
                                                            {' '}
                                                            *
                                                        </span>
                                                    </label>
                                                    <Field
                                                        required
                                                        type='decimal'
                                                        name='longitude'                                           
                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                    />
                                                </div>

                                                {/* Latitude */}
                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 '>
                                                    <label
                                                        htmlFor='latitude'
                                                        className='text-gray-600 capitalize text-sm'>
                                                        Latitude
                                                        <span className='text-medium leading-12 font-semibold'>
                                                            {' '}
                                                            *
                                                        </span>
                                                    </label>
                                                    <Field
                                                        required
                                                        type='decimal'
                                                        name='latitude'
                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                    />
                                                </div>

                                                {/* Accuracy */}
                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 '>
                                                    <label
                                                        htmlFor='accuracy'
                                                        className='text-gray-600 capitalize text-sm'>
                                                        Accurcay
                                                       
                                                    </label>
                                                    <Field
                                                        
                                                        type='decimal'
                                                        name='accuracy'
                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                    />
                                                </div>
                                            </div>

                                            {/* Ward Geo Map */}
                                            <div className='w-full h-auto'>
                                                        
                                                <div className='w-full bg-gray-200  rounded flex flex-col items-start justify-center text-left relative'>
                                                    <Map markerCoordinates={[_lat.length < 4 ? '0.000000' : _lat, _long.length < 4 ? '0.000000' : _long]} geoJSON={gJSON} ward={wardName} center={centerCoordinates} />
                                                </div>
                    
                                            </div>

                                            {/* Next/Previous Form  */}
                                            <div className=" w-full flex justify-end h-auto mr-3">
                                                <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                                            </div>
                                        </Form>
                                    </Formik>
                                    
                                </Tabs.Panel>
                                {/* Facility contacts */}
                                <Tabs.Panel value="facility_contacts" className="grow-1 py-1 px-4 tab-panel">
                                    <Formik
                                        initialValues={{
                                            name: officer_in_charge  ? officer_in_charge.name : '',
                                            reg_no: officer_in_charge  ? officer_in_charge.reg_no : '',
                                            contact: facility_contacts  ? facility_contacts.length > 0 ?  facility_contacts[0].contact : '' :  ''
                                        }}

                                        onSubmit={formData => {
                                            let payload = {}
                                        
                                            const contact = facilityContactDetailRef.current  ? facilityContactDetailRef.current.value : ''

                                            const contactType = contactRef.current  ? contactRef.current.state.value.value : ''

                                            const contactTypeName = contactRef.current  ? contactRef.current.state.value.label : ''

                                            const jobTitle = jobTitleRef.current  ? jobTitleRef.current.state.value.value : ''

                                            const jobTitleName = jobTitleRef.current  ? jobTitleRef.current.state.value.label : ''

                                            const _payload = _.omit(formData, function (v, k) { return facilityContactsData[k] === v})

                                            if(officer_in_charge ) Object.keys(_payload).forEach(k => officer_in_charge[k] = _payload[k])

                                            _payload['title'] = jobTitle

                                            _payload['titleName'] = jobTitleName

                                            _payload['contacts'] = [{
                                                contact,
                                                contact_id: facility_contacts[0]?.contact_id,
                                                contact_type_name: contactTypeName,
                                                official_contact_id:facility_contacts[0]?.id,
                                                type: contactType
                                            }]

                                           

                                            payload = {officer_in_charge:_payload, contacts:[]}


                                            handleFacilityContactsUpdates(payload, id, alert)
                                            .then(({statusText}) => {
                                                defer(() => setIsSavedChanges(true))
                                                 let update_id
                                                 if(statusText == 'OK'){
 
                                                 
                                                         fetch(`/api/facility/get_facility/?path=facilities&id=${id}`).then(async resp => {
 
                                                             const results = await resp.json()
                                                             
                                                             update_id = results?.latest_update
                                                            
                                                       
                                                             if(update_id){
                                                                
                                                                 try{
                                                                     facilityUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                                                                     setFacilityUpdateData(facilityUpdateData)                                                     
                                                                 }
                                                                 catch(e){
                                                                     console.error('Encountered error while fetching facility update data', e.message)
                                                                 }
                                                             }
                                                         })
                                                         .catch(e => console.error('unable to fetch facility update data. Error:', e.message))                                
                                                     }
                                                   
                                                 })
                                                 .catch(e => console.error('unable to fetch facility data. Error:', e.message))

                                            }}
                                        >
                                    
                                        <Form
                                            className='flex flex-col w-full items-start justify-start gap-3 md:mt-6'
                                            name='facility_contacts_form'
                                            >
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
                                                <FacilityContact 
                                                contactRef={contactRef} 
                                                inputContactRef={facilityContactDetailRef}
                                                setContactDetail={null} 
                                                contactTypeOptions={contactTypeOptions} 
                                                names={['contact_type', 'contact']} 
                                                id={'facility'} 
                                                contact={facility_contacts ? facility_contacts.length > 0 ?  facility_contacts[0].contact : '' :  ''}
                                                />

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
                                                        htmlFor='name'
                                                        className='text-gray-600 capitalize text-sm'>
                                                        Name
                                                        <span className='text-medium leading-12 font-semibold'>
                                                            {' '}
                                                            *
                                                        </span>
                                                    </label>
                                                    
                                                    <Field
                                                        required
                                                        type='text'
                                                        name='name'
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
                                                    <Field
                                                        type='text'
                                                        name='reg_no'
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
                                                        ref={jobTitleRef}
                                                        placeholder="Select Job Title"																	
                                                        name="title" 
                                                        className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
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

                                                    <FacilityContact 
                                                    contactRef={otherContactRef} 
                                                    setContactDetail={null} 
                                                    inputContactRef={officerInchargeContactDetailRef}
                                                    contactTypeOptions={contactTypeOptions} 
                                                    names={['facility_details_contact_type', 'faciliity_details_contact']} 
                                                    id={'facility_officer'}  
                                                    contact={officer_in_charge ? officer_in_charge.length > 0 ?  officer_in_charge[0].contact : '' :  ''}/>

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
                                            {/* Save btn */}

                                            <div className=" w-full flex justify-end h-auto mr-3">
                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                                            </div>
                                        </Form>
                                    </Formik>
                                </Tabs.Panel>
                                {/* Regulation */}
                                <Tabs.Panel value="regulation" className="grow-1 py-1 px-4 tab-panel">
                                    <Formik
                                        initialValues={{
                                            facility_license_number: facility_units ? facility_units[0]?.license_number ?? '' : '',
                                            registration_number: registration_number ?? '',
                                            license_document: facility_license_document ?? '',
                                            facility_registration_number: registration_number ?? '',
                                            license_number: license_number ?? ''
                                        }}

                                        onSubmit={formData => {
                                            

                                            const regulatoryBody = regulatoryBodyRef.current  ? regulatoryBodyRef.current.state.value.value : ''
                                            const regulationStatus = regulatoryStateRef.current ? regulatoryStateRef.current.state.value.value : ''
                                            const facilityRegulatingBody = regBodyRef.current ? regBodyRef.current.value : ''
                                            const facilityUnit =  facilityDeptNameRef.current  ? facilityDeptNameRef.current.state.value.value : ''

                                            const payload = {...formData, regulatory_body:regulatoryBody, regulation_status:regulationStatus}

                                            delete payload['license_document']
                                            delete payload['facility_license_number']
                                            delete payload['facility_registration_number']

                                        handleRegulationUpdates(payload, id, alert, "Facility Regulation updated successfully")
                                        .then(({statusText}) => {
                                                defer(() => setIsSavedChanges(true))
                                                 let update_id
                                                 if(statusText == 'OK'){

                                                         fetch(`/api/facility/get_facility/?path=facilities&id=${id}`).then(async resp => {
 
                                                             const results = await resp.json()
                                                             
                                                             update_id = results?.latest_update
                                                            
                                                       
                                                             if(update_id){
                                                                
                                                                 try{
                                                                     facilityUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                                                                     setFacilityUpdateData(facilityUpdateData)                                                     
                                                                 }
                                                                 catch(e){
                                                                     console.error('Encountered error while fetching facility update data', e.message)
                                                                 }
                                                             }
                                                         })
                                                         .catch(e => console.error('unable to fetch facility update data. Error:', e.message))                                
                                                     }
                                                   
                                                 })
                                                 .catch(e => console.error('unable to fetch facility data. Error:', e.message))
                                            }
                                            }
                                         >
                                        <Form  name="facility_regulation_form" className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                                            {/* Regulatory Body */}
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                    <label htmlFor="regulatory_body"  className="text-gray-600 capitalize text-sm">Regulatory Body<span className='text-medium leading-12 font-semibold'> *</span> </label>
                                                    {
                                                        ownerTypeName === 'Ministry of Health' ?
                                                        // Filtered Regulaotry Body Options

                                                        <Select 
                                                        ref={regulatoryBodyRef} 
                                                        options={filteredRegBodyOptions || []} 
                                                        required
                                                        onChange={ev => {
                                                            setIsPendingRegistration(false)
                                                            if(ev.label === 'Pending Registration') setIsPendingRegistration(true)
                                                        }}
                                                        placeholder="Select Regulatory Body"
                                                        name='regulatory_body'
                                                        className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />

                                                        :

                                                        <Select 
                                                        ref={regulatoryBodyRef} 
                                                        options={regBodyOptions || []} 
                                                        required
                                                        onChange={ev => {
                                                            setIsPendingRegistration(false)
                                                            if(ev.label === 'Pending Registration') setIsPendingRegistration(true)
                                                        }}
                                                        placeholder="Select Regulatory Body"
                                                        name='regulatory_body'
                                                        className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    }
                                                    
                                                    

                                            </div>

                                            {/* Regulation Status */} 
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="regulation_status" className="text-gray-600 capitalize text-sm">Regulation Status</label>
                                                {console.log({ownerTypeName, filteredRegulationStateOptions})}
                                                {
                                                
                                                ownerTypeName === 'Ministry of Health' ?

                                                  //    Filtered Regulatory State Options

                                                  <Select 
                                                  ref={regulatoryStateRef}
                                                      options={filteredRegulationStateOptions || []} 
                                                      required
                                                      onChange={ev => {
                                                          setIsPendingLicense(false)
                                                          if(ev.label === 'Pending License') setIsPendingLicense(true)
                                                      }}
                                                      placeholder="Select Regulation Status"
                                                      name='regulation_status'
                                                      className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                               :

                                               <Select 
                                                        ref={regulatoryStateRef}
                                                        options={regulationStateOptions || []} 
                                                        required
                                                        onChange={ev => {
                                                            setIsPendingLicense(false)
                                                            if(ev.label === 'Pending License') setIsPendingLicense(true)
                                                        }}
                                                        placeholder="Select Regulation Status"
                                                        name='regulation_status'
                                                        className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                              
                                                    }

                                                </div>

                                            {/* License Number */} 
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="license_number" className="text-gray-600 capitalize text-sm">License Number
                                                {isPendingLicense ? ' *': ''}
                                                </label>
                                                {
                                                isPendingLicense ? 
                                                <Field  required type="text" name="license_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                : 
                                                <Field  type="text" name="license_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                }
                                                
                                            </div>

                                              {/* Licensing Body */} 
                                              <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                    <label htmlFor="regulatory_body"  className="text-gray-600 capitalize text-sm">Licensing Body<span className='text-medium leading-12 font-semibold'> *</span> </label>
                                                    <Select 
                                                        ref={regulatoryBodyRef} 
                                                        options={regBodyOptions || []} 
                                                        required
                                                        onChange={ev => {
                                                            setIsPendingRegistration(false)
                                                            if(ev.label === 'Pending Registration') setIsPendingRegistration(true)
                                                        }}
                                                        placeholder="Select Licensing Body"
                                                        name='regulatory_body'
                                                        className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />

                                            </div>

                                            {/* Registration Number */} 
                                            <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="registration_number" className="text-gray-600 capitalize text-sm">Registration Number
                                                {isPendingRegistration ? ' *': ''}
                                                </label>
                                                {
                                                isPendingRegistration ? 
                                                <Field required type="text" name="registration_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                :
                                                <Field type="text" name="registration_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

                                                }
                                                </div>

                                            {/* check file upload */}
                                            <div className=" w-full flex flex-col items-start justify-start p-3 rounded h-auto">
                                                <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                    <label htmlFor="license_document" className="text-gray-600 capitalize text-sm">Upload license document</label>
                                                    <Field type="file" name="license_document" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
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
                                                <Select options={facilityDeptOptions || []} 
                                                    required
                                                    placeholder="Select Name"
                                                    ref={facilityDeptNameRef}
                                                    onChange={
                                                        e => {
                                                            if(regBodyRef.current){
                                                            
                                                                regBodyRef.current.value = facilityDeptOptions.filter(({label}) => label === e.label)[0].reg_body_name
                                                            }
                                                        }
                                                    }
                                                    name="facility_dept_name" 
                                                    className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                
                                                {/* Regulatory Body */}
                                                <input type="text" ref={regBodyRef} disabled name="facility_regulatory_body" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

                                                {/* License No. */}
                                                <Field type="text" name="facility_license_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

                                                <div className='col-start-4 flex items-center space-x-2 w-full'>
                                                    {/* Reg No. */}
                                                    <Field type="text" name="facility_registration_number" className="flex-none  bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                
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

                                            {/* Save btn */}

                                            <div className=" w-full flex justify-end h-auto mr-3">
                                                <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                                            </div>
                                        </Form>
                                    </Formik>
                                
                                </Tabs.Panel>
                                {/* Services */}
                                <Tabs.Panel value="services" className="grow-1 py-1 px-4 tab-panel">
                                    {/* {console.log({selectedServiceRight, services})} */}
                                    <form name="facility_services_form" className='flex  flex-col w-full items-start justify-start gap-3 mt-6'  onSubmit={
                                       async ev => {

                                            ev.preventDefault()

                                            let getServiceId
                                      
                                            if(btnDir === 'left'){ 
                                             getServiceId = await (async () => {
                                                
                                                    // console.log({services})
                                                    // fetch facility_id
                                                    try{
                                                       
                                                       return (await (await fetch(`/api/facility/get_facility/?path=facility_services&id=${id}`)).json()).results
                                                
                                                    }catch(e){
                                                        console.error('Unable to fetch facility_service_id: ', e.message)
                                                    }
                                                


                                            })()

                                            // getServiceId.then(value => {
                                            //     console.log({value})
                                            // }).catch(console.error)

                                            // console.log({getServiceId})

                                           }
                                            else {

                                            getServiceId = (() => services[services.length - 1])()

                                            }


                                            console.log({getServiceId})
                                          
  
                                            
                                               /* handleServiceUpdates(ev, [selectedServiceRight, id], alert, "Facility Services updated successfully")
                                                .then(({statusText}) => {
                                                    defer(() => setIsSavedChanges(true))
                                                    let update_id
                                                    if(statusText == 'OK'){

                                                            fetch(`/api/facility/get_facility/?path=facilities&id=${id}`).then(async resp => {
    
                                                                const results = await resp.json()
                                                                
                                                                update_id = results?.latest_update
                                                                
                                                                if(update_id){
                                                                    console.log({update_id})
                                                                    
                                                                    try{
                                                                        facilityUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                                                                        setFacilityUpdateData(facilityUpdateData)                                                     
                                                                    }
                                                                    catch(e){
                                                                        console.error('Encountered error while fetching facility update data', e.message)
                                                                    }
                                                                }
                                                            })
                                                            .catch(e => console.error('unable to fetch facility update data. Error:', e.message))                                
                                                        }
                                                    
                                                    })
                                                    .catch(e => console.error('unable to fetch facility data. Error:', e.message))*/
                                                }
                                         }>
                                                           
                                                    {/* Transfer list Container */}
                                                    <div className='flex items-center w-full h-auto min-h-[300px]'>                                  
                                                    {/* {console.log({services})} */}
                                                    <TrasnferListServices 
                                                        categories={serviceOptions}
                                                        setServices={setServices}
                                                        setRefreshForm4={setRefreshForm4}
                                                        refreshForm4={refreshForm4}
														setBtnDirection={setBtnDir}
                                                        selectedRight={serviceSelected}
                                                        setSelectedServiceRight={setSelectedServiceRight}
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
                                                                selectedServiceRight && selectedServiceRight.length > 0 ? 

                                                                selectedServiceRight.map(ctg => ctg.subCategories).map((service, i) => (
                                                                    <tr key={`${service}_${i}`} className='grid grid-cols-2 place-content-end border-b-2 border-gray-300'>
                                                                        <td ref={nameOptionRef}>{service}</td>
                                                                        <td ref={serviceOptionRef} className='ml-12 text-base'>Yes</td>
                                                                    </tr>
                                                                ))
                                                                :
                                                                services.map(({subctg}) => subctg).map((service, i) => (
                                                                    <tr key={`${service}_${i}`} className='grid grid-cols-2 place-content-end border-b-2 border-gray-300'>
                                                                        <td ref={nameOptionRef}>{service}</td>
                                                                        <td ref={serviceOptionRef} className='ml-12 text-base'>Yes</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        
                                                        </tbody>
                                                    </table>
                                                    
                                                    {/* Save btn */}

                                                    <div className=" w-full flex justify-end h-auto mr-3">
                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                                                    </div>
                                              
                                         
                                    </form>
                                </Tabs.Panel>
                                {/* Infrastructure */}
                                <Tabs.Panel value="infrastructure" className="grow-1 py-1 px-4 tab-panel">
                                    <form name="facility_infrastructure_form" onSubmit={ev => handleInfrastructureUpdates(ev, [infrastructure, infrastructureCount, setFormId, facilityId], 'PATCH')}  className='flex flex-col w-full items-start justify-start gap-3 mt-6'>
                                                            
                                        {/* Transfer list Container */}
                                        <div className='flex items-center w-full h-auto min-h-[300px]'>
                                        
                                        {/* Transfer List*/}

                                        <TransferListInfrastructure 
                                            categories={
                                                infrastructureOption
                                            } 
                                            setState={setInfrastructure}
                                            setCount={setInfrastructureCount}
                                            setRefreshForm5={setRefreshForm5}
                                            refreshForm5={refreshForm5}
                                            selectedInfraRight={infrastructureSelected}
                                            setSelectedInfraRight={setSelectedInfraRight}
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
                                                    selectedInfraRight && selectedInfraRight.length > 0 ? 

                                                    selectedInfraRight.map(({subCategories, value:vs}, i) => (
                                                                                            
                                                

                                                    <tr key={`${subCategories[0]}_${i}`} className='grid grid-cols-4 place-content-end border-b-2 border-gray-300'>
                                                    
                                                        <td className='text-lg text-black'>{subCategories[0]}</td>
                                                        <td className='text-lg text-black'>{infrastructureOption.filter(({value}) =>  value.includes(vs[0]))[0].name}</td>

                                                        <td className='text-lg text-black'>Yes</td>
                                                        <td className='text-lg  text-black'>{facility_infrastructure.filter(({infrastructure}) => infrastructure === vs[0])[0].count}</td>
                                                    </tr>
                                                        
                                                    
                                                    ))

                                                    :

                                                    infrastructure.map(({subctg}) => subctg).map((_infrastructure, i) => (
                                                        <tr key={`${_infrastructure}_${i}`} className='grid grid-cols-4 place-content-end border-b-2 border-gray-300'>
                                                            <td className='text-lg text-black'>{_infrastructure}</td>
                                                            <td className='text-lg text-black'>{infrastructureOption.filter(({subCategories}) => subCategories.includes(_infrastructure))[0].name}</td>
                                                            <td className='text-lg text-black'>Yes</td>
                                                            <td className='text-lg  text-black'>{infrastructureCount.filter(({name}) => name == _infrastructure)[0].val || 0}</td>
                                                        </tr>
                                                    ))
                                                }
                                            
                                            
                                            </tbody>
                                        </table>
                                        
                                        {/* Save btn */}

                                        <div className=" w-full flex justify-end h-auto mr-3">
                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                                        </div>

                                    </form>
                                </Tabs.Panel>
                                {/* Human Resources */}
                                <Tabs.Panel value="human_resource" className="grow-1 py-1 px-4 tab-panel">
                                    <form name="facility_services_form" onSubmit={ev => handleHrUpdates(ev, [hr, hrCount, facilityId, setFormId], 'PATCH')} className='flex flex-col w-full items-start justify-start gap-3 mt-6'>
                                                        
                                                        {/* Transfer list Container */}
                                                        <div className='flex items-center w-full h-auto min-h-[300px]'>
                                                        
                                                        {/* Transfer List*/}
                                                        
                                                        <TransferListHr 
                                                            categories={hrOptions} 
                                                            setState={setHr}
                                                            setRefreshForm6={setRefreshForm6}
                                                            refreshForm6={refreshForm6}
                                                            setCount={setHrCount}
                                                            selectTitle='HR Specialities'
                                                            setSelectedHrRight={setSelectedHrRight}
                                                            selectedHrRight={hrSelected}
                                                        

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
                                                                    selectedHrRight ? 

                                                                    selectedHrRight?.map(({subCategories, value:vs}, i) => (
                                                                                                                
                                                                    
                                                                    <tr key={`${subCategories[0]}_${i}`} className='grid grid-cols-4 place-content-end border-b-2 border-gray-300'>
                                                                    
                                                                        <td className='text-lg text-black'>{subCategories[0]}</td>
                                                                        <td className='text-lg text-black'>{hrOptions.filter(({value}) =>  value.includes(vs[0]))[0].name}</td>

                                                                        <td className='text-lg text-black'>Yes</td>
                                                                        <td className='text-lg  text-black'>{facility_specialists.filter(({speciality}) => speciality === vs[0])[0].count}</td>
                                                                    </tr>
                                                                    ))
                                                                    :
                                                                    
                                                                    hr.map(({subctg}) => subctg).map((_hr, i) => (
                                                                        <tr key={`${_hr}_${i}`} className='grid grid-cols-3 place-content-end border-b-2 border-gray-300'>
                                                                            <td className='text-lg text-black'>{_hr}</td>
                                                                            <td className='text-lg text-black'>Yes</td>
                                                                            <td className='text-lg  text-black'>{hrCount.filter(({name}) => name == _hr)[0].val || 0}</td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            
                                                            
                                                            </tbody>
                                                        </table>

                                                        {/* Save btn */}

                                                        <div className=" w-full flex justify-end h-auto mr-3">
                                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                                                        </div>
                                                        
                                                    
                                    </form> 
                                </Tabs.Panel>
            
                            </Tabs.Root>
                        }
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
		'infrastructure',
		'specialities',
        'facility_data',
        'collection_date',
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

									let results = (await _data.json()).results.map(({id, sub_division, name }) => sub_division  ? {value:id, label:sub_division} : {value:id, label:name}) ?? [{value: '', label: ''}]

							
									allOptions.push({facility_types: results })
									
								}
								catch(err) {
									console.log(`Error fetching ${option}: `, err);
									allOptions.push({
										error: true,
										err: err.message,
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
										err: err.message,
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
										err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
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
									err: err.message,
									service: null,
								})
							}


						break;

                        case 'collection_date':
                        
                            try{
                               const response = await fetch(`/api/facility/get_facility/?path=facility_coordinates&id=${ctx.query.id}`)

                               const [_result] = (await response.json()).results
  
                                
                               allOptions.push({collection_date: _result['collection_date']})
                            }
                            catch(err) {
                                console.log(`Error fetching ${option}: `, err);
                                        allOptions.push({
                                            error: true,	
                                            err: err.message,
                                            collection_date: null,
                                        })
                            }
                    
                        

                        break;       

                        case 'facility_data':

							try{
		
								const _data = await fetch(`/api/facility/get_facility/?path=facilities&id=${ctx.query.id}`) 
                           
                                allOptions.push({data: (await _data.json())})
                             
                                if(_data){
                            

                                    try{
		
                                        const response = await fetch(`/api/facility/get_facility/?path=wards&id=${allOptions[18].data.ward}`)
        
                                        const _data = await response.json()
               
                                        const [lng, lat] = _data?.ward_boundary.properties.center.coordinates 
        
                                        allOptions.push({
                                            geolocation: {
                                                gJSON: JSON.parse(JSON.stringify(_data?.ward_boundary)), 
                                                centerCoordinates: JSON.parse(JSON.stringify([lat, lng]))
                                        }})
                                        
                                        
                                    }
                                    catch(err) {
                                        console.log(`Error fetching ${option}: `, err);
                                        allOptions.push({
                                            error: true,	
                                            err: err.message,
                                            geolocation: null,
                                        })
                                    }
                                }

								
								
							}
							catch(err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,	
									err: err.message,
									data: null,
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

								
								url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=${fields}&page_size=20000&page=1`;

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
										err: err.message,
										data: []
									});
								}
								break;

					}
				}



				return allOptions

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
                err: err.message,
                data: [],
            }
        }, 1000);
    })
}

export default EditFacility