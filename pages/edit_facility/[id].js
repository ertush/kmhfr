import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { checkToken } from '../../controllers/auth/auth'
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout'
import { CheckCircleIcon, InformationCircleIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid'

import dynamic from 'next/dynamic'

const EditFacility = (props) => {
    const Map = dynamic(
        () => import('../../components/Map'), // replace '@components/map' with your component's location
        {
            loading: () => <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
            ssr: false
        } // This line is important. It's what prevents server-side render
    )
    let facility = props.data
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let usr = window.sessionStorage.getItem('user')
            if (usr && usr.length > 0) {
                setUser(JSON.parse(usr))
            }
        }
    }, [])
    return (
        <div className="">
            <Head>
                <title>KMHFL - {facility.official_name}</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout>
                <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
                    <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-3">
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <a className="text-green-700" href="/facilities">Facilities</a> {'>'}
                            <span className="text-gray-500">{facility.official_name} ( #<i className="text-black">{facility.code || "NO_CODE"}</i> )</span>
                        </div>
                        <div className={"col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (facility.is_approved ? "border-green-600" : "border-red-600")}>
                            <div className="col-span-6 md:col-span-3">
                                <h1 className="text-4xl tracking-tight font-bold leading-tight">{facility.official_name}</h1>
                                <div className="flex gap-2 items-center w-full justify-between">
                                    <span className={"font-bold text-2xl " + (facility.code ? "text-green-900" : "text-gray-400")}>#{facility.code || "NO_CODE"}</span>
                                    <p className="text-gray-600 leading-tight">{facility.keph_level_name && "KEPH " + facility.keph_level_name}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                                
                            </div>
                            <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">
                                {/* {user && user?.id ? <a href={'/facility/edit/' + facility.id} className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black-700 active:bg-black-700 font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center">
                                    Edit
                                </a> : <a href="/auth/login">Log in</a>} */}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 md:col-span-3 flex flex-col gap-3 mt-4">
                        <Tabs.Root orientation="horizontal" className="w-full flex flex-col tab-root" defaultValue="overview">
                            <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                <Tabs.Tab value="overview" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Basic Details
                                </Tabs.Tab>
                                <Tabs.Tab value="services" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Geolocation
                                </Tabs.Tab>
                                <Tabs.Tab value="infrastructure" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Family contacts
                                </Tabs.Tab>
                                <Tabs.Tab value="hr_staffing" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Regulation
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Services
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Infrastructure
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Human Resources
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="overview" className="grow-1 py-1 px-4 tab-panel">
                            return (
                                                <>
                                                    <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Basic Details</h4>
                                                    <form className='flex flex-col w-full items-start justify-start gap-3' onSubmit={}>
                                                        {/* Facility Official Name */}
                                                        <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                            <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Official Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                            <input required type="text" name="facility_official_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                        </div>
                                                    </form>
                                                </>
                                    );
                            </Tabs.Panel>
                            <Tabs.Panel value="services" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Services</span>
                                            {/* {user && user?.id ? <a href={"/facility/edit/"+facility.id+"#services"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit services</a> : ""} */}
                                        </h3>
                                        <ul>
                                            {(facility?.facility_services && facility?.facility_services.length > 0) ? facility?.facility_services.map(service => (
                                                <li key={service.service_id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{service.service_name}</p>
                                                        <small className="text-xs text-gray-500">{service.category_name || ''}</small>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-800 text-base">
                                                            {service.average_rating || 0}/{service.number_of_ratings || 0}
                                                        </p>
                                                        <small className="text-xs text-gray-500">Rating</small>
                                                    </div>
                                                    <label className="text-sm text-gray-600 flex gap-1 items-center">
                                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                        <span>Active</span>
                                                    </label>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                    <p>No services listed for this facility.</p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="infrastructure" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left px-1 py-4">
                                    <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                        <span className="font-semibold">Infrastructure</span>
                                        {/* {user && user?.id ? <a href={"/facility/edit/"+facility.id+"#infrastructure"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit infrastructure</a> : ""} */}
                                    </h3>
                                    <div className="bg-white w-full p-4 rounded flex flex-col">
                                        <ul>
                                            {(facility?.facility_infrastructure && facility?.facility_infrastructure.length > 0) ? facility?.facility_infrastructure.map(infra => (
                                                <li key={infra.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{infra.infrastructure_name}</p>
                                                        {/* <small className="text-xs text-gray-500">{infra.id || ''}</small> */}
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        {/* <CheckCircleIcon className="h-4 w-4 text-green-500" /> */}
                                                        <label className="text-lg text-gray-800 font-semibold">{infra.count || 0}</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                                                    <p>No other infrastructure data listed for this facility.</p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="hr_staffing" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Human Resources</span>
                                            {/* {user && user?.id ? <a href={"/facility/edit/"+facility.id+"#hr"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit HR</a> : ""} */}
                                        </h3>
                                        <ul>
                                            {(facility?.facility_specialists && facility?.facility_specialists.length > 0) ? facility?.facility_specialists.map(hr => (
                                                <li key={hr.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{hr.speciality_name}</p>
                                                        {/* <small className="text-xs text-gray-500">{hr.id || ''}</small> */}
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        {/* <CheckCircleIcon className="h-4 w-4 text-green-500" /> */}
                                                        <label className="text-lg text-gray-800">{hr.count || 0}</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                                                    <p>No HR data listed for this facility.</p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="community_units" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Facility units</span>
                                            {/* {user && user?.id ? <a href={"/facility/edit/"+facility.id+"#units"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit facility units</a> : ""} */}
                                        </h3>
                                        <ul>
                                            {(facility?.facility_units && facility?.facility_units.length > 0) ? facility?.facility_units.map(unit => (
                                                <li key={unit.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{unit.unit_name}</p>
                                                        <small className="text-xs text-gray-500">{unit.regulating_body_name || ''}</small>
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                        <label className="text-sm text-gray-600">Active</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                                                    <p>No units in this facility.</p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                        </Tabs.Root>
                    </div>
                    <aside className="flex flex-col col-span-5 md:col-span-2 gap-4 mt-5">
                        <h3 className="text-2xl tracking-tight font-semibold leading-5">Map</h3>

                        {(facility?.lat_long && facility?.lat_long.length > 0) ? <div className="w-full bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                            <Map operational={facility.operational || facility.operation_status_name} code={facility?.code || "NO_CODE"} lat={facility?.lat_long[0]} long={facility?.lat_long[1]} name={facility.official_name || facility.name || ""} />
                        </div> :
                            <div className="w-full bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                                <div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                                    <p>No location data found for this facility.</p>
                                </div>
                            </div>}
                        <div className="flex flex-col gap-2 mt-3">
                            <h4 className="text-2xl text-gray-800">Recent activity</h4>
                            <ol className="list-decimal list-outside ml-4 flex flex-row gap-3">
                                <li className="bg-gray-50 w-full rounded-sm p-2">
                                    {facility?.latest_approval_or_rejection?.comment && <p>{facility?.latest_approval_or_rejection?.comment}</p>}
                                    {/* <small className="text-gray-500">{facility?.latest_approval_or_rejection?.id}</small> */}
                                </li>
                            </ol>
                        </div>
                    </aside>
                </div>
            </MainLayout>
        </div>
    )
}

EditFacility.getInitialProps = async (ctx) => {
    if (ctx.query.q) {
        const query = ctx.query.q
        if (typeof window !== 'undefined' && query.length > 2) {
            window.location.href = `/facilities?q=${query}`
        } else {
            if (ctx.res) {
                ctx.res.writeHead(301, {
                    Location: '/facilities?q=' + query
                });
                ctx.res.end();
                return {};
            }
        }
    }
    return checkToken(ctx.req, ctx.res).then(t => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token
            let url = process.env.NEXT_PUBLIC_API_URL + '/facilities/facilities/' + ctx.query.id + '/'
            return fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            }).then(r => r.json())
                .then(json => {
                    return {
                        data: json
                    }
                }).catch(err => {
                    console.log('Error fetching facilities: ', err)
                    return {
                        error: true,
                        err: err,
                        data: [],
                    }
                })
        }
    }).catch(err => {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/facilities'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
            }
        }, 1000);
    })
}

export default EditFacility