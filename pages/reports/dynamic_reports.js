import Head from 'next/head'
// import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon, FilterIcon } from '@heroicons/react/outline'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
// import { CheckBox } from '@mui/icons-material'

import Select from 'react-select'

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
// import { Grid, GridOptions } from '@ag-grid-community/core';
import { LicenseManager, EnterpriseCoreModule } from '@ag-grid-enterprise/core';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ToastContainer, toast } from 'react-toastify';
// import { WindowSharp } from '@mui/icons-material'
// import LoadingAnimation from '../../components/LoadingAnimation'




const DynamicReports = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
 
  
    // const { data, query, path, current_url } = props
    const router = useRouter()
    
    // Temporary fix folty Kirinyaga id
    let filters = (() => {
        let filters = props?.filters
        filters.county[0].id = 'ecbf61a6-cd6d-4806-99d8-9340572c0015' // correct Kirinyaga county id

        return filters
    })()



    console.log({filters});
    let fltrs = filters

    const formRef = useRef(null)
    // const servicesRef = useRef(null)

   

    const [isServiceOptionsUpdate, setIsServiceOptionUpdate] = useState(false)
    const [serviceOptions, setServiceOptions] = useState([])


    const [isSubCountyOptionsUpdate, setIsSubCountyOptionsUpdate] = useState(false)
    const [subCountyOptions, setSubCountyOptions] = useState([])

    const [isConstituencyOptionsUpdate, setIsConstituencyOptionsUpdate] = useState(false)
    const [constituencyOptions, setConstituencyOptions] = useState([])

    const [isWardOptionsUpdate, setIsWardOptionsUpdate] = useState(false)
    const [wardOptions, setWardOptions] = useState([])

    const [isAccordionExpanded, setIsAccordionExpanded] = useState(true)
    const [isLoading, setIsLoading] = useState(false)



    // console.log({fltrs, filters})

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

  

    let qf = props?.query?.qf || 'all'
    // let [currentQuickFilter, setCurrentQuickFilter] = useState(qf)
    let [drillDown, setDrillDown] = useState({})
    let multiFilters = ['service_category', 'service', 'county', 'subcounty', 'ward', 'constituency']
   


    let headers = [
        "code", "official_name", "operation_status_name", "approved", "keph_level_name", "facility_type_name", "facility_type_parent", "owner_name", "owner_type_name", "regulatory_body_name", "number_of_beds", "number_of_cots", "county_name", "constituency_name", "sub_county_name", "ward_name", "admission_status", "facility_services", "created", "closed",
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

    if (props?.data?.results?.length > 0) {
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
        console.log({api: params.api});
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);

        const lnlst = Array.from(props?.data?.results, row => {
            let dtpnt = {}
            headers.forEach(col => {
                dtpnt[col] = row[col]
            })
            return dtpnt
        })
        setlinelist(lnlst)
        updateData(lnlst)
    };

    useEffect(()=>{
        if( fromDate !=='' && toDate !==''){
            const results = linelist2?.filter(data=>new Date(moment(data.created).format('YYYY/MM/DD')).getTime() >= new Date(moment(fromDate).format('YYYY/MM/DD')).getTime() && new Date(moment(data.created).format('YYYY/MM/DD')).getTime() <= new Date(moment(toDate).format('YYYY/MM/DD')).getTime()).map((r)=>{return r})
            setlinelist(results)
        }else{
            setlinelist(linelist2)
        }
        
      }, [fromDate, toDate])

    const handleAccordionExpand = (ev) => {
        if(isAccordionExpanded){
            setIsAccordionExpanded(false)
        }else{
            setIsAccordionExpanded(true)
        }
        
    }

    useEffect(() => {
        // setIsAccordionExpanded(true)
       
    }, [isServiceOptionsUpdate, isSubCountyOptionsUpdate, isConstituencyOptionsUpdate, isWardOptionsUpdate, linelist, isLoading])



    return (
        <div className="">
            <Head>
                <title>KMHFL - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={true}>
                {/* Toast notifier */}

                {/* <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                /> */}

                <div className="w-full grid grid-cols-7 gap-4 p-1 md:px-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-green-700" href="/">Home</a> {'>'}
                                <span className="text-gray-500">Reports</span> {'>'}
                                <span className="text-gray-500">Dynamic Reports</span>
                            </div>
                           
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm md:text-base items-center justify-between">
                            <div className="flex flex-col items-start justify-start w-full">

                                <h1 className="text-3xl tracking-tight font-bold leading-none flex items-center justify-start gap-x-2">
                                    Dynamic Reports
                                </h1>

                                
                                    <div className="flex flex-row items-center justify-start w-full gap-2">
                                    {filters && filters?.error ?
                                        (<div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                            <p>No filters.</p>
                                        </div>)
                                        : (
                                            <Accordion sx={{my:3, width:'100%'}} expanded={isAccordionExpanded} onChange={handleAccordionExpand}>
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
                                            <form action="/reports/dynamic_reports" className="grid grid-cols-7 gap-2 w-full m-1" ref={formRef} onSubmit={async (ev) => {
                                                ev.preventDefault()
                                                setIsLoading(true)
                                
                                                const fields = 'code,official_name,operation_status,approved,keph_level,facility_type_name,facility_type_parent,owner,owner_type,regulation_body,number_of_beds,number_of_cots,county,constituency,sub_county,ward,admission_status,facility_services,created,closed'
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
                                                   
                                                    // setDrillDown({})
                                                    if (router || typeof window == 'undefined') {
                                                  
                                                        const filterQuery = `${op}${qry}&fields=${fields}`

                                                        try{

                                                            // toast emmiter
                                                            // toast('Filtering ...', {
                                                            //     position: "top-right",
                                                            //     autoClose: 5000,
                                                            //     hideProgressBar: false,
                                                            //     closeOnClick: true,
                                                            //     pauseOnHover: true,
                                                            //     draggable: true,
                                                            //     progress: undefined,
                                                            //     });

                                                            const data = await fetch(`/api/filters/filter/?filter_query=${filterQuery}`)
                                                           data.json().then(r => {

                                                                const _lnlst = Array.from(r?.results, row => {
                                                                    let dtpnt = {}
                                                                    headers.forEach(col => {
                                                                        if(col == 'facility_services'){
                                                                            if(row[col].length > 0){
                                                                                row[col].forEach(service => {dtpnt[col] = service.service_name})
                                                                            }
                                                                           
                                                                        }
                                                                        else{
                                                                            dtpnt[col] = row[col]
                                                                        }
                                                                        
                                                                    })
                                                                    return dtpnt
                                                                })

                                                                setlinelist(_lnlst)
                                                           })

                                                        //    Close Accordion

                                                         setIsLoading(false)
                                                         setIsAccordionExpanded(false)
                                                        }
                                                        catch(e) {
                                                            console.error(e.message)
                                                        }

                                                        // router.push(props.path + op + qry)
                                                    } else {
                                                        if (typeof window !== 'undefined' && window) {
                                                            window.location.href = props.path + op + qry
                                                        }
                                                    }
                                                }

                                            

                                            }}>
                                                 
                                                                {filters && Object.keys(filters).length > 0 &&
                                                            (() => {
                                                             const sorted = Object.keys(fltrs).sort()  

                                                             const sortOrder = [1, 9, 0, 10, 2, 3, 4, 5, 6, 8 , 7]

                                                            return sortOrder.map((v, i) => sorted.indexOf(sorted[i]) === v ? sorted[i] : sorted[v] )

                                                            })(fltrs).map(ft => (
                                                                <div key={ft} className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                    <label htmlFor={ft} className="text-gray-600 capitalize text-sm">{ft.split('_').join(' ')}</label>

                                                                    {

                                                                      (() => {
                                                                        // let serviceOptions = [];
                                                                        switch(ft) {
                                                                        
                                                                            case 'service_category':


                                                                                const handleServiceCategoryChange = async (ev) => {

                                                                                    
                                                                                    try{
                                                                                        const data = await fetch(`/api/filters/services/?category=${ev.value}`)
                                                                                       data.json().then(r => {
                                                                                       const options = []
                                                                                       r.results.forEach(({id, name}) => {
                                                                                            options.push({
                                                                                                value: id,
                                                                                                label: name
                                                                                            })  
                                                                                       } )  

                                                                                       console.log({options});

                                                                                       setServiceOptions(options)
                                                                                       setIsServiceOptionUpdate(!isServiceOptionsUpdate)
                                                                                    })

                                                                                    let nf = {}
                                                                                    if (Array.isArray(ev)) {
                                                                                        nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(ev, l_ => l_.value).join(',')
                                                                                    } else if (ev && ev !== null && typeof ev === 'object' && !Array.isArray(ev)) {
                                                                                        nf[ft] = ev.value
                                                                                    } else {
                                                                                        delete nf[ft]
                                                                                        
                                                                                    }
                                                                                    setDrillDown({ ...drillDown, ...nf })
                                                                                    }
                                                                                    catch(e) {
                                                                                        console.log(e.message)
                                                                                    }
                                                                                   
                                                                                   
    
                                                                                }
                                                                               
                                                                                return (
                                                                                       <Select 
                                                                                        id={ft}
                                                                                        name={ft}
                                                                                        className="w-full p-1 rounded bg-gray-50"
                                                                        
                                                                                        options={ 
                                                                                            Array.from(filters[ft] || [],
                                                                                            fltopt => {
                                                                                                return {
                                                                                                    value: fltopt.id, 
                                                                                                    label: fltopt.name
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                        placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                        onChange={handleServiceCategoryChange}
                                                                                    />
                                                                                
                                                                                )
                                                                            
                                                                           
                                                                            
                                                                            case 'service':

                                                                               

                                                                                return (
                                                                                        <Select 
                                                                                        id={ft}
                                                                                        name={ft}
                                                                                       
                                                                                        className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                       
                                                                                        options={serviceOptions}
                                                                                        placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                        onChange={sl => {
                                                                                            let nf = {}
                                                                                            if (Array.isArray(sl)) {
                                                                                                nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(sl, l_ => l_.value).join(',')
                                                                                            } else if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                                                nf[ft] = sl.value
                                                                                            } else {
                                                                                                delete nf[ft]
                                                                                                
                                                                                            }
                                                                                            setDrillDown({ ...drillDown, ...nf })
                                                                                        }}
                                                                                      
                                                                                    />
                                                                                )

                                                                            case 'county':
                                                                                const handleCountyCategoryChange = async (ev) => {

                                                                                    try{ 
                                                                                        const dataSubCounties = await fetch(`/api/filters/subcounty/?county=${ev.value}`)
                                                                                        dataSubCounties.json().then(r => {
                                                                                            const optionsSubCounty = []


                                                                                            r.results.forEach(({id, name}) => {
                                                                                                optionsSubCounty.push({
                                                                                                    value: id,
                                                                                                    label: name
                                                                                                })  
                                                                                            } )
                                                                                        

                                                                                        // sub county    

                                                                                       setSubCountyOptions(optionsSubCounty)
                                                                                       setIsSubCountyOptionsUpdate(!isSubCountyOptionsUpdate)

                                                                                    })

    
                                                                                    }
                                                                                    catch(e) {
                                                                                        console.error(e.message)
                                                                                    }

                                                                                    try {
                                                                                        const dataConstituencies = await fetch(`/api/filters/constituency/?county=${ev.value}`)
                                                                                        dataConstituencies.json().then(r => {
                                                                                        const optionsConstituency = []

                                                                                        r.results.forEach(({id, name}) => {
                                                                                            optionsConstituency.push({
                                                                                                value: id,
                                                                                                label: name
                                                                                            })  
                                                                                            } )  

                                                                                  
                                                                                        // set constituencies

                                                                                        setConstituencyOptions(optionsConstituency)
                                                                                        setIsConstituencyOptionsUpdate(!isConstituencyOptionsUpdate)

                                                                                    })

                                                                                    let nf = {}
                                                                                    if (Array.isArray(ev)) {
                                                                                        nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(ev, l_ => l_.value).join(',')
                                                                                    } else if (ev && ev !== null && typeof ev === 'object' && !Array.isArray(ev)) {
                                                                                        nf[ft] = ev.value
                                                                                    } else {
                                                                                        delete nf[ft]
                                                                                        
                                                                                    }
                                                                                    setDrillDown({ ...drillDown, ...nf })

                                                                                    }
                                                                                    catch(e) {
                                                                                        console.error(e.message)
                                                                                    }
                                                                                   
                                                                                }


                                                                                return (
                                                                                    <Select 
                                                                                    id={ft}
                                                                                    name={ft}
                                                                                    
                                                                                    className="w-full p-1 rounded bg-gray-50"
                                                                               
                                                                                    options={ 
                                                                                        Array.from(filters[ft] || [],
                                                                                        fltopt => {
                                                                                            return {
                                                                                                value: fltopt.id, 
                                                                                                label: fltopt.name
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                    onChange={handleCountyCategoryChange}
                                                                                    
                                                                                    />
                                                                                )

                                                                            case 'sub_county':
                                                                               

                                                                                return (
                                                                                    <Select 
                                                                                    id={ft}
                                                                                    name={ft}
                                                                                   
                                                                                    className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                  
                                                                                    options={subCountyOptions}
                                                                                    placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                    onChange={ev => {
                                                                                       
                                                                                        if(subCountyOptions !== []){
                                                                                            let nf = {}
                                                                                            if (Array.isArray(ev)) {
                                                                                                nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(ev, l_ => l_.value).join(',')
                                                                                            } else if (ev && ev !== null && typeof ev === 'object' && !Array.isArray(ev)) {
                                                                                                nf[ft] = ev.value
                                                                                            } else {
                                                                                                delete nf[ft]
                                                                                                
                                                                                            }
                                                                                            setDrillDown({ ...drillDown, ...nf })
                                                                                        }
                                                                                    }
                                                                                    }
                                                                                  
                                                                                />
                                                                                )

                                                                            case 'constituency':
                                                                                const handleConstituencyChange = async (ev) => {

                                                                                    try{ 
                                                                                        const dataConstituencies = await fetch(`/api/filters/ward/?constituency=${ev.value}`)
                                                                                        dataConstituencies.json().then(r => {
                                                                                            const optionsWard = []
                                                                                         
                                                                                            r.results.forEach(({id, name}) => {
                                                                                                optionsWard.push({
                                                                                                    value: id,
                                                                                                    label: name
                                                                                                })  
                                                                                            } )
                                                                                        

                                                                                        // sub county    

                                                                                       setWardOptions(optionsWard)
                                                                                       setIsWardOptionsUpdate(!isWardOptionsUpdate)

                                                                                       let nf = {}
                                                                                       if (Array.isArray(ev)) {
                                                                                           nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(ev, l_ => l_.value).join(',')
                                                                                       } else if (ev && ev !== null && typeof ev === 'object' && !Array.isArray(ev)) {
                                                                                           nf[ft] = ev.value
                                                                                       } else {
                                                                                           delete nf[ft]
                                                                                           
                                                                                       }
                                                                                       setDrillDown({ ...drillDown, ...nf })

                                                                                    })

    
                                                                                    }
                                                                                    catch(e) {
                                                                                        console.error(e.message)
                                                                                    }

                                                                                }
                                                                               
                                                                                    return (
                                                                                        <Select 
                                                                                        id={ft}
                                                                                        name={ft}
                                                                                       
                                                                                        className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                        options={constituencyOptions}
                                                                                       
                                                                                        placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                        onChange={handleConstituencyChange}
                                                                                      
                                                                                        />
                                                                                    )
                                                                            
                                                                                case 'ward':
                                                                                        
                                                                               
                                                                                        return (
                                                                                            <Select 
                                                                                            id={ft}
                                                                                            name={ft}
                                                                                           
                                                                                            className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                            options={wardOptions}
                                                                                           
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={sl => {
                                                                                                let nf = {}
                                                                                                if (Array.isArray(sl)) {
                                                                                                    nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(sl, l_ => l_.value).join(',')
                                                                                                } else if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                                                    nf[ft] = sl.value
                                                                                                } else {
                                                                                                    delete nf[ft]
                                                                                                    
                                                                                                }
                                                                                                setDrillDown({ ...drillDown, ...nf })
                                                                                            }}
                                                                                          
                                                                                            />
                                                                                        )
    
                                                                            default:
    
                                                                               return( <Select 
                                                                                    
                                                                                    isMulti={multiFilters.includes(ft)} name={ft} defaultValue={drillDown[ft] || ""} id={ft} className="w-full p-1 rounded bg-gray-50"
                                                                                    options={
                                                                                        Array.from(filters[ft] || [],
                                                                                            fltopt => {
                                                                                                return {
                                                                                                    value: fltopt.id, 
                                                                                                    label: fltopt.name
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
                                                                                            
                                                                                        }
                                                                                        setDrillDown({ ...drillDown, ...nf })
                                                                                    }} />)
                                                                            }
                                                                      })(ft)
                                                                      
                                                                    }
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
                                       
                                                    <button 
                                                    type='submit'
                                                   
                                                    className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-1 py-1 h-[38px] text-base rounded hover:text-white focus:text-white active:text-white w-1/2 mt-7 whitespace-nowrap text-center">

                                                {
                                                    isLoading ?  
                                                    (
                                                        <svg role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                                        </svg>
                                                    )  :
                                                    'Filter'
                                                }
                                                    </button>
                                                <button className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-1 py-1 h-[38px] text-base rounded hover:text-white focus:text-white active:text-white w-1/2 mt-7 whitespace-nowrap text-cente" onClick={ev => {
                                                       ev.preventDefault()
                                                    //    router.push('/reports/dynamic_reports')
                                                       router.reload()

                                                    //    fields.current.forEach(field => {
                                                           
                                                    //    })
                                                    //    router.push('/reports/dynamic_reports')
                                                                                                    
                                                    }}>Clear filters</button>
                                                </div>
                                                
                                            </form>
                                            </AccordionDetails>
                                                    </Accordion>  
                                        )
                                    }
                                    </div>
                                


                                
                                <h5 className="text-lg font-medium text-gray-800">
                                    {drillDown && Object.keys(drillDown).length > 0 && !JSON.stringify(Object.keys(drillDown)).includes('undefined') &&
                                        `Matching ${Object.keys(drillDown).map(k => `${k[0].toLocaleUpperCase()}${k.split('_').join(' ').slice(1).toLocaleLowerCase()}: (${filters[k] ? Array.from(drillDown[k].split(','), j => filters[k].find(w => w.id == j)?.name.split('_').join(' ') || j.split('_').join(' ')).join(', ') || k.split('_').join(' ') : k.split('_').join(' ')})`)?.join(' & ')}`
                                    }
                                    
                                </h5>
                                
                            </div>
                            {/* ((((((( dropdown options to download data */}
                            <div>
                                <button className={"flex items-center justify-start rounded bg-green-600 text-center hover:bg-green-900 focus:bg-black text-white font-semibold active:bg-black py-2 px-4 uppercase text-base w-full"} onClick={() => {
                                    gridApi.exportDataAsCsv();
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
                                                
                                                scoped_filters.map((ft, ky) => (
                                                    <div key={ft + "_" + ky} className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor={ft} className="text-gray-600 capitalize text-xs">{ft.name.split('_').join(' ')}</label>
                                                        <Select isMulti={multiFilters.includes(ft.name)} name={ft.name} defaultValue={drillDown[ft.name] || ""} id={ft.name}instanceId={ft.name} className="w-full p-px rounded bg-gray-50 text-sm"
                                                            options={
                                                                ft.options.map(v => ({ value: v, label: v }))
                                                            
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
                                            }} className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center">
                                                
                                                Filter
                                                </button>
                                            <div className="w-full flex items-center py-2 justify-center">
                                                <button className="cursor-pointer text-sm bg-transparent text-blue-700 hover:text-black hover:underline focus:text-black focus:underline active:text-black active:underline" onClick={ev => {
                                                    // router.push('/reports/dynamic_reports')
                                                    const fields = formRef.current.children
                                                    console.log({fields})
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
                                        sortable: true,
                                        filter: true,
                                    }}
                                    enableCellTextSelection={true}
                                    onGridReady={onGridReady}
                                    rowData={linelist}>
                                        
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
                                                    headerName={v_.replaceAll("_category","").replaceAll("_name","").replaceAll("official", " official name").split("_").join(" ")}
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

        let url = API_URL + '/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level'
        let query = { 'searchTerm': '' }
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
        let current_url = url + '&page_size=50'
        if (ctx?.query?.page) {
            // console.log({page:ctx.query.page})
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
                        data: json, query, token, filters: { ...ft }, path: ctx.asPath || '/reports/dynamic_reports', current_url: current_url 
                    }
                })
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/reports/dynamic_reports',
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
                window.location.href = '/reports/dynamic_reports'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/reports/dynamic_reports',
                current_url: ''
            }
        }, 1000);
    })

}

export default DynamicReports