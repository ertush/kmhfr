import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useState, useEffect } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { SearchIcon, DotsHorizontalIcon,PlusIcon,UsersIcon } from "@heroicons/react/solid";
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from '@ag-grid-enterprise/core';
import Select from 'react-select'; 
import Resources from './resources'

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const AdminOffices = (props) => { 
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
        {headerName: "County", field: "county_name",   cellRenderer: "LinkCellRenderer"},
        {headerName: "Sub County", field: "sub_county_name"},
        {headerName: "Name", field: "name"},
        {headerName: "National", field: "is_national"},
        {headerName: "Phone Number", field: "phone_number"},
        {headerName: "Email", field: "email"},
        ])
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [AdminOffices, setAdminOffices]=useState([])
    const [sub_counties, setSubcounties] = useState([])
    const [wards, setWards]=useState([])
     
    let filters_county = { county: props?.filters['county']}
    let [drillDown, setDrillDown] = useState({county:'', sub_county:'', ward:''})
    let label ='admin_offices'
     
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        const lnlst = props.data.results.map(({county_name, sub_county_name, name, is_national, phone_number, email})=>{return {county_name, sub_county_name, name, is_national: is_national ==true ? 'Yes' : 'No', phone_number, email}})
        
        setAdminOffices(lnlst)
        updateData(lnlst)
    };

    const filter = (e) => {
        e.preventDefault()
        try {
            fetch(`/api/common/submit_form_data/?path=admin_offices&drilldown=${JSON.stringify(drillDown)}`, {
				headers:{
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json;charset=utf-8'
					
				},
				method:'GET',
			})
			.then(resp =>resp.json())
			.then(res => {
                const results =  res.results.map(({county_name, sub_county_name, name, is_national, phone_number, email})=>{return {county_name, sub_county_name, name, is_national: is_national ==true ? 'Yes' : 'No', phone_number, email}})
                setAdminOffices(results)
                
			})
			.catch(e=>console.log(e))
        }
        catch(err) {
            console.error('Error posting facility basic details: ', err)
            return {
                error: true,
                err: err.message,
                api_url:API_URL
            }
        }
    }
    
    useEffect(() => {
        if(drillDown.county){
            const results = props?.filters['sub_county'].filter(county => county.county == drillDown.county)
            setSubcounties({sub_county: results})
        }
        if(drillDown.sub_county){
           const results = props?.filters['ward'].filter(county => county.sub_county == drillDown.sub_county)
           setWards({ward: results})
        }
        localStorage.setItem('dd_owners', JSON.stringify( drillDown));
    }, [drillDown])

    console.log(props.current_url);
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
                                <span className="text-gray-500">Admin Offices</span> 
                            </div>
                            <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    {'Admin Offices'}
                                </h2>
                        </div>
                        </div>
                    </div>
                    {/* list */}
                    <Resources label={label}/>
                    
                    <main className="col-span-6 md:col-span-6 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        
                    <div className="w-full flex flex items-center justify-start space-x-3 mb-3">
                            {filters_county && Object.keys(filters_county).length > 0 &&
                                Object.keys(filters_county).map(ft => (
                                    <div key={ft} className="w-1/5 max-w-xs flex flex-col items-start justify-start mb-3">
                                        <label htmlFor={ft} className="text-gray-600 capitalize font-semibold text-sm ml-1">{ft.split('_').join(' ')}:</label>
                                        <Select name={ft} defaultValue={drillDown[ft] || "national"} id={ft} className="w-full max-w-xs p-1 rounded bg-gray-50"
                                            options={
                                                (() => {
                                                    
                                                        let opts = [...Array.from(filters_county[ft] || [],
                                                            
                                                            fltopt => {
                                                                if (fltopt.id != null && fltopt.id.length > 0) {
                                                                    return {
                                                                        value: fltopt.id, label: fltopt.name 
                                                                    }
                                                                }
                                                            })]
                                                        return opts
                                                    
                                                })()
                                            }
                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                            onChange={sl => {
                                                let nf = {}
                                                if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                    nf[ft] = sl.value
                                                } else {
                                                    delete nf[ft]
                                                }
                                                setDrillDown({ ...drillDown, ...nf })
                                            }} />
                                    </div>
                                ))}
                            
                            {sub_counties && Object.keys(sub_counties).length > 0 &&
                                Object.keys(sub_counties).map(ft => (
                                    <div key={ft} className="w-1/5 max-w-xs flex flex-col items-start justify-start mb-3">
                                        <label htmlFor={ft} className="text-gray-600 capitalize font-semibold text-sm ml-1">{ft.split('_').join(' ')}:</label>
                                        <Select name={ft} defaultValue={drillDown[ft] || "national"} id={ft} className="w-full max-w-xs p-1 rounded bg-gray-50"
                                            options={
                                                (() => {
                                                    
                                                        let opts = [...Array.from(sub_counties[ft] || [],
                                                            
                                                            fltopt => {
                                                                if (fltopt.id != null && fltopt.id.length > 0) {
                                                                    return {
                                                                        value: fltopt.id, label: fltopt.name 
                                                                    }
                                                                }
                                                            })]
                                                        return opts
                                                    
                                                })()
                                            }
                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                            onChange={sl => {
                                                let nf = {}
                                                if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                    nf[ft] = sl.value
                                                } else {
                                                    delete nf[ft]
                                                }
                                                setDrillDown({ ...drillDown, ...nf })
                                            }} />
                                    </div>
                                ))}
                            
                            {wards && Object.keys(wards).length > 0 &&
                                Object.keys(wards).map(ft => (
                                    <div key={ft} className="w-1/5 max-w-xs flex flex-col items-start justify-start mb-3">
                                        <label htmlFor={ft} className="text-gray-600 capitalize font-semibold text-sm ml-1">{ft.split('_').join(' ')}:</label>
                                        <Select name={ft} id={ft} className="w-full max-w-xs p-1 rounded bg-gray-50"
                                            options={
                                                (() => {
                                                    
                                                        let opts = [...Array.from(wards[ft] || [],
                                                            
                                                            fltopt => {
                                                                if (fltopt.id != null && fltopt.id.length > 0) {
                                                                    return {
                                                                        value: fltopt.id, label: fltopt.name 
                                                                    }
                                                                }
                                                            })]
                                                        return opts
                                                    
                                                })()
                                            }
                                            placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                            onChange={sl => {
                                                let nf = {}
                                                if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                    nf[ft] = sl.value
                                                } else {
                                                    delete nf[ft]
                                                }
                                                setDrillDown({ ...drillDown, ...nf })
                                                let value = sl.value
                                            }} />
                                    </div>
                                ))}
                                 <button className="flex items-center bg-indigo-500 text-white rounded justify-start text-center font-medium active:bg-gray-200 p-2" onClick={(e) => {
                                                filter(e)
                                            }}
                                            >
                                                <span>Filter</span>
                                </button> 
                                <button className="flex items-center bg-indigo-500 text-white rounded justify-start text-center font-medium active:bg-gray-200 p-2" onClick={() => {
                                                setDrillDown({county:'', sub_county:'', ward:''})
                                                setFacilities(props.data.results)
                                                setSubcounties([])
                                                setWards([])
                                                
                                            }}
                                            >
                                                
                                                <span>Clear</span>
                                </button> 
                                <button className="flex items-center bg-green-600 text-white rounded justify-start text-center font-medium active:bg-gray-200 p-2" onClick={(e) => {
                                                e.preventDefault()
                                                let dl_url = props?.current_url
                                                dl_url = dl_url.replace('facilities/facilities', 'facilities/material')
                                                if (dl_url.includes('?')) { dl_url += `&format=excel&county=${drillDown.county}&sub_county=${drillDown.sub_county}&ward=${drillDown.ward}` } else { dl_url += `?format=excel&county=${drillDown.county}&sub_county=${drillDown.sub_county}&ward=${drillDown.ward}` }
                                                console.log('Downloading CSV. ' + dl_url || '')
                                                window.open(dl_url, '_blank', 'noopener noreferrer')
                                            }}
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span>Export</span>
                                </button> 
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
                                    rowData={AdminOffices}
                                    columnDefs={columns}
                                    frameworkComponents={{
                                        LinkCellRenderer
                                      }}
                                    />
                            </div>
                        </div>
                        {AdminOffices && AdminOffices.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
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

AdminOffices.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
    
    const fetchFilters = async token => {
        let filters_url = API_URL + '/common/filtering_summaries/?fields=county,sub_county,ward'
        try {
            const r = await fetch(filters_url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            })
            const jzon = await r.json()
            return jzon
        } catch (err) {
            console.log('Error fetching filters: ', err)
            return {
                error: true,
                err: err,
                filters: [],
                api_url: API_URL
            }
        }
    }
    const fetchData = async (token) => {
        let url = API_URL + `/admin_offices/?report_type=county`

        // if(county_id){
        //     url =API_URL + `/reporting/?county=${county_id}&report_type=${ctx.query.report_type}&report_level=county`
        // }else{
        //     url = API_URL + `/reporting/?report_type=beds_and_cots_by_constituency`
        // }
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
            console.log({page:ctx.query.page})
            url = `${url}&page=${ctx.query.page}`
        }
        
        try {
            const r = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            })
            const json = await r.json()
            return fetchFilters(token).then(ft => {
                return {
                    data: json, query, filters: { ...ft }, token, path: ctx.asPath, tok: token || '/facilities_by_owners', current_url: url, api_url: API_URL
                }
            })
        } catch (err) {
            console.log('Error fetching facilities: ', err)
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/users',
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

export default AdminOffices
