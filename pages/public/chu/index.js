import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../../components/MainLayout';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { checkToken } from '../../../controllers/auth/public_auth';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
// import { SearchIcon } from "@heroicons/react/solid";
import Select from 'react-select'
import Alert from '@mui/material/Alert'
import {v4 as uuid} from 'uuid';
// import {uuid as uid} from 'react-use-uuid'


function Home(props) {


	const router = useRouter();
	
	
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const [reset, setReset] = useState(false)
	// const qf = props?.query?.qf || 'all';
	const [viewAll, setViewAll] = useState(true);
	// const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const code = useRef(null)
	// const allchus = useRef(null)
	const name = useRef(null)
	const county = useRef(null)
	const subcounty = useRef(null)
	const ward = useRef(null)
	const constituency = useRef(null)
	const [isClient, setIsClient] = useState(false)
	const [units, setUnits] = useState([])
	const status = useRef(null)
	


	useEffect(() => {

		let qry = props?.query;

		if(!!qry && !!qry.searchTerm) delete qry.searchTerm;
		if(!!qry && !!qry.qf) delete qry.qf
		setDrillDown({ ...drillDown, ...qry });
		if (filters && Object.keys(filters).length > 0) {
			filters['status'] = filters['chu_status'];
			delete filters['chu_status'];
		}

	}, [filters]);


	

	useEffect(() => {
		setIsClient(true)

		// console.log({props})

		if (!!props && !!props?.current_url && !(props?.current_url.includes('q') || router.asPath.includes('q'))) {
			setViewAll(true)
		// handleSubmit()
		}
	}, [])

	const administrativeUnits = [
		{ label: 'county', ref: county, array: props?.filters?.counties },
		{ label: 'subcounty', ref: subcounty, array: units['sub_county'] ?? props?.filters?.subCounties },
		{ label: 'constituency', ref: constituency, array: units['constituency'] ?? props?.filters?.constituencies },
		{ label: 'wards', ref: ward, array: units['ward'] ?? props?.filters?.wards }
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

	/**
	 * 
	 * @param {Event} e 
	 */

	async function handleSubmit(e) {
		e.preventDefault()

		let url = `${process.env.NEXT_PUBLIC_API_URL}/`

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

						status.current?.select?.clearValue(); 
						county.current?.select?.clearValue(); 
						subcounty.current?.select?.clearValue(); 
						ward.current.select?.clearValue(); 
						constituency.current?.select?.clearValue();

					}

					if (node.type == 'checkbox') {
						node.checked = false
					}

				}

			}


		}

		// const filter_options = {
		// 	name: name.current !== null ? name.current.value : '',
		// 	code: code.current !== null ? code.current.value : '',
		// 	status: status.current !== null ? status.current?.state?.value?.value : '',
		// 	county: county.current !== null ? county.current?.state?.value?.value : '',
		// 	sub_county: subcounty.current !== null ? subcounty.current?.state?.value?.value : '',
		// 	constituency: constituency.current !== null ? constituency.current?.state?.value?.value : '',
		// 	ward: ward.current !== null ? ward.current.state?.value?.value : ''
		// }

		
		if (!reset) {

		// setSubmitting(true)
		
		// const searchOptions = `{"query":{"query_string":{"default_field":"name","query":"${formDataObject?.name || formDataObject?.code || formDataObject?.status}"}}}`
		
		router.push(
			{
			pathname: '/public/chu',
			query: {
				...(() => !!formDataObject?.status ? {status: formDataObject?.status}: {})(),
				...(() => !!formDataObject?.county ? {county: formDataObject?.county}: {})(),
				...(() => !!formDataObject?.sub_county ? {sub_county: formDataObject?.sub_county}: {})(),
				...(() => !!formDataObject?.constituency ? {constituency: formDataObject?.constituency}: {})(),
				...(() => !!formDataObject?.ward ? {ward: formDataObject?.ward}: {})(),
				...(() => !!formDataObject?.name || !!formDataObject?.code ? {search: formDataObject?.name || formDataObject?.code }: {})(),
		
			}	
			}
		)
		}

		if (reset) setReset(false)



		

	}

	// return <pre>
	// 	{
	// 		JSON.stringify(props, null, 2)
	// 	}
	// </pre>


	if(isClient){
		return (
            (<div>
                <Head>
					<title>KMHFR | Community Units</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>
                <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
					<div className='w-full md:w-[80%] md:mx-auto px-4 md:px-0 grid grid-cols-1 gap-y-8 md:grid-cols-5 md:gap-4 py-2 my-4 md:max-h-auto'>
						<div className='col-span-1 md:col-span-5 flex flex-col gap-3 md:gap-5'>
							<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
								{/* Bread Crumbs */}

								<div className={" col-span-1 md:col-span-5 flex flex-col rounded md:gap-0 gap-y-2 items-start  md:flex-row shadow-md md:justify-between w-full bg-gray-50  text-black p-4 md:divide-x md:divide-gray-200z md:items-center border-l-8 " + (true ? "border-gray-600" : "border-red-600")}>
									<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
										{'Community Units'}
									</h2>
									<p>Use the form on the left to filter CHUs or &nbsp;
										<button className='text-lg capitalize text-gray-500 font-semibold'
											onClick={() => {
												setViewAll(true)
												// handleSubmit()
											}
											}
										>view all CHUs</button></p>

								</div>

							</div>

						</div>

						{/* Filter section */}
						<form className='col-span-1 w-full max-h-min flex flex-col item-center justify-start md:col-start-1 gap-8' onSubmit={handleSubmit}>

							<div className='flex flex-row gap-4'>
								<button
									type="submit"
									className="bg-gray-500 rounded text-gray-50 flex place-content-center gap-2 p-2"
								>
									<span>Search</span>
									{/* <SearchIcon className="w-5 h-5 " />  */}
								</button>

								<button
									type="submit"
									className="bg-gray-50 rounded border-1 border-black text-black flex items-center justify-center px-4 py-1 "
									onClick={() => {

										setReset(true)
									}}
								>
									Reset	
								</button>
							</div>
							{/* <div className='card flex flex-wrap'> */}
							<div className="card col-span-6 rounded md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>

								<h2>Search for a Community Health Unit</h2>
								{/* &nbsp; */}
								<input
									name="allchus"
									id="search-name"
									className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm mt-2 border placeholder-gray-500 w-full border-gray-400 foprops?.data:shadow-none foprops?.data:bg-white foprops?.data:border-black outline-none"
									type="search"
									placeholder="Search all CHUs"
								/>
							</div>
							

							<div className="card col-span-6 rounded md:col-span-2 flex flex-col gap-3 items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Community Health Info</h2>

								{/* <label className=" text-gray-600">CHU Name</label> */}
								<input
									name="name"
									id="search-input"
									className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 foprops?.data:shadow-none foprops?.data:bg-white foprops?.data:border-black outline-none"
									type="search"
									placeholder="CHU Name"
								/>

								{/* <label className=" text-gray-600">CHU Code</label> */}
								<input
									name="code"
									id="search-code"
									className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 foprops?.data:shadow-none foprops?.data:bg-white foprops?.data:border-black outline-none"
									type="search"
									placeholder="CHU Code"
								/>

								{/* <label className=" text-gray-600">Status</label> */}
								{/* <pre>
									{
										JSON.stringify(props?.filters?.statuses, null, 2)
									}
								</pre> */}

								<Select name="status" ref={status} className="w-full md:max-w-xs rounded  border border-gray-400"
									styles={{
										control: (baseStyles) => ({
											...baseStyles,
											backgroundColor: 'transparent',
											outLine: 'none',
											border: 'none',
											outLine: 'none',
											textColor: 'transparent',
											padding: 0,
											height: '4px',
											width: '100% !important'
										}),

									}}
									options={
										props?.filters?.statuses
									}
									placeholder={'Select status'}
								/>
							</div>
							

							<div className="card col-span-6 rounded md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Administrative Units</h2> &nbsp;
								<div className="w-full md:max-w-xs flex flex-col gap-3 items-start justify-start mb-3" id='first'>
									{
									administrativeUnits?.map((ct, i) => (
										<Select key={uuid()} name={ct.label} ref={ct.ref} defaultValue={drillDown[ct.label] || "national"} id={ct.label} className="w-full md:max-w-xs rounded border border-gray-400"
										styles={{
											control: (baseStyles) => ({
												...baseStyles,
												backgroundColor: 'transparent',
												outLine: 'none',
												border: 'none',
												outLine: 'none',
												textColor: 'transparent',
												padding: 0,	
												height: '4px',
												
											}),

										}}
										
										options={
											Array.from(ct?.array ?? [], obj => ({value: obj?.id, label: obj?.name}))
											// (() => {
											// 	let opts = [...Array.from(ct.array || [],

											// 		fltopt => {
											// 			console.log(fltopt)
											// 			if (fltopt.id != null && fltopt.id.length > 0) {
											// 				return {
											// 					value: fltopt.id, label: fltopt.name
											// 				}
											// 			}
											// 		})]
											// 	return opts
											// })()
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

									))
										
									}
								</div>

							</div>


						</form>

						
						{/* Main body */}
						<div className="col-span-1 rounded bg-gray-50 md:h-[1670px] md:px-0  p-4 shadow-md md:col-span-4 flex flex-col items-center justify-start md:gap-4 order-last md:order-none"> 
								
							<div className='w-full flex justify-end'>

{viewAll && props?.data?.results && props?.data?.results.length >= 30 && (
	<ul className='list-none flex p-1 flex-row w-max justify-self-end gap-x-2 items-center'>
		{
			props?.data?.current_page >= 6 && 
		<>
		<li  className='text-base text-gray-600'>
			<Link href="/public/chu?page=1" className='text-gray-800 p-2 hover:underline active:underline foprops?.data:underline'>
				1
			</Link>
		</li>
		<li  className='text-base text-gray-600'>
			<Link href="/public/chu?page=2" className='text-gray-800 p-2 hover:underline active:underline foprops?.data:underline'>
				2
			</Link>
		</li>
		<li className='text-sm text-gray-400 flex'>
			<DotsHorizontalIcon className='h-3' />
		</li> 
		</>
		}	
		<li className='text-base text-gray-600'>

			<Link
				href={
					(() =>
						props.path.includes('?page') ?
							props.path.replace(/\?page=\d+/, `?page=${props?.data?.current_page}`)
							:
							props.path.includes('?q') && props.path.includes('&page') ?
								props.path.replace(/&page=\d+/, `&page=${props?.data?.current_page}`)
								:
								props.path.includes('?q') ?
									`${props.path}&page=${props?.data?.current_page}`
									:
									`${props.path}?page=${props?.data?.current_page}`
					)()
				}
				className='text-gray-400 border border-gray-400 rounded font-semibold p-2 hover:underline active:underline foprops?.data:underline'>
				{props?.data?.current_page}
			</Link>
		</li>
		{props?.data?.near_pages &&
			props?.data?.near_pages.map((page, i) => (
				
				<li key={i} className='text-base text-gray-600'>

					<Link
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
						className='text-gray-800 p-2 hover:underline active:underline foprops?.data:underline'>
						{page}
					</Link>
				</li>
			))}
		{/* <li className='text-sm text-gray-400 flex'>
			<DotsHorizontalIcon className='h-3' />
		</li> */}

	</ul>
)}
							</div>
							
							<div className='flex flex-col overflow-y-scroll my-4 justify-center items-center md:col-span-4 w-full '>
								
								{props?.data?.results?.length > 0 ? (
									props?.data?.results?.map((comm_unit, index) => (
										<div
											key={comm_unit?.id}
											className='px-1 md:px-3 grid grid-cols-8 gap-3 border-b border-gray-400 py-4 hover:bg-gray-50 w-full'>
											<div className='col-span-8 flex flex-col gap-1 group items-center justify-start text-left'>
												<h3 className='text-2xl w-full'>
													<Link
														href={'/public/chu/' + comm_unit?.id}
														className='hover:text-gray-800 group-foprops?.data:text-gray-800 active:text-gray-800'>
															
														{		
															comm_unit?.official_name ||
															comm_unit?.official_name ||
															comm_unit?.name
														}
													</Link>
												</h3>
												{/* <p className="text-sm text-gray-600 w-full">{comm_unit.nearest_landmark || ' '}{' '} {comm_unit.location_desc || ' '}</p> */}
												<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
													<span className='text-lg text-black font-semibold'>
														# {comm_unit?.code ? comm_unit?.code : 'NO_CODE' || ' '}
													</span>
													<span>{comm_unit?.facility_name || ' '}</span>
												</p>
												<div className='text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full'>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>
															County:
														</label>
														<span>
															{comm_unit?.facility_county ||
																comm_unit?.county ||
																'N/A'}
														</span>
													</div>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>
															Sub-county:
														</label>
														<span>
															{comm_unit?.facility_subcounty ||
																comm_unit?.sub_county ||
																'N/A'}
														</span>
													</div>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>Ward:</label>
														<span>{comm_unit?.facility_ward || 'N/A'}</span>
													</div>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>
															Constituency:
														</label>
														<span>
															{comm_unit?.constituency_name ||
																comm_unit?.facility_constituency ||
																'N/A'}
														</span>
													</div>
												</div>
											</div>

											<div className='col-start-7 flex flex-wrap items-center md:gap-3 text-lg'>
												{comm_unit?.status_name ? (
													<span
														className={
															'leading-none border whitespace-nowrap shadow-xs text-sm  py-1 px-2 text-black ' +
															(comm_unit?.status_name
																.toLocaleLowerCase()
																.includes('non-')
																? ' bg-red-200 border-red-300/60'
																: comm_unit?.status_name
																	.toLocaleLowerCase()
																	.includes('fully')
																	? ' bg-blue-200 border-gray-300/60'
																	: ' bg-yellow-200 border-yellow-300/60')
														}>
														{comm_unit?.status_name[0]?.toLocaleUpperCase()}
														{comm_unit?.status_name.slice(1)?.toLocaleLowerCase()}
													</span>
												) : (
													''
												)}
												{/* {!comm_unit.rejected ? <span className={"leading-none whitespace-nowrap text-sm  text-black py-1 px-2 " + (comm_unit.approved ? "bg-blue-200 text-black" : "bg-gray-400 text-black")}>{comm_unit.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm  text-black py-1 px-2 " + "bg-gray-400 text-black"}>{comm_unit.rejected ? "Rejected" : ""}</span>} */}
												{comm_unit?.has_edits ? (
													<span
														className={
															'leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-black'
														}>
														Has edits
													</span>
												) : (
													''
												)}
											</div>

											{/* <div className='col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end'>
											
											</div> */}
										</div>
									))
								) : (
									<div className='w-full p-3'>
									<Alert severity='warning' className='border-2 w-full border-yellow-500 rounded-none'>Could not find any Community Health Unit </Alert>
									
									</div>
								)}
						
							</div>

							<div className='w-full flex justify-end'>
								{viewAll && props?.data?.results && props?.data?.results.length >= 30 && (
									<ul className='list-none flex p-2 flex-row w-max justify-self-end gap-x-2 items-center'>
										{
											props?.data?.current_page >= 6 && 
										<>
										<li  className='text-base text-gray-600'>
											<Link href="/public/chu?page=1" className='text-gray-800 p-2 hover:underline active:underline foprops?.data:underline'>
												1
											</Link>
										</li>
										<li  className='text-base text-gray-600'>
											<Link href="/public/chu?page=2" className='text-gray-800 p-2 hover:underline active:underline foprops?.data:underline'>
												2
											</Link>
										</li>
										<li className='text-sm text-gray-400 flex'>
											<DotsHorizontalIcon className='h-3' />
										</li> 
										</>
										}	
										<li className='text-base text-gray-600'>

											<Link
												href={
													
													(() =>
														props.path.includes('?page') ?
															props.path.replace(/\?page=\d+/, `?page=${props?.data?.current_page}`)
															:
															props.path.includes('?q') && props.path.includes('&page') ?
																props.path.replace(/&page=\d+/, `&page=${props?.data?.current_page}`)
																:
																props.path.includes('?q') ?
																	`${props.path}&page=${props?.data?.current_page}`
																	:
																	`${props.path}?page=${props?.data?.current_page}`
													)()
												
												}
												className='text-gray-400 border border-gray-400 rounded font-semibold p-2 hover:underline active:underline foprops?.data:underline'>
												{props?.data?.current_page}
											</Link>
										</li>
										{props?.data?.near_pages &&
											props?.data?.near_pages.map((page, i) => (
												
												<li key={i} className='text-base text-gray-600'>

													<Link
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
														className='text-gray-800 p-2 hover:underline active:underline foprops?.data:underline'>
														{page}
													</Link>
												</li>
											))}
										{/* <li className='text-sm text-gray-400 flex'>
											<DotsHorizontalIcon className='h-3' />
										</li> */}

									</ul>
								)}
						</div>	
						</div>
						
					</div>
				</MainLayout>
            </div>)
        );
	}
	else
	{
		return null
	}
};

