// React imports
import React, { useState, useEffect, useRef } from 'react';

// Next imports
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Components imports
import MainLayout from '../../../components/MainLayout';
import TrasnferListServices from '../../../components/TrasnferListServices';

// Controller imports
import { approveRejectCHU, rejectCHU } from '../../../controllers/reject';
import { checkToken } from '../../../controllers/auth/auth';

// Heroicons imports
import { ArrowsExpandIcon } from '@heroicons/react/outline';

// Package imports
import * as Tabs from '@radix-ui/react-tabs';
import { ChevronDownIcon } from '@heroicons/react/solid';
import
{
  CheckCircleIcon,
  ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import Select from 'react-select';
import { ContactPageSharp } from '@mui/icons-material';

const CommUnit = (props) => {
  const facilities = props.facility_data.results;

  let cu = props.data;
  let _id
  _id = cu.id;  
  
  console.log('this is the name',cu.services)

  // State of the different tabs
  const [chulId, setchulId] = useState('');
 

  // State of the different form fields
  const [_name, setName] = useState(cu.name);
  const [_dateEstablished, setDateEstablished] = useState(cu.date_established ?? '')
  const [_dateOperational, setDateOperational] = useState(cu.date_operational ?? '')
  const [_noOfMonitoredHouseholds, setNoOfMonitoredHouseholds] = useState(cu.households_monitored ?? '')
  const [_noOfCHVs, setNoOfCHVs] = useState(cu.number_of_chvs ?? '')
  const [_firstName, setFirstName] = useState(cu.health_unit_workers[0].first_name); 
  const [_lastName, setLastName] = useState(cu.health_unit_workers[0].last_name);


  // Changing the value of the linked facility and its locality
  const [selected_facility, setSelectedFacility] = useState('');
  const [countyValue, setCountyValue] = useState('');
	const [subCountyValue, setSubCountyValue] = useState('');
	const [constituencyValue, setConstituencyValue] = useState('');
	const [wardValue, setWardValue] = useState('');

  // Dropdown States
  const [operationStatus, setOperationStatus] = useState([]);
  const [linkedFacility, setLinkedFacility] = useState('');
 
  // Services states
  const [services, setServices] = useState([])
	const [refreshForm, setRefreshForm] = useState(false)
  const [selectedServiceRight, setSelectedServiceRight] = useState()

  // Form Fields Ref
  const nameRef = useRef();
  const linkedFacilityRef = useRef(null)
  const operationStatusRef = useRef(null)
  const dateEstablishedRef = useRef(null)
  const dateOperationalRef = useRef(null)
  const monitoredHouseholdsRef = useRef(null)
  const noOfCHVsRef = useRef(null)


 	// Reference hooks for the services section
	const nameOptionRef = useRef();
	const serviceCategoriesRef = useRef();
	const optionRefBody = useRef();


  const [user, setUser] = useState(null);
  const [isCHUDetails, setIsCHUDetails] = useState(true);
  const [isApproveReject, setIsApproveReject] = useState(false);

  useEffect(() =>
  {
    if (typeof window !== 'undefined')
    {
      let usr = window.sessionStorage.getItem('user');
      if (usr && usr.length > 0)
      {
        setUser(JSON.parse(usr));
      }
    }
    return () =>
    {
      setchulId(_id);
      setIsCHUDetails(true);
      setIsApproveReject(false);
    };
    
  }, [cu, refreshForm, selectedServiceRight, services]);

  const handleBasicDetails = (event) => {
    event.preventDefault();

    let basicDetails = {};
    let formData = {
      name: cu.name,
      facility: cu.facility,
      status: cu.status,
      date_established: cu.date_established,
      date_operational: cu.date_operational,
      households_monitored: cu.households_monitored,
      number_of_chvs: cu.number_of_chvs,
      facility_county: cu.facility_county,
      facility_sub_county: cu.facility_sub_county,
      facility_constituency: cu.facility_constituency,
      facility_ward: cu.facility_ward,
    };

    const elements = [...event.target];

    elements.forEach(({ name, value }) => {
      basicDetails[name] = value;
    });

    console.log('elements', elements.name);
    console.log('basicDetails', basicDetails);  

    try{
      fetch(`/api/common/submit_form_data/?path=chul_data&id=${_id}`, {
        headers:{
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8'
            
        },
        method:'PATCH',
        body: JSON.stringify({basicDetails})
      })

    }
    catch(e){
      console.error('Unable to patch CHU edit details'. e.message)
    }   
  }

  const handleCHEWs = (event) => {
    event.preventDefault();

    let chewData = {};

    const elements = [...event.target];

    let payload = {}

    elements.forEach(({ name, value }) => {
      switch (name) {
        case 'first_name':
          chewData[name] = value
          break;
        case 'last_name':
          chewData[name] = value
          break;
        case 'is_incharge':
          chewData[name] = value
          break;
      }
    });

    payload = {
      health_unit_workers: [{
        first_name: chewData.first_name,
        last_name: chewData.last_name,
        is_incharge: true
      }]
    }

    try{
      fetch(`/api/common/submit_form_data/?path=edit_chul&id=${_id}`, {
        headers:{
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8'
          
        },
        method:'PATCH',
        body: JSON.stringify({chewData})
      })

    }
    catch(e){
      console.error('Unable to patch CHU Chew details'. e.message)
    }   
  }

  const handleServices = async(event, stateSetters, method) => {
    event.preventDefault();

    const [services, _id, setFormId, setServices] = stateSetters
    const _payload = services.map(({value}) => ({service: value}))

    _payload.forEach(obj => obj['health_unit'] = chulId)

    try{
      fetch(`/api/common/submit_form_data/?path=edit_chul&id=${_id}`, {
        headers:{
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8'
          
        },
        method,
        body: JSON.stringify({aervices:_payload})
      })

    }
    catch(e){
      console.error('Unable to patch CHU edit service details'. e.message)
    } 

    window.sessionStorage.setItem('formId', 1)
    setFormId(window.sessionStorage.getItem('formId'))
    setServices([])
  }


  
  // Define serviceCategories
  let serviceCategories = ((_services) => {
		
		const _serviceCategories = []
		let _values = []
		let _subCtgs = []

		if(_services.length > 0){
			_services.forEach(({name:ctg}) => {
				let allOccurences = _services.filter(({name}) => name === ctg)
				
				allOccurences.forEach(({id, description}) => {
					_subCtgs.push(description)
					_values.push(id)
				})
				
				if(_serviceCategories.map(({name}) => name).indexOf(ctg) === -1){
					_serviceCategories.push({
						name: ctg,
						subCategories:_subCtgs,
						value:_values
					})
				}			
				_values = []
				_subCtgs = []
	
			})
		}		
    console.log('this is the serviceCategories im tryna see',_serviceCategories)

		return _serviceCategories
	 })(props.service_categories.results ?? [])

  const serviceSelected = ((_services) => {
    return _services.map(({ctg, _subCtgs, _values}) => ({
        name: ctg,
        subCategories: [
            _subCtgs
        ],
        value:[
            _values
        ]
    }))
  })(services || []) 

  return (
    <>
      <Head>
        <title>KMHFL - {cu?.name || cu?.official_name}</title>
        <link rel='icon' href='/favicon.ico' />
        <link rel='stylesheet' href='/assets/css/leaflet.css' />
      </Head>

      <MainLayout>
        <div className='w-full grid grid-cols-1 place-content-center md:grid-cols-4 gap-4 md:p-2 my-6'>
          <div className='col-span-4 flex flex-col items-start px-4 justify-start gap-3'>

            {/* Breadcrumb */}
            <div className='flex flex-row gap-2 text-sm md:text-base'>
              <a className='text-green-700' href='/'>
                Home
              </a>{' '}
              {'>'}
              <a className='text-green-700' href='/community-units'>
                Community units
              </a>{' '}
              {'>'}
              <span className='text-gray-500'>
                {cu.name} ( #
                <i className='text-black'>{cu.code || 'NO_CODE'}</i> )
              </span>
            </div>

            {/* Header snippet */}
            <div
              className={
                'col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 ' +
                (cu.active ? 'border-green-600' : 'border-red-600')
              }
            >
              <div className='col-span-6 md:col-span-3'>
                <h1 className='text-4xl tracking-tight font-bold leading-tight'>
                  {cu.name}
                </h1>
                <div className='flex gap-2 items-center w-full justify-between'>
                  <span
                    className={
                      'font-bold text-2xl ' +
                      (cu.code ? 'text-green-900' : 'text-gray-400')
                    }
                  >
                    #{cu.code || 'NO_CODE'}
                  </span>
                  <p className='text-gray-600 leading-tight'>
                    {cu.keph_level_name && 'KEPH ' + cu.keph_level_name}
                  </p>
                </div>
              </div>

              {/* Info snippet */}
              <div className='flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2'>
                <div className='flex flex-wrap gap-3 w-full items-center justify-start md:justify-center'>
                  {cu.is_approved ? (
                    <span className='bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <CheckCircleIcon className='h-4 w-4' />
                      CHU Approved
                    </span>
                  ) : (
                    <span className='bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <XCircleIcon className='h-4 w-4' />
                      Not approved
                    </span>
                  )}
                  {cu.is_closed &&  (
                    <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <LockClosedIcon className='h-4 w-4' />
                      CHU Closed
                    </span>
                  )}
                  {cu.deleted && (
                    <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <XCircleIcon className='h-4 w-4' />
                      CHU Deleted
                    </span>
                  )}
                  {cu.active && (
                    <span className='bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <CheckCircleIcon className='h-4 w-4' />
                      CHU Active
                    </span>
                  )}
                  {cu.has_fffedits && (
                    <span className='bg-blue-200 text-blue-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <InformationCircleIcon className='h-4 w-4' />
                      Has changes
                    </span>
                  )}
                </div>
              </div>
              <div className='col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2'>{}</div>
            </div>
          </div>

          {/* Form */}
          <div className='col-span-1 md:col-span-4 flex flex-col md:gap-3 mt-4'>

            <Tabs.Root orientation='horizontal' className='w-full flex flex-col tab-root' defaultValue='basic_details'>
              {/* Tabs List */}
              <Tabs.List className='list-none md:grid md:grid-cols-3 flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b'>
                <Tabs.Tab value='basic_details' className='p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item'>
                  Basic Details
                </Tabs.Tab>
                <Tabs.Tab value='chews' className='p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item'>
                  CHEWs
                </Tabs.Tab>
                <Tabs.Tab value='services' className='p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item'>
                  Services
                </Tabs.Tab>
              </Tabs.List>

              {/* Panel List */}

              {/* Basic Details Panel */}
              <Tabs.Panel value='basic_details' className='grow-1 py-3 px-4 tab-panel'>
                      
                <>
                  <form className='flex flex-col w-full items-start justify-start gap-3'
                    //onSubmit={handleBasicDetails}>
                    onSubmit={ev => handleBasicDetails(ev, [setFacilityId, setGeoJSON, setCenter, setWardName, setFormId], 'PATCH')}>

                    {/* CHU Name */}
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='name'
                        className='text-gray-600 capitalize text-sm'>
                        Community Health Unit Official Name
                        <span className='text-medium leading-12 font-semibold'>
                          *
                        </span>
                      </label>
                      <input
                        ref={nameRef}
                        type='text'
                        name='name'
                        value= {_name}
                        onChange={ev => setName(ev.target.value)}
                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none' 
                      />
                    </div>

                    {/* CHU Linked Facility */}
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='facility_name'
                        className='text-gray-600 capitalize text-sm'>
                        Community Health Unit Linked Facility{' '}
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>                    
                      <Select
                        ref = {linkedFacilityRef}
                        onChange={(value) => {
                          setSelectedFacility(value);
                          
                          // list the facilities and their counties
                          facilities.map((facility) => {
                            if (facility.id === value.value) {
                              setCountyValue(facility.county);
                              setSubCountyValue(facility.sub_county_name);
                              setConstituencyValue(facility.constituency);
                              setWardValue(facility.ward_name);
                            }
                          }
                          );
                        }}

                        options={facilities.map((facility) => {
                          return {
                            value: facility.id,
                            label: facility.name,
                          };
                        }
                        )}

                        placeholder={cu.facility_name}
                        name='facility'
                        // onChange={
                        //   (e) => setLinkedFacility(e.label) 
                        // }
                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                      />
                    </div>

                    {/* CHU Operational Status */}
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='status_name'
                        className='text-gray-600 capitalize text-sm'>
                        Operation Status    
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>                    
                      <Select
                        options={[
                          {
                            value: '2943e6c1-a581-461e-85a4-b9f25a2674ab',
                            label: 'Closed',
                          },
                          {
                            value: 'bac8ab50-1dad-4f96-ab96-a18a4e420871',
                            label: 'Non-functional',
                          },
                          {
                            value: 'fbc7fce5-3328-4dad-af70-0ec3d8f5ad80',
                            label: 'Semi-functional',
                          },
                          {
                            value: '50ef43f0-887c-44e2-9b09-cfa7a7090deb',
                            label: 'Fully-functional',
                          },
                        ]}
                        placeholder= {cu.status_name}
                        ref = {operationStatusRef}
                        onChange={
                          (e) => setOperationStatus(e.label) 
                        }
                        name='status'
                        //value={cu.status}
                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                      />
                    </div>

                    {/* CHU Dates - Established and Operational */}
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <div className='grid grid-cols-2 place-content-start gap-3 w-full'>
                        {/* Date Established  */}
                        <div className='col-start-1 col-span-1'>
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
                              ref ={dateEstablishedRef}
                              type='date'
                              name='date_established'
                              value={_dateEstablished}
                              onChange={ev => setDateEstablished(ev.target.value)}
                              placeholder={cu.date_established}
                              className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                            />
                          </div>
                        </div>

                        {/* Date Operational  */}
                        <div className='col-span-1'>
                          <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                              htmlFor='date_operational'
                              className='text-gray-600 capitalize text-sm'>
                              Date Operational
                              <span className='text-medium leading-12 font-semibold'>
                                {' '}
                                *
                              </span>
                            </label>
                            <input
                              ref={dateOperationalRef}
                              type='date'
                              name='date_operational'
                              value={_dateOperational}
                              onChange={ev => setDateOperational(ev.target.value)}
                              placeholder={cu.date_operational}
                              className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CHU Number of Monitored Households */}
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='households_monitored'
                        className='text-gray-600 capitalize text-sm'>
                        Number of monitored households
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>
                      <input
                        type='number'
                        name='households_monitored'
                        value={_noOfMonitoredHouseholds}
                        ref={monitoredHouseholdsRef}
                        onChange={ev => setNoOfMonitoredHouseholds(ev.target.value)}
                        //placeholder={cu.households_monitored}
                        min={0}
                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                      />
                    </div>

                    {/* CHU Number of CHVs */}
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='number_of_chvs'
                        className='text-gray-600 capitalize text-sm'>
                        Number of CHVs
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>
                      <input
                        type='number'
                        name='number_of_chvs'
                        value={_noOfCHVs}
                        ref={noOfCHVsRef}
                        onChange={ev => setNoOfCHVs(ev.target.value)}
                        min={0}
                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                      />
                    </div>

                    {/* CHU, Linked Facility Location */}
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <div className='grid grid-cols-4 place-content-start gap-3 w-full'>
                       
                        {/* County  */}
                        <div className='col-start-1 col-span-1'>
                          <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                              htmlFor='facility_county'
                              className='text-gray-600 capitalize text-sm'>
                              County
                              <span className='text-medium leading-12 font-semibold'>
                                {' '}
                                *
                              </span>
                            </label>
                            <input
                              value={cu.facility_county}
                              placeholder = {cu.facility_county}
                              type='text'
                              name='facility_county'
                              className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                            />
                          </div>
                        </div>


                        {/* Sub-county */}
                        <div className='col-start-2 col-span-1'>
                          <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                              htmlFor='facility_subcounty'
                              className='text-gray-600 capitalize text-sm'>
                              Sub-county
                              <span className='text-medium leading-12 font-semibold'>
                                {' '}
                                *
                              </span>
                            </label>
                            <input
                              placeholder={cu.facility_subcounty}
                              value={cu.facility_subcounty}
                              type='text'
                              name='facility_subcounty'
                              className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                            />
                          </div>
                        </div>

                        {/* Constituency */}
                        <div className='col-start-3 col-span-1'>
                          <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                              htmlFor='facility_constituency'
                              className='text-gray-600 capitalize text-sm'>
                              Constituency
                              <span className='text-medium leading-12 font-semibold'>
                                {' '}
                                *
                              </span>
                            </label>
                            <input
                              placeholder={cu.facility_constituency}
                              value={cu.facility_constituency}
                              type='text'
                              name='facility_constituency'
                              className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                            />
                          </div>
                        </div>

                        {/* Ward */}
                        <div className='col-start-4 col-span-1'>
                          <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                              htmlFor='facility_ward'
                              className='text-gray-600 capitalize text-sm'>
                              Ward
                              <span className='text-medium leading-12 font-semibold'>
                                {' '}
                                *
                              </span>
                            </label>
                            <input
                              placeholder={cu.facility_ward}
                              value={cu.facility_ward}
                              type='text'
                              name='facility_ward'
                              className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                            />
                          </div>
                        </div>

                        {/* Cancel and Save Changes */}
                        <div className='col-start-1 col-span-1'>
                          <div className='flex justify-start items-center w-full flex mb-1 gap-1'>
                            <button className='flex items-center justify-start space-x-2 p-1 bg-red-500 rounded p-2 px-6'>
                              <ChevronDoubleLeftIcon className='w-4 h-4 text-white' />
                              <span className='text-medium font-semibold text-white '>
                                Cancel
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className='col-start-3  col-span-1'>
                          <div className='flex justify-end items-center w-full mb-6'>
                            <button
                              type='submit'
                              className='flex items-center justify-start space-x-2 bg-blue-500 rounded p-2 px-6'>
                              <span className='text-medium font-semibold text-white'>
                                Finish 
                              </span>   
                            </button>
                          </div>
                        </div>

                        <div className='col-start-4 col-span-1'>
                          <div className='flex justify-end items-center flex-col w-full mb-6'>
                            <button
                              type='submit'
                              className='flex items-center justify-start space-x-2 bg-green-500 rounded p-2 px-6'>
                              <span className='text-medium font-semibold text-white'>
                                Save & Continue 
                              </span>
                              <ChevronDoubleRightIcon className='w-4 h-4 text-white' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              </Tabs.Panel>

              {/* Chews Panel */}
              <Tabs.Panel value='chews' className='grow-1 py-3 px-4 tab-panel' >
                <>
                  <form className='flex flex-col w-full items-start justify-start gap-3'onSubmit={handleCHEWs}>
                    <div className="bg-white w-full p-4 rounded">
                      <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                        <span className="font-semibold">
                          Health Unit workers
                        </span>
                      </h3>
                      <ul>
                        {cu?.health_unit_workers &&
                          cu?.health_unit_workers.length > 0 ? (
                          cu?.health_unit_workers.map((hr) => (
                            <li
                              key={hr.id}
                              className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
                            >
                              <div>
                                <p className="text-gray-800 text-base">
                                  {hr.name}
                                </p>
                                {hr.is_incharge ? (
                                  <small className="text-xs text-gray-500">
                                    In charge
                                  </small>
                                ) : (
                                  ""
                                )}
                              </div>
                              {hr.active ? (
                                <div className="flex flex-row gap-1 items-center">
                                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                  <label className="text-sm text-gray-600">
                                    Active
                                  </label>
                                </div>
                              ) : (
                                <div className="flex flex-row gap-1 items-center">
                                  <XCircleIcon className="h-6 w-5 text-red-600" />
                                  <label className="text-sm text-gray-600">
                                    Active
                                  </label>
                                </div>
                              )}
                            </li>
                          ))
                          ) : (
                            <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                              <p>No HR data listed for this cu.</p>
                            </li>
                          )}
                        </ul>
                      </div>

                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Number of CHVs
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.number_of_chvs || " - "}
                        </p>
                      </div>
                    </div>

                    {/* Form labels */}
                    <div className='grid grid-cols-4 place-content-start gap-3 w-full'>
                      <h4 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                        <span className="font-semibold">
                          Edit the Health Unit Workers
                        </span>
                      </h4>                   
                      {/* First Name */}
                      <div className='col-start-1 col-span-1'>
                        <label
                          htmlFor='fname'
                          className='block text-sm font-medium text-gray-700'>
                          First Name
                        </label>
                      </div>
                      {/* Second Name */}
                      <div className='col-start-2 col-span-1'>
                        <label
                          htmlFor='sname'
                          className='block text-sm font-medium text-gray-700'>
                          Second Name
                        </label>
                      </div>
                      {/* In charge */}
                      <div className='col-start-3 col-span-1'>
                        <label
                          htmlFor='incharge'
                          className='block text-sm font-medium text-gray-700'>
                          In Charge
                        </label>
                      </div>

                      {/* Delete CHEW */}
                      <div className='col-start-4 col-span-1'>
                        <label
                          htmlFor='delete'
                          className='block text-sm font-medium text-gray-700'>
                          Delete
                        </label>
                      </div>
                    </div>

                    {/* Form Data */}
                    <div className='grid grid-cols-4 place-content-start gap-3 w-full'>
                      {
                        cu.health_unit_workers &&
                        cu.health_unit_workers.length > 0 &&
                        cu.health_unit_workers.map((worker) => (
                          <>
                            {/* First Name */}
                            <div className='col-start-1 col-span-1'>
                              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                <input
                                  type='text'
                                  //ref={firstNameRef}
                                  name='first_name'
                                  value={_firstName}
                                  onChange={ev => setFirstName(ev.target.value)}
                                  className='flex-none w-75 bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                />
                              </div>
                            </div>

                            {/* Second Name */}
                            <div className='col-start-2 col-span-1'>
                              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                <input
                                  type='text'
                                  name='last_name'
                                  value={_lastName}
                                  onChange={ev => setLastName(ev.target.value)}
                                  className='flex-none w-75 bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                />
                              </div>
                            </div>

                            {/* In charge */}
                            <div className='col-start-3 col-span-1'>
                              <div className='flex items-start py-3'>
                                <input
                                  name='incharge'
                                  // check if the worker is incharge then checked else unchecked
                                  {...(worker.is_incharge === true
                                    ? { checked: true }
                                    : { checked: false })}
                                  //onChange={handleChange}
                                  type='checkbox'
                                  className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                                />
                              </div>
                            </div>

                            {/* Delete CHEW */}
                            <div className='col-start-4 col-span-1'>
                              <div className='flex items-start'>
                                {/* insert red button for deleting */}
                                <button
                                  name='delete'
                                  type='button'
                                  className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded'
                                  onClick={() => { }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </>
                        ))
                      }
                    </div>

                    {/* Save Changes */}                  
                    <div className='grid grid-cols-2 place-content-start gap-3 w-full'>
                      <div className='col-start-1 col-span-1'>
                        <div className='flex justify-start items-center w-full flex mb-1 gap-1'>
                          <button className='flex items-center justify-start space-x-2 p-1 bg-red-500 rounded p-2 px-2'>
                            <ChevronDoubleLeftIcon className='w-4 h-4 text-white' />
                            <span className='text-medium font-semibold text-white '>
                              Basic Details
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className='col-start-2 col-span-1'>
                        <div className='flex justify-center items-center flex-col w-full mb-6'>
                          <button
                            type='submit'
                            className='flex items-center justify-start space-x-2 bg-green-500 rounded p-2 px-2'>
                            <span className='text-medium font-semibold text-white'>
                              Save Changes
                            </span>
                            <ChevronDoubleRightIcon className='w-4 h-4 text-white' />
                          </button>
                        </div>
                      </div>
                    </div>


                  </form>
                </>
              </Tabs.Panel>


              {/* Services Panel */}
              <Tabs.Panel value='services' className='grow-1 py-3 px-4 tab-panel'>
                <>
                  <h3 className='text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight'>
                    <span className='font-semibold'>Services Offered</span>
                  </h3>
                  <ul>
                    {cu?.services && cu?.services.length > 0 ? (
                      cu?.services.map((service) => (
                        <li
                          key={service.id}
                          className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
                        >
                          <div>
                            <p className="text-gray-800 text-base">
                              {service.name}
                            </p>
                            <small className="text-xs text-gray-500">
                              {service.name || ""}
                            </small>
                          </div>
                          <div>
                            <p className="text-gray-800 text-base">
                              {service.average_rating || 0}/
                              {service.number_of_ratings || 0}
                            </p>
                            <small className="text-xs text-gray-500">
                              Rating
                            </small>
                          </div>
                          <label className="text-sm text-gray-600 flex gap-1 items-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            <span>Active</span>
                          </label>
                        </li>
                      ))

                    ) : (
                      <>
                        <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                          <p>{cu?.name || cu?.official_name} has not listed the services it offers. Add some below.</p>
                            </li>
                            <br />

                      </>
                    )}
                  </ul>

                  <form
                      name='chu_services_form'
                      className='flex flex-col w-full items-center justify-start gap-3'
                      onSubmit={ev =>handleServices(ev, [chulId, services, setServices], PATCH)}
                    >
                      <h3 className='text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight'>
                        <span className='font-semibold'>Select New Services</span>
                      </h3>
                      {/* Transfer list Container */}
                      <div className='flex items-center w-full h-auto min-h-[300px]'>
                        {/* serviceCategories.map(ctg => ctg.name) */}
                        <TrasnferListServices
                            categories={serviceCategories}
                            setServices={setServices}
                            setRefreshForm={setRefreshForm}
                            refreshForm={refreshForm}
                            selectedRight={serviceSelected}
                            setSelectedServiceRight={ setSelectedServiceRight}
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
                          {/* {
                            services.map(({subctg}) => subctg).map((service_categories, i) => (
                              <tr key={`${service_categories}_${i}`} className='grid grid-cols-2 place-content-end border-b-2 border-gray-300'>
                                <td ref={nameOptionRef}>{service_categories}</td>
                                <td ref={serviceCategoriesRef} className='ml-12 text-base'>Yes</td>
                              </tr>
                            ))
                          }                                             */}
                          {
                            selectedServiceRight  !== undefined && selectedServiceRight !== null 
                            ? 
                            selectedServiceRight.map(ctg => ctg.subCategories).map((service, i) => (
                                <tr key={`${service}_${i}`} className='grid grid-cols-2 place-content-end border-b-2 border-gray-300'>
                                    <td ref={nameOptionRef}>{service}</td>
                                    <td ref={serviceOptionRef} className='ml-12 text-base'>Yes</td>
                                </tr>
                            ))
                            :
                            services.map(({subctg}) => subctg).map((service_categories, i) => (
                                <tr key={`${service_categories}_${i}`} className='grid grid-cols-2 place-content-end border-b-2 border-gray-300'>
                                    <td ref={nameOptionRef}>{service_categories}</td>
                                    <td ref={serviceCategoriesRef} className='ml-12 text-base'>Yes</td>
                                </tr>
                            ))
                          }														
                        </tbody>
                      </table>
                      <div className='flex justify-between items-center w-full'>
                        <button
                          type='submit'
                          className='flex items-center justify-start space-x-2 bg-green-500 rounded p-1 px-2'>
                          <span className='text-medium font-semibold text-white'>
                            Save
                          </span>
                          <ChevronDoubleRightIcon className='w-4 h-4 text-white' />
                        </button>
                      </div>
                    </form>
                </>
              </Tabs.Panel>
            </Tabs.Root>
          </div>
        </div>
      </MainLayout >
    </>
  );
};

