import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../../components/MainLayout';
import {DotsHorizontalIcon} from '@heroicons/react/solid';
import { checkToken } from '../../../controllers/auth/public_auth';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {SearchIcon } from "@heroicons/react/solid";
import Select from 'react-select'



const Home = (props) => {
    // console.log(props)
	const router = useRouter();
	const [facilities, setFacilities] = useState([])
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const qf = props?.query?.qf || 'all';
	const [viewAll, setViewAll] = useState(false);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const counties = props?.filters?.county || [];
	const facility_type = props?.filters?.facility_type || [];
	const keph_level = props?.filters?.keph_level || [];
	const operation_status = props?.filters?.operation_status || [];
	const owner = props?.filters?.owner || [];
	const owner_type = props?.filters.owner_type || [];
	const service_ = props?.filters?.service || [];
	const service_category = props?.filters?.service_category || [];


	const [units, setUnits]=useState([])

	const code=useRef(null)
	const allfacilities = useRef(null)
	const service = useRef(null)
	const name = useRef(null)
	const county = useRef(null)
	const subcounty = useRef(null)
	const ward = useRef(null)
	const constituency = useRef(null)
	const facilitytype = useRef(null)
	const kephlevel = useRef(null)
	const operationstatus = useRef(null)
	const facilityowner = useRef(null)
	const ownertype = useRef(null)
	const facilityservice= useRef(null)
	const servicecategory = useRef(null)
	const beds = useRef(null)
	const cots = useRef(null)
	const available_holiday =useRef(null)
	const available_weekends =useRef(null)
	const available_24hrs = useRef(null)

	
	useEffect(() => {
		
		let qry = props?.query;
		delete qry.searchTerm;
		delete qry.qf
		setDrillDown({ ...drillDown, ...qry });
		if (filters && Object.keys(filters).length > 0) {
			filters['status'] = filters['chu_status'];
			delete filters['chu_status'];
		}

	}, [filters]);

	useEffect(() => {
		if(props?.current_url.includes('search')|| router.asPath.includes('search')){
			setFacilities(props?.data)
			setViewAll(true)

		}else{
			setViewAll(false)
		}
	}, [props?.current_url]);
 
	//admin units
	const administrative_units= [
		{label:'county', ref:county,array: counties},
		{label: 'subcounty', ref:subcounty, array: units['sub_counties']},
		{label: 'constituency', ref:constituency, array: units['sub_counties']},
		{label: 'wards', ref:ward, array: units['wards']}
	]

	//services
	const service_units= [
		{label: 'service category', ref:servicecategory, array: service_category},
		{label:'service', ref:facilityservice,array: service_},
	]

	//facility details
	const facility_details =[
		{label:'keph level', ref:kephlevel,array: keph_level},
		{label:'facility type', ref:facilitytype,array: facility_type},
		{label:'facility owner category', ref:ownertype,array: owner_type},
		{label:'facility owner', ref:facilityowner,array: owner},
		{label:'operation status', ref:operationstatus,array: operation_status},

	]
	const getUnits = async (path, id) => {
		try{
			let url = `/api/common/fetch_form_data/?path=${path}&id=${id}`

			const response = await fetch(url, {
				headers:{
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
				method:'GET'
			})

			let results = await response.json()
			let res = {}
			res[path]= results.results
			setUnits({...units,...res})
			
		}catch (err){
			
		}
	}
	const filterFacilities = async (e) => {
		if(e !== undefined){
			e.preventDefault()
		}
		let url = API_URL +`/facilities/material/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,constituency,ward_name,keph_level,operation_status_name`
		const filter_options ={
			name: name.current.value,
			code: code.current.value,
			county: county?.current?.state?.value?.value || '',
			sub_county: subcounty?.current?.state?.value?.value || '',
			constituency: constituency?.current?.state?.value?.value || '',
			ward:ward?.current?.state?.value?.value || '',
			facility_type: facilitytype?.current?.state?.value?.value || '', 
			keph_level: kephlevel?.current?.state?.value?.value || '',
			operation_status: operationstatus?.current?.state?.value?.value || '',
			owner: facilityowner?.current?.state?.value?.value || '',
			owner_type: ownertype?.current?.state?.value?.value || '',
			service: facilityservice?.current?.state?.value?.value || '', 
			service_category: servicecategory?.current?.state?.value?.value || '',
			number_of_beds:beds?.current.checked || '',
			number_of_cots:cots?.current.checked || '',
			open_public_holidays:available_holiday?.current.checked || '',
			open_weekends:available_weekends?.current.checked || '',
			open_whole_day: available_24hrs?.current.checked || ''
		}
		
		let qry = Object.keys(filter_options).map(function (key) {
			if(filter_options[key] !== ''){
				let er = (key) + '=' + (filter_options[key]);
				return er
			}
         }).filter(Boolean).join('&')
		
		if(qry !== ''){
			url += `&${qry}`
		}
		if(allfacilities.current.value !== ''){
			url += `&search={"query":{"query_string":{"default_field":"name","query":"${allfacilities.current.value}"}}}`
		}
		if(service.current.value !== ''){
			url += `&service_name={"query":{"query_string":{"default_field":"service_names","query":"${service.current.value}"}}}`
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
	}

	// console.log(facilities)

	return (
		<div className=''>
			<Head>
				<title>KMHFL - Community Units</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
				<div className='w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4'>
					<div className='col-span-5 flex flex-col gap-3 md:gap-5 px-4'>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							{/* Bread Crumbs */}

							<div className='flex flex-row gap-2 text-sm md:text-base py-3'>
								<Link className='text-green-700' href='/'>
									Home
								</Link>
								{'/'}
								<span className='text-gray-500'>Facilities</span>
							</div>
							<div className={"col-span-5 flex justify-between w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    {'Facilities'}
                                </h2>
								<p>Use the form on the left to filter facilities or &nbsp;
								<button className='text-lg text-blue-500 font-semibold' 
								 onClick={()=>{
									setViewAll(true)
									filterFacilities()
								}
								}
								>view all facilities</button></p>								
								
                               
                        </div>

						</div>
							
					</div>
				    
					  {/* Side Menu Filters*/}
					
                    <div className='col-span-1 w-full md:col-start-1 h-auto border-r-2 border-gray-300 h-full'>
                        <form onSubmit={(e)=>filterFacilities(e)}>
                            {/* <div className='card flex flex-wrap'> */}
                            <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>

                                        <label className=" text-gray-600">Search all facilities</label>
                                        <input
                                            name="facility"
											ref={allfacilities}
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Search all facilities"
                                        />      
                                        <label className=" text-gray-600">Search services</label>
                                        <input
                                            name="service"
											ref={service}
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Search services"
                                        />                      
                            </div>
                            &nbsp;
                            <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
                                        <h2>Facility Info</h2>
                                        &nbsp; 
                                        <label className=" text-gray-600">Facility Name</label>
                                        <input
                                            name="name"
											ref={name}
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Facility Name"
                                        />    
                                        <label className=" text-gray-600">Facility Code</label>
                                        <input
                                            name="code"
											ref={code}
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Facility Code"
                                        />  
                                                          
                            </div>
							&nbsp;
							<div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Administrative Unit</h2> &nbsp;
								<div  className="w-full max-w-xs flex flex-col items-start justify-start mb-3" id='first'>
									{administrative_units.map(ct=>(
										<>
										<label htmlFor={ct.label} className="text-gray-600 capitalize text-sm ml-1">{ct.label}:</label>
									   <Select name={ct.label}  ref={ct.ref} defaultValue={drillDown[ct.label] || "national"} id={ct.label} className="w-full max-w-xs p-1 justify-startrounded bg-gray-50"
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

							&nbsp;
							<div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Services</h2> &nbsp;
								<div  className="w-full max-w-xs flex flex-col items-start justify-start mb-3" id='first'>
									{service_units.map(ct=>(
										<>
										<label htmlFor={ct.label} className="text-gray-600 capitalize text-sm ml-1">{ct.label}:</label>
									   <Select name={ct.label}  ref={ct.ref} defaultValue={drillDown[ct.label] || "national"} id={ct.label} className="w-full max-w-xs p-1 rounded bg-gray-50"
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

							&nbsp;
							<div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Facility Details</h2> &nbsp;
								<div  className="w-full max-w-xs flex flex-col items-start justify-start mb-3" id='first'>
									{facility_details.map(ct=>(
										<>
										<label htmlFor={ct.label} className="text-gray-600 capitalize text-sm ml-1">{ct.label}:</label>
									   <Select name={ct.label}  ref={ct.ref} defaultValue={drillDown[ct.label] || "national"} id={ct.label} className="w-full max-w-xs p-1 rounded bg-gray-50"
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
									<br/>
									<div  className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'
										ref={beds}
                                        type="checkbox"
                                        name='number_of_beds'
                                        id='number_of_beds'
                                    />
									<label htmlFor={'Has Beds'} className="text-gray-600 capitalize text-sm ml-1">{'Has Beds'}</label>
									
									</div>
									<div  className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'
										ref={cots}
                                        type="checkbox"
                                        name='number_of_cots'
                                        id='number_of_cots'
                                    />
									<label htmlFor={'Has Cots'} className="text-gray-600 capitalize text-sm ml-1">{'Has Cots'}</label>
									
									</div>
								</div>
								
							</div>

							&nbsp;
							<div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Availability</h2> &nbsp;
								<div  className="w-full max-w-xs flex flex-col items-start justify-start mb-3" id='first'>
									<div  className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'
										ref={available_holiday}
                                        type="checkbox"
                                        name='available_holiday'
                                        id='available_holiday'
                                    />
									<label htmlFor={'Open Public Holidays '} className="text-gray-600 capitalize text-sm ml-1">{'Open Public Holidays '}</label>
									
									</div>
									<div  className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'
										ref={available_weekends}
                                        type="checkbox"
                                        name='available_weekends'
                                        id='available_weekends'
                                    />
									<label htmlFor={'Open Weekends '} className="text-gray-600 capitalize text-sm ml-1">{'Open Weekends '}</label>
									
									</div>
									<div  className="w-full max-w-xs  flex-col items-start justify-start mb-3" id='first'>
									<input
										className='form-checkbox w-3 h-3'
										ref={available_24hrs}
                                        type="checkbox"
                                        name='available_24hrs'
                                        id='available_24hrs'
                                    />
									<label htmlFor={'Open 24 Hours '} className="text-gray-600 capitalize text-sm ml-1">{'Open 24 Hours '}</label>
									
									</div>

								</div>
								
							</div>

							&nbsp;
							<div className='flex flex-row gap-4'> 
								<button
									type="submit"
									className="bg-green-500 border-1 border-black text-black flex items-center justify-center px-4 py-1 rounded"
								>
									<SearchIcon className="w-5 h-5" /> Search
								</button>  
								<button
									type="button"
									className="bg-gray-100 border-1 border-black text-black flex items-center justify-center px-4 py-1 rounded"
									onClick={()=>{
										setDrillDown({})
										name.current.value ='',code.current.value='', allfacilities.current.value ='',
										county.current.select.clearValue(),subcounty.current.select.clearValue(),ward.current.select.clearValue(),constituency.current.select.clearValue(),facilityservice.current.select.clearValue(),
										facilitytype.current.select.clearValue(),operationstatus.current.select.clearValue(),facilityowner.current.select.clearValue(),ownertype.current.select.clearValue(),servicecategory.current.select.clearValue(),
										beds.current.checked=false, cots.current.checked=false, available_holiday.current.checked=false, available_24hrs.current.checked=false,available_weekends.current.checked=false

									}}
								>Reset
								</button>  
							</div>                       
							</form>
                    </div>

                     {/* Main body */}
					{/* <div className='col-span-5 md:col-span-4 flex flex-col items-center gap-4 mt-2 order-last md:order-none'> */}
					<div className="col-span-6 md:col-span-4 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
					    <div className='mx-4 float-right'>
							 
						    {viewAll && <h5 className="text-lg font-medium text-gray-800 float-right">
                                {facilities.count && facilities?.count > 0 && <small className="text-gray-500 ml-2 text-base">{facilities?.start_index || 0} - {facilities?.end_index || 0} of {facilities?.count || 0} </small>}
                            </h5>}
						</div>
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							{/* <pre>{JSON.stringify(facilities[0], null, 2)}</pre> */}

							{viewAll && facilities?.results && facilities?.results.length > 0 ? (
								facilities?.results.map((hf, index) => (
									<div
										key={hf.id}
										className='px-1 md:px-3 grid grid-cols-8 gap-3 border-b py-4 hover:bg-gray-50 w-full'>
										<div className='col-span-8 md:col-span-4 flex flex-col gap-1 group items-center justify-start text-left'>
											<h3 className='text-2xl w-full'>
												<a
													// href={'/community-units/' + hf.id}
													href={'#'}
													className='hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800'>
													<small className='text-gray-500'>
														{index + props?.data?.start_index}.
													</small>{' '}
													{hf.official_name ||
														hf.official_name ||
														hf.name}
												</a>
											</h3>
											{/* <p className="text-sm text-gray-600 w-full">{comm_unit.nearest_landmark || ' '}{' '} {comm_unit.location_desc || ' '}</p> */}
											<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
												<span className='text-lg text-black font-semibold'>
													# {hf.code ? hf.code : 'NO_CODE' || ' '}
												</span>
												<span>{hf.facility_name || ' '}</span>
											</p>
											<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>

											{(hf?.facility_type_category) ? <span className={"shadow-sm leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-black"}>{hf?.facility_type_category}</span> : ""}
											</p>
											<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>

										    {(hf?.facility_type_name) ? <span className={"shadow-sm leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-black"}>{hf?.facility_type_name}</span> : ""}
											</p>

											<div className='text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full'>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														County:
													</label>
													<span>
														{hf.facility_county ||
															hf.county_name ||
															'N/A'}
													</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														Sub-county:
													</label>
													<span>
														{hf.facility_subcounty ||
															hf.sub_county_name ||
															'N/A'}
													</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>Ward:</label>
													<span>{hf.ward_name || 'N/A'}</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														Constituency:
													</label>
													<span>
														{hf.constituency_name ||
															hf.constituency_name ||
															'N/A'}
													</span>
												</div>
											</div>
										</div>
										<div className='col-span-8 md:col-span-3 flex flex-wrap items-center gap-3 text-lg'>
										{(hf?.operational || hf?.operation_status_name) ? <span className={"shadow-sm leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-black"}>Operational</span> : ""}
										</div>
										<div className='col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end'>
										</div>
									</div>
								))
							) : (
								<div className='w-full flex items-center justify-start gap-2 bg-yellow-100 border font-medium rounded border-yellow-300 p-3'>
									<span className='text-base text-gray-700'>
										No community units found
									</span>
								</div>
							)}
							{viewAll && facilities?.results && facilities?.results.length >= 30 && (
								<ul className='list-none flex p-2 flex-row gap-2 w-full items-center my-2'>
									<li className='text-base text-gray-600'>
		
										<a
											href={
												(() => 
												props.path.includes('?page') ?
												props.path.replace(/\?page=\d+/,`?page=${facilities?.current_page}`)
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
										facilities?.near_pages.map((page) => (
											<li key={page} className='text-base text-gray-600'>

												<a
													href={
														(() => 
                                                            props.path.includes('?page') ?
                                                            props.path.replace(/\?page=\d+/,`?page=${page}`)
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

Home.getInitialProps = async (ctx) => {
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const fetchFilters = async (token) => {
		let filters_url =
			API_URL +
			'/common/filtering_summaries/?fields=county,facility_type,operation_status,service_category,owner_type,owner,service,keph_level';
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
		let url = API_URL +`/facilities/material/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,constituency,ward_name,keph_level,operation_status_name`
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
			return {
				data: json,
				query,
				token,
				filters: { ...ft },
				path: ctx.asPath || '/facility/facilities',
				current_url: current_url,
			};
		} catch (err) {
			console.log('Error fetching community units: ', err);
			return {
				error: true,
				err: err,
				data: [],
				query: {},
				path: ctx.asPath || '/facility/facilities',
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
					window.location.href = '/facility/facilities';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath || '/facility/facilities',
					current_url: '',
				};
			}, 1000);
		});
};

export default Home;
