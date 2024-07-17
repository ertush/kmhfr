import React, { useState, useContext, useEffect } from 'react';
import MainLayout from '../../../../components/MainLayout';
import router from 'next/router';
import { checkToken } from '../../../../controllers/auth/auth';
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, PencilAltIcon} from '@heroicons/react/solid';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import DualListBox from 'react-dual-listbox';
import { useAlert } from "react-alert";
import { UserContext } from "../../../../providers/user";
import { hasPermission } from '../../../../utils/checkPermissions';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
// import Alert from '@mui/material/Alert';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import {z} from 'zod'

function EditGroup (props) {
    
	const [selPermissions, setselPermissions] = useState(props?.data.permissions.map((pm)=>{return pm.id}))

    let permissions = props?.permissions[0].params.results
	let group_details = props?.data
	const [groupData, setGroupData]=useState(props.data)
	const alert = useAlert()
	const userCtx = useContext(UserContext);
	const [add_permission, setAddPermission] = useState(false)
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState(null);
	const [delete_permission, setDeletePermission] = useState(false)

	const handleOnChange = (val) => {
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

	const handleGroupSubmit = (event) => {
		event.preventDefault()

		try{
			 fetch(`/api/common/submit_form_data/?path=edit&id=${props.data.id}`, {
				headers:{
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json;charset=utf-8'
					
				},
				method:'PATCH',
				body: JSON.stringify(groupData).replace(',"":""','')
			})
			.then(resp =>resp.json())
			.then(res => {
				if(res.id !==undefined ){
					router.push({pathname:'/user/groups'})
					alert.success('Group updated successfully ')
				}else{
					setStatus({status:'error', message: res})
				}
			})
		}catch (e){
			setStatus({status:'error', message: e})
		}
	}
	
	const deleteGroup = (event) => {
		console.log('delete group');
		event.preventDefault()
		try {
			fetch(`/api/common/submit_form_data/?path=delete&id=${props.data.id}`, {
				headers:{
					'Content-Type': 'application/json;charset=utf-8'
				},
				method:'DELETE',
			})
			.then(resp =>resp)
			.then(res => {
					router.push('/user/groups')
					alert.success('Group deleted successfully ')
			})
			
		} catch (error) {
			setStatus({status:'error', message: e})
		
		}

	}

	useEffect(() => {
		if(hasPermission(/^auth.add_group$/, userCtx.all_permissions)){
			setAddPermission(true)
		}
		if(hasPermission(/^auth.delete_group$/, userCtx.all_permissions)){
			setDeletePermission(true)
		}
	}, [userCtx])


// console.log(delete_permission);
  return (
    <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
        <div className="w-full  md:w-[85%] grid grid-cols-5 gap-4 md:mx-4 my-4">
		{open && 
                       <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open}
                            onClose={()=>setOpen(false)}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                            timeout: 500,
                            }}
                        >
                            <Fade in={open}>
                            <Box sx={
                                {
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 700,
                                    // bgcolor: 'rgba(255, 251, 235, 1)',
                                    boxShadow: 24,
                                    p: 4,
                                }
                            }>
                                <span className="flex gap-2">    
                                      Are you sure you want to delete<b>{group_details?.name}</b> ?
                                </span>
                               <div className='flex justify-start gap-4 mt-4'>
                                    <button className="bg-gray-500 text-white font-semibold  p-2 text-center" type="button" onClick={(e)=>{deleteGroup(e);setOpen(false)}} disabled={!delete_permission} >Delete</button>
                                    <button className="bg-red-500 text-white font-semibold  p-2 text-center" 
                                    onClick={()=> {setOpen(false)}} 
                                    >Cancel</button>
                                </div>     
                            </Box>
                            </Fade>
                        </Modal>}
                    <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                <a className="text-gray-700" href="/">Home</a> {'/'}
                                <a className="text-gray-700" href="/user/groups">Groups</a> {'/'}
                                <span className="text-gray-500">Edit group</span>
                            </div>
                        </div>
						{/* <div>{status !==null && <Alert severity={status.status} sx={{width:'100%'}}>{status.message?.email || status.message?.contacts || status.message?.county|| status.message?.password || status?.message}</Alert>}</div> */}
                        <div className={`col-span-5 flex items-center justify-between p-6 w-full bg-transparent drop-shadow  text-black md:divide-x md:divide-gray-200 border border-gray-600 border-l-8  ${'border-gray-600'}`}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    <PencilAltIcon className='ml-2 h-5 w-5' />
                                    {'Edit Group'}
                                </h2>
								<button
								type='button'
								onClick={()=>setOpen(true)}
								className=' bg-black p-2 text-white flex text-md font-semibold '>
								<span className='text-medium font-semibold text-white'>
									Delete
								</span>
							</button>
                        </div>
                  
                    </div>

					<div className=' col-span-5 flex flex-col justify-center items-start px-1 md:px-4 w-full'>
							<div className=' w-full flex flex-col items-start p-3  border border-gray-300/70 shadow-md bg-gray-50'>
							
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-gray-900'>
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
																onChange={handleOnChange}
																value={group_details?.name || ''}
																className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>
                                                        <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
                                                            
														   <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	defaultChecked={group_details?.is_regulator}
																	value={false}
																	name='is_regulator'
																	id='open_24hrs'
																	onChange={handleOnChange}
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
																	defaultChecked={group_details?.is_national}
																	value={false}
																	name='is_national'
																	id='is_national'
																	onChange={handleOnChange}
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
                                                        <div className='w-full flex flex-row items-center px-2  gap-1 gap-x-3 mb-3'>
                                                            
                                                            <div className='w-full flex flex-row items-center px-2  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	defaultChecked={group_details?.is_administrator}
																	value={false}
																	name='is_administrator'
																	id='is_administrator'
																	onChange={handleOnChange}
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
                                                            <div className='w-full flex flex-row items-center px-2  gap-1 gap-x-3 mb-3'>
																<input
																	type='checkbox'
																	defaultChecked={group_details?.is_county_level}
																	value={false}
																	name='is_county_level'
																	id='is_county_level'
																	onChange={handleOnChange}
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
																	defaultChecked={group_details?.is_sub_county_level}
																	value={false}
																	name='is_sub_county_level'
																	id='is_sub_county_level'
																	onChange={handleOnChange}
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
														<div className=' w-full flex flex-col items-start justify-start p-3  border border-gray-300/70 bg-transparent h-auto'>
															<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
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
																				value: fltopt.id, label: fltopt.name
																			}
																		})
                                                                } 
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
                                                              
                                                            }}
                                                                />
																</div>	
																
														    </div>
														
														</div>

 
														{/* Cancel & Save */}
														<div className='flex justify-between items-center w-full'>
															<button className='flex items-center justify-start space-x-2 p-1 border border-black  px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	Cancel
																</span>
															</button>
															<button
																disabled={!add_permission}
																type='submit'
																className=' bg-blue-600 p-2 text-white flex text-md font-semibold '>
																<span className='text-medium font-semibold text-white'>
																	Update
																</span>
															</button>
														</div>
													</form>
												</>
									
                            </div>
                        </div>
                        
                  
                </div>
    </MainLayout>
  )
}

