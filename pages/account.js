import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { getUserContacts } from '../controllers/auth/auth'
import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout'
import { CheckCircleIcon, XCircleIcon, XIcon } from '@heroicons/react/solid'
import { Dialog} from '@headlessui/react'
import { UserContext } from '../providers/user';
import Link from 'next/link'
import router from 'next/router';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const Account = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [user, setUser] = useState(null)
    const [showEditBasic, setShowEditBasic] = useState(false)
    const [showEditContacts, setShowEditContacts] = useState(false)
    const [userContact, setUserContact] = useState(null)
    const [userContactType, setUserContactType] = useState(null)
    const [formDetails, setFormDetails] = useState(null)
    const [path, setPath] = useState('')
    const [formErrors, setFormErrors] = useState({ status: false, message: ''})
    const [status, setStatus]= useState(null)
    const [open, setOpen] = useState(false);
    const [contact_id, setContactId] = useState(null)

    // const [fname, setFname] = useState("")
    // const [lname, setLname] = useState("")
    // const [onames, setOnames] = useState("")
    // const [email, setEmail] = useState("")
    // const [username, setUsername] = useState("")

    const userCtx = useContext(UserContext)
    //check if a session cookie is set

    useEffect(() => {
        let user_id
        
        if (userCtx) {
            let s_r = userCtx
            user_id = s_r?.id
            setUser(s_r)
            // if (s_r) {
            //     setFname(s_r.first_name)
            //     setLname(s_r.last_name)
            //     setOnames(s_r.other_names)
            //     setEmail(s_r.email)
            //     setUsername(s_r.username)
            // }
        }
        
       
        let is_user_logged_in = (typeof window !== 'undefined' && window.document.cookie.indexOf('access_token=') > -1) || false
        let session_token = null
        if (is_user_logged_in) {
            session_token = JSON.parse(window.document.cookie.split('access_token=')[1].split(';')[0])
        }
        if (is_user_logged_in && typeof window !== 'undefined' && session_token !== null && user_id && ("" + user_id).length > 0) {
            getUserContacts(session_token.token, API_URL + '/common/user_contacts/?user=' + user_id).then(cnt => {
                if (cnt.error || cnt.detail) {
                    setUserContact(null)
                } else {
                    setUserContact(cnt?.results)
                }
            })
            getUserContacts(session_token.token, API_URL + '/common/contact_types/?fields=id,name').then(ctypt => {
                if (ctypt.error || ctypt.detail) {
                    setUserContactType(null)
                } else {
                    setUserContactType(ctypt?.results)
                }
            })
        }
      
    }, [])

    // console.log({formDetails, path});

    useEffect (()=>{
        let mounted = true
        if(mounted){
            if(formDetails !== null && formDetails?.old_password === formDetails?.new_password1){
                setFormErrors({status:true, message:'Old password and new password cannot be the same'})
            }else
            if(formDetails !== null && formDetails?.new_password1 !== formDetails?.new_password2){
                setFormErrors({status:true, message:'New password and confirm password do not match'})
            }else{
                setFormErrors({status:false, message:''})
            }
            
        }
        return () => mounted = false; 

    },[formDetails, path])
    const handleBasicDetailsSubmit = async ()=>{
		let url ='/api/common/submit_form_data/?path='+path
		try{
			 fetch(url, {
				headers:{
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json;charset=utf-8'
					
				},
				method: path.includes('delete_profile_contact')? 'DELETE': 'POST',
				body: path.includes('delete_profile_contact')? null: JSON.stringify(formDetails).replace(',"":""','')
			})
			.then(resp =>resp.json())
			.then(async (res) =>{ 
                if(path === 'basic'){
                    setShowEditBasic(false);
                }
                if(path === 'contacts'){
                    let payload={
                        user_id: userCtx.id,
                        contact:res.id
                    }
                    url = '/api/common/submit_form_data/?path=user_contacts'
                    await fetch(url, {
                        headers:{
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        method: 'POST',
                        body: JSON.stringify(payload).replace(',"":""','')
                    }).then(resp =>resp.json()).then(res =>{
                        console.log(res.length)
                        if(res.id !==undefined ){

                            router.push({pathname:'/users'})
                            alert.success(editMode? 'User updated successfully':'User added successfully')
        
                        }else{
                            setStatus({status:'error', message: res})
                        }
                    })
                   setShowEditContacts(false);
                }
                if(path === 'password'){
                    router.push('/auth/login')
                }
			})
			.catch(e=>{
			  setStatus({status:'error', message: e})
			})
		}catch (e){
			setStatus({status:'error', message: e})
		}
	}
    useEffect(() => {
        if(path !== '' || path !== null){

            handleBasicDetailsSubmit()
        }
    }, [path])
    return (
        <>
            <Head>
                <title>KMHFR - {user?.name || "My account"}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout className="w-full grid grid-cols-5 gap-3 md:mt-3 mb-12">
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
						bgcolor: 'background.paper',
						borderRadius: '6px',
						boxShadow: 24,
						p: 4,
					}
				}>
					<span className="flex gap-2">    
							Are you sure you want to delete<b></b> ?
					</span>
					<div className='flex justify-start gap-4 mt-4'> 
						<button className="bg-blue-500 text-white font-semibold  p-2 text-center" type="button" 
                         onClick={(e)=>{
                            setPath(`delete_profile_contact&id=${contact_id}`);setOpen(false)
                        }}
                          >Delete</button>
						<button className="bg-red-500 text-white font-semibold  p-2 text-center" 
						onClick={()=> {setOpen(false)}} 
						>Cancel</button>
					</div>     
				</Box>
				</Fade>
			</Modal>
		}
                {user && user?.id ? <div className="w-full col-span-5 gap-4 p-2 my-6">
                    <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-3">
                        <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                            <Link className="text-blue-700" href="/">Home</Link> {'/'}
                            <span className="text-gray-500">Account settings</span>
                        </div>
                        <div>{status !==null && <Alert severity={status?.status} sx={{width:'100%'}}>

                            {()=>{
                                if(status?.message){
                                    if(typeof status?.message === 'object'){
                                        return Object.keys(status?.message).map((key, index) => {
                                            return <div key={index}>{key}: {status?.message[key]}</div>
                                        })
                                    }else{
                                        return status?.message
                                    }
                                }
                            }}()
                            
                            </Alert> }</div>

                        <div className={`col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-light-grey drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border border-blue-600 border-l-8 ${'border-blue-600'}`}>
                            <div className="col-span-6 md:col-span-3">
                                <h1 className="text-4xl tracking-tight font-bold leading-tight">{user?.full_name}</h1>
                                <div className="flex gap-2 items-center w-full justify-between">
                                    <span className={"font-bold text-2xl " + (user?.name ? "text-blue-900" : "text-gray-400")}>#{user?.id || "NO_ID"}</span>
                                   
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                                {user.is_active ? <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Active
                                </span> : <span className="bg-red-200 text-red-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                                    <XCircleIcon className="h-4 w-4" />
                                    Inactive
                                </span>}
                            </div>
                            <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">

                            </div>
                        </div>
                    </div>

                    <div className="col-span-5 flex flex-col gap-3 mt-4 border border-blue-600">
                        <Tabs.Root orientation="horizontal" className="w-full flex flex-col bg-grey-light tab-root" defaultValue="basic">
                            <Tabs.List className="list-none flex flex-wrap gap-2  md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                <Tabs.Tab value="basic" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Basic details
                                </Tabs.Tab>
                                <Tabs.Tab value="contacts" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Contacts
                                </Tabs.Tab>
                                <Tabs.Tab value="password" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Manage password
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="basic" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
                                    <div className="flex flex-row items-center justify-end w-full py-2">
                                        <div className="py-2 w-full flex flex-row items-center justify-between">
                                            <h3 className="text-2xl flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                                <span className="font-semibold">Basic details</span>
                                            </h3>
                                            <button className="bg-transparent border border-blue-700 py-1 px-2 text-base  bg-light-grey  text-blue-700 font-semibold hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white active:bg-blue-700 active:text-white focus:outline-none transform ease-linear transition-colors duration-75" onClick={() => setShowEditBasic(!showEditBasic)}>Edit basic details</button>
                                        </div>
                                        <Dialog className="fixed z-10 inset-0 overflow-y-auto" open={showEditBasic} onClose={() => setShowEditBasic(false)}>
                                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                            <div className="flex items-center justify-center min-h-screen">
                                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                                <div className="bg-light-grey  max-w-sm sm:max-w-screen-sm sm:w-full flex flex-col items-center mx-auto z-20 p-8">
                                                    <div className="w-full flex flex-col gap-2">
                                                        <Dialog.Title as="h2" className="font-semibold text-black text-2xl">Edit basic details</Dialog.Title>
                                                        <Dialog.Description as="div" className="flex flex-col items-center justify-start gap-3 w-full">
                                                            <form className="grid grid-cols-2 gap-3 p-2 w-full" onSubmit={fm => {
                                                                fm.preventDefault();
                                                                setPath('basic')
                                                                // handleBasicDetailsSubmit(fm);
                                                                // if submission successful then
                                                                // setShowEditBasic(false);
                                                                //else show error within modal
                                                            }}>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">First name</label>
                                                                    <input type="text" name="first_name" defaultValue={user.first_name || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                                            }else{
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: "" });
                                                                            }
                                                                        }}
                                                                        className=" border border-gray-300 focus:ring-1 ring-blue-500 outline-none bg-light-grey  p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Last name</label>
                                                                    <input type="text" name="last_name" defaultValue={user.last_name || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                                            }else{
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: "" });
                                                                            }
                                                                        }}
                                                                        className=" border border-gray-300 focus:ring-1 ring-blue-500 outline-none bg-light-grey  p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Other names</label>
                                                                    <input type="text" name="other_names" defaultValue={user.other_names || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                                            }else{
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: "" });
                                                                            }
                                                                        }}
                                                                        className=" border border-gray-300 focus:ring-1 ring-blue-500 outline-none bg-light-grey  p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Email</label>
                                                                    <input type="email" name="email" defaultValue={user.email || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}
                                                                        className=" border border-gray-300 focus:ring-1 ring-blue-500 outline-none bg-light-grey  p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Username</label>
                                                                    <input type="text" name="username" defaultValue={user.username || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}
                                                                        className=" border border-gray-300 focus:ring-1 ring-blue-500 outline-none bg-light-grey  p-2" />
                                                                </div>
                                                            <div className="flex flex-wrap gap-3 items-center justify-around w-full">
                                                                <button className="border-none  bg-transparent outline-none py-2 px-3 hover:text-red-700 focus:text-red-700 active:text-red-700" onClick={() => {setShowEditBasic(false); setFormDetails({}); }}>Cancel</button>
                                                                {/* <button type= "submit" className="text-white  bg-black py-2 px-4 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700">Save changes</button> */}
                                                                <input type="submit" value="Save changes" className="bg-black text-white  py-2 px-4 text-base font-medium hover:text-blue-300" />
                                                            </div>
                                                            </form>
                                                        </Dialog.Description>
                                                    </div>
                                                </div>
                                            </div>

                                        </Dialog>
                                    </div>
                                    <div className="bg-light-grey  border border-gray-100 w-full p-3  grid grid-cols-2 gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">Status:</h3>
                                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                            <label className=" text-gray-600">Active</label>
                                            <p className="text-black font-medium text-base flex">
                                                {user && user.is_active ?
                                                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        Yes
                                                    </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                        <XCircleIcon className="h-4 w-4" />
                                                        No
                                                    </span>}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                            <label className=" text-gray-600">Staff member</label>
                                            <p className="text-black font-medium text-base flex">
                                                {user && user.is_staff ?
                                                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        Yes
                                                    </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                        <XCircleIcon className="h-4 w-4" />
                                                        No
                                                    </span>}
                                            </p>
                                        </div>
                                        {Object.keys(user?.user_groups).map(ug => (
                                            user?.user_groups[ug] ? <div key={ug} className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                <label className=" text-gray-600">{ug[0].toLocaleUpperCase() + ug.split('_').join(' ').slice(1).toLocaleLowerCase() || ' - '}</label>
                                                <p className="text-black font-medium text-base flex">
                                                    {user && user?.user_groups[ug] ?
                                                        <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            Yes
                                                        </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                            <XCircleIcon className="h-4 w-4" />
                                                            No
                                                        </span>}
                                                </p>
                                            </div> : ""
                                        ))}
                                    </div>
                                  
                                    <div className="bg-light-grey  border border-gray-100 w-full p-3  flex flex-col gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">Location:</h3>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">County</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {user.county_name || " - "}
                                                {user.user_counties.length > 0 && <span>, {user.user_counties.join(", ")}</span>}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Subcounty</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {user.sub_county_name || " - "}
                                                {user.user_sub_counties.length > 0 && <span>, {user.user_sub_counties.join(", ")}</span>}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Constituency</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {user.constituency_name || " - "}
                                                {user.user_constituencies.length > 0 && <span>, {user.user_constituencies.join(", ")}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-light-grey  border border-gray-100 w-full p-3  flex flex-col gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">Other details:</h3>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Role</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {user?.job_title_name || " - "}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Date joined</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {new Date(user.date_joined).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) || " - "}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Last update</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {new Date(user.updated).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) || " - "}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">User groups</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {Array.from(user?.groups, ug => ug.name).join(", ") || " - "}
                                            </p>
                                        </div>
                                    </div>
                                    <details className="bg-light-grey  w-full py-2 px-4 text-gray-400 cursor-default ">
                                        <summary>All data</summary>
                                        <pre className="language-json leading-normal text-sm whitespace-pre-wrap text-gray-800 overflow-y-auto normal-case" style={{ maxHeight: '70vh' }}>
                                            {JSON.stringify({ ...user }, null, 2).split('{').join('\n').split('"').join('').split(',').join('\n').split('_').join(' ')}
                                        </pre>
                                    </details>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="contacts" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-light-grey  w-full p-4  flex flex-col gap-y-2">
                                        {/* ---- EDIT CONTACTS ---- */}
                                        <div className="w-ful flex flex-row items-center justify-between">
                                            <h3 className="text-2xl flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                                <span className="font-semibold">My contacts</span>
                                            </h3>
                                            <button className="bg-transparent border border-blue-700 py-1 px-2 text-base  bg-light-grey  text-blue-700 font-semibold hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white active:bg-blue-700 active:text-white focus:outline-none transform ease-linear transition-colors duration-75" onClick={() => setShowEditContacts(!showEditContacts)}>Add new contact</button>
                                        </div>
                                        <div className="flex flex-row items-center justify-end w-full py-2">
                                            <Dialog className="fixed z-10 inset-0 overflow-y-auto" open={showEditContacts} onClose={() => setShowEditContacts(false)}>
                                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                                <div className="flex items-center justify-center min-h-screen">
                                                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                                    <div className="bg-light-grey   max-w-sm sm:max-w-screen-sm sm:w-full flex flex-col items-center mx-auto z-20 p-8">
                                                        <div className="w-full flex flex-col gap-2">
                                                            <Dialog.Title as="h2" className="font-semibold text-black text-2xl">Add new contact</Dialog.Title>
                                                            <Dialog.Description as="div" className="flex flex-col items-center justify-start gap-3 w-full">

                                                                <form className="flex flex-col gap-2 w-full p-1" onSubmit={fm => {
                                                                    fm.preventDefault();
                                                                    setPath('contacts')
                                                                    // handleBasicDetailsSubmit(fm)
                                                                    // if submission successful then
                                                                    //else show error within modal
                                                                }}>
                                                                    <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                                        <label>Contact type</label>
                                                                        <select className=" border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" name="contact_type"
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}>
                                                                            {userContactType && userContactType.map(ctype => (
                                                                                <option value={ctype?.id} key={ctype?.id}>{ctype?.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                                        <label>Contact details</label>
                                                                        <input type="text" className=" border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" name="contact" onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }} />
                                                                    </div>
                                                                 
                                                                <div className="flex flex-wrap gap-3 items-center justify-around w-full">
                                                                    <button className="border-none  bg-transparent outline-none py-2 px-3 hover:text-red-700 focus:text-red-700 active:text-red-700" onClick={() => {setShowEditContacts(false); setFormDetails({}); }}>Cancel</button>
                                                                    <button className="text-white  bg-black py-2 px-4 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700" type="submit">Add Contact</button>
                                                                </div>
                                                                </form>

                                                            </Dialog.Description>
                                                        </div>
                                                    </div>
                                                </div>

                                            </Dialog>
                                        </div>
                                        {/* ---- EDIT CONTACTS ---- */}
                                        {(userContact && userContact.length > 0) && userContact.map(contact => (
                                            <div key={contact.id} className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                <label className="col-span-1 text-gray-600 capitalize">{contact.contact_type_text[0].toLocaleUpperCase() + contact.contact_type_text.slice(1).toLocaleLowerCase() || "Contact"}</label>
                                                <p className="col-span-2 text-black font-medium text-base flex items-center justify-between gap-x-1">
                                                    <span>{contact.contact_text || " - "}</span>
                                                    <button className="text-gray-600 focus:text-red-600 hover:text-red-600 bg-transparent flex flex-row items-center justify-between gap-x-1 group outline-none focus:ring-1 focus:ring-red-500 leading-none "
                                                    onClick={()=>{setContactId(contact.id);setOpen(true)}}
                                                    >
                                                        <XIcon className="h-4 w-4"/>
                                                        <span className="group-focus:underline group-hover:underline">Remove</span>
                                                    </button>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="password" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-light-grey  w-full p-4  flex flex-col gap-2">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Change your password</span>
                                        </h3>
                                        <br className="my-1"/>
                                        <h6>The password must be at least 8 characters and contain both letters and numbers</h6>
                                        <form className="flex flex-col gap-2 w-full border p-3 "
                                        onSubmit={fm => {
                                            fm.preventDefault();
                                            setPath('password')
                                            // handleBasicDetailsSubmit(fm)
                                            // if submission successful then
                                            //else show error within modal
                                        }}
                                        >
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>Old password</label>
                                                <input type="password" className=" border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="********" name="old_password" 
                                                onChange={ev => {
                                                    if (ev.target.value && ev.target.value.length > 0) {
                                                        setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                    }
                                                }}
                                                />
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>New password</label>
                                                <input type="password" className=" border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="********" name="new_password1"
                                                passwordrules="minlength: 8; required: lower; required: upper; required: digit;"
                                                onChange={ev => {
                                                    if (ev.target.value && ev.target.value.length > 0) {
                                                        setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                    }
                                                }}
                                                
                                                />
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>Confirm password</label>
                                                <input type="password" className=" border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="********" name="new_password2" 
                                                onChange={ev => {
                                                    if (ev.target.value && ev.target.value.length > 0) {
                                                        setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                                                    }
                                                }}
                                                
                                                />
                                            </div>
                                            {formErrors.status && <div> <p className='text-red-600'>{formErrors.message}</p> </div> }

                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <input type="submit" value="Save new password" className="bg-black text-white  py-2 px-4 text-base font-medium hover:text-blue-300" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Tabs.Panel>
                        </Tabs.Root>
                    </div>

                </div> : <div className="w-full h-screen flex flex-col items-center justify-center">
                    <div className="bg-yellow-200 border  border-yellow-400">
                        <p>No user data found</p>
                    </div>
                </div>}
            </MainLayout>
        </>
    )
}



export default Account