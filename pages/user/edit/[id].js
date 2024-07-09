// React imports
import React, { useEffect, useState, useContext } from 'react';
import router from 'next/router';
import MainLayout from '../../../components/MainLayout';
import { checkToken } from '../../../controllers/auth/auth';
import { ChevronDoubleLeftIcon, UserAddIcon, PlusIcon, PencilAltIcon } from '@heroicons/react/solid';
import Select from 'react-select';
import { withRouter } from 'next/router';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useAlert } from "react-alert";
import { UserContext } from '../../../providers/user';
import { hasPermission } from '../../../utils/checkPermissions';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { WarningOutlined } from '@mui/icons-material';
import { XCircleIcon } from '@heroicons/react/outline'

const User = (props) => {
	
	const [subCountyOptions, setSubCountyOptions] = useState([])
	const [editMode, setEditMode] = useState(false)
	const alert = useAlert()
	let groups = props[0]?.groups
	let contact_types = props[1]?.contact_type
	let counties = props[2]?.counties	
	let regbodies = props[3]?.regulating_bodies
	let jobs = props[4]?.job_titles
	let person_details = props[5]?.person_details
	const userCtx = useContext(UserContext);
	const [contactList, setContactList] = useState([{}])
	const [status, setStatus] = useState(null)
	const [open, setOpen] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [add_user, setAddUserPermission] = useState(false);
	const [delete_user, setDeleteUserPermission] = useState(false);
	const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);
	const [isClient, setIsClient] = useState(false);

   
	

	
	console.log({props})

	const [userData, setUserData] = useState({
		first_name: '',
		last_name: '',
		other_names: '',
		email: '',
		employee_number: '',
		job_title: '',
		password: '',
		conf_password: '',
		contacts: [{ contact_type: '', contact_text: '' }],
		groups: [],
		user_counties: [],
		user_sub_counties: [],
		regulatory_users: []
	})

	const handleAddClick = (e) => {
		e.preventDefault();
		setContactList(s => {
			return [...s, { contact_type: '', contact_text: '' }]
		})
	};

	const handleOnChange = (val) => {
		if (val.target && val.target != undefined && val.target != null) {
			const newObj = {}
			newObj[val.target.name] = {}
			newObj[val.target.name] = val.target.name
			newObj[val.target.name] = val.target.value
			setUserData({ ...userData, ...newObj })

		} else if (val?.name !== null & val?.name !== undefined) {
			const newObj2 = {}
			newObj2[val.name] = {}
			val.name == "job_title" ? newObj2[val.name] = val.ev.value : newObj2[val.name] = val.ev.map((id) => { return { id: id.value, name: id.label } })
			setUserData({ ...userData, ...newObj2 })
		}
		else {
			let data = [...contactList];
			const newObj1 = {}
			newObj1['contacts'] = {}
			newObj1['contacts'] = "contacts"
			val.cont_name == "contact_type" ? data[val.id][val.cont_name] = val.value.value : data[val.id][val.cont_name] = val.value.target.value
			console.log(data);
			newObj1['contacts'] = data.map((id) => ({
				...id,
				contact_text: id.contact_text,
				contact_type: id.contact_type
			}))
			setUserData({ ...userData, ...newObj1 })
		}
	}

	const selectedGroups = userData.groups?.map((ft) => {
		return { id: ft.id }
	})


	const handleBasicDetailsSubmit = async (event, token) => {
		
		event.preventDefault()
		let url = ''
		url = editMode ?  `${process.env.NEXT_PUBLIC_API_URL}/users/${person_details.id}/` : `${process.env.NEXT_PUBLIC_API_URL}/users/`
		try {
			fetch(url, {
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Authorization': 'Bearer ' + token,
					'Content-Type': 'application/json;charset=utf-8'

				},
				method: (editMode ? 'PATCH' : 'POST'),
				body: JSON.stringify(userData).replace(',"":""', '')
			})
				.then(resp => resp.json())
				.then(res => {

					if (res.id !== undefined) {

						router.push({ pathname: '/user' })
						alert.success(editMode ? 'User updated successfully' : 'User added successfully')

					} else {
						setStatus({ status: 'error', message: res })
					}
				})
				.catch(e => {
					setStatus({ status: 'error', message: e.message })
				})
		} catch (e) {

			setStatus({ status: 'error', message: e.message })
		}
	}

	const deleteUser = (event, token) => {
		event.preventDefault()
		try {
			fetch( `${process.env.NEXT_PUBLIC_API_URL}/users/${person_details.id}/`, {
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					'Authorization': 'Bearer ' + token,

				},
				method: 'DELETE',
			})
				.then(resp => resp)
				.then(res => {

					router.push('/user/')
					alert.success('User Account Deactivated successfully')
				})

		} catch (error) {
			setStatus({ status: 'error', message: e })
		}

	}

	useEffect(() => {
		if (!person_details.detail) {
			setEditMode(true)
			Object.keys(person_details).map((pd) => {
				Object.keys(userData).map(ud => {
					if (ud === pd) {
						let newObj_i = {}
						if (pd == 'user_counties') {
							newObj_i[pd] = [{ id: person_details[`${pd}`][0]?.county, name: person_details[`${pd}`][0]?.county_name }]
						} else if (pd == 'user_sub_counties') {
							const results = person_details.user_sub_counties.map((sbc) => {
								return {
									id: sbc.sub_county,
									name: sbc.sub_county_name
								}
							})
							newObj_i[pd] = results
						} else {

							newObj_i[pd] = person_details[`${pd}`]
						}
						setUserData(prevState => ({ ...prevState, ...newObj_i }));
					}
				})
			}
			)
		}
		if (person_details.contacts !== null && person_details.contacts !== undefined && person_details.contacts !== '') {
			for (let i = 0; i < person_details?.contacts?.length; i++) {
				setContactList(s => {
					return [...person_details?.contacts]
				})
			}
		}

	}, [person_details?.contacts, person_details])
	// console.log(status);

	useEffect(() => {
		if (isCPasswordDirty) {
			if (userData.password === userData.conf_password) {
				setShowErrorMessage(false);
			} else {
				setShowErrorMessage(true)
			}
		}
	}, [userData.conf_password])

	useEffect(() => {
		if (hasPermission(/^users.change_mfluser$/, userCtx.all_permissions)) {
			setAddUserPermission(true)
		}
		if (hasPermission(/^users.delete_mfluser$/, userCtx.all_permissions)) {
			setDeleteUserPermission(true)
		}
	}, [userCtx])

	useEffect(() => {
		setIsClient(true);
	}, [])

	if (isClient) {
		return (
			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>

				{open &&
					<Modal
						aria-labelledby="transition-modal-title"
						aria-describedby="transition-modal-description"
						open={open}
						onClose={() => setOpen(false)}
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
									bgcolor: 'background.paper',
									borderRadius: '6px',
									boxShadow: 24,
									p: 4,
								}
							}>
								<div className='flex gap-2'>
									<WarningOutlined className='text-red-400 w-5 aspect-square'/>
									<span className="flex gap-2">
										Are you sure you want to deactivate<b>{userData?.first_name + ' ' + userData?.last_name + ' ' + userData?.other_names}</b> ?
									</span>
								</div>
								
								<div className='flex justify-start gap-4 mt-4'>
									<button className="bg-red-400 text-white font-semibold  p-2 text-center" type="button" disabled={!delete_user} onClick={(e) => { deleteUser(e, props['6']?.token); setOpen(false) }} >Deactivate</button>
									<button className="bg-gray-500 text-white font-semibold  p-2 text-center"
										onClick={() => { setOpen(false) }}
									>Cancel</button>
								</div>
							</Box>
						</Fade>
					</Modal>
				}
				<div className="w-full  md:w-[85%] md:mx-auto grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
					<div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
						<div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base pb-3">
							<div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
								<Link className="text-gray-800" href='/'>Home</Link>{'/'}
								<Link className="text-gray-800" href='/user'>Users</Link>{'/'}
								<span className="text-gray-500">{editMode ? 'Edit user' : 'Add user'}</span>
							</div>
						</div>
						<div>


							{
								status?.status.includes("error") &&
								<Alert severity={status?.status} sx={{ width: '100%' }}>

									{status?.message?.__all__.length > 0 && status?.message?.__all__[0] }

								</Alert>
							}
							{/* {status.message?.email || status.message?.contacts || status.message?.county|| status.message?.password} */}

						</div>
						<div className={"col-span-5 flex bg-transparent items-center border border-gray-600 justify-between p-6 w-full drop-shadow  text-black mb-3 md:divide-x md:divide-gray-200 border-l-8 " + (true ? "border-gray-600" : "border-red-600")}>
							<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>

								{editMode ? <><PencilAltIcon className='ml-2 h-5 w-5' /> Edit user</> : <><UserAddIcon className='text-black ml-2 h-5 w-5' /> Add user </>}
							</h2>
							{editMode &&

								<button
									type='button'
									onClick={() => setOpen(true)}
									className=' bg-black p-2 text-white flex text-md font-semibold '>
									<span className='text-medium font-semibold text-white'>
										Disable
									</span>
								</button>
							}
						</div>

					</div>

					<div className='col-span-5 flex flex-col justify-center items-start px-1 md:px-4 w-full '>
						<div className=' w-full flex flex-col bg-gray-50 items-start p-3  border shadow-md'
							style={{ minHeight: '250px'}}>

							<>
								<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
									Bio Details
								</h4>
								<form
									className='flex flex-col w-full items-start justify-start gap-3'
									onSubmit={e => handleBasicDetailsSubmit(e, props['6']?.token)}
								>
									{/* first name*/}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='first_name'
											className='text-gray-600 capitalize text-sm'>
											First Name
											<span className='text-medium leading-12 font-semibold'>
												{' '}
												*
											</span>
										</label>
										<input
											required
											type='text'
											name='first_name'
											onChange={ev => {
												// console.log(ev);
												handleOnChange(
													ev
												)
											}}
											value={userData.first_name || ''}
											className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
										/>
									</div>
									{/* Last name */}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='last_name'
											className='text-gray-600 capitalize text-sm'>
											Last Name
											<span className='text-medium leading-12 font-semibold'>
												{' '}
												*
											</span>
										</label>
										<input
											required
											type='text'
											name='last_name'
											onChange={ev => {
												handleOnChange(
													ev
												)
											}}
											value={userData.last_name || ''}
											className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
										/>
									</div>
									{/* Other names */}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='other_names'
											className='text-gray-600 capitalize text-sm'>
											Other Names

										</label>
										<input
											type='text'
											name='other_names'
											onChange={ev => {
												handleOnChange(
													ev
												)
											}}
											value={userData.other_names || ''}
											className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
										/>
									</div>

									{/* Email */}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='email'
											className='text-gray-600 capitalize text-sm'>
											Email
											<span className='text-medium leading-12 font-semibold'>
												{' '}
												*
											</span>
										</label>
										<input
											required
											type='email'
											name='email'
											onChange={ev => {
												handleOnChange(
													ev
												)
											}}
											value={userData.email || ''}
											className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
										/>
									</div>

									{/* Employee Number */}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='employee_number'
											className='text-gray-600 capitalize text-sm'>
											Employee Number
											<span className='text-medium leading-12 font-semibold'>
												{' '}
												*
											</span>
										</label>
										<input
											required
											type='text'
											name='employee_number'
											onChange={ev => {
												handleOnChange(
													ev
												)
											}}
											value={userData.employee_number || ''}
											className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
										/>
									</div>

									{/* Job Title */}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='job_title'
											className='text-gray-600 capitalize text-sm'>
											Job Title
											<span className='text-medium leading-12 font-semibold'>
												{' '}
												*
											</span>
										</label>
										<Select
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
											options={jobs || []}
											required
											placeholder='Select job title..'
											onChange={ev => {
												handleOnChange({ name: 'job_title', ev })
											}}

											value={{
												value: userData?.job_title,
												label: jobs?.find(r => r.value == userData?.job_title)?.label
											} || ''}
											name='job_title'
											className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'


										/>
									</div>

									{/* Password */}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='password'
											className='text-gray-600 capitalize text-sm'>
											Password
											<span className='text-medium leading-12 font-semibold'>
												{' '}
												*
											</span>
										</label>
										<input
											required
											type='password'
											name='password'
											onChange={ev => {
												handleOnChange(
													ev
												)
												setIsCPasswordDirty(true);
											}}
											value={userData.password || ''}
											className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
										/>
									</div>
									{/* confirm password */}
									<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
										<label
											htmlFor='conf-password'
											className='text-gray-600 capitalize text-sm'>
											Confirm Password
											<span className='text-medium leading-12 font-semibold'>
												{' '}
												*
											</span>
										</label>
										<input
											required
											type='password'
											name='conf_password'
											onChange={ev => {
												handleOnChange(
													ev
												)
											}}
											value={userData.conf_password || ''}
											className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
										/>
										{showErrorMessage && isCPasswordDirty ? <div> <p className='text-red-600'>Passwords did not match</p> </div> : ''}

									</div>

									{editMode && <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
										<input
											type='checkbox'
											value={person_details?.is_active}
											defaultChecked={person_details?.is_active}
											name='is_active'
											id='is_active'
											onChange={(ev) => {
												handleOnChange(
													ev
												)
											}}
										/>
										<label
											htmlFor='is_active'
											className='text-gray-700 capitalize text-sm flex-grow'>
											{' '}
											Is Active?
										</label>
									</div>}
									{/* Contacts */}

									<div className=' w-full flex flex-col items-start justify-start py-3   bg-transparent h-auto'>
										<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
											Contacts
										</h4>

										{contactList.map((x, i) => {
											// console.log(x)

											return (
												<div key={i} className='w-full flex flex-row items-center gap-1 gap-x-3 mb-3'>

													<div className='w-full flex flex-col items-left gap-1 gap-x-3 mb-3'>
														<label
															htmlFor='contact_type'
															className='text-gray-600 capitalize text-sm'
														// key={i}
														>
															Contact Type
															<span className='text-medium leading-12 font-semibold'>
																{' '}
																*
															</span>
														</label>
														<Select
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
															options={contact_types || []}
															required
															placeholder='Select contact type..'
															key={i}
															onChange={value => {
																handleOnChange({ cont_name: "contact_type", value, id: i })
															}}
															// value={(()=>{

															// 	( {value: person_details.contacts[i]?.contact_type, label:person_details.contacts[i]?.contact_type_name })
															// })()}
															value={
																{
																	value: userData?.contacts[i]?.contact_type || '',
																	label: contact_types.find(ct => ct.value == userData?.contacts[i]?.contact_type)?.label || ''
																}
															}
															name='contact_type'
															className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'

														/>
													</div>

													<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
														<label
															htmlFor='contact_text'
															className='text-gray-600 capitalize text-sm'>
															Contact Details
															<span className='text-medium leading-12 font-semibold'>
																{' '}
																*
															</span>
														</label>
														<input
															required
															type='text'
															name='contact_text'
															key={i}
															onChange={value => {
																handleOnChange({
																	cont_name: "contact_text", value, id: i
																})
															}}
															value={
																(userData.contacts[i])?.contact_text || ''
															}
															className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
														/>
													</div>

													     {/* Delete Btn */}
													<button
														id={`delete-btn-${i}`}
														onClick={async ev => {
															ev.preventDefault();

															if (contactList.length >= 0) {


																// contacts.splice(index, 1);
																// setFacilityContacts(contacts);
																// contactList.splice(index, 1);
																// delete contactList[index]
																setContactList(contactList.filter((_, index) => i !== index));
															}

														}}
													><XCircleIcon className='w-7 h-7 text-red-400' /></button>


												</div>)
										})
											// : <h4>No Contacts Assigned to User</h4>
										}

									</div>
									<div className="sticky top-0 right-10 w-full flex justify-end">
										<button className=' bg-blue-600 p-2 text-white flex text-md font-semibold '
											onClick={handleAddClick}
										>
											{`Add Contact`}
											<PlusIcon className='text-white ml-2 h-5 w-5' />
										</button>

									</div>

									{/* Group Details */}
									<div className=' w-full flex flex-col items-start justify-start py-3   bg-transparent h-auto'>
										<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
											Group
										</h4>
										<div className='w-full flex flex-row items-center gap-1 gap-x-3 mb-3'>
											<div className='w-full flex flex-col items-left  justify-  gap-1 gap-x-3 mb-3'>
												<Select
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
													options={groups || []}
													required
													isMulti
													placeholder='Select group(s)'
													name='group'
													onChange={ev => {
														handleOnChange({ name: 'groups', ev })
													}}

													value={userData.groups?.map((value) => ({
														value: value.id || '',
														label: value.name || ''
													})) || ''}
													className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'

												/>
											</div>

										</div>

									</div>

									{selectedGroups?.map((grp, i) => {
										return (
											<React.Fragment key={i}>
												{(() => {
													if (grp.id == 1 || grp.id == 12 || grp.id == 2) {
														return (
															// Administrative area 
															<div key={i} className=' w-full flex flex-col items-start justify-start py-3   bg-transparent h-auto'>
																<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
																	Administrative Areas
																</h4>
																<div className='w-full flex flex-row items-center gap-1 gap-x-3 mb-3'>
																	<div className='w-full flex flex-col items-left  gap-2 gap-x-3 mb-3'>

																		<Select
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
																			options={counties || []}
																			isMulti
																			required
																			placeholder='Select county..'

																			onChange={async (ev) => {

																				handleOnChange({ name: 'user_counties', ev })

																				for (let i = 0; i < ev.length; i++) {
																					try {
																						const resp = await fetch(`/api/filters/subcounty/?county=${ev[i].value}${"&fields=id,name,county&page_size=30"}`)

																						setSubCountyOptions((await resp.json()).results.map(({ id, name }) => ({ value: id, label: name })))

																					}
																					catch (e) {
																						console.error('Unable to fetch sub_county options')
																						setSubCountyOpt(null)
																					}
																				}


																			}}
																			value={userData.user_counties?.map((value) => ({
																				value: value.county || '',
																				label: value.county_name || value.name || ''
																			})) || ''}
																			name='county'
																			className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'

																		/>
																		{
																		
																		grp.id !== 1 &&

																		<Select 
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
																			options={subCountyOptions || []}
																			isMulti
																			required
																			placeholder='Select a sub county..'
																			onChange={ev => {
																				handleOnChange({ name: 'user_sub_counties', ev })
																			}}
																			value={userData.user_sub_counties?.map((value) => ({
																				value: value.id || '',
																				label: value.sub_county_name || value.name || ''
																			})) || ''}

																			name='sub_county'
																			className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
																		/>
																		}
																	</div>

																</div>

															</div>)
													}
													else if (grp.id == 3) {
														return (
															//  Regulatory body 
															<div className=' w-full flex flex-col items-start justify-start p-3   bg-transparent h-auto'>
																<h4 className='text-lg uppercase pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900'>
																	Regulatory Body
																</h4>
																<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>

																		<Select
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
																			options={regbodies || []}
																			isMulti
																			required
																			placeholder='Select regulatory body(s)'
																			onChange={ev => {
																				handleOnChange({ name: 'regulatory_users', ev })
																			}}
																			value={userData.regulatory_users?.map((value) => ({
																				value: value.id,
																				label: value.name
																			})) || ''}
																			name='regulatory_body'
																			className='flex-none w-full bg-transparent  flex-grow  placeholder-gray-5 focus:bg-white focus:border-gray-600 outline-none'
																		/>
																	</div>

																</div>

															</div>
														)
													}
													else {
														return null
													}
												})()}
											</React.Fragment>
										)
									})}

									{/* Cancel & Save */}
									<div className='flex justify-between items-center w-full'>
										<button className='flex items-center justify-start space-x-2 p-1 border-2 border-black  px-2'>
											<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
											<span className='text-medium font-semibold text-black '>
												Cancel
											</span>
										</button>
										<button
											disabled={!add_user}
											type='submit'
											className=' bg-blue-600 p-2 text-white flex text-md font-semibold '>
											<span className='text-medium font-semibold text-white'>
												{editMode ? 'Update' : ' Save'}
											</span>
										</button>
									</div>
								</form>
							</>

						</div>
					</div>



					{/* Floating div at bottom right of page */}
					{/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-gray-50/50 bg-blend-lighten shadow-lg -lg flex flex-col justify-center items-center py-2 px-3">
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
	else {
		return null
	}
}