export async function getServerSideProps(ctx) {

	ctx?.res?.setHeader(
		'Cache-Control',
		'no-cache, no-store, max-age=0'
	)

	const token = (await checkToken(ctx?.req, ctx?.res))?.token


	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const fetchFilters = async (token) => {

		let filters_url = `${API_URL}/common/filtering_summaries/?fields=county,chu_status,sub_county,constituency,ward`;

		return fetch(filters_url, {
				headers: {
					Authorization: 'Bearer ' + token,
					Accept: 'application/json',
				}
			})
			.then(resp => resp.json())
			.then(resp => resp)
			.catch(err => {
				console.log('Error fetching filters: ', err);
				return {
					error: true,
					err: err,
					filters: [],
					path: ctx.asPath || '/',
				}
			})
			
		
	};

	const fetchData = async (token) => {
		// let filterQuery = JSON.parse(JSON.stringify(ctx.query));
		// let qry = ''
		let url = API_URL + `/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency`;

		
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

		if(!!ctx?.query?.search) {
			url = `${process.env.NEXT_PUBLIC_API_URL}/chul/units/?search=${ctx?.query?.search}`
		}

		console.log(`Fetching: ${url}`);
		try {
			const r = await fetch(url, {
				headers: {
				'Accept': 'application/json, text/plain, */*',
				'Accept-Encoding': 'gzip, deflate, br, zstd',
				'Authorization': `Bearer ${token}`,
				'Accept-Language': 'en-US,en;q=0.5',
				'Cache-Control': 'no-cache, no-store, max-age=0'
				},
			});
			const json = await r.json();
			const filters = await fetchFilters(token)
			const counties = filters?.county?.map(({id, name}) => ({id, name}))
			const subCounties = filters?.sub_county?.map(({id, name}) => ({id, name}))
			const constituencies = filters?.constituency?.map(({id, name}) => ({id, name}))
			const wards = filters?.ward?.map(({id, name}) => ({id, name}))
			const statuses = filters?.chu_status?.map(({id, name}) => ({value:id, label:name}))

			
			return {
				data: json,
				chuCount: json?.count,
				query,
				token,
				filters: { counties, statuses, subCounties, constituencies, wards },
				path: ctx.asPath || '/chu/community_units',
				current_url: current_url,
			};
		} catch (err) {
			console.log('Error fetching community units: ', err);
			return {
				error: true,
				err: err,
				data: [],
				chuCount: 0,
				query: {},
				path: ctx.asPath || '/chu/community_units',
				current_url: '',
			};
		}
	};

	

	return {
		props: !!token ? await fetchData(token) : {
			error: true,
			err: err,
			data: [],
			query: {},
			path: ctx.asPath || '/chu/community_units',
			current_url: '',
}
	}

	
};

export default Home;
