
import React, { useState, useEffect } from 'react'
import MainLayout from '../../../components/MainLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import FacilitySideMenu from '../../../components/FacilitySideMenu'
import { checkToken } from "../../../controllers/auth/auth"
import { Formik, Form, Field } from 'formik'
import Select from 'react-select'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useAlert } from 'react-alert'
import { handleFacilityUpgrades } from '../../../controllers/facility/facilityHandlers'
import { UserContext } from '../../../providers/user'
import Spinner from '../../../components/Spinner'
import { Alert } from '@mui/lab'



function UpgradeFacility(props) {


    const userCtx = React.useContext(UserContext)
    const [user, setUser] = useState(userCtx)

    const alert = useAlert()
    const router = useRouter()

    const [khisSynched, setKhisSynched] = useState(false);
    const [facilityFeedBack, setFacilityFeedBack] = useState([])
    const [pathId, setPathId] = useState('')
    const [allFctsSelected, setAllFctsSelected] = useState(false);
    const [title, setTitle] = useState('');
    const [isFacilityServices, setIsFacilityServices] = useState(false);
    const [formError, setFormError] = useState(null)

    const filters = []


    // console.log( props['2']?.facilityData )
    const facilityServices = props['services']

    const {
        id: facility_id,
        keph_level_name,
        facility_type_name,
        official_name,
        code
    } = props['facilityData'] ?? {
        id: null,
        keph_level_name: null,
        facility_type_name: null,
        official_name: null,
        code: null
    }

    const formFields = {
        facility: "",
        facility_type: "",
        keph_level: "",
        reason: ""

    }

    const facilityUpgradeData = {
        facility: facility_id,
        previous_facility_type: facility_type_name,
        previous_keph: keph_level_name,
        reason: ""
    }



    const formValues = props['facilityData'] ? facilityUpgradeData : formFields;


    const [isClient, setIsClient] = useState(false)
    const [submitting, setSubmitting] = useState(false)


    function handleSubmit (event) {

        setSubmitting(true)

        event.preventDefault()

        const formData = new FormData(event.target)

        const formDataObject = Object.fromEntries(formData)

        const payload = {
            facility: facility_id,
            reason: formDataObject?.reason_upgrade,
            facility_type: formDataObject?.facility_type,
            keph_level: formDataObject?.keph_level
        }


        handleFacilityUpgrades(payload, props?.token)
            .then(resp => {
                if (resp.status == 201) {

                    setSubmitting(false)

                    alert.success('Facility Upgraded/Downgrade Succesfully', {
                        timeout: 10000
                    })

                    router.push(`/facilities/${facility_id}`)
                } else {
                    setSubmitting(false)

                    resp.json()
                        .then(resp => {
                            const formResponse = []
                            setFormError(() => {
                                if (typeof resp == 'object') {
                                    const respEntry = Object.entries(resp)

                                    for (let [_, v] of respEntry) {
                                        formResponse.push(v)
                                    }

                                    return `Error: ${formResponse.join(" ")}`
                                }
                            })
                        })

                    alert.error('unable to upgrade facility', {
                        timeout: 10000
                    })
                }
            })
    }

    useEffect(() => {
        setUser(userCtx);
        if (user.id === 6) {
            router.push('/auth/login')
        }

        setIsClient(true)
    }, [])


    if (isClient) {

        // return (
        //     <pre>
        //         {
        //             JSON.stringify(props, null, 2)
        //         }
        //     </pre>
        // )
        return (
            <>
                <Head>
                    <title>KMHFR | Upgrade Facility</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                    <div className="w-full md:w-[85%] md:mx-auto grid md:grid-cols-7 gap-4 px-1 bg-transparent md:px-4 py-2 my-1">
                        {/* Header */}

                        <div className="md:col-span-7 flex flex-col gap-3 md:gap-5 bg-transparent">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base">
                                <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                    <Link className="text-gray-700 cursor-pointer" href='/'>Home</Link>{'/'}
                                    <Link className="text-gray-700 cursor-pointer" href='/facilities'>Facilities</Link> {'/'}
                                    <span className="text-gray-500">Upgrade</span>
                                </div>
                            </div>
                            <div className={"col-span-5 gap-2 flex-col  justify-between p-6 w-full bg-transparent border border-gray-600 drop-shadow  text-black  md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-gray-600" : "border-red-600")}>
                                {/* <div className="col-span-6 md:col-span-3"> */}
                                <h2 className='flex items-center ml-1 text-xl font-bold text-black capitalize '>
                                    Upgrade Facility
                                </h2>
                                <span onClick={() => router.push(`/facilities/${facility_id}`)} className="text-4xl tracking-tight hover:text-gray-600 font-bold cursor-pointer leading-tight">{official_name}</span>
                                <div className="flex items-center w-full justify-between">
                                    <span
                                        className={
                                            "font-bold text-2xl " +
                                            (code ? "text-gray-900" : "text-gray-400")
                                        }
                                    >
                                        #{code ?? "NO_CODE"}

                                    </span>

                                </div>
                                {/* </div> */}
                            </div>


                        </div>

                        {/* Facility Side Menu Filters */}
                        <div className="md:col-span-1 md:mt-1">
                            <FacilitySideMenu
                                filters={filters}
                                states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
                                stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
                        </div>

                        {/* Facility Upgrade View */}
                        <div className='md:col-span-6 flex flex-col items-center gap-2'>
                            {/* Upgrade Form */}
                          
                            <form 
                            onSubmit={handleSubmit}
                            className='md:col-span-5 flex flex-col bg-gray-50 rounded shadow-md p-3 w-full justify-start items-start gap-2 md:mt-1'>

                                {
                                    formError && <Alert severity='error' className='w-full my-4'>{formError}</Alert>

                                }
                                {/* Previous KEPH Level */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='collection_date'
                                        className='text-gray-600 capitalize text-sm'>
                                        Current KEPH Level
                                        <span className='text-medium leading-12 font-semibold'>
                                            {' '}
                                        </span>
                                    </label>
                                    <input
                                        type='text'
                                        name='previous_keph'
                                        disabled={true}
                                        defaultValue={formValues?.previous_keph}
                                        className='rounded flex-none w-full bg-transparent border-gray-600 p-2 flex-grow border placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* New KEPH level */}
                                <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                    <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">Update to KEPH Level</label>
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
                                        options={props?.kephOptions}
                                        placeholder="Select a KEPH Level.."
                                        defaultValue={formValues?.previous_keph}
                                        name="keph_level"
                                        className='flex-none w-full flex-grow placeholder-gray-500 border border-gray-600 outline-none' />
                                </div>



                                {/* Previous Facility Type */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='collection_date'
                                        className='text-gray-600 capitalize text-sm'>
                                        Current Facility Type
                                        <span className='text-medium leading-12 font-semibold'>
                                            {' '}
                                        </span>
                                    </label>
                                    <input
                                        type='text'
                                        name='previous_facility_type'
                                        disabled={true}
                                        defaultValue={formValues?.previous_facility_type}
                                        className='rounded flex-none w-full bg-transparent border-gray-600 p-2 flex-grow border placeholder-gray-500 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* New Facility Type */}
                                <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                    <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Update to Facility Type {" *"}</label>
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
                                        options={props?.facilityTypes}
                                        required
                                        placeholder="Select a facility type..."
                                        name="facility_type"
                                        className="flex-none w-full bg-transparent border border-gray-600 flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none rounded" />
                                </div>



                                {/* Reason for Upgrade */}
                                <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                    <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Reason for Upgrade {" *"}</label>
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
                                        options={props?.levelChangeReasons}
                                        required
                                        placeholder="Select a reason"
                                        name="reason_upgrade"
                                        className="flex-none w-full bg-transparent border border-gray-600 flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none rounded" />

                                </div>

                                {/* View Facility Services Button */}
                                <button
                                    className="bg-blue-600 font-semibold w-auto text-white flex text-left items-center p-2 h-auto -md"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (isFacilityServices) {
                                            setIsFacilityServices(false);
                                        } else {
                                            setIsFacilityServices(true);
                                        }
                                    }}
                                >
                                    {isFacilityServices ? 'Show' : 'Hide'} Facility Services
                                    {isFacilityServices ? (
                                        <ChevronRightIcon className="text-white h-7 w-7 font-bold" />
                                    ) : (
                                        <ChevronDownIcon className="text-white h-7 w-7 text-base font-bold" />
                                    )}
                                </button>

                                {/* Facility Services Table */}
                                {
                                    !isFacilityServices &&

                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <p className='text-base font-semibold'>Name</p>
                                                </TableCell>
                                                <TableCell className='text-xl font-semibold'>
                                                    <p className='text-base font-semibold'>Service Option</p>
                                                </TableCell>
                                            </TableRow>
                                            {
                                                facilityServices?.map(({ service_name }, id) => (
                                                    <TableRow key={id}>
                                                        <TableCell>
                                                            {service_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            Yes
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }

                                        </TableBody>
                                    </Table>


                                }

                                {/* Facility Upgrade Button */}

                                <div className='flex items-center justify-end w-full'>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 rounded mt-3 font-semibold w-auto text-white flex text-left items-center p-2 h-auto -md">



                                        <span className='text-medium font-semibold text-white'>
                                            {
                                                submitting ?
                                                    <Spinner />
                                                    :
                                                    '  Upgrade/Downgrade'

                                            }
                                        </span>
                                        {
                                            submitting &&
                                            <span className='text-white'>Upgrading.. </span>
                                        }
                                    </button>
                                </div>


                            </form>
                                




                        </div>


                    </div>
                </MainLayout>
            </>
        )
    }
    else {
        return null;
    }
}

export async function getServerSideProps(ctx) {

    const allOptions = {}

    const token = (await checkToken(ctx.req, ctx.res))?.token


    const options = [
        'keph',
        'facility_services',
        'facilities',
        'facility_types',
        'level_change_reasons'
    ]

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


    for (let i = 0; i < options.length; i++) {
        const option = options[i]

        switch (option) {

            case 'keph':

                try {

                    const _data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allOptions["kephOptions"] = (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name }))

                }
                catch (err) {
                    console.log(`Error fetching ${option}: `, err);

                }

                break;

            case 'facility_services':
                try {

                    const _data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_services/?facility=${ctx.query.id}`, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        }
                    })

                    allOptions["services"] = (await _data.json()).results.map(({ id, service_name, service, facility }) => ({ id, service_name, service, facility }))

                }
                catch (err) {
                    console.error(`Error fetching ${option}: `, err);

                }


                break;

            case 'facilities':


                try {

                    const _data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${ctx.query.id}/`, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        }
                    })

                    allOptions["facilityData"] = await _data.json()

                }
                catch (err) {
                    console.log(`Error fetching ${option}: `, err);

                }

                break;

            case 'facility_types':

                try {

                    const _data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types/`, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })


                    const results = (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name }))


                    allOptions["facilityTypes"] = results

                }
                catch (err) {
                    console.log(`Error fetching ${option}: `, err);

                }
                break;

            case 'level_change_reasons':


                try {

                    const _data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/`, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })


                    const results = (await _data.json()).results.map(({ id, reason }) => ({ value: id, label: reason }))


                    allOptions["levelChangeReasons"] = results

                }
                catch (err) {
                    console.log(`Error fetching ${option}: `, err);

                }
                break;

        }
    }

    allOptions['token'] = token

    return {
        props: {
            ...allOptions
        }
    }



}

export default UpgradeFacility