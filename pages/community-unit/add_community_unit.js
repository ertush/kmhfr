// React imports
import React, { useState, useEffect } from 'react';

// Next imports
import Head from 'next/head';

// Component imports
import MainLayout from '../../components/MainLayout';

// Controller imports
import { checkToken } from '../../controllers/auth/auth';

// MUI imports
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Package imports

function AddCommUnit(props) {
	let comm_unit = props.data;

	// Define registration steps
	const steps = ['Basic Details', 'CHEWS', 'Services'];

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
	}, [formId]);

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
								style={{ minHeight: '250px' }}></div>
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
