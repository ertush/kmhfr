import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';
import {
	DotsHorizontalIcon,
	DownloadIcon,
	PlusIcon
} from '@heroicons/react/solid';
import { checkToken } from '../../controllers/auth/auth';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import CommunityUnitSideMenu from '../../components/CommunityUnitSideMenu';
import { UserContext } from '../../providers/user';
import { Formik, Form, Field } from 'formik';
import { SearchIcon } from '@heroicons/react/outline'
import { KeyboardArrowDown } from '@mui/icons-material';
import { KeyboardArrowRight } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';



function CommunityUnit(props) {

	const userCtx = React.useContext(UserContext);
	const groupID = userCtx?.groups[0]?.id

	const router = useRouter();
	const cus = props?.data?.results;
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const qf = props?.query?.qf || 'all';

	// const [title, setTitle] = useState('Community Health Units')
	const [isClient, setIsClient] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const pageParams = useSearchParams()

	const currentPageParams = ((params) => {
		return Array.from(params.entries(), ([k, v]) => {
			return `${k}=${v}`
		}).join("&")
	})(pageParams)
	

	// console.log({currentPageParams})

	const orgUnitFilter = (() => {
		
		if(groupID == 1) { //CHHIO
			return `&county=${userCtx?.county ?? userCtx?.user_counties[0]?.county}`
		}else if(groupID == 2){ //SCHRIO
			return `&sub_county=${userCtx?.user_sub_counties[0]?.sub_county}`
		}else if(groupID == 5 || groupID == 7 || groupID == 6 || groupID == 11){ // National & Admin
			return ""
		}

       
    })()



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

	// Check user for authentication
	useEffect(() => {

		if (userCtx.id === 6) {
			router.push('/auth/login')
		}

		setIsClient(true);

	}, [])


	if (isClient) {
		return (
			<div className=''>
				<Head>
					<title>KMHFR | Community Units</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>

				<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
					<div className='w-full md:w-[85%] md:mx-auto rounded grid grid-cols-1 md:grid-cols-5 gap-4 py-2 px-4 md:px-0 my-4'>
						<div className='col-span-5 flex flex-col  md:gap-5 '>
							<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
								{/* Bread Crumbs */}



								<div className={"col-sapn-1 md:col-span-5 flex flex-col items-start md:flex-row md:justify-between w-full bg-django-blue border drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 md:items-center border-l-8 " + (true ? "border-gray-700" : "border-red-600")}>
									<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
										{'Community Health Units'}
									</h2>

									{props?.current_url && props?.current_url.length > 5 && (
										<Menu as='div' >
											<div className='flex mt-4 md:mt-0 relative flex-col items-start md:flex-row md:items-center gap-3 md:gap-0 md:space-x-6 w-auto '>
												<Menu.Item
													as='div'
													className='px-4 py-2 bg-gray-600 rounded text-white text-sm tracking-tighter font-semibold whitespace-nowrap  hover:bg-black focus:bg-black active:bg-black uppercase'>
													<button
														onClick={() => {
															router.push('/community-units/add');
														}}
														className='flex items-center justify-center'>
														<span className='text-base uppercase font-semibold'>Add Community Health Unit</span>
														<PlusIcon className='w-4 h-4 ml-2' />
													</button>
												</Menu.Item>

												<Menu.Button
													as='button'
													className='px-4 py-2 bg-gray-600 rounded text-white text-sm tracking-tighter font-medium flex items-center justify-center whitespace-nowrap  hover:bg-black focus:bg-black active:bg-black uppercase'>
													<DownloadIcon className='w-5 h-5 mr-1' />
													<span className='text-base uppercase font-semibold'>Export</span>
													<ChevronDownIcon className='w-4 h-4 ml-2' />
												</Menu.Button>
											</div>

											<Menu.Items
												as='ul'
												className='absolute top-[80%] right-4 flex flex-col gap-y-1 items-center justify-start bg-white  shadow-lg border border-gray-200 p-1 w-auto'>
												<Menu.Item
													as='li'
													className='p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200'>
													{({ active }) => (
														<button
															className={
																'flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full ' +
																(active ? 'bg-gray-200' : '')
															}
															onClick={() => {
																window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/chul/units/?format=csv&access_token=${props.token}&page_size=${props?.count}&page=1${orgUnitFilter}`;
															}}>
															<DownloadIcon className='w-4 h-4 mr-1' />
															<span>CSV</span>
														</button>
													)}
												</Menu.Item>
												<Menu.Item
													as='li'
													className='p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200'>
													{({ active }) => (
														<button
															className={
																'flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full ' +
																(active ? 'bg-gray-200' : '')
															}
															onClick={() => {
																window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/chul/units/?format=excel&access_token=${props.token}&page_size=${props?.count}&page=1${orgUnitFilter}`;
															}}>
															<DownloadIcon className='w-4 h-4 mr-1' />
															<span>Excel</span>
														</button>
													)}
												</Menu.Item>
											</Menu.Items>
										</Menu>
									)}


								</div>


							</div>


							<div className='flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between '>
								<div className='flex flex-col items-start justify-start gap-y-1'>

									<h5 className='text-lg font-medium text-gray-800'>
										{drillDown &&
											Object.keys(drillDown).length > 0 &&
											`Matching ${Object.keys(drillDown)
												.map(
													(k) =>
														`${k[0].toLocaleUpperCase()}${k
															.split('_')
															.join(' ')
															.slice(1)
															.toLocaleLowerCase()}: (${filters[k]
															? Array.from(
																drillDown[k].split(','),
																(j) =>
																	filters[k]
																		.find((w) => w.id == j)
																		?.name.split('_')
																		.join(' ') || j.split('_').join(' ')
															).join(', ')
															: 'v' + k.split('_').join(' ')
														})`
												)
												?.join(' & ')}`}
									</h5>

								</div>

							</div>

						</div>

					</div>

					<div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-5 gap-3 md:mt-3 md:mb-12 mb-6 px-4 md:px-0">
						{/* Side Menu Filters*/}



						<div className="hidden md:flex w-full col-span-1">
							<CommunityUnitSideMenu
								qf={qf}
								filters={filters}
								_pathId={props?.path.split('id=')[1]}
							/>
						</div>

						<button className='md:hidden relative p-2 border border-gray-800 rounded w-full self-start my-4' onClick={() => setIsMenuOpen(!isMenuOpen)}>
							Community Health Unit Menu
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
									filters={filters}
									_pathId={props?.path.split('id=')[1]}
								/>
							}
						</button>

						{/* Main body */}

						<div className="w-full md:col-span-4 mr-24 md:col-start-2 col-span-5 md:h-auto rounded bg-gray-50 shadow-md">
							{/* Data Indicator section */}
							{/* Data Indicator section */}
							<div className='w-full p-2 flex justify-between border-b border-gray-600'>
								{/* search input */}

								<Formik
									initialValues={
										{
											q: ""
										}
									}
									onSubmit={(values) => {

										const query = values.q.split(' ').join('+');
										// console.log({values})
										switch ((new URL(window.location.href))?.searchParams.get('qf')) {
											case "all":
												router.push(`/community-units/?q=${query}&qf=all`)
												break;
											case "approved":
												router.push({
													pathname: '/community-units',
													query: {
														is_approved: true,
														q: query
														// qf: 'approved'
													}
												})
												break;
											case "new_pending_approval":
												router.push(`/community-units/?q=${query}&qf=new_pending_approval&has_edits=false&pending_approval=true`)
												break;
											case "updated_pending_approval":
												router.push(`/community-units/?q=${query}&qf=updated_pending_approval&has_edits=true&is_approved=true`)
												break;
											default:
												router.push(`/community-units/?q=${query}&qf=is_rejected&is_rejected=true`)
												break;


										}

									}}
								>

									<Form
										className="inline-flex flex-row justify-start flex-grow py-2 lg:py-0"

									>

										<Field
											name="q"
											id="search-input"
											className="flex-none bg-transparent p-2 w-3/5 md:flex-grow-0 flex-grow shadow-sm rounded-tl rounded-bl border border-gray-400 placeholder-gray-600  focus:shadow-none focus:ring-black focus:border-black outline-none"
											type="search"

											placeholder="Search for a community health unit "
										/>
										<button
											type="submit"
											className="bg-transparent border-t border-r border-b rounded-tr rounded-br border-gray-400 text-black flex items-center justify-center px-4 py-1"

										>
											<SearchIcon className="w-5 h-5 text-gray-600" />
										</button>
									</Form>
								</Formik>

								<h5 className="text-lg text-end font-medium text-gray-800 pr-2">
									{props?.data?.count && props?.data?.count > 0 && <small className="text-gray-500 text-base">{props?.data?.start_index ?? ''} - {props?.data?.end_index ?? ''} of {props?.data?.count ?? ''} </small>}
								</h5>
							</div>

							<div className='flex-grow w-full flex flex-col items-center gap-1 order-last md:order-none'>

								<div className="flex flex-col justify-center items-center w-full">

									{cus && cus.length > 0 ? (
										cus.map((comm_unit, index) => (
											<div
												key={comm_unit.id}
												className='grid grid-cols-8 gap-2 border-b border-gray-400 py-4 hover:bg-gray-50 w-full'>
												<div className='px-2 col-span-8 md:col-span-8 lg:col-span-6 flex flex-col group items-center justify-start text-left'>
													<h3 className='text-2xl  font-semibold w-full'>
														<Link
															href={`/community-units/${comm_unit.id}?${currentPageParams}`}
															className='cursor-pointer hover:text-gray-600 group-focus:text-gray-800 active:text-gray-800 '>

															{comm_unit.official_name ||
																comm_unit.official_name ||
																comm_unit.name}
														</Link>
													</h3>

													<div className="w-full grid grid-cols-4 gap-1">
														<div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap mb-2">
															<label className="text-xs text-gray-500 ">Code:</label>
															<span className="whitespace-pre-line font-semibold"># {comm_unit.code ? comm_unit.code : 'NO_CODE' || ' '}</span>
														</div>

														<div className="flex flex-col col-span-2 items-start justify-start gap-0 leading-none whitespace-pre-wrap">
															<label className="text-xs text-gray-500">Linked Facility:</label>
															<span className="whitespace-pre-line">{comm_unit.facility_name ?? ' '}</span>
														</div>
													</div>

													<div className="text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full">
														<div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
															<label className="text-xs text-gray-500">County:</label>
															<span className="whitespace-pre-line">{comm_unit.facility_county ||
																comm_unit.county ||
																'N/A'}
															</span>
														</div>
														<div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
															<label className="text-xs text-gray-500">Sub-county:</label>
															<span className="whitespace-pre-line">{comm_unit.facility_subcounty ||
																comm_unit.sub_county ||
																'N/A'}</span>
														</div>
														<div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
															<label className="text-xs text-gray-500">Ward:</label>
															<span className="whitespace-pre-line">{comm_unit.facility_ward || 'N/A'}</span>
														</div>
														<div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
															<label className="text-xs text-gray-500">Constituency:</label>
															<span className="whitespace-pre-line">{comm_unit.constituency_name ||
																comm_unit.facility_constituency ||
																'N/A'}</span>
														</div>
													</div>
												</div>

												<div className="col-span-8 md:col-span-8 lg:col-span-2 grid grid-cols-2 grid-rows-4 gap-x-2 gap-y-1 text-lg">
													{comm_unit.status_name && <span className={"shadow-sm col-start-2 leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 font-semibold text-gray-900"}>{comm_unit.status_name}</span>}
													{comm_unit.has_edits && <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2 py-1 px-2 bg-blue-200 font-semibold text-gray-900"}>Has edits</span>}
													{/* {!comm_unit.rejected ? <span className={"leading-none whitespace-nowrap text-sm  text-black py-1 px-2 " + (comm_unit.approved ? "bg-blue-200 text-black" : "bg-gray-400 text-black")}>{comm_unit.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm  text-black py-1 px-2 " + "bg-gray-400 text-black"}>{comm_unit.rejected ? "Rejected" : ""}</span>} */}
												</div>

											</div>


										))
									) : (
										<div className='w-[98%] flex my-4  rounded border border-yellow-600 items-center justify-start gap-2 bg-yellow-100  font-medium p-3'>
											<span className='text-base text-gray-700'>
												No community units found
											</span>
											<Link href={props.path || '/'}>
												<span className='text-gray-700 hover:text-gray-800 group-focus:text-gray-800 active:text-gray-800'>
													Refresh.
												</span>
											</Link>
										</div>
									)}
									{cus && cus.length >= 30 && (
										<ul className='list-none flex p-2 flex-row justify-end gap-2 w-full items-center my-2'>
											<li className='text-base text-gray-500 cursor-pointer'>

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
													className='text-white  bg-blue-600 cursor-pointer font-semibold px-2 py-1 underline'>
													{props?.data?.current_page}
												</Link>
											</li>
											{props?.data?.near_pages &&
												props?.data?.near_pages.map((page) => (
													<li key={page} className='text-base group text-gray-500'>

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
					</div>




				</MainLayout>
			</div>
		);
	}
	else {
		return null
	}
};


CommunityUnit.getInitialProps = async (ctx) => {


	ctx?.res?.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59'
	)
	
	async function fetchFilters(token) {
		let filters_url = `${process.env.NEXT_PUBLIC_API_URL}/common/filtering_summaries/?fields=county,constituency,ward,chu_status,sub_county`;

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


	async function fetchData(token) {
		let filterQuery = JSON.parse(JSON.stringify(ctx.query));
		let qry = ''
		let url

		if (ctx.query !== null) {
			qry = Object.keys(filterQuery).map(function (key) {
				const er = `${key}=${filterQuery[key]}`
				return er
			}).join('&')

			// console.log(qry);
			url = `${process.env.NEXT_PUBLIC_API_URL}/chul/units/?${qry}&fields=id,code,name,status_name,facility_name,has_edits,facility_county,facility_subcounty,facility_ward,date_established`;
		} else {
			url = `${process.env.NEXT_PUBLIC_API_URL}/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency`;
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

		

		let current_url = url + `&page_size=11000`;

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
				count: json?.count,
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
				token: null,
				filters: {},
				count:0,
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
			// setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath || '/community-units',
					current_url: '',
				};
			// }, 1000);
		});
};

export default CommunityUnit;
