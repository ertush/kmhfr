import React, { useState, useEffect, createContext, useContext } from 'react';
import Head from 'next/head';
import MainLayout from '../../components/MainLayout';
import EditListItem from '../../components/Forms/formComponents/EditListItem';
import { checkToken } from '../../controllers/auth/auth';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CommunityUnitSideMenu from '../../components/CommunityUnitSideMenu';
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon, TrashIcon } from '@heroicons/react/solid';
import { Select as CustomSelect } from '../../components/Forms/formComponents/Select';
import Select from 'react-select'
import { useAlert } from "react-alert";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Spinner from '../../components/Spinner'
import Alert from '@mui/material/Alert';


const SetFormIdContext = createContext(null)


function CommunityUnitsBasciDetailsForm(props) {

	const facilities = props?.facility_data
	const contact_types = props?.contact_types?.map(({ id: value, name: label }) => ({ label, value })) ?? []
	const alert = useAlert()
	const router = useRouter()


	const [countyValue, setCountyValue] = useState('')
	const [subCountyValue, setSubCountyValue] = useState('')
	const [constituencyValue, setConstituencyValue] = useState('')
	const [wardValue, setWardValue] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [contactList, setContactList] = useState([{ contact_types: '', contact: '' }])

	const [formData, setFormData] = useState({})
	const [formError, setFormError] = useState(null)
	const [validationError, setValidationError] = useState(null)
	const setFormId = useContext(SetFormIdContext)

	function handleCUBasicDetailsSubmit (event) {
		
		event.preventDefault();

		setSubmitting(true)

		const formData = new FormData(event.target)

		const payload = { ...Object.fromEntries(formData) }

		const cnts = []

		for (let index in Object.keys(Object.fromEntries(formData)).filter(key => /contact_[0-9]{1}/.test(key))) {

			cnts.push({ contact_type: payload[`contact_type_${index}`], contact: payload[`contact_${index}`] })
		}

		payload['contacts'] = cnts

		for (let i in Object.keys(Object.fromEntries(formData)).filter(key => /contact_[0-9]{1}/.test(key))) {
			// console.log(i)
			delete payload[`contact_type_${i}`]
			delete payload[`contact_${i}`]

		}

		for (let [k, v] of formData.entries()) {
			if (k == 'number_of_chvs' ||
				k == 'location' ||
				k == 'households_monitored'
			) payload[k] = Number(v)
		}


		// Posting CHU basic details 
		try {
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/`, {
				headers: {
					'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
					'Authorization': `Bearer ${props?.token}`
				},
				method: 'POST',
				body: JSON.stringify(payload)
			})

				.then(async resp => {
					if (resp.status == 201) {

						setSubmitting(false)

						alert.success(`${payload?.name} Basic Details Saved successfully`, {
							containerStyle: {
								backgroundColor: "green",
								color: "#fff"
							}
						})

						// const base64EncFromData = Buffer.from(JSON.stringify(payload)).toString('base64')

						const chulId = (await resp.json())?.id

					
						router.push({ pathname: '/community-units/add', query: { formId: '1', chulId } })
						.then((navigated) => {
							if(navigated) setFormId(1)
						})

					} else {
						const detail = await resp.json()

						setSubmitting(false)
						setFormError(Array.isArray(Object.values(detail)) &&  Object.values(detail).length == 1 && typeof Object.values(detail)[0] == 'string' && detail[0][0])
						alert.error({timeout: 10000}, 'Unable to save Community Units Basic details')
					}
				})
		}

		catch (e) {
			alert.error({timeout: 10000}, 'Error Occured: ' + e.message)
		}

	};

	function handleContactAdd(e) {
		e.preventDefault();
		setContactList(s => {
			return [...s, { contact_types: '', contact: '' }]
		})
	};

	function handleFacilityChange({ value }) {

		facilities.map((facility) => {
			if (facility.id === value) {
				setCountyValue(facility.county);
				setSubCountyValue(facility.sub_county_name);
				setConstituencyValue(facility.constituency);
				setWardValue(facility.ward_name);
			}
		}
		);

	}

	function handlePreviousForm (event) {
		event.preventDefault()

		router.push('/community-units')
	}
	
	function handleDateChange(event) {
		event.preventDefault()

		if(event.target.name == "date_established"){
		setValidationError(prev => ({...prev, date_established: null}))
		} else {
		setValidationError(prev => ({...prev, date_operational: null}))
		}

		const today = new Date()

		const setDate = event.target.valueAsDate

		if(setDate > today) {	
			if(event.target.name == "date_established"){
				setValidationError({date_established: 'Date Established Cannot be in the future'})
			} else {
				setValidationError({date_operational: 'Date Operational Cannot be in the future'})
			}

			event.target.value = ''
		
		}


		const dateEstablished = event.target.value !== '' && event.target.name.includes('date_established') ? event.target.valueAsDate : document.querySelector('input[name="date_established"]').valueAsDate 

		const dateOperational = event.target.value !== '' && event.target.name.includes('date_operational') ? event.target.valueAsDate : document.querySelector('input[name="date_operational"]').valueAsDate


		if(dateEstablished && dateOperational) {
			if(dateEstablished > dateOperational) {	
				if(event.target.name == "date_operational"){
					setValidationError({date_operational: 'Date Established Cannot be recent than date operational '})
					event.target.value = ''

				}
		}

		
		}
	}


	useEffect(() => {
		if(window) {
			const previousFormData = new URL(window.location.href)?.searchParams.get('formData');

			if(previousFormData){
				setFormData(() => {
					return JSON.parse(Buffer.from(previousFormData ?? 'J3t9Jw==', 'base64')?.toString())
				})			
			}

		}
	}, [])




	return (
		<>
			<h4 className='text-lg uppercase  pb-2 border-b border-blue-600 w-full font-semibold'>
				Community Health Unit Basic Details
			</h4>

			{formError && <Alert severity="error" sx={{width:'100%', marginY:'15px'}}>{formError}</Alert> }
	
			{/* Actual form */}
			<form
				className='flex flex-col w-full items-start mt-4 justify-start gap-3'
				onSubmit={handleCUBasicDetailsSubmit}>

				{/* CHU name */}
				<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
					<label
						htmlFor='name'
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
						defaultValue={formData?.name}
						className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
				</div>

				{/* CHU linked facility */}
				<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
					<label
						htmlFor='facility'
						className='text-gray-600 capitalize text-sm'>
						Community Health Unit Linked Facility
						<span className='text-medium leading-12 font-semibold'>
							{' '}
							*
						</span>
					</label>
					<Select
						styles={{
							control: (baseStyles) => ({
								...baseStyles,
								backgroundColor: 'transparent',
								outLine: 'none',
								border: 'none',
								outLine: 'none',
								textColor: 'transparent',
								padding: 0,
								height: '4px'
							}),

						}}
						// className='flex-none w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none'
						onChange={handleFacilityChange}
						className='flex-none w-full bg-transparent border border-blue-600 flex-grow  placehold-gray-500 focus:border-gray-200 outline-none'
						options={facilities?.map((facility) => {
							return {
								value: facility.id,
								label: facility.name,
							};
						}
						)}
						defaultInputValue={formData?.facility}
					
						placeholder='Select linked facility...'
						name='facility'


					/>
				</div>

				{/* CHU Status */}

				<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
					<label
						htmlFor="status"
						className='text-gray-600 capitalize text-sm'>
						Operation Status
						<span className='text-medium leading-12 font-semibold'>
							{' '}
							*
						</span>
					</label>

				

					<CustomSelect

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
						defaultValue={formData?.status}
						name='status'

						className='flex-none w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none'
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
									onChange={handleDateChange}
									defaultValue={formData?.date_established}
									className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
								/>

								{validationError?.date_established && <span className='text-red-500 text-sm'>{validationError?.date_established}</span>}

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
									onChange={handleDateChange}
									defaultValue={formData?.date_operational}

									className={`${validationError !== null ? 'border-red-600' : ''} flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none`}
								/>

								{validationError?.date_operational && <span className='text-red-500 text-sm'>{validationError?.date_operational}</span>}
							</div>
						</div>
					</div>
				</div>

				{/* Number of Monitored Households */}
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
						required
						type='number'
						name='households_monitored'
						placeholder='Number of households served by the unit'
						defaultValue={formData?.households_monitored}
						min={0}
						className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
				</div>

				{/* Number of CHVs */}
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
						required
						type='number'
						name='number_of_chvs'
						placeholder='Number of Community Health Volunteers in the unit'
						min={0}
						defaultValue={formData?.number_of_chvs}

						className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
				</div>

				{/* Location */}
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
									defaultValue={formData?.facility_county ?? countyValue}

									type='text'
									name='facility_county'
									className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
									defaultValue={formData?.facility_subcounty ?? subCountyValue }
									type='text'
									name='facility_subcounty'
									className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
									defaultValue={formData?.facility_constituency ?? constituencyValue}
									type='text'
									name='facility_constituency'
									className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
									defaultValue={formData?.facility_ward ?? wardValue}
									type='text'
									name='facility_ward'
									className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Area of Coverage */}
				<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
					<label
						htmlFor='location'
						className='text-gray-600 capitalize text-sm'>
						Area of coverage
					</label>
					<input
						required
						type='text'
						name='location'
						defaultValue={formData?.location}
						placeholder='Description of the area of coverage'
						className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
				</div>

				<div className=' w-full flex flex-col items-start justify-start p-3  border border-blue-600 bg-transparent h-auto'>
					<h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
						Community Health Unit Contacts
					</h4>

					{(() => Array.isArray(formData?.contacts) && formData.length >= 1 ? formData?.contacts: contactList)().map((_, i) => {

						return (
							<div className='w-full flex flex-row items-center  gap-1 gap-x-3 mb-3' >
								<div className='w-full flex flex-col items-left   gap-1 gap-x-3 mb-3'>
									<label
										htmlFor={`contact_type_${i}`}
										className='text-gray-600 capitalize text-sm'
									>
										Contact Type
										<span className='text-medium leading-12 font-semibold'>
											{' '}
											*
										</span>
									</label>

									<CustomSelect
										placeholder="Select Contact ..."
										options={contact_types}
										name={`contact_type_${i}`}
										defaultValue={Array.isArray(formData?.contacts) ? formData?.contacts[i]?.contact_type : ''}
									/>
								</div>
								<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3' >
									<label
										htmlFor={`contact_${i}`}
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
										name={`contact_${i}`}
										defaultValue={Array.isArray(formData?.contacts) ? formData?.contacts[i]?.contact : '' }
										className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
									/>
								</div>

							</div>)
					})
					}

				</div>
				<div className="sticky top-0 right-10 w-full flex justify-end">
					<button className=' bg-blue-600 p-2 text-white flex text-md font-semibold '
						onClick={handleContactAdd}
					>
						{`Add Contact`}
					</button>

				</div>

				{/* Cancel and CHEWs */}
				<div className='flex justify-between items-center w-full'>
					<button onClick={handlePreviousForm} className='flex items-center justify-start space-x-2 p-1 border border-blue-600 px-2'>
						<ChevronDoubleLeftIcon className='w-4 h-4 text-blue-700' />
						<span className='text-medium font-semibold text-blue-700 '>
							Cancel
						</span>
					</button>
					<button
						type='submit'
						className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
						<span className='text-medium font-semibold text-white'>
							{
								submitting ?
									<Spinner />
									:
									'CHEWS'

							}
						</span>
						{
							submitting ? 
							<span className='text-white'>Saving </span>
							:
							<ChevronDoubleRightIcon className='w-4 h-4 text-white' />

						}
					</button>
				</div>
			</form>
		</>
	);



}

function CommunityUnitsExtensionWorkersForm(props) {

	const [contactCHEW, setContactCHEW] = useState([{ first_name: '', last_name: '', is_incharge: '' }])
	const [formError, setFormError] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const setFormId = useContext(SetFormIdContext)
	const alert = useAlert()
	const router = useRouter()
	

	
	function handleCHEWSubmit(event){
		event.preventDefault();

		setSubmitting(true)

		const formData = new FormData(event.target)

		const entries = [...formData.entries()]

		const payload = [...formData.keys()].filter(val => val === 'first_name').map(() => ({}))

		let i = 0;


		entries.forEach(([key, value], _i) => {
			if (!payload[i].hasOwnProperty(key)) {
				payload[i][key] = value.includes('on') ? true : value
			} else {
				i++;
				payload[i][key] = value.includes('on') ? true : value
			}

		})


		const chulId = window && new URL(window?.location?.href).searchParams.get('chulId')

		
		if (payload && chulId) {

			try {
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${chulId}/`, {
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json;charset=utf-8',
						'Authorization': `Bearer ${props?.token}`
					},
					method: 'PATCH',
					body: JSON.stringify({health_unit_workers: payload})
				}).then(async resp => {
					if (resp.status == 200) {

						setSubmitting(false)

						alert.success(`Community Unit Extension Workers Saved successfully`, {
							containerStyle: {
								backgroundColor: "green",
								color: "#fff"
							}
						})

						// const base64EncFromData = Buffer.from(JSON.stringify(payload)).toString('base64')

						router.push({ pathname: '/community-units/add', query: { formId: '2', chulId } })
						.then((navigated) => {
							if(navigated) setFormId(2)
						})


					} else {
						const detail = await resp.json()

						setSubmitting(false)
						setFormError(Array.isArray(Object.values(detail)) &&  Object.values(detail).length == 1 && typeof Object.values(detail)[0] == 'string' && detail[0][0])
						alert.error({timeout: 10000}, 'Unable to save Community Units Extension Workers')
					}
				})
			}
			catch (e) {
				alert.error({timeout: 10000}, 'An error occured: ' + e.message)

				console.error(e.message)
			}

		}
	};

	function handleAddCHEW(e) {
		e.preventDefault();
		setContactCHEW(s => {
			return [...s, { first_name: '', last_name: '', is_incharge: '' }]
		})
	};

	function handleCHEWPrevious (event){
		event.preventDefault();
		setFormId(0)

	};

	return (
		<>
			<h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
				CHEWs: Community Health Promoters
			</h4>

			{formError && <Alert severity="error" sx={{width:'100%', marginY:'15px'}}>{formError}</Alert> }

			<form
				name='chews_form'
				className='flex flex-col w-full items-start justify-start gap-3'
				onSubmit={handleCHEWSubmit}>
				<div className='w-full flex flex-col items-between justify-start border border-blue-600  gap-4 mb-3 p-3'>
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
							<button className=' w-auto  bg-blue-600 p-2 text-white flex text-md font-semibold '
								onClick={handleAddCHEW}
							>
								{`Add +`}

							</button>
						</div>



					</div>
					
					{contactCHEW.map((_, i) => (
						<div className='w-full grid grid-cols-4 mx-auto place-content-start gap-y-1 gap-x-3' key={i} >
							{/* First Name */}

							<input
								required
								
								type='text'
								name='first_name'
								defaultValue={''}
								className='flex-none  md:w-52 w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>


							{/* Second Name */}


							<input
								required
								
								type='text'
								name='last_name'
								defaultValue={''}

								className='flex-none  md:w-52 w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>


							{/* In charge */}


							<input

								name='is_incharge'
								
								type='checkbox'
								className='focus:ring-indigo-50 bg-transparent h-4 w-4 border-blue-600'
							/>



							{/* Delete CHEW */}
							<div className='flex'>
								<div className='flex items-center'>
									{/* insert red button for deleting */}
									<button
										name='delete'
										
										type='button'
										className='bg-transparent group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 hover:border-transparent '
										onClick={(e) => { e.preventDefault(); setContactCHEW(prev => prev.filter((_, index) => index !== i))}}>
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
						className='flex items-center justify-start space-x-2 p-1 border border-black  px-2'
						onClick={handleCHEWPrevious}>
						<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
						<span className='text-medium font-semibold text-black '>
							Basic Details
						</span>
					</button>
					<button
						type='submit'
						className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
						
						<span className='text-medium font-semibold text-white'>
							{
								submitting ?
									<Spinner />
									:
									'Services'

							}
						</span>
						{
							submitting ? 
							<span className='text-white'>Saving </span>
							:
							<ChevronDoubleRightIcon className='w-4 h-4 text-white' />

						}
					</button>
				</div>
			</form>
		</>
	);
}


function CommunityUnitsServicesForm(props) {

	// const [formError, setFormError] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [chulId, setChuilId] = useState('')
	const setFormId = useContext(SetFormIdContext)

	const serviceCtg = props?.service_category ?? []



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




		return _serviceOptions.map(({ name, subCategories, value }) => ({
			label: name,
			options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
		}))

	})(serviceCtg ?? [])


	function handleCHUServiceSubmit (token, selectedServices, chulId) {
		// console.log({stateSetters, chulId})
		
		const _payload = selectedServices.map(({value}) => ({ service: value }))

		_payload.forEach(obj => obj['health_unit'] = chulId)

	

		if(_payload && chulId && token ) {
		try {
			return fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${chulId}/`, {
				headers: {
					'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
					'Authorization': `Bearer ${props?.token}`
				},
				method: 'PATCH',
				body: JSON.stringify({services: _payload})
			})
				

		}
		catch (e) {
			console.error('Unable to patch CHU service details', e.message)
		}
		}

	};

	function handleServicesPrevious (event) {
		event.preventDefault();

		setFormId(1)
	};

	useEffect(() => {
		if(window) setChuilId(new URL(window?.location?.href).searchParams.get('chulId'))
	}, [])


	return (
		<>
			<h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
				Services Offered
			</h4>

			{/* {
				JSON.stringify(props?.service_category)
			} */}

			<div
				name='chu_services_form'
				className='flex flex-col w-full items-start justify-start gap-3'
			>
				<div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

					{/* Edit list Item Container */}
					<div className='flex items-center w-full h-auto min-h-[300px]'>

						
						<EditListItem
							initialSelectedItems={[]}
							categoryItems={serviceOptions[0]?.options} //serviceOptions
							itemId={chulId} //chulId
							item={null}
                            token={props?.token}
							handleItemsSubmit={handleCHUServiceSubmit} //handleCHUServiceSubmit
							handleItemsUpdate={() => null} //handleServiceUpdates
							setNextItemCategory={setFormId}
							setSubmitting={setSubmitting}
							submitting={submitting}
							options={serviceOptions[0]?.options}
							itemName={'chul_services'}
							handleItemPrevious={handleServicesPrevious} //handleServicePrevious
						
						/>

					</div>
				</div>
			</div>
		</>
	);



}


function AddCommunityUnit(props) {


	
	const [formId, setFormId] = useState(0);
	
	useEffect(() => {
		if(window) {

		const id = new URL(window.location.href)?.searchParams.get('formId')
		if(typeof id == 'string') {
			setFormId(Number(id))
			// console.log({formId})

		}
		}
	}, [])
	
	// Define registration steps
	const steps = [ 
		'Basic Details',
		'CHEWS: Community Health Promoters',
		'Services',
	];

	const qf = ''


	return (
		<>
			{/* Head */}
			<Head>
				<title> KMFHL - Add Community Unit</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{/* Main Layout */}
			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
				<div className='w-full h-full grid grid-cols-5 gap-4 px-0 md:px-4 py-2 my-4'>
					{/* Breadcrumbs */}
					<div className='col-span-5 flex flex-col gap-3 md:gap-5 px-0'>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							<div className='flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3'>
								<Link className='text-blue-800' href='/'>
									Home
								</Link>
								{'/'}
								<Link className='text-blue-800' href='/community-units'>
									Community Units
								</Link>
								{'/'}
								<span className='text-gray-500'>Add Community Unit</span>
							</div>
							<div className='flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3'></div>
						</div>


						<div className={"col-span-5 flex justify-between w-full bg-transparent border border-blue drop-shadow  text-blue-900 p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-blue-600" : "border-red-600")}>
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
					<div className='col-span-5 md:col-span-4 flex flex-col items-center border border-blue-600  pt-8 pb-4 gap-4 mt-3 order-last md:order-none'>
						{/* Stepper Header */}
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							<Box sx={{ width: '100%' }}>
								<Stepper activeStep={parseInt(formId)} alternativeLabel>
									{steps.map((label, i) => (
										<Step >
											<StepLabel
												StepIconComponent={() => (
													<span className="w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center">
														{(i + 1)}
													</span>
												)}
											>{label}</StepLabel>
										</Step>
									))}
								</Stepper>
							</Box>
						</div>

						{/* Stepper Body */}
						<div className='flex flex-col justify-center items-start px-1 md:px-4 w-full '>
							<div
								className=' w-full flex flex-col items-start justify-start p-4 bg-blue-50 shadow-md'
								style={{ minHeight: '250px' }}>
								{/* Form-changing switch statement */}

								<SetFormIdContext.Provider value={setFormId}>
										{(() => {
											switch (formId) {
												case 0:
													return <CommunityUnitsBasciDetailsForm {...props} />
												case 1:
													return <CommunityUnitsExtensionWorkersForm {...props} />
												case 2:
													return <CommunityUnitsServicesForm {...props} />
						
											}
										})()}
								</SetFormIdContext.Provider>
						
								
							</div>
						</div>
					</div>

				</div>
			</MainLayout>
		</>
	);
}


export async function getServerSideProps(ctx) {

	const allOptions = {}

	const options = [
		'facilities',
		'services',
		'contact_types',
	]

	async function getFacilityCount(token) {
		try {
		return (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/`, {
		  headers:{
			'Authorization': 'Bearer ' + token,
			'Accept': 'application/json'
		  }
	
		})).json())?.count
		}
		catch (e) {
		  console.error(e.message)
		}
	  }
	


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

							const count = await getFacilityCount(token)

							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name,county,sub_county_name,constituency,ward_name&page=1&page_size=${count}`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})


								allOptions['facility_data'] = (await _data.json()).results

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);

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



								allOptions['contact_types'] = (await _data.json()).results


							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);

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

								allOptions['service_category'] = (await _data.json()).results

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);

							}

							break;
					}
				}

				allOptions['token'] = token

				return {
					props: allOptions
				}

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
