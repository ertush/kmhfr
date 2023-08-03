import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { checkToken } from '../../controllers/auth/auth';
import MainLayout from '../../components/MainLayout';
import * as Tabs from "@radix-ui/react-tabs";
import { darken, styled } from '@mui/material/styles';

import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid';


const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid ${darken('rgba(5, 150, 105, 1)', 1)}`,
        FontFace: 'IBM Plex Sans'
    },
    '& .super-app-theme--Cell': {
        borderRight: `1px solid ${darken('rgba(5, 150, 105, 0.4)', 0.2)}`,
        FontFace: 'IBM Plex Sans'

    }
}))



const propsToGridData = ({ data: { results } }) => {

    const columns = [
        {
            headerName: 'County',
            field: 'county',
            flex: 1
        },
        {
            headerName: 'Sub County',
            field: 'sub_county',
            flex: 1
        },
        {
            headerName: 'Ward',
            field: 'ward',
            flex: 1
        },
        {
            headerName: 'HDU Beds',
            field: 'hdu_beds',
            flex: 1
        },
        {
            headerName: 'ICU Beds',
            field: 'icu_beds',
            flex: 1
        },
        {
            headerName: 'Maternity Beds',
            field: 'maternity_beds',
            flex: 1
        },
        {
            headerName: 'Inpatient Beds',
            field: 'inpatient_beds',
            flex: 1
        },
        {
            headerName: 'Emergency Casualty Beds',
            field: 'emergency_casualty_beds',
            flex: 1
        },
        {
            headerName: 'Cots',
            field: 'cots',
            flex: 1
        },

    ];

    const rows = results.map((
        {
            ward__sub_county__county__name: county,
            ward__sub_county__name: sub_county,
            ward__name: ward,
            number_of_hdu_beds: hdu_beds,
            number_of_icu_beds: icu_beds,
            number_of_maternity_beds: maternity_beds,
            number_of_inpatient_beds: inpatient_beds,
            number_of_emergency_casualty_beds: emergency_casualty_beds,
            cots,

        },
        index
    ) => ({
        county,
        sub_county,
        ward,
        hdu_beds,
        icu_beds,
        maternity_beds,
        inpatient_beds,
        emergency_casualty_beds,
        cots,
        id: index

    }))



    return { rows, columns }



}

function Reports(props) {

    // console.log({ props })

    const [reportTitle, setReportTitle] = useState('Beds and Cots');

    useEffect(() => {
       
    }, [reportTitle])

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
                            <Link className="text-green-700" href="/reports">
                                Reports
                            </Link>
                            {"/"}
                            <span className="text-gray-700" href="/facilities">
                               {reportTitle} Report
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
                                   {reportTitle} Report
                                </h1>
                                <div className="flex flex-col gap-1 w-full items-start justify-start">

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Tabs */}
                    <div className='w-full col-span-1 md:col-span-7 flex border border-green-600 px-0 mx-0 h-700 flex-1'>
                        <Tabs.Root
                            orientation="horizontal"
                            className="w-full flex flex-col tab-root"
                            defaultValue="beds_cots"
                        >
                            <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-green-600">
                                <Tabs.Tab
                                    id={1}
                                    value="beds_cots"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Beds and Cots')}
                                >
                                    Beds and Cots
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={2}
                                    value="keph_level"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Keph Level')}
                                >
                                    Keph Level
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={3}
                                    value="facility_ownership"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Facility Ownership')}
                                >
                                    Facility Ownership
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={4}
                                    value="facility_type"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Facility Type')}
                                >
                                    Facility Type
                                </Tabs.Tab>

                                <Tabs.Tab
                                    id={5}
                                    value="regulatory_body"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Regulatory Body')}
                                >
                                    Regulatory Body
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={6}
                                    value="services"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Services')}
                               >
                                    Services
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={7}
                                    value="infrastructure"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Infrastructure')}
                                >
                                    Infrastructure
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={8}
                                    value="human_resources"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Human Resources')}

                                >
                                    Human resources
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={9}
                                    value="Geo coordinates"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Geo Coordinates')}

                               >
                                    Geo Codes
                                </Tabs.Tab>
                                {/* <Tabs.Tab
                                id={4}
                                value="regulatory_body"
                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                            >
                                Facility Incharge Details
                            </Tabs.Tab> */}

                            </Tabs.List>
                            <Tabs.Panel
                                value="beds_cots"
                                className="grow-1 tab-panel"
                            >
                                {/* Data grid */}

                                <div style={{ height: 700, width: '100%' }} className='col-span-7'>
                                    <StyledDataGrid
                                        columns={propsToGridData(props).columns}
                                        rows={propsToGridData(props)?.rows}
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


                            </Tabs.Panel>
                            <Tabs.Panel
                                value="keph_level"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="facility_ownership"
                                className="grow-1 py-1 px-4 tab-panel"
                            >


                            </Tabs.Panel>
                            <Tabs.Panel
                                value="facility_type"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="regulatory_body"
                                className="grow-1 py-1 px-4 tab-panel"
                            >
                            </Tabs.Panel>
                            <Tabs.Panel
                                value="services"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="infrastructure"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="human_resources"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="geocodes"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>


                        </Tabs.Root>
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