import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { checkToken } from '../../controllers/auth/auth';
import router from 'next/router';
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon} from '@heroicons/react/solid';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useAlert } from "react-alert";
import { UserContext } from '../../providers/user';
import { hasPermission } from '../../utils/checkPermissions';

const AddGroup = (props)=> {
	const [selPermissions, setselPermissions] = useState([])
	let permissions = props?.data?.results
	const alert = useAlert()
	const userCtx = useContext(UserContext);
	const [add_permission, setAddPermission] = useState(false)

	const [groupData, setGroupData]=useState({
		name: '',
		permissions: [],
		is_regulator:false,
		is_national: false,
		is_administrator: false,
		is_county_level: false,
		is_sub_county_level: false,
	})

	const handleOnChange =(val)=>{
		// console.log(val);
		if (val.target && val.target != undefined && val.target != null) {
				const newObj = {}
				newObj[val.target.name] = {}
				newObj[val.target.name].name = val.target.name
				val.target.type =="checkbox" ? newObj[val.target.name] = val.target.checked : newObj[val.target.name] = val.target.value
				setGroupData({ ...groupData, ...newObj })
        }else{
			const newObj2={}
			newObj2['permissions'] = {}
			newObj2['permissions'] = "permissions"
			newObj2['permissions'] = val.map((id)=>{return {id: id.value, name:id.label, codename:id.codename}})
			setGroupData({ ...groupData, ...newObj2 })
        }
	}

	const handleGroupSubmit =(event)=>{
		event.preventDefault()
		try{
			 fetch('/api/common/submit_form_data/?path=groups', {
				headers:{
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json;charset=utf-8'
				},
				method:'POST',
				body: JSON.stringify(groupData).replace(',"":""','')
			})
			.then(resp =>resp.json())
			.then(res => {
				if(res.id !==undefined ){
					router.push({pathname:'/users/groups'})
					alert.success('Group added successfully ')
				}else{
					alert.danger('Failed to add group')
				}
			})
			.catch(e=>{
				alert.danger(e)
			})
		}catch (e){
			alert.danger(e)
		}
	}

	useEffect(() => {
		if(hasPermission(/^auth.add_group$/, userCtx.all_permissions)){
			setAddPermission(true)
		  }
	}, [userCtx])

// console.log(groupData);
  return (
    <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
        <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
								<span className="text-indigo-700 cursor-pointer" onClick={() => router.push('/')}>Home</span> {'/'}
                                <span className="text-indigo-700 cursor-pointer" onClick={() => router.push('/users/groups')}>Groups</span> {'/'}
                                <span className="text-gray-500">Add group</span>
                            </div>
                        </div>
                        <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-blue-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                   <UserGroupIcon className='text-black ml-2 h-5 w-5'/>
                                    {'New Group'}
                                </h2>
                        </div>
                  
                    </div>

						<div className='col-span-5 flex flex-col justify-center items-start px-1 md:px-4 w-full'>
							<div className=' w-full flex flex-col items-start p-3 rounded border border-gray-300/70 bg-gray-50'
								style={{ minHeight: '250px' }}>
							
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														{/* Bio Details */}
													</h4>
													<form
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleGroupSubmit}
                                                        >
														
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='name'
																className='text-gray-600 capitalize text-sm'>
																Group Name:  
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='text'
																name='name'
																onChange={ev => {
																	// console.log(ev);
																	handleOnChange(
																		ev
																	)
																}}
																// value={userData['first_name']?.value || ''}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>
                                                        <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
                                                            
														   <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	value={false}
																	defaultChecked={false}
																	name='is_regulator'
																	id='open_24hrs'
																	onChange={(ev) => {
																		handleOnChange(
                                                                            ev
                                                                        )
																	}}
																/>
																<label
																	htmlFor='is_regulator'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	{' '}
																	Is Regulator? 
                                                                    <span>
                                                                    <Tooltip title="Are the regulators in this group?" arrow placement="right">
                                                                       <InfoIcon fontSize="small"></InfoIcon>
                                                                     </Tooltip>
                                                                    </span>
																</label>
															</div>
                                                            <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	value={false}
																	defaultChecked={false}
																	name='is_national'
																	id='is_national'
																	onChange={(ev) => {
																		handleOnChange(
                                                                            ev
                                                                        )
																	}}
																/>
																<label
																	htmlFor='is_national'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	{' '}
																	Will the users in this group see all facilities in Kenya?
                                                                    <span>
                                                                    <Tooltip title="Will the users in this group see all the facilities in the country?" arrow placement="right">
                                                                       <InfoIcon fontSize="small"></InfoIcon>
                                                                     </Tooltip>
                                                                    </span>
																</label>
															</div>

															
                                                          
                                                        </div>
                                                        <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
                                                            
                                                            <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	value={false}
																	defaultChecked={false}
																	name='is_administrator'
																	id='is_administrator'
																	onChange={(ev) => {
																		handleOnChange(
                                                                            ev
                                                                        )
																	}}
																/>
																<label
																	htmlFor='is_administrator'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	{' '}
																	Can the users in this group create users?
                                                                    <span>
                                                                    <Tooltip title="Will the users in this group administer user rights?" arrow placement="right">
                                                                       <InfoIcon fontSize="small"></InfoIcon>
                                                                     </Tooltip>
                                                                    </span>
																</label>
															</div>
                                                            <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	value={false}
																	defaultChecked={false}
																	name='is_county_level'
																	id='is_county_level'
																	onChange={(ev) => {
																		handleOnChange(
                                                                            ev
                                                                        )
																	}}
																/>
																<label
																	htmlFor='is_county_level'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	{' '}
																    Can the CHRIO assign users to this group?
                                                                    <span>
                                                                    <Tooltip title="Will the users in this group create sub county users?" arrow placement="right">
                                                                       <InfoIcon fontSize="medium"></InfoIcon>
                                                                     </Tooltip>
                                                                    </span>
																</label>
															</div>
                                                        </div>
                                                        <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
                                                        <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	value={false}
																	defaultChecked={false}
																	name='is_sub_county_level'
																	id='is_sub_county_level'
																	onChange={(ev) => {
																		handleOnChange(
                                                                            ev
                                                                        )
																	}}
																/>
																<label
																	htmlFor='is_sub_county_level'
																	className='text-gray-700 capitalize text-sm flex-grow'>
																	{' '}
																	Can the SCHRIO assign users to this group?
                                                                    <span>
                                                                    <Tooltip title="Will the users in this group create sub county users?" arrow placement="right">
                                                                       <InfoIcon fontSize="small"></InfoIcon>
                                                                     </Tooltip>
                                                                    </span>
																</label>
															</div>
                                                        </div>
														

														{/* Permissions Details */}
														<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
															<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																Permissions
															</h4>
															 <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
                                                                <DualListBox  
                                                                canFilter
                                                                selected={selPermissions}
                                                                showHeaderLabels={true}
                                                                options={
                                                                    Array.from(permissions || [],
																		fltopt => {
																			return {
																				value: fltopt.id, label: fltopt.name, codename: fltopt.codename
																			}
																		})
                                                                } 
																simpleValue={false}
                                                                onChange={(ev)=>{
                                                                setselPermissions(ev)
                                                                handleOnChange(
                                                                    ev
                                                                )
                                                            }}
                                                               icons={{
                                                                moveLeft:<ChevronLeftIcon className='w-3 h-3 text-black' />,
                                                                moveAllLeft: <ChevronDoubleLeftIcon className='w-3 h-3 text-black' />,
                                                                moveRight: <ChevronRightIcon className='w-3 h-3 text-black' />,
                                                                moveAllRight:<ChevronDoubleRightIcon className='w-3 h-3 text-black'/>,
                                                                // moveDown: <span className="fa fa-chevron-down" />,
                                                                // moveUp: <span className="fa fa-chevron-up" />,
                                                                // moveTop: <span className="fa fa-double-angle-up" />,
                                                                // moveBottom: <span className="fa fa-double-angle-down" />,
                                                            }}
                                                                />
																</div>	
																
														    </div>
														
														</div>

 
														{/* Cancel & Save */}
														<div className='flex justify-between items-center w-full'>
															<button className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	Cancel
																</span>
															</button>
															<button
																disabled={!add_permission}
																type='submit'
																className='rounded bg-blue-600 p-2 text-white flex text-md font-semibold '>
																<span className='text-medium font-semibold text-white'>
																	Save
																</span>
															</button>
														</div>
													</form>
												</>
									
                            </div>
                        </div>

                
               
                    {/* Floating div at bottom right of page */}
                    {/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-blue-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 100 results.
                        </p>
                    </div> */}
                  
                </div>
    </MainLayout>
  )
}

