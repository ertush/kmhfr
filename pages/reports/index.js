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
import { Box } from '@material-ui/core';

import { propsToGridData } from './reportsData';

const StyledDataGrid = styled(DataGrid)(() => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid ${darken('rgba(5, 150, 105, 1)', 1)}`,
        FontFace: 'IBM Plex Sans'
    },
    '& .super-app-theme--Cell': {
        borderRight: `1px solid ${darken('rgba(5, 150, 105, 0.4)', 0.2)}`,
        FontFace: 'IBM Plex Sans'

    }
}))



function Reports(props) {

    console.log({ props })

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
                            <Link className="text-blue-700" href="/">
                                Home
                            </Link>
                            {"/"}
                            <Link className="text-blue-700" href="/reports">
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
                                `col-span-5 mt-4 grid grid-cols-6 gap-5  md:gap-8 py-6 w-full bg-transparent border ${"border-blue-600"} drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 
                ${"border-blue-600"}
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
                    <div className='w-full col-span-1 md:col-span-7 flex border border-blue-600 px-0 mx-0 h-700 flex-1'>
                    <Tabs.Root
                        orientation="horizontal"
                        className="w-full flex flex-col tab-root"
                        defaultValue="facilities"
                    >
                        <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-blue-600">
                                    {/* Facilities Tab */}
                                    <Tabs.Tab
                                        id={1}
                                        value="facilities"
                                        className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                        onClick={() => null}
                                    >
                                        Facility Reports
                                    </Tabs.Tab>
                                    {/* CHUs Tab */}
                                    <Tabs.Tab
                                        id={2}
                                        value="chus"
                                        className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                        onClick={() => null}
                                    >
                                        Community Health Unit Reports
                                    </Tabs.Tab>
                        </Tabs.List>
                        {/* Facility Reports*/}
                        <Tabs.Panel
                        value="facilities"
                        className="grow-1 tab-panel"
                        >
                            <Tabs.Root
                                orientation="horizontal"
                                className="w-full flex flex-col tab-root"
                                defaultValue="beds_cots"
                            >
                                
                                <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-blue-600">
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
                                    {/* Beds and Cots Data Grid */}

                                    <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                        <StyledDataGrid
                                            columns={propsToGridData(props, 0).columns}
                                            rows={propsToGridData(props, 0)?.rows}
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
                                    className="grow-1 tab-panel"
                                    
                                >
                                    {/* Keph Level Data grid */}

                                    <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                        <StyledDataGrid
                                            columns={propsToGridData(props, 1).columns}
                                            rows={propsToGridData(props, 1)?.rows}
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
                                    value="facility_ownership"
                                    className="grow-1 tab-panel"

                                >
                                    {/* Facility Ownership */}
                                    <div style={{ height: 700, width:'100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                        
                                        <StyledDataGrid
                                            columns={propsToGridData(props, 2).columns}
                                            rows={propsToGridData(props, 2)?.rows}
                                            getRowClassName={() => `super-app-theme--Row`}
                                            rowSpacingType="border"
                                            showColumnRightBorder
                                            sx={{overflowX:'scroll'}}
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
                                    value="facility_type"
                                    className="grow-1 tab-panel"

                                >
                                    {/* Facility Type */}

                                    <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                        <StyledDataGrid
                                            columns={propsToGridData(props, 3).columns}
                                            rows={propsToGridData(props, 3)?.rows}
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
                                    value="regulatory_body"
                                    className="grow-1 tab-panel"
                                >
                                    {/* Regulatory Body  */}                                  
                                    
                                    <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                        <StyledDataGrid
                                            columns={propsToGridData(props, 4).columns}
                                            rows={propsToGridData(props, 4)?.rows}
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
                                    value="services"
                                    className="grow-1 tab-panel"
                                >
                                    {/* Services */}                                  
                                    
                                    <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                        <StyledDataGrid
                                            columns={propsToGridData(props, 5).columns}
                                            rows={propsToGridData(props, 5)?.rows}
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
                                    value="infrastructure"
                                    className="grow-1 tab-panel"
                                >
                                    {/* Infrastructure */}                                  
                                    
                                    <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                        <StyledDataGrid
                                            columns={propsToGridData(props, 6).columns}
                                            rows={propsToGridData(props, 6)?.rows}
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
                            title       value="human_resources"
                                    className="grow-1 tab-panel"
                                >

                                </Tabs.Panel>
                                <Tabs.Panel
                                    value="geocodes"
                                    className="grow-1 tab-panel"
                                >

                                </Tabs.Panel>


                            </Tabs.Root>
                        </Tabs.Panel>
                        {/* Community Units Reports */}
                        <Tabs.Panel
                         value="chus"
                         className="grow-1 tab-panel"
                        >

                            <Tabs.Root
                                orientation="horizontal"
                                className="w-full flex flex-col tab-root"
                                defaultValue="chu_services"
                            >
                                
                                <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-blue-600">
                                    <Tabs.Tab
                                    id={1}
                                    value="chu_services"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    >
                                    CHU Services
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                    id={2}
                                    value="chu_status"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    >
                                    CHU Status
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                    id={3}
                                    value="chu_count"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    >
                                    CHU Count
                                    </Tabs.Tab>
                                        
                                   
                                </Tabs.List>

                                {/* CHU Services Data Grid */}
                                <Tabs.Panel
                                value="chu_services"
                                className="grow-1 tab-panel"
                                >

                                </Tabs.Panel>
                                {/* CHU Status Data Grid*/}

                                <Tabs.Panel
                                value="chu_status"
                                className="grow-1 tab-panel"
                                >

                                </Tabs.Panel>

                                {/* CHU Count Data Grid */}

                                <Tabs.Panel
                                value="chu_count"
                                className="grow-1 tab-panel"
                                >

                                </Tabs.Panel>

                               </Tabs.Root> 

                        </Tabs.Panel>
                    </Tabs.Root>
                    </div>



                </div>
            </MainLayout>
        </div>
    )
}

Reports.getInitialProps = async (ctx) => {

    const reports = [
        'beds_and_cots_by_all_hierachies',
        'facility_keph_level_report_all_hierachies',
        'facility_owner_report_all_hierachies',
        'facility_type_report_all_hierachies',
        'facility_regulatory_body_report_all_hierachies',
        'facility_services_report_all_hierachies',
        'facility_infrastructure_report_all_hierachies',
        'chul_status_all_hierachies',
        'gis',
        'chul_services_all_hierachies'
    ];

    const allReports = [];


    return checkToken(ctx.req, ctx.res).then(async (t) => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token;
            let url = '';

            // return fetchData(token).then(t => t);

            for (let i = 0; i < reports.length; i++) {
                const report = reports[i];
                switch (report) {
                    case 'beds_and_cots_by_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })


                            allReports.push({ beds_and_cots_by_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                beds_and_cots_by_all_hierachies: [],
                                url
                            });
                        }

                        break;
                    case 'facility_keph_level_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;

                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_keph_level_report_all_hierachies: (await _data.json()).results })


                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                facility_keph_level_report_all_hierachies: [],
                            });
                        }
                        break;
                    case 'facility_owner_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_owner_report_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                facility_owner_report_all_hierachies: [],
                            });
                        }

                        break;
                    case 'facility_type_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_type_report_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                facility_type_report_all_hierachies: [],
                            })
                        }

                        break;
                    case 'facility_regulatory_body_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_regulatory_body_report_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                facility_regulatory_body_report_all_hierachies: [],
                            })
                        }

                        break;
                    case 'facility_services_report_all_hierachies':
                            url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;
    
    
                            try {
    
                                const _data = await fetch(url, {
                                    headers: {
                                        Authorization: 'Bearer ' + token,
                                        Accept: 'application/json',
                                    },
                                })
    
                                allReports.push({ facility_services_report_all_hierachies: (await _data.json()).results })
    
                            }
                            catch (err) {
                                console.log(`Error fetching ${report}: `, err);
                                allReports.push({
                                    error: true,
                                    err: err,
                                    facility_services_report_all_hierachies: [],
                                })
                            }
    
                            break;
                    case 'facility_infrastructure_report_all_hierachies':
                                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;
        
        
                                try {
        
                                    const _data = await fetch(url, {
                                        headers: {
                                            Authorization: 'Bearer ' + token,
                                            Accept: 'application/json',
                                        },
                                    })
        
                                    allReports.push({ facility_infrastructure_report_all_hierachies: (await _data.json()).results })
        
                                }
                                catch (err) {
                                    console.log(`Error fetching ${report}: `, err);
                                    allReports.push({
                                        error: true,
                                        err: err,
                                        facility_infrastructure_report_all_hierachies: [],
                                    })
                                }
        
                                break;
                    case 'chul_status_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ chul_status_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                chul_status_all_hierachies: [],
                            })
                        }
                        break;
                    case 'chul_services_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ chul_services_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                chul_services_all_hierachies: [],
                            })
                        }
                        break;

                    case 'gis':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ gis: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                gis: [],
                            })
                        }
                        break;
                    
                    case 'chul_services_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/chul/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ chul_services_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                chul_services_all_hierachies: [],
                            })
                        }
                        break;
                    case 'chul_status_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/chul/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ chul_status_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                chul_status_all_hierachies: [],
                            })
                        }
                        break;
                    case 'chul_count_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/chul/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ chul_count_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                chul_count_all_hierachies: [],
                            })
                        }
                        break;


                }
            }

            return allReports
        }
    })
        .catch((err) => {
            console.log('Error checking token: ', err);
            if (typeof window !== 'undefined' && window) {
                if (ctx?.asPath) {
                    window.location.href = ctx?.asPath;
                } else {
                    window.location.href = '/reports';
                }
            }
            setTimeout(() => {
                return {
                    error: true,
                    err: err,
                    data: [],
                };
            }, 1000);
        });

}

export default Reports