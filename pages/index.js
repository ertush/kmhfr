import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../components/MainLayout'
import { DotsHorizontalIcon, PencilIcon } from '@heroicons/react/solid'
import { checkToken } from '../controllers/auth/auth'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = (props) => {
    const router = useRouter()
    // console.log(props)
    let facilities = props?.data?.results
    let filters = props?.filters
    let [drillDown, setDrillDown] = useState({})
    const updateFt = nu_vl => {
        // console.log('updading Filters: ', nu_vl)
        let srch_trm = nu_vl[Object.keys(nu_vl)[0]]
        let new_dd = { ...drillDown, ...nu_vl }
        if (srch_trm != null && srch_trm != undefined && srch_trm != "" && srch_trm && srch_trm.length > 0) {
            // setDrillDown(new_dd)
        } else {
            new_dd = { ...drillDown }
            delete new_dd[Object.keys(nu_vl)[0]]

        }
        setDrillDown(new_dd)
    }


    return (
        <div className="">
            <Head>
                <title>KMHFL</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-2 gap-6 px-1 md:px-4 p-4 my-4 max-w-screen-lg mx-auto">
                    <div className="col-span-2 p-2 md:p-4 flex flex-col gap-4 items-center justify-center">
                        <h3 className="text-3xl font-medium text-black">Welcome to KMHFL</h3>
                        <p className="font-normal text-lg text-gray-900 text-left">
                            Kenya Master Health Facility List (KMHFL) is an application with all health facilities and community units in Kenya. Each health facility and community unit is identified with unique code and their details describing the geographical location, administrative location, ownership, type and the services offered.
                        </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow-sm group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                        <Link href="/facilities">
                            <a className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">Facilities</a>
                        </Link>
                        <p className="text-base">
                            This provides a list of all health facilities and there is a provided advanced search where you can refine your search.
                        </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow-sm group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                        <Link href="/community-units">
                            <a className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">Community Units</a>
                        </Link>
                        <p className="text-base">
                            This provides a list of all community health units and the system provided advance search where you can refine your search by using administrative units.
                        </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow-sm group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                        <Link href="/gis">
                            <a className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">GIS Explorer</a>
                        </Link>
                        <p className="text-base">
                            This visualizes administrative units (counties, constituencies, wards) and their facilities and Community Health Units. Users can also rate Facilities and Community Health Units.
                        </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow-sm group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                        <Link href="/reports">
                            <a className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">Reports</a>
                        </Link>
                        <p className="text-base">
                            A collection of reports on facilities and community health units in Kenya. You can view and export data from KMHFL in the reports section.
                        </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow-sm group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                        <a href="https://mfl-api-docs.readthedocs.io/en/latest/" className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">KMHFL API</a>
                        <p className="text-base">
                            This provides a RESTful API for developers to use. The documentation is available at <br /> <a className="text-blue-800 hover:underline focus:underline active:underline" href="https://mfl-api-docs.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://mfl-api-docs.readthedocs.io/en/latest</a>
                        </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow-sm group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                        <a className="font-semibold text-left text-xl w-full text-blue-800 hover:text-black focus:text-black active:text-black" href="https://elearning.health.go.ke" target="_blank" rel="noopener noreferrer">MoH Virtual Academy</a>
                        <p className="text-base">
                            You can learn all about KMHFL, its implementation and how to use it here (<a className="text-blue-800 hover:underline focus:underline active:underline" target="_blank" rel="noopener noreferrer" href="https://elearning.health.go.ke">https://elearning.health.go.ke</a>). Enrol and start learning.
                        </p>
                    </div>
                </div>
            </MainLayout>
        </div>
    )
}

export default Home