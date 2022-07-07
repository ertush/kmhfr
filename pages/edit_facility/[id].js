import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { checkToken } from '../../controllers/auth/auth'
import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import MainLayout from '../../components/MainLayout'
import { CheckCircleIcon, InformationCircleIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid'

import dynamic from 'next/dynamic'

const EditFacility = (props) =>
{
    const Map = dynamic(
        () => import('../../components/Map'), // replace '@components/map' with your component's location
        {
            loading: () => <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
            ssr: false
        } // This line is important. It's what prevents server-side render
    )
    let facility = props.data
    const [user, setUser] = useState(null)

    useEffect(() =>
    {
        if (typeof window !== 'undefined')
        {
            let usr = window.sessionStorage.getItem('user')
            if (usr && usr.length > 0)
            {
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
                <div className="w-full grid grid-cols-4 gap-4 p-2 my-6">
                    <div className="col-span-4 flex flex-col items-start px-4 justify-start gap-3">
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
                                <>
                                    <form className='flex flex-col w-full items-start justify-start gap-3'>
                                        {/* Facility Official Name */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Official Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="text" name="facility_official_name" value={facility.official_name} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>
                                        {/* Facility Unique Name  */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Unique Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="text" name="facility_unique_name" value={facility.unique_name} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>
                                        {/* Facility Type */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Facility Type <span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <Select options={
                                                [
                                                    {
                                                        value: 'type-1',
                                                        label: 'type-1'
                                                    },
                                                    {
                                                        value: 'type-2',
                                                        label: 'type-2'
                                                    }
                                                ]
                                            }
                                                required
                                                placeholder="Select a facility type..."

                                                onChange={
                                                    () => console.log('changed type')
                                                }
                                                name="facility_official_name"

                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                        </div>

                                        {/* Facility Type Details */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Type Details<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="text" placeholder="Select a facility type details..." value={facility.owner_name} name="facility_unique_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* Operation Status */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Operation Status <span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <Select options={
                                                [
                                                    {
                                                        value: 'op-status-1',
                                                        label: 'op-status-1'
                                                    },
                                                    {
                                                        value: 'op-status-2',
                                                        label: 'op-status-2'
                                                    }
                                                ]
                                            }
                                                required
                                                placeholder="Select an operation status..."
                                                onChange={
                                                    () => console.log('changed')
                                                }
                                                name="facility_official_name"
                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                        </div>

                                        {/* Date Established */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_unique_name" className="text-gray-600 capitalize text-sm">Date Established<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="date" name="facility_unique_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* Is Facility accredited */}
                                        <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                            <label htmlFor="facility_accredited" className="text-gray-700 capitalize text-sm flex-grow">*Is the facility accredited Lab ISO 15189? </label>
                                            <span className="flex items-center gap-x-1">
                                                <input type="radio" value={true} defaultChecked={true} name="facility_accredited" id="facility_accredited_yes" onChange={ev =>
                                                {

                                                }} />
                                                <small className="text-gray-700">Yes</small>
                                            </span>
                                            <span className="flex items-center gap-x-1">
                                                <input type="radio" value={false} defaultChecked={false} name="facility_accredited" id="facility_accredited_no" onChange={ev =>
                                                {

                                                }} />
                                                <small className="text-gray-700">No</small>
                                            </span>
                                        </div>

                                        {/* Owner Category */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="owner_category" className="text-gray-600 capitalize text-sm">Owner Category<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <Select options={
                                                [
                                                    {
                                                        value: 'Private Practice',
                                                        label: 'Private Practice'
                                                    },
                                                    {
                                                        value: 'Non-Governmental Organizations',
                                                        label: 'Non-Governmental Organizations'
                                                    },
                                                    {
                                                        value: 'Ministry of Health',
                                                        label: 'Ministry of Health'
                                                    },
                                                    {
                                                        value: 'Faith Based Organization',
                                                        label: 'Faith Based Organization'
                                                    }
                                                ]
                                            }
                                                required
                                                placeholder="Select owner.."
                                                onChange={
                                                    () => console.log('changed')
                                                }
                                                name="owner_category"
                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                        </div>

                                        {/* Owner Details */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="owner_details" className="text-gray-600 capitalize text-sm">Owner Details<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <Select options={
                                                [
                                                    {
                                                        value: 'Private Practice',
                                                        label: 'Private Practice'
                                                    },
                                                    {
                                                        value: 'Non-Governmental Organizations',
                                                        label: 'Non-Governmental Organizations'
                                                    },
                                                    {
                                                        value: 'Ministry of Health',
                                                        label: 'Ministry of Health'
                                                    },
                                                    {
                                                        value: 'Faith Based Organization',
                                                        label: 'Faith Based Organization'
                                                    }
                                                ]
                                            }
                                                required
                                                placeholder="Select an owner.."
                                                onChange={
                                                    () => console.log('changed')
                                                }
                                                name="owner_details"
                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                        </div>

                                        {/* KEPH Level */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">KEPH Level</label>
                                            <Select options={
                                                [
                                                    {
                                                        value: 'Private Practice',
                                                        label: 'Private Practice'
                                                    },
                                                    {
                                                        value: 'Non-Governmental Organizations',
                                                        label: 'Non-Governmental Organizations'
                                                    },
                                                    {
                                                        value: 'Ministry of Health',
                                                        label: 'Ministry of Health'
                                                    },
                                                    {
                                                        value: 'Faith Based Organization',
                                                        label: 'Faith Based Organization'
                                                    }
                                                ]
                                            }

                                                placeholder="Select a KEPH Level.."
                                                onChange={
                                                    () => console.log('changed')
                                                }
                                                name="keph_level"
                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                        </div>

                                        {/* No. Functional general Beds */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_general_beds" className="text-gray-600 capitalize text-sm">Number of functional general beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_general_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. Functional cots */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_cots" className="text-gray-600 capitalize text-sm">Number of functional cots<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_cots" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. Emergency Casulty Beds */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_emergency_beds" className="text-gray-600 capitalize text-sm">Number of Emergency Casulty Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_emergency_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. Intensive Care Unit Beds */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_icu_beds" className="text-gray-600 capitalize text-sm">Number of Intensive Care Unit (ICU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_icu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. High Dependency Unit HDU */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_hdu_beds" className="text-gray-600 capitalize text-sm">Number of High Dependency Unit (HDU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_hdu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. of maternity beds */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_maternity_beds" className="text-gray-600 capitalize text-sm">Number of maternity beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_maternity_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. of isolation beds */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_isolation_beds" className="text-gray-600 capitalize text-sm">Number of isolation beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_isolation_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. of General Theatres */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_general_theatres" className="text-gray-600 capitalize text-sm">Number of General Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_general_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* No. of Maternity Theatres */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="no_maternity_theatres" className="text-gray-600 capitalize text-sm">Number of Maternity Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="no_maternity_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* Facility Catchment Population */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_catchment_population" className="text-gray-600 capitalize text-sm">Facility Catchment Population<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <input required type="number" name="facility_catchment_population" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>

                                        {/* Is Reporting DHIS2 */}
                                        <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                            <label htmlFor="facility_reporting" className="text-gray-700 capitalize text-sm flex-grow">*Should this facility have reporting in DHIS2?  </label>
                                            <span className="flex items-center gap-x-1">
                                                <input type="radio" value={true} defaultChecked={true} name="facility_reporting" id="facility_reporting_yes" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <small className="text-gray-700">Yes</small>
                                            </span>
                                            <span className="flex items-center gap-x-1">
                                                <input type="radio" value={false} defaultChecked={false} name="facility_reporting" id="facility_reporting_no" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <small className="text-gray-700">No</small>
                                            </span>
                                        </div>

                                        {/* Facility Admissions */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                            <label htmlFor="facility_admission" className="text-gray-600 capitalize text-sm">Facility admissions<span className='text-medium leading-12 font-semibold'> *</span></label>
                                            <Select options={
                                                [
                                                    {
                                                        value: 'Private Practice',
                                                        label: 'Private Practice'
                                                    },
                                                    {
                                                        value: 'Non-Governmental Organizations',
                                                        label: 'Non-Governmental Organizations'
                                                    },
                                                    {
                                                        value: 'Ministry of Health',
                                                        label: 'Ministry of Health'
                                                    },
                                                    {
                                                        value: 'Faith Based Organization',
                                                        label: 'Faith Based Organization'
                                                    }
                                                ]
                                            }
                                                required
                                                placeholder="Select an admission status.."
                                                onChange={
                                                    () => console.log('changed')
                                                }
                                                name="facility_admission"
                                                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                        </div>

                                        {/* Is NHIF accredited */}
                                        <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                            <label htmlFor="nhif_accredited" className="text-gray-700 capitalize text-sm flex-grow"> *Does this facility have NHIF accreditation?   </label>
                                            <span className="flex items-center gap-x-1">
                                                <input type="radio" value={true} defaultChecked={true} name="nhif_accredited" id="nhif_accredited_yes" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <small className="text-gray-700">Yes</small>
                                            </span>
                                            <span className="flex items-center gap-x-1">
                                                <input type="radio" value={false} defaultChecked={false} name="nhif_accredited" id="nhif_accredited_no" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <small className="text-gray-700">No</small>
                                            </span>
                                        </div>

                                        {/* Armed Forces Facilities */}

                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                            <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Armed Forces Facilities</h4>
                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                <input type="checkbox" value={false} defaultChecked={false} name="facility_accredited" id="is_armed_forces" onChange={ev =>
                                                {
                                                    console.log({ ev })
                                                }} />
                                                <label htmlFor="is_armed_forces" className="text-gray-700 capitalize text-sm flex-grow"> Is this an Armed Force facility? </label>
                                            </div>
                                        </div>

                                        {/* Hours/Days of Operation */}

                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                            <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Hours/Days of Operation</h4>
                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                <input type="checkbox" value={false} defaultChecked={false} name="facility_accredited" id="open_24hrs" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <label htmlFor="open_24hrs" className="text-gray-700 capitalize text-sm flex-grow"> Open 24 hours</label>
                                            </div>

                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                <input type="checkbox" value={false} defaultChecked={false} name="facility_accredited" id="open_latenight" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <label htmlFor="open_latenight" className="text-gray-700 capitalize text-sm flex-grow"> Open Late Night</label>
                                            </div>

                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                <input type="checkbox" value={false} defaultChecked={false} name="facility_accredited" id="open_pubholidays" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <label htmlFor="open_pubholidays" className="text-gray-700 capitalize text-sm flex-grow"> Open on public holidays</label>
                                            </div>

                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                <input type="checkbox" value={false} defaultChecked={false} name="facility_accredited" id="open_weekends" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <label htmlFor="open_weekends" className="text-gray-700 capitalize text-sm flex-grow"> Open during weekends</label>
                                            </div>

                                            <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                <input type="checkbox" value={false} defaultChecked={false} name="facility_accredited" id="open_8_5" onChange={ev =>
                                                {
                                                    // console.log({ev})
                                                }} />
                                                <label htmlFor="open_8_5" className="text-gray-700 capitalize text-sm flex-grow"> Open from 8am to 5pm</label>
                                            </div>
                                        </div>


                                        {/* Location Details */}
                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto" >
                                            <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Location Details</h4>
                                            <div className="grid grid-cols-4 place-content-start gap-3 w-full">
                                                {/* County  */}
                                                <div className="col-start-1 col-span-1">
                                                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">County<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value: 'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value: 'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value: 'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value: 'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        }
                                                            required
                                                            placeholder="Select County"
                                                            onChange={
                                                                () => console.log('changed')
                                                            }
                                                            name="keph_level"
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>
                                                </div>

                                                {/* Sub-county */}
                                                <div className="col-start-2 col-span-1">
                                                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">Sub-county<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value: 'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value: 'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value: 'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value: 'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        }
                                                            required
                                                            placeholder="Select Sub County"
                                                            onChange={
                                                                () => console.log('changed')
                                                            }
                                                            name="keph_level"
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>
                                                </div>

                                                {/* Constituency */}
                                                <div className="col-start-3 col-span-1">
                                                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">Constituency<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value: 'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value: 'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value: 'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value: 'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        }
                                                            required
                                                            placeholder="Select Constituency"
                                                            onChange={
                                                                () => console.log('changed')
                                                            }
                                                            name="keph_level"
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>
                                                </div>

                                                {/* Ward */}
                                                <div className="col-start-4 col-span-1">
                                                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">Ward<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value: 'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value: 'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value: 'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value: 'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        }
                                                            required
                                                            placeholder="Select Ward"
                                                            onChange={
                                                                () => console.log('changed')
                                                            }
                                                            name="keph_level"
                                                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>
                                                </div>


                                            </div>

                                            {/* Nearest Town/Shopping Center */}
                                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="nearest_town" className="text-gray-600 capitalize text-sm">Nearest Town/Shopping Center<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <input required type="text" name="nearest_town" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* Plot Number */}
                                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="plot_number" className="text-gray-600 capitalize text-sm">Plot number<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <input required type="text" name="plot_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* Nearest landmark */}
                                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="nearest_landmark" className="text-gray-600 capitalize text-sm">Nearest landmark<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <input required type="text" name="nearest_landmark" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>

                                            {/* Location Description */}
                                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="location_description" className="text-gray-600 capitalize text-sm">location description<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <input required type="text" name="location_description" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>
                                        </div>

                                        {/* check file upload */}
                                        <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto">
                                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                <label htmlFor="checklist_file" className="text-gray-600 capitalize text-sm">checklist file upload<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                <input required type="file" name="checklist_file" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                            </div>
                                        </div>
                                    </form>
                                </>
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
                </div>
            </MainLayout>
        </div>
    )
}

EditFacility.getInitialProps = async (ctx) =>
{
    if (ctx.query.q)
    {
        const query = ctx.query.q
        if (typeof window !== 'undefined' && query.length > 2)
        {
            window.location.href = `/facilities?q=${ query }`
        } else
        {
            if (ctx.res)
            {
                ctx.res.writeHead(301, {
                    Location: '/facilities?q=' + query
                });
                ctx.res.end();
                return {};
            }
        }
    }
    return checkToken(ctx.req, ctx.res).then(t =>
    {
        if (t.error)
        {
            throw new Error('Error checking token')
        } else
        {
            let token = t.token
            let url = process.env.NEXT_PUBLIC_API_URL + '/facilities/facilities/' + ctx.query.id + '/'
            return fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            }).then(r => r.json())
                .then(json =>
                {
                    return {
                        data: json
                    }
                }).catch(err =>
                {
                    console.log('Error fetching facilities: ', err)
                    return {
                        error: true,
                        err: err,
                        data: [],
                    }
                })
        }
    }).catch(err =>
    {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window)
        {
            if (ctx?.asPath)
            {
                window.location.href = ctx?.asPath
            } else
            {
                window.location.href = '/facilities'
            }
        }
        setTimeout(() =>
        {
            return {
                error: true,
                err: err,
                data: [],
            }
        }, 1000);
    })
}

export default EditFacility