User.getInitialProps = async (ctx) => {
	const API_URL = process.env.NEXT_PUBLIC_API_URL
	const person_id = ctx.query.id
	const allOptions = []
	const options = [
		'groups',
		'contact_type',
		'counties',
		'regulating_bodies',
		'job_titles',
		'individual_details'
	]

	return checkToken(ctx.req, ctx.res).then(async t => {
		if (t.error) {
			throw new Error('Error checking token')
		} else {
			let token = t.token
			let url = ''
			for (let i = 0; i < options.length; i++) {
				const option = options[i]
				switch (option) {
					case 'groups':
						url = `${API_URL}/users/groups/`
						try {

							const _data = await fetch(url, {
								headers: {
									Authorization: 'Bearer ' + token,
									Accept: 'application/json',
								},
							})

							let results = (await _data.json()).results.map(({ id, name }) => { return { value: id, label: name } })

							allOptions.push({ groups: results })

						}
						catch (err) {
							console.log(`Error fetching ${option}: `, err);
							allOptions.push({
								error: true,
								err: err,
								groups: [],
							});
						}
						break;
					case 'contact_type':
						url = `${API_URL}/common/contact_types/?fields=id,name`
						try {

							const _data = await fetch(url, {
								headers: {
									Authorization: 'Bearer ' + token,
									Accept: 'application/json',
								},
							})

							let results = (await _data.json()).results.map(({ id, name }) => { return { value: id, label: name } })

							allOptions.push({ contact_type: results })

						}
						catch (err) {
							console.log(`Error fetching ${option}: `, err);
							allOptions.push({
								error: true,
								err: err,
								contact_type: [],
							});
						}
						break;
					case 'counties':
						url = `${API_URL}/common/counties/?page_size=500&ordering=name`
						try {

							const _data = await fetch(url, {
								headers: {
									Authorization: 'Bearer ' + token,
									Accept: 'application/json',
								},
							})

							let results = (await _data.json()).results.map(({ id, name }) => { return { value: id, label: name } })

							allOptions.push({ counties: results })

						}
						catch (err) {
							console.log(`Error fetching ${option}: `, err);
							allOptions.push({
								error: true,
								err: err,
								counties: [],
							});
						}
						break;
					case 'regulating_bodies':
						url = `${API_URL}/facilities/regulating_bodies/`
						try {

							const _data = await fetch(url, {
								headers: {
									Authorization: 'Bearer ' + token,
									Accept: 'application/json',
								},
							})

							let results = (await _data.json()).results.map(({ id, name }) => { return { value: id, label: name } })

							allOptions.push({ regulating_bodies: results })

						}
						catch (err) {
							console.log(`Error fetching ${option}: `, err);
							allOptions.push({
								error: true,
								err: err,
								regulating_bodies: [],
							});
						}
						break;
					case 'job_titles':
						url = `${API_URL}/facilities/job_titles/`
						try {

							const _data = await fetch(url, {
								headers: {
									Authorization: 'Bearer ' + token,
									Accept: 'application/json',
								},
							})
							let results = (await _data.json()).results.map(({ id, name }) => { return { value: id, label: name } })
							allOptions.push({ job_titles: results })

						}
						catch (err) {
							console.log(`Error fetching ${option}: `, err);
							allOptions.push({
								error: true,
								err: err,
								job_titles: [],
							});
						}
						break;
					case 'individual_details':
						if (person_id !== null && person_id !== '') {
							url = `${API_URL}/users/${person_id}/`
							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								}).then(r => r.json()).then(resp => { return resp })

								allOptions.push({ person_details: _data })
							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									job_titles: [],
								});
							}
						}
						break;

				}
			}

			allOptions.push({
				token
			})

			return allOptions
		}
	}).catch(err => {
		console.log('Error checking token: ', err)
		if (typeof window !== 'undefined' && window) {
			if (ctx?.asPath) {
				window.location.href = ctx?.asPath
			} else {
				window.location.href = '/add_user'
			}
		}
		setTimeout(() => {
			return {
				error: true,
				err: err,
				data: [],
				query: {},
				path: ctx.asPath || '/add_user',
				current_url: ''
			}
		}, 1000);
	})

}

export default withRouter(User)