import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon, FilterIcon } from '@heroicons/react/outline'
import React, { useState, useRef, useEffect } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
// import { Menu } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/outline'
import Select from 'react-select'
import moment from 'moment'

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
// import { Grid, GridOptions } from '@ag-grid-community/core';
import { LicenseManager, EnterpriseCoreModule } from '@ag-grid-enterprise/core';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import reactDom from 'react-dom'




const DynamicReports = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
 
    // const { data, query, path, current_url } = props
    const router = useRouter()
 
    let filters = props?.filters
    let fltrs = filters

    filters["has_edits"] = [{ id: "has_edits", name: "Has edits" },]
    filters["is_approved"] = [{ id: "is_approved", name: "Is approved" }]
    filters["is_complete"] = [{ id: "is_complete", name: "Is complete" }]
    filters["number_of_beds"] = [{ id: "number_of_beds", name: "Number of beds" }]
    filters["number_of_cots"] = [{ id: "number_of_cots", name: "Number of cots" }]
    filters["open_whole_day"] = [{ id: "open_whole_day", name: "Open whole day" }]
    filters["open_weekends"] = [{ id: "open_weekends", name: "Open weekends" }]
    filters["open_public_holidays"] = [{ id: "open_public_holidays", name: "Open public holidays" }]
    delete fltrs.has_edits
    delete fltrs.is_approved
    delete fltrs.is_complete
    delete fltrs.number_of_beds
    delete fltrs.number_of_cots
    delete fltrs.open_whole_day
    delete fltrs.open_weekends
    delete fltrs.open_public_holidays

    const filterAccordianRef = useRef(null)
  

    let qf = props?.query?.qf || 'all'
    // let [currentQuickFilter, setCurrentQuickFilter] = useState(qf)
    let [drillDown, setDrillDown] = useState({})
    let multiFilters = ['service_category', 'service', 'county', 'subcounty', 'ward', 'constituency']
   


    // let quickFilters = [
    //     {
    //         name: 'All',
    //         id: 'all',
    //         filters: Object.keys(filters),
    //     },
    //     {
    //         name: 'Approved',
    //         id: 'approved',
    //         filters: [
    //             { id: "is_approved", value: true },
    //         ],
    //     },
    //     {
    //         name: 'New pending validation',
    //         id: 'new_pending_validation',
    //         filters: [
    //             { id: "has_edits", value: false },
    //             { id: "pending_approval", value: false },
    //         ],
    //     },
    //     {
    //         name: 'Updated pending validation',
    //         id: 'updated_pending_validation',
    //         filters: [
    //             { id: "has_edits", value: true },
    //             { id: "pending_approval", value: true },
    //         ],
    //     },
    //     {
    //         name: 'Pending approval',
    //         id: 'pending_approval',
    //         filters: [
    //             { id: "to_publish", value: true },
    //         ],
    //     },
    //     {
    //         name: 'KHIS-synched',
    //         id: 'khis_synched',
    //         filters: [
    //             { id: "approved", value: true },
    //             { id: "approved_national_level", value: true },
    //             { id: "rejected", value: false },
    //             { id: "reporting_in_dhis", value: true },
    //             { id: "admitting_maternity_general", value: true },
    //             { id: "admitting_maternity_only", value: true },
    //         ],
    //     },
    //     {
    //         name: 'Incomplete',
    //         id: 'incomplete',
    //         filters: [
    //             { id: "incomplete", value: true },
    //         ]
    //     },
    //     {
    //         name: 'Rejected',
    //         id: 'rejected',
    //         filters: [
    //             { id: "rejected_national", value: true },
    //         ]
    //     },
    //     {
    //         name: 'Closed',
    //         id: 'closed',
    //         filters: [
    //             { id: "closed", value: true },
    //         ]
    //     },
    // ]
    // let headers_og = [
    //     "code", "name", "officialname", "registration_number", "keph_level_name", "facility_type_name", "facility_type_category", "owner_name", "owner_type_name", "regulatory_body_name", "beds", "cots", "county_name", "constituency_name", "sub_county", "sub_county_name", "ward_name", "operation_status_name", "admission_status_name", "open_whole_day", "open_public_holidays", "open_weekends", "open_late_night", "service_names", "approved", "is_public_visible", "created", "closed", "is_published", "lat", "long",
    // ]
    let headers = [
        "code", "officialname", "operation_status_name", "approved", "keph_level_name", "facility_type_name", "facility_type_category", "owner_name", "owner_type_name", "regulatory_body_name", "beds", "cots", "county_name", "constituency_name", "sub_county_name", "ward_name", "admission_status_name", "service_names", "created", "closed",
    ]

    let scoped_filters = [
        { "name": "keph_level_name", "options": [] },
        { "name": "facility_type_name", "options": [] },
        { "name": "facility_type_category", "options": [] },
        { "name": "owner_name", "options": [] },
        { "name": "owner_type_name", "options": [] },
        { "name": "regulatory_body_name", "options": [] },
        { "name": "county_name", "options": [] },
        { "name": "constituency_name", "options": [] },
        { "name": "sub_county_name", "options": [] },
        { "name": "ward_name", "options": [] },
        { "name": "operation_status_name", "options": [] },
        { "name": "admission_status_name", "options": [] },
        { "name": "open_whole_day", "options": [] },
        { "name": "open_public_holidays", "options": [] },
        { "name": "open_weekends", "options": [] },
        { "name": "open_late_night", "options": [] },
        { "name": "service_names", "options": [] },
        { "name": "approved", "options": [] },
        { "name": "is_public_visible", "options": [] },
        { "name": "closed", "options": [] },
        { "name": "is_published", "options": [] },
    ]

    if (props.data.results.length > 0) {
        scoped_filters.forEach(filter => {
            let options = []
            props.data.results.forEach(r_ => {
                if (!options.includes(r_[filter.name]) && r_[filter.name] !== null && r_[filter.name] !== undefined) {
                    options.push(r_[filter.name])
                }
            })
            filter.options = options
        })
    }
    // console.log('scoped_filters: ',scoped_filters)

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [linelist, setlinelist] = useState(null);
    const [linelist2, setlinelist2] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);

        const lnlst = Array.from(props.data.results, row => {
            let dtpnt = {}
            headers.forEach(col => {
                dtpnt[col] = row[col]
            })
            return dtpnt
        })
        setlinelist(lnlst)
        setlinelist2(lnlst)
        updateData(lnlst)  
    };
   
    useEffect(()=>{
      if( fromDate!=='' && toDate!==''){
          const results = linelist2?.filter(data=>new Date(moment(data.created).format('YYYY/MM/DD')).getTime() >= new Date(moment(fromDate).format('YYYY/MM/DD')).getTime() && new Date(moment(data.created).format('YYYY/MM/DD')).getTime() <= new Date(moment(toDate).format('YYYY/MM/DD')).getTime()).map((r)=>{return r})
          setlinelist(results)
      }else{

          setlinelist(linelist2)
      }
      
    }, [linelist, fromDate, toDate])

 

    // useEffect(() => {
    //     let mtd = true; 
    //     if(mtd){
    //         let lnlst = Array.from(props.data.results, row => {
    //             let dtpnt = {}
    //             headers.forEach(col => {
    //                 dtpnt[col] = row[col]
    //             })
    //             return dtpnt
    //         })
    //         setlinelist(lnlst)
    //     }
    //     return () => {
    //         mtd = false;
    //     }
    // }, [props.data.results])


    return (
        <div className="">
            <Head>
                <title>KMHFL - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={true}>
                <div className="w-full grid grid-cols-7 gap-4 p-1 md:px-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-green-700" href="/">Home</a> {'>'}
                                <span className="text-gray-500">Reports</span> {'>'}
                                <span className="text-gray-500">Dynamic Reports</span>
                            </div>
                            {/* <div className="flex flex-wrap items-center justify-evenly gap-x-3 gap-y-0 text-sm md:text-base py-1 hidden">
                                {quickFilters.map((qf, i) => {
                                    return (
                                        <button
                                            key={qf.id + "_" + i}
                                            style={{ paddingTop: '2px', paddingBottom: '2px' }}
                                            className={`bg-gray-100 border rounded-lg shadow-sm px-3 leading-tight font-medium hover:border-green-400 focus:ring-1 focus:ring-blue-500 text-sm ${currentQuickFilter == qf.id ? "bg-green-800 border-green-800 text-green-50" : "text-gray-800 border-gray-300"}`}
                                            onClick={evt => {
                                                setCurrentQuickFilter(qf.id)
                                                let robj = { pathname: '/facilities', query: { qf: qf.id } }
                                                if (qf.id === 'all') {
                                                    router.push(robj)
                                                    return
                                                }
                                                quickFilters.forEach(q_f => {
                                                    if (q_f.id === qf.id) {
                                                        q_f.filters.map(sf => {
                                                            robj.query[sf.id] = sf.value
                                                        })
                                                    }
                                                })
                                                router.push(robj)
                                            }}>
                                            {qf.name}
                                        </button>
                                    )
                                })}
                            </div> */}
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm md:text-base items-center justify-between">
                            <div className="flex items-start justify-start">
                                <h1 className="text-3xl tracking-tight font-bold leading-none flex items-center justify-start gap-x-2">
                                    Dynamic Reports
                                </h1>

                                
                                    <div>
                                        {filters && filters?.error ?
                                            (<div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                <p>No filters.</p>
                                            </div>)
                                            : (
                                                <Accordion sx={{my:3, width:'100%'}} ref={filterAccordianRef}>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1a-content"
                                                                id="panel1a-header"
                                                                >
                                                                
                                                                <h2 className='my-2 font-semibold text-xl text-black flex items-center space-x-2'>
                                                                <FilterIcon className='w-6 h-6 text-black'/>
                                                                <p> Filter Reports By...</p></h2>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <form action="/" className="grid grid-cols-7 gap-2 w-full m-1" onSubmit={ev => {
                                                                    ev.preventDefault()
                                                                    return false
                                                                }}>
                                                                    
                                                                                    {filters && Object.keys(filters).length > 0 &&
                                                                                Object.keys(fltrs).map(ft => (
                                                                                    <div key={ft} className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                                        <label htmlFor={ft} className="text-gray-600 capitalize text-sm">{ft.split('_').join(' ')}</label>
                                                                                        <Select isMulti={multiFilters.includes(ft)} name={ft} defaultValue={drillDown[ft] || ""} id={ft} className="w-full p-1 rounded bg-gray-50"
                                                                                            options={
                                                                                                Array.from(filters[ft] || [],
                                                                                                    fltopt => {
                                                                                                        return {
                                                                                                            value: fltopt.id, label: fltopt.name
                                                                                                        }
                                                                                                    })
                                                                                            }
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={sl => {
                                                                                                let nf = {}
                                                                                                if (Array.isArray(sl)) {
                                                                                                    nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(sl, l_ => l_.value).join(',')
                                                                                                } else if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                                                    nf[ft] = sl.value
                                                                                                } else {
                                                                                                    delete nf[ft]
                                                                                                    // let rr = drillDown.filter(d => d.key !== ft)
                                                                                                    // setDrilldown(rr)
                                                                                                }
                                                                                                setDrillDown({ ...drillDown, ...nf })
                                                                                            }} />
                                                                                    </div>
                                                                                ))}
                                                                    
                                                                    <div  className="col-md-2" >
                                                                        <label htmlFor="collection_date" className="text-gray-600 capitalize text-sm">From date:<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                        <input required type="date" name="from_date" onChange={(e)=>setFromDate(e.target.value)} value={fromDate} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                                    </div>
                                                                    <div  className="col-md-2" >
                                                                        <label htmlFor="collection_date" className="text-gray-600 capitalize text-sm">To date:<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                                        <input required type="date" name="to_date" onChange={(e)=>setToDate(e.target.value)} value={toDate} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                                    </div>
                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Has edits</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="has_edits" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>

                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Approved</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="approved" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>

                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Complete</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="complete" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>

                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Has beds</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="has_beds" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>

                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Has cots</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="has_cots" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>

                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Open 24 hours</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="open_24_hrs" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>

                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Open weekends</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="open_weekends" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>

                                                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Open holidays</label>
                                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="open_holidays" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                                            }} />
                                                                    
                                                                    </div>
                                                                    


                                                                    <div className='row-start-9 col-start-1 flex items-center space-x-3'>
                                                                    <button onClick={ev => {
                                                                        if (Object.keys(drillDown).length > 0) {
                                                                            let qry = Object.keys(drillDown).map(function (key) {
                                                                                let er = ''
                                                                                if (props.path && !props.path.includes(key + '=')) {
                                                                                    er = encodeURIComponent(key) + '=' + encodeURIComponent(drillDown[key]);
                                                                                }
                                                                                return er
                                                                            }).join('&')
                                                                            let op = '?'
                                                                            if (props.path && props.path.includes('?') && props.path.includes('=')) { op = '&' }
                                                                            console.log(props.path)
                                                                            // setDrillDown({})
                                                                            if (router || typeof window == 'undefined') {
                                                                                router.push(props.path + op + qry)
                                                                            } else {
                                                                                if (typeof window !== 'undefined' && window) {
                                                                                    window.location.href = props.path + op + qry
                                                                                }
                                                                            }
                                                                        }

                                                                    

                                                                    }}
                                                                    className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-1 py-1 h-[38px] text-base rounded hover:text-white focus:text-white active:text-white w-1/2 mt-7 whitespace-nowrap text-center">Filter</button>
                        
                                                                    
                                                                    <button className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-1 py-1 h-[38px] text-base rounded hover:text-white focus:text-white active:text-white w-1/2 mt-7 whitespace-nowrap text-cente" onClick={ev => {
                                                                            router.push('/facilities')
                                                                        }}>Clear filters</button>
                                                                    </div>
                                                                    
                                                                </form>
                                                        </AccordionDetails>
                                                </Accordion>  
                                            )
                                        }
                                    </div>

                                <h5 className="text-lg font-medium text-gray-800">
                                    {drillDown && Object.keys(drillDown).length > 0 && !JSON.stringify(Object.keys(drillDown)).includes('ndefined') &&
                                        `Matching ${Object.keys(drillDown).map(k => `${k[0].toLocaleUpperCase()}${k.split('_').join(' ').slice(1).toLocaleLowerCase()}: (${filters[k] ? Array.from(drillDown[k].split(','), j => filters[k].find(w => w.id == j)?.name.split('_').join(' ') || j.split('_').join(' ')).join(', ') || k.split('_').join(' ') : k.split('_').join(' ')})`)?.join(' & ')}`
                                    }
                                    {/* {props?.data?.count && props?.data?.count > 0 && <small className="text-gray-500 ml-2 text-base">{props?.data?.start_index || 0} - {props?.data?.end_index || 0} of {props?.data?.count || 0} </small>} */}
                                </h5>
                                
                            </div>
                            {/* ((((((( dropdown options to download data */}

                            <div>
                                <button className={"flex items-center justify-start rounded bg-green-600 text-center hover:bg-green-900 focus:bg-black text-white font-semibold active:bg-black py-2 px-4 uppercase text-base w-full"} onClick={() => {
                                    gridApi.exportDataAsCsv();
                                    setFromDate(''); 
                                    setToDate('')
                                }}>
                                    <DownloadIcon className="w-4 h-4 mr-1" />
                                    <span>Download Report</span>
                                </button>
                            </div>
                            
                            {/* ))))))) dropdown options to download data */}

                        </div>
                    </div>



                    <aside className="flex flex-col col-span-7 md:col-span-1 p-1 md:h-full hidden">
                        <details className="rounded bg-transparent py-1 text-basez flex flex-col w-full md:stickyz md:top-2z" open>
                            <summary className="flex cursor-pointer w-full bg-white px-2">
                                <h3 className="text-2xl tracking-tight font-bold leading-3">Filters</h3>
                            </summary>
                            <div className="flex flex-col gap-2 p-2">
                                {filters && filters?.error ?
                                    (<div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                        <p>No filters.</p>
                                    </div>)
                                    : (
                                        <form action="/" onSubmit={ev => {
                                            ev.preventDefault()
                                            return false
                                        }}>
                                            {scoped_filters && Object.keys(scoped_filters).length > 0 &&
                                                // Object.keys(scoped_filters).map(ft => (
                                                scoped_filters.map((ft, ky) => (
                                                    <div key={ft + "_" + ky} className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor={ft} className="text-gray-600 capitalize text-xs">{ft.name.split('_').join(' ')}</label>
                                                        <Select isMulti={multiFilters.includes(ft.name)} name={ft.name} defaultValue={drillDown[ft.name] || ""} id={ft.name}instanceId={ft.name} className="w-full p-px rounded bg-gray-50 text-sm"
                                                            options={
                                                                ft.options.map(v => ({ value: v, label: v }))
                                                                // Array.from(filters[ft] || [],
                                                                //     fltopt => {
                                                                //         return {
                                                                //             value: fltopt.id, label: fltopt.name
                                                                //         }
                                                                //     })
                                                            }
                                                            placeholder={ft.name.split('_').join(' ')[0].toUpperCase() + ft.name.split('_').join(' ').slice(1)}
                                                            onChange={sl => {
                                                                let nf = {}
                                                                if (Array.isArray(sl)) {
                                                                    nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(sl, l_ => l_.value).join(',')
                                                                } else if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                    nf[ft] = sl.value
                                                                } else {
                                                                    delete nf[ft]
                                                                    // let rr = drillDown.filter(d => d.key !== ft)
                                                                    // setDrilldown(rr)
                                                                }
                                                                setDrillDown({ ...drillDown, ...nf })
                                                            }} />
                                                    </div>
                                                ))}


                                            <button onClick={ev => {
                                                if (Object.keys(drillDown).length > 0) {
                                                    let qry = Object.keys(drillDown).map(function (key) {
                                                        let er = ''
                                                        if (props.path && !props.path.includes(key + '=')) {
                                                            er = encodeURIComponent(key) + '=' + encodeURIComponent(drillDown[key]);
                                                        }
                                                        return er
                                                    }).join('&')
                                                    let op = '?'
                                                    if (props.path && props.path.includes('?') && props.path.includes('=')) { op = '&' }
                                                    console.log(props.path)
                                                    // setDrillDown({})
                                                    if (router || typeof window == 'undefined') {
                                                        router.push(props.path + op + qry)
                                                    } else {
                                                        if (typeof window !== 'undefined' && window) {
                                                            window.location.href = props.path + op + qry
                                                        }
                                                    }
                                                }
                                            }} className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center">Filter</button>
                                            <div className="w-full flex items-center py-2 justify-center">
                                                <button className="cursor-pointer text-sm bg-transparent text-blue-700 hover:text-black hover:underline focus:text-black focus:underline active:text-black active:underline" onClick={ev => {
                                                    router.push('/facilities')
                                                }}>Clear filters</button>
                                            </div>
                                        </form>
                                    )
                                }
                            </div>
                        </details>
                    </aside>





                    <main className="col-span-7 md:col-span-7 flex flex-col items-center gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        <div className="flex flex-col justify-center items-center px-1 md:px-2 w-full ">
                            {/* <pre>{JSON.stringify(props?.data?.results, null, 2)}</pre> */}
                            <div className="ag-theme-alpine" style={{ minHeight: '100vh', width: '100%' }}>
                                <AgGridReact
                                    // floatingFilter={true}
                                    sideBar={true} //{'filters'}
                                    defaultColDef={{
                                        enableValue: true,
                                        enableRowGroup: true,
                                        enablePivot: true,
                                        sortable: true,
                                        filter: true,
                                    }}
                                    enableCellTextSelection={true}
                                    onGridReady={onGridReady}
                                    rowData={linelist}>
                                        {/* <AgGridColumn field="code" headerName="MFL Code" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" pinned sortable={true} filter={true} />
                                        <AgGridColumn field="officialname" pinned headerName="Official Name" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="operation_status_name" pinned headerName="Operation Status" headerClass="uppercase" filtertype="list" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="approved" headerName="Approved?" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="keph_level_name" headerName="KEPS Level" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="county_name" headerName="County" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="sub_county_name" headerName="Sub-county" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="constituency_name" headerName="Constituency" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="ward_name" headerName="Ward" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="facility_type_name" headerName="Type" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="facility_type_category" headerName="Category" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="owner_name" headerName="Owner" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="owner_type_name" headerName="Owner Type" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="regulatory_body_name" headerName="Regulatory Body" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="beds" headerName="Beds" sortable={true} filter={true} />
                                        <AgGridColumn field="cots" headerName="Cots" sortable={true} filter={true} />
                                        <AgGridColumn field="admission_status_name" headerName="Admission Status" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="service_names" headerName="Services" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="created" headerName="Date Created" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} />
                                        <AgGridColumn field="closed" headerName="Closed?" headerClass="uppercase" cellClass="p-0 text-sm leading-none capitalize" sortable={true} filter={true} /> */}
                                    {headers.map((v_, i) => {
                                        if(v_.length > 3){
                                            return (
                                                <AgGridColumn
                                                    pinned={i < 3}
                                                    filter={true}
                                                    headerClass="uppercase"
                                                    cellClass="p-0 text-sm leading-none capitalize"
                                                    sortable={true}
                                                    key={v_ + "_" + i}
                                                    field={v_}
                                                    headerName={v_.replaceAll("_category","").replaceAll("_name","").split("_").join(" ")}
                                                >
                                                </AgGridColumn>
                                            )
                                        }
                                    })}
                                </AgGridReact>
                                
                                
                            </div>
                        </div>
                    </main>




                    {/* (((((( Floating div at bottom right of page */}
                    <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 1000 results.
                        </p>
                    </div>
                    {/* ))))))) */}
                </div>
            </MainLayout >
        </div>
    )
}   

