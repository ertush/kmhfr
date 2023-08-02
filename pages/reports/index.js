import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import { checkToken } from '../../controllers/auth/auth';
import MainLayout from '../../components/MainLayout';
import { darken, styled } from '@mui/material/styles';

import {
    DataGrid,
} from '@mui/x-data-grid';


const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid ${darken('rgba(5, 150, 105, 1)', 1)}`,
        },
    '& .super-app-theme--Cell': {
        borderRight: `1px solid ${darken('rgba(5, 150, 105, 0.4)', 0.2)}`,
        }
}))


function Reports(props) {


    const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

    // const defaultColumnTypes = getGridDefaultColumnTypes();

    console.log({ props })


    return (
        <div className="w-full">
            <Head>
                <title>KMHFR - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1  my-3">
                    {/* Header */}
                    <div className="col-span-1 md:col-span-7 flex-1 flex-col items-start justify-start gap-4">
                        {/* Breadcramps */}
                        <div className="flex flex-row gap-2 text-sm md:text-base md:my-3">
                            <Link className="text-green-700" href="/">
                                Home
                            </Link>
                            {"/"}
                            <span className="text-gray-700" href="/facilities">
                                Reports
                            </span>


                        </div>
                        {/* Header Bunner  */}
                        <div
                            className={
                                `col-span-5 mt-4 grid grid-cols-6 gap-5  md:gap-8 py-6 w-full bg-transparent border ${"border-green-600"} drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 
                ${"border-green-600"}
              `}
                        >
                            <div className="col-span-6 md:col-span-3">
                                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                                    Reports
                                </h1>
                                <div className="flex flex-col gap-1 w-full items-start justify-start">

                                </div>
                            </div>

                        </div>
                    </div>


                    {/* Data grid */}

                    <div style={{ height: 400, width:'100%'}} className='col-span-7 border border-green-600'>
                    <StyledDataGrid
                     
                            
                        columns={[{
                            headerName: 'Class',
                            field: 'class',
                            flex:1
                        },
                        {
                            headerName: 'Model',
                            field: 'model',
                            flex:1
                        },
                        {
                            headerName: 'Id',
                            field: 'id',
                            flex:1
                        },
                        {
                            headerName: 'Name',
                            field: 'name',
                            flex:1
                        }
                        ]}

                        rows={[
                            {
                                class:'A',
                                model:'B21',
                                id:'83928980',
                                name:'Class A',
                                status:'Open',
                                

                            },
                            {
                                class:'B',
                                model:'B21',
                                id:'83921180',
                                name:'Class B'

                            },
                            {
                                class:'C',
                                model:'F21',
                                id:'23424',
                                name:'Class C'

                            },
                            {
                                class:'D',
                                model:'D21',
                                id:'242424',
                                name:'Class D'

                            },
                            {
                                class:'E',
                                model:'A21',
                                id:'239043',
                                name:'Class E'

                            },

                        ]}

                        slotProps={{
                            toolbar: {
                              showQuickFilter: true,
                              quickFilterProps: { debounceMs: 500 },
                            },
                          }}

                        getRowClassName={() => `super-app-theme--Row`}
                        rowSpacingType='border'
                        showColumnRightBorder
                        showCellRightBorder
                        getCellClassName={() => 'super-app-theme--Cell'}
                        showQuickFilter
                        filterMode='server'
                    
                        
                        />
                    </div>

                </div>
            </MainLayout>
        </div>
    )
}

Reports.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const fetchData = (token) => {
        let url = API_URL + '/reporting/?report_type=beds_and_cots_by_all_hierachies'
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

export default Reports