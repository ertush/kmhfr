import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { checkToken, getUserContacts } from '../controllers/auth/auth'
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout'
import { CheckCircleIcon, InformationCircleIcon, LocationMarkerIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid'
import { ArrowsExpandIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'

const Account = (props) => {
    const [user, setUser] = useState(null)
    const [userContact, setUserContact] = useState(null)
    const [userContactType, setUserContactType] = useState(null)
    const API_URL = process.env.API_URL || 'http://api.kmhfltest.health.go.ke/api'
    //check if a session cookie is set

    useEffect(() => {
        let user_id
        if (typeof window !== 'undefined') {
            let usr = window.sessionStorage.getItem('user')
            if (usr && usr.length > 0) {
                let s_r = JSON.parse(usr)
                user_id = s_r?.id
                setUser(s_r)
            }
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let is_user_logged_in = (typeof window !== 'undefined' && window.document.cookie.indexOf('access_token=') > -1) || false
        let session_token = null
        if (is_user_logged_in) {
            session_token = JSON.parse(window.document.cookie.split('access_token=')[1])
        }
        if (is_user_logged_in && typeof window !== 'undefined' && session_token !== null && user_id && ("" + user_id).length > 0) {
            getUserContacts(session_token.token, API_URL + '/common/user_contacts/?user='+user_id).then(cnt => {
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
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                            <a className="text-green-700" href="/">Home</a> {'>'}
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
                                        {Object.keys(user?.user_groups).map(ug=>(
                                            user?.user_groups[ug] ? <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                <label className=" text-gray-600">{ug[0].toLocaleUpperCase()+ug.split('_').join(' ').slice(1).toLocaleLowerCase() || ' - '}</label>
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
                                                {user.user_counties.length>0 && <span>, {user.user_counties.join(", ")}</span>}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Subcounty</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {user.sub_county_name || " - "}
                                                {user.user_sub_counties.length>0 && <span>, {user.user_sub_counties.join(", ")}</span>}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Constituency</label>
                                            <p className="col-span-2 text-black font-medium text-base">
                                                {user.constituency_name || " - "}
                                                {user.user_constituencies.length>0 && <span>, {user.user_constituencies.join(", ")}</span>}
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
                                                {Array.from(user?.groups, ug=>ug.name).join(", ") || " - "}
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
                                    <div className="bg-white w-full p-4 rounded flex flex-col gap-2">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">My contacts</span>
                                        </h3>
                                        <form className="flex flex-col gap-2 w-full border p-3 rounded">
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>Contact type</label>
                                                <select className="rounded border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500">
                                                    {userContactType && userContactType.map(ctype=>(
                                                        <option value={ctype?.id} key={ctype?.id}>{ctype?.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <label>Contact details</label>
                                                <input type="text" className="rounded border border-gray-300 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500" name="contact_details" />
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1 text-left p-2">
                                                <input type="submit" value="Save new contact" className="bg-black text-white rounded py-2 px-4 text-base font-medium hover:text-green-300" />
                                            </div>
                                        </form>
                                        <h3 className="text-xl w-full underline">Current contacts</h3>
                                        {(userContact && userContact.length > 0) && userContact.map(contact => (
                                            <div key={contact.id} className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                <label className="col-span-1 text-gray-600 capitalize">{contact.contact_type_text[0].toLocaleUpperCase() + contact.contact_type_text.slice(1).toLocaleLowerCase() || "Contact"}</label>
                                                <p className="col-span-2 text-black font-medium text-base">{contact.contact_text || " - "}</p>
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
                    
                </div> : <div class="w-full h-screen flex flex-col items-center justify-center">
                    <div className="bg-yellow-200 border rounded border-yellow-400">
                        <p>No user data found</p>
                    </div>
                </div>}
            </MainLayout>
        </div>
    )
}

Account.getInitialProps = async (ctx) => {
    return {}
    // return checkToken(ctx.req, ctx.res).then(t => {
    //     let token = t.token
    //     let basics_url = process.env.API_URL+'/rest-auth/user/'
    //     let contacts_url = process.env.API_URL+'/common/user_contacts/?user='
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
}

export default Account