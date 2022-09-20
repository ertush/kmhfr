import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { SearchIcon, DotsHorizontalIcon,PlusIcon,UsersIcon } from "@heroicons/react/solid";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from '@ag-grid-enterprise/core';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const Users = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter()

    const LinkCellRenderer = (params) =>{
        return(
            <Link
            href={{ pathname: `/reports/by_county/`,
            query: { id: params.data.county } }}
    
            ><a>{params.value}</a></Link>
        )}

    let columnDefs= [
        {headerName: "County", field: "county_name",   cellRenderer: "LinkCellRenderer"},
        {headerName: "Beds", field: "beds"},
        {headerName: "Cots", field: "cots"},
        {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
            return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
            onClick={() => {
                router.push({
                    pathname: `/reports/by_facility/`,
                    query: { id: params.data.county, level: 'county' }
                })
            }}
            > View Facilities </button>
          },}
    ]

	const [openHFR, setOpenHFR] = useState(false);
    const [openAdmin, setOpenAdmin] = useState(false);
    const [openCHUs, setOpenCHUs] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [users, setUsers]=useState([])
    const [columns, setColumns]=useState([
        {headerName: "County", field: "county_name",   cellRenderer: "LinkCellRenderer"},
        {headerName: "Beds", field: "beds"},
        {headerName: "Cots", field: "cots"},
        {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
            return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
            onClick={() => {
                router.push({
                    pathname: `/reports/by_facility/`,
                    query: { id: params.data.county, level: 'county' }
                })
            }}
            > View Facilities </button>
          },}
    ])

	const handleHFRUnitsClick = () => {
		setOpenHFR(!openHFR);
	}
    const handleAdminClick = () => {
		setOpenAdmin(!openAdmin);
	}
    const handleCHUClick = () => {
		setOpenCHUs(!openCHUs);
	}
     
    const onGridReady = (params) => {
     
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        const lnlst=  props.data.results.map((county_beds)=>{
            return {
                ...county_beds,
                county_name: county_beds.county_name,
                beds: county_beds.beds,
                cots: county_beds.cots,
                actions: (<a href="#">View</a>)
            }
            
        })
     
        setUsers(lnlst)
        updateData(lnlst)
    };

    const handleClick =(params)=>{
        console.log(params)
        fetch(`/api/common/submit_form_data/?path=${params}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'GET' 
        })
        .then(res => res.json()).then(res=>{
            let linelist =[]
            switch (params) {
                case 'beds_cots':
                    linelist=  res.results.map((county_beds)=>{
                        return {
                            ...county_beds,
                            area_name: county_beds.area_name,
                            facilities: county_beds.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    break;
                case 'facility_owners':
                    linelist =  res.results.map((facility_owners)=>{
                        return {
                            ...facility_owners,
                            owner: facility_owners.owner_category,
                            facilities: facility_owners.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    break;
                case 'owner_categories':
                    linelist =  res.results.map((facility_owners)=>{
                        return {
                            ...facility_owners,
                            owner: facility_owners.owner,
                            facilities: facility_owners.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    break; //facility_type
                case 'facility_type':
                    linelist =  res.results.map((facility_type)=>{
                        return {
                            ...facility_type,
                            facility_type: facility_type.type_category,
                            facilities: facility_type.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    break;
                case 'keph_level':
                    linelist =  res.results.map((keph)=>{
                        return {
                            ...keph,
                            keph_level: keph.keph_level,
                            facilities: keph.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    break;
                case 'facility_coordinates':
                    linelist =  res.results.map((coordinates)=>{
                        return {
                            ...coordinates,
                            code: coordinates.code,
                            name: coordinates.name,
                            county: coordinates.county_name,
                            sub_county: coordinates.sub_county_name,
                            ward: coordinates.ward_name,
                            lat: coordinates.lat_long !== null? coordinates.lat_long[0] : null,
                            long: coordinates.lat_long !== null? coordinates.lat_long[1] : null,
                        }
                        
                    })
                    setUsers(linelist) 
                    break;
                case 'officers_in_charge':
                    linelist =  res.results.map((officers)=>{
                        return {
                            ...officers,
                            facility_name: officers.facility_name,
                            officer_name: officers.officer_name,
                            job_title: officers.job_title,
                            contacts: officers.contacts.map(c=>{return c.contact_type +': ' + c.contact}).join(','),
                            
                        }
                        
                    })
                    setUsers(linelist) 
                    break;
                case 'admin_offices':
                    linelist =  res.results.map((offices)=>{
                        return {
                            ...offices,
                            county: offices.county_name,
                            sub_county: offices.sub_county_name,
                            first_name: offices.name,
                            // last_name: offices?.job_title,
                            // job_title: offices?.job_title,
                            national: offices.is_national,
                            phone_number: offices?.phone_number,
                            email: offices.email,
                        }
                        
                    })
                    setUsers(linelist) 
                    break;
                case 'chu_count':
                    linelist =  res.results.map((chu)=>{
                        return {
                            ...chu,
                            county: chu.county_name,
                            CHUs: chu.number_of_units,
                            CHVs: chu.chvs,
                            CHEWs: chu.chews,
                            action: (<a href="#">View</a>),
                        }
                        
                    })
                    setUsers(linelist) 
                    break;
                case 'chu_status':
                    linelist =  res.results.map((chu)=>{
                        return {
                            ...chu,
                            status: chu.status_name,
                            CHUs: chu.number_of_units,
                            action: (<a href="#">View</a>),
                        }
                        
                    })
                    setUsers(linelist) 
                    break;
                default: 
                    break;
            }
        })
        
    }
    console.log(users);

    return (
        <div className="">
            <Head>
                <title>KMHFL - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1 md:mx-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-green-700" href="/">Home</a> {'>'}
                                <span className="text-gray-500">Static Reports</span> 
                            </div>
                            <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    <UsersIcon className='ml-2 h-5 w-5'/> 
                                    {'Manage Users'}
                                </h2>
                                <button className='rounded bg-green-600 p-2 text-white flex items-center text-lg font-semibold'
                                onClick={() => {router.push('/users/add_user')}} 
                                >
                                    {`Add User `}
                                    <PlusIcon className='text-white ml-2 h-5 w-5'/>
                                </button>
                        </div>
                        </div>
                    </div>
                    <div className='col-span-1 w-full col-start-1 h-auto border-r-2 border-gray-300'>
						
                        <List
                        sx={{ width: '100%', bgcolor: 'background.paper', flexGrow:1 }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                Resources
                            </ListSubheader>
                        }
                        >	
                            {/* Health Facility Reports*/}
							<ListItemButton onClick={handleHFRUnitsClick}>
								<ListItemText primary="HealthFacility Reports" />
								{openHFR ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse in={openHFR} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
                                    {/* <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'county' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code']); setResource('counties'); setResourceCategory('AdminUnits'); setTitle('counties'); setAddBtnLabel('county');}}>
                                        <ListItemText primary="Counties" />
                                    </ListItemButton> */}
                                    <ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Beds and Cots"/>
									</ListItemButton>
									<ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('beds_cots'); setColumns([
                                            {headerName: "County", field: "area_name",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Number of Facilities", field: "facilities"},
                                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                                onClick={() => {
                                                    router.push({
                                                        pathname: `/reports/by_facility/`,
                                                        query: { id: params.data.county, level: 'county' }
                                                    })
                                                }}
                                                > View Facilities </button>
                                            },}])}}>
										<ListItemText primary="Facilities Count" />
									</ListItemButton>
								
                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('facility_owners'); setColumns([
                                            {headerName: "Owner", field: "owner",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Number of Facilities", field: "facilities"},
                                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                                onClick={() => {
                                                    router.push({
                                                        pathname: `/reports/by_facility/`,
                                                        query: { id: params.data.county, level: 'county' }
                                                    })
                                                }}
                                                > View Facilities </button>
                                            },}])}}>
										<ListItemText primary="Facilities by Owners" />
									</ListItemButton>

                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('owner_categories'); setColumns([
                                            {headerName: "Owner", field: "owner",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Number of Facilities", field: "facilities"},
                                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                                onClick={() => {
                                                    router.push({
                                                        pathname: `/reports/by_facility/`,
                                                        query: { id: params.data.county, level: 'county' }
                                                    })
                                                }}
                                                > View Facilities </button>
                                            },}])}}>
										<ListItemText primary="Facilities by Owner Categories" />
									</ListItemButton>
                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('facility_type'); setColumns([
                                            {headerName: "Facility Type", field: "facility_type",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Number of Facilities", field: "facilities"},
                                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                                onClick={() => {
                                                    router.push({
                                                        pathname: `/reports/by_facility/`,
                                                        query: { id: params.data.county, level: 'county' }
                                                    })
                                                }}
                                                > View Facilities </button>
                                            },}])}}>
										<ListItemText primary="Facilities by Facility Type" />
									</ListItemButton>

									<ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('keph_level'); setColumns([
                                            {headerName: "Keph Level", field: "keph_level",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Number of Facilities", field: "facilities"},
                                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                                onClick={() => {
                                                    router.push({
                                                        pathname: `/reports/by_facility/`,
                                                        query: { id: params.data.county, level: 'county' }
                                                    })
                                                }}
                                                > View Facilities </button>
                                            },}])}}>
										<ListItemText primary="Keph Levels" />
									</ListItemButton>
                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('facility_coordinates'); setColumns([
                                            {headerName: "Code", field: "code",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Name", field: "name"},
                                            {headerName: "County", field: "county"},
                                            {headerName: "Sub County", field: "sub_county"},
                                            {headerName: "Ward", field: "ward"},
                                            {headerName: "Latitude", field: "lat"},
                                            {headerName: "Longitude", field: "long"},
                                           ])}}>
										<ListItemText primary="Facility Coordinates" />
									</ListItemButton>

                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('officers_in_charge'); setColumns([
                                            {headerName: "Facility Name", field: "facility_name",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Officer Name", field: "officer_name"},
                                            {headerName: "Job Title", field: "job_title"},
                                            {headerName: "Contacts", field: "contacts"},
                                           ])}}>
										<ListItemText primary="Officers In-charge" />
									</ListItemButton>
								</List>
							</Collapse>

							{/* Administrative Offices*/}
							<ListItemButton onClick={handleAdminClick}>
								<ListItemText primary="Administrative Offices" />
								{openAdmin ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse in={openAdmin} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('admin_offices'); setColumns([
                                            {headerName: "County", field: "county",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Sub County", field: "sub_county"},
                                            {headerName: "Name", field: "first_name"},
                                            {headerName: "National", field: "national"},
                                            {headerName: "Phone Number", field: "phone_number"},
                                            {headerName: "Email", field: "email"},
                                           ])}}>
										<ListItemText primary="Admin Offices" />
									</ListItemButton>
									
								</List>
							</Collapse>
                                {/* Administrative Offices*/}
							<ListItemButton onClick={handleCHUClick}>
								<ListItemText primary="Community Health Units" />
								{openCHUs ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse in={openCHUs} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									
                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('chu_count'); setColumns([
                                            {headerName: "County", field: "county",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Number of Community Health Units", field: "CHUs"},
                                            {headerName: "Number of CHVs", field: "CHVs"},
                                            {headerName: "Number of CHEWs", field: "CHEWs"},
                                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                                onClick={() => {
                                                    router.push({
                                                        pathname: `/reports/by_facility/`,
                                                        query: { id: params.data.county, level: 'county' }
                                                    })
                                                }}
                                                > View CHUs </button>
                                            },}
                                           ])}}>
										<ListItemText primary="Community Health Units Count" />
									</ListItemButton>
								</List>
								<List component="div" disablePadding>
									
                                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('chu_status'); setColumns([
                                            {headerName: "Status", field: "status",   cellRenderer: "LinkCellRenderer"},
                                            {headerName: "Number of Community Health Units", field: "CHUs"},
                                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                                onClick={() => {
                                                    router.push({
                                                        pathname: `/reports/by_facility/`,
                                                        query: { id: params.data.county, level: 'county' }
                                                    })
                                                }}
                                                > View CHUs </button>
                                            },}
                                           ])}}>
										<ListItemText primary="Community Health Units (Status)" />
									</ListItemButton>
								</List>
							</Collapse>
                        </List>
                </div>
                    <main className="col-span-6 md:col-span-6 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        
                          <div className='mx-4'>
                            <form
                                className="inline-flex flex-row flex-grow items-left gap-x-2 py-2 lg:py-0"
                                //   action={path || "/facilities"}
                                >
                                <input
                                    name="q"
                                    id="search-input"
                                    className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                    type="search"
                                    // defaultValue={searchTerm}
                                    placeholder="Search anything ...."
                                />
                                <button
                                    type="submit"
                                    className="bg-white border-2 border-black text-black flex items-center justify-center px-4 py-1 rounded"
                                >
                                    <SearchIcon className="w-5 h-5" />
                                </button>
                                <div className='text-white text-md'>

                                <button className="flex items-center bg-green-600 text-white rounded justify-start text-center font-medium active:bg-gray-200 p-2 w-full" onClick={() => {
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += '&format=csv' } else { dl_url += '?format=csv' }
                                                console.log('Downloading CSV. ' + dl_url || '')
                                                window.open(dl_url, '_blank', 'noopener noreferrer')
                                                // window.location.href = dl_url
                                            }}
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span>Export</span>
                                </button> 
                                </div>
                           
                                    
                            </form>
                            <h5 className="text-lg font-medium text-gray-800 float-right">
                                {props?.data?.count && props?.data?.count > 0 && <small className="text-gray-500 ml-2 text-base">{props?.data?.start_index || 0} - {props?.data?.end_index || 0} of {props?.data?.count || 0} </small>}
                            </h5>
                          </div>
                        <div className="flex flex-col justify-center items-center px-1 md:px-2 w-full">
                      
                            <div className="ag-theme-alpine" style={{ minHeight: '100vh', width: '100%' }}>
                                <AgGridReact
                                    rowStyle={{width: '100vw'}}
                                    sideBar={true}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: true,
                                    }}
                                    enableCellTextSelection={true}
                                    onGridReady={onGridReady}
                                    rowData={users}
                                    columnDefs={columns}
                                    frameworkComponents={{
                                        LinkCellRenderer
                                      }}
                                    />
                            </div>
                           
                        </div>
                        {users && users.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                <li className="text-base text-gray-600">
                                    <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + props?.data?.current_page}>
                                        <a className="text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline">{props?.data?.current_page}</a>
                                    </Link>
                                </li>
                                {props?.path && props?.data?.near_pages && props?.data?.near_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + page}>
                                            <a className="text-blue-800 p-2 hover:underline active:underline focus:underline">{page}</a>
                                        </Link>
                                    </li>
                                ))}
                                <li className="text-sm text-gray-400 flex">
                                    <DotsHorizontalIcon className="h-3" />
                                </li>

                            </ul>}

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

Users.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 

    const fetchData = (token) => {
        let url = API_URL + '/reporting/?report_type=beds_and_cots_by_county'
        let query = { 'searchTerm': ''}
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }
        // let other_posssible_filters = ["is_active"]

        // other_posssible_filters.map(flt => {
        //     console.log(flt);
        //     if (ctx?.query[flt]) {
        //         query[flt] = ctx?.query[flt]
        //         if (url.includes('?')) {
        //             url += `&${flt}=${ctx?.query[flt]}`
        //         } else {
        //             url += `?${flt}=${ctx?.query[flt]}`
        //         }
        //     }
        // })
        
        let current_url = url + '&page_size=100000'
        if (ctx?.query?.page) {
            console.log({page:ctx.query.page})
            url = `${url}&page=${ctx.query.page}`
        }
        
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                    return {
                        data: json, query, token, path: ctx.asPath || '/users', current_url: current_url 
                    }
                
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/users',
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
                window.location.href = '/users'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/users',
                current_url: ''
            }
        }, 1000);
    })

}

export default Users