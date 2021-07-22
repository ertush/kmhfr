import Head from 'next/head'
import * as Tabs from '@radix-ui/react-tabs';
import { checkToken } from '../../controllers/auth/auth'
import MainLayout from '../../components/MainLayout'
import { CheckCircleIcon, InformationCircleIcon, LocationMarkerIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid'
import { ArrowsExpandIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'

const Facility = (props) => {
    const Map = dynamic(
        () => import('../../components/Map'), // replace '@components/map' with your component's location
        {
            loading: () => <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
            ssr: false
        } // This line is important. It's what prevents server-side render
    )
    let facility = props.data
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
                                <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                                    {(facility.operational || facility.operation_status_name) ? <span className={"leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default"}>
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Operational
                                    </span> : ""}
                                    {facility.is_approved ? <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Approved
                                    </span> : <span className="bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                        <XCircleIcon className="h-4 w-4" />
                                        Not approved
                                    </span>}
                                    {facility.has_edits && <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                        <InformationCircleIcon className="h-4 w-4" />
                                        Has changes
                                    </span>}
                                    {facility.is_complete && <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Complete
                                    </span>}
                                    {facility.closed && <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                        <LockClosedIcon className="h-4 w-4" />
                                        Closed
                                    </span>}
                                </div>
                            </div>
                            <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">
                                <a href={'/facility/edit' + facility.id} className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black-700 active:bg-black-700 font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center">
                                    Edit
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 md:col-span-3 flex flex-col gap-3 mt-4">
                        <Tabs.Root orientation="horizontal" className="w-full flex flex-col tab-root" defaultValue="overview">
                            <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                <Tabs.Tab value="overview" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Overview
                                </Tabs.Tab>
                                <Tabs.Tab value="services" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Services
                                </Tabs.Tab>
                                <Tabs.Tab value="community_units" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Facility Units
                                </Tabs.Tab>
                                <Tabs.Tab value="infrastructure" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    Infrastructure
                                </Tabs.Tab>
                                <Tabs.Tab value="hr_staffing" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                    HR &amp; Staffing
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="overview" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded grid grid-cols-2 gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">Status:</h3>
                                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                            <label className=" text-gray-600">Facility closed</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.closed ?
                                                    <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                                                        Closed {facility.closed_date || ""}
                                                    </span> : <span className="bg-green-200 text-green-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                        Not closed
                                                    </span>}
                                            </p>
                                        </div>
                                        {facility.closed &&
                                            <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                                <label className=" text-gray-600">Facility closure reason</label>
                                                <p className="text-black font-medium text-base">{facility.closed_date && <>{facility.closed_date}. </>} {facility.closing_reason || ""}</p>
                                            </div>}
                                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                                            <label className=" text-gray-600">KHIS reporting</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.reporting_in_dhis ?
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
                                            <label className=" text-gray-600">NHIF accreditation</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.nhif_accreditation ?
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
                                            <label className=" text-gray-600">Open 24 hours</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.open_normal_day ?
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
                                            <label className=" text-gray-600">Open weekends</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.open_weekends ?
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
                                            <label className=" text-gray-600">Open late night</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.open_late_night ?
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
                                            <label className=" text-gray-600">Facility classified</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.is_classified ?
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
                                            <label className=" text-gray-600">Published</label>
                                            <p className="text-black font-medium text-base flex">
                                                {facility.is_published ?
                                                    <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        Yes
                                                    </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                        <XCircleIcon className="h-4 w-4" />
                                                        No
                                                    </span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">Regulation:</h3>
                                        {facility.date_established && <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Established</label>
                                            <p className="col-span-2 text-black font-medium text-base">{new Date(facility.date_established).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) || " - "}</p>
                                        </div>}
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Regulated</label>
                                            <p className="col-span-2 text-black font-medium text-base flex">
                                                {facility.regulated ?
                                                    <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        Yes
                                                    </span> : <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                                        <XCircleIcon className="h-4 w-4" />
                                                        No
                                                    </span>}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Regulation status</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.regulatory_status_name || " - "}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Regulating body</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.regulatory_body_name || " - "}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Registration number</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.registration_number || " - "}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">License number</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.license_number || " - "}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">Ownership:</h3>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Category</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.owner_type_name || " - "}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Owner</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.owner_name || " - "}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">Location:</h3>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Town</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.town_name || " - "}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Description</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.location_desc || " - "}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Nearest landmark</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.nearest_landmark || " - "}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Plot number</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.plot_number || " - "}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">Contacts:</h3>
                                        {(facility.facility_contacts && facility.facility_contacts.length > 0) && facility.facility_contacts.map(contact => (
                                            <div key={contact.contact_id} className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                <label className="col-span-1 text-gray-600 capitalize">{contact.contact_type_name[0].toLocaleUpperCase() + contact.contact_type_name.slice(1).toLocaleLowerCase() || "Contact"}</label>
                                                <p className="col-span-2 text-black font-medium text-base">{contact.contact || " - "}</p>
                                            </div>
                                        ))}
                                        {facility.officer_in_charge && <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600 capitalize">{facility.officer_in_charge.title_name || "Officer in charge"}</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.officer_in_charge.name || " - "}</p>
                                        </div>}
                                        {facility.officer_in_charge && (facility.officer_in_charge.contacts.length > 0) && facility.officer_in_charge.contacts.map(contact => (
                                            <div key={contact.contact_id} className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                                <label className="col-span-1 text-gray-600 capitalize">In charge {contact.contact_type_name[0].toLocaleUpperCase() + contact.contact_type_name.slice(1).toLocaleLowerCase() || "Contact"}</label>
                                                <p className="col-span-2 text-black font-medium text-base">{contact.contact || " - "}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <details className="bg-gray-100 w-full py-2 px-4 text-gray-400 cursor-default rounded">
                                        <summary>All data</summary>
                                        <pre className="language-json leading-normal text-sm whitespace-pre-wrap text-gray-800 overflow-y-auto normal-case" style={{ maxHeight: '70vh' }}>
                                            {JSON.stringify({ ...facility }, null, 2).split('{').join('\n').split('"').join('').split(',').join('\n').split('_').join(' ')}
                                        </pre>
                                    </details>
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="services" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Services</span>
                                            <a href="/" className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit services</a>
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
                            <Tabs.Panel value="community_units" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                    <div className="bg-white w-full p-4 rounded">
                                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                            <span className="font-semibold">Facility units</span>
                                            <a href="/" className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit facility units</a>
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
                            <Tabs.Panel value="infrastructure" className="grow-1 py-1 px-4 tab-panel">
                                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left px-1 py-4">
                                    <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                                        <span className="font-semibold">Infrastructure</span>
                                        <a href="/" className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit infrastructure</a>
                                    </h3>
                                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">Bed capacity:</h3>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Beds</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.number_of_beds}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Cots</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.number_of_cots}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Emergency casualty beds</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.number_of_emergency_casualty_beds}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">ICU beds</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.number_of_icu_beds}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">HDU beds</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.number_of_hdu_beds}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">General theatres</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.number_of_general_theatres}</p>
                                        </div>
                                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                                            <label className="col-span-1 text-gray-600">Maternity theatres</label>
                                            <p className="col-span-2 text-black font-medium text-base">{facility.number_of_maternity_theatres}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white w-full p-4 rounded">
                                        <ul>
                                            {(facility?.infrastructure && facility?.infrastructure.length > 0) ? facility?.infrastructure.map(infra => (
                                                <li key={infra.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{infra.infra_name}</p>
                                                        <small className="text-xs text-gray-500">{infra.id || ''}</small>
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                        <label className="text-sm text-gray-600">Active</label>
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
                                            <a href="/" className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit HR</a>
                                        </h3>
                                        <ul>
                                            {(facility?.human_resource && facility?.human_resource.length > 0) ? facility?.human_resource.map(hr => (
                                                <li key={hr.id} className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300">
                                                    <div>
                                                        <p className="text-gray-800 text-base">{hr.hr_name}</p>
                                                        <small className="text-xs text-gray-500">{hr.id || ''}</small>
                                                    </div>
                                                    <div className="flex flex-row gap-1 items-center">
                                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                        <label className="text-sm text-gray-600">Active</label>
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

Facility.getInitialProps = async (ctx) => {
    console.log(ctx.req)
    return checkToken(ctx.req, ctx.res).then(t => {
        let token = t.token
        let url = process.env.API_URL+'/facilities/facilities/' + ctx.query.id + '/'
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
    }).catch(err => {
        console.log('Error checking token: ', err)
        return {
            error: true,
            err: err,
            data: [],
        }
    })
}

export default Facility