import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import React, { useState, useEffect, useContext } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { PlusIcon,UsersIcon } from "@heroicons/react/solid";
import moment from 'moment'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LicenseManager } from '@ag-grid-enterprise/core';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { PermissionContext } from '../../providers/permissions'
import {  hasPermission } from '../../utils/checkPermissions'
import { UserContext } from '../../providers/user'

import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid'
import { styled } from '@mui/material/styles';


const StyledDataGrid = styled(DataGrid)(() => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid rgba(156, 163, 175, 1)`,
        FontFace: 'IBM Plex Sans'
    },
    '& .super-app-theme--Cell': {
        // borderRight: `1px solid rgba(156, 163, 175, 1)`,
        FontFace: 'IBM Plex Sans'

    }
}))


function Users (props) {

    LicenseManager.setLicenseKey("test");


    const userPermissions = useContext(PermissionContext)


    const userCtx = useContext(UserContext)

    const router = useRouter()
   
 
    const rows =  props.data?.results?.map((user) => ( 
        {
            ...user,
            name: user.first_name + ' '+user.last_name,
            employee_number: user.employee_number,
            email: user.email,
            county_name:user.county_name,
            last_login: user.last_login !==null? moment(user.last_login).format('MMM Do YYYY, h:mm a') : "",
            is_active:user.is_active == true ? "Yes" : "No"
        }
    ))
    
    const columns = [
        {headerName: "Name", field: "name",  renderCell: (params) => {
            return(
                <Link
                href={{ pathname: `/user/edit/${params.row.id}`,
                  }} /* query: { id:  } */
                className="cursor-pointer"
        
                ><span className="cursor-pointer text-blue-600">{params.row.name}</span></Link>
                
              
            )} ,flex: 1},   
        {headerName: "Employee number", field: "employee_number", flex: 1},
        {headerName: "Job Title", field: "job_title_name", flex: 1},
        {headerName: "Email", field: "email", flex: 1},
        {headerName: "County", field: "county_name", flex: 1},
        {headerName: "Last login", field: "last_login", flex: 1},
        {headerName: "Active", field: "is_active", flex: 1}
    ]

 
    

    const [usersTheme, setUsersTheme] = useState(true)
    const [inactiveUsersTheme, setInactiveUsersTheme] = useState(false)
    const [groupsTheme, setGroupsTheme] = useState(false)
    const [show, setShow]=useState(false)
    const [showGroup, setShowGroup]=useState(false)
    const [isClient, setIsClient] = useState(false);
        
  

    useEffect(()=>{

        if(!hasPermission(/^users.view_mfluser$/, userPermissions)){
            router.push('/unauthorized')
        }
        
       
        
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
    
    setIsClient(true)
        
    },[])

    if(isClient){
        return (
            <div className="">
                <Head>
                    <title>KMHFR - Reports</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <MainLayout isLoading={false} isFullWidth={false}>
                    {/* {console.log({rows})} */}
                    <div className="w-full grid grid-cols-7 gap-4 p-1 md:mx-4 my-2">
                        <div className="col-span-7 flex flex-col gap-x-1 ">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                                <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                    <Link className="text-blue-700" href="/">Home</Link> {'/'}
                                    <span className="text-gray-500">Users</span> 
                                </div>
                            </div>
                                
                                <Collapse in={show}>{Object.keys(router.query).length > 0 ? <div><Alert severity={router?.query.status} sx={{width:'100%'}} onClose={()=> setShow(false)}>{router?.query.message}</Alert></div>: null}</Collapse>
                                
                                <div className={`col-span-5 flex justify-between w-full bg-transparent drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 items-center border border-blue-600 border-l-8  ${'border-blue-600'} `}>
                                    <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                        <UsersIcon className='ml-2 h-5 w-5'/> 
                                        {'Manage Users'}
                                    </h2>
                                    <button className=' bg-blue-600 p-2 text-white flex items-center text-lg font-semibold'
                                    onClick={() => {router.push('/user/add')}} 
                                    >
                                        {`Add User `}
                                        <PlusIcon className='text-white ml-2 h-5 w-5'/>
                                    </button>
                            
                            </div>
                        </div>


                        <div className='col-span-1 w-full col-start-1 h-auto py-0 bg-gray-50 shadow-md'>
                            
                            <List
                            sx={{ width: '100%', bgcolor: 'transparent', flexGrow:1, paddingTop:0, paddingBottom:0}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            
                            >	
                                <ListItemButton className='border-b border-gray-300' sx={{
                                backgroundColor: usersTheme && '#2563eb',
                                                color: usersTheme && '#ffff',
                                                borderBottom: 'solid 1px rgba(107, 114, 128, 1)', 
                                                "&:hover": {
                                                backgroundColor: "#eff6ff",
                                                color: "rgba(17, 24, 39, 1)"
                                                }
                                }} name="rt"
                                    onClick={()=>{
                                        setUsersTheme(true)
                                        setInactiveUsersTheme(false)
                                        setGroupsTheme(false)
                                        router.push('/user?is_active=true')
                                    
                                    }}
                                >
                                    <ListItemText primary="Users" />
                                </ListItemButton>
                                
                                <ListItemButton 
                                    sx={{
                                        backgroundColor: inactiveUsersTheme && '#2563eb',
                                        color: inactiveUsersTheme && '#ffff',
                                        borderBottom: 'solid 1px rgba(107, 114, 128, 1)', 
                                        "&:hover": {
                                        backgroundColor: "#eff6ff",
                                        color: "rgba(17, 24, 39, 1)"
                                        }
                                        }} 
                                    onClick={()=>{
                                        setUsersTheme(false)
                                        setInactiveUsersTheme(true)
                                        setGroupsTheme(false)
                                        router.push('/user?is_active=false')
                                    
                                    }}
                                >
                                    <ListItemText primary="InActive Users" />
                                </ListItemButton>
                                {!showGroup && 
                                <ListItemButton 
                                sx={{
                                        backgroundColor: groupsTheme && '#2563eb',
                                                color: groupsTheme && '#ffff',
                                                borderBottom: 'solid 1px rgba(107, 114, 128, 1)', 
                                                "&:hover": {
                                                backgroundColor: "#eff6ff",
                                                color: "rgba(17, 24, 39, 1)"
                                                }
                                    }}
                                    onClick={()=>{
                                        setUsersTheme(false)
                                        setInactiveUsersTheme(false)
                                        setGroupsTheme(true)
                                        router.push('/user/groups')
                                    
                                    }}
                                >
                                    <ListItemText primary="Groups" sx={{fontFamily:'IBM Plex Sans'}}/>
                                </ListItemButton>}
                                    
                            </List>

                        </div>
                        <main className="col-span-6 md:col-span-6 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                            
                            
                            <div className="flex flex-col justify-center items-center w-full shadow-md" style={{backgroundColor:"#eff6ff"}}>
                            
                                <div className='w-full h-auto'>
                                <StyledDataGrid
                                            columns={columns}
                                            rows={rows}
                                            getRowClassName={() => `super-app-theme--Row`}
                                            rowSpacingType="border"
                                            showColumnRightBorder
                                            showCellRightBorder
                                            rowSelection={false}
                                            getCellClassName={() => 'super-app-theme--Cell'}
                                            slots={{
                                                toolbar: () => (
                                                    <GridToolbar
                                                        sx={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            marginX: 'auto',
                                                            gap: 5,
                                                            padding: '0.45rem'
                                                        }}
                                                    />
                                                ),
                                            }}
                                        />
                                    
                                </div>
                            </div>
                        

                        </main>
                        
                    </div>
                </MainLayout >
            </div>
        )
    }
    else{
        return null
    }
}   

Users.getInitialProps = async (ctx) => {

    ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )
      
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
// console.log(ctx.query.is_active);

    const fetchData = (token) => {
        let url = API_URL + '/users/?fields=id,first_name,last_name,email,last_login,is_active,employee_number,county_name,job_title_name,sub_county_name&is_active=true&page=1&page_size=1000'
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
                        data: json, query, token, path: ctx.asPath || '/user', current_url: current_url 
                    }
                
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/user',
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
                window.location.href = '/user'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/user',
                current_url: ''
            }
        }, 1000);
    })

}

export default Users