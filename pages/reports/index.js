import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useEffect, useState, useContext } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { SearchIcon, DotsHorizontalIcon } from "@heroicons/react/solid";
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from '@ag-grid-enterprise/core';
import Select from 'react-select'; 
import Resources from './resources'
import { UserContext } from '../../providers/user'

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import tailwindConfig from '../../tailwind.config'


const Users = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter()

    const userCtx = useContext(UserContext)

    const LinkCellRenderer = (params) =>{
        let reportType =''
        let countyID = ''
        // console.log(params.data);
        if(params.data.hasOwnProperty('facilities')){
            reportType = 'facility_count_by_county'
            countyID = params.data.area_id
        }
        if(params.data.hasOwnProperty('beds')){
            reportType = 'beds_and_cots_by_constituency'
            countyID = params.data.county
        }
        // console.log(countyID);
        return(
            <Link
            href={{ pathname: `/reports/by_county/`,
            query: { id: countyID, type:reportType } }}
    
            ><span>{params.value}</span></Link>
        )}

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [users, setUsers]=useState([])
    const [filtered, setFiltered]=useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('');
    let label = 'facilities_count';



    const [columns]=useState([
        {headerName: "County", field: "county_name",   cellRenderer: "LinkCellRenderer"},
        {headerName: "Beds", field: "beds"},
        {headerName: "Cots", field: "cots"},
        {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
          
            return <button  className=' bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
            onClick={() => {
                router.push({
                    pathname: `/reports/by_facility/`,
                    query: { id: params.data.county, level: 'county', type: 'individual_facility_beds_and_cots', name: params?.data?.county_name }
                })
            }}
            > View Facilities </button>
          },}
    ])

    const onGridReady = (params) => {
     
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        const lnlst=  props?.data?.results?.map((county_beds)=>{
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

    const filterField = (search, value) => value?.toString().toLowerCase().includes(search.toLowerCase());
    const filter =(searchTerm)=>{
        if (searchTerm !== '' && searchTerm.length > 3) {
            const filteredData = users.filter((row) => {
                return Object.keys(row).some((field) => {
                    return filterField(searchTerm, row[field]);
                });
            });
            setFiltered(filteredData);
        } else {
            setFiltered(users);
        }
            
    }
    useEffect(() => {
        filter(searchTerm)
    }, [searchTerm])

    useEffect(()=>{
        switch (filterOption) {
            case 'county':
                router.push({
                    pathname: `/reports/standard_reports/`
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
// console.log(filterOption)
    useEffect(() => {
        if(!userCtx){
            router.push('/auth/login')
        }
    },[])

    return (
        <div className="">
            <Head>
                <title>KMHFL - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1  my-2">
                    <div className="col-span-7 flex flex-col gap-x-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-green-900" href="/">Home</a> {'/'}
                                <span className="text-gray-500">Reports</span> 
                            </div>
                            <div className={"col-span-5 flex justify-between w-full bg-django-green border drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-green-900 capitalize gap-2'>
                                    {'Beds and Cots Report by County'}
                                    </h2>
                                
                            </div>
                        </div>
                    </div>

                    {/* Search input & filters  */}
                    <div className='container col-span-7 w-full flex justify-between items-center'>
                            <form
                                className="gap-x-6 py-2 lg:py-0 w-full inline-flex"
                                >
                                <input
                                    // name="q"
                                    id="search-input"
                                    className="bg-transparent w-2/6 p-2 border border-green-600 shadow-sm placeholder-green-900 focus:shadow-none focus:bg-django-green focus:border-black outline-none"
                                    type="search"
                                    // defaultValue={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search anything ...."
                                />
                        
                             
                                <button className="flex items-center bg-green-600  text-white text-center font-medium active:bg-gray-200 p-2" onClick={() => {
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
                        
                               
                            </form>


                           
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
                                styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      backgroundColor: tailwindConfig.theme.color['django-green'],
                                      outLine:'none',
                                      border:'none',
                                      outLine:'none',
                                      textColor: tailwindConfig.theme.color['django-green']
                                    })}}
                                name='filter_by'
                                className='w-1/5 border bg-transparent focus:outline-green-600 border-green-600 placeholder-gray-500  outline-none'
                            />
                                   
                                   
                    </div>

                    {/* Side Menu */}
                    <Resources label={label}/>

                    <main className="col-span-5 md:col-span-5 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                               
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
                        {users && users.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                <li className="text-base text-gray-600">
                                    <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + props?.data?.current_page}>
                                        <span className="text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline">{props?.data?.current_page}</span>
                                    </Link>
                                </li>
                                {props?.path && props?.data?.near_pages && props?.data?.near_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + page}>
                                            <span className="text-blue-800 p-2 hover:underline active:underline focus:underline">{page}</span>
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