import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import MainLayout from '../../components/MainLayout'
import { LocationMarkerIcon } from '@heroicons/react/solid'
import { ArrowsExpandIcon } from '@heroicons/react/outline'

const Facility = ({ facility }) => {
    return (
        <div className="">
            <Head>
                <title>KMHFL - {facility.official_name}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout>
                <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
                    <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-3">
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                            <a className="text-green-700" href="/">Home</a> >
                            <a className="text-green-700" href="/">Facilities</a> >
                            <span>{facility.official_name}</span>
                        </div>
                        <div className="col-span-5 flex flex-row items-center justify-between gap-3 md:gap-8 py-2 w-full">
                            <div>
                                <h1 className="text-4xl tracking-tight font-bold leading-tight">{facility.official_name}</h1>
                                <div className="flex gap-2 items-center w-full justify-between">
                                    <span className="text-green-800 font-bold text-2xl">#{facility.code}</span>
                                    <p className="text-gray-700 leading-tight">{facility.owner_name}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center justify-end">
                                <div className="flex flex-wrap gap-3">
                                    {facility.is_approved ? <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap">Approved</span> : <span className="bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap">Not approved</span>}
                                    {facility.has_edits && <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm rounded whitespace-nowrap">Has changes</span>}
                                    {facility.is_complete && <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap">Complete</span>}
                                </div>
                            </div>
                            <a href={'/facility/edit' + facility.id} className="bg-white border-2 border-green-700 text-green-800 hover:bg-green-700 focus:bg-green-700 active:bg-green-700 font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white">
                                Edit
                            </a>
                        </div>
                    </div>
                    <div className="col-span-5 md:col-span-3 flex flex-col gap-3 mt-4">
                        <Tabs.Root orientation="horizontal" className="w-full flex flex-col tab-root" defaultValue="overview">
                            <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercasez leading-none tab-list font-semibold border-b">
                                <Tabs.Tab value="overview" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-700 text-lg hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Overview
                                </Tabs.Tab>
                                <Tabs.Tab value="services" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-700 text-lg hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Services
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-700 text-lg hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Facility Units
                                </Tabs.Tab>
                                <Tabs.Tab value="infrastructure" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-700 text-lg hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Infrastructure
                                </Tabs.Tab>
                                <Tabs.Tab value="hr_staffing" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-700 text-lg hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    HR &amp; Staffing
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="overview" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-gray-100 w-full p-4 rounded">
                                        <pre className="language-json leading-normal text-sm whitespace-pre-wrap text-gray-800 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                                            {JSON.stringify({ ...facility, facility_services: [] }, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="services" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl">Services</h3>
                                        <ul>
                                            {(facility?.facility_services && facility?.facility_services.length > 0) ? facility?.facility_services.map(service => (
                                                <li key={service.service_id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{service.service_name}</p>
                                                        <small className="text-xs text-gray-500">{service.category_name || ''}</small>
                                                    </div>
                                                    <label className="text-sm text-gray-600 flex gap-1 items-center">
                                                        <input type="checkbox" name={service.service_id + "_active"} />
                                                        <span>Active</span>
                                                    </label>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                    <p>No services listed for this facility.</p>
                                                    <a href="/" className="text-blue-700 hover:underline focus:underline active:underline">Edit services</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="community_units" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl">Facility units</h3>
                                        <ul>
                                            {(facility?.facility_units && facility?.facility_units.length > 0) ? facility?.facility_units.map(unit => (
                                                <li key={unit.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{unit.unit_name}</p>
                                                        <small className="text-xs text-gray-500">{unit.regulating_body_name || ''}</small>
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <input type="checkbox" name={unit.id + "_active"} />
                                                        <label className="text-sm text-gray-600">Active</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                    <p>No units in this facility.</p>
                                                    <a href="/" className="text-blue-700 hover:underline focus:underline active:underline">Edit units</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="infrastructure" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl">Infrastructure</h3>
                                        <ul>
                                            {(facility?.infrastructure && facility?.infrastructure.length > 0) ? facility?.infrastructure.map(infra => (
                                                <li key={infra.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{infra.infra_name}</p>
                                                        <small className="text-xs text-gray-500">{infra.regulating_body_name || ''}</small>
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <input type="checkbox" name={infra.id + "_active"} />
                                                        <label className="text-sm text-gray-600">Active</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                    <p>No infrastructure data listed for this facility.</p>
                                                    <a href="/" className="text-blue-700 hover:underline focus:underline active:underline">Edit infrastructure</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="hr_staffing" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl">Human Resource</h3>
                                        <ul>
                                            {(facility?.human_resource && facility?.human_resource.length > 0) ? facility?.human_resource.map(infra => (
                                                <li key={infra.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{infra.infra_name}</p>
                                                        <small className="text-xs text-gray-500">{infra.regulating_body_name || ''}</small>
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <input type="checkbox" name={infra.id + "_active"} />
                                                        <label className="text-sm text-gray-600">Active</label>
                                                    </div>
                                                </li>
                                            )) : (
                                                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                    <p>No HR data listed for this facility.</p>
                                                    <a href="/" className="text-blue-700 hover:underline focus:underline active:underline">Edit HR</a>
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
                        <div className="w-full h-96 bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                            <span className="absolute top-2 right-2 cursor-pointer">
                                <ArrowsExpandIcon className="h-5 w-5 text-gray-500" />
                            </span>
                            <div>
                                <LocationMarkerIcon className="h-28 text-gray-400" />
                                <span className="text-xs">{JSON.stringify(facility?.lat_long, null, 1)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                            <h4 className="text-2xl text-gray-800">Recent activity</h4>
                            <ol className="list-decimal list-inside flex flex-row gap-3">
                                <li className="bg-blue-50 w-full rounded-sm p-2">
                                    {facility?.latest_approval_or_rejection?.comment && <p>{facility?.latest_approval_or_rejection?.comment}</p>}
                                    <small className="text-gray-500">{facility?.latest_approval_or_rejection?.id}</small>
                                </li>
                            </ol>
                        </div>
                    </aside>
                </div>
            </MainLayout>
        </div>
    )
}

Facility.getInitialProps = async (ctx) => {
    let fcl = await fetch('http://api.kmhfltest.health.go.ke/api/facilities/facilities/' + ctx.query.id + '/', {
        headers: {
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
            'Accept': 'application/json'
        }
    })
    let facility = await fcl.json()

    return {
        facility
    }
}

export default Facility