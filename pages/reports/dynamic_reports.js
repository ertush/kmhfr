import Head from 'next/head'
// import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon, FilterIcon } from '@heroicons/react/outline'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
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


const DynamicReports = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
 
  
    // const { data, query, path, current_url } = props
    const router = useRouter()
    // Temporary fix folty Kirinyaga id
    let filters = props?.filters

    console.log({filters})
    let fltrs = filters

    const formRef = useRef(null)
    // const servicesRef = useRef(null)

   

    const [isServiceOptionsUpdate, setIsServiceOptionUpdate] = useState(false)
    const [serviceOptions, setServiceOptions] = useState([])

    const [isInfrastructureOptionsUpdate, setIsInfrastructureOptionUpdate] = useState(false)
    const [infrastructureOptions, setInfrastructureOptions] = useState([])

    const [isSpecialityOptionsUpdate, setIsSpecialityOptionUpdate] = useState(false)
    const [specialityOptions, setSpecialityOptions] = useState([])


    const [isSubCountyOptionsUpdate, setIsSubCountyOptionsUpdate] = useState(false)
    const [subCountyOptions, setSubCountyOptions] = useState([])

    const [isConstituencyOptionsUpdate, setIsConstituencyOptionsUpdate] = useState(false)
   

    const [isWardOptionsUpdate, setIsWardOptionsUpdate] = useState(false)
    const [wardOptions, setWardOptions] = useState([])

    const [isAccordionExpanded, setIsAccordionExpanded] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const [filteredKeph, setFilteredKeph] = useState([
        { value: "ed23da85-4c92-45af-80fa-9b2123769f49", label: "Level 6" },
        { value: "7824068f-6533-4532-9775-f8ef200babd1", label: "Level 5" },
        { value: "c0bb24c2-1a96-47ce-b327-f855121f354f", label: "Level 4" },
        { value: "174f7d48-3b57-4997-a743-888d97c5ec31", label: "Level 3" },
        { ivalued: "ceab4366-4538-4bcf-b7a7-a7e2ce3b50d5", label: "Level 2" }
    ])



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
        "code", "official_name", "operation_status_name", "approved", "keph_level_name", "facility_type_name", "facility_type_parent", "owner_name", "owner_type_name", "regulatory_body_name", "number_of_beds", "number_of_cots", "county", "constituency_name", "sub_county_name", "ward_name", "admission_status", "facility_services", "created", "closed",
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


    const lnlst = Array.from(props?.data?.results, row => {
        let dtpnt = {}
        headers.forEach(col => {
            dtpnt[col] = row[col]
        })
        return dtpnt
    })
    const onGridReady = (params) => {
        // console.log({api: params.api});
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);

        setlinelist(lnlst)
        updateData(lnlst)
    };

    const facilityTypeCategories =  [
        {
            value: "87626d3d-fd19-49d9-98da-daca4afe85bf",
            label: "DISPENSARY"
        },
        {
            value: "8949eeb0-40b1-43d4-a38d-5d4933dc209f",
            label: "MEDICAL CLINIC"
        },
        {
            value: "1f1e3389-f13f-44b5-a48e-c1d2b822e5b5",
            label: "HOSPITALS"
        },  
        {
            value: "85f2099b-a2f8-49f4-9798-0cb48c0875ff",
            label: "STAND ALONE"
        },
        {
            value: "0b7f9699-6024-4813-8801-38f188c834f5",
            label: "NURSING HOME"
        },
        {
            value: "9ad22615-48f2-47b3-8241-4355bb7db835",
            label: "HEALTH CENTRE"
        },
        {
            value: "df69577d-b90f-4b66-920a-d0f3ecd95191",
            label: "MEDICAL CENTRE"
        }

   ]

    gridApi?.setRowData(lnlst)

    useEffect(()=>{
        if( fromDate !=='' && toDate !==''){
            const results = linelist2?.filter(data=>new Date(moment(data.created).format('YYYY/MM/DD')).getTime() >= new Date(moment(fromDate).format('YYYY/MM/DD')).getTime() && new Date(moment(data.created).format('YYYY/MM/DD')).getTime() <= new Date(moment(toDate).format('YYYY/MM/DD')).getTime()).map((r)=>{return r})
            setlinelist(results)
        }else{
            setlinelist(linelist2)
        }
        
      }, [fromDate, toDate, filteredKeph])

    const handleAccordionExpand = (ev) => {
        if(isAccordionExpanded){
            setIsAccordionExpanded(false)
        }else{
            setIsAccordionExpanded(true)
        }
        
    }

    let drill = {}
    useEffect(()=>{
        let org_level=JSON.parse(localStorage.getItem('dd_owners'))
        if(router.query !== undefined && router.query !== null){
            drill[router.query.level] = router.query.id
             setDrillDown({...drillDown, ...drill})
             if(org_level !== null && org_level !== undefined){
                if(org_level['county']!== '' || org_level['sub_county'] !== '' || org_level['ward'] !== ''){
        
                    Object.keys(org_level).forEach(key => {
                        drill[key] = org_level[key]
                        setDrillDown({...drillDown, ...drill})
                    })
                }
         }}
 
     },[filteredKeph])
     

