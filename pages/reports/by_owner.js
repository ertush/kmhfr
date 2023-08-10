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
import ReportsSideMenu from './reportsSideMenu'


import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const ByOwner = (props) => {
   
    LicenseManager.setLicenseKey("test");
    const router = useRouter()
    

    const [columns, setColumns]= useState([
        {headerName: "Owner", field: "owner_name"}, /*cellRenderer: "LinkCellRenderer"*/
        {headerName: "Beds", field: "beds"},
        {headerName: "Cots", field: "cots"},
        {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
            return <button  className=' bg-blue-600 p-2 text-white flex items-center text-sm font-semibold' 
            onClick={() => {
                router.push({
                    pathname: `/reports/by_facility/`,
                    query: { id: params.data.ward, level: null, type: 'individual_facility_beds_and_cots', name: params?.data?.owner_name }
                })
            }}
            > View Facilities </button>
          },}
    ])
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [facilities, setFacilities]=useState([])
    const [filtered, setFiltered]=useState([])
    const [filterOption, setFilterOption] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [title, setTitle] = useState('Beds and Cots by Owner')
    const [label, setLabel]=useState('beds_cots')

    const onGridReady = (params) => {
        let lnlst =[]
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        if(props.path.includes('level=sub_county')){
            lnlst = props.data.results.map(({area_id,area_name, number_of_facilities})=>{return {area_name, number_of_facilities,area_id }})
        }else if(props.current_url.includes('chu')){
            lnlst = props.data.results.map(({ward_name,ward_id, number_of_units, chvs, chews})=>{return {ward_name,ward_id, number_of_units, chvs, chews}})
        } else{
            lnlst = props.data.results.map(({owner_name ,owner, beds, cots})=>{return {owner_name ,owner, beds, cots}})
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
    // useEffect(() => {
    //     filter(searchTerm)
    //     if(props.path.includes('level=sub_county')){
    //         setTitle('Facility Report by Keph Level')
    //         setLabel('facilities_count')
    //         setColumns([
    //             {headerName: "Keph Level", field: "keph_level_name"},
    //             {headerName: "Beds", field: "beds"},
    //             {headerName: "Cots", field: "cots"},
    //             {headerName: "Actions", cellRendererFramework: function(params) {
    //                 return <button  className=' bg-blue-600 p-2 text-white flex items-center text-sm font-semibold' 
    //                 onClick={() => {
    //                     router.push({
    //                         pathname: `/reports/dynamic_reports/`,
    //                         query: { id: params.data.area_id, level: 'ward', type: 'facilities_count' }
    //                     })
    //                 }}
    //                 > View Facilities </button>
    //               },}
    //         ])
    //     }

    //     if(props.current_url.includes('chu')){
    //         setTitle('Community Health Units Report by Ward')
    //         setLabel('chus_count')
    //         setColumns([
    //             {headerName: "Ward", field: "ward_name",   cellRenderer: "LinkCellRenderer"},
    //             {headerName: "Number of Community Health Units", field: "number_of_units"},
    //             {headerName: "Number of CHVs", field: "chvs"},
    //             {headerName: "Number of CHEWs", field: "chews"},
    //             {headerName: "Actions", cellRendererFramework: function(params) {
    //                 return <button  className=' bg-blue-600 p-2 text-white flex items-center text-sm font-semibold' 
    //                 onClick={() => {
    //                     router.push({
    //                         pathname: `/reports/by_facility/`,
    //                         query: { id: params.data.ward_id, type: 'chu_count', level:'ward' }
    //                     })
    //                 }}
    //                 > View CHUs </button>
    //             },}
    //             ])
    //     }
    // }, [searchTerm, props.path])

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
            case 'keph-level':
                router.push({
                    pathname: `/reports/by_keph_level/`
                })
                break;
            case 'owner':
                router.push({
                    pathname: `/reports/by_owner/`
                })
                break;
            default:
                break;
        }
    },[filterOption])
    
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
                                <a className="text-blue-700" href="/">Home</a> {'/'}
                                <span className="text-gray-500">{title}</span> 
                            </div>
                            <div className={`col-span-5 flex justify-between p-6 w-full bg-transparent drop-shadow  text-black md:divide-x md:divide-gray-200z items-center border border-blue-600 border-l-8 ${'border-blue-600'}`}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    {title}
                                </h2>
                        </div>
                        </div>
                    </div>
                    <ReportsSideMenu />
                    <main className="col-span-6 md:col-sapn-5 flex flex-col gap-4 order-last md:order-none"> 
                        
                          <div className='mx-4'>
                            <form
                                className="inline-flex flex-row flex-grow items-left gap-x-2 py-2 lg:py-0"
                                >
                                <input
                                    name="q"
                                    id="search-input"
                                    className="flex-none bg-transparent  p-2 flex-grow shadow-sm border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                    type="search"
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                    }}
                                    placeholder="Search anything ...."
                                />
                                <button
                                    type="submit"
                                    className="bg-white border-2 border-black text-black flex items-center justify-center px-4 py-1 "
                                >
                                    <SearchIcon className="w-5 h-5" />
                                </button>
                                <div className='text-white text-md'>

                                <button className="flex items-center bg-blue-600 text-white  justify-start text-center font-medium active:bg-gray-200 p-2 w-full" onClick={(e) => {
                                                e.preventDefault()  
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += `&format=excel&access_token=${props.token}` } else { dl_url += `?format=excel&access_token=${props.token}` }
                                                // console.log('Downloading CSV. ' + dl_url || '')
                                                // window.open(dl_url, '_blank', 'noopener noreferrer')
                                                window.location.href = dl_url

                                            }}
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span>Export</span>
                                </button> 
                                </div>
                           
                                    
                            </form>
                            {props.current_url.includes('beds_and_cots') &&
                            <Select
                                options={[
                                    {value: 'county' , label:'Beds and Cots (County)' }, 
                                    {value: 'sub-county', label: 'Beds and Cots (Sub-County)'},
                                    {value: 'ward', label: 'Beds and Cots (Ward)'},
                                    {value: 'keph-level', label: 'Beds and Cots (Keph Level)'},
                                    {value: 'owner', label: 'Beds and Cots (Owner)'}
                                    ] || []}
                                required
                                placeholder='Filter By:'
                                onChange={(e) => setFilterOption(e.value)}
                                name='filter_by'
                                className='flex-none w-1/5 bg-transparent  flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none float-right'
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
                                    /*frameworkComponents={{
                                        LinkCellRenderer
                                      }}*/
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




                    {/* Floating div at bottom right of page */}
                    {/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-blue-50/50 bg-blend-lighten shadow-lg -lg flex flex-col justify-center items-center py-2 px-3">
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

ByOwner.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
   

    const fetchData = async (token) => {

        let sub_county_id= ctx.query.id
        let level = ctx.query.level
        let url = ''

        if(sub_county_id && level !==undefined){
            url =API_URL + `/reporting/?sub_county=${sub_county_id}&report_type=${ctx.query.type}&report_level=${level}`
            
        }else if(ctx.query.type =='beds_and_cots_by_keph_level' && level == undefined){
            url =API_URL + `/reporting/?constituency=${ctx.query.id}&report_type=${ctx.query.type}`

        }else if(ctx.query.type == 'ward'){
            url =API_URL + `/reporting/chul/?report_type=${ctx.query.type}&constituency=${sub_county_id}`
        }else{
            url = API_URL + `/reporting/?report_type=beds_and_cots_by_owner`
        }

        let query = { 'searchTerm': ''}
     
        
        let current_url = url + '&page_size=100000'
        if (ctx?.query?.page) {
       
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
                data: json, query, token, path: ctx.asPath || '/users', current_url: current_url
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

export default ByOwner