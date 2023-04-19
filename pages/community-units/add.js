import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import MainLayout from '../../components/MainLayout';
import EditListItem from '../../components/EditListItem';
import { checkToken } from '../../controllers/auth/auth';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CommunityUnitSideMenu from '../../components/CommunityUnitSideMenu';
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon, TrashIcon } from '@heroicons/react/solid';
import Select from 'react-select';
import { useAlert } from "react-alert";
import Link from 'next/link';
import {useRouter} from 'next/router';




const AddCommunityUnit = (props) => {

	const facilities = props['0']?.facility_data ?? []
	const serviceCtg = props['1']?.service_category ?? []
	const contact_type = props['2']?.contact_type ?? []

	const router = useRouter()

	const alert = useAlert()

	const qf = props?.query?.qf || 'all';

	const [selected_facility, setSelectedFacility] = useState(null);
	const [countyValue, setCountyValue] = useState('');
	const [subCountyValue, setSubCountyValue] = useState('');
	const [constituencyValue, setConstituencyValue] = useState('');
	const [wardValue, setWardValue] = useState('');
	const [chulId, setchulId] = useState('');
	const [contactCHEW, setContactCHEW] = useState([{}])
	const [contactList, setContactList] = useState([{}])


	// Services state
	const [services, setServices] = useState([])
	const chewFormRef = useRef(null)



	// Define registration steps
	const steps = [
		'Basic Details',
		'CHEWS: Community Health Extension Workers',
		'Services',
	];


	const serviceOptions = ((_services) => {

		const _serviceOptions = []
		let _values = []
		let _subCtgs = []

		if (_services.length > 0) {
			_services.forEach(({ category_name: ctg }) => {
				let allOccurences = _services.filter(({ category_name }) => category_name === ctg)

				allOccurences.forEach(({ id, name }) => {
					_subCtgs.push(name)
					_values.push(id)
				})

				if (_serviceOptions.map(({ name }) => name).indexOf(ctg) === -1) {
					_serviceOptions.push({
						name: ctg,
						subCategories: _subCtgs,
						value: _values
					})
				}

				_values = []
				_subCtgs = []

			})
		}

		return _serviceOptions
	})(serviceCtg ?? [])


	const [formId, setFormId] = useState(0);
	const handleAddCHEW = (e) => {
		e.preventDefault();
		setContactCHEW(s => {
			return [...s, { first_name: '', last_name: '', is_incharge: '' }]
		})
	};

	const handleContactAdd = (e) => {
		e.preventDefault();
		setContactList(s => {
			return [...s, { contact_type: '', contact: '' }]
		})
	};
	useEffect(() => {

		const formIdState = window.sessionStorage.getItem('chuformId');

		if (formIdState == undefined || formIdState == null || formIdState == '') {
			window.sessionStorage.setItem('chuformId', 1);
		}

		setFormId(window.sessionStorage.getItem('chuformId'));

		return () => {
			if (window.sessionStorage.getItem('chuformId') == '3') {
				window.sessionStorage.setItem('chuformId', 0);
			}
		};
	}, [formId, facilities, serviceCtg]);

	useEffect(() => {}, [contactCHEW])

	return (
		<>
			{/* Head */}
			<Head>
				<title> KMFHL - Add Community Unit</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{/* Main Layout */}
			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
				<div className='w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4'>
					{/* Breadcrumbs */}
					<div className='col-span-5 flex flex-col gap-3 md:gap-5 px-4'>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							<div className='flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3'>
								<Link className='text-green-800' href='/'>
									Home
								</Link>
								{'/'}
								<Link className='text-green-800' href='/community-units'>
									Community Units
								</Link>
								{'/'}
								<span className='text-gray-500'>Add Community Unit</span>
							</div>
							<div className='flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3'></div>
						</div>


						<div className={"col-span-5 flex justify-between w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
							<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
								{'New Community Unit'}
							</h2>
						</div>
					</div>

					{/* Side Menu Filters*/}
					<div className="md:col-span-1 md:mt-3 h-full">
						<CommunityUnitSideMenu
							qf={qf}
							filters={[]}
							_pathId={''}
						/>
					</div>

					{/* Stepper and Form */}
					<div className='col-span-5 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none'>
						{/* Stepper Header */}
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							<Box sx={{ width: '100%' }}>
								<Stepper activeStep={parseInt(formId)} alternativeLabel>
									{steps.map((label, i) => (
										<Step key={i}>
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
								{/* Form-changing switch statement */}
								{(() => {
									switch (parseInt(formId)) {
										// Basic Details Case
										case 0:
											const handleBasicDetailsSubmit = (event) => {
												event.preventDefault();

												let _id;

												const formData = {};

												const elements = [...event.target];

												elements.forEach(({ name, value, id }, index) => {

													if (name == 'contact_type' || name == 'contact') {
														let data = [...contactList];
														formData['contacts'] = {}
														data[id][name] = value
														formData['contacts'] = data.map(({ contact_type, contact }) => { return { contact_type, contact } })

													} else {

														formData[name] = value;
													}
												});

												// Posting CHU basic details 
												try {
													fetch('/api/common/submit_form_data/?path=CHUs', {
														headers: {
															'Accept': 'application/json, text/plain, */*',
															'Content-Type': 'application/json;charset=utf-8'

														},
														method: 'POST',
														body: JSON.stringify(formData).replace(',"":""', '')
													})

														.then(async (resp) => {
															const { id } = (await resp.json())
															_id = id;

															if (resp) {
																setchulId(_id) //setting the state to the current CHUL
															}
															alert.success('CHU Basic Details Added Successfully')

														})
												}

												catch (e) {
													alert.error('Error Occured: ' + e.message)
												}

												// Set the formId to the next step
												window.sessionStorage.setItem('chuformId', 1);

												// Redirect to the next page
												setFormId(window.sessionStorage.getItem('chuformId'));
											};
											// Basic Details Form
											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														Community Health Unit Basic Details
													</h4>
													{/* Actual form */}
													<form
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleBasicDetailsSubmit}>

														{/* CHU name */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='comm_unit_name'
																className='text-gray-600 capitalize text-sm'>
																Community Health Unit Name
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																placeholder='Select the name of the CHU'
																type='text'
																name='name'
																id='comm_unit_name'
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* CHU linked facility */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='comm_unit_facility'
																className='text-gray-600 capitalize text-sm'>
																Community Health Unit Linked Facility
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<Select
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

																placeholder='Select linked facility...'
																name='facility'
																inputId='comm_unit_facility'
																className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
															/>
														</div>

														{/* CHU Status */}

														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor="comm_unit_status"
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
																required
																placeholder='Select an operation status ...'
																name='status'
																inputId='comm_unit_status'
																className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
															/>
														</div>

														{/* Date Established and Date Operational */}
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
																			required
																			type='date'
																			name='date_established'
																			id='date_established'
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
																			required
																			type='date'
																			name='date_operational'
																			id='date_operational'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>
															</div>
														</div>

														{/* Number of Monitored Households */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='no_monitored_households'
																className='text-gray-600 capitalize text-sm'>
																Number of monitored households
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='number'
																name='households_monitored'
																id='households_monitored'
																placeholder='Number of households served by the unit'
																min={0}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Number of CHVs */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='no_chvs'
																className='text-gray-600 capitalize text-sm'>
																Number of CHVs
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='number'
																name='number_of_chvs'
																id='number_of_chvs'
																placeholder='Number of Community Health Volunteers in the unit'
																min={0}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Location */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<div className='grid grid-cols-4 place-content-start gap-3 w-full'>
																{/* County  */}
																<div className='col-start-1 col-span-1'>
																	<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																		<label
																			htmlFor='linked_facility_county'
																			className='text-gray-600 capitalize text-sm'>
																			County
																			<span className='text-medium leading-12 font-semibold'>
																				{' '}
																				*
																			</span>
																		</label>
																		<input
																			value={countyValue}
																			onChange={() => null}
																			type='text'
																			name='facility_county'
																			id='facility_county'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
																		<input
																			value={subCountyValue}
																			onChange={() => null}
																			type='text'
																			name='facility_sub_county'
																			id='facility_sub_county'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
																		<input
																			value={constituencyValue}
																			onChange={() => null}
																			type='text'
																			name='facility_constituency'
																			id='facility_constituency'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
																		<input
																			value={wardValue}
																			onChange={() => null}
																			type='text'
																			name='facility_ward'
																			id='facility_ward'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>
															</div>
														</div>

														{/* Area of Coverage */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='area_of_coverage'
																className='text-gray-600 capitalize text-sm'>
																Area of coverage
															</label>
															<input
																required
																type='text'
																name='location'
																id='location'
																placeholder='Description of the area of coverage'
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
															<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																Community Health Unit Contacts
															</h4>

															{contactList.map((x, i) => {

																return (
																	<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3' key={i}>
																		<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
																			<label
																				htmlFor='contact'
																				className='text-gray-600 capitalize text-sm'
																			>
																				Contact Type
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<select
																				required
																				key={i}
																				id={`${i}`}
																				name='contact_type'
																				className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'

																			>
																				{contact_type.map((ct, i) => (
																					<option value={ct.id} onChange={() => null} key={i}>{ct.name}</option>
																				))}
																			</select>
																		</div>
																		<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3' key={i}>
																			<label
																				htmlFor='contact_text'
																				className='text-gray-600 capitalize text-sm'>
																				Contact Details
																				<span className='text-medium leading-12 font-semibold'>
																					{' '}
																					*
																				</span>
																			</label>
																			<input
																				required
																				type='text'
																				name='contact'
																				id={i}
																				className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																			/>
																		</div>

																	</div>)
															})
															}

														</div>
														<div className="sticky top-0 right-10 w-full flex justify-end">
															<button className='rounded bg-green-600 p-2 text-white flex text-md font-semibold '
																onClick={handleContactAdd}
															>
																{`Add Contact`}
															</button>

														</div>

														{/* Cancel and CHEWs */}
														<div className='flex justify-between items-center w-full'>
															<button className='flex items-center justify-start space-x-2 p-1 bg-red-500 rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-white' />
																<span className='text-medium font-semibold text-white '>
																	Cancel
																</span>
															</button>
															<button
																type='submit'
																className='flex items-center justify-start space-x-2 bg-green-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>
																	CHEWs
																</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
															</button>
														</div>
													</form>
												</>
											);
										// CHEWs Case
										case 1:

											// Handle CHEWs Case
											const handleCHEWSubmit = (event) => {
												event.preventDefault();

												const formData = chewFormRef.current ? new FormData(chewFormRef.current) : null

												const entries = [...formData.entries()]

												const payload = [...formData.keys()].filter(val => val === 'first_name').map(() => ({}))
											
												let i = 0;
												

												entries.forEach(([key, value], _i) => {
													if(!payload[i].hasOwnProperty(key)){
															payload[i][key] = value.includes('on') ? true : value
														} else {
															i++;
															payload[i][key] = value.includes('on') ? true : value
														}
														
												})
										

												if (payload) {

													try {

														fetch(`/api/common/submit_form_data/?path=chul_data&id=${chulId}`, {

															headers: {
																'Accept': 'application/json, text/plain */*',
																'Content-Type': 'application/json;charset=utf-8'

															},
															method: 'PATCH',
															body: JSON.stringify({health_unit_workers:payload})
														}).then(res => res.json()).then((res) => {
															if (res.details) {
																alert.error('Failed to add CHEW details')
															} else {

																alert.success('CHEW details added successfully ')
															}
														}).catch(err => {
															alert.error('An error occured: ' + err)

														})
													}
													catch (e) {
														alert.error('An error occured: ' + e.message)

														console.error('Unable to patch facility contacts details'.e.message)
													}

													window.sessionStorage.setItem('chuformId', 2);

													setFormId(window.sessionStorage.getItem('chuformId'));

												}
											};

											const handleCHEWPrevious = (event) => {
												event.preventDefault();

												window.sessionStorage.setItem('chuformId', 0);



												setFormId(window.sessionStorage.getItem('chuformId'));
											};
											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														CHEWs: Community Health Extension Workers
													</h4>
													<form
														ref={chewFormRef}
														name='chews_form'
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleCHEWSubmit}>
														<div className='w-full flex flex-col items-between justify-start border-2 rounded gap-4 mb-3 p-3'>
															<div className='w-full grid grid-cols-4  mx-auto place-content-start gap-x-3 flex-1 mb-2'>

																<label
																	htmlFor='last_name'
																	className='block text-sm font-medium text-gray-700'>
																	First Name
																</label>

																<label
																	htmlFor='last_name'
																	className='block text-sm font-medium text-gray-700'>
																	Second Name
																</label>

																<label
																	htmlFor='last_name'
																	className='block text-sm font-medium text-gray-700'>
																	In Charge
																</label>

																<div className='flex flex-row justify-between gap-2'>
																<label
																	htmlFor='last_name'
																	className='block text-sm font-medium text-gray-700'>
																	Delete
																</label>
																	<button className=' w-auto rounded bg-green-600 p-2 text-white flex text-md font-semibold '
																			onClick={handleAddCHEW}
																			>
																				{`Add +`}

																	</button>
																</div>

																
																
															</div>
															{/* <div className='grid grid-cols-5 gap-x-3 w-full place-content-start'>
																
																
															</div> */}
															{contactCHEW.map((contact, index) => (
																<div className='w-full grid grid-cols-4 mx-auto place-content-start gap-y-1 gap-x-3' key={index}>
																	{/* First Name */}
																		
																		<input
																			required
																			
																			type='text'
																			name='first_name'
																			className='flex-none  md:w-52 w-auto bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-300 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																		
																	
																	{/* Second Name */}
																	
																
																		<input
																			required
																			id={index}
																			type='text'
																			name='last_name'
																			className='flex-none  md:w-52 w-auto bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-300 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	
																
																	{/* In charge */}
																
																		
																		<input
																			
																			name='is_incharge'
																			id={index}
																			type='checkbox'
																			className='focus:ring-indigo-50  h-4 w-4 text-indigo-600 border-gray-400'
																		/>
																		
																

																	{/* Delete CHEW */}
																	<div className='flex'>
																		<div className='flex items-center'>
																			{/* insert red button for deleting */}
																			<button
																				name='delete'
																				id={index}
																				type='button'
																				className='bg-transparent group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 rounded border border-red-500 hover:border-transparent '
																				onClick={() => setContactCHEW(prev => prev.splice(1, index)) }>
																				<TrashIcon className="w-4 h-4 text-red-500 group-hover:text-white" />
																			</button>
																		</div>
																	</div>

																	

																	
																</div>
															))}

															
															
														</div>

														{/* Basic Details and Services */}
														<div className='flex justify-between items-center w-full p-2'>
															<button
																className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'
																onClick={handleCHEWPrevious}>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	Basic Details
																</span>
															</button>
															<button
																type='submit'
																className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>
																	Services
																</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
															</button>
														</div>
													</form>
												</>
											);
										// Services Case
										case 2:
											// Handle Service Form Submit
											const handleServiceSubmit = (stateSetters, chulId) => {

												const [services, setFormId, setServices] = stateSetters
												const _payload = services.map(({ id }) => ({ service: id }))

												_payload.forEach(obj => obj['health_unit'] = chulId)

												try {
													fetch(`/api/common/submit_form_data/?path=chul_services&id=${chulId}`, {
														headers: {
															'Accept': 'application/json, text/plain, */*',
															'Content-Type': 'application/json;charset=utf-8'

														},
														method: 'POST',
														body: JSON.stringify({ services: _payload })
													})
													.then(resp => {
														if(resp?.url){
															alert.success('Community Health Unit Added successfully')
															router.push(`/community-units/${new URL(resp?.url).searchParams.get('id')}`)

														}
													})
													

												}
												catch (e) {
													console.error('Unable to patch CHU service details'.e.message)
												}

												window.sessionStorage.setItem('chuformId', 3);

												setFormId(window.sessionStorage.getItem('chuformId'))
												setServices([])
											};

											const handleServicesPrevious = (event) => {
												event.preventDefault();

												window.sessionStorage.setItem('chuformId', 1);
												setFormId(window.sessionStorage.getItem('chuformId'));
											};

											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														Services Offered
													</h4>

													<div
														name='chu_services_form'
														className='flex flex-col w-full items-start justify-start gap-3'
													>
														<div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

															{/* Edit list Item Container */}
															<div className='flex items-center w-full h-auto min-h-[300px]'>

																<EditListItem
																	initialSelectedItems={[]}
																	itemsCategory={serviceOptions} //serviceOptions
																	itemsCategoryName={'Services'}
																	setUpdatedItem={() => null}
																	itemId={chulId} //chulId
																	setItems={setServices}
																	item={null}
																	removeItemHandler={() => null}
																	handleItemsSubmit={handleServiceSubmit} //handleServiceSubmit
																	handleItemsUpdate={() => null} //handleServiceUpdates
																	setNextItemCategory={setFormId}
																	nextItemCategory={'Save'}
																	previousItemCategory={'CHEWS'}
																	handleItemPrevious={handleServicesPrevious} //handleServicePrevious
																	setIsSaveAndFinish={() => null}


																/>

															</div>
														</div>
													</div>
												</>
											);
									}
								})()}
							</div>
						</div>
					</div>



					{/* Floating div at bottom right of page */}
					{/* <div className='fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3'>
						<h5 className='text-sm font-bold'>
							<span className='text-gray-600 uppercase'>Limited results</span>
						</h5>
						<p className='text-sm text-gray-800'>
							For testing reasons, downloads are limited to the first 100
							results.
						</p>
					</div> */}

				</div>
			</MainLayout>
		</>
	);
}

AddCommunityUnit.getInitialProps = async (ctx) => {

	const allOptions = []

	const options = [
		'facilities',
		'services',
		'contact_types',
	]


	return checkToken(ctx.req, ctx.res)
		.then(async (t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
				let url = '';

				for (let i = 0; i < options.length; i++) {
					const option = options[i]
					switch (option) {
						case 'facilities':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name,county,sub_county_name,constituency,ward_name&page=1&page_size=500`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})


								allOptions.push({ facility_data: (await _data.json()).results })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_types: [],
								});
							}

							break;
						case 'contact_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=id,name`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})



								allOptions.push({ contact_type: (await _data.json()).results })


							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_types: [],
								});
							}
							break;

						case 'services':

							url = `${process.env.NEXT_PUBLIC_API_URL}/chul/${option}/?page_size=100&ordering=name`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								allOptions.push({ service_category: (await _data.json()).results })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									service: [],
								})
							}

							break;
					}
				}

				return allOptions

			}
		})
		.catch((err) => {
			console.log('Error checking token: ' + err);
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

export default AddCommunityUnit; 