DynamicReports.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
    const fetchFilters = token => {
        let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county'

        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching filters: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    }

    const fetchData = (token) => {
        let url = API_URL + `/facilities/material/?format=json&access_token=${token}&fields=id,code,name,official_name,regulatory_status_name,updated,facility_type_name,owner_name,county,sub_county_name,rejected,ward_name,keph_level,keph_level_name,constituency_name,is_complete,in_complete_details,approved,is_approved,approved_national_level,created&page_size=1000`
        let query = { 'searchTerm': '' }

        // let current_url = url + '&page_size=100000' //change the limit on prod
        let current_url = url + '&page_size=1000'

    
        // let url = API_URL + '/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level'
      
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }
        let other_posssible_filters = ["owner_type", "service", "facility_type", "county", "service_category", "sub_county", "keph_level", "owner", "operation_status", "constituency", "ward", "has_edits", "is_approved", "is_complete", "number_of_beds", "number_of_cots", "open_whole_day", "open_weekends", "open_public_holidays"]
        other_posssible_filters.map(flt => {
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                url = url.replace('facilities/facilities', 'facilities/facilities') + "&" + flt + "=" + ctx?.query[flt]
            }
        })
        // let current_url = url + '&page_size=25000' //change the limit on prod
        if (ctx?.query?.page) {
            url = `${url}&page=${ctx.query.page}`
        }
        // console.log('running fetchData(' + url + ')')
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return fetchFilters(token).then(ft => {
                    return {
                        data: json, query, filters: { ...ft }, path: ctx.asPath || '/facilities', current_url: current_url
                    }
                })
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/facilities',
                    current_url: ''
                }
            })
    }

    return checkToken(ctx.req, ctx.res).then(t => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token
            return fetchData(token).then(t => t)
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
                query: {},
                path: ctx.asPath || '/facilities',
                current_url: ''
            }
        }, 1000);
    })

}

export default DynamicReports