//  console.log(drillDown)
    let dr ='' 
    if (typeof window !== 'undefined') {
        dr =JSON.parse(localStorage.getItem('dd_owners'))
    }
    useEffect(async()=>{
        if(dr !== null && dr !== undefined){
            
            // setting sub-county options based on county drill_down
            if(dr?.county !== ''){
                
                const drilldownData =  await fetch(`/api/filters/subcounty/?county=${dr.county}`)
                drilldownData.json().then(r => {
                        const optionsSubCounty = []
            
            
                        r.results.forEach(({id, name}) => {
                            optionsSubCounty.push({
                                value: id,
                                label: name
                            })  
                        } )   
            
                    setSubCountyOptions(optionsSubCounty)
            })
            }
            // setting ward options based on sub-county drill_down
            if(dr?.sub_county !== ''){
                
                const drilldownData =  await fetch(`/api/filters/ward/?sub_county=${dr.sub_county}`)
                drilldownData.json().then(r => {
                    const optionsWard = []
                 
                    r.results.forEach(({id, name}) => {
                        optionsWard.push({
                            value: id,
                            label: name
                        })  
                    } )  
    
               setWardOptions(optionsWard)
            })
            }
        }

    }, [])

    useEffect(() => {
        // setIsAccordionExpanded(true)
       
    }, [isServiceOptionsUpdate, isSubCountyOptionsUpdate, isConstituencyOptionsUpdate, isWardOptionsUpdate, linelist, isLoading, filteredKeph])


    return (
        <div className="">
            <Head>
                <title>KHMFL - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={true}>
                {/* Toast notifier */}


                <div className="w-full grid grid-cols-7 gap-4 p-1 md:px-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <Link className="text-green-700" href="/">Home</Link> {'/'}
                                <span className="text-green-700">Reports</span> {'/'}
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
                                        (
                                            <div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                <p>No filters.</p>
                                            </div>
                                        )
                                        : (
                                            <Accordion sx={{my:3, width:'100%', boxShadow:'none', border:'solid 1px #d5d8de', borderRadius:1}} expanded={isAccordionExpanded} onChange={handleAccordionExpand}>
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
                                    
                                                    const fields = 'code,official_name,operation_status,approved,keph_level,facility_type_name,facility_type_parent,owner,owner_type,regulation_body,number_of_beds,number_of_cots,county,constituency,sub_county,ward,admission_status,facility_services,facility_infrastructure,facility_humanresources,created,closed'
                                                    if (Object.keys(drillDown).length > 0) {
                                                        let qry = Object.keys(drillDown).map(function (key) {
                                                            let er = (key) + '=' + (drillDown[key]);
                                                            return er
                                                        }).join('&')
                                                        let op = '?'

                                                        // if (props.path && props.path.includes('?') && props.path.includes('=')) { op = '&' }
                                                        // setDrillDown({})
                                                        if (router || typeof window == 'undefined') {
                                                    
                                                            const filterQuery = `${qry}&fields=${fields}`

                                                            try{

                                                            
                                                                const data = await fetch(`/api/filters/filter/?query=${JSON.stringify(drillDown)}&fields=${fields}`)
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
                                                                console.log({filters})
                                                                const sorted = Object.keys(fltrs).sort()  

                                                                const sortOrder = [1, 13, 14, 2, 5, 6, 8, 7, 10, 9, 4, 3, 12, 11]

                                                                return sortOrder.map((v, i) => sorted.indexOf(sorted[i]) === v ? sorted[i] : sorted[v] )

                                                                })(fltrs).map(ft => (
                                                                    <div key={ft} className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                        
                                                                        <label htmlFor={ft} className="text-gray-600 capitalize text-sm">{ft.split('_').join(' ')}</label>

                                                                        {

                                                                        (() => {
                                                                            // let serviceOptions = [];
                                                                            switch(ft) {
                                                                            
                                                                                // Service Category
                                                                                case 'service_category':

                                                                                    const handleServiceCategoryChange = async (ev) => {

                                                                                      
                                                                                        try{
                                                                                            const data = await fetch(`/api/filters/services/?category=${ev.value}`)
                                                                                        data.json().then(r => {
                                                                                        const options = []
                                                                                        r.results.forEach(({id, name}) => {
                                                                                                options.push({
                                                                                                    value: id,
                                                                                                    label: name.toLocaleLowerCase()
                                                                                                })  
                                                                                        } )  


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
                                                                                                        label: fltopt.name.toUpperCase()
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={handleServiceCategoryChange}
                                                                                        />
                                                                                    
                                                                                    )
                                                                                
                                                                            
                                                                                // Service
                                                                                case 'service':

                                                                                

                                                                                    return (
                                                                                            <Select 
                                                                                            id={ft}
                                                                                            name={ft}
                                                                                            isMulti
                                                                                            
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
                                                                                
                                                                                // Infrastructure  Category
                                                                                case 'infrastructure_category':

                                                                                    const handleInfrastructureCategoryChange = async (ev) => {

                                                                                        
                                                                                        try{
                                                                                            const data = await fetch(`/api/filters/infrastructure/?category=${ev.value}`)
                                                                                            data.json().then(r => {
                                                                                            const options = []
                                                                                            r.results.forEach(({id, name}) => {
                                                                                                options.push({
                                                                                                    value: id,
                                                                                                    label: name.toLocaleLowerCase()
                                                                                                })  
                                                                                            } )  


                                                                                            setInfrastructureOptions(options)
                                                                                            setIsInfrastructureOptionUpdate(!isInfrastructureOptionsUpdate)
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
                                                                                                        label: fltopt.name.toUpperCase()
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={handleInfrastructureCategoryChange}
                                                                                        />
                                                                                    
                                                                                    )
                                                                                
                                                                                
                                                                                // Infrastructure
                                                                                case 'infrastructure':

                                                                                    return (
                                                                                            <Select 
                                                                                            id={ft}
                                                                                            name={ft}
                                                                                            isMulti
                                                                                            
                                                                                            className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                            
                                                                                            options={infrastructureOptions}
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={sl => {
                                                                                                sl.preventDefault()
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

                                                                                // Speciality Category
                                                                                case 'speciality_category':

                                                                                    const handleSpecialityCategoryChange = async (ev) => {
                                                                                    
                                                                                        
                                                                                        try{
                                                                                            const data = await fetch(`/api/filters/speciality/?category=${ev.value}`)
                                                                                            data.json().then(r => {
                                                                                            const options = []
                                                                                            r.results.forEach(({id, name}) => {
                                                                                                options.push({
                                                                                                    value: id,
                                                                                                    label: name.toLocaleLowerCase()
                                                                                                })  
                                                                                            } )  


                                                                                            setSpecialityOptions(options)
                                                                                            setIsSpecialityOptionUpdate(!isSpecialityOptionsUpdate)
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
                                                                                                        label: fltopt.name.toUpperCase()
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={handleSpecialityCategoryChange}
                                                                                        />
                                                                                    
                                                                                    )
                                                                                
                                                                                
                                                                                // Speciality
                                                                                case 'speciality':

                                                                                    
                                                                                    return (
                                                                                            <Select 
                                                                                            id={ft}
                                                                                            name={ft}
                                                                                            isMulti
                                                                                            
                                                                                            className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                            
                                                                                            options={specialityOptions}
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={sl => {
                                                                                                sl.preventDefault()
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

                                                                                // County
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

                                                                                    const options = Array.from(filters[ft] || [],
                                                                                        fltopt => {
                                                                                            return {
                                                                                                value: fltopt.id, 
                                                                                                label: fltopt.name
                                                                                            }
                                                                                        })
                                                                                    
                                                                                        if(ft === 'county' || ft == 'sub_county' || ft == 'constituency') options.unshift({
                                                                                            value:'#',
                                                                                            label:'All'
                                                                                        })



                                                                                    return (
                                                                                        <Select 
                                                                                        id={ft}
                                                                                        name={ft}
                                                                                        
                                                                                        className="w-full p-1 rounded bg-gray-50"
                                                                                
                                                                                        options={options}

                                                                                        placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                        value={
                                                                                        
                                                                                            {
                                                                                                value: drillDown[ft] || dr?.county || '',
                                                                                                label: filters[ft].find(ct=> ct.id== drillDown[ft])?.name || filters[ft].find(ct=> ct.id== dr?.county)?.name || ''
                                                                                            }
                                                                                        }
                                                                                        onChange={handleCountyCategoryChange}
                                                                                        
                                                                                        />
                                                                                    )

                                                                                // Sub County
                                                                                case 'sub_county':
                                                                                

                                                                                    return (
                                                                                        <Select 
                                                                                        id={ft}
                                                                                        name={ft}
                                                                                    
                                                                                        className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                    
                                                                                        options={subCountyOptions}
                                                                                        value={
                                                                                        
                                                                                            {
                                                                                                value: drillDown[ft] || dr?.sub_county || '', 
                                                                                                label: filters[ft].find(ct=> ct.id== drillDown[ft])?.name || filters[ft].find(ct=> ct.id== dr?.sub_county)?.name || ''
                                                                                            }
                                                                                        }
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

                                                                                // Constitunecy
                                                                                case 'constituency':
                                                                                    const handleConstituencyChange = async (ev) => {

                                                                                        try{ 
                                                                                            const dataConstituencies = await fetch(`/api/filters/ward/?sub_county=${ev.value}`)
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
                                                                                            options={subCountyOptions}
                                                                                            value={
                                                                                        
                                                                                                {
                                                                                                    value: drillDown[ft] || dr?.sub_county || '', 
                                                                                                    label: filters[ft].find(ct=> ct.id== drillDown[ft])?.name || filters[ft].find(ct=> ct.id== dr?.sub_county)?.name || ''
                                                                                                }
                                                                                            }
                                                                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                            onChange={handleConstituencyChange}
                                                                                        
                                                                                            />
                                                                                        )
                                                                                
                                                                                    // Ward
                                                                                    case 'ward':
                                                                                            
                                                                                
                                                                                            return (
                                                                                                <Select 
                                                                                                id={ft}
                                                                                                name={ft}
                                                                                            
                                                                                                className="w-full p-1 rounded bg-gray-50 col-start-1"
                                                                                                options={wardOptions}
                                                                                                value={
                                                                                        
                                                                                                    {
                                                                                                        value: drillDown[ft] || dr?.ward || '',
                                                                                                        label: filters[ft].find(ct=> ct.id== drillDown[ft])?.name || filters[ft].find(ct=> ct.id== dr?.ward)?.name || ''
                                                                                                    }
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
                                                                                                }}
                                                                                            
                                                                                                />
                                                                                            )
        
                                                                                default:

                                                                                return( <Select 
                                                                                        
                                                                                        isMulti={multiFilters.includes(ft)} name={ft} defaultValue={drillDown[ft] || ""} id={ft} className="w-full p-1 rounded bg-gray-50"
                                                                                        options={
                                                                                            
                                                                                        ft === 'keph_level' ?
                                                                                        filteredKeph
                                                                                        :
                                                                                        facilityTypeCategories
                                                                                            
                                                                                        /* Array.from(filters[ft] || [],
                                                                                                fltopt => {
                                                                                                    return {
                                                                                                        value: fltopt.id, 
                                                                                                        label: fltopt.name
                                                                                                    }
                                                                                                })
                                                                                            */
                                                                                    
                                                                                        }
                                                                                        value={
                                                                                    
                                                                                        {
                                                                                            value: drillDown[ft] || router?.query?.id || '', 
                                                                                            label: filters[ft].find(ct=> ct.id== drillDown[ft])?.name || filters[ft].find(ct=> ct.id== router?.query?.id)?.name || ''
                                                                                            }
    
                                                                                        }
                                                                                        placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                        onChange={sl => {

                                                                                            // Hospital Keph Level Validation
                                                                                    
                                                                                            if(ft === 'facility_type'){
                                                                                                
                                                                                                if(sl.label === 'MEDICAL CENTRE') console.log({sl})

                                                                                                switch (sl.label){

                                                                                                    case 'HOSPITALS':
                                                                                                        setFilteredKeph([
                                                                                                            { value: "ed23da85-4c92-45af-80fa-9b2123769f49", label: "Level 6" },
                                                                                                            { value: "7824068f-6533-4532-9775-f8ef200babd1", label: "Level 5" },
                                                                                                            { value: "c0bb24c2-1a96-47ce-b327-f855121f354f", label: "Level 4" },
                                                                                                    ])

                                                                                                    break;

                                                                                                    case 'DISPENSARY':
                                                                                                        setFilteredKeph([
                                                                                                            { value: "ceab4366-4538-4bcf-b7a7-a7e2ce3b50d5", label: "Level 2" }
                                                                                                        ])

                                                                                                        break;

                                                                                                    case 'STAND ALONE':
                                                                                                        
                                                                                                        setFilteredKeph([
                                                                                                            { value: "ceab4366-4538-4bcf-b7a7-a7e2ce3b50d5", label: "Level 2" }
                                                                                                        ])

                                                                                                        break;

                                                                                                    case 'MEDICAL CENTRE':
                                                                                                        console.log({ft})
                                                                                                        setFilteredKeph([
                                                                                                            { value: "174f7d48-3b57-4997-a743-888d97c5ec31", label: "Level 3" }
                                                                                                        ])

                                                                                                        break;

                                                                                                    case 'HEALTH CENTRE':
                                                                                                        setFilteredKeph([
                                                                                                            { value: "174f7d48-3b57-4997-a743-888d97c5ec31", label: "Level 3" }
                                                                                                        ])

                                                                                                        break;

                                                                                                    case 'NURSING HOME':
                                                                                                        setFilteredKeph([
                                                                                                            { value: "ceab4366-4538-4bcf-b7a7-a7e2ce3b50d5", label: "Level 2" }
                                                                                                        ])

                                                                                                        break;

                                                                                                    case 'MEDICAL CLINIC':
                                                                                                        setFilteredKeph([
                                                                                                            { value: "ceab4366-4538-4bcf-b7a7-a7e2ce3b50d5", label: "Level 2" }
                                                                                                        ])

                                                                                                        break;
                                                                                                
                                                                                                }
                                                                                                
                                                                                                
                                                                                            }

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
                                                        <label htmlFor="collection_date" className="text-gray-600 capitalize text-sm">From date:</label>
                                                        <input  type="date" name="from_date" onChange={(e)=> { e.preventDefault(); setFromDate(e.target.value)}} value={fromDate} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>
                                                    <div  className="col-md-2" >
                                                        <label htmlFor="collection_date" className="text-gray-600 capitalize text-sm">To date:</label>
                                                        <input  type="date" name="to_date" onChange={(e)=> {e.preventDefault(); setToDate(e.target.value)}} value={toDate} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                    <div className='col-md-2 flex-col  items-start'>
                                                        {/* Has ICU Beds */}
                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="has_icu_beds" className="text-gray-700 capitalize text-sm flex-grow">Has ICU beds</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_icu_beds" id="has_icu_beds" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>

                                                        {/* Has HDU Beds */}
                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                            <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Has HDU beds</label>
                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_hdu_beds" id="has_hdu_beds" onChange={ev => {
                                                                ev.preventDefault()
                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                            }} />
                                                    
                                                        </div>  

                                                        {/* Has Martenity Beds */}
                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                            <label htmlFor="has_martenity_beds" className="text-gray-700 capitalize text-sm flex-grow">Has Martenity beds</label>
                                                            <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_martenity_beds" id="has_martenity_beds" onChange={ev => {
                                                                ev.preventDefault()
                                                                setDrillDown({ ...drillDown, 'has_edits': true })
                                                            }} />
                                                    
                                                        </div> 
                                                    </div>
                                                    
                                                    <div className='col-md-2 flex-col  items-start'>

                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="approved" className="text-gray-700 capitalize text-sm flex-grow">Approved</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="approved" id="approved" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>

                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Complete</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="complete" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>

                                                    

                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="has_cots" className="text-gray-700 capitalize text-sm flex-grow">Has cots</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_cots" id="has_cots" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>
                                                    </div>

                                                    <div className='col-md-2 flex-col  items-start'>
                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="open_24_hrs" className="text-gray-700 capitalize text-sm flex-grow">Open 24 hours</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="open_24_hrs" id="open_24_hrs" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>

                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="open_weekends" className="text-gray-700 capitalize text-sm flex-grow">Open weekends</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="open_weekends" id="open_weekends" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>

                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="open_holidays" className="text-gray-700 capitalize text-sm flex-grow">Open holidays</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="open_holidays" id="open_holidays" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>
                                                    </div>

                                                    <div className='col-md-2 flex-col  items-start'>
                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="open_24_hrs" className="text-gray-700 capitalize text-sm flex-grow">Is classified</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="open_24_hrs" id="open_24_hrs" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>

                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="open_weekends" className="text-gray-700 capitalize text-sm flex-grow">has general theatre</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="open_weekends" id="open_weekends" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>

                                                        <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                                                <label htmlFor="open_holidays" className="text-gray-700 capitalize text-sm flex-grow">has maternity theatre</label>
                                                                <input type="checkbox" value={true} defaultChecked={props?.query?.has_edits === "true"} name="open_holidays" id="open_holidays" onChange={ev => {
                                                                    ev.preventDefault()
                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                }} />
                                                        
                                                        </div>
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
                                                    <button  className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-1 py-1 h-[38px] text-base rounded hover:text-white focus:text-white active:text-white w-1/2 mt-7 whitespace-nowrap text-cente" onClick={ev => {
                                                        ev.preventDefault()
                                                            setDrillDown({})
                                                            setSubCountyOptions([])
                                                            setWardOptions([])
                                                            localStorage.setItem('dd_owners', JSON.stringify({county: '', sub_county:'', ward: ''}));
                                                            router.push('/reports/dynamic_reports')
                                                            // router.reload()
                                                                                                        
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
                                {/* <button className={"flex items-center justify-start rounded bg-green-600 text-center hover:bg-green-900 focus:bg-black text-white font-semibold active:bg-black py-2 px-4 uppercase text-base w-full"} onClick={() => {
                                    gridApi.exportDataAsCsv();
                                }}>
                                    <DownloadIcon className="w-4 h-4 mr-1" />
                                    <span>Download Report</span>
                                </button> */}

                                <button className="flex items-center bg-green-600 text-white rounded justify-start text-center font-medium active:bg-gray-200 p-2" onClick={(e) => {
                                                e.preventDefault()
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += '&format=excel' } else { dl_url += '?format=excel' }
                                                console.log('Downloading CSV. ' + dl_url || '')
                                                window.open(dl_url, '_blank', 'noopener noreferrer')
                                            }}
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span>Export</span>
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
                                                ev.preventDefault()
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
                                                    // console.log(props.path)
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
                                                    // console.log({fields})
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
    // console.log(ctx.query)
    const fetchFilters = token => {
        let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county%2Cinfrastructure%2Cinfrastructure_category%2Cspeciality%2Cspeciality_category'

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
        let url= ''
        let dr ='' 
        if (typeof window !== 'undefined') {
            dr =JSON.parse(localStorage.getItem('dd_owners'))
          }
        if( ctx?.query?.type =='facilities_by_owners' || ctx?.query?.type=='facilities_by_owner_categories' || ctx?.query?.type == 'facilities_details' || ctx?.query?.type == 'facilities_by_keph_levels'){
            url = API_URL + `/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level&${ctx.query.level}=${ctx.query.id}&county=${dr.county}&sub_county=${dr.sub_county}&ward=${dr.ward}`

        }else if(ctx?.query?.type =='facilities_count'){
            url = API_URL + `/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level&${ctx.query.level}=${ctx.query.id}`

        }
        else{

            url = API_URL + '/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level'
        }
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
       
        let current_url = url + '&page_size=10000'
        if (ctx?.query?.page) {
          
            url = `${url}&page=${ctx.query.page}`
        }

        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return fetchFilters(token).then(ft => {
                    // console.log({ft})
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