import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../components/MainLayout'
import { DownloadIcon, FilterIcon } from '@heroicons/react/outline'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { checkToken } from '../controllers/auth/auth'
import { useRouter } from 'next/router'
import { CheckBox } from '@mui/icons-material'

import Select from 'react-select'

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
// import { Grid, GridOptions } from '@ag-grid-community/core';
import { LicenseManager, EnterpriseCoreModule } from '@ag-grid-enterprise/core';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const Users = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
 
    // const { data, query, path, current_url } = props
    const router = useRouter()
 
    let filters = props?.filters
    let fltrs = filters


    let qf = props?.query?.qf || 'all'
    // let [currentQuickFilter, setCurrentQuickFilter] = useState(qf)
    let [drillDown, setDrillDown] = useState({})
   
    let headers = [
        "first_name","last_name", "employee_number", "email", "county_name", "last_login", "is_active",
    ]
    let columnDefs= [
        {headerName: "Name", field: "name"},
        {headerName: "Employee number", field: "employee_number"},
        {headerName: "Email", field: "email"},
        {headerName: "County", field: "county_name"},
        {headerName: "Last login", field: "last_login"},
        {headerName: "Active", field: "is_active"}
    ]

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [users, setUsers]=useState([])


    const onGridReady = (params) => {
        console.log({api: params.api});
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);
        console.log(props.data.results);
        const lnlst=  props.data.results.map((user)=>{
            return {
                name: user.first_name + ' '+user.last_name,
                employee_number: user.employee_number,
                email: user.email,
                county_name:user.county_name,
                last_login:user.last_login,
                is_active:user.is_active == true ? "Yes" : "No"
            }
            
        })
     
        setUsers(lnlst)
        updateData(lnlst)
    };

    return (
        <div className="">
            <Head>
                <title>KMHFL - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1 md:px-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-green-700" href="/">Home</a> {'>'}
                                <span className="text-gray-500">Users</span> {'>'}
                            </div>
                           
                        </div>

                    </div>
                    <main className="col-span-7 md:col-span-7 flex flex-col items-center gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        <div className="flex flex-col justify-center items-center px-1 md:px-2 w-full">
                            {/* <pre>{JSON.stringify(props?.data?.results, null, 2)}</pre> */}
                            <div className="ag-theme-alpine" style={{ minHeight: '100vh', width: '100%' }}>
                                <AgGridReact
                                    // floatingFilter={true}
                                    sideBar={true} //{'filters'}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: true,
                                    }}
                                    enableCellTextSelection={true}
                                    onGridReady={onGridReady}
                                    rowData={users}
                                    columnDefs={columnDefs}
                                    />
                            </div>
                        </div>
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

Users.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
    // const fetchFilters = token => {
    //     let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county'

    //     return fetch(filters_url, {
    //         headers: {
    //             'Authorization': 'Bearer ' + token,
    //             'Accept': 'application/json'
    //         }
    //     }).then(r => r.json())
    //         .then(json => {
    //             return json
    //         }).catch(err => {
    //             console.log('Error fetching filters: ', err)
    //             return {
    //                 error: true,
    //                 err: err,
    //                 filters: []
    //             }
    //         })
    // }

    const fetchData = (token) => {
      //  api/users/?fields=id,first_name,last_name,email,last_login,is_active,employee_number,county_name,job_title_name,sub_county_name&is_active=true
        let url = API_URL + '/users/?fields=id,first_name,last_name,email,last_login,is_active,employee_number,county_name,job_title_name,sub_county_name&is_active=true'
        let query = { 'searchTerm': '' }
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }
        // let other_posssible_filters = ["county"]
        // other_posssible_filters.map(flt => {
        //     if (ctx?.query[flt]) {
        //         query[flt] = ctx?.query[flt]
        //         url = url.replace('facilities/facilities', 'facilities/facilities') + "&" + flt + "=" + ctx?.query[flt]
        //     }
        // })
        // let current_url = url + '&page_size=25000' //change the limit on prod
        let current_url = url + '&page_size=50'
        if (ctx?.query?.page) {
            console.log({page:ctx.query.page})
            url = `${url}&page=${ctx.query.page}`
        }
        // console.log('running fetchData(' + url + ')')
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