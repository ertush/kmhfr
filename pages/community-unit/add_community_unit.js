// React imports
import React, { useState, useEffect } from 'react';

// Next imports
import Head from 'next/head';

// Component imports
import MainLayout from '../../components/MainLayout';
import TransferList from '../../components/TrasnferList';

// Controller imports
import { checkToken } from '../../controllers/auth/auth';

// MUI imports
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Heroicons imports
import {
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
	PlusIcon,
} from '@heroicons/react/solid';

// Package imports
import Select from 'react-select';

function AddCommUnit(props) {
	let comm_unit = props.data;

	// Define registration steps
	const steps = [
		'Basic Details',
		'CHEWS: Community Health Extension Workers',
		'Services',
	];

	// Define serviceCategories
	const serviceCategories = [
		{
			name: 'ACCIDENT AND EMERGENCY CASUALTY SERVICES',
			subCategories: [
				'Accident and Emergency casualty Services',
				'General Emergency Services',
			],
		},
		{
			name: 'AMBULATORY SERVICES',
			subCategories: ['Ambulatory Services'],
		},
		{
			name: 'ANTENATAL CARE',
			subCategories: ['Focused Antenatal Care'],
		},
		{
			name: 'BLOOD TRANSFUSION SERVICES',
			subCategories: [
				'Blood Bank',
				'Facility offering Blood Transfusion Service',
				'Satellite Blood Transfusion service',
			],
		},
		{
			name: 'CANCER SCREENING',
			subCategories: [
				'Breast',
				'Coloreactal',
				'Pap smear',
				'Prostrate',
				'Screening using VIA/VILI',
			],
		},
		{
			name: 'CURATIVE SERVICES',
			subCategories: ['Inpatient', 'Outpatient'],
		},
		{
			name: 'DELTED HDU',
			subCategories: ['High dependency Services'],
		},
		{
			name: 'EMERGENCY PREPAREDNESS',
			subCategories: [
				'Basic Emergency Preparedness',
				'Comprehensive Emergency Preparedness',
			],
		},
		{
			name: 'FAMILY PLANNING',
			subCategories: ['Long Term', 'Natural', 'Permanent'],
		},
		{
			name: 'FORENSIC SERVICES',
			subCategories: ['Long Term', 'Natural', 'Permanent'],
		},
		{
			name: 'HIV TREATMENT',
			subCategories: ['HIV treatment and care'],
		},
		{
			name: 'HIV/AIDS Prevention,Care and Treatment Services',
			subCategories: [
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
				'Post-Exposure Prophylaxis (PEP)',
			],
		},
		{
			name: 'HOSPICE SERVICE',
			subCategories: [],
		},
		{
			name: 'IMMUNISATION',
			subCategories: [],
		},
		{
			name: 'INTEGRATED MANAGEMENT OF CHILDHOOD ILLNESS',
			subCategories: [],
		},
		{
			name: 'LABORATORY SERVICES',
			subCategories: [],
		},
		{
			name: 'LEPROSY DIAGNOSIS',
			subCategories: [],
		},
		{
			name: 'LEPROSY TREATMENT',
			subCategories: [],
		},
		{
			name: 'MATERNITY SERVICES',
			subCategories: [],
		},
	];

	// Define state
	const [formId, setFormId] = useState(0);

	// Define useEffect
	useEffect(() => {
		const formIdState = window.sessionStorage.getItem('formId');

		if (formIdState == undefined || formIdState == null || formIdState == '') {
			window.sessionStorage.setItem('formId', 1);
		}
		console.log(formId);

		setFormId(window.sessionStorage.getItem('formId'));

		return () => {
			if (window.sessionStorage.getItem('formId') == '3') {
				window.sessionStorage.setItem('formId', 0);
			}
		};
	}, [formId]);
	console.log(formId);

	return (
		<div className=''>
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
								<a className='text-indigo-700' href='/'>
									Home
								</a>{' '}
								{'>'}
								<a className='text-indigo-700' href='/community-units.js'>
									Community Units
								</a>{' '}
								{'>'}
								<span className='text-gray-500'>Community Units</span>
							</div>
							<div className='flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3'></div>
						</div>
					</div>

					{/* Stepper and Form */}
					<div className='col-span-5 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none'>
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
								{/* Form-changing switch statement */}
								{(() => {
									switch (parseInt(formId)) {
										// Basic Details Case
										case 0:
											const handleBasicDetailsSubmit = (event) => {
												event.preventDefault();

												// An empty object of the form data
												const formData = {};

												// Loop through all the form elements and add them to the object
												const elements = [...event.target];

												elements.forEach(({ name, value }) => {
													formData[name] = value;
												});
												console.log(formData);

												// Set the formId to the next step
												window.sessionStorage.setItem('formId', '1');

												// Redirect to the next page
												setFormId(window.sessionStorage.getItem('formId'));
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
																required
																type='text'
																name='comm_unit_name'
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
															<input
																required
																type='text'
																name='comm_unit_facility'
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* CHU Status */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='comm_unit_status'
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
																		value: 'closed',
																		label: 'Closed',
																	},
																	{
																		value: 'non-functional',
																		label: 'Non-functional',
																	},
																	{
																		value: 'semi-functional',
																		label: 'Semi-functional',
																	},
																	{
																		value: 'fully-functional',
																		label: 'Fully-functional',
																	},
																]}
																required
																placeholder='Select an operation status ...'
																onChange={() => console.log('changed')}
																name='comm_unit_status'
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
																name='no_monitored_households'
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
																name='no_chvs'
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
																type='number'
																name='area_of_coverage'
																placeholder='Description of the area of coverage'
																min={0}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
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

												window.sessionStorage.setItem('formId', 2);

												setFormId(window.sessionStorage.getItem('formId'));
											};

											const handleCHEWPrevious = (event) => {
												event.preventDefault();

												window.sessionStorage.setItem('formId', 1);

												setFormId(window.sessionStorage.getItem('formId'));
											};
											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														CHEWs: Community Health Extension Workers
													</h4>
													<form
														name='chews_form'
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleCHEWSubmit}>
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															{/* Form labels */}
															<div className='grid grid-cols-3 place-content-start gap-3 w-full'>
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

															{/* Form input */}
															<div className='grid grid-cols-4 place-content-start gap-3 w-full'>
																{/* First Name */}
																<div className='col-start-1 col-span-1'>
																	<input
																		required
																		type='text'
																		name='fname'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
																{/* Second Name */}
																<div className='col-start-2 col-span-1'>
																	<input
																		required
																		type='text'
																		name='sname'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
																{/* In charge */}
																<div className='col-start-3 col-span-1'>
																	<div className='flex items-center py-3'>
																		<input
																			name='incharge'
																			type='checkbox'
																			className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
																		/>
																	</div>
																</div>

																{/* Delete CHEW */}
																<div className='col-start-4 col-span-1'>
																	<div className='flex items-center'>
																		{/* insert red button for deleting */}
																		<button
																			name='delete'
																			type='button'
																			className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded'
																			onClick={() => {}}>
																			Delete
																		</button>
																	</div>
																</div>
															</div>
														</div>

														{/* Basic Details and Services */}
														<div className='flex justify-between items-center w-full'>
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
																className='flex items-center justify-start space-x-2 bg-green-500 rounded p-1 px-2'>
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
											const handleServiceSubmit = (event) => {
												event.preventDefault();

												window.sessionStorage.setItem('formId', 3);

												setFormId(window.sessionStorage.getItem('formId'));
											};

											const handleServicesPrevious = (event) => {
												event.preventDefault();

												window.sessionStorage.setItem('formId', 1);
												setFormId(window.sessionStorage.getItem('formId'));
											};
											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														Services Offered
													</h4>

													<form
														name='chu_services_form'
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleServiceSubmit}>
														{/* Transfer list Container */}
														<div className='flex items-center w-full h-auto min-h-[300px]'>
															{/* serviceCategories.map(ctg => ctg.name) */}
															<TransferList
																categories={serviceCategories.map(
																	(data) => data
																)}
															/>
														</div>

														<div className='flex justify-between items-center w-full'>
															<button
																onClick={handleServicesPrevious}
																className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	CHEWs
																</span>
															</button>
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
											);
									}
								})()}
							</div>
						</div>
					</div>

					{/* Aside */}
					<aside className='flex flex-col col-span-5 md:col-span-1 p-1 md:h-full'>
						<details
							className='rounded bg-transparent py-2 text-basez flex flex-col w-full md:stickyz md:top-2z'
							open></details>
					</aside>

					{/* (((((( Floating div at bottom right of page */}
					<div className='fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3'>
						<h5 className='text-sm font-bold'>
							<span className='text-gray-600 uppercase'>Limited results</span>
						</h5>
						<p className='text-sm text-gray-800'>
							For testing reasons, downloads are limited to the first 100
							results.
						</p>
					</div>
					{/* ))))))) */}
				</div>
			</MainLayout>
		</div>
	);
}

AddCommUnit.getInitialProps = async (ctx) => {
	return checkToken(ctx.req, ctx.res)
		.then((t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
				let url =
					process.env.NEXT_PUBLIC_API_URL +
					'/community_unit/add' +
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
						console.log('Error fetching facilities: ' + err);
						return {
							error: true,
							err: err,
							data: [],
						};
					});
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

export default AddCommUnit;
