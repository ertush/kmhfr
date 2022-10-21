import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../components/MainLayout';
import {
	DotsHorizontalIcon,
	PencilIcon,
    DownloadIcon,
    PlusIcon
} from '@heroicons/react/solid';
import { checkToken } from '../../controllers/auth/auth';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import Select from 'react-select';

const Home = (props) => {
	const router = useRouter();
	let cus = props?.data?.results;
	let filters = props?.filters;
	let [drillDown, setDrillDown] = useState({});
	let qf = props?.query?.qf || 'all';
	let [currentQuickFilter, setCurrentQuickFilter] = useState(qf);
	let multiFilters = [
		'service_category',
		'service',
		'county',
		'subcounty',
		'ward',
		'constituency',
	];
	let quickFilters = [
		{
			name: 'All',
			id: 'all',
			filters: Object.keys(filters),
		},
		{
			name: 'Approved',
			id: 'approved',
			filters: [{ id: 'is_approved', value: true }],
		},
		{
			name: 'New pending approval',
			id: 'new_pending_approval',
			filters: [
				{ id: 'has_edits', value: false },
				{ id: 'pending_approval', value: true },
			],
		},
		{
			name: 'Updated pending approval',
			id: 'updated_pending_approval',
			filters: [
				{ id: 'has_edits', value: true },
				{ id: 'pending_approval', value: true },
			],
		},
		{
			name: 'Rejected',
			id: 'rejected',
			filters: [{ id: 'is_rejected', value: true }],
		},
	];


	const [title, setTitle] = useState('Community Health Units') 
	const [pathId, setPathId] = useState(props?.path.split('id=')[1] || '')
	const [approvedCHUSelected, setApprovedCHUSelected] = useState(false);
    const [newCHUSelected, setNewCHUSelected] = useState(false);
    const [updatedCHUSelected, setUpdatedCHUSelected] = useState(false);
    const [rejectedCHUSelected, setRejectedCHUSelected] = useState(false);
	const [chuFeedBack, setCHUFeedBack] = useState([])
    const [allCHUSelected, setAllCHUSelected] = useState(false);

  
    const [feedBackCHUSelected, setFeedBackCHUSelected] = useState(false);
    const [chuPendingApproval, setCHUPendingApproval] = useState(false);




	const handleQuickFiltersClick = async (filter_id) => {
    
		let filter = {}	
		if(filter_id !== 'feedback') {
			
		const qfilter = quickFilters.filter(({id}) => id === filter_id).map(f => f.filters.map(({id, value}) => ({id, value})))
	
		qfilter[0].forEach(({id, value}) => {filter[id] = value}) 
	 
		// if (filter_id === 'new_pending_approval') filter['is_complete'] = true;
	
		}
	
	   
		switch(filter_id){
			case 'all':
				setCHUFeedBack([])
				router.push({pathname:'/community-units', query: {qf: filter_id}})
				break;
			
			case 'feedback':
			
				try {
					const feedback = await fetch('/api/community_units/chu_filters/?path=chu_ratings&fields=comment,facility_id,facility_name,chu_name,created,rating&id=feedback')
					const feedbackFacilities = (await feedback.json()).results
	
					setCHUFeedBack(feedbackFacilities)
				   
				}
				catch (err){
					console.error(err.message);
				}
			 
				break;
			default:
				setCHUFeedBack([])
				
				console.log({filter})
	 
				let robj = {pathname: '/community-units', query: {qf: filter_id, ...filter}}
				router.push(robj)
				break;
		}
			
	
		}
	
	
	useEffect(() => {
		let qry = props?.query;
		delete qry.searchTerm;
		delete qry.qf
		setDrillDown({ ...drillDown, ...qry });
		if (filters && Object.keys(filters).length > 0) {
			filters['status'] = filters['chu_status'];
			delete filters['chu_status'];
		}
		// if (filters && Object.keys(filters).length > 0) {
		//     Object.keys(filters).map(ft => {
		//         if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
		//             setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
		//         }
		//     })
		// }
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
								<a className='text-green-700' href='/'>
									Home
								</a>{' '}
								{'>'}
								<span className='text-gray-500'>Community Units</span>
							</div>

							{/* <div className='flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3'>
								{quickFilters.map((qf, i) => {
									return (
										<button
											key={qf.id}
											style={{ paddingTop: '2px', paddingBottom: '2px' }}
											className={`bg-gray-100 border rounded-lg shadow-sm px-3 leading-tight font-medium hover:border-green-400 focus:ring-1 focus:ring-blue-500 text-sm ${
												currentQuickFilter == qf.id
													? 'bg-green-800 border-green-800 text-green-50'
													: 'text-gray-800 border-gray-300'
											}`}
											onClick={(evt) => {
												setCurrentQuickFilter(qf.id);
												let robj = {
													pathname: '/community-units',
													query: { qf: qf.id },
												};
												if (qf.id === 'all') {
													router.push(robj);
													return;
												}
												quickFilters.forEach((q_f) => {
													if (q_f.id === qf.id) {
														q_f.filters.map((sf) => {
															robj.query[sf.id] = sf.value;
														});
													}
												});
												router.push(robj);
											}}>
											{qf.name}
										</button>
									);
								})}
							</div> */}
						</div>
					

						<div className='flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between'>
							<div className='flex flex-col items-start justify-start gap-y-1'>
								<h1 className='text-4xl tracking-tight font-bold leading-tight flex items-center justify-start gap-x-2'>
									{props?.query?.searchTerm &&
									props?.query?.searchTerm.length > 0
										? `Community units matching '${props?.query?.searchTerm}'`
										: 'All community units'}
								</h1>
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
														.toLocaleLowerCase()}: (${
														filters[k]
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
									{props?.data?.count && props?.data?.count > 0 && (
										<small className='text-gray-500 ml-2 text-base'>
											{props?.data?.start_index || 0} -{' '}
											{props?.data?.end_index || 0} of {props?.data?.count || 0}{' '}
										</small>
									)}
								</h5>
							</div>

							{/* Button Section */}

							{props?.current_url && props?.current_url.length > 5 && (
								<Menu as='div' className='relative'>
									<div className='flex items-center space-x-6 w-auto'>
										<Menu.Item
											as='div'
											className='px-4 py-2 bg-green-700 text-white text-sm tracking-tighter font-semibold whitespace-nowrap rounded hover:bg-black focus:bg-black active:bg-black uppercase'>
											<button
												onClick={() => {
													router.push('/community-units/add_community_unit');
												}}
												className='flex items-center justify-center'>
												<span className='text-base uppercase font-semibold'>Add Community Health Unit</span>
												<PlusIcon className='w-4 h-4 ml-2' />
											</button>
										</Menu.Item>

										<Menu.Button
											as='button'
											className='px-4 py-2 bg-green-700 text-white text-sm tracking-tighter font-medium flex items-center justify-center whitespace-nowrap rounded hover:bg-black focus:bg-black active:bg-black uppercase'>
											<DownloadIcon className='w-5 h-5 mr-1' />
											<span className='text-base uppercase font-semibold'>Export</span>
											<ChevronDownIcon className='w-4 h-4 ml-2' />
										</Menu.Button>
									</div>
									<Menu.Items
										as='ul'
										className='absolute top-10 left-0 flex flex-col gap-y-1 items-center justify-start bg-white rounded shadow-lg border border-gray-200 p-1 w-full'>
									
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
														let dl_url = props?.current_url;
														if (dl_url.includes('?')) {
															dl_url += '&format=csv';
														} else {
															dl_url += '?format=csv';
														}
														console.log('Downloading CSV. ' + dl_url || '');
														// window.open(dl_url, '_blank', 'noopener noreferrer')
														window.location.href = dl_url;
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
														let dl_url = props?.current_url;
														if (dl_url.includes('?')) {
															dl_url += '&format=excel';
														} else {
															dl_url += '?format=excel';
														}
														console.log('Downloading Excel. ' + dl_url || '');
														// window.open(dl_url, '_blank', 'noopener noreferrer')
														window.location.href = dl_url;
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

					{/* Side Menu Filters*/}
					<div className='col-span-1 w-full md:col-start-1 h-auto border-r-2 border-gray-300'>
                        <List
                        sx={{ width: '100%', bgcolor: 'background.paper', flexGrow:1 }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    
                        >	
                            {/* All Community Health Units */}
                            <ListItemButton sx={{ backgroundColor: (allCHUSelected || pathId === 'all') ?  '#e7ebf0' : 'none' }} name="rt"
                                onClick={(ev)=>{
                                    setTitle('Community Health Units')
                                    setPathId('all')
                                    setAllCHUSelected(true)
                                    setApprovedCHUSelected(false)
                                    setNewCHUSelected(false)
                                    setUpdatedCHUSelected(false)
                                    setCHUPendingApproval(false)
                                    setRejectedCHUSelected(false)
                                    setFeedBackCHUSelected(false)

                                    handleQuickFiltersClick('all')
                                
                                }}
                            >
                                <ListItemText primary="All Community Health Units" />
                            </ListItemButton>

                            {/* Approved Community Health Units */}
                            <ListItemButton sx={{ backgroundColor: (approvedCHUSelected || pathId === 'approved')  ?  '#e7ebf0' : 'none' }} 
                                onClick={(ev)=>{
                                    setTitle('Approved Community Health Units')
                                    setAllCHUSelected(false)
                                    setPathId('approved')
                                    setApprovedCHUSelected(true)
                                    setNewCHUSelected(false)
                                    setUpdatedCHUSelected(false)
                                    setCHUPendingApproval(false)
                                    setRejectedCHUSelected(false)
                                    setFeedBackCHUSelected(false)

                                    handleQuickFiltersClick('approved')
                                   
                                
                                }}
                            >
                                <ListItemText primary="Approved Community Health Units" />
                            </ListItemButton>

                            {/* New Community Health Units*/}
                            <ListItemButton sx={{ backgroundColor: (newCHUSelected || pathId === 'new_pending_approval') ?  '#e7ebf0' : 'none' }}
                            onClick={()=>{
                                setTitle('Community Health Units Pending Approvals')
                                setPathId('new_pending_approval')
                                setAllCHUSelected(false)
                                setApprovedCHUSelected(false)
                                setNewCHUSelected(true)
                                setUpdatedCHUSelected(false)
                                setCHUPendingApproval(false)
                                setRejectedCHUSelected(false)
                                setFeedBackCHUSelected(false)

                                handleQuickFiltersClick('new_pending_approval')
                                            
                            }}
                            >
                                <ListItemText primary="New Community Health Units Pending Approvals"/>
                            </ListItemButton>

                            {/* Update Community Health Units Pending Approvals*/}
                            <ListItemButton sx={{ backgroundColor: (updatedCHUSelected  || pathId === 'updated_pending_approval') ?  '#e7ebf0' : 'none' }}
                            onClick={()=>{
                                setTitle(' Community Health Units Pending Approvals')
                                setPathId('updated_pending_approval')
                                setAllCHUSelected(false)
                                setApprovedCHUSelected(false)
                                setNewCHUSelected(false)
                                setUpdatedCHUSelected(true)
                                setCHUPendingApproval(false)
                                setRejectedCHUSelected(false)
                                setFeedBackCHUSelected(false)
                                
                                handleQuickFiltersClick('updated_pending_approval')
                            
                            }}
                            >
                                <ListItemText primary="Updated Community Health Units Pending Approvals"/>
                            </ListItemButton>

                            {/* Rejected Community Health Units */}    
                            <ListItemButton sx={{ backgroundColor: (chuPendingApproval  || pathId === 'rejected') ?  '#e7ebf0' : 'none' }}
                            onClick={()=>{
                                setTitle('Rejected Community Health Units')
                                setPathId('rejected')
                                setAllCHUSelected(false)
                                setApprovedCHUSelected(false)
                                setNewCHUSelected(false)
                                setUpdatedCHUSelected(false)
                                setCHUPendingApproval(true)
                                setRejectedCHUSelected(false)
                                setFeedBackCHUSelected(false)
                                
                                handleQuickFiltersClick('rejected')
                            
                            }}
                            >
                                <ListItemText primary="Rejected Community Health Units"/>
                            </ListItemButton>


                            {/* Feedback on Community Health Units */}
                            <ListItemButton sx={{ backgroundColor: (feedBackCHUSelected || pathId == "feedback") ?  '#e7ebf0' : 'none' }}
                            onClick={()=>{
                                setTitle('Community Health Units Feedback From Public')
                                setPathId('feedback')
                                setAllCHUSelected(false)
                                setApprovedCHUSelected(false)
                                setNewCHUSelected(false)
                                setUpdatedCHUSelected(false)
                                setCHUPendingApproval(false)
                                setRejectedCHUSelected(false)
                                setFeedBackCHUSelected(true)

                                handleQuickFiltersClick('feedback')
              
                            }}
                            >
                                
                                <ListItemText primary="Feedback on Community Health Units"/>
                            </ListItemButton>
                                
                        </List>
                    </div>


					{/* Main Body */}
					<div className='col-span-5 md:col-span-4 flex flex-col items-center gap-4 mt-2 order-last md:order-none'>
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
							{cus && cus.length > 0 && (
								<ul className='list-none flex p-2 flex-row gap-2 w-full items-center my-2'>
									<li className='text-base text-gray-600'>
										<a
											href={
												'/community-units?page=' + props?.data?.current_page
											}
											className='text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline'>
											{props?.data?.current_page}
										</a>
									</li>
									{props?.data?.near_pages &&
										props?.data?.near_pages.map((page) => (
											<li key={page} className='text-base text-gray-600'>
												<a
													href={'/community-units?page=' + page}
													className='text-blue-800 p-2 hover:underline active:underline focus:underline'>
													{page}
												</a>
											</li>
										))}
									<li className='text-sm text-gray-400 flex'>
										<DotsHorizontalIcon className='h-3' />
									</li>
									{/* {props?.data?.far_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <a href={'/?page=' + page} className="text-blue-800 p-2 hover:underline active:underline focus:underline">
                                            {page}
                                        </a>
                                    </li>
                                ))} */}
								</ul>
							)}
						</div>
					</div>
					{/* <aside className='flex flex-col col-span-5 md:col-span-1 p-1 md:h-full'>
						<details
							className='rounded bg-transparent py-2 text-basez flex flex-col w-full md:stickyz md:top-2z'
							open>
							<summary className='flex cursor-pointer w-full bg-white p-2'>
								<h3 className='text-2xl tracking-tight font-bold leading-3'>
									Filters
								</h3>
							</summary>
							<div className='flex flex-col gap-2 p-2'>
								{filters && filters?.error ? (
									<div className='w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base'>
										<p>No filters.</p>
									</div>
								) : (
									<form
										action='/'
										onSubmit={(ev) => {
											ev.preventDefault();
											return false;
										}}>
										{filters &&
											Object.keys(filters).length > 0 &&
											Object.keys(filters).map((ft) => (
												<div
													key={ft}
													className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
													<label
														htmlFor={ft}
														className='text-gray-600 capitalize text-sm'>
														{ft.split('_').join(' ')}
													</label>
													
													<Select
														isMulti={multiFilters.includes(ft)}
														name={ft}
														defaultValue={props?.query[ft] || ''}
														id={ft}
														className='w-full p-1 rounded bg-gray-50'
														options={Array.from(filters[ft] || [], (fltopt) => {
															return {
																value: fltopt.id,
																label: fltopt.name,
															};
														})}
														placeholder={
															ft.split('_').join(' ')[0].toUpperCase() +
															ft.split('_').join(' ').slice(1)
														}
														onChange={(sl) => {
															let nf = {};
															if (Array.isArray(sl)) {
																nf[ft] =
																	(drillDown[ft] ? drillDown[ft] + ',' : '') +
																	Array.from(sl, (l_) => l_.value).join(',');
															} else if (
																sl &&
																sl !== null &&
																typeof sl === 'object' &&
																!Array.isArray(sl)
															) {
																nf[ft] = sl.value;
															} else {
																delete nf[ft];
																// let rr = drillDown.filter(d => d.key !== ft)
																// setDrilldown(rr)
															}
															console.log(nf);
															setDrillDown({ ...drillDown, ...nf });
														}}
													/>
												</div>
											))}

										<button
											onClick={(ev) => {
												if (Object.keys(drillDown).length > 0) {
													let qry = Object.keys(drillDown)
														.map(function (key) {
															let er = '';
															if (
																props.path &&
																!props.path.includes(key + '=')
															) {
																er =
																	encodeURIComponent(key) +
																	'=' +
																	encodeURIComponent(drillDown[key]);
															}
															return er;
														})
														.join('&');
													let op = '?';
													if (
														props.path &&
														props.path.includes('?') &&
														props.path.includes('=')
													) {
														op = '&';
													}
													console.log(props.path);
													// setDrillDown({})
													if (qry && qry.length > 0) {
														router.push(props.path + op + qry);
													}
												}
											}}
											className='bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center'>
											Filter
										</button>
										<div className='w-full flex items-center py-2 justify-center'>
											<button
												className='cursor-pointer text-sm bg-transparent text-blue-700 hover:text-black hover:underline focus:text-black focus:underline active:text-black active:underline'
												onClick={(ev) => {
													router.push('/community-units');
												}}>
												Clear filters
											</button>
										</div>
									</form>
								)}
							</div>
						</details>
					</aside> */}
				
					<div className='fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3'>
						<h5 className='text-sm font-bold'>
							<span className='text-gray-600 uppercase'>Limited results</span>
						</h5>
						<p className='text-sm text-gray-800'>
							For testing reasons, downloads are limited to the first 100
							results.
						</p>
					</div>
				
				</div>
			</MainLayout>
		</div>
	);
};

Home.getInitialProps = async (ctx) => {
	// console.log("=======================================")
	// console.log(ctx.req)
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const fetchFilters = (token) => {
		// let filters_url = API_URL+'/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county'
		let filters_url =
			API_URL +
			'/common/filtering_summaries/?fields=county,constituency,ward,chu_status,sub_county';

		return fetch(filters_url, {
			headers: {
				Authorization: 'Bearer ' + token,
				Accept: 'application/json',
			},
		})
			.then((r) => r.json())
			.then((json) => {
				return json;
			})
			.catch((err) => {
				console.log('Error fetching filters: ', err);
				return {
					error: true,
					err: err,
					filters: [],
					path: ctx.asPath || '/',
				};
			});
	};

	const fetchData = (token) => {
		console.log(`TOKEN >>>>>>>>>>>>>>>>>>>>>${token}`);
		// let url = API_URL+'/chul/units/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,is_approved,rejected,keph_level,operation_status_name'
		let url =
			API_URL +
			'/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency';
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
		console.log('running fetchData(' + url + ')');
		return fetch(url, {
			headers: {
				Authorization: 'Bearer ' + token,
				Accept: 'application/json',
			},
		})
			.then((r) => r.json())
			.then((json) => {
				return fetchFilters(token).then((ft) => {
					return {
						data: json,
						query,
						filters: { ...ft },
						path: ctx.asPath || '/community-units',
						current_url: current_url,
					};
				});
			})
			.catch((err) => {
				console.log('Error fetching community units: ', err);
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath || '/community-units',
					current_url: '',
				};
			});
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
