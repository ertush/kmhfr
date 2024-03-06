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

function Home(props) {

	const router = useRouter();
	// const cus = props?.data?.results;
	const [cus, setcus] = useState([])
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const qf = props?.query?.qf || 'all';
	const [viewAll, setViewAll] = useState(true);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const code = useRef(null)
	const allchus = useRef(null)
	const name = useRef(null)
	const county = useRef(null)
	const subcounty = useRef(null)
	const ward = useRef(null)
	const constituency = useRef(null)
	const [isClient, setIsClient] = useState(false)

	const status_options = props.filters?.chu_status || props.filters?.status || [];
	const counties = props?.filters?.county || [];
	const [units, setUnits] = useState([])
	const st = useRef(null)


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


	// useEffect(() => {
	// 	if (props?.current_url.includes('q') || router.asPath.includes('q')) {
	// 		setViewAll(true)
	// 		setcus(props?.data)

	// 	} else {
	// 		setViewAll(false)
	// 	}

	// }, [props?.current_url]);

	useEffect(() => {
		setIsClient(true)

		if (!(props?.current_url.includes('q') || router.asPath.includes('q'))) {
		setViewAll(true)
		filterCHUs()
		}
	}, [])

	const administrative_units = [
		{ label: 'county', ref: county, array: counties },
		{ label: 'subcounty', ref: subcounty, array: units['sub_counties'] },
		{ label: 'constituency', ref: constituency, array: units['sub_counties'] },
		{ label: 'wards', ref: ward, array: units['wards'] }
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

	const filterCHUs = async (e) => {
		if (e !== undefined) {
			e.preventDefault()
		}
		let url = API_URL + `/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency`
		const filter_options = {
			name: name.current !== null ? name.current.value : '',
			code: code.current !== null ? code.current.value : '',
			status: st.current !== null ? st.current?.state?.value?.value : '',
			county: county.current !== null ? county.current?.state?.value?.value : '',
			sub_county: subcounty.current !== null ? subcounty.current?.state?.value?.value : '',
			constituency: constituency.current !== null ? constituency.current?.state?.value?.value : '',
			ward: ward.current !== null ? ward.current.state?.value?.value : ''
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
		if (allchus.current !== null && allchus.current.value !== '') {
			url += `&search={"query":{"query_string":{"default_field":"name","query":"${allchus.current.value}"}}}`
		}


		try {
			const r = await fetch(url, {
				headers: {
					Authorization: 'Bearer ' + props?.token,
					Accept: 'application/json',
				},
			});
			const json = await r.json();
			setcus(json)
			setViewAll(true)

		} catch (error) {
			console.log(error);
			setcus([])
			setViewAll(false)
		}
	}


	if(isClient){
		return (
			<div>
				<Head>
					<title>KMHFR - Community Units</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>

				<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
					<div className='w-full md:w-[80%] md:mx-auto px-4 md:px-0 grid grid-cols-1 gap-y-8 md:grid-cols-5 md:gap-4 py-2 my-4 md:max-h-auto'>
						<div className='col-span-1 md:col-span-5 flex flex-col gap-3 md:gap-5'>
							<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
								{/* Bread Crumbs */}

								{/* <div className='flex flex-row gap-2 text-sm md:text-base py-3'>
									<Link className='text-gray-700' href='/'>
										Home
									</Link>
									{'/'}
									<span className='text-gray-500'>Community Units</span>
								</div> */}
								<div className={" col-span-1 md:col-span-5 flex flex-col rounded md:gap-0 gap-y-2 items-start  md:flex-row shadow-md md:justify-between w-full bg-gray-50  text-black p-4 md:divide-x md:divide-gray-200z md:items-center border-l-8 " + (true ? "border-gray-600" : "border-red-600")}>
									<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
										{'Community Units'}
									</h2>
									<p>Use the form on the left to filter CHUs or &nbsp;
										<button className='text-lg capitalize text-gray-500 font-semibold'
											onClick={() => {
												setViewAll(true)
												filterCHUs()
											}
											}
										>view all CHUs</button></p>

								</div>

							</div>

						</div>

						{/* Filter section */}
						<form className='col-span-1 w-full max-h-min flex flex-col item-center justify-start md:col-start-1 gap-8' onSubmit={(e) => filterCHUs(e)}>

							<div className='flex flex-row gap-4'>

								<button
									type="submit"
									className="bg-gray-500 rounded text-gray-50 flex place-content-center gap-2 p-2"
								>
									<span>Search</span>
									{/* <SearchIcon className="w-5 h-5 " />  */}
								</button>
								<button
									type="button"
									className="bg-gray-50 rounded border-1 border-black text-black flex items-center justify-center px-4 py-1 "
									onClick={() => {
										setDrillDown({})
										name.current.value = '', code.current.value = '', st.current.select.clearValue(), allchus.current.value = '',
											county.current.select.clearValue(), subcounty.current.select.clearValue(), ward.current.select.clearValue(), constituency.current.select.clearValue()
									}}
								>Reset
								</button>
							</div>
							{/* <div className='card flex flex-wrap'> */}
							<div className="card col-span-6 rounded md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>

								<h2>Search for a Community Health Unit</h2>
								{/* &nbsp; */}
								<input
									name="allchus"
									ref={allchus}
									id="search-input"
									className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm mt-2 border placeholder-gray-500 w-full border-gray-400 focus:shadow-none focus:bg-white focus:border-black outline-none"
									type="search"
									placeholder="Search all CHUs"
								/>
							</div>

							<div className="card col-span-6 rounded md:col-span-2 flex flex-col gap-3 items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Community Health Info</h2>

								{/* <label className=" text-gray-600">CHU Name</label> */}
								<input
									name="name"
									ref={name}
									id="search-input"
									className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 focus:shadow-none focus:bg-white focus:border-black outline-none"
									type="search"
									placeholder="CHU Name"
								/>

								{/* <label className=" text-gray-600">CHU Code</label> */}
								<input
									name="code"
									ref={code}
									id="search-input"
									className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-400 focus:shadow-none focus:bg-white focus:border-black outline-none"
									type="search"
									placeholder="CHU Code"
								/>

								{/* <label className=" text-gray-600">Status</label> */}
								<Select name={'status'} ref={st} id={'status'} className="w-full md:max-w-xs rounded  border border-gray-400"
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
										(() => {
											let opts = [...Array.from(status_options || [],
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
									placeholder={`Select status`}
								/>
							</div>

							<div className="card col-span-6 rounded md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Administrative Units</h2> &nbsp;
								<div className="w-full md:max-w-xs flex flex-col gap-3 items-start justify-start mb-3" id='first'>
									{administrative_units?.map(ct => (
										<>
											{/* <label htmlFor={ct.label} className="text-gray-600 capitalize text-sm ml-1">{ct.label}:</label> */}
											<Select name={ct.label} ref={ct.ref} defaultValue={drillDown[ct.label] || "national"} id={ct.label} className="w-full md:max-w-xs rounded border border-gray-400"
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


						</form>


						{/* Main body */}
						<div className="col-span-1 rounded md:col-span-4 px-4 md:px-0   flex max-h-min md:h-[752px]  overflow-y-scroll bg-gray-50 shadow-md flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
								<div className="w-full flex justify-end	pt-2 px-4 border-b border-gray-300">
									<p className='text-end text-gray-500 font-semibold'>{props?.chuCount > 0 ? '30': '0'} of {props?.chuCount}</p>
								</div>
							{/* <div className='mx-4 float-right'>
								
							{viewAll && <h5 className="text-lg font-medium text-gray-800 float-right">
									{cus?.count && cus?.count > 0 && <small className="text-gray-500 ml-2 text-base">{cus?.start_index || 0} - {cus?.end_index || 0} of {cus?.count || 0} </small>}
								</h5>}
							</div> */}
							<div className='flex flex-col justify-center items-center overflow-scroll-y w-full '>
								{/* <pre>{JSON.stringify(cus[0], null, 2)}</pre> */}
								{cus?.results && cus?.results.length > 0 ? (
									cus?.results.map((comm_unit, index) => (
										<div
											key={comm_unit.id}
											className='px-1 md:px-3 grid grid-cols-8 gap-3 border-b border-gray-400 py-4 hover:bg-gray-50 w-full'>
											<div className='col-span-8 flex flex-col gap-1 group items-center justify-start text-left'>
												<h3 className='text-2xl w-full'>
													<Link
														href={'/public/chu/' + comm_unit.id}
														className='hover:text-gray-800 group-focus:text-gray-800 active:text-gray-800'>
															
														{		
															comm_unit.official_name ||
															comm_unit.official_name ||
															comm_unit.name
														}
													</Link>
												</h3>
												{/* <p className="text-sm text-gray-600 w-full">{comm_unit.nearest_landmark || ' '}{' '} {comm_unit.location_desc || ' '}</p> */}
												<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
													<span className='text-lg text-black font-semibold'>
														# {comm_unit.code ? comm_unit.code : 'NO_CODE' || ' '}
													</span>
													<span>{comm_unit.facility_name || ' '}</span>
												</p>
												<div className='text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full'>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>
															County:
														</label>
														<span>
															{comm_unit.facility_county ||
																comm_unit.county ||
																'N/A'}
														</span>
													</div>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>
															Sub-county:
														</label>
														<span>
															{comm_unit.facility_subcounty ||
																comm_unit.sub_county ||
																'N/A'}
														</span>
													</div>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>Ward:</label>
														<span>{comm_unit.facility_ward || 'N/A'}</span>
													</div>
													<div className='flex flex-col items-start justify-start gap-0 leading-none'>
														<label className='text-xs text-gray-500'>
															Constituency:
														</label>
														<span>
															{comm_unit.constituency_name ||
																comm_unit.facility_constituency ||
																'N/A'}
														</span>
													</div>
												</div>
											</div>

											<div className='col-start-7 flex flex-wrap items-center md:gap-3 text-lg'>
												{comm_unit.status_name ? (
													<span
														className={
															'leading-none border whitespace-nowrap shadow-xs text-sm  py-1 px-2 text-black ' +
															(comm_unit.status_name
																.toLocaleLowerCase()
																.includes('non-')
																? ' bg-red-200 border-red-300/60'
																: comm_unit.status_name
																	.toLocaleLowerCase()
																	.includes('fully')
																	? ' bg-blue-200 border-gray-300/60'
																	: ' bg-yellow-200 border-yellow-300/60')
														}>
														{comm_unit.status_name[0].toLocaleUpperCase()}
														{comm_unit.status_name.slice(1).toLocaleLowerCase()}
													</span>
												) : (
													''
												)}
												{/* {!comm_unit.rejected ? <span className={"leading-none whitespace-nowrap text-sm  text-black py-1 px-2 " + (comm_unit.approved ? "bg-blue-200 text-black" : "bg-gray-400 text-black")}>{comm_unit.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm  text-black py-1 px-2 " + "bg-gray-400 text-black"}>{comm_unit.rejected ? "Rejected" : ""}</span>} */}
												{comm_unit.has_edits ? (
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
								{viewAll && cus?.results && cus?.results.length >= 30 && (
									<ul className='list-none flex p-2 flex-row gap-2 w-full items-center my-2'>
										<li className='text-base text-gray-600'>

											<Link
												href={
													(() =>
														props.path.includes('?page') ?
															props.path.replace(/\?page=\d+/, `?page=${cus?.current_page}`)
															:
															props.path.includes('?q') && props.path.includes('&page') ?
																props.path.replace(/&page=\d+/, `&page=${cus?.current_page}`)
																:
																props.path.includes('?q') ?
																	`${props.path}&page=${cus?.current_page}`
																	:
																	`${props.path}?page=${cus?.current_page}`
													)()
												}
												className='text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline'>
												{cus?.current_page}
											</Link>
										</li>
										{cus?.near_pages &&
											cus?.near_pages.map((page) => (
												<li key={page} className='text-base text-gray-600'>

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
														className='text-gray-800 p-2 hover:underline active:underline focus:underline'>
														{page}
													</Link>
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
		)
	}
	else
	{
		return null
	}
};

Home.getInitialProps = async (ctx) => {

	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const fetchFilters = async (token) => {
		let filters_url =
			API_URL +
			'/common/filtering_summaries/?fields=county,chu_status';

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
		let filterQuery = JSON.parse(JSON.stringify(ctx.query));
		let qry = ''
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
		// console.log('running fetchData(' + url + ')');
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
				chuCount: json?.count,
				query,
				token,
				filters: { ...ft },
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
					window.location.href = '/chu/community_units';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath || '/chu/community_units',
					current_url: '',
				};
			}, 1000);
		});
};

export default Home;
