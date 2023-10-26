import React, {useContext, useEffect, useRef, useState} from 'react'
import MainLayout from '../../../components/MainLayout'
import Head from 'next/head'
import router from 'next/router'
import Select from 'react-select';
import {checkToken} from "../../../controllers/auth/auth";
import { ChevronDownIcon, ChevronDoubleLeftIcon } from "@heroicons/react/solid";
import Link from 'next/link'
import {
    CheckCircleIcon,
    LockClosedIcon,
    XCircleIcon,
    ChevronRightIcon,
} from "@heroicons/react/solid";
import * as Tabs from "@radix-ui/react-tabs";
import { UserContext } from "../../../providers/user";
import FacilitySideMenu from '../../../components/FacilitySideMenu'


const RegulateFacility = props => {
    const facility = props["0"]?.data;
    const regulationStateOptions = props['1']?.regulation_status
    const [isFacDetails, setIsFacDetails] = useState(true);
    const [user, setUser] = useState(null);
    const formRef = useRef(null);
    const regulationRef = useRef(null)


    const [khisSynched, setKhisSynched] = useState(false);
    const [facilityFeedBack, setFacilityFeedBack] = useState([])
    const [pathId, setPathId] = useState('') 
    const [allFctsSelected, setAllFctsSelected] = useState(false);
    const [title, setTitle] = useState('') 
    const filters = []

    const userCtx = useContext(UserContext)
    let reject = ''

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'))
		if(user.id === 6){
			router.push('/auth/login')
		}

        if (userCtx) setUser(userCtx);

        return () => {
            setIsFacDetails(true);
        };
    }, []);

    const handleSubmit = async (event,facility_id) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        let _payload = {}
        const formData = new FormData(formRef.current)
        formData.forEach((v, k) => {
            _payload.facility=facility_id;
            _payload[k] = v
        })

        let url='/api/common/submit_form_data/?path=regulation_status'
        try{
            fetch(url, {
                headers:{
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method:'POST',
                body: JSON.stringify(_payload)
            })
                .then(resp =>resp)
                .then(res =>{

                    // console.log(res.json)
                    if(res.status==200){
                        router.push('/facilities')
                    }
                })
                .catch(e=>{
                    setStatus({status:'error', message: e})
                })
        }catch (e){

            setStatus({status:'error', message: e})
            console.error(e)
        }
        console.log(_payload)
    }

    return (
        <>
            <Head>
                <title>KMHFR - Regulate Facility</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid md:grid-cols-7 gap-4 px-1 md:px-4 py-2 my-4">
                    {/* Header */}
                    <div className="md:col-span-7 flex flex-col items-start px-4 justify-start gap-3">
                        {/* Breadcramps */}
                        <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                            <Link className="text-blue-700" href="/">
                                Home
                            </Link>
                            {"/"}
                            <Link className="text-blue-700" href="/facilities">
                                Facilities
                            </Link>
                            {"/"}
                            <span className="text-gray-500">
                                {facility?.official_name ?? ""} ( #
                                <i className="text-black">{facility?.code || "NO_CODE"}</i> )
                            </span>
                        </div>
                        {/* Header Bunner  */}
                        <div
                            className={
                                "md:col-span-7 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
                                (facility?.regulation_status? "border-blue-600" : "border-red-600")
                            }
                        >
                            <div className="col-span-6 md:col-span-3">
                                <span onClick={() => router.push(`/facilities/${facility?.id}`)} className="text-4xl tracking-tight hover:text-blue-600 font-bold cursor-pointer leading-tight">{facility?.official_name}</span>
                                <div className="flex gap-2 items-center w-full justify-between">
                                    <span
                                        className={
                                            "font-bold text-2xl " +
                                            (facility?.code ? "text-blue-900" : "text-gray-400")
                                        }
                                    >
                                        #{facility?.code ?? "NO_CODE"}

                                     </span>

                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                                <div className="grid grid-cols-2 gap-2 w-full items-center justify-start md:justify-center">
                                    <label className="col-span-1 text-gray-600">
                                        Facility Type:
                                    </label>
                                    <p className="col-start-2 text-black font-medium text-base">
                                        {facility?.facility_type_name || " - "}
                                    </p>
                                    <label className="col-span-1 text-gray-600">
                                        Regulation Status:
                                    </label>
                                    <p className="col-start-2  text-black font-medium text-base">
                                        {facility?.regulatory_status_name || " - "}
                                    </p>
                                    <label className="col-span-1 text-gray-600">
                                        Operation Status:
                                    </label>
                                    <p className="col-start-2  text-black font-medium text-base">
                                        {facility?.operation_status_name || " - "}
                                    </p>

                                    {facility?.closed && (
                                        <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                            <LockClosedIcon className="h-4 w-4" />
                                            Closed
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div> */}
                        </div>
                    </div>

                    {/* Facility Side Menu Filters */}
                    <div className="md:col-span-1  md:mt-8">
                                <FacilitySideMenu 
                                    filters={filters}
                                    states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
                                    stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]}/>
                    </div>

                    {/* Facility Regulate Form */}
                    <div className='md:col-span-6 flex flex-col justify-start items-start px-1 md:px-4 w-full md:mt-7'>
                        <div className='w-full flex flex-col items-start h-auto p-4 rounded border border-gray-300/70 bg-gray-50'>
                            {/* Facility details hidden section */}

                            <div className="col-start-1 col-span-1 mb-4">
                                <button
                                    className="bg-blue-500 font-semibold w-auto text-white flex text-left items-center p-2 h-auto rounded-md"
                                    onClick={() => {
                                        if (isFacDetails) {
                                            setIsFacDetails(false);
                                        } else {
                                            setIsFacDetails(true);
                                        }
                                    }}
                                >
                                    View More Facility Details
                                    {isFacDetails ? (
                                        <ChevronRightIcon className="text-white h-7 w-7 font-bold" />
                                    ) : (
                                        <ChevronDownIcon className="text-white h-7 w-7 text-base font-bold" />
                                    )}
                                </button>
                            </div>
                            {!isFacDetails &&
                                <div className="col-span-5 md:col-span-3 flex flex-col gap-3 ">
                                    <Tabs.Root
                                        orientation="horizontal"
                                        className="w-full flex flex-col tab-root"
                                        defaultValue="overview"
                                    >
                                        <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                            <Tabs.Tab
                                                id={1}
                                                value="overview"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            >
                                                Facility Basic Details
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={2}
                                                value="services"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            >
                                                Facility Health Services
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={3}
                                                value="infrastructure"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            >
                                                Regulation
                                            </Tabs.Tab>
                                        </Tabs.List>
                                        <Tabs.Panel
                                            value="overview"
                                            className="grow-1 py-1 px-4 tab-panel"
                                        >
                                            <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
                                                <div className="bg-white border border-gray-100 w-full p-3 rounded grid grid-cols-2 gap-3 shadow-sm mt-4">
                                                    <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">
                                                        Basic Details:
                                                    </h3>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Facility closed
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.closed ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                                                                    Closed {facility?.closed_date || ""}
                                                                </span>
                                                                     ) : (
                                                                <span className="bg-blue-200 text-blue-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                     Not closed
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Functional general Beds:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_beds}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Open Weekends
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.open_weekends ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                      Yes
                                                                </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                <XCircleIcon className="h-4 w-4" />
                                                                    No
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Emergency casualty beds:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_emergency_casualty_beds}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Open on public holidays
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.open_public_holidays ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Yes
                                                                  </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                    <XCircleIcon className="h-4 w-4" />
                                                                    No
                                                                  </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Intensive Care Unit (ICU) Beds:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_icu_beds}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Open from 8 A.M to 5 P.M
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.open_whole_day ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Yes
                                                                  </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                    <XCircleIcon className="h-4 w-4" />
                                                                    No
                                                                  </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    {facility?.closed && (
                                                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                            <label className=" text-gray-600">
                                                                Facility closure reason
                                                            </label>
                                                            <p className="text-black font-medium text-base">
                                                                {facility?.closed_date && (
                                                                    <>{facility?.closed_date}. </>
                                                                )}{" "}
                                                                {facility?.closing_reason || ""}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            High Dependency Unit (HDU) Beds:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_hdu_beds}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            KHIS reporting
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.reporting_in_dhis ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Yes
                                                                  </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                    <XCircleIcon className="h-4 w-4" />
                                                                    No
                                                                  </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            General Theatres:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_general_theatres}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            NHIF accreditation
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.nhif_accreditation ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Yes
                                                                  </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                    <XCircleIcon className="h-4 w-4" />
                                                                    No
                                                                  </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Maternity theatres:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_maternity_theatres}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Open 24 hours
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.open_normal_day ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Yes
                                                                  </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                <XCircleIcon className="h-4 w-4" />
                                                                No
                                                              </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Maternity beds:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_maternity_beds}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Keph Level:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.keph_level_name || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Isolation beds:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_isolation_beds}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Facility Catchment Population:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.facility_catchment_population || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Functional cots:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.number_of_cots}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Open late night
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.open_late_night ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Yes
                                                                  </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                    <XCircleIcon className="h-4 w-4" />
                                                                    No
                                                                  </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Date Established:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.date_established || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Facility accredited Lab ISO 15189 :
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.accredited_lab_iso_15189 ? (
                                                                <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Yes
                                                                </span>
                                                            ) : (
                                                                <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                                    <XCircleIcon className="h-4 w-4" />
                                                                        No
                                                            </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                                    <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                                                        Ownership Status:
                                                    </h3>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Category
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.owner_type_name || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Owner
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.owner_name || " - "}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                                    <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                                                        Location Details:
                                                    </h3>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            COUNTY
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.county_name || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            SUB-COUNTY
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.sub_county_name || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            WARD
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.ward_name || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Town
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.town_name || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Specific directions:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.location_desc || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Nearest landmark
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.nearest_landmark || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Plot number
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.plot_number || " - "}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-white border border-gray-100 w-full p-3 rounded grid grid-cols-2 gap-3 shadow-sm mt-4">
                                                    <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">
                                                        Geologation:
                                                    </h3>
                                                    <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                        <label className=" text-gray-600">
                                                            Longitude:
                                                        </label>
                                                        <p className="text-black font-medium text-base flex">
                                                            {facility?.lat_long}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Latitude:
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.lat_long.splice(0,1)}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </Tabs.Panel>
                                        <Tabs.Panel
                                            value="services"
                                            className="grow-1 py-1 px-4 tab-panel"
                                        >
                                            <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                                <div className="bg-white w-full p-4 rounded">
                                                    <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                                        <span className="font-semibold">Services</span>
                                                        {/* {user && user?.id ? <a href={"/facility/edit/"+facility?.id+"#services"} className="text-base text-blue-700 font-medium hover:text-black focus:text-black active:text-black">Edit services</a> : ""} */}
                                                    </h3>
                                                    <ul>
                                                        {facility?.facility_services &&
                                                        facility?.facility_services.length > 0 ? (
                                                            facility?.facility_services.map((service) => (
                                                                <li
                                                                    key={service.service_id}
                                                                    className="w-full grid grid-cols-3 gap-3 place-content-end my-2 p-3 border-b border-gray-300"
                                                                >
                                                                    <div>
                                                                        <p className="text-gray-800 text-base">
                                                                            {service.service_name}
                                                                        </p>
                                                                        <small className="text-xs text-gray-500">
                                                                            {service.category_name || ""}
                                                                        </small>
                                                                    </div>


                                                                    <div>
                                                                        <p className="text-gray-800 text-base">
                                                                            {service.average_rating || 0}/
                                                                            {service.number_of_ratings || 0}
                                                                        </p>
                                                                        <small className="text-xs text-gray-500">
                                                                            Rating
                                                                        </small>
                                                                    </div>
                                                                    <label className="text-sm text-gray-600 flex gap-1 items-center">
                                                                        <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                                                                        <span>Active</span>
                                                                    </label>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                                <p>No services listed for this facility?.</p>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </Tabs.Panel>
                                        <Tabs.Panel
                                            value="infrastructure"
                                            className="grow-1 py-1 px-4 tab-panel"
                                        >
                                            <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left px-1 py-4">
                                                <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                                    <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                                                        Regulation:
                                                    </h3>
                                                    {facility?.date_established && (
                                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                            <label className="col-span-1 text-gray-600">
                                                                Date established
                                                            </label>
                                                            <p className="col-span-2 text-black font-medium text-base">
                                                                {new Date(
                                                                    facility?.date_established
                                                                ).toLocaleDateString("en-GB", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                }) || " - "}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {facility?.date_requested && (
                                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                            <label className="col-span-1 text-gray-600">
                                                                Date requested
                                                            </label>
                                                            <p className="col-span-2 text-black font-medium text-base">
                                                                {new Date(
                                                                    facility?.date_requested
                                                                ).toLocaleDateString("en-GB", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                }) || " - "}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {facility?.date_approved && (
                                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                            <label className="col-span-1 text-gray-600">
                                                                Date approved
                                                            </label>
                                                            <p className="col-span-2 text-black font-medium text-base">
                                                                {new Date(
                                                                    facility?.date_approved
                                                                ).toLocaleDateString("en-GB", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                }) || " - "}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Name
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.official_name || " - "}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            Regulating body
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.facility_units < 1
                                                                ? " - "
                                                                : facility?.facility_units !== undefined ? (facility?.facility_units[0].regulating_body_name || " - ") : ' - '}

                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                        <label className="col-span-1 text-gray-600">
                                                            License number
                                                        </label>
                                                        <p className="col-span-2 text-black font-medium text-base">
                                                            {facility?.facility_units < 1
                                                                ? " - "
                                                                : facility?.facility_units !== undefined ? (facility?.facility_units[0].license_number || " - ") : ' - '}

                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tabs.Panel>
                                    </Tabs.Root>
                                </div>

                            }

                            
                                <form
                                    className='flex flex-col w-full items-start justify-start gap-3 mt-4'
                                    onSubmit = { (event) => handleSubmit(event, facility?.id)}
                                    ref={formRef}
                                >
                                    {/* Regulation Status */}

                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                        <label
                                            htmlFor='status'
                                            id='status'
                                            className='text-gray-600 capitalize text-sm'>
                                            Regulation Status
                                            <span className='text-medium leading-12 font-semibold'>
																	{' '}
                                                *
																</span>
                                        </label>

                                        <Select
                                            options={regulationStateOptions || []}
                                            ref={regulationRef}
                                            required
                                            placeholder="Select Regulation Status"
                                            name='regulation_status'
                                            className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                    </div>

                                    {/* Reason */}
                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                        <label htmlFor="comment-text-area"
                                               className='text-gray-600 capitalize text-sm'>
                                            Reason
                                            <span className='text-medium leading-12 font-semibold'>{' '}*</span>
                                        </label>
                                        <textarea
                                            cols="70"
                                            rows="auto"
                                            required
                                            name='reason'
                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                            placeholder="Enter a comment"
                                            // onChange={(e) => setAppRejReason(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {/* License Number */}
                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                        <label
                                            htmlFor='license_number'
                                            className='text-gray-600 capitalize text-sm'>
                                            License Number/ Reference Number
                                            <span className='text-medium leading-12 font-semibold'>{' '}*</span>
                                        </label>
                                        <input
                                            required
                                            type='number'
                                            name='license_number'
                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                        />
                                    </div>

                                    {/* Cancel & Regulate */}
                                    <div className='flex justify-between items-center w-full'>
                                        <button type='submit' className='rounded bg-blue-600 p-2 text-white flex text-md font-semibold '
                                            // onClick={() => {router.push('admin_offices')}}
                                        >
											<span className='text-medium font-semibold text-white'>
												Regulate
											</span>
                                        </button>
                                        <button className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
                                            <ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
                                            <span className='text-medium font-semibold text-black ' onClick={() => {router.push('facilities')}}>
																	Cancel
																</span>
                                        </button>
                                    </div>
                                </form>
                            

                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}


RegulateFacility.getInitialProps = async (ctx) => {

    const allOptions = []

    const options = [
        'regulation_status',

    ]
    if (ctx.query.q) {
        const query = ctx.query.q;
        if (typeof window !== "undefined" && query.length > 2) {
            window.location.href = `/facilities?q=${query}`;
        } else {
            if (ctx.res) {
                ctx.res.writeHead(301, {
                    Location: "/facilities?q=" + query,
                });
                ctx.res.end();
                return {};
            }
        }
    }

    return checkToken(ctx.req, ctx.res)
        .then((t) => {
            if (t.error) {
                throw new Error("Error checking token");
            } else {
                let token = t.token;
                let _data;
                let url =
                    `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${ctx.query.id}/`
              
                return fetch(url, {
                    headers: {
                        Authorization: "Bearer " + token,
                        Accept: "application/json",
                    },
                })
                    .then((r) => r.json())
                    .then(async (json) => {
                        allOptions.push({
                            data: json,
                        })

                        for(let i = 0; i < options.length; i++) {
                            const option = options[i]
                            switch(option) {
                                case 'regulation_status':
                                    url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&page=1`;


                                    try{

                                        const _data = await fetch(url, {
                                            headers: {
                                                Authorization: 'Bearer ' + token,
                                                Accept: 'application/json',
                                            },
                                        })

                                        allOptions.push({regulation_status: (await _data.json()).results.map(({id, name}) => ({value:id, label:name}))})

                                    }
                                    catch(err) {
                                        console.log(`Error fetching ${option}: `, err);
                                        allOptions.push({
                                            error: true,
                                            err: err,
                                            regulation_status: [],
                                        })
                                    }
                                    break;
                                default:

                                    break;

                            }
                        }

                        return allOptions;
                    })
                    .catch((err) => {
                        console.log("Error fetching facilities: ", err);
                        return {
                            error: true,
                            err: err,
                            data: [],
                        };
                    });
            }
        })
        .catch((err) => {
            console.log("Error checking token: ", err);
            if (typeof window !== "undefined" && window) {
                if (ctx?.asPath) {
                    window.location.href = ctx?.asPath;
                } else {
                    window.location.href = "/facilities";
                }
            }
            setTimeout(() => {
                return {
                    error: true,
                    err: err,
                    data: [],
                };
            }, 1000);
        });
};

export default RegulateFacility