AddGroup.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

	//permissions
	const fetchData = async (token) => {
		 let url = API_URL + '/users/permissions/?page_size=500&ordering=name'
		  let query = { 'searchTerm': '' }
		  if (ctx?.query?.qf) {
			  query.qf = ctx.query.qf
		  }
		  if (ctx?.query?.q) {
			  query.searchTerm = ctx.query.q
			  url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
		  }
		  
		  let current_url = url + '&page_size=100000'
		  if (ctx?.query?.page) {
			  url = `${url}&page=${ctx.query.page}`
		  }
		  
		  return fetch(url, {
			  headers: {
				  'Authorization': 'Bearer ' + token,
				  'Accept': 'application/json'
			  }
		  }).then(r => r.json())
			  .then(json => {
					return {
						data: json, query, token, path: ctx.asPath || '/add_group', current_url: current_url 
					}
				  
			  }).catch(err => {
				  console.log('Error fetching permissions: ', err)
				  return {
					  error: true,
					  err: err,
					  data: [],
					  query: {},
					  path: ctx.asPath || '/add_group',
					  current_url: ''
				  }
			  })
	  }
  
	  return checkToken(ctx.req, ctx.res).then(t => {
		  if (t.error) {
			  throw new Error('Error checking token')
		  } else {
			  let token = t.token
			  return fetchData(token).then(t => t)
		  }
	  }).catch(err => {
		  console.log('Error checking token: ', err)
		  if (typeof window !== 'undefined' && window) {
			  if (ctx?.asPath) {
				  window.location.href = ctx?.asPath
			  } else {
				  window.location.href = '/add_group'
			  }
		  }
		  setTimeout(() => {
			  return {
				  error: true,
				  err: err,
				  data: [],
				  query: {},
				  path: ctx.asPath || '/add_group',
				  current_url: ''
			  }
		  }, 1000);
	  })
  
}
  
  export default AddGroup