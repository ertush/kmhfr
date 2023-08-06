import { PermissionContext } from '../../providers/permissions'
import { hasPermission } from '../../utils/checkPermissions'
import Link from 'next/link'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useState, useEffect, useContext } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { SearchIcon, DotsHorizontalIcon, PlusIcon } from "@heroicons/react/solid";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from '@ag-grid-enterprise/core';
// next imports
import Head from 'next/dist/shared/lib/head'

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// components imports
import MainLayout from '../../components/MainLayout'


const AdminOffices = (props) => {
    LicenseManager.setLicenseKey("test");
    const router = useRouter()

    const userPermissions = useContext(PermissionContext)

    const lnlst = props?.data?.results?.map(({ id, county_name, sub_county_name, name, is_national, phone_number, email }) => ({ id, county_name, sub_county_name, name, is_national: is_national == true ? 'Yes' : 'No', phone_number, email }))

    useEffect(() => {

        if (hasPermission(/^admin_office.view_.*$/, userPermissions)) { // hasPermission should be negated with !
            router.push('/unauthorized')
        }
    }, [])

    const LinkCellRenderer = (params) => {

        return (
            <button className=' bg-blue-600 p-2 text-white flex items-center text-sm font-semibold'
                onClick={() => {
                    router.push({
                        pathname: `/admin_offices/edit/${params.data.id}`
                    })
                }}
            > View </button>
        )

    }

    const [columns, setColumns] = useState([
        { headerName: "County", field: "county_name" },
        { headerName: "Sub County", field: "sub_county_name" },
        { headerName: "Ofice Name", field: "name" },
        { headerName: "National", field: "is_national" },
        { headerName: "Phone Number", field: "phone_number" },
        { headerName: "Email", field: "email" },
        { headerName: "Actions", field: "actions", cellRenderer: "LinkCellRenderer", }
    ])
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [adminoffices, setAdminoffices] = useState([]);
    const [officeTheme, setOfficeTheme] = useState([]);



    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);



        setAdminoffices(lnlst)
        updateData(lnlst)
    };
    return (
        <div className="">
            <Head>
                <title>KMHFR - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1 md:mx-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-blue-700" href="/">Home</a> {'/'}
                                <span className="text-gray-500">Adminoffices</span>
                            </div>
                            <div className={"col-span-5 flex  justify-between w-full  drop-shadow  text-black p-4 md:divide-x border border-blue-600 md:divide-gray-200z items-center border-l-8 " + (true && "border-blue-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>

                                    {'Admin Offices'}
                                </h2>
                                <button className=' bg-blue-600 p-2 text-white flex items-center text-lg font-semibold'
                                    onClick={() => { router.push('admin_offices/add') }}
                                >
                                    {`Add Admin Office `}
                                    <PlusIcon className='text-white ml-2 h-5 w-5' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 w-full col-start-1 h-auto border border-blue-600'>

                        <List
                            sx={{ width: '100%', bgcolor: 'transparent', flexGrow: 1 }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"

                        >
                            <ListItemButton name="rt"
                                sx={{
                                    backgroundColor: officeTheme && 'rgba(5, 150, 105,  1)',
                                                    color: officeTheme && '#ffff',
                                                    borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
                                                    "&:hover": {
                                                    backgroundColor: "rgba(255, 251, 235, 1)",
                                                    color: "rgba(17, 24, 39, 1)"
                                                  }
                                    }}
                                onClick={() => {
                                    setOfficeTheme(true)
                                    router.push('/admin_office')

                                }}
                            >
                                <ListItemText primary="All Admin Offices" />
                            </ListItemButton>
                        </List>
                    </div>
                    <main className="col-span-6 md:col-span-6 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}

                        <div className='mx-4'>
                            <form
                                className="inline-flex flex-row flex-grow items-left  py-2 lg:py-0"
                            >
                                <input
                                    name="q"
                                    id="search-input"
                                    type="search"
                                    defaultValue={''}
                                    placeholder="Search a facility/CHU..."
                                    className="flex-none bg-transparent p-2 md:w-6/12 md:flex-grow-0 flex-grow shadow-sm border border-blue-600 placeholder-gray-600  focus:shadow-none focus:ring-black focus:border-black outline-none"
                                />
                                <button
                                    type="submit"
                                className="bg-transparent border-t border-r border-b border-blue-600 text-black flex items-center justify-center px-4 py-1"
                                    
                                >
                                    <SearchIcon className="w-5 h-5 text-blue-600" />
                                </button>
                                <div className='text-white ml-4 text-md'>

                                    <button className="flex items-center bg-blue-600 text-white  justify-start text-center font-medium active:bg-gray-200 p-2 w-full" onClick={() => {
                                        let dl_url = props?.current_url
                                        if (dl_url.includes('?')) { dl_url += '&format=csv' } else { dl_url += '?format=csv' }

                                        window.open(dl_url, '_blank', 'noopener noreferrer')

                                    }}
                                    >
                                        <DownloadIcon className="w-4 h-4 mr-1" />
                                        <span>Export</span>
                                    </button>
                                </div>


                            </form>
                            <h5 className="text-lg font-medium text-gray-800 float-right">
                                {props?.data?.count && props?.data?.count > 0 && <small className="text-gray-500 ml-2 text-base">Showing {props?.data?.start_index || 0} - {props?.data?.end_index || 0} of {props?.data?.count || 0} records</small>}
                            </h5>
                        </div>
                        <div className="flex flex-col justify-center items-center px-1 md:px-2 w-full">

                            <div className="ag-theme-alpine" style={{ minHeight: '100vh', width: '100%' }}>
                                <AgGridReact
                                    rowStyle={{ width: '100vw' }}
                                    sideBar={true}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: true,
                                    }}
                                    enableCellTextSelection={true}
                                    onGridReady={onGridReady}
                                    rowData={adminoffices}
                                    columnDefs={columns}
                                    frameworkComponents={{ LinkCellRenderer }}
                                />
                            </div>
                        </div>
                        {adminoffices && adminoffices.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full border border-blue-600 items-center justify-end my-2">
                                <li className="text-base text-blue-500">
                                    <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + props?.data?.current_page}>
                                        <span className="text-white bg-blue-600 font-semibold px-2 py-1 ">{props?.data?.current_page}</span>
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
        let url = API_URL + `/admin_offices/`
        let query = { 'searchTerm': '' }
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
                    data: json, query, filters: { ...ft }, token, path: ctx.asPath, tok: token || '/admin_office', current_url: url, api_url: API_URL
                }
            })
        } catch (err) {
            console.log('Error fetching facilities: ', err)
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/admin_office',
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
                window.location.href = '/admin_office'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/admin_office',
                current_url: ''
            }
        }, 1000);
    })

}


export default AdminOffices