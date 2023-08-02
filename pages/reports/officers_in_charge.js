import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from '@ag-grid-enterprise/core';
import ReportsSideMenu from './reportsSideMenu'


import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const OfficersInCharge = (props) => { 
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter()
    const LinkCellRenderer = (params) =>{
        return(
            <Link
            href={{ pathname: `/reports/by_county/`,
            query: { id: params.data.sub_county } }}
    
            ><a>{params.value}</a></Link>
        )}

    const [columns, setColumns]=useState([
        {headerName: "Facility Name", field: "facility_name",   cellRenderer: "LinkCellRenderer"},
        {headerName: "Officer Name", field: "officer_name"},
        {headerName: "Job Title", field: "job_title"},
        {headerName: "Contacts", field: "contacts"},
     ])
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [Officers, setOfficers]=useState([])
    let label = 'officers_in_charge'

     
    const lnlst = props.data.results.map(({facility_name, officer_name, job_title, contacts})=>{return {facility_name, officer_name,  job_title, contacts: contacts.map(c=>{return c.contact_type +': ' + c.contact}).join(',')}})
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        
        setOfficers(lnlst)
        updateData(lnlst)
    };
   gridApi?.setRowData(lnlst)

    return (
        <div className="">
            <Head>
                <title>KMHFR - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-8 gap-4 p-1 md:mx-4 my-2">
                    <div className="col-span-8 flex flex-col gap-x-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-green-700" href="/">Home</a> {'/'}
                                <span className="text-gray-500">Facility Officers</span> 
                            </div>
                            <div className={`col-span-5 flex justify-between p-6 w-full bg-transparent drop-shadow  text-black md:divide-x md:divide-gray-200z items-center border border-green-600 border-l-8 ${'border-green-600'}`}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    {'Facility Officers'}
                                </h2>
                        </div>
                        </div>
                    </div>
                    {/* list */}
                    <ReportsSideMenu />
                    
                    <main className="col-span-6 md:col-sapn-5 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        
                          <div className='mx-4'>
                            <form
                                className="inline-flex flex-row flex-grow items-left gap-x-2 py-2 lg:py-0"
                                >
                                <div className='text-white text-md'>

                                <button className="flex items-center bg-green-600 text-white  justify-start text-center font-medium active:bg-gray-200 p-2 w-full" onClick={() => {
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += `&format=excel&access_token=${props.token}` } else { dl_url += `?format=excel&access_token=${props.token}` }
                                                console.log('Downloading CSV. ' + dl_url || '')
                                                // window.open(dl_url, '_blank', 'noopener noreferrer')
                                                window.location.href = dl_url
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
                                    rowData={Officers}
                                    columnDefs={columns}
                                    frameworkComponents={{
                                        LinkCellRenderer
                                      }}
                                    />
                            </div>
                        </div>
                        {Officers && Officers.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                <li className="text-base text-gray-600">
                                    <Link href={props.path + (props.path.includes('?') ? '&page=' : '/?page=') + props?.data?.current_page}>
                                        <a className="text-gray p-2 hover:underline active:underline focus:underline">{'Page' + ' '+ props?.data?.current_page + ' '+ 'of' + ' ' +props?.data.total_pages}</a>
                                    </Link>
                                </li>
                                {props?.path && props?.data?.near_pages && props?.data?.near_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <Link href={(props.path.includes('?') ?(props.path.includes('page=')? props?.path.replace(/page=\d+/, 'page=' + (page)): null) : props.path + `?page=${page}`)}>
                                            <a className="text-blue-800 p-2 hover:underline active:underline focus:underline">{page}</a>
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

OfficersInCharge.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
    
    const fetchData = async (token) => {
        let url = API_URL + `/facilities/facility_officers/`

        let query = { 'searchTerm': ''}
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }
        
        let current_url = url + '&page_size=100000'
        if (ctx?.query?.page) {
            
            url = `${url}?page=${ctx.query.page}`
        }
        
        try {
            const r = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            })
            const json = await r.json()
            return {
                data: json, query, token, path: ctx.asPath || '/reports/officers_in_charge', current_url: current_url
            }
        } catch (err) {
            console.log('Error fetching facilities: ', err)
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/reports/officers_in_charge',
                current_url: ''
            }
        }
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
                window.location.href = '/reports/officers_in_charge'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/reports/officers_in_charge',
                current_url: ''
            }
        }, 1000);
    })

}

export default OfficersInCharge
