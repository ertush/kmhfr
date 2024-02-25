import { PermissionContext } from '../../providers/permissions'
import { hasPermission } from '../../utils/checkPermissions'
import { PencilAltIcon } from '@heroicons/react/outline'
import { useState, useEffect, useContext } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import {  PlusIcon } from "@heroicons/react/solid";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { UserContext } from '../../providers/user';


import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid'

import { styled } from '@mui/material/styles';

// next imports
import Head from 'next/dist/shared/lib/head'

// components imports
import MainLayout from '../../components/MainLayout'


const StyledDataGrid = styled(DataGrid)(() => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid rgba(156, 163, 175, 1)`,
        FontFace: 'IBM Plex Sans'
    },
    '& .super-app-theme--Cell': {
        // borderRight: `1px solid rgba(156, 163, 175, 1)`,
        FontFace: 'IBM Plex Sans'

    }
}))



function AdminOffices(props) {
  
    const router = useRouter()

    const userPermissions = useContext(PermissionContext)
    const userCtx = useContext(UserContext)
    const [isClient, setIsClient] = useState(false)
    
    const groupID = userCtx?.groups[0]?.id

    const rows = props?.data?.results?.map(({ id, county_name, sub_county_name, name, is_national, phone_number, email }) => ({ id, county_name, sub_county_name, name, is_national: is_national == true ? 'Yes' : 'No', phone_number, email })) ?? []
    const columns = [
        { headerName: "County", field: "county_name", flex:1},
        { headerName: "Sub County", field: "sub_county_name", flex:1 },
        { headerName: "Ofice Name", field: "name", flex:1 },
        { headerName: "National", field: "is_national", flex:1 },
        { headerName: "Phone Number", field: "phone_number", flex:1 },
        { headerName: "Email", field: "email", flex:1 },
        { headerName: "Actions", field: "actions", renderCell:(params) => {

            return (
                <button
                variant="contained"
                size="small"
                className="flex flex-row items-center gap-2"
                    onClick={() => {
                        router.push({
                            pathname: `/admin_offices/edit/${params.row.id}`
                        })
                    }}
                > 
                <p className="text-blue-900 font-semibold">Edit</p>
              <PencilAltIcon className="h-5 w-5 text-blue-900"/>
                 </button>
            )
    
        }
    , }
    ]

    const [user, setUser] = useState(userCtx)
  

    useEffect(() => {
        setIsClient(true)
        setUser(userCtx)
        if(user.id === 6){
            router.push('/auth/login')
        }
        
        // if (/*hasPermission(/^admin_office.view_.*$/, userPermissions)*/
        // groupID !== 7 ||
        // groupID !== 5
        //     ) { // hasPermission should be negated with !
        //     router.push('/unauthorized')
        // }
    }, [])
 
    const [officeTheme, setOfficeTheme] = useState([]);


    if(isClient) {
    return (
        <>
            <Head>
                <title>KMHFR - Admin Offices</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 mt-8 gap-4 p-1 md:mx-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-blue-700" href="/">Home</a> {'/'}
                                <span className="text-gray-500">Admin Offices</span>
                            </div>
                            <div className={"col-span-5 flex  justify-between w-full  drop-shadow  text-black p-4 md:divide-x bg-transparent border border-blue-600 md:divide-gray-200 items-center border-l-8 " + (true && "border-blue-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>

                                    {'Admin Offices'}
                                </h2>
                                <button className='bg-blue-600  p-2 text-white flex items-center text-lg font-semibold'
                                    onClick={() => { router.push('admin_offices/add') }}
                                >
                                    {`Add Admin Office `}
                                    <PlusIcon className='text-white ml-2 h-5 w-5' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 w-full col-start-1 h-auto shadow-sm bg-gray-50'>

                        <List
                            sx={{ width: '100%', bgcolor: 'transparent', flexGrow: 1, paddingTop:0, paddingBottom: 0 }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"

                        >
                            <ListItemButton name="rt"
                                sx={{
                                    backgroundColor: officeTheme && '#2563eb',
                                                    color: officeTheme && '#ffff',
                                                    borderBottom: 'solid 1px #2563eb', 
                                                    "&:hover": {
                                                    backgroundColor: "#eff6ff",
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


                        <div className="flex flex-col justify-center items-center px-1 md:px-2 w-full">

                            <div className="shadow-md bg-gray-50" style={{ Height: 'auto', width: '100%' }}>
                               
                                <StyledDataGrid
                                        columns={columns}
                                        rows={rows}
                                        getRowClassName={() => `super-app-theme--Row`}
                                        rowSpacingType="border"
                                        showColumnRightBorder
                                        showCellRightBorder
                                        rowSelection={false}
                                        // getCellClassName={() => 'super-app-theme--Cell'}
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
                        </div>
                        

                    </main>




                </div>
            </MainLayout >
        </>
    )
    } 
    else {
        return null
    }
}

AdminOffices.getInitialProps = async (ctx) => {

    ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )


    const API_URL = process.env.NEXT_PUBLIC_API_URL


   async function fetchFilters(token){
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

   async function fetchData (token) {
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