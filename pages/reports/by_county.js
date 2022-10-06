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


const ByCounty = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter()
    const LinkCellRenderer = (params) =>{
        let query = null
        props.path.includes('facility_count_by_county') ? query = { id: params.data.area_id, type:'facility_count_by_county',level:'sub_county' }  
        :  props.current_url.includes('chul')? query = { id: params.data.sub_county_id, type:'ward' }  
        :  query= {id: params.data.sub_county, type:'beds_and_cots_by_ward'}
        return(
            <Link
            href={{ pathname: `/reports/by_ward/`,
            query: query }}
    
            ><a>{params.value}</a></Link>
        )}
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [facilities, setFacilities]=useState([])
    const [filtered, setFiltered]=useState([])
    const [filterOption, setFilterOption] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [title, setTitle]=useState('Beds and Cots by Sub County')
    const [label, setLabel]=useState('beds_cots')
         
    const [columns, setColumns]=useState([
        {headerName: "Sub County", field: "sub_county_name", cellRenderer: "LinkCellRenderer"},
        {headerName: "Beds", field: "beds"},
        {headerName: "Cots", field: "cots"},
        {headerName: "Actions", cellRendererFramework: function(params) {
            return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
            onClick={() => {
                router.push({
                    pathname: `/reports/by_facility/`,
                    query: { id: params.data.sub_county, level: 'sub_county', type: 'ndividual_facility_beds_and_cots' }
                })
            }}
            > View Facilities </button>
          },}
    ])
  
    const onGridReady = (params) => {
        let lnlst =[]
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        if(props.path.includes('level=county')){
            lnlst = props.data.results.map(({area_id,area_name, number_of_facilities})=>{return {area_name, number_of_facilities,area_id }})
        }else if(props.current_url.includes('chu')){
            lnlst = props.data.results.map(({sub_county_name,sub_county_id, number_of_units, chvs, chews})=>{return {sub_county_name, sub_county_id, number_of_units, chvs, chews}})
        } else{
            lnlst = props.data.results.map(({sub_county_name,sub_county,beds,cots})=>{return {sub_county_name, sub_county,beds,cots }})
        }
     
        setFacilities(lnlst)
        updateData(lnlst)
    };

    const filterField = (search, value) => value?.toString().toLowerCase().includes(search.toLowerCase());
    const filter =(searchTerm)=>{
        if (searchTerm !== '' && searchTerm.length > 3) {
            const filteredData = facilities.filter((row) => {
                return Object.keys(row).some((field) => {
                    return filterField(searchTerm, row[field]);
                });
            });
            setFiltered(filteredData);
        } else {
            setFiltered(facilities);
        }
            
    }
    useEffect(() => {
        filter(searchTerm)
        if(props.path.includes('level=county')){
            setTitle('Facility Report by Sub County')
            setLabel('facilities_count')
            setColumns([
                {headerName: "Sub County", field: "area_name",   cellRenderer: "LinkCellRenderer"},
                {headerName: "Number of Facilities", field: "number_of_facilities"},
                {headerName: "Actions", cellRendererFramework: function(params) {
                    return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                    onClick={() => {
                        router.push({
                            pathname: `/reports/dynamic_reports/`,
                            query: { id: params.data.area_id, level: 'sub_county', type: 'facilities_count' }
                        })
                    }}
                    > View Facilities </button> 
                  },}
            ])
           }
        if(props.current_url.includes('chu')){
            setTitle('Community Health Units Report by Sub-County')
            setLabel('chus_count')
            setColumns([
                {headerName: "Sub county", field: "sub_county_name",   cellRenderer: "LinkCellRenderer"},
                {headerName: "Number of Community Health Units", field: "number_of_units"},
                {headerName: "Number of CHVs", field: "chvs"},
                {headerName: "Number of CHEWs", field: "chews"},
                {headerName: "Actions", cellRendererFramework: function(params) {
                    return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                    onClick={() => {
                        router.push({
                            pathname: `/reports/by_facility/`,
                            query: { id: params.data.sub_county_id, level: 'sub_county', type:'chu_count' }
                        })
                    }}
                    > View CHUs </button>
                },}
                ])
        }
    }, [searchTerm, props.path])

    useEffect(()=>{
        switch (filterOption) {
            case 'county':
                router.push({
                    pathname: `/reports/static_reports/`
                })
                break;
            case 'sub-county':
                router.push({
                    pathname: `/reports/by_county/`
                })
                break;
            case 'ward':
                router.push({
                    pathname: `/reports/by_ward/`
                })
                break;
            default:
                break;
        }
    },[filterOption])

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
                                <span className="text-gray-500">{title}</span> 
                            </div>
                            <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    {title}
                                </h2>
                        </div>
                        </div>
                    </div>
                    {/* list */}
                    <Resources label={label}/>
                    
                    <main className="col-span-6 md:col-span-6 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        
                          <div className='mx-4'>
                            <form
                                className="inline-flex flex-row flex-grow items-left gap-x-2 py-2 lg:py-0"
                                >
                                <input
                                    name="q"
                                    id="search-input"
                                    className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                    type="search"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search anything ...."
                                />
                                <button
                                    type="submit"
                                    className="bg-white border-2 border-black text-black flex items-center justify-center px-4 py-1 rounded"
                                >
                                    <SearchIcon className="w-5 h-5" />
                                </button>
                                <div className='text-white text-md'>

                                <button className="flex items-center bg-green-600 text-white rounded justify-start text-center font-medium active:bg-gray-200 p-2 w-full" onClick={(e) => {
                                               e.preventDefault()
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += '&format=excel' } else { dl_url += '?format=excel' }
                                                console.log('Downloading CSV. ' + dl_url || '')
                                                // router.push(dl_url, undefined, { shallow: true })
                                                window.open(dl_url, '_blank', 'noopener noreferrer')
                                                // window.location.href = dl_url
                                            }}
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span>Export</span>
                                </button> 
                                </div>
                           
                                    
                            </form>
                            {props.current_url.includes('beds_and_cots') &&
                            <Select
                                options={[{value:'county' , label:'Beds and Cots (County)' }, {value: 'sub-county', label: 'Beds and Cots (Sub-County)'},{value: 'ward', label: 'Beds and Cots (Ward)'}] || []}
                                required
                                placeholder='Filter By:'
                                onChange={(e) => setFilterOption(e.value)}
                                name='filter_by'
                                className='flex-none w-1/5 bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none float-right'
                            />}
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
                                    rowData={filtered}
                                    columnDefs={columns}
                                    frameworkComponents={{
                                        LinkCellRenderer
                                      }}
                                    />
                            </div>
                        </div>
                        {facilities && facilities.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
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
    
    console.log(ctx.query)
    const fetchData = async (token) => {
        let county_id= ctx.query.id
        let level = ctx.query.level
        let url = ''

        if(county_id && level !==undefined){
            url =API_URL + `/reporting/?county=${county_id}&report_type=${ctx.query.type}&report_level=${level}`
            
        }else if(ctx.query.type =='beds_and_cots_by_constituency' && level == undefined){
            url =API_URL + `/reporting/?county=${county_id}&report_type=${ctx.query.type}`

        }else if(ctx.query.type == 'sub_county'){
            url =API_URL + `/reporting/chul/?report_type=${ctx.query.type}&county=${county_id}`
        }else{
            url = API_URL + `/reporting/?report_type=beds_and_cots_by_constituency`
        }
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
        
        try {
            const r = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            })
            const json = await r.json()
            return {
                data: json, query, level:level, token, path: ctx.asPath || '/users', current_url: current_url
            }
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

export default ByCounty