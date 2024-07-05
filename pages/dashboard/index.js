import Head from 'next/head'
import MainLayout from '../../components/MainLayout'
import { checkToken } from '../../controllers/auth/auth'
import React, { useState, useEffect, useRef, useContext, memo } from 'react'
import { useRouter } from 'next/router'
import Chart from '../../components/Chart'
import Select from 'react-select'
// import { Select as CustomSelect } from '../../components/Forms/formComponents/Select'
import { UserContext } from '../../providers/user'
import 'react-datepicker/dist/react-datepicker.css';
import propTypes from 'prop-types'
import dynamic from 'next/dynamic'


const Map = memo(dynamic(
    () => import('../../components/DashboardMap'),
    {
        loading: () => (
          <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">
            Loading&hellip;
          </div>
        ),
        ssr: false, // This line is important. It's what prevents server-side render
    }
))


function Dashboard(props) {

    const router = useRouter()

    const userCtx = useContext(UserContext)

    const filters = props?.filters


    //create period items 
    const Years = [
        {
            value: (new Date().getFullYear()).toString() + '-01-01',
            label: (new Date().getFullYear()).toString()
        },
        {
            value: (new Date().getFullYear() - 1).toString() + '-01-01',
            label: (new Date().getFullYear() - 1).toString()
        },
        {
            value: (new Date().getFullYear() - 2).toString() + '-01-01',
            label: (new Date().getFullYear() - 2).toString()
        },
        {
            value: (new Date().getFullYear() - 3).toString() + '-01-01',
            label: (new Date().getFullYear() - 3).toString()
        },
        {
            value: (new Date().getFullYear() - 4).toString() + '-01-01',
            label: (new Date().getFullYear() - 4).toString()
        },
        {
            value: 'custom',
            label: 'Custom Range'
        }
    ]

    const recencyOptions = [
        {
            label: 'Last 1 month',
            value: 1,
        },
        {
            label: 'Last 2 months',
            value: 2,
        },
        {
            label: 'Last 3 months',
            value: 3,
        },
        {
            label: 'Last 4 months',
            value: 4,
        },
        {
            label: 'Last 5 months',
            value: 5,
        },

        {
            label: 'Last 6 months',
            value: 6,
        },

        {
            label: 'Last 7 months',
            value: 7,
        }
    ]


    const recencyRef = useRef(null)

    const [isOpen, setIsOpen] = useState(false);
    const [drillDown, setDrillDown] = useState({})
    const [subCounties, setSubCounties] = useState([])
    const [_, setCounties] = useState([])
    const [wards, setWards] = useState([])
    const [isClient, setIsClient] = useState(false);

    const [ownerPresentationType, setOwnerPresentationType] = useState('pie')
    const [facilityTypePresentationType, setFacilityTypePresentationType] = useState('bar')
    const [summaryPresentationType, setSummaryPresentationType] = useState('bar')
    const [chuSummaryPresentationType, setCHUSummaryPresentationType] = useState('column')
    const [recentChangesPresentationType, setRecentChangesPresentationType] = useState('table')
    const [facilityKephPresentationType, setFacilityKephPresentationType] = useState('pie')
    const [facilityCHUsPresentationType, setFacilityCHUsPresentationType] = useState('bar')



    const groupID = userCtx?.groups[0]?.id
    const user = userCtx

    async function fetchCounties() {

        try {
            const r = await fetch(`/api/common/fetch_form_data/?path=counties`)
            setCounties({ county: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch counties: ${err.message}`)
        }
    }

    async function fetchSubCounties(county) {

        try {
            const r = await fetch(`/api/common/fetch_form_data/?path=sub_counties&id=${county}`)
            setSubCounties({ subCounties: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch sub_counties: ${err.message}`)
        }
    }

    async function fetchWards(sub_county) {

        try {
            const r = await fetch(`/api/common/fetch_form_data/?path=wards&id=${sub_county}`)
            setWards({ wards: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch wards: ${err.message}`)
        }
    }




    useEffect(() => {

        let mtd = true
        if (mtd) {

            if (filters && Object.keys(filters).length > 0) {
                Object.keys(filters)?.map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            if (subCounties && Object.keys(subCounties).length > 0) {
                Object.keys(subCounties)?.map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            if (wards && Object.keys(wards).length > 0) {
                Object.keys(wards)?.map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            // if (window) setUser(JSON.parse(window.localStorage.getItem('user')))

        }
        return () => { mtd = false }

    }, [filters, subCounties, wards])


    // Check for user authentication
    useEffect(() => {

        if(user.id === 6){
			router.push('/auth/login')
		}

        setIsClient(true)

        // console.log({ groupID })

        if (groupID == 2) fetchWards(user?.user_sub_counties[0]?.sub_county ?? null)
        if (groupID == 1) fetchSubCounties(props?.filters?.county[0]?.id)
        if (groupID == 7) fetchCounties();


    }, [])



    const totalSummary = [
        { name: 'Total Facilities', count: `${props?.data?.total_facilities || 0}` },
        { name: 'Total approved facilities', count: `${props?.data?.approved_facilities || 0}` },
        { name: 'Total rejected facilities', count: `${props?.data?.rejected_facilities_count || 0}` },
        { name: 'Total closed facilities', count: `${props?.data?.closed_facilities_count || 0}` },
        { name: 'Total facilities pending approval', count: `${props?.data?.pending_updates || 0}` },
        { name: 'Total facilities rejected at validation', count: `${props?.data?.facilities_rejected_at_validation || 0}` },
        { name: 'Total facilities rejected at approval', count: `${props?.data?.facilities_rejected_at_approval || 0}` },

    ]

    const chuSummary = [
        { name: 'Total CHUs', count: `${props?.data?.total_chus || 0}` },
        { name: 'Total CHUs rejected', count: `${props?.data?.rejected_chus || 0}` },
        { name: 'New CHUs pending approval', count: `${props?.data?.recently_created_chus || 0}` },
        { name: 'Updated CHUs pending approval', count: `${props?.data?.chus_pending_approval || 0}` },

    ]

    for (let i = 0; i < props?.data?.cu_summary?.length; i++) {
        chuSummary.push(props?.data?.cu_summary[i]);
    }
    for (let i = 0; i < props?.data?.validations?.length; i++) {
        totalSummary.push(props?.data?.validations[i]);
    }

    // console.log({data: props?.data})
    const recentChanges = [
        { name: 'New facilities added', count: `${props?.data?.recently_created || 0}` },
        { name: 'Facilities updated', count: `${props?.data?.recently_updated || 0}` },
        { name: 'New CHUs added', count: `${props?.data?.recently_created_chus || 0}` },
        { name: 'CHUs updated', count: `${props?.data?.recently_updated_chus || 0}` }
    ]



    function countyOptions(filters, ft) {

        if (groupID === 5 || groupID === 7) {
            let opts = [{ value: "national", label: "National summary" }, ...Array.from(filters[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        } else {
            let opts = [...Array.from(filters[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        }
    }

    function subCountyOptions(filters, ft) {
        if (groupID === 1) {
            let opts = [{ value: "county", label: "County summary" }, ...Array.from(subCounties[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        } else {
            let opts = [...Array.from(subCounties[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        }
    }

    function wardOptions(filters, ft) {

        if (groupID === 2) {
            let opts = [{ value: "Subcounty", label: "Subcounty summary" }, ...Array.from(wards[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        } else {
            let opts = [...Array.from(wards[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        }

    }

    const chartPresentationOptions = [
        {
            label: 'Pie Chart',
            value: 'pie'
        },
        {
            label: 'Bar Chart',
            value: 'bar'
        },
        {
            label: 'Column Chart',
            value: 'column'
        },
        {
            label: 'Line Chart',
            value: 'line'
        },
        {
            label: 'Table',
            value: 'table'
        }
    ]





    function handleYearChange(value) {

        // event.preventDefault()

        const year = value.value //event.target.value
        const county = document.querySelector("#county-filter")
        const subCounty = document.querySelector("#sub-county-filter")
        const ward = document.querySelector("#ward-filter")


        if(recencyRef.current !== null) console.log(recencyRef.current.getValue(), county?.childNodes[3])


        if (value.label.toLowerCase().trim() == "custom range") {
            setIsOpen(true)
            return;
        } else {
            router.push({
                pathname: 'dashboard',
                query: {
                    year: year,
                    ...(() => {
                        let result = {}
                        const recencyPeriod = recencyRef.current?.getValue().length == 1 ? recencyRef.current?.getValue()[0]?.value : null

                        if (county?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                county: county?.childNodes[3]?.value
                            }
                        }

                        if (recencyPeriod) {

                            result = {
                                ...result,
                                recency_period: recencyPeriod 
                            }
                        }

                        if (subCounty?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                sub_county: subCounty?.childNodes[3]?.value
                            }
                        }

                        if (ward?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                ward: ward?.childNodes[3]?.value
                            }
                        }

                        return result

                    })()
                }
            })
        }

    }

    function handleRecencyChange({ value }) {

        const year = document.querySelector("#year-filter")
        const county = document.querySelector("#county-filter")
        const subCounty = document.querySelector("#sub-county-filter")
        const ward = document.querySelector("#ward-filter")

        console.log({ value })
        router.push({
            pathname: '/dashboard',
            query: {
                recency_period: value,
                ...(() => {
                    let result = {}
                    if (year?.childNodes[3]?.value) {
                        result = {
                            ...result,
                            year: year?.childNodes[3]?.value
                        }
                    }

                    if (county?.childNodes[3]?.value) {
                        result = {
                            ...result,
                            county: county?.childNodes[3]?.value
                        }
                    }

                    if (subCounty?.childNodes[3]?.value) {
                        result = {
                            ...result,
                            sub_county: subCounty?.childNodes[3]?.value
                        }
                    }

                    if (ward?.childNodes[3]?.value) {
                        result = {
                            ...result,
                            ward: ward?.childNodes[3]?.value
                        }
                    }


                    return result

                })()
            }
        })
    }



    function handleCountyOrgUnitChange(value) {

        const year = document.querySelector("#year-filter")
        const subCounty = document.querySelector("#sub-county-filter")
        const ward = document.querySelector("#ward-filter")


        const orgUnit = value.value //event.target.value


        if (orgUnit) {
            router.push({
                pathname: 'dashboard',
                query: {
                    county: orgUnit,
                    ...(() => {
                        let result = {}
                        const recencyPeriod = recencyRef.current?.getValue().length == 1 ? recencyRef.current?.getValue()[0]?.value : null
                        if (year?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                year: year.childNodes[3]?.value
                            }
                        }

                        if (recencyPeriod) {
                            result = {
                                ...result,
                                recency_period: recencyPeriod
                            }
                        }

                        if (subCounty?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                sub_county: subCounty.childNodes[3]?.value
                            }
                        }

                        if (ward?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                ward: ward.childNodes[3]?.value
                            }
                        }

                        return result

                    })()
                }
            })

        }
    }

    function handleSubCountyOrgUnitChange(value) {

        // event.preventDefault()

        const year = document.querySelector("#year-filter")
        const county = document.querySelector("#county-filter")
        const ward = document.querySelector("#ward-filter")

        const orgUnit = value.value //event.target.value



        if (orgUnit) {
            router.push({
                pathname: 'dashboard',
                query: {
                    sub_county: orgUnit,
                    ...(() => {
                        let result = {}
                        const recencyPeriod = recencyRef.current?.getValue().length == 1 ? recencyRef.current?.getValue()[0]?.value : null
                        if (year?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                year: year.childNodes[3]?.value
                            }
                        }

                        if (recencyPeriod) {
                            result = {
                                ...result,
                                recency_period: recencyPeriod
                            }
                        }


                        if (county?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                county: county?.childNodes[3]?.value
                            }
                        }

                        if (ward?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                ward: ward?.childNodes[3]?.value
                            }
                        }

                        return result

                    })()
                }
            })

        }
    }

    function handleWardOrgUnitChange(value) {

        // event.preventDefault()

        const year = document.querySelector("#year-filter")
        const county = document.querySelector("#county-filter")
        const subCounty = document.querySelector("#sub-county-filter")
        const ward = document.querySelector("#ward-filter")
        const orgUnit = value.value


        if (orgUnit) {
            router.push({
                pathname: 'dashboard',
                query: {
                    ward: orgUnit,
                    ...(() => {
                        let result = {}
                        const recencyPeriod = recencyRef.current?.getValue().length == 1 ? recencyRef.current?.getValue()[0]?.value : null
                        if (ward?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                year: ward?.childNodes[3]?.value
                            }
                        }

                        if (year?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                county: year?.childNodes[3]?.value
                            }
                        }


                        if (recencyPeriod) {
                            result = {
                                ...result,
                                recency_period: recencyPeriod
                            }
                        }


                        if (county?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                county: county?.childNodes[3]?.value
                            }
                        }

                        if (subCounty?.childNodes[3]?.value) {
                            result = {
                                ...result,
                                sub_county: subCounty?.childNodes[3]?.value
                            }
                        }

                        return result

                    })()
                }
            })

        }
    }

    function handlePresentationChange({ value }, chart_type) {
        if (chart_type == 'owner_chart') setOwnerPresentationType(value)
        if (chart_type == 'facility_type_chart') setFacilityTypePresentationType(value)
        if (chart_type == 'facility_summary_chart') setSummaryPresentationType(value)
        if (chart_type == 'chu_summary_chart') setCHUSummaryPresentationType(value)
        if (chart_type == 'recent_changes_chart') setRecentChangesPresentationType(value)
        if (chart_type == 'facility_keph_chart') setFacilityKephPresentationType(value)
        if (chart_type == 'facility_chu_chart') setFacilityCHUsPresentationType(value)

    }

    function defaultPresentation(chart_type) {
        if (chart_type == 'owner_chart') {
            chartPresentationOptions.find(({ value }) => value == ownerPresentationType)
        }
        if (chart_type == 'facility_type_chart') chartPresentationOptions.find(({ value }) => value == facilityTypePresentationType)
        if (chart_type == 'facility_summary_chart') chartPresentationOptions.find(({ value }) => value == summaryPresentationType)
        if (chart_type == 'chu_summary_chart') chartPresentationOptions.find(({ value }) => value == chuSummaryPresentationType)
        if (chart_type == 'recent_changes_chart') chartPresentationOptions.find(({ value }) => value == recentChangesPresentationType)
        if (chart_type == 'facility_keph_chart') chartPresentationOptions.find(({ value }) => value == facilityKephPresentationType)
        if (chart_type == 'facility_chu_chart') chartPresentationOptions.find(({ value }) => value == facilityCHUsPresentationType)
    }

    function getTitle() {

        if (groupID == 5 || groupID == 7) { // National And Super User groups
            return 'National'
        } else if (groupID == 1) { // CHRIO Group
            return `${userCtx?.county_name} County`
        } else if (groupID == 2) { // SCHRIO Group
            return `${userCtx?.sub_county_name} Sub County`
        } else {
            return ''
        }

    }


    if (isClient) {

        return (
            <div className="">
                <Head>
                    <title>KMHFR | Dashboardboard</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>

                    <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-6 gap-3 md:mt-3 md:mb-12 mb-6 px-4 md:px-0">
                        <div className="col-span-6 flex flex-col gap-3 md:gap-5 mb-8 ">
                            {/* Debug */}

                            <div className="no-print flex flex-row gap-2 md:text-base py-3">

                            </div>



                            <div className="flex flex-col w-full md:flex-wrap lg:flex-row xl:flex-row gap-1 text-sm md:text-base items-center justify-between">






                                <div className="w-full flex md:flex-row flex-col gap-4 md:gap-0 justify-between">
                                    {/* <pre>
                                        {
                                            getTitle()
                                        }
                                    </pre> */}


                                    <h1 className="w-full md:w-auto text-4xl tracking-tight font-bold leading-3 flex items-start justify-center gap-x-1 gap-y-2 flex-grow mb-4 md:mb-2 flex-col">
                                        {
                                            getTitle()
                                        }
                                    </h1>




                                    {user &&
                                        <div className="w-auto flex items-center gap-3">

                                            <div className='w-auto flex realtive'>
                                                <Select
                                                    className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                    options={Years}
                                                    placeholder='Select Year'
                                                    name='year'
                                                    id="year-filter"
                                                    onChange={handleYearChange}
                                                />
                                                <span className='absolute inset-y-0 right-0'>x</span>
                                            </div>

                                            {/* County Select */}

                                            {
                                                (groupID == 5 || groupID == 7) &&
                                                props?.filters?.county && props?.filters?.county.length > 0 &&
                                                Object.keys(props?.filters)?.map(ft => (
                                                    <Select
                                                        key={ft}
                                                        className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                        name={ft}
                                                        id={"county-filter"}
                                                        options={countyOptions(filters, ft)}
                                                        placeholder={`Select ${ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}`}
                                                        onChange={handleCountyOrgUnitChange} />
                                                ))}

                                            {/* county user */}

                                            {groupID === 1 &&
                                                <div className="max-w-min">
                                                    {Array.isArray(subCounties?.subCounties) && subCounties?.subCounties.length > 0 &&
                                                        Object.keys(subCounties)?.map(ft => (
                                                            <Select
                                                                key={ft}
                                                                className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                                name={ft}
                                                                id="sub-county-filter"
                                                                options={
                                                                    subCountyOptions(filters, ft)
                                                                }
                                                                placeholder={`Select ${ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(" ").slice(1)}`}
                                                                onChange={handleSubCountyOrgUnitChange} />

                                                        ))}
                                                </div>
                                            }
                                            {/* sub_county user */}

                                            {groupID === 2 &&
                                                <div className="flex">

                                                    {wards && Object.keys(wards).length > 0 &&
                                                        Object.keys(wards)?.map(ft => (
                                                            <Select name={ft}
                                                                className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                                id="ward-filter"
                                                                options={wardOptions(filters, ft)}
                                                                placeholder={`Select ${ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}`}
                                                                onChange={handleWardOrgUnitChange} />

                                                        ))}
                                                </div>
                                            }


                                            <div className="relative">
                                                {/* Modal overlay */}
                                                {isOpen && (
                                                    <div className="fixed z-50 inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                                                        {/* Modal content */}
                                                        <div className="bg-white p-4 -md">
                                                            <h1 className="text-lg font-bold mb-2 ">Select Date Range</h1>

                                                            <div className='grid grid-cols-2 gap-4'>
                                                                <div>
                                                                    <label>Start Date</label>
                                                                    <br />
                                                                    <input id='startdate'
                                                                        type="date"
                                                                        className="border border-gray-400 p-2 -md"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>End Date</label>
                                                                    <br />
                                                                    <input id='enddate'
                                                                        type="date"
                                                                        className="border border-gray-400 p-2 -md"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 flex justify-center">
                                                                <button
                                                                    onClick={() => {
                                                                        setIsOpen(false)
                                                                    }
                                                                    }
                                                                    className="w-full px-4 py-2 bg-gray-400 text-white -md mr-2"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setIsOpen(false)
                                                                        let parameters = "?"
                                                                        if (document.getElementById('startdate').value && document.querySelector('#startdate').value) {
                                                                            parameters += "datefrom=" + document.querySelector('#startdate').value
                                                                            parameters += "&dateto=" + document.querySelector('#enddate').value

                                                                        }
                                                                        else {
                                                                            alert("You must select Start Date and End Date")
                                                                            return;
                                                                        }

                                                                        if (props?.query?.county) {
                                                                            parameters += "&county=" + props?.query?.county
                                                                        }
                                                                        if (props?.query?.sub_county) {
                                                                            parameters += "&sub_county=" + props?.query?.sub_county
                                                                        }
                                                                        if (props?.query?.ward) {
                                                                            parameters += "&ward=" + props?.query?.ward
                                                                        }
                                                                        router.push(`/dashboard/${encodeURI(parameters)}`)
                                                                    }
                                                                    }
                                                                    className="w-full px-4 py-2 bg-gray-500 text-white -md"
                                                                >
                                                                    Set
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>


                                            {/* </div> */}
                                            {/* ~~~F L T R S~~~ */}
                                        </div>

                                    }


                                    {/* filter by organizational units  */}
                                    {/* national */}



                                </div>


                            </div>
                        </div>


                        {/* Facility Owners Chart */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facility owners </h4>
                            
                            {
                                ownerPresentationType !== 'table' ?

                                    <Chart
                                        title=""
                                        categories={Array?.from(props?.data?.owner_types ?? [], cs => cs.name) || []}
                                        tooltipsuffix="#"
                                        xaxistitle={ownerPresentationType.includes('pie') ? null : "Owner Type"}
                                        yaxistitle={ownerPresentationType.includes('pie') ? null : "Count"}
                                        type={ownerPresentationType}
                                        data={(() => {
                                            let data = [];
                                            data?.push({
                                                name: 'Facilities',
                                                data: Array.from(props?.data?.owner_types ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                            });
                                            return data;
                                        })() || []} />

                                    :
                                    <table className="w-full h-full text-sm md:text-base p-2">
                                        <thead className="border-b border-gray-300">
                                            <tr>
                                                <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                                <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-lg">
                                            {props?.data?.owner_types?.map((ts, i) => (
                                                <tr key={i}>
                                                    <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            }
                            <Select
                                name="owner_chart_type"
                                options={chartPresentationOptions}
                                value={defaultPresentation('owner_chart')}
                                onChange={value => handlePresentationChange(value, 'owner_chart')}
                                placeholder="presentation type"
                                title="Select Presentation Type"
                                className='self-end' />




                        </div>

                        {/* Facility Types Chart */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facility Types </h4>
                            {
                                facilityTypePresentationType !== 'table' ?

                                    <Chart
                                        title=""
                                        categories={Array?.from(props?.data?.types_summary ?? [], cs => cs.name) || []}
                                        tooltipsuffix="#"
                                        xaxistitle={facilityTypePresentationType.includes('pie') ? null : "Facility Type"}
                                        yaxistitle={facilityTypePresentationType.includes('pie') ? null : "Count"}
                                        type={facilityTypePresentationType}
                                        data={(() => {
                                            let data = [];
                                            data?.push({
                                                name: 'Facilities',
                                                data: Array.from(props?.data?.types_summary ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                            });
                                            return data;
                                        })() || []} />
                                    :
                                    <table className="w-full h-full text-sm md:text-base p-2">
                                        <thead className="border-b border-gray-300">
                                            <tr>
                                                <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                                <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-lg">
                                            {props?.data?.types_summary?.map((ts, i) => (
                                                <tr key={i}>
                                                    <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            }
                            <Select
                                name="facility_type_chart"
                                options={chartPresentationOptions}
                                value={defaultPresentation('facility_type_chart')}
                                onChange={value => handlePresentationChange(value, 'facility_type_chart')}
                                placeholder="presentation type"
                                title="Select Presentation Type"
                                className='self-end' />
                        </div>

                        {/* Facilities Summary chart */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facilities summary</h4>
                            {
                                summaryPresentationType !== 'table' ?
                                    <Chart
                                        title=""
                                        categories={Array?.from(totalSummary ?? [], cs => cs.name) || []}
                                        tooltipsuffix="#"
                                        xaxistitle={summaryPresentationType.includes('pie') ? null : "Facility Summaries"}
                                        yaxistitle={summaryPresentationType.includes('pie') ? null : "Count"}
                                        type={summaryPresentationType}
                                        data={(() => {
                                            let data = [];
                                            data?.push({
                                                name: 'Facilities',
                                                data: Array.from(totalSummary ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                            });
                                            return data;
                                        })() || []} />
                                    :
                                    <table className="w-full h-full text-sm md:text-base p-2">
                                        <thead className="border-b border-gray-300">
                                            <tr>
                                                <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                                <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-lg">
                                            {totalSummary?.map((ts, i) => (
                                                <tr key={i}>
                                                    <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            }
                            <Select
                                name="facility_summary_chart"
                                options={chartPresentationOptions}
                                value={defaultPresentation('facility_summary_chart')}
                                onChange={value => handlePresentationChange(value, 'facility_summary_chart')}
                                placeholder="presentation type"
                                title="Select Presentation Type"
                                className='self-end' />
                        </div>

                        {/* Community Unit Summary */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Community Units summary</h4>
                            {
                                chuSummaryPresentationType !== 'table' ?
                                    <Chart
                                        title=""
                                        categories={Array?.from(chuSummary ?? [], cs => cs.name) || []}
                                        tooltipsuffix="#"
                                        xaxistitle={chuSummaryPresentationType.includes('pie') ? null : "Community Unit Summary"}
                                        yaxistitle={chuSummaryPresentationType.includes('pie') ? null : "Count"}
                                        type={chuSummaryPresentationType}
                                        data={(() => {
                                            let data = [];
                                            data?.push({
                                                name: 'Community Units',
                                                data: Array.from(chuSummary ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                            });
                                            return data;
                                        })() || []} />
                                    :
                                    <table className="w-full h-full text-sm md:text-base p-2">
                                        <thead className="border-b border-gray-300">
                                            <tr>
                                                <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                                <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-lg">
                                            {chuSummary?.map((ts, i) => (
                                                <tr key={i}>
                                                    <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            }
                            <Select
                                name="chu_summary_chart"
                                options={chartPresentationOptions}
                                value={defaultPresentation('chu_summary_chart')}
                                onChange={value => handlePresentationChange(value, 'chu_summary_chart')}
                                placeholder="presentation type"
                                title="Select Presentation Type"
                                className='self-end' />

                        </div>

                        {/* Recent Facility  Changes Chart */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Recent changes</h4>
                            {
                                recentChangesPresentationType !== 'table' ?
                                    <Chart
                                        title=""
                                        categories={Array?.from(totalSummary ?? [], cs => cs.name) || []}
                                        tooltipsuffix="#"
                                        xaxistitle={recentChangesPresentationType.includes('pie') ? null : "Recent Changes"}
                                        yaxistitle={recentChangesPresentationType.includes('pie') ? null : "Count"}
                                        type={recentChangesPresentationType}
                                        data={(() => {
                                            let data = [];
                                            data?.push({
                                                name: 'Community Units',
                                                data: Array.from(recentChanges ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                            });
                                            return data;
                                        })() || []} />
                                    :
                                    <table className="w-full h-full text-sm md:text-base p-2">
                                        <thead className="border-b border-gray-300">
                                            <tr>
                                                <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                                <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-lg">
                                            {recentChanges?.map((ts, i) => (
                                                <tr key={i}>
                                                    <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            }
                            <div className='flex gap-2 self-end'>
                                
                                <Select 
                            id={"recency_period"}
                            ref={recencyRef}
                            options={recencyOptions} 
                            onChange={handleRecencyChange}
                            placeholder="Select Period"
                            title="Select Recency Period" 
                            />
                            
                                <Select
                                    name="recent_changes_chart"
                                    options={chartPresentationOptions}
                                    value={defaultPresentation('recent_changes_chart')}
                                    onChange={value => handlePresentationChange(value, 'recent_changes_chart')}
                                    placeholder="presentation type"
                                    title="Select Presentation Type"
                                />
                            </div>

                        </div>

                        {/* Facilities by keph level  Chart*/}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facility KEPH Level </h4>
                            {
                                facilityKephPresentationType !== 'table' ?
                                    <Chart
                                        title=""
                                        categories={Array?.from(props?.data?.keph_level ?? [], cs => cs.name) || []}
                                        tooltipsuffix="#"
                                        xaxistitle=""
                                        yaxistitle=""
                                        type={facilityKephPresentationType}
                                        data={(() => {
                                            let data = [];
                                            data?.push({
                                                name: 'Facilities',
                                                data: Array.from(props?.data?.keph_level ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                            });
                                            return data;
                                        })() || []} />
                                    :
                                    <table className="w-full h-full text-sm md:text-base p-2">
                                        <thead className="border-b border-gray-300">
                                            <tr>
                                                <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                                <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-lg">
                                            {props?.data?.keph_level?.map((ts, i) => (
                                                <tr key={i}>
                                                    <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            }
                            <Select
                                name="facility_keph_chart"
                                options={chartPresentationOptions}
                                value={defaultPresentation('facility_keph_chart')}
                                onChange={value => handlePresentationChange(value, 'facility_keph_chart')}
                                placeholder="presentation type"
                                title="Select Presentation Type"
                                className='self-end' />


                        </div>

                        {/* Facilities & CHUs by County Chart */}
                        {(groupID === 7 || groupID === 5) &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 border-b text-center border-gray-100 w-full mb-2 font-semibold text-gray-900">Facilities &amp; CHUs by County</h4>

                                <Chart
                                    title=""
                                    categories={Array?.from(props?.data?.county_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="County"
                                    yaxistitle="Number"
                                    type={facilityCHUsPresentationType}
                                    data={(() => {
                                        let data = [];
                                        data?.push({
                                            name: 'Facilities',
                                            data: Array.from(props?.data?.county_summary ?? [], cs => parseFloat(cs.count)) || []
                                        });
                                        data?.push({
                                            name: 'CHUs',
                                            data: Array.from(props?.data?.county_summary ?? [], cs => parseFloat(cs.chu_count)) || []
                                        });
                                        return data;
                                    })() || []} />

                                <Select
                                    name="facility_chu_chart"
                                    options={chartPresentationOptions.filter(({ value }) => (value !== 'pie' && value !== 'table'))}
                                    value={defaultPresentation('facility_chu_chart')}
                                    onChange={value => handlePresentationChange(value, 'facility_chu_chart')}
                                    placeholder="presentation type"
                                    title="Select Presentation Type"
                                    className='self-end z-40' />

                            </div>
                        }
                        {/* Facilities & CHUs by Sub Counties Chart*/}
                        {groupID === 1 &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-gray-900">Facilities &amp; CHUs by Subcounty</h4>
                                <Chart
                                    title=""
                                    categories={Array?.from(props?.data?.constituencies_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="Subcounty"
                                    yaxistitle="Number"
                                    type={facilityCHUsPresentationType}
                                    data={(() => {
                                        let data = [];
                                        data?.push({
                                            name: 'Facilities',
                                            data: Array.from(props?.data?.constituencies_summary ?? [], cs => parseFloat(cs.count)) || []
                                        });
                                        data?.push({
                                            name: 'CHUs',
                                            data: Array.from(props?.data?.constituencies_summary ?? [], cs => parseFloat(cs.chu_count)) || []
                                        });
                                        return data;
                                    })() || []} />

                                <Select
                                    name="facility_chu_chart"
                                    options={chartPresentationOptions.filter(({ value }) => (value !== 'pie' && value !== 'table'))}
                                    value={defaultPresentation('facility_chu_chart')}
                                    onChange={value => handlePresentationChange(value, 'facility_chu_chart')}
                                    placeholder="presentation type"
                                    title="Select Presentation Type"
                                    className='self-end z-40' />

                            </div>

                        }
                        {/* Facilities & CHUs by Ward Chart */}
                        {groupID === 2 &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3 shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-gray-900">Facilities &amp; CHUs by Ward</h4>
                                <Chart
                                    title=""
                                    categories={Array?.from(props?.data?.wards_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="Ward"
                                    yaxistitle="Number"
                                    type="bar"
                                    data={(() => {
                                        let data = [];
                                        data?.push({
                                            name: 'Facilities',
                                            data: Array.from(props?.data?.wards_summary ?? [], cs => parseFloat(cs.count)) || []
                                        });
                                        data?.push({
                                            name: 'CHUs',
                                            data: Array.from(props?.data?.wards_summary ?? [], cs => parseFloat(cs.chu_count)) || []
                                        });
                                        return data;
                                    })() || []} />
                            </div>
                        }

                        {/* Dashbord Map */}
                        <Map token={props?.token} groupID={groupID} user={user} />

                        
                    </div>
                </MainLayout>
            </div>
        )
    }
    else {
        return null
    }
}


Dashboard.propTypes = {

    json: propTypes.object,
    query: propTypes.object,
    filter: propTypes.object,
    path: propTypes.string,
    current: propTypes.string,
    api_url: propTypes.string,

}

Dashboard.defaultProps = {
    api_url: `${process.env.NEXT_PUBLIC_API_URL}`,
    path: '/dashboard',
    current: `${process.env.NEXT_PUBLIC_API_URL}/facilities/dashboard`
}


export async function getServerSideProps(ctx) {


    ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )


    const token = (await checkToken(ctx.req, ctx.res))?.token


    let query = { 'searchTerm': '' }

    async function fetchFilters(apiToken) {

        let url = `${process.env.NEXT_PUBLIC_API_URL}/common/filtering_summaries/?fields=county`

        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`
        }

        // console.log({filterUrl: url})

        return fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        })
            .then(resp => resp.json())
            .catch(console.error)
    }

    async function fetchDashboardData(token) {



        let url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/dashboard/`

        if (ctx?.query) {
            let i = 0
            for (let [key, value] of Object.entries(ctx?.query)) {
                url += `${i == 0 ? '?' : '&'}${key}=${value}`
                i++
            }
        }

        // console.log({ url })


        return fetch(url, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then(json => ({
                data: json

            }))
            .catch(e => console.error(e.message))
    }


    const ft = await fetchFilters(token)

    const dashboard = await fetchDashboardData(token)


    if (dashboard?.data) {      // console.log({ft, query})
        return {
            props: {
                data: dashboard?.data,
                query,
                filters: { ...ft },
                token

            }
        }
    } else {
        return {
            props: {
                data: null,
                query,
                filters: { ...ft },
                token

            }
        }
    }



}

export default Dashboard


