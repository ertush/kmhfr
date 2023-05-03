import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';
import {DotsHorizontalIcon} from '@heroicons/react/solid';
import { checkToken } from '../../controllers/auth/public_auth';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


const Home = (props) => {
    console.log(props)
	const router = useRouter();
	const cus = props?.data?.results;
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const qf = props?.query?.qf || 'all';

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


						</div>
					

						<div className='flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between'>
							

						</div>
							
					</div>
				    
					  {/* Side Menu Filters*/}

					{/* <CommunityUnitSideMenu
					qf={qf}
					filters={filters}
					_pathId={props?.path.split('id=')[1]}
					/> */}
                    <div className='col-span-1 w-full md:col-start-1 h-auto border-r-2 border-gray-300 h-full'>
                        <form>
                            {/* <div className='card flex flex-wrap'> */}
                            <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>

                                        <label className=" text-gray-600">Search all facilities</label>
                                        <input
                                            name="q"
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Search all facilities"
                                        />      
                                         &nbsp;
                                        <label className=" text-gray-600">Search services</label>
                                        <input
                                            name="q"
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
                                            name="q"
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Facility Name"
                                        />    
                                         &nbsp; &nbsp; 
                                        <label className=" text-gray-600">Facility Code</label>
                                        <input
                                            name="q"
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Facility Code"
                                        />  
                                                          
                            </div>
                        </form>
                    </div>

                     {/* Main body */}
					{/* <div className='col-span-5 md:col-span-4 flex flex-col items-center gap-4 mt-2 order-last md:order-none'> */}
					<div className="col-span-6 md:col-span-4 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}

					    <div className='mx-4 float-right'>
							 
						    <h5 className="text-lg font-medium text-gray-800 float-right">
                                {props?.data?.count && props?.data?.count > 0 && <small className="text-gray-500 ml-2 text-base">{props?.data?.start_index || 0} - {props?.data?.end_index || 0} of {props?.data?.count || 0} </small>}
                            </h5>
						</div>
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							{/* <pre>{JSON.stringify(cus[0], null, 2)}</pre> */}
							{cus && cus.length > 0 ? (
								cus.map((comm_unit, index) => (
									<div
										key={comm_unit.id}
										className='px-1 md:px-3 grid grid-cols-8 gap-3 border-b py-4 hover:bg-gray-50 w-full'>
										<div className='col-span-8 md:col-span-4 flex flex-col gap-1 group items-center justify-start text-left'>
											<h3 className='text-2xl w-full'>
												<a
													href={'/community-units/' + comm_unit.id}
													className='hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800'>
													<small className='text-gray-500'>
														{index + props?.data?.start_index}.
													</small>{' '}
													{comm_unit.official_name ||
														comm_unit.official_name ||
														comm_unit.name}
												</a>
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
										<div className='col-span-8 md:col-span-3 flex flex-wrap items-center gap-3 text-lg'>
											{comm_unit.status_name ? (
												<span
													className={
														'leading-none border whitespace-nowrap shadow-xs text-sm rounded py-1 px-2 text-black ' +
														(comm_unit.status_name
															.toLocaleLowerCase()
															.includes('non-')
															? ' bg-red-200 border-red-300/60'
															: comm_unit.status_name
																	.toLocaleLowerCase()
																	.includes('fully')
															? ' bg-green-200 border-green-300/60'
															: ' bg-yellow-200 border-yellow-300/60')
													}>
													{comm_unit.status_name[0].toLocaleUpperCase()}
													{comm_unit.status_name.slice(1).toLocaleLowerCase()}
												</span>
											) : (
												''
											)}
											{/* {!comm_unit.rejected ? <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + (comm_unit.approved ? "bg-green-200 text-black" : "bg-gray-400 text-black")}>{comm_unit.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + "bg-gray-400 text-black"}>{comm_unit.rejected ? "Rejected" : ""}</span>} */}
											{comm_unit.has_edits ? (
												<span
													className={
														'leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-black'
													}>
													Has edits
												</span>
											) : (
												''
											)}
										</div>
										<div className='col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end'>
											{/* <a href={'/community-unit/edit/' + comm_unit.id} className="text-blue-800 hover:underline active:underline focus:underline bg-blue-200 md:bg-transparent px-2 md:px-0 rounded md:rounded-none">
                                            Edit
                                        </a>
                                        <a href="/" className="text-blue-800 hover:underline active:underline focus:underline">
                                            <DotsHorizontalIcon className="h-5" />
                                        </a> */}
										</div>
									</div>
								))
							) : (
								<div className='w-full flex items-center justify-start gap-2 bg-yellow-100 border font-medium rounded border-yellow-300 p-3'>
									<span className='text-base text-gray-700'>
										No community units found
									</span>
									<Link href={props.path || '/'}>
										<a className='text-blue-700 hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800'>
											Refresh.
										</a>
									</Link>
								</div>
							)}
							{cus && cus.length >= 30 && (
								<ul className='list-none flex p-2 flex-row gap-2 w-full items-center my-2'>
									<li className='text-base text-gray-600'>
		
										<a
											href={
												(() => 
												props.path.includes('?page') ?
												props.path.replace(/\?page=\d+/,`?page=${props?.data?.current_page}`)
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
											className='text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline'>
											{props?.data?.current_page}
										</a>
									</li>
									{props?.data?.near_pages &&
										props?.data?.near_pages.map((page) => (
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
					
					{/*  Floating div at bottom right of page */}

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
		</div>
	);
};

Home.getInitialProps = async (ctx) => {
	console.log(ctx);
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
		let filterQuery = JSON.parse(JSON.stringify(ctx.query));
		let qry = ''
		let url
		if(ctx.query !== null){
			qry = Object.keys(filterQuery).map(function (key) {
				let er = (key) + '=' + (filterQuery[key]);
				return er
			 }).join('&')

			 console.log(qry);
			 url =API_URL + `/chul/units/?${qry}&fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency`;
		}else{
			 url =API_URL + `/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency`;
		}
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
				query,
				token,
				filters: { ...ft },
				path: ctx.asPath || '/community-units',
				current_url: current_url,
			};
		} catch (err) {
			console.log('Error fetching community units: ', err);
			return {
				error: true,
				err: err,
				data: [],
				query: {},
				path: ctx.asPath || '/community-units',
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
					window.location.href = '/community-units';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath || '/community-units',
					current_url: '',
				};
			}, 1000);
		});
};

export default Home;
