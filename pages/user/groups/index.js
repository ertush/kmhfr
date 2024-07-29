import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../../components/MainLayout'
import { useEffect, useState } from 'react'
import { checkToken } from '../../../controllers/auth/auth'
import { useRouter } from 'next/router'
import {  DotsHorizontalIcon,PlusIcon,UsersIcon } from "@heroicons/react/solid";
// import { LicenseManager } from '@ag-grid-enterprise/core';

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


function Groups(props) {

    const router = useRouter()

    const rows = props?.data?.results.map(({id, name})=>{return {id, name}})

    const [isClient, setIsClient] = useState(false);

    const columns= [
        {
            headerName: "Name", 
            field: "name", 
            flex:1,
            renderCell: (params) => {
                return(
                    <Link
                    href={{ pathname: `/user/groups/edit/${params.row.id}` }}
                    className="cursor-pointer"
            
                    ><span className="cursor-pointer text-gray-600">{params.row.name}</span></Link>
                    
                  
                )}
         },
    ]

    useEffect(() => {
        setIsClient(true);
    }, [])


    if(isClient){
    return (
        <div className="">
            <Head>
                <title>KMHFR | Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full  md:w-[85%] md:mx-auto grid grid-cols-7 gap-4 p-1 md:px-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-gray-700" href="/">Home</a> {'/'}
                                <a className="text-gray-700" href="/user/">Users</a> {'/'}
                                <span className="text-gray-500">Groups</span> 
                            </div>
                            
                            <div className={`col-span-5 flex  justify-between p-6 w-full bg-transparent drop-shadow  text-black md:divide-x md:divide-gray-200z items-center border border-gray-600 border-l-8 ${'border-gray-600'} `}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    <UsersIcon className='ml-2 h-5 w-5'/> 
                                    {'Manage Groups'}
                                </h2>
                                <button className=' bg-blue-600 p-2 text-white flex items-center text-lg font-semibold'
                                onClick={() => {router.push('/user/groups/add')}} 
                                >
                                    {`Add Group `}
                                    <PlusIcon className='text-white ml-2 h-5 w-5'/>
                                </button>
                        </div>
                        </div>
                    </div>
                
                    <main className="col-span-7 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        
            
                        <div className="flex-col justify-center items-center w-full mx-4">
                      
                            <div style={{ height:'auto', width: '100%', backgroundColor:'#eff6ff'}} className='shadow-md'>
                               
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

export async function getServerSideProps(ctx) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
// console.log(ctx.query.is_active);

    const fetchData = (token) => {
        let url = API_URL + '/users/groups/?fields=id,name'
        let query = { 'searchTerm': ''}
        let id={'id': ''}
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
                        data: json, query, token, path: ctx.asPath || '/user/groups', current_url: current_url 
                    }
                
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/user/groups',
                    current_url: ''
                }
            })
    }

    const response = (() => checkToken(ctx.req, ctx.res).then(t => {
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
                window.location.href = '/user/groups'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/user/groups',
                current_url: ''
            }
        }, 1000);
    }))()

    return {
        props: response
    }



}

export default Groups