import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useState, useEffect } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { SearchIcon, DotsHorizontalIcon,PlusIcon,UsersIcon } from "@heroicons/react/solid";
import moment from 'moment'
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
import { AddLocationAlt, Article, GroupAdd, LocalHospital, MapsHomeWork, MiscellaneousServices, Phone, ReduceCapacity } from '@mui/icons-material';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const ByCounty = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter()
    const LinkCellRenderer = (params) =>{
        return(
            <Link
            href={{ pathname: `/reports/by_ward/`,
            query: { id: params.data.sub_county } }}
    
            ><a>{params.value}</a></Link>
        )}

    let columnDefs= [
        {headerName: "Sub County", field: "county_name",   cellRenderer: "LinkCellRenderer"},
        {headerName: "Beds", field: "beds"},
        {headerName: "Cots", field: "cots"},
        {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
            return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
            onClick={() => {
                router.push({
                    pathname: `/reports/by_facility/`,
                    query: { id: params.data.sub_county, level: 'sub_county' }
                })
            }}
            > View Facilities </button>
          },}
    ]

	const [openHFR, setOpenHFR] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [users, setUsers]=useState([])
    const [usersTheme, setUsersTheme] = useState(true)
    const [inactiveUsersTheme, setInactiveUsersTheme] = useState(false)
    const [groupsTheme, setGroupsTheme] = useState(false)

	const handleHFRUnitsClick = () => {
		setOpenHFR(!openHFR);
	}
     
    const onGridReady = (params) => {
     
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        const lnlst=  props.data.results.map((county_beds)=>{
            return {
                ...county_beds,
                county_name: county_beds.sub_county_name,
                beds: county_beds.beds,
                cots: county_beds.cots,
                actions: (<a href="#">View</a>)
            }
            
        })
     
        setUsers(lnlst)
        updateData(lnlst)
    };
console.log(users);
    const handleClick =(params)=>{
        console.log(params);
        fetch(`/api/common/submit_form_data/?path=static_report&county=${params}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'GET' 
        })
        .then(res => res.json()).then(res=>{
           const lnlst= res.results.map((sbcty_beds)=>{
                return {
                    ...sbcty_beds,
                    county_name: sbcty_beds.sub_county_name,
                    beds: sbcty_beds.beds,
                    cots: sbcty_beds.cots,
                    actions: (<a href="#">View</a>)
                }
                
            })
            setUsers(lnlst)}
        )
    }

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
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Beds and Cots" />
									</ListItemButton>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Facilities Count"/>
									</ListItemButton>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Facilities by Owners" />
									</ListItemButton>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Facilities by Owner Categories" />
									</ListItemButton>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Keph Levels" />
									</ListItemButton>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Facility Coordinates " />
									</ListItemButton>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Officers In-charge" />
									</ListItemButton>
								</List>
							</Collapse>

							{/* Administrative Offices*/}
							<ListItemButton onClick={handleHFRUnitsClick}>
								<ListItemText primary="Administrative Offices" />
								{openHFR ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse in={openHFR} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Admin Offices" />
									</ListItemButton>
								</List>
							</Collapse>
                                {/* Administrative Offices*/}
							<ListItemButton onClick={handleHFRUnitsClick}>
								<ListItemText primary="Community Health Units" />
								{openHFR ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse in={openHFR} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									<ListItemButton sx={{ ml: 8 }}>
										<ListItemText primary="Community Health Units Count" />
									</ListItemButton>
								</List>
								<List component="div" disablePadding>
									<ListItemButton sx={{ ml: 8 }}>
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
                                    columnDefs={columnDefs}
                                    frameworkComponents={{
                                        LinkCellRenderer
                                      }}
                                    />
                            </div>
                            {/* <div className="ag-theme-alpine" style={{ minHeight: '100vh', width: '100%' }}>
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
                                    columnDefs={columnDefs}
                                    frameworkComponents={{
                                        LinkCellRenderer
                                      }}
                                    />
                            </div> */}
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

ByCounty.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
    console.log(ctx.query);
    const county_id= ctx.query.id
// api/reporting/?report_type=beds_and_cots_by_county - number of beds and cots
    const fetchData = (token) => {
        let url = API_URL + `/reporting/?county=${county_id}&report_type=beds_and_cots_by_constituency`
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

export default ByCounty