EditGroup.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

	const zSchema = z.object({
		id: z.string().uuid('Should be a uuid string'),
	  })
	
	
	const queryId = zSchema.parse(ctx.query).id
 
    const fetchPermissions = token => {
        let filters_url = API_URL + '/users/permissions/?page_size=500&ordering=name'
        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching permissions: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    }
	//permissions
	const fetchData = async (token) => {
		 let url = API_URL + `/users/groups/${queryId}/`
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
			  
		
		  }
		  
          const all = await Promise.all([
			fetchPermissions(token)
		  ]);
		  const paths = all.map(a => ({params: a}))

		  return fetch(url, {
			  headers: {
				  'Authorization': 'Bearer ' + token,
				  'Accept': 'application/json'
			  }
		  }).then(r => r.json())
			  .then(json => {
					return {
						data: json, query, token, permissions:{...paths}, path: ctx.asPath || '/user/edit', current_url: current_url 
					}
				  
			  }).catch(err => {
				  console.log('Error fetching permissions: ', err)
				  return {
					  error: true,
					  err: err,
					  data: [],
					  query: {},
					  path: ctx.asPath || '/user/edit',
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
				  window.location.href = '/user/edit'
			  }
		  }
		  setTimeout(() => {
			  return {
				  error: true,
				  err: err,
				  data: [],
				  query: {},
				  path: ctx.asPath || '/user/edit',
				  current_url: ''
			  }
		  }, 1000);
	  })
  
}
  
  export default EditGroup