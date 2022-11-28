import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { checkToken, getUserContacts } from '../controllers/auth/auth'
import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout'
import { CheckCircleIcon, InformationCircleIcon, LocationMarkerIcon, LockClosedIcon, XCircleIcon, XIcon } from '@heroicons/react/solid'
import { ArrowsExpandIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import { Dialog, Transition } from '@headlessui/react'
import { UserContext } from '../providers/user';
import {Link} from 'next/link'

const Account = (props) => {
    const [user, setUser] = useState(null)
    const [showEditBasic, setShowEditBasic] = useState(false)
    const [showEditContacts, setShowEditContacts] = useState(false)
    const [userContact, setUserContact] = useState(null)
    const [userContactType, setUserContactType] = useState(null)
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [basicUserForm, setBasicUserForm] = useState({})
    const [contactDetailsForm, setContactDetailsForm] = useState({})
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [onames, setOnames] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")


    const userCtx = useContext(UserContext)
    //check if a session cookie is set

    useEffect(() => {
        let user_id
        
        if (userCtx) {
            let s_r = userCtx
            user_id = s_r?.id
            setUser(s_r)
            if (s_r) {
                setFname(s_r.first_name)
                setLname(s_r.last_name)
                setOnames(s_r.other_names)
                setEmail(s_r.email)
                setUsername(s_r.username)
            }
        }
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let is_user_logged_in = (typeof window !== 'undefined' && window.document.cookie.indexOf('access_token=') > -1) || false
        let session_token = null
        if (is_user_logged_in) {
            session_token = JSON.parse(window.document.cookie.split('access_token=')[1])
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
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }, [])
    return (
        <div className="">
            <Head>
                <title>KMHFL - {user?.name || "My account"}</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout>
                {user && user?.id ? <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
                    <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-3">
                        <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                            <Link className="text-green-700" href="/">Home</Link> {'/'}
                            <span className="text-gray-500">Account settings</span>
                        </div>
                        <div className={"col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (user.is_active ? "border-green-600" : "border-red-600")}>
                            <div className="col-span-6 md:col-span-3">
                                <h1 className="text-4xl tracking-tight font-bold leading-tight">{user?.full_name}</h1>
                                <div className="flex gap-2 items-center w-full justify-between">
                                    <span className={"font-bold text-2xl " + (user?.name ? "text-green-900" : "text-gray-400")}>#{user?.id || "NO_ID"}</span>
                                    {/* <p className="leading-tight flex flex-wrap gap-1">
                                        <u className="text-black">Role:</u>
                                        <span className="text-gray-600">{user?.job_title_name && user?.job_title_name}</span>
                                    </p> */}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                                {user.is_active ? <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Active
                                </span> : <span className="bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                    <XCircleIcon className="h-4 w-4" />
                                    Inactive
                                </span>}
                            </div>
                            <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">

                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 md:col-span-3 flex flex-col gap-3 mt-4">
                        <Tabs.Root orientation="horizontal" className="w-full flex flex-col tab-root" defaultValue="basic">
                            <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
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
                                            <button className="bg-transparent border border-green-700 py-1 px-2 text-base rounded bg-white text-green-700 font-semibold hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white active:bg-green-700 active:text-white focus:outline-none transform ease-linear transition-colors duration-75" onClick={() => setShowEditBasic(!showEditBasic)}>Edit basic details</button>
                                        </div>
                                        <Dialog className="fixed z-10 inset-0 overflow-y-auto" open={showEditBasic} onClose={() => setShowEditBasic(false)}>
                                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                            <div className="flex items-center justify-center min-h-screen">
                                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                                <div className="bg-white rounded max-w-sm sm:max-w-screen-sm sm:w-full flex flex-col items-center mx-auto z-20 p-8">
                                                    <div className="w-full flex flex-col gap-2">
                                                        <Dialog.Title as="h2" className="font-semibold text-black text-2xl">Edit basic details</Dialog.Title>
                                                        <Dialog.Description as="div" className="flex flex-col items-center justify-start gap-3 w-full">
                                                            <form className="grid grid-cols-2 gap-3 p-2 w-full" onSubmit={fm => {
                                                                fm.preventDefault();
                                                                console.log(basicUserForm);
                                                                // if submission successful then
                                                                setShowEditBasic(false);
                                                                //else show error within modal
                                                            }}>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">First name</label>
                                                                    <input type="text" name="first_name" defaultValue={user.first_name || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setBasicUserForm({ ...basicUserForm, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}
                                                                        className="rounded border border-gray-300 focus:ring-1 ring-green-500 outline-none bg-white p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Last name</label>
                                                                    <input type="text" name="last_name" defaultValue={user.last_name || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setBasicUserForm({ ...basicUserForm, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}
                                                                        className="rounded border border-gray-300 focus:ring-1 ring-green-500 outline-none bg-white p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Other names</label>
                                                                    <input type="text" name="other_names" defaultValue={user.other_names || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setBasicUserForm({ ...basicUserForm, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}
                                                                        className="rounded border border-gray-300 focus:ring-1 ring-green-500 outline-none bg-white p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Email</label>
                                                                    <input type="email" name="email" defaultValue={user.email || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setBasicUserForm({ ...basicUserForm, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}
                                                                        className="rounded border border-gray-300 focus:ring-1 ring-green-500 outline-none bg-white p-2" />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-sm">Username</label>
                                                                    <input type="text" name="username" defaultValue={user.username || ""}
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setBasicUserForm({ ...basicUserForm, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}
                                                                        className="rounded border border-gray-300 focus:ring-1 ring-green-500 outline-none bg-white p-2" />
                                                                </div>
                                                            </form>
                                                            <div className="flex flex-wrap gap-3 items-center justify-around w-full">
                                                                <button className="border-none rounded bg-transparent outline-none py-2 px-3 hover:text-red-700 focus:text-red-700 active:text-red-700" onClick={() => {setShowEditBasic(false); setBasicUserForm({}); }}>Cancel</button>
                                                                <button className="text-white rounded bg-black py-2 px-4 hover:bg-green-700 focus:bg-green-700 active:bg-green-700" onClick={() => alert(JSON.stringify(basicUserForm))}>Save changes</button>
                                                            </div>
                                                        </Dialog.Description>
                                                    </div>
                                                </div>
                                            </div>

                                        </Dialog>
                                    </div>
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded grid grid-cols-2 gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">Status:</h3>
                                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                            <label className=" text-gray-600">Active</label>
                                            <p className="text-black font-medium text-base flex">
                                                {user && user.is_active ?
                                                    <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        Yes
                                                    </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                        <XCircleIcon className="h-4 w-4" />
                                                        No
                                                    </span>}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                            <label className=" text-gray-600">Staff member</label>
                                            <p className="text-black font-medium text-base flex">
                                                {user && user.is_staff ?
                                                    <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        Yes
                                                    </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
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
                                                        <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            Yes
                                                        </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                            <XCircleIcon className="h-4 w-4" />
                                                            No
                                                        </span>}
                                                </p>
                                            </div> : ""
                                        ))}
                                    </div>
                                    {/* <small>{JSON.stringify(userContact, null, 2)}</small> */}
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
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
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
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
                                    <details className="bg-gray-100 w-full py-2 px-4 text-gray-400 cursor-default rounded">
                                        <summary>All data</summary>
                                        <pre className="language-json leading-normal text-sm whitespace-pre-wrap text-gray-800 overflow-y-auto normal-case" style={{ maxHeight: '70vh' }}>
                                            {JSON.stringify({ ...user }, null, 2).split('{').join('\n').split('"').join('').split(',').join('\n').split('_').join(' ')}
                                        </pre>
                                    </details>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="contacts" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded flex flex-col gap-y-2">
                                        {/* ---- EDIT CONTACTS ---- */}
                                        <div className="w-ful flex flex-row items-center justify-between">
                                            <h3 className="text-2xl flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                                <span className="font-semibold">My contacts</span>
                                            </h3>
                                            <button className="bg-transparent border border-green-700 py-1 px-2 text-base rounded bg-white text-green-700 font-semibold hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white active:bg-green-700 active:text-white focus:outline-none transform ease-linear transition-colors duration-75" onClick={() => setShowEditContacts(!showEditContacts)}>Add new contact</button>
                                        </div>
                                        <div className="flex flex-row items-center justify-end w-full py-2">
                                            <Dialog className="fixed z-10 inset-0 overflow-y-auto" open={showEditContacts} onClose={() => setShowEditContacts(false)}>
                                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                                <div className="flex items-center justify-center min-h-screen">
                                                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                                                    <div className="bg-white rounded max-w-sm sm:max-w-screen-sm sm:w-full flex flex-col items-center mx-auto z-20 p-8">
                                                        <div className="w-full flex flex-col gap-2">
                                                            <Dialog.Title as="h2" className="font-semibold text-black text-2xl">Add new contact</Dialog.Title>
                                                            <Dialog.Description as="div" className="flex flex-col items-center justify-start gap-3 w-full">

                                                                <form className="flex flex-col gap-2 w-full p-1" onSubmit={fm => {
                                                                    fm.preventDefault();
                                                                    console.log(contactDetailsForm);
                                                                    // if submission successful then
                                                                    setShowEditContacts(false);
                                                                    //else show error within modal
                                                                }}>
                                                                    <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                                        <label>Contact type</label>
                                                                        <select className="rounded border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500" name="contact_type"
                                                                        onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setContactDetailsForm({ ...contactDetailsForm, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }}>
                                                                            {userContactType && userContactType.map(ctype => (
                                                                                <option value={ctype?.id} key={ctype?.id}>{ctype?.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                                        <label>Contact details</label>
                                                                        <input type="text" className="rounded border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500" name="contact_details" onChange={ev => {
                                                                            if (ev.target.value && ev.target.value.length > 0) {
                                                                                setContactDetailsForm({ ...contactDetailsForm, [ev.target.name]: ev.target.value });
                                                                            }
                                                                        }} />
                                                                    </div>
                                                                    {/* <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                                        <input type="submit" value="Save new contact" className="bg-black text-white rounded py-2 px-4 text-base font-medium hover:text-green-300" />
                                                                    </div> */}
                                                                </form>

                                                                <div className="flex flex-wrap gap-3 items-center justify-around w-full">
                                                                    <button className="border-none rounded bg-transparent outline-none py-2 px-3 hover:text-red-700 focus:text-red-700 active:text-red-700" onClick={() => {setShowEditContacts(false); setContactDetailsForm({}); }}>Cancel</button>
                                                                    <button className="text-white rounded bg-black py-2 px-4 hover:bg-green-700 focus:bg-green-700 active:bg-green-700" onClick={() => alert(JSON.stringify(contactDetailsForm))}>Add Contact</button>
                                                                </div>
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
                                                    <button className="text-gray-600 focus:text-red-600 hover:text-red-600 bg-transparent flex flex-row items-center justify-between gap-x-1 group outline-none focus:ring-1 focus:ring-red-500 leading-none rounded">
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
                                    <div className="bg-white w-full p-4 rounded flex flex-col gap-2">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Change your password</span>
                                        </h3>
                                        <br className="my-1"/>
                                        <h6>The password must be at least 8 characters and contain both letters and numbers</h6>
                                        <form className="flex flex-col gap-2 w-full border p-3 rounded">
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>Old password</label>
                                                <input type="password" className="rounded border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="********" name="old_password" />
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>New password</label>
                                                <input type="password" className="rounded border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="********" name="new_password" />
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>Repeat new password</label>
                                                <input type="password" className="rounded border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="********" name="repeat_new_password" />
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <input type="submit" value="Save new password" className="bg-black text-white rounded py-2 px-4 text-base font-medium hover:text-green-300" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Tabs.Panel>
                        </Tabs.Root>
                    </div>

                </div> : <div className="w-full h-screen flex flex-col items-center justify-center">
                    <div className="bg-yellow-200 border rounded border-yellow-400">
                        <p>No user data found</p>
                    </div>
                </div>}
            </MainLayout>
        </div>
    )
}

// Account.getInitialProps = async (ctx) => {
    // return {}
    // return checkToken(ctx.req, ctx.res).then(t => {
    //     let token = t.token
    //     let basics_url = process.env.NEXT_PUBLIC_API_URL+'/rest-auth/user/'
    //     let contacts_url = process.env.NEXT_PUBLIC_API_URL+'/common/user_contacts/?user='
    //     const basics = getBasics().then(b=>b)
    //     const basics = getContacts().then(c=>c)
    // }).catch(err => {
    //     console.log('Error checking token: ', err)
    //     return {
    //         error: true,
    //         err: err,
    //         data: [],
    //     }
    // })
// }

export default Account