import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../../components/MainLayout';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { checkToken } from '../../../controllers/auth/public_auth';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select'
import { Alert } from '@mui/lab'
import Spinner from '../../../components/Spinner'

function Home(props) {
	// console.log(props)
	const router = useRouter();
	const [facilities, setFacilities] = useState(props?.data)
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const qf = props?.query?.qf || 'all';
	const [viewAll, setViewAll] = useState(true);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const counties = props?.filters?.county || [];
	const facility_type = props?.filters?.facility_type || [];
	const keph_level = props?.filters?.keph_level || [];
	const operation_status = props?.filters?.operation_status || [];
	const owner = props?.filters?.owner || [];
	const owner_type = props?.filters?.owner_type || [];
	const service_ = props?.filters?.service || [];
	const service_category = props?.filters?.service_category || [];


	const [units, setUnits] = useState([])
	const [reset, setReset] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [formError, setFormError] = useState(null)


	const county = useRef(null)
	const subcounty = useRef(null)
	const ward = useRef(null)
	const constituency = useRef(null)
	const facilityType = useRef(null)
	const kephLevel = useRef(null)
	const operationStatus = useRef(null)
	const facilityOwner = useRef(null)
	const ownerType = useRef(null)
	const facilityService = useRef(null)
	const serviceCategory = useRef(null)




	useEffect(() => {

		let qry = props?.query;
		delete qry?.searchTerm;
		delete qry?.qf
		setDrillDown({ ...drillDown, ...qry });
		if (filters && Object.keys(filters).length > 0) {
			filters['status'] = filters['chu_status'];
			delete filters['chu_status'];
		}

	}, [filters]);

	// useEffect(() => {
	// 	if (props?.current_url.includes('search') || router.asPath.includes('search')) {
	// 		setFacilities(props?.data)
	// 		setViewAll(true)

	// 	} else {
	// 		setViewAll(false)
	// 	}
	// }, [props?.current_url]);

	// useEffect(() => {
	// 	setViewAll(true)
	// }, [])

	//admin units
	const administrative_units = [
		{ label: 'county', name: 'county', ref: county, array: counties },
		{ label: 'subcounty', name: 'sub_county', ref: subcounty, array: units['sub_counties'] },
		{ label: 'constituency', name: 'constituency', ref: constituency, array: units['sub_counties'] },
		{ label: 'wards', name: 'ward', ref: ward, array: units['wards'] }
	]

	//services
	const service_units = [
		{ label: 'service category', name: 'service_category', ref: serviceCategory, array: service_category },
		{ label: 'service', name: 'service', ref: facilityService, array: service_ },
	]

	//facility details
	const facility_details = [
		{ label: 'keph level', name: 'keph_level', ref: kephLevel, array: keph_level },
		{ label: 'facility type', name: 'facility_type', ref: facilityType, array: facility_type },
		{ label: 'owner category', name: 'owner_type', ref: ownerType, array: owner_type },
		{ label: 'facility owner', name: 'owner', ref: facilityOwner, array: owner },
		{ label: 'operation status', name: 'operation_status', ref: operationStatus, array: operation_status },

	]
	const getUnits = async (path, id) => {
		try {
			let url = `/api/common/fetch_form_data/?path=${path}&id=${id}`

			const response = await fetch(url, {
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
				method: 'GET'
			})

			let results = await response.json()
			let res = {}
			res[path] = results.results
			setUnits({ ...units, ...res })

		} catch (err) {

		}
	}


	function handleSubmit(e) {
		/*
		if (e !== undefined) {
			e.preventDefault()
		}
		let url = API_URL + `/facilities/material/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,constituency,ward_name,keph_level,operation_status_name`
		const filter_options = {
			name: name.current?.value,
			code: code.current?.value,
			county: county?.current.clearValue()
			sub_county: subcounty?.current.clearValue()
			constituency: constituency?.current.clearValue()
			ward: ward?.current.clearValue()
			facility_type: facilitytype?.current.clearValue()
			keph_level: kephLevel?.current.clearValue()
			operation_status: operationstatus?.current.clearValue()
			owner: facilityowner?.current.clearValue()
			owner_type: ownertype?.current.clearValue()
			service: facilityservice?.current.clearValue()
			service_category: servicecategory?.current.clearValue()
			number_of_beds: beds?.current?.checked || '',
			number_of_cots: cots?.current?.checked || '',
			open_public_holidays: available_holiday?.current?.checked || '',
			open_weekends: available_weekends?.current?.checked || '',
			open_whole_day: available_24hrs?.current?.checked || ''
		}

		let qry = Object.keys(filter_options).map(function (key) {
			if (filter_options[key] !== '') {
				let er = (key) + '=' + (filter_options[key]);
				return er
			}
		}).filter(Boolean).join('&')

		if (qry !== '') {
			url += `&${qry}`
		}
		if (allfacilities.current?.value !== '') {
			url += `&search={"query":{"query_string":{"default_field":"name","query":"${allfacilities.current?.value}"}}}`
		}
		if (service.current?.value !== '') {
			url += `&service_name={"query":{"query_string":{"default_field":"service_names","query":"${service.current?.value}"}}}`
		}

		try {
			const r = await fetch(url, {
				headers: {
					Authorization: 'Bearer ' + props?.token,
					Accept: 'application/json',
				},
			});
			const json = await r.json();
			setFacilities(json)
			setViewAll(true)

		} catch (error) {
			console.log(error);
			setFacilities([])
			setViewAll(false)
		}
		*/

		e.preventDefault()

		//Should be /facilitie/material

		// TODO: Fix the facility detials display list

		let url = API_URL + `/facilities/facilities/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,sub_county_name,constituency,ward_name,keph_level_name,operation_status_name` 
	

		const formData = new FormData(e.target)
		const formDataObject = Object.fromEntries(formData)

		const children = e.target.children

		if (reset) {
			for (let child of children) {

				for (let node of child.querySelectorAll("input")) {

					if (node.type == "search") {
						node.value = ""
					}

					if (node.type == "text") {

						county?.current.clearValue()
						subcounty?.current.clearValue()
						constituency?.current.clearValue()
						ward?.current.clearValue()
						facilityType?.current.clearValue()
						kephLevel?.current.clearValue()
						operationStatus?.current.clearValue()
						facilityOwner?.current.clearValue()
						ownerType?.current.clearValue()
						facilityService?.current.clearValue()
						serviceCategory?.current.clearValue()


					}

					if (node.type == 'checkbox') {
						node.checked = false
					}

				}

			}


		}


		if (!reset) {

			setSubmitting(true)

			const qry = Object.keys(formDataObject).map(function (key) {
				if (formDataObject[key] !== '') {
					const er = (key) + '=' + (formDataObject[key]);
					return er
				}
			}).filter(Boolean).join('&')

			if (qry !== '') {
				url += `&${qry}`
			}
			if (!formDataObject?.facility?.includes('')) {
				url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
			}
			if (!formDataObject?.service?.includes('')) {
				url += `&service_name={"query":{"query_string":{"default_field":"service_names","query":"${formDataObject?.service}"}}}`
			}

			console.log({url})
			fetch(url, {
				headers: {
					Authorization: 'Bearer ' + props?.token,
					Accept: 'application/json',
				},

			})
				.then(resp => {
					if (resp.status == 200 || resp.status == 204) {
						setSubmitting(false)
					} else {
						setSubmitting(false)
					}
					return resp.json()
				})
				.then(facilities => {
					console.log({facilities})
					setFacilities(facilities)
					setViewAll(true)

				})
				.catch(e => {
					setFormError(e.message)
					setFacilities([])
					setViewAll(false)
				})



		}

		if (reset) setReset(false)

	}

	// console.log(facilities)

	return (
		<div className=''>
			<Head>
				<title>KMHFR - Facilities</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
				<div className='w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4'>
					<div className='col-span-5 flex flex-col gap-4 md:gap-5 '>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							{/* Bread Crumbs */}

							<div className='flex flex-row gap-2 text-sm md:text-base py-3'>
								<Link className='text-blue-700' href='/public/facilities'>
									Home
								</Link>
								{'/'}
								<span className='text-gray-500'>Facilities</span>
							</div>
							<div className={"col-span-5 flex justify-between w-full bg-gray-50 drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-blue-600" : "border-red-600")}>
								<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
									{'Facilities'}
								</h2>
								<p>Use the filters to search for a facility
									{/* {'   '}
									<button className='text-lg text-blue-500 hover:underline font-semibold'
										onClick={() => {
											setViewAll(true)
											fetchAllfacilities()
										}
										}
									>view all facilities</button>*/}
									</p> 


							</div>



						</div>

					</div>

					{/* Side Menu Filters*/}


					<form className='col-span-1 w-full flex flex-col item-center justify-start md:col-start-1 gap-8'
						onSubmit={handleSubmit}>

						<div className='flex flex-row gap-4'>
							<button
								type="submit"
								disabled={submitting}
								className="bg-gray-500 border-1 border-gray-50 text-gray-50 flex place-content-center gap-2 px-2 py-1 "
							>
								<span className='text-medium font-semibold text-white'>
									{
										submitting ?
											<Spinner />
											:
											'Search'

									}
								</span>
								{
									submitting &&
									<span className='text-white'>Searching... </span>


								}
							</button>
							<button
								type='submit'
								className="bg-gray-50  text-black flex items-center justify-center px-4 py-1 "
								onClick={() => setReset(true)}
							>Reset
							</button>
						</div>


						{/* <div className='card flex flex-wrap'> */}
						<div className="card col-span-6 md:col-span-2 flex flex-col items-start gap-4 justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
							<h2>Search for a Facility</h2>


							<input
								name="facility"
								className="flex-none bg-gray-50  p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 focus:shadow-none focus:bg-white focus:border-black outline-none"
								type="search"
								placeholder="Search all facilities"
							/>

							<input
								name="service"
								className="flex-none bg-gray-50  p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 focus:shadow-none focus:bg-white focus:border-black outline-none"
								type="search"
								placeholder="Search services"
							/>
						</div>

						<div className="card col-span-6 md:col-span-2 flex flex-col gap-4 items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
							<h2>Facility Info</h2>

							<input
								name="name"
								className="flex-none bg-gray-50  p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 focus:shadow-none focus:bg-white focus:border-black outline-none"
								type="search"
								placeholder="Facility Name"
							/>

							<input
								name="code"
								className="flex-none bg-gray-50  p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 focus:shadow-none focus:bg-white focus:border-black outline-none"
								type="search"
								placeholder="Facility Code"
							/>

						</div>

						<div className="card col-span-6 md:col-span-2 flex flex-col gap-4 items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
							<h2>Administrative Unit</h2>
							<div className="w-full max-w-xs flex flex-col gap-4 items-start justify-start mb-3" id='first'>
								{administrative_units?.map((ct, i) => (
									<>

										<Select
											key={i}
											className="w-full max-w-xs  border border-gray-400"
											ref={ct.ref}
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

											name={ct.name}
											options={
												(() => {
													let opts = [...Array.from(ct.array || [],
														fltopt => {
															if (fltopt.id != null && fltopt.id.length > 0) {
																return {
																	value: fltopt.id, label: fltopt.name
																}
															}
														})]
													return opts
												})()
											}
											placeholder={`Select ${ct.label}`}
											onChange={sl => {
												let nf = {}
												if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
													nf[ct.label] = sl.value
												} else {
													delete nf[ct.label]
												}
												ct.label == 'county' && sl?.value !== undefined && getUnits('sub_counties', sl?.value)
												ct.label == 'subcounty' && sl?.value !== undefined && getUnits('wards', sl?.value)
											}}
										/>
									</>
								))}
							</div>

						</div>


						<div className="card col-span-6 md:col-span-2 flex flex-col gap-4 items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
							<h2>Services</h2>
							<div className="w-full max-w-xs flex flex-col gap-4 items-start justify-start mb-3" id='first'>
								{service_units.map((ct, i) => (
									<>

										<Select
											key={i}
											ref={ct.ref}
											className="w-full max-w-xs  border border-gray-400"
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

											name={ct.name}
											options={
												(() => {
													let opts = [...Array.from(ct.array || [],
														fltopt => {
															if (fltopt.id != null && fltopt.id.length > 0) {
																return {
																	value: fltopt.id, label: fltopt.name
																}
															}
														})]
													return opts
												})()
											}
											placeholder={`Select ${ct.label}`}
											onChange={sl => {
												let nf = {}
												if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
													nf[ct.label] = sl.value
												} else {
													delete nf[ct.label]
												}
												ct.label == 'county' && sl?.value !== undefined && getUnits('sub_counties', sl?.value)
												ct.label == 'subcounty' && sl?.value !== undefined && getUnits('wards', sl?.value)
											}}
										/>
									</>
								))}
							</div>

						</div>


						<div className="card col-span-6 md:col-span-2 flex flex-col gap-4 items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
							<h2>Facility Details</h2>
							<div className="w-full max-w-xs flex flex-col gap-4 items-start justify-start mb-3" id='first'>
								{facility_details.map((ct, i) => (
									<>

										<Select
											key={i}
											className="w-full max-w-xs  border border-gray-400"
											ref={ct.ref}
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

											name={ct.name}
											options={
												(() => {
													let opts = [...Array.from(ct.array || [],
														fltopt => {
															if (fltopt.id != null && fltopt.id.length > 0) {
																return {
																	value: fltopt.id, label: fltopt.name
																}
															}
														})]
													return opts
												})()
											}
											placeholder={`Select ${ct.label}`}
											onChange={sl => {
												let nf = {}
												if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
													nf[ct.label] = sl.value
												} else {
													delete nf[ct.label]
												}
												ct.label == 'county' && sl?.value !== undefined && getUnits('sub_counties', sl?.value)
												ct.label == 'subcounty' && sl?.value !== undefined && getUnits('wards', sl?.value)
											}}
										/>
									</>
								))}

								<div className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'

										type="checkbox"
										name='number_of_beds'
										id='number_of_beds'
									/>

									<label htmlFor="number_of_beds" className="text-gray-600 capitalize text-sm ml-1">{'Has Beds'}</label>



								</div>
								<div className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'

										type="checkbox"
										name='number_of_cots'
										id='number_of_cots'
									/>

									<label htmlFor="number_of_cots" className="text-gray-600 capitalize text-sm ml-1">{'Has Cots'}</label>


								</div>
							</div>

						</div>


						<div className="card col-span-6 md:col-span-2 flex flex-col gap-4 items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
							<h2>Availability</h2>
							<div className="w-full max-w-xs flex flex-col gap-3 items-start justify-start mb-3" id='first'>
								<div className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'

										type="checkbox"
										name='available_holiday'
										id='available_holiday'
									/>

									<label htmlFor={'available_holiday'} className="text-gray-600 capitalize text-sm ml-1">{'Open Public Holidays'}</label>


								</div>
								<div className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'

										type="checkbox"
										name='available_weekends'
										id='available_weekends'
									/>

									<label htmlFor={'available_weekends'} className="text-gray-600 capitalize text-sm ml-1">{'Open Weekends'}</label>

								</div>
								<div className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'

										type="checkbox"
										name='available_24hrs'
										id='available_24hrs'
									/>

									<label htmlFor={'available_24hrs'} className="text-gray-600 capitalize text-sm ml-1">{'Open 24 Hours '}</label>


								</div>

							</div>

						</div>



					</form>

					{/* Main body */}
					{/* <div className='col-span-5 md:col-span-4 flex flex-col items-center gap-4 mt-2 order-last md:order-none'> */}
					<div className={`${(Array.isArray(facilities) && facilities?.length == 0) || (!formError || !submitting) && 'p-4'} col-span-6 bg-gray-50 shadow-md md:col-span-4 flex flex-col gap-4 order-last md:order-none`}> {/* CHANGED colspan */}

						{
							formError && <Alert severity='error' className='w-full border-2 border-red-500 rounded-none'>{formError}</Alert>
						}


						{
							submitting && <Alert severity='info' className='w-full border-2 border-blue-500 rounded-none'>Loading...</Alert>
						}
{/* 
						<pre>
							{
								JSON.stringify(facilities, null, 2)
							}
						</pre> */}


						<div className='flex flex-col justify-center items-center md:col-span-4 w-full '>
							{/* <pre>{JSON.stringify(facilities[0], null, 2)}</pre> */}

							{viewAll && facilities?.results && facilities?.results.length > 0 ? (
								facilities?.results.map((hf, index) => (
									<div
										key={index}
										className='px-1 md:px-3 grid grid-cols-8 gap-3 border-b border-gray-400 py-4 hover:bg-gray-50 w-full'>
										<div className='col-span-8 flex flex-col gap-1 group items-start justify-center text-left'>
											<h3 className='text-2xl w-full'>
												<Link
													href={'/public/facilities/' + hf?.id}
													className='hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800'>
													{/* <small className='text-gray-500'> */}
														{/* {index + props?.data?.start_index}. */}
													{/* </small>{' '} */}
													{	
														hf?.official_name ||
														hf?.official_name ||
														hf?.name
													}
												</Link>
											</h3>
											{/* <p className="text-sm text-gray-600 w-full">{comm_unit.nearest_landmark || ' '}{' '} {comm_unit.location_desc || ' '}</p> */}
											<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
												<span className='text-lg text-black font-semibold'>
													# {hf?.code ?? 'NO_CODE'}
												</span>
												<span>{hf?.facility_name ?? ' '}</span>
											</p>
											<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>

												{(hf?.facility_type_category) ? <span className={"shadow-sm leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-black"}>{hf?.facility_type_category}</span> : ""}
											</p>

											<div className='flex items-center justify-start gap-3'>
												<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
													{hf?.facility_type_name &&  <span className={"shadow-sm leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-black"}>{hf?.facility_type_name}</span>}
												</p>

												<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
													{hf?.keph_level_name && <span className={"shadow-sm leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-black"}>{hf?.keph_level_name}</span> }
												</p>


												<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
													{(hf?.operational || hf?.operation_status_name) && <span className={"shadow-sm leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-black"}>Operational</span> }
												</p>
											</div>

											<div className='text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full'>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														County:
													</label>

													<span>
														{
															hf?.facility_county ||
															hf?.county_name || 
															hf?.county ||
															'N/A'
														}
													</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														Sub-county:
													</label>

													<span>
														{
															hf?.facility_subcounty ||
															hf?.sub_county_name ||
															'N/A' 
														}
													</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>Ward:</label>
													
													<span>{hf?.ward_name || 'N/A'}</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														Constituency:
													</label>

													<span>
														{
															hf?.constituency_name ||
															hf?.constituency ||
															'N/A'
														}
													</span>
												</div>
											</div>
										</div>
										
										{/* <div className='col-span-8  border-2 border-red-600 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end'>
										</div> */}
									</div>
								))
							) : (
								<>{!formError && !submitting && <Alert severity='warning' className='w-full border-2 border-yellow-500 rounded-none'>Could not find facility</Alert>}</>
							)}
							{viewAll && facilities?.results && facilities?.results.length >= 30 && (
								<ul className='list-none flex p-2 flex-row gap-2 w-full items-center my-2'>
									<li className='text-base text-gray-600'>

										<a
											href={
												(() =>
													props.path.includes('?page') ?
														props.path.replace(/\?page=\d+/, `?page=${facilities?.current_page}`)
														:
														props.path.includes('?q') && props.path.includes('&page') ?
															props.path.replace(/&page=\d+/, `&page=${facilities?.current_page}`)
															:
															props.path.includes('?q') ?
																`${props.path}&page=${facilities?.current_page}`
																:
																`${props.path}?page=${facilities?.current_page}`
												)()
											}
											className='text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline'>
											{facilities?.current_page}
										</a>
									</li>
									{facilities?.near_pages &&
										facilities?.near_pages.map((page, i) => (
											<li key={i} className='text-base text-gray-600'>

												<a
													href={
														(() =>
															props.path.includes('?page') ?
																props.path.replace(/\?page=\d+/, `?page=${page}`)
																:
																props.path.includes('?q') && props.path.includes('&page') ?
																	props.path.replace(/&page=\d+/, `&page=${page}`)
																	:
																	props.path.includes('?q') ?
																		`${props.path}&page=${page}`
																		:
																		`${props.path}?page=${page}`

														)()
													}
													className='text-blue-800 p-2 hover:underline active:underline focus:underline'>
													{page}
												</a>
											</li>
										))}
									<li className='text-sm text-gray-400 flex'>
										<DotsHorizontalIcon className='h-3' />
									</li>

								</ul>
							)}
						</div>

					</div>

				</div>
			</MainLayout>
		</div>
	);
};


