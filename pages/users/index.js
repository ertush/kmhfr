import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useState, useEffect, useContext } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { SearchIcon, DotsHorizontalIcon,PlusIcon,UsersIcon } from "@heroicons/react/solid";
import moment from 'moment'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from '@ag-grid-enterprise/core';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { PermissionContext } from '../../providers/permissions'
import {  hasPermission } from '../../utils/checkPermissions'
import { UserContext } from '../../providers/user'


const Users = (props) => {

    LicenseManager.setLicenseKey("test");


    const userPermissions = useContext(PermissionContext)


    const userCtx = useContext(UserContext)

    const router = useRouter()
    console.log(router.query.status);
    console.log(Object.keys(router.query).length)
    const LinkCellRenderer = (params) =>{
    return(
        <Link
        href={{ pathname: `/users/user/`,
        query: { id: params.data.id } }}

        ><span>{params.value}</span></Link>
    )} 

    let columnDefs= [
        {headerName: "Name", field: "name",   cellRenderer: "LinkCellRenderer"},
        {headerName: "Employee number", field: "employee_number"},
        {headerName: "Email", field: "email"},
        {headerName: "County", field: "county_name"},
        {headerName: "Last login", field: "last_login"},
        {headerName: "Active", field: "is_active"}
    ]

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [users, setUsers]=useState([])
    const [usersTheme, setUsersTheme] = useState(true)
    const [inactiveUsersTheme, setInactiveUsersTheme] = useState(false)
    const [groupsTheme, setGroupsTheme] = useState(false)
    const [show, setShow]=useState(false)
    const [showGroup, setShowGroup]=useState(false)
        
    const onGridReady = (params) => {
     
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        const lnlst=  props.data.results.map((user)=>{
            return {
                ...user,
                name: user.first_name + ' '+user.last_name,
                employee_number: user.employee_number,
                email: user.email,
                county_name:user.county_name,
                last_login: user.last_login !==null? moment(user.last_login).format('MMM Do YYYY, h:mm a') : "",
                is_active:user.is_active == true ? "Yes" : "No"
            }
            
        })
        // console.log(lnlst);
     
        setUsers(lnlst)
        updateData(lnlst)
    };

    useEffect(()=>{

        if(!hasPermission(/^users.view_mfluser$/, userPermissions)){
            router.push('/unauthorized')
        }
        
        const lnlst=  props.data?.results?.map((user)=>{
            return {
                ...user,
                name: user.first_name + ' '+user.last_name,
                employee_number: user.employee_number,
                email: user.email,
                county_name:user.county_name,
                last_login: user.last_login !==null? moment(user.last_login).format('MMM Do YYYY, h:mm a') : "",
                is_active:user.is_active == true ? "Yes" : "No"
            }
            
        })
        setUsers(lnlst)
        if( Object.keys(router.query).length > 0 && router.query.status !== undefined){
            setShow(true)
        }

    },[props.data.results, router.query])

    useEffect(()=>{
    if(userCtx){
        if(userPermissions.find((r)=> r === 'auth.add_group') == undefined) setShowGroup(true)
    }
    else {
        router.push('/auth/login')
    }
    
        
    },[])
    return (
        <div className="">
            <Head>
                <title>KMHFR - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1 md:mx-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1 ">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                <Link className="text-green-700" href="/">Home</Link> {'/'}
                                <span className="text-gray-500">Users</span> 
                            </div>
                        </div>
                            
                           <Collapse in={show}>{Object.keys(router.query).length > 0 ? <div><Alert severity={router?.query.status} sx={{width:'100%'}} onClose={()=> setShow(false)}>{router?.query.message}</Alert></div>: null}</Collapse>
                            
                            <div className={`col-span-5 flex justify-between w-full bg-transparent drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 items-center border border-green-600 border-l-8  ${'border-green-600'} `}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    <UsersIcon className='ml-2 h-5 w-5'/> 
                                    {'Manage Users'}
                                </h2>
                                <button className=' bg-green-600 p-2 text-white flex items-center text-lg font-semibold'
                                onClick={() => {router.push('/users/user')}} 
                                >
                                    {`Add User `}
                                    <PlusIcon className='text-white ml-2 h-5 w-5'/>
                                </button>
                        
                        </div>
                    </div>
                    <div className='col-span-1 w-full col-start-1 h-auto border border-green-600'>
						
                        <List
                        sx={{ width: '100%', bgcolor: 'transparent', flexGrow:1 }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                       
                        >	
                            <ListItemButton className='border-b border-green-600' sx={{
                            backgroundColor: usersTheme && 'rgba(5, 150, 105,  1)',
											color: usersTheme && '#ffff',
											borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
											"&:hover": {
											backgroundColor: "rgba(255, 251, 235, 1)",
											color: "rgba(17, 24, 39, 1)"
										  }
                            }} name="rt"
                                onClick={()=>{
                                    setUsersTheme(true)
                                    setInactiveUsersTheme(false)
                                    setGroupsTheme(false)
                                    router.push('/users?is_active=true')
                                
                                }}
                            >
                                <ListItemText primary="Users" />
                            </ListItemButton>
                            <ListItemButton 
                                sx={{
                                    backgroundColor: inactiveUsersTheme && 'rgba(5, 150, 105,  1)',
                                                    color: inactiveUsersTheme && '#ffff',
                                                    borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
                                                    "&:hover": {
                                                    backgroundColor: "rgba(255, 251, 235, 1)",
                                                    color: "rgba(17, 24, 39, 1)"
                                                  }
                                    }} 
                                onClick={()=>{
                                    setUsersTheme(false)
                                    setInactiveUsersTheme(true)
                                    setGroupsTheme(false)
                                    router.push('/users?is_active=false')
                                
                                }}
                            >
                                <ListItemText primary="InActive Users" />
                            </ListItemButton>
                            {!showGroup && 
                            <ListItemButton 
                            sx={{
                                backgroundColor: groupsTheme && 'rgba(5, 150, 105,  1)',
                                                color: groupsTheme && '#ffff',
                                                borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
                                                "&:hover": {
                                                backgroundColor: "rgba(255, 251, 235, 1)",
                                                color: "rgba(17, 24, 39, 1)"
                                              }
                                }}
                                onClick={()=>{
                                    setUsersTheme(false)
                                    setInactiveUsersTheme(false)
                                    setGroupsTheme(true)
                                    router.push('/users/groups')
                                
                                }}
                            >
                                <ListItemText primary="Groups"/>
                            </ListItemButton>}
                                
                        </List>
                </div>
                    <main className="col-span-6 md:col-span-6 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        
                          <div className='mx-4'>
                            <form
                                className="inline-flex flex-row flex-grow items-left "
                                //   action={path || "/facilities"}
                                >

                                 <input
                                    name="q"
                                    id="search-input"
                                    type="search"
                                    defaultValue={''}
                                    placeholder="Search a facility/CHU..."
                                    className="flex-none bg-transparent p-2 md:w-6/12 md:flex-grow-0 flex-grow shadow-sm border border-green-600 placeholder-gray-600  focus:shadow-none focus:ring-black focus:border-black outline-none"
                                />
                                <button
                                    type="submit"
                                className="bg-transparent border-t border-r border-b border-green-600 text-black flex items-center justify-center px-4 py-1"
                                    
                                >
                                    <SearchIcon className="w-5 h-5 text-green-600" />
                                </button>
                                <div className='text-white text-md'>

                                <button className="flex items-center ml-4 bg-green-600 text-white  justify-start text-center font-medium active:bg-gray-200 p-2 w-full" onClick={() => {
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += `&format=csv&access_token=${props.token}` } else { dl_url += `?format=csv&access_token=${props.token}` }
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
                        <div className="flex flex-col justify-center items-center px-1 w-full">
                      
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
                        </div>
                        {users && users.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full border border-green-600 items-center justify-end my-2">
                                <li className="text-base text-green-500">
                                    <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + props?.data?.current_page}>
                                        <span className="text-white bg-green-600 font-semibold px-2 py-1 ">{props?.data?.current_page}</span>
                                    </Link>
                                </li>
                                {props?.path && props?.data?.near_pages && props?.data?.near_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + page}>
                                            <span className="text-green-800 p-2 hover:underline active:underline focus:underline">{page}</span>
                                        </Link>
                                    </li>
                                ))}
                                <li className="text-sm text-gray-400 flex">
                                    <DotsHorizontalIcon className="h-3" />
                                </li>

                            </ul>}

                    </main>




                    {/* Floating div at bottom right of page */}
                    {/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg -lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 1000 results.
                        </p>
                    </div> */}
                  
                </div>
            </MainLayout >
        </div>
    )
}   

Users.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
// console.log(ctx.query.is_active);

    const fetchData = (token) => {
        let url = API_URL + '/users/?fields=id,first_name,last_name,email,last_login,is_active,employee_number,county_name,job_title_name,sub_county_name&is_active=true'
        let query = { 'searchTerm': ''}
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }
        let other_posssible_filters = ["is_active"]

        other_posssible_filters.map(flt => {
         
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                if (url.includes('?')) {
                    url += `&${flt}=${ctx?.query[flt]}`
                } else {
                    url += `?${flt}=${ctx?.query[flt]}`
                }
            }
        })
        
        let current_url = url + '&page_size=100000'
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