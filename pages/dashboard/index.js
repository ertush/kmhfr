import Head from 'next/head'
import MainLayout from '../../components/MainLayout'
import { checkToken } from '../../controllers/auth/auth'
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import BarChart from '../../components/BarChart'
import Select from 'react-select'
import { UserContext } from '../../providers/user'
import Link from 'next/link'
import { useReactToPrint } from 'react-to-print'
import 'react-datepicker/dist/react-datepicker.css';
import { DownloadIcon } from '@heroicons/react/outline';
import propTypes from 'prop-types'




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

    const quarters = [
        {
            value: 'All',
            label: 'All Quarters'
        },
        {
            value: 'quarter 1',
            label: 'Quarter 1'
        },
        {
            value: 'quarter 2',
            label: 'Quarter 2'
        },
        {
            value: 'quarter 3',
            label: 'Quarter 3'
        },
        {
            value: 'quarter 4',
            label: 'Quarter 4'
        }
    ]
    const [isquarterOpen, setIsquarterOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [drillDown, setDrillDown] = useState({})
    const [user, setUser] = useState(userCtx)
    const [subcounties, setSubcounties] = useState([])
    const [counties, setCounties] = useState([])
    const [wards, setWards] = useState([])
    const [isClient, setIsClient] = useState(false);


    const dwn = useRef()

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
            setSubcounties({ subcounties: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch sub_counties: ${err.message}`)
        }
    }

    const fetchWards = async (sub_county) => {

        try {
            const r = await fetch(`/api/common/fetch_form_data/?path=wards&id=${sub_county}`)
            setWards({ wards: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch wards: ${err.message}`)
        }
    }

    function getperiod(item, curryear) {
        let startdate = ''
        let enddate = ''
        try {
            if (item === 'All') {
                startdate = curryear + "-01-01"
                enddate = curryear + "-12-" + (new Date(curryear, 12, 0).getDate().toString())
            }
            else if (item === 'quarter 1') {
                startdate = curryear + "-01-01"
                enddate = curryear + "-03-" + (new Date(curryear, 3, 0).getDate().toString())
            }
            else if (item === 'quarter 2') {
                startdate = curryear + "-04-01"
                enddate = curryear + "-06-" + (new Date(curryear, 6, 0).getDate().toString())
            }
            else if (item === 'quarter 3') {
                startdate = curryear + "-07-01"
                enddate = curryear + "-09-" + (new Date(curryear, 9, 0).getDate().toString())
            }
            else if (item === 'quarter 4') {
                startdate = curryear + "-10-01"
                enddate = curryear + "-12-" + (new Date(curryear, 12, 0).getDate().toString())
            }
            else {
                return null
            }
            return [startdate, enddate]
        } catch (error) {
            return null
        }
    }


    useEffect(() => {
        setUser(userCtx)

        let mtd = true
        if (mtd) {

            if (filters && Object.keys(filters).length > 0) {
                Object.keys(filters)?.map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            if (subcounties && Object.keys(subcounties).length > 0) {
                Object.keys(subcounties)?.map(ft => {
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
            if (userCtx) setUser(userCtx)
        }
        return () => { mtd = false }

    }, [filters, subcounties, wards])


    // Check for user authentication
    useEffect(() => {
        setIsClient(true)
       

        if (userCtx?.groups[0].id == 2) fetchWards(user?.user_sub_counties[0]?.sub_county ?? null)
        if (userCtx?.groups[0].id == 1) fetchSubCounties(userCtx?.county)
        if (userCtx?.groups[0].id == 7) fetchCounties();

        setUser(userCtx)

     

    }, [])


    // console.log(props.data)

    const exportToPdf = useReactToPrint({
        documentTitle: 'Summary',
        content: () => dwn.current,
    });



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
        { name: 'Total community health units', count: `${props?.data?.total_chus || 0}` },
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
    // console.log(user)
    const csvHeaders = useMemo(
        () => [
            { key: 'metric', label: 'Metric' },
            { key: 'value', label: 'Value' },
        ],
        [],
    );

    const groupID = user?.groups[0]?.id

    const userCounty = user?.user_counties[0]?.county_name

    const userSubCounty = user?.user_sub_counties[0]?.sub_county_name

    
    if (isClient) {
        return (
            <div className="">
                <Head>
                    <title>KMHFR - Dashboardboard</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>

                    <div className="md:w-[85%] md:mx-auto grid grid-cols-6 gap-4 px-4 py-2 my-4 main" ref={dwn}>
                        <div className="col-span-6 flex flex-col gap-3 md:gap-5 mb-8 ">
                            {/* Debug */}
                        
                            <div className="no-print flex flex-row gap-2 md:text-base py-3">
                                {/* <Link className="text-blue-700" href="/" >Home</Link>  */}
                                <span className="text-gray-600 text-2xl">Dashboard</span> 

                            </div>
                            <div className="flex flex-col w-full md:flex-wrap lg:flex-row xl:flex-row gap-1 text-sm md:text-base items-center justify-between">
                                <h1 className="w-full md:w-auto text-4xl tracking-tight font-bold leading-3 flex items-start justify-center gap-x-1 gap-y-2 flex-grow mb-4 md:mb-2 flex-col">
                                    {/* <span className='no-print' id="dashboard-title">Overview</span> */}
                                    <div className='flex items-center gap-x-2 mt-3'>
                                        {drillDown && drillDown?.county && groupID !== 1 &&
                                            <small className="text-blue-900 text-base font-semibold ml-1">
                                                {filters && filters?.county && filters?.county.find(ft => ft.id == drillDown?.county)?.name ? filters?.county.find(ft => ft.id == drillDown?.county)?.name + " County" : "National Summary" || ""}
                                            </small>
                                        }
                                        {user && userCounty &&
                                            <small className="text-blue-900 text-base font-semibold">

                                                {`${userCounty ?? user?.county_name} County`}

                                            </small>
                                        }
                                        {user && userSubCounty ?
                                            <>
                                                <span className='text-gray-500 text-base'> / </span>

                                                <small className="text-blue-900 text-base font-semibold ">

                                                    {`${userSubCounty ?? user?.sub_county_name} Sub county`}

                                                </small>
                                            </>
                                            :
                                            <>
                                                {groupID !== 7 || groupID !== 5 && <span className='text-gray-500 text-base text-center'> / </span>}
                                                <small className="text-blue-900 text-base font-semibold">
                                                    {subcounties && subcounties?.subcounties && subcounties?.subcounties.find(ft => ft.id == drillDown?.subcounties)?.name != undefined ? subcounties.subcounties.find(ft => ft.id == drillDown?.subcounties)?.name + " Sub county" : !drillDown?.county && "" || ""}

                                                </small>
                                            </>
                                        }
                                        {drillDown && drillDown?.wards &&
                                            <>
                                                <span className='text-gray-500 text-base text-center'> / </span>
                                                <small className="text-blue-900 text-base font-semibold ml-1">

                                                    {wards && wards?.wards && wards?.wards.find(ft => ft.id == drillDown?.wards)?.name != undefined ? wards?.wards.find(ft => ft.id == drillDown?.wards)?.name + " Ward" : "Subcounty Summary" || ""}
                                                </small>
                                            </>
                                        }
                                    </div>
                                </h1>

                                <div className=" no-print flex-grow flex gap-x-3 items-center justify-end w-full md:w-auto">

                                    {/* show datetime filters */}
                                    {/* --- */}
                                    {user &&
                                        <div className="w-full flex  items-center justify-end space-x-3 ">
                                            <div className="w-full max-w-xs flex flex-col items-start justify-start">
                                                {/* <label htmlFor='Yearselector' className="text-gray-600 capitalize font-semibold text-sm ml-1">Filter by Year</label> */}
                                                <Select id="Yearselector" className="w-full max-w-xs rounded border border-gray-400"
                                                    options={Years}
                                                    placeholder='Filter by Year'
                                                    data-modal-target="defaultModal" data-modal-toggle="defaultModal"
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

                                                    onChange={async (sl) => {
                                                        let startdate = ''
                                                        let enddate = ''
                                                        if (sl.value && sl.value == "custom") {
                                                            setIsquarterOpen(false)
                                                            setIsOpen(true)
                                                            return;
                                                        }
                                                        else if (sl.label.length == 4) {
                                                            startdate = sl.value
                                                            enddate = sl.value.toString().split('-')[0] + "-12-31"
                                                            setIsquarterOpen(true)
                                                            if (document.getElementById("quarterselector") != null) {
                                                                document.getElementById("quarterselector").value = 'All'
                                                            }
                                                            let myear = {}
                                                            if (sl && sl !== null) {
                                                                drillDown["year"] = sl.value
                                                            } else {
                                                                delete drillDown["year"]

                                                            }
                                                            setDrillDown({ ...drillDown, ...myear })
                                                            return;
                                                        }
                                                        else {
                                                            setIsquarterOpen(false)
                                                            alert("The selected period is not recognized")
                                                            return;
                                                        }
                                                        if (startdate == '' || enddate == '') {
                                                            return;
                                                        }

                                                        let parameters = "?"
                                                        if (sl.value) {
                                                            parameters += "datefrom=" + startdate
                                                        }
                                                        if (sl.value) {
                                                            parameters += "&dateto=" + enddate
                                                        }
                                                        if (props?.query?.county) {
                                                            parameters += "&county=" + props?.query?.county
                                                        }
                                                        if (props?.query?.sub_county) {
                                                            parameters += "&subc_county=" + props?.query?.sub_county
                                                        }
                                                        if (props?.query?.ward) {
                                                            parameters += "&ward=" + props?.query?.ward
                                                        }

                                                        router.push('/dashboard' + parameters)
                                                          

                                                    }}
                                                />
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
                                                                            router.push(`/dashboard ${encodeURI(querySelector)}`)
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


                                            </div>
                                            {/* ~~~F L T R S~~~ */}
                                        </div>

                                    }
                                    {/* {user && isquarterOpen &&
                                        <div id="quarterdiv" visibility="collapsed" className="w-full flex  items-center justify-end space-x-3">
                                            <div id={quarters} className="w-full max-w-xs flex flex-col items-start justify-start">

                                                <Select id="quarterselector" name={quarters} className="w-full max-w-xs  bg-django-blue border border-blue-600"
                                                    options={quarters}
                                                    placeholder='Select Quarter'
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
                                                    onChange={async (sl) => {

                                                        let period = {}
                                                        if (sl && sl !== null) {
                                                            period["quarter"] = sl.value
                                                        } else {
                                                            delete period["quarter"]

                                                        }


                                                        let startdate = ''
                                                        let enddate = ''
                                                        let year = ''
                                                        if (drillDown["year"].split('-').length > 0) {
                                                            year = drillDown["year"].split('-')[0]
                                                        }
                                                        if (year == '') {
                                                            alert("Select the year")
                                                            return;
                                                        }
                                                        if (sl.value && sl.label.includes('Quarter') && year.length == 4) {

                                                            if (getperiod(sl.value, year) == null) {
                                                                alert("The period can not be parsed!")
                                                            }
                                                            else {
                                                                startdate = getperiod(sl.value, year)[0]
                                                                enddate = getperiod(sl.value, year)[1]
                                                            }
                                                        }
                                                        else {
                                                            alert("The selected period is not recognized")
                                                            return;
                                                        }
                                                        if (startdate == '' || enddate == '') {
                                                            return;
                                                        }

                                                        let parameters = "?"
                                                        if (sl.value) {
                                                            parameters += "datefrom=" + startdate
                                                        }
                                                        if (sl.value) {
                                                            parameters += "&dateto=" + enddate
                                                        }
                                                        if (props?.query?.county) {
                                                            parameters += "&county=" + props?.query?.county
                                                        }
                                                        if (props?.query?.sub_county) {
                                                            parameters += "&subc_county=" + props?.query?.sub_county
                                                        }
                                                        if (props?.query?.ward) {
                                                            parameters += "&ward=" + props?.query?.ward
                                                        }
                                                        setDrillDown({ ...drillDown, ...period })
                                                        router.push('/dashboard' + parameters)
                                                        // alert(JSON.stringify(drillDown)) 
                                                        // if (sl && sl !== null ) { 
                                                        //     let fcounty
                                                        //     if(props?.query?.county){
                                                        //         fcounty=props?.query.county
                                                        //     }
                                                        //     else
                                                        //     {
                                                        //         fcounty='national'
                                                        //     }
                                                        //     if (sl.value === '' ) { 
                                                        //         if(fcounty==='national'){
                                                        //             router.push('/dashboard')
                                                        //         }
                                                        //         else{
                                                        //             router.push('/dashboard?county=' + fcounty)
                                                        //         }
                                                        //     } 
                                                        //     else { 
                                                        //         if(fcounty==='national'){
                                                        //             router.push('/dashboard?datefrom=' +sl.value)
                                                        //         }
                                                        //         else{
                                                        //             router.push('/dashboard?county=' + fcounty+"&datefrom="+sl.value)
                                                        //         }

                                                        //     }
                                                        // }   

                                                    }}
                                                />

                                            </div>
                                        </div>
                                    } */}

                                    {/* filter by organizational units  */}
                                    {/* national */}
                                    {(groupID === 5 || groupID === 7) && <div className="w-full flex  items-center justify-end space-x-3">
                                        {filters && Object.keys(filters).length > 0 &&
                                            Object.keys(filters)?.map(ft => (
                                                <div key={ft} className="w-full max-w-xs flex flex-col items-start justify-start" id='first'>
                                                    {/* <label htmlFor={ft} className="text-gray-600 capitalize font-semibold text-sm ml-1">{ft.split('_').join(' ')}</label> */}
                                                    <Select name={ft} defaultValue={drillDown[ft] || "national"} id={ft} className="w-full max-w-xs rounded border border-gray-400"
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
                                                        options={
                                                            (() => {
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
                                                            })()
                                                        }
                                                        placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                        onChange={sl => {
                                                            let nf = {}
                                                            if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                nf[ft] = sl.value
                                                            } else {
                                                                delete nf[ft]
                                                                // let rr = drillDown.filter(d => d.key !== ft)
                                                                // setDrilldown(rr)
                                                            }

                                                            setDrillDown({ ...drillDown, ...nf })
                                                            //alert(JSON.stringify(drillDown))
                                                            let value = sl.value
                                                            let parameters = ""
                                                            let ar = []
                                                            if (value) {
                                                                if (value !== 'national') {
                                                                    ar.push('county=' + value)
                                                                }
                                                            }
                                                            if (props?.query.datefrom) {
                                                                ar.push("datefrom=" + props.query['datefrom'])
                                                            }
                                                            if (props?.query.dateto) {
                                                                ar.push("dateto=" + props.query['dateto'])
                                                            }
                                                            ar?.map(k => {
                                                                if (parameters.includes('?')) {
                                                                    parameters += "&" + k
                                                                } else {
                                                                    parameters += "?" + k
                                                                }
                                                            })
                                                            router.push('/dashboard' + parameters)
                                                        }} />

                                                </div>
                                            ))}
                                        {/* ~~~F L T R S~~~ */}
                                    </div>}
                                    {/* county user */}
                                    {groupID === 1 && <div className="w-full flex  items-center justify-end space-x-3">
                                        {subcounties && Object.keys(subcounties).length > 0 &&
                                            Object.keys(subcounties)?.map(ft => (
                                                <div key={ft} className="w-full max-w-xs flex flex-col items-start justify-start" id="second">
                                                    {/* <label htmlFor={ft} className="text-gray-600 capitalize font-semibold text-sm ml-1">{ft.split('_').join(' ').replace('ies', 'y')}</label> */}
                                                    <Select name={ft} id={ft} className="w-full max-w-xs border rounded border-gray-400"
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
                                                        options={
                                                            (() => {
                                                                if (groupID === 1) {
                                                                    let opts = [{ value: "county", label: "County summary" }, ...Array.from(subcounties[ft] || [],
                                                                        fltopt => {
                                                                            if (fltopt.id != null && fltopt.id.length > 0) {
                                                                                return {
                                                                                    value: fltopt.id, label: fltopt.name
                                                                                }
                                                                            }
                                                                        })]
                                                                    return opts
                                                                } else {
                                                                    let opts = [...Array.from(subcounties[ft] || [],
                                                                        fltopt => {
                                                                            if (fltopt.id != null && fltopt.id.length > 0) {
                                                                                return {
                                                                                    value: fltopt.id, label: fltopt.name
                                                                                }
                                                                            }
                                                                        })]
                                                                    return opts
                                                                }
                                                            })()
                                                        }
                                                        placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                        onChange={sl => {
                                                            let nf = {}
                                                            if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                nf[ft] = sl.value
                                                            } else {
                                                                delete nf[ft]
                                                                // let rr = drillDown.filter(d => d.key !== ft)
                                                                // setDrilldown(rr)
                                                            }
                                                            // fetchWards(sl.value)
                                                            setDrillDown({ ...drillDown, ...nf })

                                                            let parameters = ""
                                                            let ar = []
                                                            if (sl.value) {
                                                                if (sl.value !== 'county') {
                                                                    ar.push('sub_county=' + sl.value)
                                                                } else {
                                                                    ar.push('county=' + user.county)
                                                                }
                                                            }

                                                            if (props?.query.datefrom) {
                                                                ar.push("datefrom=" + props.query['datefrom'])
                                                            }
                                                            if (props?.query.dateto) {
                                                                ar.push("dateto=" + props.query['dateto'])
                                                            }
                                                            ar?.map(k => {
                                                                if (parameters.includes('?')) {
                                                                    parameters += "&" + k
                                                                } else {
                                                                    parameters += "?" + k
                                                                }
                                                            })

                                                            router.push('/dashboard' + parameters)
                                                        }} />

                                                </div>
                                            ))}
                                    </div>
                                    }
                                    {/* sub_county user */}

                                    {groupID === 2 &&
                                        <div className="w-full flex  items-center justify-end space-x-3">

                                            {wards && Object.keys(wards).length > 0 &&
                                                Object.keys(wards)?.map(ft => (
                                                    <div key={ft} className="w-full max-w-xs flex flex-col items-start justify-start" id="third">
                                                        {/* <label htmlFor={ft} className="text-gray-600 capitalize font-semibold text-sm ml-1">{ft.split('_').join(' ').replace('s', '')}</label> */}
                                                        <Select name={ft} defaultValue={drillDown[ft] || "Subcounty"} id={ft} className="w-full max-w-xs  rounded border border-gray-400"
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
                                                            options={
                                                                (() => {
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
                                                                })()
                                                            }
                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                            // onChange={async (option) => {

                                                            //     try {
                                                            //         const resp = await fetch(`/api/facility/get_facility/?path=dashboard&id=${option.value}`)

                                                            //         // console.log({resp: (await resp.json())})
                                                            //         console.log({ resp: (await JSON.stringify(resp)) })
                                                            //     } catch (e) {
                                                            //         console.error(e.message)
                                                            //     }
                                                            // }} 
                                                            onChange={sl => {
                                                                let nf = {}
                                                                if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                    nf[ft] = sl.value
                                                                } else {
                                                                    delete nf[ft]
                                                                    // let rr = drillDown.filter(d => d.key !== ft)
                                                                    // setDrilldown(rr)
                                                                }
                                                                // fetchWards(sl.value)
                                                                setDrillDown({ ...drillDown, ...nf })

                                                                let parameters = ""
                                                                let ar = []
                                                                if (sl.value) {
                                                                    if (sl.value !== 'Subcounty') {
                                                                        ar.push('ward=' + sl.value)
                                                                    } else {
                                                                        ar.push('sub_county=' + user.user_sub_counties[0].sub_county)
                                                                    }
                                                                }
                                                                if (props?.query.datefrom) {
                                                                    ar.push("datefrom=" + props.query['datefrom'])
                                                                }
                                                                if (props?.query.dateto) {
                                                                    ar.push("dateto=" + props.query['dateto'])
                                                                }
                                                                ar?.map(k => {
                                                                    if (parameters.includes('?')) {
                                                                        parameters += "&" + k
                                                                    } else {
                                                                        parameters += "?" + k
                                                                    }
                                                                })

                                                                router.push('/dashboard' + parameters)
                                                            }} />

                                                    </div>
                                                ))}
                                        </div>
                                    }

                                </div>

                                {/* <button className="flex items-center bg-blue-600 ml-6 text-white text-center font-medium active:bg-gray-200 p-2" onClick={exportToPdf}>
                                    <DownloadIcon className="w-4 h-4 mr-1" />
                                    <span>Export</span>
                                </button> */}


                            </div>
                        </div>

                        {/* <div id="dashboard" className="w-full grid grid-cols-6 gap-4 px-1 md:px-4 py-2 my-4"> */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility owners </h4>
                            <table className="w-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {props?.data?.owner_types?.map((ot, i) => (
                                        <tr key={i}>
                                            <><td className="table-cell text-left text-gray-900 p-2">{ot.name}</td>
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ot.count || 0}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Types </h4>
                            <table className="w-full text-sm md:text-base p-2">
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
                        </div>

                        {/* Facilities summary 1/3 - FILTERABLE */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facilities summary</h4>
                            <table className="w-full text-sm md:text-base p-2">
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
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* CUs summary - FILTERABLE 1/3 */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Community Units summary</h4>
                            <table className="w-full text-sm md:text-base p-2">
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
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Recent changes 1/3 - FILTERABLE */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Recent changes</h4>
                            <table className="w-full text-sm md:text-base p-2">
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
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* facilities by keph level */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility KEPH Level </h4>
                            <table className="w-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {props?.data?.keph_level?.map(({name, count}, i) => (
                                        <tr key={i}>
                                            <td className="table-cell text-left text-gray-900 p-2">{name}</td>
                                            <td className="table-cell text-right font-semibold text-gray-900 p-2">{count || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Facilities & CHUs by county (bar) 1/1 */}
                        {(groupID === 7 || groupID === 5) &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 border-b text-center border-gray-100 w-full mb-2 font-semibold text-blue-900">Facilities &amp; CHUs by County</h4>
                                <BarChart
                                    title=""
                                    categories={Array?.from(props?.data?.county_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="County"
                                    yaxistitle="Number"
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
                            </div>
                        }
                        {/* Facilities & CHUs by subcounties (bar) 1/1 */}
                        {groupID === 1 &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facilities &amp; CHUs by Subcounty</h4>
                                <BarChart
                                    title=""
                                    categories={Array?.from(props?.data?.constituencies_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="Subcounty"
                                    yaxistitle="Number"
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
                            </div>
                        }
                        {/* Facilities & CHUs by ward (bar) 1/1 */}
                        {groupID === 2 &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3 shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facilities &amp; CHUs by Ward</h4>
                                <BarChart
                                    title=""
                                    categories={Array?.from(props?.data?.wards_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="Ward"
                                    yaxistitle="Number"
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
                        {/* Facility owners & categories - national summary - FILTERABLE (bar) 1/2 */}
                        <div className="no-print col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3 shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facility owners</h4>
                            <BarChart
                                title=""
                                categories={Array.from(props?.data?.owner_types ?? [], ot => ot.name) || []}
                                tooltipsuffix="#"
                                xaxistitle="Owner"
                                yaxistitle="Number"
                                data={(() => {
                                    return [{ name: "Owner", data: Array.from(props?.data?.owner_types ?? [], ot => parseFloat(ot.count)) || [] }];
                                })() || []} />
                        </div>
                        {/* Facility types - national summary - FILTERABLE (bar) 1/2 */}
                        <div className="no-print col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facility types</h4>
                            <BarChart
                                title=""
                                categories={Array.from(props?.data?.types_summary ?? [], ts => ts.name) || []}
                                tooltipsuffix="#"
                                xaxistitle="Type"
                                yaxistitle="Number"
                                data={(() => {
                                    return [{ name: "Type", data: Array.from(props?.data?.types_summary ?? [], ts => parseFloat(ts.count)) || [] }];
                                })() || []} />
                        </div>


                        {/* Floating div at bottom right of page */}
                        {/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-gray-50/50 bg-blend-lighten shadow-lg -lg flex flex-col justify-center items-center py-2 px-3">
                            <h5 className="text-sm font-bold">
                                <span className="text-gray-600 uppercase">Limited results</span>
                            </h5>
                            <p className="text-sm text-gray-800">
                                For testing reasons, results are limited at the moment.
                            </p>
                        </div> */}
                        {/* </div> */}

                        <style jsx global>{`
                        @media print {
                        /* Exclude the content with the "no-print" class */
                        .no-print {
                            display: none;
                        }
                        .main{
                            display:inline-block;
                            width:100%;
                        }
                        .card{
                            width:100%;
                            background-color: #fff;
                            border: 1px solid #e4e7ea;
                            margin: 20px;
                            padding: 20px;
                            box-shadow:0 0 0 0;
                            
                        }
                        }
                    `}</style>
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
    current:`${process.env.NEXT_PUBLIC_API_URL}/facilities/dashboard`
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

    let url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/dashboard`
   
    let other_posssible_filters = ["datefrom", "dateto", "county", "sub_county", "ward"]
    //ensure county and subcounties parameters are passed if the user is countyuser or subcountyuser respectively

    other_posssible_filters?.map(flt => {
        if (ctx?.query[flt]) {
            query[flt] = ctx?.query[flt]
            if (url.includes('?')) {
                url += `&${flt}=${ctx?.query[flt]}`
            } else {
                url += `?${flt}=${ctx?.query[flt]}`
            }
        }
    })

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
      
          
    if(dashboard?.data) {      // console.log({ft, query})
    return {
        props: {
            data: dashboard?.data,
            query,
            filters: { ...ft }, 
    
        }
    }
   } else {
    return {
        props: {
            data: null,
            query,
            filters: { ...ft }, 
    
        }
    }
   }
      
  

}

export default Dashboard