CommUnit.getInitialProps = async (ctx) => {
  if (ctx.query.q)
  {
    const query = ctx.query.q;

    if (typeof window !== 'undefined' && query.length > 2)
    {
      window.location.href = `/community-units?q=${ query }`;
    } else
    {
      if (ctx.res)
      {
        ctx.res.writeHead(301, {
          Location: '/community-units?q=' + query,
        });
        ctx.res.end();
        return {};
      }
    }
  }

  return checkToken(ctx.req, ctx.res)
    .then(async (t) =>{
      if (t.error){
        throw new Error('Error checking token');
      }
      else{
        // Fetching the required token
        let token = t.token;

        // Prefetch the facility data details
				let facility_url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?fields=id,name,county,sub_county_name,constituency,ward_name&page=1&page_size=500`;
				
				const response = await fetch(facility_url, {
					headers: {
						Authorization: 'Bearer ' + token,
						Accept: 'application/json',
					},
				})

				let facility_data = await response.json();
				if (facility_data.error) {
					throw new Error('Error fetching facility data');
				}

        // Fetch the service options
				let service_url = `${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=100&ordering=name`;

				const service_response = await fetch(service_url,
					{
						headers: {
							Authorization: 'Bearer ' + token,
							Accept: 'application/json',
						},
					})

				let service_categories = await service_response.json();
				console.log('Service Categories', service_categories)

				if (service_categories.error){
					throw new Error('Error fetching the service categories');
				}

        // Fetching the details of the quieried chu
        let url = process.env.NEXT_PUBLIC_API_URL + '/chul/units/' + ctx.query.id + '/';

        return fetch(url, {
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
          },
        })
          .then((r) => r.json())
          .then((json) =>
          {
            return {
              token: token,
              service_categories: service_categories,
              facility_data: facility_data,
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
    .catch((err) =>
    {
      console.log('Error checking token: ', err);
      if (typeof window !== 'undefined' && window)
      {
        if (ctx?.asPath){
          window.location.href = ctx?.asPath;
        } 
        else{
          let token = t.token;
          let url = process.env.NEXT_PUBLIC_API_URL +  '/chul/units/' + ctx.query.id + '/';
          return fetch(url, {
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/json',
            },
          })
            .then((r) => r.json())
            .then((json) =>
            {
              console.log(json);
              return {
                data: json,
              };
            })
            .catch((err) =>
            {
              console.log('Error fetching facilities: ', err);
              return {
                error: true,
                err: err,
                data: [],
              };
            });
        }
      }
      console.log('My Error:' + err);

      return {
        error: true,
        err: err,
        data: [],
      };
    });
};

export default CommUnit;
