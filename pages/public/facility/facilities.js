import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../../components/MainLayout';
import {DotsHorizontalIcon} from '@heroicons/react/solid';
import { checkToken } from '../../../controllers/auth/public_auth';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {SearchIcon } from "@heroicons/react/solid";


const Home = (props) => {
    // console.log(props)
	const router = useRouter();
	const [facilities, setFacilities] = useState([])
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const qf = props?.query?.qf || 'all';
	const [viewAll, setViewAll] = useState(false);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const code=useRef(null)
	const allfacilities = useRef(null)
	const service = useRef(null)
	const name = useRef(null)

	const [title, setTitle] = useState('Community Health Units') 

	
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

	console.log(props?.current_url.includes('search')|| router.asPath.includes('search'))
		useEffect(() => {
			if(props?.current_url.includes('search')|| router.asPath.includes('search')){
				setFacilities(props?.data)
				setViewAll(true)

			}else{
				setViewAll(false)
			}
	}, [props?.current_url]);

	console.log({viewAll, facilities, url:props?.current_url})

	const filterFacilities = async (e) => {
		if(e !== undefined){
			e.preventDefault()
		}
		let url = API_URL +`/facilities/material/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,constituency,ward_name,keph_level,operation_status_name`
		const filter_options ={
			name: name.current.value,
			code: code.current.value
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
			name.current.value='', code.current.value='', allfacilities.current.value= '', service.current.value =''

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
                                         &nbsp;
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
                                         &nbsp; &nbsp; 
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
							<button
								type="submit"
								className="bg-green-500 border-1 border-black text-black flex items-center justify-center px-4 py-1 rounded"
							>
								<SearchIcon className="w-5 h-5" /> Search
							</button>                        
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
			'/common/filtering_summaries/?fields=county,constituency,ward,chu_status,sub_county';

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
