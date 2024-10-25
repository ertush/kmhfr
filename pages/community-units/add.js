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
import { 
	ChevronDoubleRightIcon, 
	ChevronDoubleLeftIcon,
	XCircleIcon, 
	TrashIcon } from '@heroicons/react/solid';
import { Select as CustomSelect } from '../../components/Forms/formComponents/Select';
import Select from 'react-select'
import { useAlert } from "react-alert";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Spinner from '../../components/Spinner'
import Alert from '@mui/material/Alert';
import { 
	KeyboardArrowRight,
	KeyboardArrowDown

} from '@mui/icons-material'
import withAuth from '../../components/ProtectedRoute';



const SetFormIdContext = createContext(null)


function CommunityUnitsBasciDetailsForm(props) {


	const alert = useAlert()
	const router = useRouter()

	const facilities = props?.facilities

	const facilityOptions = facilities?.map(({id: value, name: label, owner_type: type, owner_type_name: own }) => ({label, value, type, own}))

	const [countyValue, setCountyValue] = useState('')
	const [subCountyValue, setSubCountyValue] = useState('')
	const [constituencyValue, setConstituencyValue] = useState('')
	const [wardValue, setWardValue] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [contactList, setContactList] = useState([{ contact_types: '', contact: '' }])

	const [formData, setFormData] = useState({})
	const [formError, setFormError] = useState(null)
	const [validationError, setValidationError] = useState({date_established:null, date_operational: null})
	const setFormId = useContext(SetFormIdContext)
	const [facilityType, setFacilityType] = useState(null)


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
						alert.error('Unable to save Community Units Basic details')
					}
				})
		}

		catch (e) {
			alert.error('Error Occured: ' + e.message)
		}

	};

	function handleContactAdd(e) {
		e.preventDefault();
		setContactList(s => {
			return [...s, { contact_types: '', contact: '' }]
		})
	};

	function handleFacilityChange({ value }) {

		facilities?.map(({id, county, sub_county_name, constituency, ward_name, owner_type, owner_type_name}) => {
			if (id === value) {
				setCountyValue(county);
				setSubCountyValue(sub_county_name);
				setConstituencyValue(constituency);
				setWardValue(ward_name);
				setFacilityType(owner_type_name);
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
				setValidationError(prev => ({ ...prev, date_established: 'Date Established cannot be in the future' }))
			} else {
				setValidationError(prev => ({ ...prev, date_operational: 'Date Established cannot be in the future' }))
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
			<h4 className='text-lg uppercase  pb-2 border-b border-gray-600 w-full font-semibold'>
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
						required
						placeholder='Select the name of the CHU'
						type='text'
						name='name'
						defaultValue={formData?.name}
						className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
				</div>

				{/* CHU linked facility */}
				<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
					{/* <pre>
						{
							JSON.stringify(facilities, null, 2)
						}
					</pre> */}
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
						// className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
						onChange={handleFacilityChange}
						className='flex-none w-full bg-transparent border border-gray-600 flex-grow  placehold-gray-500 focus:border-gray-200 outline-none'
						options={facilityOptions}
						defaultInputValue={formData?.facility}
						required
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

						options={props?.statuses}
						required
						placeholder='Select an operation status ...'
						defaultValue={formData?.status}
						name='status'
						className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
									className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
								/>
								<p className='text-red-500 text-sm'>{validationError.date_established ?? ''}</p>
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

									className={`${validationError !== null ? 'border-red-600' : ''} flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 rounded focus:shadow-none focus:bg-white focus:border-black outline-none`}
								/>
								<p className='text-red-500 text-sm'>{validationError.date_operational ?? ''}</p>
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
						className='flex-none w-full bg-transparent rounded  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
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

						className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
				</div>

				{/* Location */}
				<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
					<div className='grid md:grid-cols-4 grid-cols-1 place-content-start gap-3 w-full'>
						{/* County  */}
						<div className='col-span-1'>
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
									required
									type='text'
									name='facility_county'
									className='flex-none w-full bg-transparent rounded  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
								/>
							</div>
						</div>

						{/* Sub-county */}
						<div className='col-span-1'>
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
									required
									defaultValue={formData?.facility_subcounty ?? subCountyValue }
									type='text'
									name='facility_subcounty'
									className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
								/>
							</div>
						</div>

						{/* Constituency */}
						<div className='col-span-1'>
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
									required
									name='facility_constituency'
									className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
								/>
							</div>
						</div>

						{/* Ward */}
						<div className='col-span-1'>
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
									required
									name='facility_ward'
									className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
						type='text'
						name='location'
						defaultValue={formData?.location}
						placeholder='Description of the area of coverage'
						className='flex-none w-full bg-transparent rounded  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
				</div>

				{/* Community Health Unit Workforce */}
				<div className='grid grid-cols-3 grid-rows-5 gap-3 mb-3 w-full'>
					<h4 className='col-span-3 self-end row-start-1 text-lg uppercase  border-b border-gray-600 w-full font-semibold text-gray-900'>
					Community Health Unit Workforce
					</h4>
					<label className='col-start-2 row-start-2 text-gray-600 self-end'>Number Present</label>
					<label className='col-start-3 row-start-2 text-gray-600 self-end'>Number Trained</label>

					{/* <div className='row-span-3'> */}
					<label className='col-start-1 row-start-3 self-end'>Community Health Promoters (CHPs)*</label>
					<label className='col-start-1 row-start-4 self-end'>Community Health Assistants (CHAs)*</label>
					<label className='col-start-1 row-start-5 self-end'>Community Health Commitee Members (CHC)*</label>

					{/* </div> */}
				
					<input
						defaultValue={''}
						type='number'
						required
						name='chps_present'
						className='col-start-2 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={''}
						type='number'
						name='chps_trained'
						required
						className='col-start-3 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
					
					<input
						defaultValue={''}
						type='number'
						name='chas_present'
						required
						className='col-start-2 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={''}
						type='number'
						name='chas_trained'
						required
						className='col-start-3 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={''}
						type='number'
						name='chcs_present'
						required
						className='col-start-2 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={''}
						type='number'
						name='chcs_trained'
						required
						className='col-start-3 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>



				</div>

				<div className=' w-full flex flex-col items-start justify-start p-3  border border-gray-600 bg-transparent h-auto'>
					<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
						Community Health Unit Contacts
					</h4>

					{(() => Array.isArray(formData?.contacts) && formData.length >= 1 ? formData?.contacts: contactList)().map((_, i) => {

						return (
							<div key={i} className='w-full flex flex-row items-center  gap-1 gap-x-3 mb-3' >
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
										options={props?.contact_types}
										name={`contact_type_${i}`}
										required
										defaultValue={Array.isArray(formData?.contacts) ? formData?.contacts[i]?.contact_type : ''}
									/>
								</div>
								<div className='flex w-full gap-2 items-center'>
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
										className='flex-none flex-grow bg-transparent  p-2 w-auto border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
									/>
								</div>

								<button 
                    id={`delete-btn-${i}`}
                    onClick={ev => {
                        ev.preventDefault();
						
						if(Array.isArray(formData?.contacts) && formData.length >= 1) {
							setFormData({contact: formData?.contact.filter((_, index) => index !== i)})
						} else {
							setContactList(contactList.filter((_, index) => index !== i))
						}

                        
                     
                    }}
                    >
                      <XCircleIcon className='w-7 h-7 text-red-400'/>
                      </button>
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
					<button onClick={handlePreviousForm} className='flex items-center justify-start space-x-2 p-1 border border-gray-600 px-2'>
						<ChevronDoubleLeftIcon className='w-4 h-4 text-gray-700' />
						<span className='text-medium font-semibold text-gray-700 '>
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
							<span className='text-white'>Saving.. </span>
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
						alert.error('Unable to save Community Units Extension Workers')
					}
				})
			}
			catch (e) {
				alert.error('An error occured: ' + e.message)

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

	function handleDelete(e, i) {
		e.preventDefault(); 
		setContactCHEW(prev => prev.filter((_, index) => index !== i))
	}

	return (
		<>
			<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
				CHAs: Community Health Assistant
			</h4>

			{formError && <Alert severity="error" sx={{width:'100%', marginY:'15px'}}>{formError}</Alert> }

			<form
				name='chews_form'
				className='flex flex-col w-full items-start justify-start gap-3'
				onSubmit={handleCHEWSubmit}>
				<div className='w-full flex flex-col items-between justify-start border border-gray-600  gap-2 mb-3 p-3'>
					
				<div className="flex items-start justify-between">

					<div className='w-full grid md:grid-cols-5 mx-auto place-content-start gap-x-5 flex-1 mb-2'>

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
							htmlFor='mobile_no'
							className='block text-sm font-medium text-gray-700'>
							Mobile Phone Number*
						</label>

						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email
						</label>

						<label
								htmlFor='last_name'
								className='block text-sm font-medium text-gray-700'>
								Delete
							</label>

							

			
					</div>
					
					<div className='flex flex-row justify-between gap-2'>
							
							<button className=' w-auto  bg-blue-600 p-2 text-white flex text-md font-semibold '
								onClick={handleAddCHEW}
							>
								{`Add +`}

							</button>
						</div> 


						
						</div>

				

					
					{contactCHEW.map((_, i) => (
						<div className="flex items-start justify-between" key={i+1}>
						<div className='w-full grid md:grid-cols-5 mx-auto place-content-start gap-y-1 gap-x-5'  >
							{/* First Name */}

							<input
								required
								
								type='text'
								name='first_name'
								defaultValue={''}
								className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>


							{/* Second Name */}


							<input
								required
								type='text'
								name='last_name'
								defaultValue={''}
								className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>

					
							{/* Phone Number */}

							<input
								required
								type='tel'
								pattern={'[0-9]{10}'}
								placeholder={'07XXXXXXXX'}
								name='mobile_no'
								defaultValue={''}

								className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>



							{/* Email */}

							<input
								required
								type='email'
								name='email'
								defaultValue={''}
								placeholder="user@email-domain"
								pattern="[a-z0-9]+[.]*[\-]*[a-z0-9]+@[a-z0-9]+[\-]*[.]*[a-z0-9]+[.][a-z]{2,}"
								className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>




							{/* In charge */}

							{/* 
							<input

								name='is_incharge'
								
								type='checkbox'
								className='focus:ring-indigo-50 bg-transparent h-4 w-4 border-gray-600'
							/> */}



							{/* Delete CHEW */}
							<div className='flex'>
								<div className='flex items-center'>
									{/* insert red button for deleting */}
									<button
										name='delete'
										
										type='button'
										className='bg-transparent group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 hover:border-transparent '
										onClick={e => handleDelete(e, i)}>
										<TrashIcon className="w-4 h-4 text-red-500 group-hover:text-white" />
									</button>
								</div>
							</div>




						</div>

						<div className='flex flex-row justify-between gap-x-2'>
							
							<span disabled={true} className=' w-auto bg-transparent p-4 text-white flex text-md font-semibold '
							>
								{`Add +`}

							</span>
						</div> 

						</div>
					))}



				</div>

				


				

				{/* Basic Details and Services */}
				<div className='flex justify-between items-center w-full p-2'>
					<button
						className='flex items-center justify-start space-x-2 p-1 border border-gray-600  px-2'
						onClick={handleCHEWPrevious}>
						<ChevronDoubleLeftIcon className='w-4 h-4 text-gray-600' />
						<span className='text-medium font-semibold text-gray-600 '>
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

	const serviceCtg = props?.services ?? []



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


	function handleCHUServiceSubmit (payload, selectedServices, chulId) {
		
		const _payload = selectedServices.map(({value}) => ({ service: value }))

		_payload.forEach(obj => obj['health_unit'] = chulId)

		// console.log(JSON.stringify({services: _payload, ...payload}, null, 2))
		// console.log(JSON.stringify({payload, chulId}))


		if(_payload && chulId) {
		try {
			return fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${chulId}/`, {
				headers: {
					'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
					'Authorization': `Bearer ${props?.token}`
				},
				method: 'PATCH',
				body: JSON.stringify({services: _payload, ...payload})
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
			<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
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
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	
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
		'CHAs: Community Health Assistants',
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
				<div className='w-full md:w-[85%] md:mx-auto h-full grid md:grid-cols-5 grid-cols-1 place-content-center md:gap-4 gap-y-4 md:gap-y-0 px-4 py-2 my-4'>
					{/* Breadcrumbs */}
					<div className='col-span-5 flex flex-col gap-3 md:gap-5 px-0'>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							<div className='flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3'>
								
								<Link className='text-gray-500' href='/community-units'>
									Community Units
								</Link>
								{'/'}
								<span className='text-gray-800'>Add</span>
							</div>
							<div className='flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3'></div>
						</div>


						<div className={"col-span-5 flex justify-between w-full bg-transparent border border-gray drop-shadow  text-gray-900 p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-gray-600" : "border-red-600")}>
							<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
								{'New Community Unit'}
							</h2>
						</div>
					</div>

					{/* Side Menu Filters*/}
					<div className="hidden md:flex md:col-span-1 md:mt-3 h-full">
						<CommunityUnitSideMenu
							qf={qf}
							filters={[]}
							_pathId={''}
						/>
					</div>

					<button className='md:hidden col-span-1 relative p-2 border border-gray-800 rounded min-w-full' onClick={() => setIsMenuOpen(!isMenuOpen)}>
							Community Units Menu
							{
								!isMenuOpen &&
								<KeyboardArrowRight className='w-8 aspect-square text-gray-800' />
							}

							{
								isMenuOpen &&
								<KeyboardArrowDown className='w-8 aspect-square text-gray-800' />
							}

							{
								isMenuOpen &&
								<CommunityUnitSideMenu
									qf={qf}
									filters={[]}
									_pathId={''}
								/>
							}
						</button>

					{/* Stepper and Form */}
					<div className='col-span-5 md:col-span-4 flex flex-col items-center border rounded border-gray-600  pt-8 pb-4 gap-4 mt-3 order-last md:order-none'>
						{/* Stepper Header */}
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							<Box sx={{ width: '100%' }}>
								<Stepper activeStep={parseInt(formId)} alternativeLabel>
									{steps.map((label, i) => (
										<Step key={i}>
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
						<div className='flex flex-col justify-center items-start p-2 md:px-4 w-full '>
							<div
								className=' w-full flex flex-col items-start justify-start p-4 bg-gray-50 rounded'
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

export async function getServerSideProps({req, res}) {

	res?.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59'
	)

	const {token} = await checkToken(req, res)
  
	const response = {}
	
	const options = [
	  "cu",
	  "statuses",
	  "facilities",
	  "contact_types",
	  "services"
	]
  
 
	 function fetchFacilities(url) {
		return fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		})
		.then(resp => resp.json())
		.then( (resp) => {



			const userSubCountyIDs = resp?.user_sub_counties.length > 1 ? resp?.user_sub_counties.map(({sub_county}) => sub_county).join(',') : resp?.user_sub_counties[0]?.sub_county
			const userCountyID = resp?.county
			const userGroup = resp?.groups[0]?.id

			
			if(userGroup == 2 && userSubCountyIDs){
			
			const subCountyFacilitiesURL = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?sub_county=${userSubCountyIDs}&reporting_in_dhis=true&closed=false&fields=id,name,county,sub_county_name,constituency,ward_name&page_size=300`

		

		   return fetch(subCountyFacilitiesURL, {
				headers:{
				  'Authorization': 'Bearer ' + token,
				  'Accept': 'application/json'
				}
				
			  })
			  .then(resp => resp.json())
			  .then(resp => {
				return resp?.results
			  })
			
			  

			}

			else if(userGroup == 1 && userCountyID) {

			 return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?county=${userCountyID}&reporting_in_dhis=true&closed=false&owner_type=6a833136-5f50-46d9-b1f9-5f961a42249f&fields=id,name,county,sub_county_name,constituency,ward_name`,{
					headers:{
					  'Authorization': 'Bearer ' + token,
					  'Accept': 'application/json'
					}
				  }).then(resp => resp.json())
				  .then(resp => {
					return resp?.results
				  })


			} 
			else if(userGroup == 7 || userGroup == 11 || userGroup == 5) {
				 return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?reporting_in_dhis=true&closed=false&owner_type=6a833136-5f50-46d9-b1f9-5f961a42249f&fields=id,name,county,sub_county_name,constituency,ward_name`,{
					headers:{
					  'Authorization': 'Bearer ' + token,
					  'Accept': 'application/json'
					}
					
				  })
				  .then(resp => resp.json())
				  .then(resp => {
					return resp?.results
				  })
				  
			} else {
				console.log('default case')
				return []
			}
			
		})
		.catch(e => console.error('Error rest-auth user :', e.message))
	}
  
  
	try {
		
		if(token.error) throw Error('Unable to get token')
  
		for( let option of options){
		switch(option){ 
  
		 
		case "statuses":
		  const statuses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/statuses/?fields=id,name`,{
			headers:{
			  'Authorization': 'Bearer ' + token,
			  'Accept': 'application/json'
			}
			
		  })
  
		  response["statuses"] =  (await (await statuses.json()))?.results?.map(({ id, name }) => ({ label: name, value: id }))
		  break;
  
		case "facilities":

		const url = `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/user/`

		response['facilities'] = await fetchFacilities(url)
		 
		break;
		case "contact_types":
		  const contact_types = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/contact_types/?fields=id,name`,{
			headers:{
			  'Authorization': 'Bearer ' + token,
			  'Accept': 'application/json'
			}
			
		  })
  
		  response["contact_types"] =  (await (await contact_types.json()))?.results?.map(({ id, name }) => ({ label: name, value: id }))
		  break;
  
		  case "services":"user_manager"
		  const services = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=100&ordering=name`,{
			headers:{
			  'Authorization': 'Bearer ' + token,
			  'Accept': 'application/json'
			}
			
		  })
  
		  response["services"] =  (await (await services.json()))?.results
		  break;
		}
		} 
  
		response['token'] = token
	   
		
		
	  }
	  
	catch(e) {
	  console.error(e.message)
	}

	return {
		props: response
	  }
  
}

export default withAuth(AddCommunityUnit)