export async function getServerSideProps (ctx) {

	ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )

	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	
	
	const fetchFilters = async (token) => {
		let filters_url =
			API_URL +
			'/common/filtering_summaries/?fields=county,facility_type,operation_status,service_category,owner_type,owner,service,keph_level_name';
		try {
			const r = await fetch(filters_url, {
				headers: {
					Authorization: 'Bearer ' + token,
					Accept: 'application/json',
				},
			});
			const json = await r.json();
			return json;
		} catch (err) {
			console.log('Error fetching filters: ', err);
			return {
				error: true,
				err: err,
				filters: [],
				path: ctx.asPath || '/',
			};
		}
	};

	const fetchData = async (token) => {
		let url = API_URL + `/facilities/material/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,constituency,ward_name,keph_level_name,operation_status_name`
		let query = { searchTerm: '' };
		if (ctx?.query?.q) {
			query.searchTerm = ctx.query.q;
			url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`;
		}
		let other_posssible_filters = [
			'county',
			'constituency',
			'ward',
			'status',
			'sub_county',
		];
		other_posssible_filters.map((flt) => {
			if (ctx?.query[flt]) {
				query[flt] = ctx?.query[flt];
				url = url + '&' + flt.replace('chu_', '') + '=' + ctx?.query[flt];
			}
		});
		// let current_url = url + '&page_size=25000' //change the limit on prod
		let current_url = url + '&page_size=100';
		if (ctx?.query?.page) {
			url = `${url}&page=${ctx.query.page}`;
		}
		try {
			const r = await fetch(url, {
				headers: {
					Authorization: 'Bearer ' + token,
					Accept: 'application/json',
				},
			});
			const json = await r.json();
			const ft = await fetchFilters(token);
			return { props: {
				data: json,
				query,
				token,
				filters: { ...ft },
				path: ctx.asPath || '/facilities',
				current_url: current_url,
			}
		};
		} catch (err) {
			console.log('Error fetching facilities: ', err);
			return {
				error: true,
				err: err,
				data: [],
				query: {},
				path: ctx.asPath || '/facilities',
				current_url: '',
			};
		}
	};
	return checkToken(ctx.req, ctx.res)
		.then((t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
				return fetchData(token).then((t) => t);
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
					query: {},
					path: ctx.asPath || '/facilities',
					current_url: '',
				};
			}, 1000);
		});
}

export default Home;
